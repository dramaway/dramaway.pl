/**
 * Repair Drupal-flattened Portable Text:
 * - `anchor (https://…)` / duplicate `(url) (url)` → Sanity link marks
 * - `anchor (/zespol/…)` / `(mailto:…)` leftover from relative Drupal <a>
 * - bare http(s)/www URLs and emails → link marks
 * - `[video:https://youtube…]` → youtube objects
 */

import { randomBytes } from "crypto";

export function newKey() {
  return randomBytes(6).toString("hex");
}

const LEGACY_FILE_ORIGIN = "https://www.fundacja.dramaway.pl";

export function normalizeUrl(raw) {
  if (!raw) return "";
  let href = raw.trim();
  href = href.replace(/[.,;:]+$/, "");
  if (href.startsWith("www.")) href = `https://${href}`;
  return href;
}

/**
 * Map a Drupal leftover href onto something that works on the new site.
 * PDFs still live on the old origin (not in Next / Sanity files).
 * Truncated URLs (`…` / `...`) return "" — do not invent a target.
 */
export function toPublicHref(raw) {
  const href = normalizeUrl(raw);
  if (!href || href.includes("...") || href.includes("…")) return "";
  if (href.toLowerCase().startsWith("mailto:")) return href;
  if (/^\/sites\/fundacja\/files\//i.test(href)) {
    return `${LEGACY_FILE_ORIGIN}${href}`;
  }
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    if (host === "fundacja.dramaway.pl") {
      if (u.pathname.toLowerCase().startsWith("/sites/fundacja/files/")) {
        return `${LEGACY_FILE_ORIGIN}${u.pathname}${u.search}`;
      }
      return `${u.pathname}${u.search}${u.hash}` || "/";
    }
  } catch {
    // not an absolute URL
  }
  return href;
}

const NAMED_ENTITIES = {
  nbsp: "\u00A0",
  amp: "&",
  quot: '"',
  lt: "<",
  gt: ">",
  apos: "'",
  rdquo: "\u201D",
  ldquo: "\u201C",
  rsquo: "\u2019",
  lsquo: "\u2018",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
};

/** Decode leftover HTML entities. Repeat so `&amp;nbsp;` becomes a space character. */
export function decodeHtmlEntities(text) {
  if (!text) return text;
  let out = text;
  for (let i = 0; i < 3; i++) {
    const prev = out;
    out = out.replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (match, name) => {
      const key = name.toLowerCase();
      return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key)
        ? NAMED_ENTITIES[key]
        : match;
    });
    out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
    out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    );
    if (out === prev) break;
  }
  // Drupal excerpts sometimes truncate mid-entity (`&nbsp` with no semicolon).
  out = out.replace(/&nbsp\b/gi, "\u00A0");
  return out;
}

export function stripControlChars(text) {
  if (!text) return text;
  return text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFEFF\u200B-\u200D\u2060]/g,
    "",
  );
}

/**
 * Plain CMS strings (summary, excerpt): entities → readable text, nbsp → regular space.
 */
export function cleanPlainString(text) {
  if (typeof text !== "string" || !text) return text;
  let s = stripControlChars(decodeHtmlEntities(text));
  s = s.replace(/\u00A0/g, " ");
  s = s.replace(/[ \t]{2,}/g, " ");
  return s;
}

/**
 * Portable Text spans: decode entities, drop control chars, collapse nbsp runs.
 * Single U+00A0 stays (Polish 1-letter prepositions).
 */
export function cleanRichText(text) {
  if (typeof text !== "string" || !text) return text;
  let s = stripControlChars(decodeHtmlEntities(text));
  s = s.replace(/\u00A0{2,}/g, "\u00A0");
  return s;
}

const TRUNCATED_URL = /https?:\/\/[^\s]*\.\.\.[^\s]*/gi;

export function findTruncatedUrls(text) {
  if (!text) return [];
  return [...text.matchAll(TRUNCATED_URL)].map((m) => m[0]);
}

/**
 * Parenthetical leftovers after Drupal <a> flattening:
 * 1. (name@host (mailto:name@host))
 * 2. (mailto:…)
 * 3. (https://… | www.…)
 * 4. (/zespol/… | /projekty/… | /sites/fundacja/files/…)
 * 5. (name@host)
 */
const PAREN_LINK =
  /\(\s*(?:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\s*\(\s*mailto:\1\s*\)|(mailto:[^\s)]+)|((?:https?:\/\/|www\.)[^\s)]+)|(\/(?:zespol|projekty|fundacja|metody|czytelnia|baza-wiedzy|kontakt|sites)\/[^\s)]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}))\s*\)/gi;

function hrefFromParenMatch(match) {
  if (match[1]) return `mailto:${match[1]}`;
  if (match[2]) return match[2];
  if (match[3]) return toPublicHref(match[3]);
  if (match[4]) return toPublicHref(match[4]);
  if (match[5]) return `mailto:${match[5]}`;
  return "";
}

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
  const re = new RegExp(PAREN_LINK.source, "gi");
  let m;
  while ((m = re.exec(text))) {
    const href = hrefFromParenMatch(m);
    if (!href) {
      continue;
    }
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

const BARE_URL = /https?:\/\/[^\s)<>"']+|www\.[^\s)<>"']+/gi;
const BARE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/**
 * Turn leftover http(s)/www URLs and emails in a span into link parts.
 */
export function splitBareContacts(text) {
  if (!text) return [{ text: "" }];
  const hits = [];
  const urlRe = new RegExp(BARE_URL.source, "gi");
  let m;
  while ((m = urlRe.exec(text))) {
    const href = toPublicHref(m[0]);
    if (!href) continue;
    hits.push({ start: m.index, end: m.index + m[0].length, href });
  }
  const emailRe = new RegExp(BARE_EMAIL.source, "g");
  while ((m = emailRe.exec(text))) {
    hits.push({
      start: m.index,
      end: m.index + m[0].length,
      href: `mailto:${m[0]}`,
    });
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const parts = [];
  let last = 0;
  for (const hit of hits) {
    if (hit.start < last) continue;
    if (hit.start > last) parts.push({ text: text.slice(last, hit.start) });
    parts.push({ text: text.slice(hit.start, hit.end), href: hit.href });
    last = hit.end;
  }
  if (!parts.length) return [{ text }];
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

export function splitInlineLinks(text) {
  const parenParts = splitParenLinks(text);
  const out = [];
  for (const part of parenParts) {
    if (part.href || !part.text) {
      out.push(part);
      continue;
    }
    out.push(...splitBareContacts(part.text));
  }
  return out.length ? out : [{ text }];
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
  const stats = { links: 0, videos: 0, skipped: 0, text: 0, truncated: 0 };
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
          pieces.push({
            kind: "text",
            text: cleanRichText(raw.slice(cursor, vm.index)),
          });
        }
        pieces.push({ kind: "video", url: cleanVideoFilterUrl(vm[1]) });
        cursor = vm.index + vm[0].length;
      }
      if (cursor < raw.length) {
        pieces.push({ kind: "text", text: cleanRichText(raw.slice(cursor)) });
      }

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
        const parts = splitInlineLinks(piece.text);
        stats.links += parts.filter((p) => p.href).length;
        if (parts.some((p) => p.text?.trim())) {
          out.push(rebuildBlock(block, parts, []));
        }
      }
      continue;
    }

    const defs = Object.fromEntries(
      (block.markDefs || [])
        .filter((d) => d?._key)
        .map((d) => [d._key, d]),
    );
    const children = [];
    const extraDefs = [];
    let changed = false;
    let linkCount = 0;

    for (const child of block.children || []) {
      if (child._type !== "span") {
        children.push(child);
        continue;
      }
      const text = cleanRichText(child.text || "");
      if (text !== (child.text || "")) stats.text += 1;
      for (const url of findTruncatedUrls(text)) {
        stats.truncated += 1;
        stats.truncatedUrls = stats.truncatedUrls || [];
        stats.truncatedUrls.push(url);
      }
      const childMarks = child.marks || [];
      const hasLinkMark = childMarks.some((k) => defs[k]?._type === "link");
      const parts = hasLinkMark ? splitParenLinks(text) : splitInlineLinks(text);
      const newHrefs = parts.filter((p) => p.href);
      const rebuilt = parts.map((p) => p.text || "").join("");
      if (newHrefs.length === 0 && rebuilt === text) {
        if (text === (child.text || "")) {
          children.push(child);
        } else {
          changed = true;
          children.push({ ...child, text });
        }
        continue;
      }
      changed = true;
      const keepMarks = childMarks.filter((k) => defs[k]?._type !== "link");
      for (const part of parts) {
        if (!part.text) continue;
        const marks = [...keepMarks];
        if (part.href) {
          const k = newKey();
          extraDefs.push({ _type: "link", _key: k, href: part.href });
          marks.push(k);
          linkCount += 1;
        } else if (hasLinkMark) {
          for (const mk of childMarks) {
            if (defs[mk]?._type === "link") marks.push(mk);
          }
        }
        children.push({
          _type: "span",
          _key: newKey(),
          text: part.text,
          marks,
        });
      }
    }

    if (!changed) {
      out.push(block);
      stats.skipped += 1;
      continue;
    }
    stats.links += linkCount;
    const used = new Set(children.flatMap((c) => c.marks || []));
    const markDefs = [
      ...(block.markDefs || []).filter((d) => used.has(d._key)),
      ...extraDefs,
    ];
    out.push({
      ...block,
      children: children.length
        ? children
        : [{ _type: "span", _key: newKey(), text: "", marks: [] }],
      markDefs,
    });
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
