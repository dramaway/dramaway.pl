/** Leftover Drupal pages editors are expected to retire. Not live pages that merely came from the dump. */
export const DRUPAL_PAGE_SLUGS = [
  "projekty-zakonczone",
  "portal-wiedzy",
  "szkolenia",
  "art-generacje-0",
  "art-generacje",
  "teatr-codzienny",
  "to-mi-gra",
  "boal-practice",
] as const;

const drupalSlugs = new Set<string>(DRUPAL_PAGE_SLUGS);

export const PAGE_DRUPAL_FILTER = `_type == "page" && slug.current in $drupal`;
export const PAGE_NEWS_FILTER = `_type == "page" && slug.current match "aktualnosc-*" && !(slug.current in $drupal)`;
export const PAGE_MENU_FILTER = `_type == "page" && _id in $pinned && !(slug.current in $drupal) && !(slug.current match "aktualnosc-*")`;
export const PAGE_REST_FILTER = `_type == "page" && !(_id in $pinned) && !(slug.current in $drupal) && !(slug.current match "aktualnosc-*")`;

/** Published id and its draft, so a Studio list does not split one document. */
export function pageDeskIds(ids: readonly string[]): string[] {
  const all = new Set<string>();
  for (const id of ids) {
    if (!id) continue;
    const published = id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
    all.add(published);
    all.add(`drafts.${published}`);
  }
  return [...all];
}

export type PageDeskFolder = "drupal" | "news" | "menu" | "rest";

/**
 * Which Page folder a document belongs in.
 * Drupal wins, then news, then a menu pin, then the rest.
 */
export function pageDeskFolder(
  page: { id: string; slug?: string | null },
  pinnedPublishedIds: readonly string[],
): PageDeskFolder {
  const slug = page.slug ?? "";
  if (drupalSlugs.has(slug)) return "drupal";
  if (slug.startsWith("aktualnosc-")) return "news";
  const published = page.id.startsWith("drafts.")
    ? page.id.slice("drafts.".length)
    : page.id;
  if (pinnedPublishedIds.includes(published)) return "menu";
  return "rest";
}
