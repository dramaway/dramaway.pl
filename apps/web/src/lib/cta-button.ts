import { hrefForDocument } from "./navigation";
import { safeHref } from "./safe-url";

/**
 * Portable Text block `ctaButton`.
 * Studio fields `hash` and `query` must stay in sync with the normalizers below.
 */

export type CtaButtonDocument = {
  _type?: string | null;
  slug?: string | null;
  route?: string | null;
};

export type CtaButtonInput = {
  label?: string | null;
  /** 0–3 steps of `--pt-indent`, same stop as the Indent list. */
  indent?: number | string | null;
  target?: string | null;
  href?: string | null;
  hash?: string | null;
  query?: string | null;
  page?: CtaButtonDocument | null;
  file?: { asset?: { url?: string | null } | null } | null;
};

/** Indent steps that match the Indent list. Anything else stays flush left. */
export function ctaIndentLevel(raw: number | string | null | undefined): 0 | 1 | 2 | 3 {
  const level = typeof raw === "number" ? raw : Number(raw);
  if (level === 1 || level === 2 || level === 3) return level;
  return 0;
}

export type ResolvedCtaButton = {
  href: string;
  label: string;
};

/** `#edycje` or `edycje`. Empty stays empty. Anything with whitespace or `?` is dropped. */
export function normalizeHash(raw: string | null | undefined): string | null {
  const value = raw?.trim() ?? "";
  if (!value) return null;
  const body = value.startsWith("#") ? value.slice(1) : value;
  if (!body || /[\s?#]/.test(body) || /[\u0000-\u001f\u007f]/.test(body)) return null;
  return `#${body}`;
}

/** `?rodzaj=books` or `rodzaj=books`. A `#` belongs in the anchor field. */
export function normalizeQuery(raw: string | null | undefined): string | null {
  const value = raw?.trim() ?? "";
  if (!value) return null;
  const body = value.startsWith("?") ? value.slice(1) : value;
  if (!body || /[\s#]/.test(body) || /[\u0000-\u001f\u007f]/.test(body)) return null;
  if (/javascript:/i.test(body) || /data:/i.test(body)) return null;
  return `?${body}`;
}

/** Append a fragment and query. An anchor here replaces one already on the base. */
export function withLinkExtras(
  href: string,
  extras: { hash?: string | null; query?: string | null },
): string {
  const hash = normalizeHash(extras.hash);
  const query = normalizeQuery(extras.query);
  if (!hash && !query) return href;

  const baseHashAt = href.indexOf("#");
  const baseHash = baseHashAt === -1 ? "" : href.slice(baseHashAt);
  let base = baseHashAt === -1 ? href : href.slice(0, baseHashAt);

  if (query) {
    const params = query.slice(1);
    base += base.includes("?") ? `&${params}` : `?${params}`;
  }

  return base + (hash ?? baseHash);
}

function documentHref(page: CtaButtonDocument | null | undefined): string | null {
  if (!page?._type) return null;
  return hrefForDocument({
    _type: page._type,
    slug: page.slug,
    route: page.route,
  });
}

function rawHref(value: CtaButtonInput): string | null {
  const target = value.target ?? "reference";
  if (target === "file") return value.file?.asset?.url?.trim() || null;
  if (target === "url") return value.href?.trim() || null;
  if (target === "reference") return documentHref(value.page);
  return null;
}

/**
 * Green CTA from a Portable Text button.
 * Missing label, missing target, or a disallowed scheme yields nothing on the page.
 */
export function resolveCtaButton(
  value: CtaButtonInput | null | undefined,
): ResolvedCtaButton | null {
  const label = value?.label?.trim() ?? "";
  if (!value || !label) return null;

  const raw = rawHref(value);
  if (!raw) return null;

  const safe = safeHref(withLinkExtras(raw, { hash: value.hash, query: value.query }));
  if (!safe || (safe.kind !== "path" && safe.kind !== "http" && safe.kind !== "hash")) {
    return null;
  }

  return { href: safe.href, label };
}
