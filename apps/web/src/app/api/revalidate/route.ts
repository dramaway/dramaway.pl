import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { SANITY_CACHE_TAG } from "@/lib/sanity/cache";

export const dynamic = "force-dynamic";

function secretsEqual(given: string, expected: string): boolean {
  const left = Buffer.from(given);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function providedSecret(request: Request): string {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  return new URL(request.url).searchParams.get("secret")?.trim() ?? "";
}

/**
 * Sanity → Netlify: bust the published HTML cache after Studio publish.
 * Free on both sides at this traffic. Fallback remains ISR 60s if the hook is down.
 */
export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!expected) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  if (!secretsEqual(providedSecret(request), expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: Date.now() });
}
