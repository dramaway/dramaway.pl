/**
 * One-shot: remove the retired `page.section` field.
 * Addresses now come from the document type, not this field.
 *
 * Usage (from repo root):
 *   pnpm patch:page-section            # write
 *   pnpm patch:page-section -- --dry-run
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

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: dryRun ? token || undefined : token,
  useCdn: false,
});

const rows = await client.fetch(
  `*[_type == "page" && defined(section)]{ _id, "slug": slug.current, section }`,
);

for (const row of rows) {
  console.log(
    `${dryRun ? "Would unset" : "Unsetting"} ${row._id}  ${row.slug}  (was ${row.section})`,
  );
}

if (rows.length === 0) {
  console.log("Nothing to patch — no page still has section.");
  process.exit(0);
}

if (dryRun) {
  console.log(`Dry run: section would be removed from ${rows.length} pages.`);
  process.exit(0);
}

let tx = client.transaction();
for (const row of rows) {
  tx = tx.patch(row._id, { unset: ["section"] });
}
await tx.commit();
console.log(`Removed section from ${rows.length} pages.`);
