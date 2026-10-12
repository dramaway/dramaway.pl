/**
 * Stamp `_key` (and `_type`) on credits groups and rows written by the API.
 *
 * Studio shows "Missing keys" and refuses to edit a list when an item has no
 * `_key`. `pnpm patch:project-credits` (2026-10-07) stored groups and rows
 * without one. This only adds those keys; role text, names, and order stay.
 *
 *   pnpm repair:credit-keys            # dry-run report
 *   pnpm repair:credit-keys -- --write # patch dataset
 */

import { createClient } from "@sanity/client";
import { stampCreditKeys } from "./lib/credits-parse.mjs";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "tr2qdg9j";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const write = process.argv.includes("--write");

if (write && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed for --write)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

/** Portable Text fields that can hold a credits block, and how to patch them. */
function fieldsOf(doc) {
  const fields = [
    { path: "body", blocks: doc.body },
    { path: "afterword", blocks: doc.afterword },
    { path: "bio", blocks: doc.bio },
    { path: "team.body", blocks: doc.team?.body },
    { path: "history.lead", blocks: doc.history?.lead },
  ];
  for (const edition of doc.editions ?? []) {
    if (!edition?._key) continue;
    fields.push({
      path: `editions[_key=="${edition._key}"].body`,
      blocks: edition.body,
      where: edition.title || edition._key,
    });
  }
  return fields;
}

function stampField(blocks) {
  if (!Array.isArray(blocks)) return { blocks, changed: false, lists: 0 };
  let changed = false;
  let lists = 0;
  const next = blocks.map((block) => {
    if (block?._type !== "credits") return block;
    const stamped = stampCreditKeys(block);
    if (stamped === block) return block;
    changed = true;
    lists += 1;
    return stamped;
  });
  return { blocks: changed ? next : blocks, changed, lists };
}

const docs = await client.fetch(
  `*[
    count(body[_type == "credits"]) > 0
    || count(afterword[_type == "credits"]) > 0
    || count(bio[_type == "credits"]) > 0
    || count(editions[].body[_type == "credits"]) > 0
    || count(team.body[_type == "credits"]) > 0
    || count(history.lead[_type == "credits"]) > 0
  ]{
    _id,
    _rev,
    _type,
    "slug": slug.current,
    body,
    afterword,
    bio,
    editions[]{ _key, title, body },
    team { body },
    history { lead }
  }`,
);

let documents = 0;
let lists = 0;

for (const doc of docs) {
  const patch = {};
  let docLists = 0;
  for (const field of fieldsOf(doc)) {
    const result = stampField(field.blocks);
    if (!result.changed) continue;
    patch[field.path] = result.blocks;
    docLists += result.lists;
    const label = doc.slug || doc._id;
    console.log(
      `${label} · ${field.where ? `${field.where} · ` : ""}${field.path}: ${result.lists} credits list(s) missing keys`,
    );
  }
  if (docLists === 0) continue;
  documents += 1;
  lists += docLists;
  if (!write) continue;
  await client.patch(doc._id).set(patch).ifRevisionId(doc._rev).commit();
}

console.log("");
console.log(
  write
    ? `Wrote keys on ${lists} credits list(s) across ${documents} document(s).`
    : `Dry run: ${lists} credits list(s) across ${documents} document(s) need keys. Nothing written.`,
);
