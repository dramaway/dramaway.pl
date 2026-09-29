/**
 * Public URL map for the foundation site.
 *
 * A `page` document picks its prefix with `section` (`root`, `projekty`,
 * `fundacja`). News slugs (`aktualnosc-`) stay flat: `/{slug without prefix}`.
 * `project` documents always live at `/projekty/{slug}`.
 *
 * Launch redirects (node/N, leftover edition landings, news aliases) are a
 * separate map — do not grow this file into that list.
 */

export const DEFAULT_CENTRUM_URL = "https://centrum.dramaway.pl";

export const NEWS_SLUG_PREFIX = "aktualnosc-";

export type PageSection = "root" | "projekty" | "fundacja";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  children?: NavItem[];
};

export function czytelniaPath() {
  return "/czytelnia";
}

export function knowledgeHubPath() {
  return "/baza-wiedzy";
}

export function publicationPath(slug: string) {
  return `/czytelnia/${slug}`;
}

export function methodsPath() {
  return "/metody";
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
      children: [
        { href: methodsPath(), label: "Metody" },
        { href: czytelniaPath(), label: "Czytelnia" },
      ],
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

export function fundacjaPath(slug: string) {
  return `/fundacja/${slug}`;
}

export function newsPublicSlug(sanitySlug: string) {
  return sanitySlug.startsWith(NEWS_SLUG_PREFIX)
    ? sanitySlug.slice(NEWS_SLUG_PREFIX.length)
    : sanitySlug;
}

export function pageSection(value: string | null | undefined): PageSection {
  if (value === "projekty" || value === "fundacja") return value;
  return "root";
}

/** Public href for a Sanity `page`. News prefix wins over `section`. */
export function publicPathForPage(page: {
  slug: string;
  section?: string | null;
  isNews?: boolean | null;
}) {
  if (page.isNews || page.slug.startsWith(NEWS_SLUG_PREFIX)) {
    return `/${newsPublicSlug(page.slug)}`;
  }
  const section = pageSection(page.section);
  if (section === "fundacja") return fundacjaPath(page.slug);
  if (section === "projekty") return projectPath(page.slug);
  return `/${page.slug}`;
}

export function publicPathForProjectSlug(slug: string) {
  return projectPath(slug);
}

export function publicPathForPersonSlug(slug: string) {
  return personPath(slug);
}
