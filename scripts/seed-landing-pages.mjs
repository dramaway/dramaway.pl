/**
 * Create landing-page singletons if they do not exist.
 *
 * Empty title/lead/image keep frontend fallbacks (subpage-copy.ts).
 * Does not overwrite existing documents. Does not run migrate:*.
 *
 * Usage (from repo root):
 *   pnpm seed:landing-pages
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

const LANDINGS = [
  { _id: "landing-projekty", route: "projekty" },
  { _id: "landing-baza-wiedzy", route: "baza-wiedzy" },
  { _id: "landing-czytelnia", route: "czytelnia" },
  { _id: "landing-zespol", route: "zespol" },
];

let created = 0;
let skipped = 0;

for (const landing of LANDINGS) {
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: landing._id });
  if (existing) {
    skipped += 1;
    console.log(`${landing._id} already exists — skip`);
    continue;
  }

  await client.createIfNotExists({
    _id: landing._id,
    _type: "landingPage",
    route: landing.route,
  });
  created += 1;
  console.log(`Created ${landing._id} (${landing.route}), fields left empty.`);
}

console.log(`Landing pages: ${created} created, ${skipped} skipped.`);
