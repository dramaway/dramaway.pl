/**
 * Migrate fundacja extract JSON into Sanity Content Lake.
 *
 * Usage (from repo root):
 *   pnpm migrate:fundacja
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
  "private/legacy/domains/multisite.dramaway.pl/public_html/sites/fundacja/files",
);
const EXTRACT = JSON.parse(
  readFileSync(
    path.join(ROOT, "apps/web/src/data/extracted/fundacja.json"),
    "utf8",
  ),
);
const FILE_MAP = JSON.parse(
  readFileSync(path.join(ROOT, "apps/web/src/data/extracted/files.json"), "utf8"),
);

const assetCache = new Map();

function key() {
  return randomBytes(6).toString("hex");
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

async function uploadFid(fid, alt) {
  if (assetCache.has(fid)) return assetCache.get(fid);
  const meta = FILE_MAP[fid];
  if (!meta) {
    console.warn(`  missing file_managed for fid=${fid}`);
    return null;
  }
  const local = findLocalFile(meta.uri);
  if (!local) {
    console.warn(`  missing local file for fid=${fid} uri=${meta.uri}`);
    return null;
  }
  const buffer = readFileSync(local);
  const uploaded = await client.assets.upload("image", buffer, {
    filename: meta.filename || path.basename(local),
    contentType: meta.mime || undefined,
  });
  const image = {
    _type: "image",
    _key: key(),
    asset: { _type: "reference", _ref: uploaded._id },
    ...(alt ? { alt } : {}),
  };
  assetCache.set(fid, image);
  console.log(`  uploaded fid=${fid} → ${uploaded._id}`);
  return image;
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
    const image = await uploadFid(fid, typeof alt === "string" ? alt : "");
    const marker = `[[SANITY_IMAGE_${images.length}]]`;
    if (image) images.push(image);
    else images.push(null);
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
      // flatten table text
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

function docId(prefix, nid) {
  return `${prefix}-drupal-${nid}`;
}

async function migratePerson(item) {
  let photo;
  if (item.photo) {
    const entry = Object.values(FILE_MAP).find(
      (f) => f.uri === item.photo || f.filename === item.photo,
    );
    if (entry) photo = await uploadFid(entry.fid);
  }
  const { html, images } = await resolveMediaTokens(item.bodyHtml || "");
  const doc = {
    _id: docId("person", item.nid),
    _type: "person",
    name: item.title,
    slug: { _type: "slug", current: item.slug },
    ...(photo ? { photo } : {}),
    bio: htmlToPortableText(html, images),
  };
  await client.createOrReplace(doc);
  console.log(`✓ person ${item.title}`);
}

async function migratePage(item, { news = false } = {}) {
  const { html, images } = await resolveMediaTokens(item.bodyHtml || "");
  const doc = {
    _id: docId(news ? "news" : "page", item.nid),
    _type: news ? "news" : "page",
    title: item.title,
    slug: {
      _type: "slug",
      current: item.slug,
    },
    body: htmlToPortableText(html, images),
  };
  await client.createOrReplace(doc);
  console.log(`✓ ${news ? "news" : "page"} ${item.title}`);
}

async function main() {
  console.log(`Migrating to ${projectId}/${dataset} …`);
  for (const p of EXTRACT.people) await migratePerson(p);
  for (const p of EXTRACT.pages) await migratePage(p);
  for (const p of EXTRACT.news) await migratePage(p, { news: true });
  console.log("Done.", {
    people: EXTRACT.people.length,
    pages: EXTRACT.pages.length,
    news: EXTRACT.news.length,
    assetsUploaded: assetCache.size,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
