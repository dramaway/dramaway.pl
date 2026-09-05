/**
 * Public URL map for the foundation site.
 *
 * Prefixes follow docs/concept/ia.md (same spine as live Drupal).
 * The last path segment is `slug.current` from Sanity (from Drupal url_alias).
 *
 * Launch redirects (node/N, leftover edition landings, news aliases) are a
 * separate map — do not grow this file into that list.
 */

export const DEFAULT_CENTRUM_URL = "https://centrum.dramaway.pl";

export const NEWS_SLUG_PREFIX = "aktualnosc-";

/** Pages that live under /fundacja/[slug] (Drupal /fundacja/…). */
export const FUNDACJA_PAGE_SLUGS = [
  "zarzad-i-fundatorzy",
  "statut",
  "sprawozdania",
  "jak-nas-wesprzec",
] as const;

/** Pages that live under /projekty/[slug] but are not `project` documents. */
export const PROJECT_SECTION_PAGE_SLUGS = [
  "wydawnictwo",
  "projekty-zakonczone",
  "portal-wiedzy",
  "szkolenia",
  "art-generacje-0",
] as const;

/** Pages copied onto `project` — public URL is the project, not the leftover page. */
export const PROJECT_DOCUMENT_SLUGS = [
  "art-generacje",
  "teatr-codzienny",
  "to-mi-gra",
  "boal-practice",
] as const;

const fundacjaSet = new Set<string>(FUNDACJA_PAGE_SLUGS);
const projectSectionSet = new Set<string>(PROJECT_SECTION_PAGE_SLUGS);
const projectDocumentSet = new Set<string>(PROJECT_DOCUMENT_SLUGS);

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

/** Header items from the Figma homepage. Home is filtered out of the visible nav. */
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

export function isFundacjaPageSlug(slug: string) {
  return fundacjaSet.has(slug);
}

export function isProjectSectionPageSlug(slug: string) {
  return projectSectionSet.has(slug);
}

export function isProjectDocumentSlug(slug: string) {
  return projectDocumentSet.has(slug);
}

export function newsPublicSlug(sanitySlug: string) {
  return sanitySlug.startsWith(NEWS_SLUG_PREFIX)
    ? sanitySlug.slice(NEWS_SLUG_PREFIX.length)
    : sanitySlug;
}

/** Public href for a Sanity `page` slug. */
export function publicPathForPageSlug(slug: string) {
  if (isFundacjaPageSlug(slug)) return fundacjaPath(slug);
  if (isProjectSectionPageSlug(slug) || isProjectDocumentSlug(slug)) {
    return projectPath(slug);
  }
  if (slug.startsWith(NEWS_SLUG_PREFIX)) {
    return `/${newsPublicSlug(slug)}`;
  }
  return `/${slug}`;
}

export function publicPathForProjectSlug(slug: string) {
  return projectPath(slug);
}

export function publicPathForPersonSlug(slug: string) {
  return personPath(slug);
}
