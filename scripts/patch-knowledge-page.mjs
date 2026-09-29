/**
 * Fold /metody into the Baza wiedzy page.
 *
 * The methods essay stays on `page-drupal-49`. Slug becomes `baza-wiedzy`,
 * title becomes "Baza wiedzy". The old hub lead (landing-baza-wiedzy) becomes
 * the hero; the previous hero lead is prepended to the body.
 * Menu: Baza wiedzy points at that page, Czytelnia stays, Metody goes.
 * Homepage tiles that referenced the landing point at the page.
 * Then the landing document is deleted.
 *
 * Idempotent after the first successful run.
 *
 * Usage (from repo root):
 *   pnpm patch:knowledge-page            # write
 *   pnpm patch:knowledge-page -- --dry-run
 */

import { createClient } from "@sanity/client";
import {
  KNOWLEDGE_LANDING_ID,
  knowledgePagePatch,
  knowledgeReferencePatch,
} from "./lib/knowledge-page.mjs";

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

const snapshot = await client.fetch(
  `{
    "pages": *[_type == "page" && slug.current in ["metody", "baza-wiedzy"]]{
      _id,
      title,
      "slug": slug.current,
      section,
      heroLead,
      excerpt,
      body
    },
    "landings": *[_id in [$landingId, "drafts." + $landingId]]{
      _id,
      title,
      lead
    },
    "referrers": *[references($landingId) && _id != $landingId && _id != "drafts." + $landingId]
  }`,
  { landingId: KNOWLEDGE_LANDING_ID },
);

const pages = snapshot.pages ?? [];
const published = pages.find(
  (page) => page.slug === "metody" && !String(page._id).startsWith("drafts."),
);
const already = pages.find(
  (page) => page.slug === "baza-wiedzy" && !String(page._id).startsWith("drafts."),
);

if (published && already && published._id !== already._id) {
  console.error(
    `Both slug metody (${published._id}) and baza-wiedzy (${already._id}) exist. Stop.`,
  );
  process.exit(1);
}

const page = published ?? already;
if (!page) {
  console.error('No page with slug "metody" or "baza-wiedzy".');
  process.exit(1);
}

const landing =
  (snapshot.landings ?? []).find((doc) => doc._id === KNOWLEDGE_LANDING_ID) ?? null;
const pageSet = knowledgePagePatch(page, landing);

const referrerPatches = [];
for (const doc of snapshot.referrers ?? []) {
  const set = knowledgeReferencePatch(doc, { pageId: page._id });
  if (set) referrerPatches.push({ id: doc._id, set });
}

const landingIds = (snapshot.landings ?? []).map((doc) => doc._id);

console.log(
  JSON.stringify(
    {
      dryRun,
      pageId: page._id,
      fromSlug: page.slug,
      pageSet: pageSet
        ? {
            title: pageSet.title,
            slug: pageSet.slug.current,
            heroLead: pageSet.heroLead ?? null,
            prependedBlocks: Array.isArray(pageSet.body)
              ? pageSet.body.length - (page.body?.length ?? 0)
              : 0,
          }
        : null,
      referrers: referrerPatches.map((item) => ({
        id: item.id,
        keys: Object.keys(item.set),
      })),
      deleteLandings: landingIds,
    },
    null,
    2,
  ),
);

if (dryRun) process.exit(0);

if (pageSet) {
  await client.patch(page._id).set(pageSet).commit();
  console.log(`Updated ${page._id}`);
  const draftId = `drafts.${page._id}`;
  const draft = pages.find((item) => item._id === draftId);
  if (draft) {
    const draftSet = knowledgePagePatch(draft, landing) ?? pageSet;
    await client.patch(draftId).set(draftSet).commit();
    console.log(`Updated ${draftId}`);
  }
}

for (const item of referrerPatches) {
  await client.patch(item.id).set(item.set).commit();
  console.log(`Retargeted ${item.id}`);
}

const stillReferenced = await client.fetch(
  `count(*[references($id) && _id != $id && _id != "drafts." + $id])`,
  { id: KNOWLEDGE_LANDING_ID },
);
if (stillReferenced > 0) {
  console.error(
    `landing-baza-wiedzy is still referenced by ${stillReferenced} document(s). Not deleted.`,
  );
  process.exit(1);
}

for (const id of landingIds) {
  await client.delete(id);
  console.log(`Deleted ${id}`);
}

console.log("Baza wiedzy is the methods page. /metody is retired in the dataset.");
