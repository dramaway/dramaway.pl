/**
 * Migrate Czytelnia extract JSON into Sanity (readingMethod + publication).
 *
 * Does not create publications from Art Generacje editions.
 * Does not write person / page / project documents.
 *
 * Usage (from repo root):
 *   pnpm migrate:czytelnia
 */

import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import {
  cleanVideoFilterUrl,
  isYoutubeUrl,
  newKey as repairKey,
  normalizeUrl,
  repairBlocks,
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

const FILES_DIR = path.join(
  ROOT,
  "private/legacy/domains/teatrzaangazowany.dramaway.pl/public_html/sites/default/files",
);
const EXTRACT = JSON.parse(
  readFileSync(
    path.join(ROOT, "apps/web/src/data/extracted/czytelnia.json"),
    "utf8",
  ),
);
const CURATED = JSON.parse(
  readFileSync(path.join(ROOT, "scripts/czytelnia-curated.json"), "utf8"),
);
const FILE_MAP = EXTRACT.files || {};

const listedBySlug = new Map(
  (CURATED.listed || []).map((row) => [row.slug, row]),
);

const assetCache = new Map();
const missingFiles = [];
const unmappedListed = [];

function key() {
  return randomBytes(6).toString("hex");
}

function methodDocId(slug) {
  return `readingMethod-${slug}`;
}

function findLocalFile(uri) {
  if (!uri) return null;
  for (const p of [
    path.join(FILES_DIR, uri),
    path.join(FILES_DIR, path.basename(uri)),
  ]) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function existingAssetId(filename, kind) {
  if (!filename) return null;
  const types =
    kind === "file" ? ["sanity.fileAsset"] : ["sanity.imageAsset"];
  return client.fetch(
    `*[_type in $types && originalFilename == $fn][0]._id`,
    { types, fn: filename },
  );
}

async function uploadFid(fid, { kind = "image", alt = "" } = {}) {
  const cacheKey = `${kind}:${fid}`;
  if (assetCache.has(cacheKey)) return assetCache.get(cacheKey);
  const meta = FILE_MAP[fid];
  if (!meta) {
    console.warn(`  missing file_managed for fid=${fid}`);
    missingFiles.push({ fid, reason: "not-in-extract" });
    return null;
  }
  const local = findLocalFile(meta.uri);
  if (!local) {
    console.warn(`  missing local file for fid=${fid} uri=${meta.uri}`);
    missingFiles.push({ fid, uri: meta.uri, reason: "not-on-disk" });
    return null;
  }
  const filename = path.basename(meta.uri || meta.filename || local);
  const foundId = await existingAssetId(filename, kind);
  let assetId = foundId;
  if (!assetId) {
    const buffer = readFileSync(local);
    const uploaded = await client.assets.upload(kind, buffer, {
      filename,
      contentType: meta.mime || undefined,
    });
    assetId = uploaded._id;
    console.log(`  uploaded fid=${fid} → ${assetId}`);
  }
  const value =
    kind === "file"
      ? {
          _type: "file",
          asset: { _type: "reference", _ref: assetId },
        }
      : {
          _type: "image",
          _key: key(),
          asset: { _type: "reference", _ref: assetId },
          ...(alt ? { alt } : {}),
        };
  assetCache.set(cacheKey, value);
  return value;
}

async function resolveMediaTokens(html) {
  if (!html) return { html: "", images: [] };
  const tokenRe = /\[\[(\{[\s\S]*?\})\]\]/g;
  const images = [];
  let out = html;
  const matches = [...html.matchAll(tokenRe)];
  for (const m of matches) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      out = out.replace(m[0], "");
      continue;
    }
    const fid = String(data.fid || "");
    const alt =
      data.attributes?.alt ||
      data.fields?.["field_file_image_alt_text[und][0][value]"] ||
      "";
    const image = await uploadFid(fid, {
      kind: "image",
      alt: typeof alt === "string" ? alt : "",
    });
    const marker = `[[SANITY_IMAGE_${images.length}]]`;
    images.push(image);
    out = out.replace(m[0], `<p>${marker}</p>`);
  }
  return { html: out, images };
}

function inlineSpans(el) {
  const spans = [];
  const markDefs = [];
  const walk = (node, marks = []) => {
    if (node.nodeType === 3) {
      const text = node.textContent || "";
      if (text) spans.push({ _type: "span", _key: key(), text, marks: [...marks] });
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    let nextMarks = marks;
    if (tag === "strong" || tag === "b") nextMarks = [...marks, "strong"];
    if (tag === "em" || tag === "i") nextMarks = [...marks, "em"];
    if (tag === "a") {
      const href = normalizeUrl(node.getAttribute("href") || "");
      if (href) {
        const markKey = key();
        markDefs.push({ _type: "link", _key: markKey, href });
        nextMarks = [...nextMarks, markKey];
      }
      for (const child of node.childNodes) walk(child, nextMarks);
      return;
    }
    if (tag === "br") {
      spans.push({ _type: "span", _key: key(), text: "\n", marks: [] });
      return;
    }
    for (const child of node.childNodes) walk(child, nextMarks);
  };
  for (const child of el.childNodes) walk(child);
  if (!spans.length) spans.push({ _type: "span", _key: key(), text: "", marks: [] });
  return { spans, markDefs };
}

function htmlToPortableText(html, images) {
  const dom = new JSDOM(`<body>${html || ""}</body>`);
  const body = dom.window.document.body;
  const blocks = [];

  const pushBlock = (style, el, listItem) => {
    const { spans: children, markDefs } = inlineSpans(el);
    const text = children.map((c) => c.text).join("");
    const imgParts = text.split(/(\[\[SANITY_IMAGE_\d+\]\])/);
    if (imgParts.some((p) => /^\[\[SANITY_IMAGE_\d+\]\]$/.test(p))) {
      for (const part of imgParts) {
        const m = part.match(/^\[\[SANITY_IMAGE_(\d+)\]\]$/);
        if (m) {
          const img = images[Number(m[1])];
          if (img) blocks.push({ ...img, _key: key() });
          continue;
        }
        if (part.trim()) {
          blocks.push({
            _type: "block",
            _key: key(),
            style,
            markDefs,
            children: [{ _type: "span", _key: key(), text: part, marks: [] }],
            ...(listItem ? { listItem, level: 1 } : {}),
          });
        }
      }
      return;
    }
    const videoOnly = text.trim().match(/^\[video:\s*(https?:\/\/[^\]\s]+)[^\]]*\]$/i);
    if (videoOnly) {
      const url = cleanVideoFilterUrl(videoOnly[1]);
      if (isYoutubeUrl(url)) {
        blocks.push({ _type: "youtube", _key: repairKey(), url });
        return;
      }
    }
    if (!text.trim() && style === "normal" && !listItem) return;
    blocks.push({
      _type: "block",
      _key: key(),
      style,
      markDefs,
      children,
      ...(listItem ? { listItem, level: 1 } : {}),
    });
  };

  for (const node of [...body.childNodes]) {
    if (node.nodeType === 3) {
      const t = (node.textContent || "").trim();
      if (t) {
        blocks.push({
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: key(), text: t, marks: [] }],
        });
      }
      continue;
    }
    if (node.nodeType !== 1) continue;
    const tag = node.tagName.toLowerCase();
    if (tag === "h1" || tag === "h2") pushBlock("h2", node);
    else if (tag === "h3" || tag === "h4") pushBlock("h3", node);
    else if (tag === "blockquote") pushBlock("blockquote", node);
    else if (tag === "ul" || tag === "ol") {
      for (const li of node.querySelectorAll(":scope > li")) {
        pushBlock("normal", li, tag === "ul" ? "bullet" : "number");
      }
    } else if (tag === "p" || tag === "div") pushBlock("normal", node);
    else if (tag === "table") {
      pushBlock("normal", node);
    } else {
      pushBlock("normal", node);
    }
  }

  const converted = blocks.length
    ? blocks
    : [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: key(), text: "", marks: [] }],
        },
      ];
  return repairBlocks(converted).blocks;
}

async function seedMethods() {
  for (const method of CURATED.methods) {
    const doc = {
      _id: methodDocId(method.slug),
      _type: "readingMethod",
      title: method.title,
      slug: { _type: "slug", current: method.slug },
      order: method.order,
      ...(method.summary ? { summary: method.summary } : {}),
    };
    await client.createOrReplace(doc);
    console.log(`✓ readingMethod ${method.title}`);
  }
}

async function publicationId(slug, nid) {
  const existing = await client.fetch(
    `*[_type == "publication" && slug.current == $slug][0]._id`,
    { slug },
  );
  return existing || `publication-drupal-${nid}`;
}

async function migratePublication(item) {
  const curated = listedBySlug.get(item.slug);
  const listed = Boolean(curated);
  const methodSlugs = curated?.methods || [];
  const { html, images } = await resolveMediaTokens(item.bodyHtml || "");
  const blocks = htmlToPortableText(html, images);

  if (item.imageFid) {
    const cover = await uploadFid(item.imageFid, {
      kind: "image",
      alt: item.imageAlt || "",
    });
    if (cover) blocks.unshift({ ...cover, _key: key() });
  }

  if (item.videoUrl) {
    const url = cleanVideoFilterUrl(item.videoUrl);
    if (isYoutubeUrl(url)) {
      blocks.push({ _type: "youtube", _key: repairKey(), url });
    }
  }

  let file;
  if (item.pdfFid) {
    const uploaded = await uploadFid(item.pdfFid, { kind: "file" });
    if (uploaded) file = uploaded;
  }

  const doc = {
    _id: await publicationId(item.slug, item.nid),
    _type: "publication",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    listed,
    authors: item.authors || [],
    ...(item.summary ? { summary: item.summary } : {}),
    body: blocks,
    ...(file ? { file } : {}),
    methods: methodSlugs.map((slug) => ({
      _type: "reference",
      _key: key(),
      _ref: methodDocId(slug),
    })),
    legacyDrupal: {
      nid: item.nid,
      alias: item.alias || "",
      format: item.format || "",
    },
  };
  await client.createOrReplace(doc);
  console.log(
    `✓ publication ${listed ? "listed" : "unlisted"} ${item.slug}`,
  );
}

async function main() {
  if (!EXTRACT.articles?.length) {
    console.error("No articles in extract JSON. Run pnpm extract:czytelnia first.");
    process.exit(1);
  }

  const extractSlugs = new Set(EXTRACT.articles.map((a) => a.slug));
  for (const row of CURATED.listed || []) {
    if (!extractSlugs.has(row.slug)) unmappedListed.push(row.slug);
  }

  console.log(`Migrating Czytelnia to ${projectId}/${dataset} …`);
  await seedMethods();
  for (const article of EXTRACT.articles) {
    await migratePublication(article);
  }

  console.log("Done.", {
    readingMethods: CURATED.methods.length,
    publications: EXTRACT.articles.length,
    listed: EXTRACT.articles.filter((a) => listedBySlug.has(a.slug)).length,
    assetsUploaded: assetCache.size,
    missingFiles: missingFiles.length,
    unmappedListedSlugs: unmappedListed,
  });
  if (missingFiles.length) {
    console.warn("Missing local files:", missingFiles);
  }
  if (unmappedListed.length) {
    console.warn("Curated slugs not in extract:", unmappedListed);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
