import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COVER_REWRITE_HEADER,
  COVER_ROUTE,
  canonicalHostRedirect,
  decideCover,
  coverNoStoreHeaders,
  PREVIEW_COOKIE,
  PREVIEW_MAX_AGE,
} from "@/lib/cover-gate";
import redirectsJson from "@/data/legacy-redirects.json";
import {
  isAllowedLegacyTarget,
  lookupLegacyRedirect,
} from "@/lib/legacy-redirects";

const legacyRedirects = redirectsJson as Record<string, string>;

function firstHeaderValue(value: string | null): string {
  if (!value) return "";
  return value.split(",")[0]?.trim() ?? "";
}

/**
 * `request.nextUrl` is the server host (localhost in dev, sometimes an
 * internal name on Netlify). The visitor host is `host`. When that header
 * has been rewritten, Netlify puts the original host in `x-forwarded-host`.
 */
function visitorUrls(request: NextRequest): URL[] {
  const names = [
    firstHeaderValue(request.headers.get("host")),
    firstHeaderValue(request.headers.get("x-forwarded-host")),
  ];
  const urls: URL[] = [];
  for (const name of names) {
    if (!name) continue;
    try {
      const url = request.nextUrl.clone();
      url.host = name;
      urls.push(url);
    } catch {
      // A malformed host must not block the request.
    }
  }
  return urls;
}

export function middleware(request: NextRequest) {
  for (const url of visitorUrls(request)) {
    const canonical = canonicalHostRedirect(url);
    if (canonical) return NextResponse.redirect(canonical, 301);
  }

  const legacyTarget = lookupLegacyRedirect(
    request.nextUrl.pathname,
    request.nextUrl.search,
    legacyRedirects,
  );
  if (legacyTarget) {
    const redirect = redirectLegacy(request, legacyTarget);
    if (redirect) return redirect;
  }

  const secret = process.env.COVER_SECRET?.trim() ?? "";
  const decision = decideCover({
    pathname: request.nextUrl.pathname,
    searchParams: request.nextUrl.searchParams,
    previewCookie: request.cookies.get(PREVIEW_COOKIE)?.value ?? "",
    coverMode: process.env.COVER_MODE === "on",
    secret,
    internalCover: request.headers.get(COVER_REWRITE_HEADER) === "1",
  });

  if (decision.action === "rewrite") {
    const url = request.nextUrl.clone();
    url.pathname = COVER_ROUTE;
    url.search = "";
    const headers = new Headers(request.headers);
    headers.set(COVER_REWRITE_HEADER, "1");
    const response = NextResponse.rewrite(url, {
      request: { headers },
      headers: coverNoStoreHeaders(),
    });
    return response;
  }

  if (decision.action === "redirect") {
    const url = request.nextUrl.clone();
    url.pathname = decision.pathname;
    url.search = decision.search;
    const response = NextResponse.redirect(url, 302);
    if (decision.setCookie && secret) {
      response.cookies.set({
        name: PREVIEW_COOKIE,
        value: secret,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: PREVIEW_MAX_AGE,
      });
    } else if (decision.clearCookie) {
      response.cookies.set({
        name: PREVIEW_COOKIE,
        value: "",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
    return response;
  }

  const response = NextResponse.next();
  if (decision.noStore) {
    for (const [key, value] of Object.entries(coverNoStoreHeaders())) {
      response.headers.set(key, value);
    }
  }
  return response;
}

function redirectLegacy(request: NextRequest, target: string) {
  if (!isAllowedLegacyTarget(target)) return null;
  if (/^https?:\/\//i.test(target)) return NextResponse.redirect(target, 301);
  const url = new URL((visitorUrls(request)[0] ?? request.nextUrl).href);
  const next = new URL(target, url.origin);
  url.pathname = next.pathname;
  url.search = next.search;
  url.hash = "";
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
