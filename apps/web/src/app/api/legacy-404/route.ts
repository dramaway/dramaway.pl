import { NextResponse } from "next/server";
import pathsJson from "@/data/legacy-paths.json";
import {
  classifyLegacyMiss,
  normalizeLegacyPath,
  type LegacyPathEntry,
  type LegacySuggestion,
} from "@/lib/legacy-redirects";
import { getLegacySuggestionSources } from "@/lib/sanity/fetch";

const legacyPaths = pathsJson as LegacyPathEntry[];

export const revalidate = 60;

const MAX_PATH = 512;

/**
 * Classifies a missed URL for the static 404 page.
 * The page itself must not read request headers, or Next marks the whole
 * site as dynamic and drops the shared CDN cache.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawPath = url.searchParams.get("path") ?? "/";
  const q = url.searchParams.get("q") ?? "";
  if (rawPath.length > MAX_PATH || q.length > MAX_PATH) {
    return NextResponse.json(emptyMiss("/"));
  }
  const path = normalizeLegacyPath(rawPath, q ? `?q=${q}` : "");
  const entry = legacyPaths.find((row) => row.path === path) ?? null;
  const documents = await getLegacySuggestionSources();
  const miss = classifyLegacyMiss({ path, entry, documents });
  const suggestions: LegacySuggestion[] = miss.kind === "A" || miss.kind === "C" ? miss.suggestions : [];
  return NextResponse.json(
    { path, kind: miss.kind, suggestions },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
      },
    },
  );
}

function emptyMiss(path: string) {
  return { path, kind: "C" as const, suggestions: [] as LegacySuggestion[] };
}
