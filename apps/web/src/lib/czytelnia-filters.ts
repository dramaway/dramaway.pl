import { czytelniaPath } from "./routes";
import type {
  PublicationFormat,
  PublicationListItem,
} from "./sanity/types";

export const PUBLICATION_FORMATS = [
  "articles",
  "books",
  "scripts",
  "multimedia",
] as const satisfies readonly PublicationFormat[];

/** Landing `/czytelnia` is this drawer; Figma always has one switch on. */
export const DEFAULT_PUBLICATION_FORMAT = "articles" satisfies PublicationFormat;

export function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export function isPublicationFormat(
  value: string | undefined,
): value is PublicationFormat {
  return PUBLICATION_FORMATS.some((format) => format === value);
}

export function resolvePublicationFormat(
  rodzaj: string | undefined,
): PublicationFormat {
  return isPublicationFormat(rodzaj) ? rodzaj : DEFAULT_PUBLICATION_FORMAT;
}

export function czytelniaFilterHref(filters: {
  rodzaj?: string | null;
  kategoria?: string | null;
}): string {
  const params = new URLSearchParams();
  const format = filters.rodzaj || DEFAULT_PUBLICATION_FORMAT;
  if (format !== DEFAULT_PUBLICATION_FORMAT) {
    params.set("rodzaj", format);
  }
  if (filters.kategoria) params.set("kategoria", filters.kategoria);
  const query = params.toString();
  return query ? `${czytelniaPath()}?${query}` : czytelniaPath();
}

export function filterPublications(
  publications: PublicationListItem[],
  filters: { rodzaj: PublicationFormat; kategoria?: string },
): PublicationListItem[] {
  return publications.filter((item) => {
    if (item.format !== filters.rodzaj) return false;
    if (filters.kategoria) {
      const slugs = (item.methods ?? [])
        .map((method) => method.slug)
        .filter(Boolean);
      if (!slugs.includes(filters.kategoria)) return false;
    }
    return true;
  });
}
