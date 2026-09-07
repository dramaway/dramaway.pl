/**
 * Public origin and whether search engines may index.
 *
 * Preview (dramaway.netlify.app) stays noindex until cutover.
 * At domain launch set both in Netlify:
 *   NEXT_PUBLIC_SITE_URL=https://fundacja.dramaway.pl
 *   NEXT_PUBLIC_SITE_INDEX=true
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
