/**
 * Find and repair flattened Drupal links / video tokens / leftover image
 * markers / leftover HTML entities in plain strings and Portable Text.
 *
 *   pnpm repair:portable-text            # dry-run report
 *   pnpm repair:portable-text -- --write # patch dataset
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  newKey,
  repairBlocks,
  replaceImageMarkers,
  cleanPlainString,
  findTruncatedUrls,
} from "./lib/portable-text-repair.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** Same string as `FALLBACK_HERO.lead` in apps/web/src/lib/homepage-copy.ts */
const FIGMA_HERO_LEAD =
  "DramaWay tworzy projekty teatralne i edukacyjne oparte na metodzie dramy oraz Teatrze Zaangażowanym Społecznie — łącząc pokolenia, społeczności i tematy, o których trudno mówić wprost.";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const write = process.argv.includes("--write");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (write && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed for --write)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: write ? token : undefined,
  useCdn: false,
});

const EXTRACT_PATH = path.join(
  ROOT,
  "apps/web/src/data/extracted/fundacja.json",
);
const FILES_PATH = path.join(ROOT, "apps/web/src/data/extracted/files.json");

function emptyStats() {
  return {
    links: 0,
    videos: 0,
    skipped: 0,
    images: 0,
    missing: 0,
    text: 0,
    truncated: 0,
    strings: 0,
    truncatedUrls: [],
  };
}

function addStats(a, b) {
  return {
    links: (a.links || 0) + (b.links || 0),
    videos: (a.videos || 0) + (b.videos || 0),
    skipped: (a.skipped || 0) + (b.skipped || 0),
    images: (a.images || 0) + (b.images || 0),
    missing: (a.missing || 0) + (b.missing || 0),
    text: (a.text || 0) + (b.text || 0),
    truncated: (a.truncated || 0) + (b.truncated || 0),
    strings: (a.strings || 0) + (b.strings || 0),
    truncatedUrls: [...(a.truncatedUrls || []), ...(b.truncatedUrls || [])],
  };
}

function ptChanged(stats) {
  return Boolean(stats.links || stats.videos || stats.images || stats.text);
}

function ptText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b?._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join("\n");
}

function mediaTokens(html) {
  if (!html) return [];
  const re = /\[\[(\{[\s\S]*?\})\]\]/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      out.push(null);
    }
  }
  return out;
}

function sourceSlug(doc, extract) {
  if (doc._type === "page" && doc._id.startsWith("page-drupal-")) {
    const nid = Number(doc._id.replace("page-drupal-", ""));
    return extract.pages.find((p) => p.nid === nid)?.slug;
  }
  if (doc._type === "person" && doc._id.startsWith("person-drupal-")) {
    const nid = Number(doc._id.replace("person-drupal-", ""));
    return extract.people.find((p) => p.nid === nid)?.slug;
  }
  if (doc._type === "project") return doc.slug;
  return null;
}

function noteTruncated(bag, loc, text) {
  if (typeof text !== "string") return;
  for (const url of findTruncatedUrls(text)) {
    bag.push({ loc, url });
  }
}

function assignCleanString(target, field, value, stats, truncated, loc) {
  if (typeof value !== "string") return false;
  noteTruncated(truncated, loc, value);
  const next = cleanPlainString(value);
  if (next === value) return false;
  target[field] = next;
  stats.strings += 1;
  return true;
}

function assignCleanStringArray(target, field, value, stats, truncated, loc) {
  if (!Array.isArray(value)) return false;
  let changed = false;
  const next = value.map((item, i) => {
    if (typeof item !== "string") return item;
    noteTruncated(truncated, `${loc}[${i}]`, item);
    const cleaned = cleanPlainString(item);
    if (cleaned !== item) changed = true;
    return cleaned;
  });
  if (!changed) return false;
  target[field] = next;
  stats.strings += 1;
  return true;
}

async function buildImageIndex(slug, extract, fileMap, assetByName) {
  if (!slug) return null;
  const item =
    extract.pages.find((p) => p.slug === slug) ||
    extract.people.find((p) => p.slug === slug);
  if (!item) return null;
  const tokens = mediaTokens(item.bodyHtml);
  return tokens.map((token) => {
    if (!token?.fid) return null;
    const meta = fileMap[String(token.fid)];
    const filename = meta?.filename;
    const assetId = filename ? assetByName.get(filename) : null;
    if (!assetId) return null;
    const alt =
      token.attributes?.alt ||
      token.fields?.["field_file_image_alt_text[und][0][value]"] ||
      "";
    return {
      _type: "image",
      _key: newKey(),
      asset: { _type: "reference", _ref: assetId },
      ...(typeof alt === "string" && alt ? { alt } : {}),
    };
  });
}

async function main() {
  const extract = existsSync(EXTRACT_PATH)
    ? JSON.parse(readFileSync(EXTRACT_PATH, "utf8"))
    : null;
  const fileMap = existsSync(FILES_PATH)
    ? JSON.parse(readFileSync(FILES_PATH, "utf8"))
    : {};

  const assets = await client.fetch(
    `*[_type=="sanity.imageAsset"]{ _id, originalFilename }`,
  );
  const assetByName = new Map();
  for (const a of assets) {
    if (a.originalFilename && !assetByName.has(a.originalFilename)) {
      assetByName.set(a.originalFilename, a._id);
    }
  }

  const docs = await client.fetch(`*[
    _type in ["page", "person", "project", "publication", "readingMethod", "siteSettings"]
  ]{
    _id, _type, title, name, role, summary, excerpt, authors,
    partners, sponsors, tagline, footerNote, heroHeading, heroLead, heroCtaLabel,
    "slug": slug.current,
    body, bio, afterword,
    editions
  }`);

  let totals = emptyStats();
  let patched = 0;
  const truncatedReport = [];
  const stringSnippets = [];

  for (const doc of docs) {
    const patch = {};
    let docStats = emptyStats();
    const imagesByIndex = extract
      ? await buildImageIndex(
          sourceSlug(doc, extract),
          extract,
          fileMap,
          assetByName,
        )
      : null;

    const runField = (blocks) => {
      let next = blocks;
      const link = repairBlocks(next);
      next = link.blocks;
      const imgs = replaceImageMarkers(next, imagesByIndex);
      next = imgs.blocks;
      return {
        blocks: next,
        stats: addStats(
          { ...emptyStats(), ...link.stats },
          { ...emptyStats(), ...imgs.stats },
        ),
      };
    };

    const loc = `${doc._type} ${doc.title || doc.name || doc._id}`;

    for (const field of [
      "title",
      "name",
      "role",
      "summary",
      "excerpt",
      "tagline",
      "footerNote",
      "heroHeading",
      "heroCtaLabel",
    ]) {
      if (assignCleanString(patch, field, doc[field], docStats, truncatedReport, `${loc}.${field}`)) {
        stringSnippets.push({
          label: `${loc}.${field}`,
          before: doc[field],
          after: patch[field],
        });
      }
    }

    assignCleanStringArray(
      patch,
      "authors",
      doc.authors,
      docStats,
      truncatedReport,
      `${loc}.authors`,
    );
    assignCleanStringArray(
      patch,
      "partners",
      doc.partners,
      docStats,
      truncatedReport,
      `${loc}.partners`,
    );
    assignCleanStringArray(
      patch,
      "sponsors",
      doc.sponsors,
      docStats,
      truncatedReport,
      `${loc}.sponsors`,
    );

    if (doc._type === "siteSettings" && doc.heroLead !== FIGMA_HERO_LEAD) {
      patch.heroLead = FIGMA_HERO_LEAD;
      stringSnippets.push({
        label: `${loc}.heroLead`,
        before: doc.heroLead,
        after: FIGMA_HERO_LEAD,
      });
      docStats.strings += 1;
    } else {
      assignCleanString(
        patch,
        "heroLead",
        doc.heroLead,
        docStats,
        truncatedReport,
        `${loc}.heroLead`,
      );
    }

    for (const field of ["body", "bio", "afterword"]) {
      if (!Array.isArray(doc[field])) continue;
      noteTruncated(truncatedReport, `${loc}.${field}`, ptText(doc[field]));
      const { blocks, stats } = runField(doc[field]);
      docStats = addStats(docStats, stats);
      if (ptChanged(stats)) patch[field] = blocks;
    }

    if (Array.isArray(doc.editions) && doc.editions.length) {
      let editionChanged = false;
      const editions = doc.editions.map((edition, ei) => {
        let next = edition;
        let localChanged = false;
        const bump = (updated) => {
          next = updated;
          localChanged = true;
        };

        const editionPatch = { ...edition };
        const eLoc = `${loc}.editions[${ei}]`;
        let stringHit = false;
        for (const field of ["title", "years", "theme", "summary"]) {
          if (
            assignCleanString(
              editionPatch,
              field,
              edition[field],
              docStats,
              truncatedReport,
              `${eLoc}.${field}`,
            )
          ) {
            stringHit = true;
            stringSnippets.push({
              label: `${eLoc}.${field}`,
              before: edition[field],
              after: editionPatch[field],
            });
          }
        }
        if (
          assignCleanStringArray(
            editionPatch,
            "partners",
            edition.partners,
            docStats,
            truncatedReport,
            `${eLoc}.partners`,
          )
        ) {
          stringHit = true;
        }
        if (Array.isArray(edition.outcomes)) {
          let outcomesChanged = false;
          const outcomes = edition.outcomes.map((outcome, oi) => {
            const oPatch = { ...outcome };
            let oHit = false;
            const oLoc = `${eLoc}.outcomes[${oi}]`;
            for (const field of ["title", "subtitle", "description"]) {
              if (
                assignCleanString(
                  oPatch,
                  field,
                  outcome[field],
                  docStats,
                  truncatedReport,
                  `${oLoc}.${field}`,
                )
              ) {
                oHit = true;
              }
            }
            if (oHit) {
              outcomesChanged = true;
              return oPatch;
            }
            return outcome;
          });
          if (outcomesChanged) {
            editionPatch.outcomes = outcomes;
            stringHit = true;
          }
        }
        if (stringHit) bump(editionPatch);

        if (Array.isArray(next.body)) {
          noteTruncated(truncatedReport, `${eLoc}.body`, ptText(next.body));
          const { blocks, stats } = runField(next.body);
          docStats = addStats(docStats, stats);
          if (ptChanged(stats)) {
            bump({ ...next, body: blocks });
          }
        }
        if (localChanged) editionChanged = true;
        return next;
      });
      if (editionChanged) patch.editions = editions;
    }

    totals = addStats(totals, docStats);
    const interesting =
      ptChanged(docStats) ||
      docStats.missing ||
      docStats.strings ||
      Object.keys(patch).length;
    if (interesting) {
      console.log(
        `  ${loc}: ${docStats.links} links, ${docStats.videos} videos, ${docStats.images} images, ${docStats.text} text spans, ${docStats.strings} strings` +
          (docStats.missing ? `, ${docStats.missing} missing` : ""),
      );
      if (!write) {
        for (const field of Object.keys(patch)) {
          if (field === "editions") continue;
          if (!Array.isArray(doc[field]) || !Array.isArray(patch[field])) continue;
          const before = ptText(doc[field]);
          const after = ptText(patch[field]);
          if (before === after) continue;
          const snip = (s) => s.replace(/\s+/g, " ").trim().slice(0, 180);
          console.log(`    ${field}: ${snip(before)}`);
          console.log(`         → ${snip(after)}`);
        }
      }
      if (write && Object.keys(patch).length) {
        await client.patch(doc._id).set(patch).commit();
        patched += 1;
      }
    }
  }

  if (stringSnippets.length) {
    console.log(`\nString fields (${stringSnippets.length}):`);
    for (const row of stringSnippets.slice(0, 80)) {
      const snip = (s) =>
        String(s ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 140);
      console.log(`  ${row.label}`);
      console.log(`    ${snip(row.before)}`);
      console.log(`    → ${snip(row.after)}`);
    }
    if (stringSnippets.length > 80) {
      console.log(`  … ${stringSnippets.length - 80} more`);
    }
  }

  const uniqueTruncated = [];
  const seen = new Set();
  for (const row of truncatedReport) {
    const key = `${row.loc}|${row.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueTruncated.push(row);
  }
  if (uniqueTruncated.length) {
    console.log(
      `\nTruncated URLs (report only — do not invent hrefs; ${uniqueTruncated.length}):`,
    );
    for (const row of uniqueTruncated) {
      console.log(`  ${row.loc}: ${row.url}`);
    }
  }

  console.log(
    `\n${write ? "Wrote" : "Dry-run"} — ${totals.links} links, ${totals.videos} videos, ${totals.images} images, ${totals.text} text spans, ${totals.strings} strings` +
      (totals.missing ? `, ${totals.missing} missing` : "") +
      (write ? `, ${patched} documents patched` : " (pass --write to patch)"),
  );
}

main().catch((err) => {
  const code = err?.response?.body?.errorCode || err?.statusCode;
  if (code === "SIO-401-ANF" || err?.statusCode === 401) {
    console.error(
      "Write token rejected. Refresh SANITY_API_WRITE_TOKEN in apps/studio/.env",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
