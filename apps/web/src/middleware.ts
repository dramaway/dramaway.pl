import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COVER_REWRITE_HEADER,
  COVER_ROUTE,
  decideCover,
  coverNoStoreHeaders,
  PREVIEW_COOKIE,
  PREVIEW_MAX_AGE,
} from "@/lib/cover-gate";

export function middleware(request: NextRequest) {
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

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
