/**
 * One-shot copy: publication.legacyDrupal.format → publication.format.
 *
 * Does not re-run migrate:czytelnia. Does not touch _type, methods, or listed.
 * Empty / unknown Drupal strings stay empty (visible only when no rodzaj filter).
 *
 * Usage (from repo root):
 *   pnpm patch:publication-format            # write
 *   pnpm patch:publication-format -- --dry-run
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

const ENUM = new Set(["articles", "books", "scripts", "multimedia"]);

/**
 * Keys are lowercase, diacritics stripped (książki → ksiazki).
 * Dump values seen in extract: Publikacje, Scenariusze, Książki, Multimedia.
 */
const FORMAT_MAP = {
  publikacje: "articles",
  publikacja: "articles",
  "artykuly i publikacje": "articles",
  artykuly: "articles",
  articles: "articles",
  ksiazki: "books",
  ksiazka: "books",
  books: "books",
  book: "books",
  scenariusze: "scripts",
  scenariusz: "scripts",
  scripts: "scripts",
  script: "scripts",
  multimedia: "multimedia",
};

function fold(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function mapDrupalFormat(legacy) {
  if (!legacy || !String(legacy).trim()) return null;
  return FORMAT_MAP[fold(legacy)] ?? null;
}

const rows = await client.fetch(
  `*[_type == "publication"]{ _id, format, "legacy": legacyDrupal.format }`,
);

let already = 0;
let patched = 0;
let emptyOrUnknown = 0;
const unknownSamples = new Map();

for (const row of rows) {
  if (ENUM.has(row.format)) {
    already += 1;
    continue;
  }
  const mapped = mapDrupalFormat(row.legacy);
  if (!mapped) {
    emptyOrUnknown += 1;
    const key = row.legacy == null || row.legacy === "" ? "(empty)" : String(row.legacy);
    unknownSamples.set(key, (unknownSamples.get(key) || 0) + 1);
    continue;
  }
  if (!dryRun) {
    await client.patch(row._id).set({ format: mapped }).commit();
  }
  patched += 1;
}

console.log(dryRun ? "Dry-run (no writes)." : "Wrote publication.format.");
console.log({
  projectId,
  dataset,
  documents: rows.length,
  alreadySet: already,
  patched,
  emptyOrUnknown,
  unknownSamples: Object.fromEntries(unknownSamples),
});
