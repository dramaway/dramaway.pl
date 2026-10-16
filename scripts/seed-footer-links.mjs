/**
 * Seed the footer contact / social links for a first look.
 *
 * Sets `footer.links` on every siteSettings document (published and draft)
 * only when that list is missing or empty, so editor work is kept.
 * Values come from the live site; the editors correct them in Studio.
 *
 * Usage (from repo root):
 *   pnpm seed:footer-links -- --dry-run
 *   pnpm seed:footer-links
 */

import { createClient } from "@sanity/client";

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

const LINKS = [
  { _key: "facebook", _type: "footerLink", service: "facebook", value: "dramaway" },
  {
    _key: "youtube",
    _type: "footerLink",
    service: "youtube",
    value: "https://www.youtube.com/channel/UCqnZ4VG2xTkiTYDbrOLMfEQ",
  },
  { _key: "email", _type: "footerLink", service: "email", value: "biuro@dramaway.pl" },
];

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: token || undefined,
  useCdn: false,
  perspective: "raw",
});

const docs = await client.fetch(
  `*[_type == "siteSettings"]{ _id, "count": count(footer.links) }`,
);

if (!Array.isArray(docs) || docs.length === 0) {
  console.error("No siteSettings document");
  process.exit(1);
}

let changed = 0;

for (const doc of docs) {
  if (doc.count > 0) {
    console.log(`skip ${doc._id} (${doc.count} link(s) already)`);
    continue;
  }
  changed += 1;
  console.log(`${dryRun ? "dry-run" : "patch"} ${doc._id} set footer.links`);
  if (dryRun) continue;
  await client
    .patch(doc._id)
    .setIfMissing({ footer: {} })
    .set({ "footer.links": LINKS })
    .commit();
}

console.log(`${dryRun ? "Would change" : "Changed"} ${changed} document(s) in ${dataset}`);
