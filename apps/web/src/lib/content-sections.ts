import { cmsText } from "./cms-text";
import {
  EXCERPT_FALLBACK_MAX,
  NEWS_CTA_LABEL,
  TILE_CTA_MEET,
} from "./homepage-copy";
import { hrefForDocument } from "./navigation";
import { safeHref } from "./safe-url";
import type {
  CmsContentImage,
  CmsContentSection,
  CmsContentTile,
  ResolvedSection,
  ResolvedTile,
} from "./sanity/types";

function clip(text: string | null): string | null {
  if (!text) return null;
  if (text.length <= EXCERPT_FALLBACK_MAX) return text;
  return text.slice(0, EXCERPT_FALLBACK_MAX).trimEnd();
}

function hasAsset(image: CmsContentImage | null | undefined): image is CmsContentImage {
  if (!image || typeof image !== "object") return false;
  return "asset" in image && image.asset != null;
}

function defaultCta(type: string | null | undefined): string {
  if (type === "person" || type === "project") return TILE_CTA_MEET;
  return NEWS_CTA_LABEL;
}

function resolveTile(tile: CmsContentTile): ResolvedTile | null {
  const page = tile.target === "path" ? null : (tile.page ?? null);
  const rawHref = tile.target === "path" ? tile.href : page ? hrefForDocument(page) : null;
  const safe = safeHref(rawHref);
  const href =
    safe && (safe.kind === "path" || safe.kind === "http") ? safe.href : null;
  const title = cmsText(tile.title) || cmsText(page?.title) || cmsText(page?.name);
  const excerpt = clip(cmsText(tile.excerpt) || cmsText(page?.docExcerpt));
  if (!title && !excerpt) return null;
  return {
    key: tile._key,
    title,
    excerpt,
    href,
    ctaLabel: href ? cmsText(tile.ctaLabel) || defaultCta(page?._type) : null,
  };
}

/** Turn CMS section objects into renderable modules. Drops empty tiles and modules. */
export function resolveContentSections(
  sections: CmsContentSection[] | null | undefined,
): ResolvedSection[] {
  const resolved: ResolvedSection[] = [];
  for (const section of sections ?? []) {
    if (!section?._key || !section._type) continue;
    if (section._type === "newsFeedModule") {
      resolved.push({
        key: section._key,
        kind: "news",
        heading: cmsText(section.heading),
      });
      continue;
    }
    if (section._type !== "contentModule") continue;
    const tiles = (section.tiles ?? [])
      .slice(0, 3)
      .map(resolveTile)
      .filter((tile): tile is ResolvedTile => tile !== null);
    if (tiles.length === 0) continue;
    const image = hasAsset(section.image) ? section.image : null;
    resolved.push({
      key: section._key,
      kind: "module",
      image,
      imageAlt: cmsText(section.image?.alt) || tiles.find((tile) => tile.title)?.title || "",
      textLayout: section.textLayout === "list" ? "list" : "grid",
      tiles,
    });
  }
  return resolved;
}
