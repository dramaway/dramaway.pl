import { czytelniaPath } from "./routes";
import type {
  PublicationFormat,
  PublicationListItem,
  ReadingMethodListItem,
} from "./sanity/types";

export const PUBLICATION_FORMATS = [
  "articles",
  "books",
  "scripts",
  "multimedia",
] as const satisfies readonly PublicationFormat[];

/** Landing `/czytelnia` prefers this drawer when it has listed items. */
export const DEFAULT_PUBLICATION_FORMAT = "articles" satisfies PublicationFormat;

export type PublicationCategoryGroup = {
  slug: string;
  title: string;
  items: PublicationListItem[];
};

export type CategoryListing =
  | { kind: "flat"; items: PublicationListItem[] }
  | { kind: "grouped"; groups: PublicationCategoryGroup[] };

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

export function formatsWithItems(
  publications: PublicationListItem[],
): PublicationFormat[] {
  return PUBLICATION_FORMATS.filter((format) =>
    publications.some(
      (item) => (item.format ?? DEFAULT_PUBLICATION_FORMAT) === format,
    ),
  );
}

export function resolvePublicationFormat(
  rodzaj: string | undefined,
  available: PublicationFormat[],
): PublicationFormat {
  if (isPublicationFormat(rodzaj) && available.includes(rodzaj)) {
    return rodzaj;
  }
  if (available.includes(DEFAULT_PUBLICATION_FORMAT)) {
    return DEFAULT_PUBLICATION_FORMAT;
  }
  return available[0] ?? DEFAULT_PUBLICATION_FORMAT;
}

export function czytelniaFilterHref(rodzaj?: string | null): string {
  const format = rodzaj || DEFAULT_PUBLICATION_FORMAT;
  if (format === DEFAULT_PUBLICATION_FORMAT) return czytelniaPath();
  return `${czytelniaPath()}?rodzaj=${encodeURIComponent(format)}`;
}

export function filterPublicationsByFormat(
  publications: PublicationListItem[],
  rodzaj: PublicationFormat,
): PublicationListItem[] {
  return publications.filter(
    (item) => (item.format ?? DEFAULT_PUBLICATION_FORMAT) === rodzaj,
  );
}

function methodSlugs(item: PublicationListItem): string[] {
  return (item.methods ?? [])
    .map((method) => method.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export function groupPublicationsByCategory(
  publications: PublicationListItem[],
  categories: ReadingMethodListItem[],
  uncategorizedTitle: string,
): CategoryListing {
  const ordered = [...categories]
    .filter((category): category is ReadingMethodListItem & { slug: string } =>
      Boolean(category.slug),
    )
    .sort((a, b) => a.order - b.order);
  const known = new Set(ordered.map((category) => category.slug));
  const groups: PublicationCategoryGroup[] = [];

  for (const category of ordered) {
    const items = publications.filter((item) =>
      methodSlugs(item).includes(category.slug),
    );
    if (items.length === 0) continue;
    groups.push({
      slug: category.slug,
      title: category.title,
      items,
    });
  }

  if (groups.length === 0) {
    return { kind: "flat", items: publications };
  }

  const rest = publications.filter(
    (item) => !methodSlugs(item).some((slug) => known.has(slug)),
  );
  if (rest.length > 0) {
    groups.push({
      slug: "pozostale",
      title: uncategorizedTitle,
      items: rest,
    });
  }

  return { kind: "grouped", groups };
}
