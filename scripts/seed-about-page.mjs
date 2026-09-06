/**
 * Create the O fundacji singleton if it does not exist.
 *
 * Fields stay empty — the site omits empty CMS fields instead of filling
 * frontend defaults. Does not overwrite an existing document.
 *
 * Usage (from repo root):
 *   pnpm seed:about-page
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

if (!projectId || !token) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const ABOUT_ID = "aboutPage";

const existing = await client.fetch(`*[_id == $id][0]._id`, { id: ABOUT_ID });
if (existing) {
  console.log("aboutPage already exists — skip");
  process.exit(0);
}

await client.createIfNotExists({
  _id: ABOUT_ID,
  _type: "aboutPage",
});
console.log("Created aboutPage with empty fields.");
