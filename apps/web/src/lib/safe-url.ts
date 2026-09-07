/**
 * Allowlist for hrefs that may come from CMS (Portable Text, CTA fields).
 * Permits http(s), mailto, in-page hashes, and root-relative paths without `//`.
 */

export type SafeHrefKind = "path" | "hash" | "http" | "mailto";

export type SafeHref = {
  href: string;
  kind: SafeHrefKind;
};

const MAILTO_RE = /^mailto:[^\s<>]+$/i;
const HASH_RE = /^#[\w.~:/%-]*$/u;

function looksDangerous(href: string): boolean {
  const lower = href.trim().toLowerCase();
  return (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  );
}

/** Sanitize a CMS (or chrome) href. Null = do not render as a link. */
export function safeHref(raw: string | null | undefined): SafeHref | null {
  const href = raw?.trim();
  if (!href || looksDangerous(href)) return null;

  if (href.startsWith("//") || href.startsWith("/\\")) return null;

  if (HASH_RE.test(href)) {
    return { href, kind: "hash" };
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
    return { href, kind: "path" };
  }

  if (MAILTO_RE.test(href)) {
    return { href, kind: "mailto" };
  }

  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { href: url.href, kind: "http" };
  } catch {
    return null;
  }
}

export function safeHrefString(raw: string | null | undefined): string | null {
  return safeHref(raw)?.href ?? null;
}
