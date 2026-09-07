import { safeHrefString } from "./safe-url";

/** Trim a CMS string. Empty or whitespace-only → null (do not render). */
export function cmsText(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/** CTA only when both label and an allowlisted target are set. */
export function cmsCta(
  label: string | null | undefined,
  href: string | null | undefined,
): { label: string; href: string } | null {
  const ctaLabel = cmsText(label);
  const ctaHref = safeHrefString(href);
  if (!ctaLabel || !ctaHref) return null;
  return { label: ctaLabel, href: ctaHref };
}
