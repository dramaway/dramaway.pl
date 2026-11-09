import { COVER_QUERY_PARAM, COVER_VARIANTS } from "../components/cover/cover-copy";

/** Cookie that unlocks the real site while the cover gate is on. */
export const PREVIEW_COOKIE = "dw_preview";

/** `?podglad=` sets the preview cookie. The value is the secret. */
export const PREVIEW_PARAM = "podglad";

/** Internal route. Public traffic never stays on this path while the gate is on. */
export const COVER_ROUTE = "/zajawka";

/** Request header set on the internal rewrite so a second pass does not bounce. */
export const COVER_REWRITE_HEADER = "x-dw-cover";

export const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30;

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Netlify-CDN-Cache-Control": "no-store",
} as const;

export function coverNoStoreHeaders(): Record<string, string> {
  return { ...NO_STORE_HEADERS };
}

export type CoverDecision =
  | { action: "next"; noStore: boolean }
  | { action: "rewrite"; noStore: true }
  | {
      action: "redirect";
      pathname: string;
      search: string;
      setCookie: boolean;
    };

type Input = {
  pathname: string;
  searchParams: URLSearchParams;
  previewCookie: string;
  /** True only when COVER_MODE=on. A missing secret still closes the site. */
  coverMode: boolean;
  secret: string;
  /** Set when this request is the internal rewrite of `/` onto the cover route. */
  internalCover: boolean;
};

/**
 * Constant-time compare. An empty expected secret never matches, so a typo
 * in Netlify cannot open the site.
 */
export function secretsMatch(given: string, expected: string): boolean {
  if (!expected) return false;
  const length = Math.max(given.length, expected.length);
  let mismatch = given.length === expected.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    const left = i < given.length ? given.charCodeAt(i) : 0;
    const right = i < expected.length ? expected.charCodeAt(i) : 0;
    mismatch |= left ^ right;
  }
  return mismatch === 0;
}

function isPassedThrough(pathname: string): boolean {
  if (pathname === "/_next" || pathname.startsWith("/_next/")) return true;
  if (pathname === "/api" || pathname.startsWith("/api/")) return true;
  const segment = pathname.slice(pathname.lastIndexOf("/") + 1);
  const dot = segment.lastIndexOf(".");
  return dot > 0 && dot < segment.length - 1;
}

function variantSearch(params: URLSearchParams): string {
  const value = params.get(COVER_QUERY_PARAM);
  if (!value) return "";
  const index = Number(value);
  if (!COVER_VARIANTS.includes(index as (typeof COVER_VARIANTS)[number])) {
    return "";
  }
  return `${COVER_QUERY_PARAM}=${index}`;
}

function withoutPreviewParam(params: URLSearchParams): string {
  const next = new URLSearchParams(params);
  next.delete(PREVIEW_PARAM);
  return next.toString();
}

/**
 * Public visitors land on `/` (rewrite) or are sent there (302).
 * A matching preview cookie or `?podglad=` keeps the real URL.
 */
export function decideCover(input: Input): CoverDecision {
  if (!input.coverMode) return { action: "next", noStore: false };
  if (isPassedThrough(input.pathname)) return { action: "next", noStore: false };

  if (
    input.internalCover &&
    (input.pathname === COVER_ROUTE || input.pathname === `${COVER_ROUTE}/`)
  ) {
    return { action: "next", noStore: true };
  }

  const preview = secretsMatch(input.previewCookie, input.secret);
  const queryUnlock = secretsMatch(
    input.searchParams.get(PREVIEW_PARAM) ?? "",
    input.secret,
  );

  if (queryUnlock) {
    const pathname =
      input.pathname === COVER_ROUTE || input.pathname === `${COVER_ROUTE}/`
        ? "/"
        : input.pathname;
    return {
      action: "redirect",
      pathname,
      search: withoutPreviewParam(input.searchParams),
      setCookie: true,
    };
  }

  if (preview) return { action: "next", noStore: true };

  if (input.pathname === "/") {
    if (input.searchParams.has(PREVIEW_PARAM)) {
      return {
        action: "redirect",
        pathname: "/",
        search: variantSearch(input.searchParams),
        setCookie: false,
      };
    }
    return { action: "rewrite", noStore: true };
  }

  return {
    action: "redirect",
    pathname: "/",
    search: variantSearch(input.searchParams),
    setCookie: false,
  };
}
