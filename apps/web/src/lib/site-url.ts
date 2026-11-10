/**
 * Public origin and whether search engines may index.
 *
 * NEXT_PUBLIC_SITE_URL is the apex and is set on domain day.
 * Indexing stays off while the cover is up. At premiere set
 * NEXT_PUBLIC_SITE_INDEX=true and rebuild. Any other value stays noindex.
 */

const FALLBACK_ORIGIN = "https://dramaway.netlify.app";

export function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_ORIGIN;
  return raw.replace(/\/+$/, "");
}

export function siteIndexingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEX === "true";
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return path.startsWith("/") ? `${origin}${path}` : `${origin}/${path}`;
}
