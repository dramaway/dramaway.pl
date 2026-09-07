/**
 * Reshape completed projects onto the existing project IA.
 *
 * Teatr Codzienny → 6 year editions + spectacle outcomes + afterword FoldList
 * TO MI GRA / BOAL IN PRACTICE → no fake editions; FoldList / Columns
 * Wielogłos → archive `project` from leftover `projekty-zakonczone` page
 *
 * Reads current `project` docs (or the leftover page for Wielogłos).
 * Does not run migrate:art-generacje.
 *
 * Usage (from repo root):
 *   pnpm patch:archive-projects -- --dry-run
 *   pnpm patch:archive-projects
 *   pnpm patch:archive-projects -- --force   # rebuild even if already reshaped
 */

import { createClient } from "@sanity/client";
import {
  boalIsFlat,
  reshapeBoalPractice,
  reshapeTeatrCodzienny,
  reshapeToMiGra,
  reshapeWieloglos,
  teatrCodziennyIsFlat,
  toMiGraIsFlat,
} from "./lib/archive-project-reshape.mjs";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (!dryRun && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed unless --dry-run)");
  process.exit(1);
}

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: dryRun ? token || undefined : token,
  useCdn: false,
});

const readClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const PROJECT_PROJECTION = `{
  _id, title, "slug": slug.current, status, featured,
  summary, body, afterword, partners, sponsors,
  "editionCount": count(editions)
}`;

function logDoc(label, patch) {
  const editions = patch.editions?.length ?? 0;
  const outcomes = (patch.editions || []).reduce(
    (n, edition) => n + (edition.outcomes?.length ?? 0),
    0,
  );
  const columns = (patch.body || []).filter((block) => block._type === "textColumns")
    .length;
  console.log(
    `  ${label}: body ${patch.body?.length ?? 0} · afterword ${patch.afterword?.length ?? 0} · editions ${editions} · outcomes ${outcomes} · columns ${columns} · partners ${patch.partners?.length ?? 0}`,
  );
}

async function patchProject(id, fields) {
  if (dryRun) return;
  let next = writeClient.patch(id).set(fields);
  if (!fields.sponsors) next = next.unset(["sponsors"]);
  if (!fields.partners) next = next.unset(["partners"]);
  if (!fields.editions) next = next.unset(["editions"]);
  await next.commit();
}

async function teatrCodzienny() {
  const doc = await readClient.fetch(
    `*[_id == "project-teatr-codzienny"][0] ${PROJECT_PROJECTION}`,
  );
  if (!doc) {
    console.warn("skip teatr-codzienny — no project");
    return;
  }
  let source = doc.body;
  if (!teatrCodziennyIsFlat(source)) {
    if (!force) {
      console.log("skip teatr-codzienny — already has editions (pass --force to rebuild from page)");
      return;
    }
    const page = await readClient.fetch(
      `*[_type == "page" && slug.current == "teatr-codzienny"][0]{ body }`,
    );
    if (!page?.body) {
      console.warn("skip teatr-codzienny --force — source page missing");
      return;
    }
    source = page.body;
  }
  const reshaped = reshapeTeatrCodzienny(source);
  console.log(`${dryRun ? "Would patch" : "Patching"} Teatr Codzienny`);
  logDoc("teatr-codzienny", reshaped);
  await patchProject(doc._id, {
    summary: reshaped.summary,
    body: reshaped.body,
    editions: reshaped.editions,
    afterword: reshaped.afterword,
    partners: reshaped.partners,
  });
}

async function toMiGra() {
  const doc = await readClient.fetch(
    `*[_id == "project-to-mi-gra"][0] ${PROJECT_PROJECTION}`,
  );
  if (!doc) {
    console.warn("skip to-mi-gra — no project");
    return;
  }
  const flat = toMiGraIsFlat(doc.body, doc.afterword);
  if (!flat && !force) {
    console.log("skip to-mi-gra — afterword already split");
    return;
  }
  const source =
    !flat && force
      ? [...(doc.body || []), ...(doc.afterword || [])]
      : doc.body;
  const reshaped = reshapeToMiGra(source);
  console.log(`${dryRun ? "Would patch" : "Patching"} to mi gra`);
  logDoc("to-mi-gra", reshaped);
  await patchProject(doc._id, {
    summary: reshaped.summary,
    body: reshaped.body,
    afterword: reshaped.afterword,
  });
}

async function boalPractice() {
  const doc = await readClient.fetch(
    `*[_id == "project-boal-practice"][0] ${PROJECT_PROJECTION}`,
  );
  if (!doc) {
    console.warn("skip boal-practice — no project");
    return;
  }
  let source = doc.body;
  if (!boalIsFlat(source)) {
    if (!force) {
      console.log("skip boal-practice — already uses Columns");
      return;
    }
    const page = await readClient.fetch(
      `*[_type == "page" && slug.current == "boal-practice"][0]{ body }`,
    );
    if (!page?.body) {
      console.warn("skip boal-practice --force — source page missing");
      return;
    }
    source = page.body;
  }
  const reshaped = reshapeBoalPractice(source);
  console.log(`${dryRun ? "Would patch" : "Patching"} BOAL IN PRACTICE`);
  logDoc("boal-practice", reshaped);
  await patchProject(doc._id, {
    summary: reshaped.summary,
    body: reshaped.body,
  });
}

async function wieloglos() {
  const existing = await readClient.fetch(
    `*[_id == "project-wieloglos"][0] ${PROJECT_PROJECTION}`,
  );
  if (existing && !force) {
    console.log("skip wieloglos — project already exists");
    return;
  }
  const page = await readClient.fetch(
    `*[_type == "page" && slug.current == "projekty-zakonczone"][0]{ _id, body }`,
  );
  if (!page?.body?.length) {
    console.warn("skip wieloglos — leftover page projekty-zakonczone missing");
    return;
  }
  const reshaped = reshapeWieloglos(page.body);
  const doc = {
    _id: "project-wieloglos",
    _type: "project",
    title: reshaped.title,
    slug: { _type: "slug", current: reshaped.slug },
    status: "archive",
    featured: false,
    summary: reshaped.summary,
    body: reshaped.body,
    afterword: reshaped.afterword,
  };
  console.log(
    `${dryRun ? "Would create" : "Creating"} Wielogłos from ${page._id}`,
  );
  logDoc("wieloglos", doc);
  if (dryRun) return;
  await writeClient.createOrReplace(doc);
}

async function main() {
  console.log(
    `Archive projects → ${projectId}/${dataset}${dryRun ? " (dry-run)" : ""}${force ? " --force" : ""} …`,
  );
  await teatrCodzienny();
  await toMiGra();
  await boalPractice();
  await wieloglos();
  console.log("Done.");
}

main().catch((err) => {
  const code = err?.response?.body?.errorCode || err?.statusCode;
  if (code === "SIO-401-ANF" || err?.statusCode === 401) {
    console.error(
      "Write token rejected by Sanity (Session not found).\n" +
        "Create a new API token (Editor) at https://www.sanity.io/manage/project/tr2qdg9j/api#tokens\n" +
        "and replace SANITY_API_WRITE_TOKEN in apps/studio/.env — do not paste it into chat.",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
