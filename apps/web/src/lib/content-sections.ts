import { cmsText } from "./cms-text";
import {
  EXCERPT_FALLBACK_MAX,
  NEWS_CTA_LABEL,
  TILE_CTA_MEET,
} from "./homepage-copy";
import { hrefForDocument } from "./navigation";
import { newsCta } from "./news-cta";
import { personPath, projectPath, publicPathForPage, publicationPath } from "./routes";
import { safeHref } from "./safe-url";
import type {
  CmsContentImage,
  CmsContentSection,
  CmsContentTile,
  ContentFeedDoc,
  ContentFeedPool,
  FeedSource,
  ResolvedSection,
  ResolvedTile,
} from "./sanity/types";

/** Upper bound for a news-feed section. Keep in sync with the Studio field. */
export const FEED_LIMIT_MAX = 12;
const FEED_LIMIT_DEFAULT = 3;
const FEED_SOURCES: readonly FeedSource[] = [
  "news",
  "page",
  "person",
  "project",
  "publication",
];

export type FeedCandidate = {
  id: string;
  source: FeedSource;
  title: string;
  href: string;
  excerpt: string | null;
  createdAt: string | null;
  ctaLabel: string;
  /** Set when the button leaves the card title's article. */
  ctaHref?: string | null;
};

function feedLimit(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isInteger(value)) return FEED_LIMIT_DEFAULT;
  return Math.min(FEED_LIMIT_MAX, Math.max(1, value));
}

function feedSources(values: string[] | null | undefined): FeedSource[] {
  const picked: FeedSource[] = [];
  for (const value of values ?? []) {
    if (!FEED_SOURCES.includes(value as FeedSource)) continue;
    const source = value as FeedSource;
    if (!picked.includes(source)) picked.push(source);
  }
  return picked.length > 0 ? picked : ["news"];
}

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
        limit: feedLimit(section.limit),
        sources: feedSources(section.sources),
      });
      continue;
    }
    if (section._type === "quoteModule") {
      const text = cmsText(section.text);
      if (!text) continue;
      resolved.push({
        key: section._key,
        kind: "quote",
        text,
        author: cmsText(section.author),
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

/** Newest documents first. Missing dates sink. `limit` and `sources` come from the section. */
export function selectFeedItems(
  candidates: FeedCandidate[],
  section: { limit: number; sources: readonly FeedSource[] },
): FeedCandidate[] {
  const allowed = new Set(section.sources);
  return candidates
    .filter((item) => allowed.has(item.source))
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    })
    .slice(0, section.limit);
}

function feedHref(source: FeedSource, doc: ContentFeedDoc): string {
  const slug = doc.slug?.trim() ?? "";
  if (source === "news") {
    return publicPathForPage({ slug, isNews: true });
  }
  if (source === "page") return publicPathForPage({ slug });
  if (source === "person") return personPath(slug);
  if (source === "project") return projectPath(slug);
  return publicationPath(slug);
}

/** Flatten the per-kind pools into linkable cards. Order is applied later, per section. */
export function toFeedCandidates(pool: ContentFeedPool | null | undefined): FeedCandidate[] {
  if (!pool) return [];
  const candidates: FeedCandidate[] = [];
  for (const source of FEED_SOURCES) {
    for (const doc of pool[source] ?? []) {
      const slug = doc.slug?.trim();
      const rawTitle = cmsText(doc.title);
      if (!slug || !rawTitle) continue;
      const title =
        source === "news" ? rawTitle.replace(/^\[Aktualność\]\s*/i, "").trim() : rawTitle;
      if (!title) continue;
      const href = feedHref(source, doc);
      const custom = source === "news" ? newsCta({ slug, ctaHref: doc.ctaHref, ctaLabel: doc.ctaLabel }) : null;
      candidates.push({
        id: doc._id,
        source,
        title,
        href: custom?.articleHref ?? href,
        excerpt: clip(cmsText(doc.excerpt)),
        createdAt:
          source === "news"
            ? cmsText(doc.publishedAt) || cmsText(doc._createdAt)
            : cmsText(doc._createdAt),
        ctaLabel: custom?.label ?? defaultCta(
          source === "person" || source === "project" ? source : "page",
        ),
        ctaHref: custom?.ctaHref ?? null,
      });
    }
  }
  return candidates;
}
