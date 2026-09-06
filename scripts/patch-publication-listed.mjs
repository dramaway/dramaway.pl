/**
 * One-shot: set listed=true on every publication that is still unlisted.
 *
 * Does not re-run migrate:czytelnia. Does not touch format, methods, or body.
 *
 * Usage (from repo root):
 *   pnpm patch:publication-listed            # write
 *   pnpm patch:publication-listed -- --dry-run
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
  `*[_type == "publication"]{ _id, listed, title }`,
);

const pending = rows.filter((row) => row.listed !== true);

for (const row of pending) {
  console.log(`${dryRun ? "Would list" : "Listing"} ${row._id}  ${row.title}`);
}

if (pending.length === 0) {
  console.log("Nothing to patch — every publication is already listed.");
  process.exit(0);
}

if (dryRun) {
  console.log(`Dry run: ${pending.length} of ${rows.length} would be listed.`);
  process.exit(0);
}

let tx = client.transaction();
for (const row of pending) {
  tx = tx.patch(row._id, { set: { listed: true } });
}
await tx.commit();
console.log(`Wrote listed=true on ${pending.length} of ${rows.length} publications.`);
