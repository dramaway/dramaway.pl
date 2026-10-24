/**
 * Public URL map for the foundation site.
 *
 * The prefix comes from the document type, not from the menu and not from a
 * field on the page: `project` → `/projekty`, `person` → `/zespol`,
 * `publication` → `/czytelnia`, `page` → `/{slug}`, `news` → `/{slug}`.
 * A leftover `aktualnosc-` prefix is still stripped so old news pages keep their URL.
 *
 * Launch redirects (node/N, leftover edition landings, news aliases) are a
 * separate map — do not grow this file into that list.
 * `/metody` permanently redirects to `/baza-wiedzy`. The methods essay is that page.
 */

export const DEFAULT_CENTRUM_URL = "https://centrum.dramaway.pl";

export const NEWS_SLUG_PREFIX = "aktualnosc-";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  children?: NavItem[];
};

export function knowledgeHubPath() {
  return "/baza-wiedzy";
}

export function publicationPath(slug: string) {
  return `/czytelnia/${slug}`;
}

/**
 * Built-in header. Used when `siteSettings.navigation` is empty.
 * Home is filtered out of the visible nav (the logo links to /).
 */
export function mainNav(): NavItem[] {
  return [
    { href: "/", label: "Strona główna" },
    { href: "/projekty", label: "Projekty" },
    {
      href: knowledgeHubPath(),
      label: "Baza wiedzy",
    },
    { href: "/fundacja", label: "O fundacji" },
    { href: "/kontakt", label: "Kontakt" },
  ];
}

export function projectPath(slug: string) {
  return `/projekty/${slug}`;
}

export function editionPath(projectSlug: string, editionSlug: string) {
  return `/projekty/${projectSlug}/${editionSlug}`;
}

export function personPath(slug: string) {
  return `/zespol/${slug}`;
}

export function newsPublicSlug(sanitySlug: string) {
  return sanitySlug.startsWith(NEWS_SLUG_PREFIX)
    ? sanitySlug.slice(NEWS_SLUG_PREFIX.length)
    : sanitySlug;
}

/** Public href for a Sanity `page`, or a `news` item when `isNews` is set. */
export function publicPathForPage(page: {
  slug: string;
  isNews?: boolean | null;
}) {
  if (page.isNews || page.slug.startsWith(NEWS_SLUG_PREFIX)) {
    return `/${newsPublicSlug(page.slug)}`;
  }
  return `/${page.slug}`;
}

export function publicPathForProjectSlug(slug: string) {
  return projectPath(slug);
}

export function publicPathForPersonSlug(slug: string) {
  return personPath(slug);
}
