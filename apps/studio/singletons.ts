/** Fixed document ids for the empty-menu desk fallback, and types hidden from the generic lists. */

export const LANDING_PAGES = [
  {
    id: "landing-projekty",
    route: "projekty",
    title: "Projekty",
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

export const SINGLETON_SCHEMA_TYPES = new Set<string>([
  "aboutPage",
  "landingPage",
  "siteSettings",
]);
