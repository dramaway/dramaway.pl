/**
 * Repair Drupal-flattened Portable Text:
 * - `anchor (https://…)` / duplicate `(url) (url)` → Sanity link marks
 * - `[video:https://youtube…]` → youtube objects
 */

import { randomBytes } from "crypto";

export function newKey() {
  return randomBytes(6).toString("hex");
}

export function normalizeUrl(raw) {
  if (!raw) return "";
  let href = raw.trim();
  href = href.replace(/[.,;:]+$/, "");
  if (href.startsWith("www.")) href = `https://${href}`;
  return href;
}

const PAREN_URL =
  /\(\s*((?:https?:\/\/|www\.)[^\s)]+?)\s*\)/gi;

const VIDEO_TOKEN =
  /\[video:\s*(https?:\/\/[^\]\s]+)[^\]]*\]/gi;

export function cleanVideoFilterUrl(raw) {
  let href = (raw || "").trim();
  href = href.replace(/&(?:width|height|align):[^\s&]*/gi, "");
  href = href.replace(/\s+(?:width|height|align):[^\s\]]*/gi, "");
  href = href.replace(/&$/, "");
  return href;
}

export function isYoutubeUrl(href) {
  try {
    const u = new URL(href);
    return /youtu\.be$|youtube\.com$|youtube-nocookie\.com$/i.test(u.hostname);
  } catch {
    return /youtu\.be|youtube\.com/i.test(href);
  }
}

const QUOTE_ANCHOR = /^(.*?)(„[^”]+”|„[^"]+"|"[^"]+"|'[^']+')\s*$/;

function attachAnchor(before, href) {
  const trimmed = before.replace(/\s+$/, "");
  if (!trimmed) return [];
  if (/^[.,;:!?…\s]+$/.test(trimmed)) return [{ text: trimmed }];
  const quoted = trimmed.match(QUOTE_ANCHOR);
  if (quoted) {
    const out = [];
    if (quoted[1]) out.push({ text: quoted[1] });
    out.push({ text: quoted[2], href });
    return out;
  }
  return [{ text: trimmed, href }];
}

export function splitParenLinks(text) {
  const parts = [];
  let last = 0;
  const re = new RegExp(PAREN_URL.source, "gi");
  let m;
  while ((m = re.exec(text))) {
    const href = normalizeUrl(m[1]);
    const before = text.slice(last, m.index);
    const attached = attachAnchor(before, href);
    if (attached.length === 0) {
      const prev = parts[parts.length - 1];
      if (!prev || prev.href !== href) {
        parts.push({ text: href, href });
      }
    } else {
      const lastPiece = attached[attached.length - 1];
      const prev = parts[parts.length - 1];
      if (
        lastPiece.href &&
        prev?.href === lastPiece.href &&
        /^[.,;:!?…\s]*$/.test(attached[0]?.text || "") &&
        attached.length === 1
      ) {
        parts.push(...attached.map((p) => ({ text: p.text })));
      } else {
        parts.push(...attached);
      }
    }
    last = m.index + m[0].length;
  }
  const rest = text.slice(last);
  if (rest) parts.push({ text: rest });
  return parts.length ? parts : [{ text }];
}

function youtubeBlock(url) {
  return { _type: "youtube", _key: newKey(), url };
}

function rebuildBlock(block, parts, extraDefs) {
  const markDefs = [...(block.markDefs || []), ...extraDefs];
  const children = [];
  for (const part of parts) {
    if (!part.text) continue;
    const marks = [];
    if (part.href) {
      const k = newKey();
      markDefs.push({ _type: "link", _key: k, href: part.href });
      marks.push(k);
    }
    children.push({
      _type: "span",
      _key: newKey(),
      text: part.text,
      marks,
    });
  }
  if (!children.length) {
    children.push({
      _type: "span",
      _key: newKey(),
      text: "",
      marks: [],
    });
  }
  return { ...block, children, markDefs };
}

/**
 * @returns {{ blocks: object[], stats: { links: number, videos: number, skipped: number } }}
 */
export function repairBlocks(blocks) {
  const stats = { links: 0, videos: 0, skipped: 0 };
  if (!Array.isArray(blocks)) return { blocks, stats };

  const out = [];
  for (const block of blocks) {
    if (!block || block._type !== "block") {
      out.push(block);
      continue;
    }
    const raw = (block.children || []).map((c) => c.text || "").join("");

    const videoOnly = raw.trim().match(/^\[video:\s*(https?:\/\/[^\]\s]+)[^\]]*\]$/i);
    if (videoOnly) {
      const url = cleanVideoFilterUrl(videoOnly[1]);
      if (isYoutubeUrl(url)) {
        out.push(youtubeBlock(url));
        stats.videos += 1;
        continue;
      }
    }

    if (VIDEO_TOKEN.test(raw)) {
      VIDEO_TOKEN.lastIndex = 0;
      const pieces = [];
      let cursor = 0;
      const videoRe = new RegExp(VIDEO_TOKEN.source, "gi");
      let vm;
      while ((vm = videoRe.exec(raw))) {
        if (vm.index > cursor) {
          pieces.push({ kind: "text", text: raw.slice(cursor, vm.index) });
        }
        pieces.push({ kind: "video", url: cleanVideoFilterUrl(vm[1]) });
        cursor = vm.index + vm[0].length;
      }
      if (cursor < raw.length) pieces.push({ kind: "text", text: raw.slice(cursor) });

      for (const piece of pieces) {
        if (piece.kind === "video") {
          if (isYoutubeUrl(piece.url)) {
            out.push(youtubeBlock(piece.url));
            stats.videos += 1;
          } else {
            out.push(
              rebuildBlock(block, [{ text: piece.url, href: piece.url }], []),
            );
            stats.links += 1;
          }
          continue;
        }
        const parts = splitParenLinks(piece.text);
        stats.links += parts.filter((p) => p.href).length;
        if (parts.some((p) => p.text?.trim())) {
          out.push(rebuildBlock(block, parts, []));
        }
      }
      continue;
    }

    const parts = [];
    for (const child of block.children || []) {
      if (child._type !== "span") continue;
      parts.push(...splitParenLinks(child.text || ""));
    }
    const linkCount = parts.filter((p) => p.href).length;
    const rebuiltText = parts.map((p) => p.text || "").join("");
    if (linkCount === 0 && rebuiltText === raw) {
      out.push(block);
      stats.skipped += 1;
      continue;
    }
    stats.links += linkCount;
    out.push(rebuildBlock(block, parts, []));
  }

  return { blocks: out, stats };
}

const IMAGE_MARKER = /\[\[SANITY_IMAGE_(\d+)\]\]/g;

/**
 * Turn leftover `[[SANITY_IMAGE_n]]` text (often several in one paragraph)
 * into image blocks. `imagesByIndex[n]` is a Sanity image object or null.
 */
export function replaceImageMarkers(blocks, imagesByIndex) {
  const stats = { images: 0, missing: 0 };
  if (!Array.isArray(blocks) || !imagesByIndex) return { blocks, stats };

  const out = [];
  for (const block of blocks) {
    if (!block || block._type !== "block") {
      out.push(block);
      continue;
    }
    const raw = (block.children || []).map((c) => c.text || "").join("");
    if (!/\[\[SANITY_IMAGE_\d+\]\]/.test(raw)) {
      out.push(block);
      continue;
    }
    const re = new RegExp(IMAGE_MARKER.source, "g");
    let last = 0;
    let m;
    while ((m = re.exec(raw))) {
      const before = raw.slice(last, m.index);
      if (before.trim()) {
        out.push(rebuildBlock(block, [{ text: before }], []));
      }
      const img = imagesByIndex[Number(m[1])];
      if (img?.asset) {
        out.push({ ...img, _key: newKey() });
        stats.images += 1;
      } else {
        stats.missing += 1;
      }
      last = m.index + m[0].length;
    }
    const rest = raw.slice(last);
    if (rest.trim()) out.push(rebuildBlock(block, [{ text: rest }], []));
  }
  return { blocks: out, stats };
}

export function youtubeEmbedSrc(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const list = u.searchParams.get("list");
    const id = u.searchParams.get("v");
    if (list && !id) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
    if (id) {
      const t = u.searchParams.get("t");
      const start = t ? `?start=${parseInt(t, 10) || 0}` : "";
      return `https://www.youtube-nocookie.com/embed/${id}${start}`;
    }
  } catch {
    return null;
  }
  return null;
}
