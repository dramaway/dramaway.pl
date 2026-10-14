/**
 * Remove the footer quote and turn the newsletter module on.
 *
 * Unsets `footer.quote` and `footer.attribution` on every siteSettings
 * document (published and draft). Sets `newsletter.enabled` to true only
 * when that boolean is missing, so an explicit false is kept.
 *
 * Usage (from repo root):
 *   pnpm patch:footer-newsletter -- --dry-run
 *   pnpm patch:footer-newsletter
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
  token: token || undefined,
  useCdn: false,
  perspective: "raw",
});

const docs = await client.fetch(
  `*[_type == "siteSettings"]{
    _id,
    "quote": footer.quote,
    "attribution": footer.attribution,
    "enabled": newsletter.enabled
  }`,
);

if (!Array.isArray(docs) || docs.length === 0) {
  console.error("No siteSettings document");
  process.exit(1);
}

let changed = 0;

for (const doc of docs) {
  const unset = [];
  if (doc.quote != null) unset.push("footer.quote");
  if (doc.attribution != null) unset.push("footer.attribution");
  const setEnabled = typeof doc.enabled !== "boolean";

  if (unset.length === 0 && !setEnabled) {
    console.log(`skip ${doc._id}`);
    continue;
  }

  changed += 1;
  console.log(
    `${dryRun ? "dry-run" : "patch"} ${doc._id}` +
      `${unset.length ? ` unset ${unset.join(", ")}` : ""}` +
      `${setEnabled ? " set newsletter.enabled=true" : ""}`,
  );
  if (dryRun) continue;

  let patch = client.patch(doc._id);
  if (unset.length) patch = patch.unset(unset);
  if (setEnabled) patch = patch.set({ "newsletter.enabled": true });
  await patch.commit();
}

console.log(`${dryRun ? "Would change" : "Changed"} ${changed} document(s) in ${dataset}`);
