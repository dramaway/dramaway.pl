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

export function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export function czytelniaFilterHref(filters: {
  rodzaj?: string | null;
  kategoria?: string | null;
}): string {
  const params = new URLSearchParams();
  if (filters.rodzaj) params.set("rodzaj", filters.rodzaj);
  if (filters.kategoria) params.set("kategoria", filters.kategoria);
  const query = params.toString();
  return query ? `${czytelniaPath()}?${query}` : czytelniaPath();
}

export function filterPublications(
  publications: PublicationListItem[],
  filters: { rodzaj?: string; kategoria?: string },
): PublicationListItem[] {
  return publications.filter((item) => {
    if (filters.rodzaj && item.format !== filters.rodzaj) return false;
    if (filters.kategoria) {
      const slugs = (item.methods ?? [])
        .map((method) => method.slug)
        .filter(Boolean);
      if (!slugs.includes(filters.kategoria)) return false;
    }
    return true;
  });
}
