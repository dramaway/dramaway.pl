/**
 * Find and repair flattened Drupal links / video tokens / leftover image markers.
 *
 *   pnpm repair:portable-text            # dry-run report
 *   pnpm repair:portable-text -- --write # patch dataset
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  newKey,
  repairBlocks,
  replaceImageMarkers,
} from "./lib/portable-text-repair.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const write = process.argv.includes("--write");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (write && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed for --write)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: write ? token : undefined,
  useCdn: false,
});

const EXTRACT_PATH = path.join(
  ROOT,
  "apps/web/src/data/extracted/fundacja.json",
);
const FILES_PATH = path.join(ROOT, "apps/web/src/data/extracted/files.json");

function addStats(a, b) {
  return {
    links: a.links + b.links,
    videos: a.videos + b.videos,
    skipped: a.skipped + b.skipped,
    images: (a.images || 0) + (b.images || 0),
    missing: (a.missing || 0) + (b.missing || 0),
  };
}

function mediaTokens(html) {
  if (!html) return [];
  const re = /\[\[(\{[\s\S]*?\})\]\]/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      out.push(null);
    }
  }
  return out;
}

function sourceSlug(doc, extract) {
  if (doc._type === "page" && doc._id.startsWith("page-drupal-")) {
    const nid = Number(doc._id.replace("page-drupal-", ""));
    return extract.pages.find((p) => p.nid === nid)?.slug;
  }
  if (doc._type === "person" && doc._id.startsWith("person-drupal-")) {
    const nid = Number(doc._id.replace("person-drupal-", ""));
    return extract.people.find((p) => p.nid === nid)?.slug;
  }
  if (doc._type === "project") return doc.slug;
  return null;
}

async function buildImageIndex(slug, extract, fileMap, assetByName) {
  if (!slug) return null;
  const item =
    extract.pages.find((p) => p.slug === slug) ||
    extract.people.find((p) => p.slug === slug);
  if (!item) return null;
  const tokens = mediaTokens(item.bodyHtml);
  return tokens.map((token) => {
    if (!token?.fid) return null;
    const meta = fileMap[String(token.fid)];
    const filename = meta?.filename;
    const assetId = filename ? assetByName.get(filename) : null;
    if (!assetId) return null;
    const alt =
      token.attributes?.alt ||
      token.fields?.["field_file_image_alt_text[und][0][value]"] ||
      "";
    return {
      _type: "image",
      _key: newKey(),
      asset: { _type: "reference", _ref: assetId },
      ...(typeof alt === "string" && alt ? { alt } : {}),
    };
  });
}

async function main() {
  const extract = existsSync(EXTRACT_PATH)
    ? JSON.parse(readFileSync(EXTRACT_PATH, "utf8"))
    : null;
  const fileMap = existsSync(FILES_PATH)
    ? JSON.parse(readFileSync(FILES_PATH, "utf8"))
    : {};

  const assets = await client.fetch(
    `*[_type=="sanity.imageAsset"]{ _id, originalFilename }`,
  );
  const assetByName = new Map();
  for (const a of assets) {
    if (a.originalFilename && !assetByName.has(a.originalFilename)) {
      assetByName.set(a.originalFilename, a._id);
    }
  }

  const docs = await client.fetch(`*[
    _type in ["page", "person", "project"]
  ]{
    _id, _type, title, name,
    "slug": slug.current,
    body, bio, afterword,
    editions
  }`);

  let totals = { links: 0, videos: 0, skipped: 0, images: 0, missing: 0 };
  let patched = 0;

  for (const doc of docs) {
    const patch = {};
    let docStats = { links: 0, videos: 0, skipped: 0, images: 0, missing: 0 };
    const imagesByIndex = extract
      ? await buildImageIndex(
          sourceSlug(doc, extract),
          extract,
          fileMap,
          assetByName,
        )
      : null;

    const runField = (blocks) => {
      let next = blocks;
      const link = repairBlocks(next);
      next = link.blocks;
      const imgs = replaceImageMarkers(next, imagesByIndex);
      next = imgs.blocks;
      return {
        blocks: next,
        stats: addStats(
          { ...link.stats, images: 0, missing: 0 },
          { links: 0, videos: 0, skipped: 0, ...imgs.stats },
        ),
      };
    };

    for (const field of ["body", "bio", "afterword"]) {
      if (!Array.isArray(doc[field])) continue;
      const { blocks, stats } = runField(doc[field]);
      docStats = addStats(docStats, stats);
      if (stats.links || stats.videos || stats.images) patch[field] = blocks;
    }

    if (Array.isArray(doc.editions) && doc.editions.length) {
      let editionChanged = false;
      const editions = doc.editions.map((edition) => {
        if (!Array.isArray(edition.body)) return edition;
        const { blocks, stats } = runField(edition.body);
        docStats = addStats(docStats, stats);
        if (stats.links || stats.videos || stats.images) {
          editionChanged = true;
          return { ...edition, body: blocks };
        }
        return edition;
      });
      if (editionChanged) patch.editions = editions;
    }

    totals = addStats(totals, docStats);
    const label = `${doc._type} ${doc.title || doc.name || doc._id}`;
    if (docStats.links || docStats.videos || docStats.images || docStats.missing) {
      console.log(
        `  ${label}: ${docStats.links} links, ${docStats.videos} videos, ${docStats.images} images` +
          (docStats.missing ? `, ${docStats.missing} missing` : ""),
      );
      if (write && Object.keys(patch).length) {
        await client.patch(doc._id).set(patch).commit();
        patched += 1;
      }
    }
  }

  console.log(
    `\n${write ? "Wrote" : "Dry-run"} — ${totals.links} links, ${totals.videos} videos, ${totals.images} images` +
      (totals.missing ? `, ${totals.missing} missing` : "") +
      (write ? `, ${patched} documents patched` : " (pass --write to patch)"),
  );
}

main().catch((err) => {
  const code = err?.response?.body?.errorCode || err?.statusCode;
  if (code === "SIO-401-ANF" || err?.statusCode === 401) {
    console.error(
      "Write token rejected. Refresh SANITY_API_WRITE_TOKEN in apps/studio/.env",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
