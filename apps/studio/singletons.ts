/** Desk pins and schema types that must not appear as generic lists. */

export const LANDING_PAGES = [
  {
    id: "landing-projekty",
    route: "projekty",
    title: "Projekty",
  },
  {
    id: "landing-baza-wiedzy",
    route: "baza-wiedzy",
    title: "Baza wiedzy",
  },
  {
    id: "landing-czytelnia",
    route: "czytelnia",
    title: "Czytelnia",
  },
  {
    id: "landing-zespol",
    route: "zespol",
    title: "Zespół",
  },
] as const;

export const ABOUT_PAGE_ID = "aboutPage";
export const ART_GENERACJE_ID = "project-art-generacje";

/** Existing `page` documents pinned at the top of the desk. */
export const PINNED_PAGE_SLUGS = ["metody", "kontakt"] as const;

export const SINGLETON_SCHEMA_TYPES = new Set<string>([
  "aboutPage",
  "landingPage",
  "siteSettings",
]);
