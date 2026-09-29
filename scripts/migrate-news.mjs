/**
 * Turn news that still live as `page` documents (`aktualnosc-` slug) into `news`.
 * Sanity freezes `_type` on an id, so each document is recreated under a new id
 * and the old page is deleted in the same transaction. Nothing may reference it.
 * Public URLs stay `/{slug without prefix}`.
 *
 * Usage (from repo root):
 *   pnpm migrate:news -- --dry-run
 *   pnpm migrate:news
 */

import { createClient } from "@sanity/client";
import { newsSlugFromLegacy, newsTitleFromLegacy } from "./lib/news-migrate.mjs";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (!dryRun && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed unless --dry-run)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: dryRun ? token || undefined : token,
  useCdn: false,
  perspective: "raw",
});

function pairIds(id) {
  const published = id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
  return [published, `drafts.${published}`];
}

const rows = await client.fetch(
  `*[_type == "page" && slug.current match "aktualnosc-*"]`,
);

if (rows.length === 0) {
  console.log("Nothing to migrate — no page still uses an aktualnosc- slug.");
  process.exit(0);
}

const DROP = new Set([
  "_id",
  "_rev",
  "_type",
  "_createdAt",
  "_updatedAt",
  "heroImage",
  "heroLead",
  "heroCtaLabel",
  "heroCtaHref",
  "sections",
]);

/** `_type` is frozen on an id, so the News document needs a new one. */
function replacementId(id) {
  const draft = id.startsWith("drafts.");
  const published = draft ? id.slice("drafts.".length) : id;
  const next = published.startsWith("news-drupal-")
    ? published.replace("news-drupal-", "news-")
    : published.startsWith("news-placeholder-")
      ? published.replace("news-placeholder-", "news-")
      : `news-${published}`;
  return draft ? `drafts.${next}` : next;
}

const planned = [];
for (const row of rows) {
  const slug = newsSlugFromLegacy(row.slug?.current);
  const title = newsTitleFromLegacy(row.title);
  if (!slug) {
    console.error(`Skip ${row._id}: empty slug after stripping the prefix.`);
    continue;
  }
  const except = pairIds(row._id);
  const clash = await client.fetch(
    `*[_type in ["page", "news"] && slug.current == $slug && !(_id in $except)][0]{ _id, _type }`,
    { slug, except },
  );
  if (clash?._id) {
    console.error(
      `Skip ${row._id}: /${slug} is already ${clash._type} ${clash._id}.`,
    );
    continue;
  }
  const refs = await client.fetch(`count(*[references($id)])`, { id: row._id });
  if (refs > 0) {
    console.error(`Skip ${row._id}: ${refs} document(s) still reference it.`);
    continue;
  }
  const nextId = replacementId(row._id);
  const taken = await client.fetch(`*[_id == $id][0]._id`, { id: nextId });
  if (taken) {
    console.error(`Skip ${row._id}: replacement id ${nextId} already exists.`);
    continue;
  }
  const next = { _id: nextId, _type: "news" };
  for (const [key, value] of Object.entries(row)) {
    if (DROP.has(key) || key === "_type") continue;
    next[key] = value;
  }
  next.title = title;
  next.slug = { _type: "slug", current: slug };
  if (!next.publishedAt && row._createdAt) next.publishedAt = row._createdAt;
  planned.push({ id: row._id, nextId, slug, from: row.slug?.current, doc: next });
  console.log(
    `${dryRun ? "Would convert" : "Converting"} ${row._id} → ${nextId}  ${row.slug?.current} → ${slug}`,
  );
}

if (planned.length === 0) {
  console.error("No document could be converted.");
  process.exit(1);
}

if (dryRun) {
  console.log(`Dry run: ${planned.length} page(s) would become news.`);
  process.exit(0);
}

let tx = client.transaction();
for (const row of planned) {
  tx = tx.create(row.doc).delete(row.id);
}
await tx.commit();
console.log(`Converted ${planned.length} page(s) to news.`);
