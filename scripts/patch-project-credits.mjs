/**
 * Move free-text credits on projects and editions into the `credits` block.
 *
 * Three steps, because `docs/HANDOFF.md` says not to guess roles from colons:
 *   pnpm patch:project-credits -- --scan      read + parse, write the draft, change nothing
 *   (review scripts/project-credits.json by hand)
 *   pnpm patch:project-credits -- --dry-run   diff from the reviewed file
 *   pnpm patch:project-credits               write
 *
 * The draft addresses every run by block `_key`, so a reviewed file stays
 * valid even if the surrounding body is edited in Studio in the meantime.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { newKey } from "./lib/portable-text-repair.mjs";
import {
  blockText,
  findCreditRuns,
  namesRunFromBlock,
  normalizeText,
  parseCreditLine,
  blocksWordBag,
  creditsWordBag,
  missingWords,
  stampCreditKeys,
} from "./lib/credits-parse.mjs";

const DRAFT_PATH = new URL("./project-credits.json", import.meta.url).pathname;

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "tr2qdg9j";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

const scan = process.argv.includes("--scan");
const dryRun = process.argv.includes("--dry-run");

if (!scan && !dryRun && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed unless --scan / --dry-run)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: scan || dryRun,
});

/** Every Portable Text array on a project, with how to patch it back. */
function bodies(project) {
  const out = [
    { field: "body", path: "body", blocks: project.body, label: "body" },
    {
      field: "afterword",
      path: "afterword",
      blocks: project.afterword,
      label: "afterword",
    },
  ];
  (project.editions ?? []).forEach((edition, index) => {
    out.push({
      field: "editions",
      path: `editions[_key=="${edition._key}"].body`,
      blocks: edition.body,
      label: `editions[${index}] ${edition.title ?? edition._key}`,
      editionKey: edition._key,
    });
  });
  return out.filter((entry) => Array.isArray(entry.blocks) && entry.blocks.length > 0);
}

/** Headings whose section is a bare list of people. */
const PEOPLE_HEADING = /zesp[oó][lł]|autor|wsp[oó][lł]prac/i;

/** A plain list of names under a people heading — no roles to read. */
function nameListRuns(blocks) {
  const runs = [];
  blocks.forEach((block, index) => {
    if (block?._type !== "block") return;
    if ((block.style ?? "normal") !== "normal") return;
    const heading = blocks[index - 1];
    if (heading?._type !== "block" || heading.style !== "h2") return;
    if (!PEOPLE_HEADING.test(normalizeText(blockText(heading)))) return;
    const text = normalizeText(blockText(block));
    if (!text || parseCreditLine(text)) return;
    const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 3 || parts.some((part) => part.length > 60)) return;
    const run = namesRunFromBlock(block, null);
    if (run) runs.push(run);
  });
  return runs;
}

function collect(projects) {
  const entries = [];
  for (const project of projects) {
    for (const body of bodies(project)) {
      const runs =
        body.field === "afterword"
          ? [...findCreditRuns(body.blocks), ...nameListRuns(body.blocks)]
          : findCreditRuns(body.blocks);
      for (const run of runs) {
        if (run.replaceKeys.length === 0) continue;
        const source = body.blocks.filter((block) =>
          run.replaceKeys.includes(block._key),
        );
        const lost = missingWords(
          blocksWordBag(source),
          creditsWordBag(run.credits),
        );
        entries.push({
          docId: project._id,
          slug: project.slug?.current ?? project._id,
          where: body.label,
          path: body.path,
          replaceKeys: run.replaceKeys,
          credits: run.credits,
          warnings: [
            ...run.warnings,
            ...(lost.length > 0 ? [`SŁOWA POZA WYKAZEM: ${lost.join(", ")}`] : []),
          ],
        });
      }
    }
  }
  return entries;
}

function report(entries) {
  let rows = 0;
  let flagged = 0;
  for (const entry of entries) {
    const groups = entry.credits.groups ?? [];
    const count = groups.reduce((total, group) => total + (group.rows?.length ?? 0), 0);
    rows += count;
    console.log("");
    console.log(`── ${entry.slug} · ${entry.where}`);
    console.log(
      `   nagłówek: ${entry.credits.heading ?? "(brak)"} · ${groups.length} grup · ${count} wierszy${entry.credits.note ? " · notka" : ""}`,
    );
    for (const group of groups) {
      console.log(`   [${group.title ?? "bez nagłówka"}]`);
      for (const row of group.rows ?? []) {
        const label = row.role ?? row.label ?? "(bez roli)";
        console.log(`     ${label.padEnd(46)} ${row.people}`);
        if (row.note) console.log(`       ↳ ${row.note}`);
      }
    }
    for (const warning of entry.warnings) {
      flagged += 1;
      console.log(`   ⚠ ${warning}`);
    }
  }
  console.log("");
  console.log(
    `Razem: ${entries.length} wykazów, ${rows} wierszy, ${flagged} rzeczy do przejrzenia.`,
  );
}

/** Replace the run of blocks with one credits object, in place. */
function applyEntry(blocks, entry) {
  const indexes = entry.replaceKeys
    .map((key) => blocks.findIndex((block) => block._key === key))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);
  if (indexes.length !== entry.replaceKeys.length) {
    return { ok: false, reason: "nie znaleziono wszystkich bloków (treść zmieniona w Studio?)" };
  }
  const first = indexes[0];
  const last = indexes[indexes.length - 1];
  const span = last - first + 1;
  // Drupal left empty paragraphs between the list and its closing note.
  // Swallow those, but nothing that carries text.
  const strays = blocks
    .slice(first, last + 1)
    .filter((block) => !entry.replaceKeys.includes(block._key));
  const carriesText = strays.some(
    (block) => block._type !== "block" || normalizeText(blockText(block)) !== "",
  );
  if (carriesText) {
    return { ok: false, reason: "między blokami wykazu stoi inna treść" };
  }
  const next = blocks.slice();
  next.splice(first, span, { ...stampCreditKeys(entry.credits), _key: newKey() });
  return { ok: true, blocks: next, removed: span, at: first };
}

const projects = await client.fetch(
  `*[_type == "project"] | order(slug.current asc) { _id, slug, title, body, afterword, editions }`,
);

if (scan) {
  const entries = collect(projects);
  report(entries);
  writeFileSync(
    DRAFT_PATH,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), dataset, entries }, null, 2)}\n`,
    "utf8",
  );
  console.log(`\nSzkic zapisany: scripts/project-credits.json — przejrzyj go przed --dry-run.`);
  process.exit(0);
}

const draft = JSON.parse(readFileSync(DRAFT_PATH, "utf8"));
const byDoc = new Map();
for (const entry of draft.entries ?? []) {
  if (!byDoc.has(entry.docId)) byDoc.set(entry.docId, []);
  byDoc.get(entry.docId).push(entry);
}

let patched = 0;
let skipped = 0;

for (const project of projects) {
  const entries = byDoc.get(project._id) ?? [];
  if (entries.length === 0) continue;

  const patch = {};
  for (const entry of entries) {
    const target =
      entry.path === "body"
        ? project.body
        : entry.path === "afterword"
          ? project.afterword
          : (project.editions ?? []).find((edition) =>
              entry.path.includes(`"${edition._key}"`),
            )?.body;
    if (!Array.isArray(target)) {
      console.log(`✗ ${entry.slug} · ${entry.where}: brak pola`);
      skipped += 1;
      continue;
    }
    const source = target.filter((block) => entry.replaceKeys.includes(block._key));
    const lost = missingWords(blocksWordBag(source), creditsWordBag(entry.credits));
    if (lost.length > 0) {
      console.log(`✗ ${entry.slug} · ${entry.where}: zgubione słowa — ${lost.join(", ")}`);
      skipped += 1;
      continue;
    }
    const current = patch[entry.path] ?? target;
    const result = applyEntry(current, entry);
    if (!result.ok) {
      console.log(`✗ ${entry.slug} · ${entry.where}: ${result.reason}`);
      skipped += 1;
      continue;
    }
    patch[entry.path] = result.blocks;
    const count = (entry.credits.groups ?? []).reduce(
      (total, group) => total + (group.rows?.length ?? 0),
      0,
    );
    console.log(
      `✓ ${entry.slug} · ${entry.where}: ${result.removed} bloków → credits (${count} wierszy) na pozycji ${result.at}`,
    );
    patched += 1;
  }

  if (Object.keys(patch).length === 0) continue;
  if (dryRun) continue;
  await client.patch(project._id).set(patch).commit();
}

console.log("");
console.log(
  dryRun
    ? `Dry run: ${patched} wykazów do zapisania, ${skipped} pominiętych. Nic nie zapisano.`
    : `Zapisano ${patched} wykazów, pominięto ${skipped}.`,
);
