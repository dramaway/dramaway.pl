import { knowledgeHubPath, projectPath, publicationPath, personPath, publicPathForPage } from "./routes";

/** Request header carrying the path the visitor asked for, for the 404 page. */
export const LEGACY_PATH_HEADER = "x-dw-path";

export type LegacyPathType = "strona" | "aktualność" | "projekt" | "plik";

export type LegacyPathEntry = {
  path: string;
  title: string;
  type: LegacyPathType;
};

export type LegacySuggestion = {
  title: string;
  slug: string;
  href: string;
  typeLabel: string;
  excerpt: string;
};

const STOP_WORDS = new Set([
  "albo",
  "bardzo",
  "bedzie",
  "będzie",
  "gdzie",
  "jednak",
  "jesli",
  "jeśli",
  "jeszcze",
  "jezeli",
  "jeżeli",
  "jako",
  "jest",
  "kiedy",
  "ktora",
  "która",
  "ktore",
  "które",
  "ktorego",
  "którego",
  "ktorej",
  "której",
  "ktorzy",
  "którzy",
  "ktorych",
  "których",
  "ktory",
  "który",
  "ktorym",
  "którym",
  "miedzy",
  "między",
  "moze",
  "może",
  "mozna",
  "można",
  "oraz",
  "potem",
  "przed",
  "przez",
  "przy",
  "swojego",
  "swoich",
  "swojej",
  "takze",
  "także",
  "tego",
  "teraz",
  "tutaj",
  "tylko",
  "wtedy",
  "wiec",
  "więc",
  "zostal",
  "został",
  "zostala",
  "została",
  "zostalo",
  "zostało",
  "zostaly",
  "zostały",
]);

/**
 * Canonical key for an old Drupal path.
 * Decodes percent-encoding (including Polish letters), lowercases, and drops
 * a trailing slash. `?q=` and `index.php?q=` become the path they name.
 */
export function normalizeLegacyPath(
  pathname: string,
  search = "",
): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const q = params.get("q");
  let path = pathname || "/";
  if (q && usesDrupalQueryPath(path)) {
    path = q;
  }
  path = decodeLegacyPath(path);
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      path = url.pathname;
    } catch {
      // Keep the decoded text and treat it as a path below.
    }
  }
  path = path.split("?")[0] ?? path;
  path = path.replace(/\\/g, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  try {
    path = decodeLegacyPath(path);
  } catch {
    // Already decoded, or the sequence is not valid UTF-8.
  }
  path = path.toLowerCase();
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
}

function usesDrupalQueryPath(pathname: string): boolean {
  const bare = pathname.replace(/\/+$/, "") || "/";
  return bare === "/" || bare === "/index.php" || bare.endsWith("/index.php");
}

function decodeLegacyPath(value: string): string {
  let current = value;
  for (let i = 0; i < 2; i += 1) {
    if (!/%[0-9a-f]{2}/i.test(current)) break;
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }
  return current;
}

export function lookupLegacyRedirect(
  pathname: string,
  search: string,
  redirects: Record<string, string>,
): string | null {
  const key = normalizeLegacyPath(pathname, search);
  const target = redirects[key];
  if (!target || target === key) return null;
  return target;
}

export function isLegacyFilePath(pathname: string): boolean {
  const path = normalizeLegacyPath(pathname);
  return path.includes("/sites/") && path.includes("/files/");
}

/** Words worth comparing. Drops Polish words under 4 letters and stop-words. */
export function significantTokens(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/[^0-9a-ząćęłńóśźż]+/i)
    .filter(Boolean);
  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const word of words) {
    if (word.length < 4 || STOP_WORDS.has(word) || seen.has(word)) continue;
    seen.add(word);
    tokens.push(word);
  }
  return tokens;
}

/**
 * Up to three documents. A hit needs two shared words, or one word of at
 * least 7 letters that is a whole word of the document title.
 */
export function rankLegacySuggestions(
  sourceText: string,
  documents: LegacySuggestion[],
  limit = 3,
): LegacySuggestion[] {
  const tokens = significantTokens(sourceText);
  if (tokens.length === 0) return [];
  const ranked: { doc: LegacySuggestion; score: number }[] = [];
  for (const doc of documents) {
    const titleWords = new Set(significantTokens(doc.title));
    const slugWords = new Set(significantTokens(doc.slug.replace(/-/g, " ")));
    let score = 0;
    let longTitleHit = false;
    for (const token of tokens) {
      const inTitle = titleWords.has(token);
      if (!inTitle && !slugWords.has(token)) continue;
      score += 1;
      if (inTitle && token.length >= 7) longTitleHit = true;
    }
    if (score >= 2 || longTitleHit) ranked.push({ doc, score });
  }
  const typeRank = (label: string) => (label === "projekt" ? 0 : 1);
  ranked.sort(
    (a, b) =>
      b.score - a.score ||
      typeRank(a.doc.typeLabel) - typeRank(b.doc.typeLabel) ||
      a.doc.title.localeCompare(b.doc.title, "pl"),
  );
  const picked: LegacySuggestion[] = [];
  const seen = new Set<string>();
  for (const item of ranked) {
    if (seen.has(item.doc.href)) continue;
    seen.add(item.doc.href);
    picked.push(item.doc);
    if (picked.length >= limit) break;
  }
  return picked;
}

export type LegacyMiss =
  | { kind: "A"; entry: LegacyPathEntry; suggestions: LegacySuggestion[] }
  | { kind: "B" }
  | { kind: "C"; suggestions: LegacySuggestion[] };

export function classifyLegacyMiss(input: {
  path: string;
  entry: LegacyPathEntry | null;
  documents: LegacySuggestion[];
}): LegacyMiss {
  if (isLegacyFilePath(input.path)) return { kind: "B" };
  if (input.entry) {
    const suggestions = rankLegacySuggestions(input.entry.title, input.documents);
    if (suggestions.length > 0) return { kind: "A", entry: input.entry, suggestions };
    return { kind: "C", suggestions: [] };
  }
  const suggestions = rankLegacySuggestions(
    input.path.replace(/[/_-]+/g, " "),
    input.documents,
  );
  return { kind: "C", suggestions };
}

type RoutedDoc = {
  _type: string;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  summary?: string | null;
};

const TYPE_LABEL: Record<string, string> = {
  project: "projekt",
  page: "strona",
  news: "aktualność",
  publication: "publikacja",
  person: "osoba",
};

/** Public href for a published document, using the same rules as the site. */
export function hrefForSuggestion(doc: RoutedDoc, projectSlugs: Set<string>): string | null {
  const slug = doc.slug?.trim();
  if (!slug || slug === "metody-tzs") return null;
  if (doc._type === "project") return projectPath(slug);
  if (doc._type === "person") return personPath(slug);
  if (doc._type === "publication") return publicationPath(slug);
  if (doc._type === "news") return publicPathForPage({ slug, isNews: true });
  if (slug === "metody") return knowledgeHubPath();
  if (projectSlugs.has(slug)) return projectPath(slug);
  return publicPathForPage({ slug });
}

export function suggestionFromDoc(
  doc: RoutedDoc,
  projectSlugs: Set<string>,
): LegacySuggestion | null {
  const href = hrefForSuggestion(doc, projectSlugs);
  const title = (doc.title || doc.name || "").trim();
  const slug = doc.slug?.trim() || "";
  if (!href || !title || !slug) return null;
  const excerpt = (doc.excerpt || doc.summary || "").replace(/\s+/g, " ").trim();
  return {
    title,
    slug,
    href,
    typeLabel: TYPE_LABEL[doc._type] || "strona",
    excerpt,
  };
}
