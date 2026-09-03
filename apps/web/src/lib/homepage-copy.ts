/**
 * Figma homepage copy — used until the matching Studio fields are filled.
 * One module owns all public fallbacks so hero, sections, and footer stay in sync.
 */

export const EXCERPT_FALLBACK_MAX = 400;

export const NEWS_CTA_LABEL = "czytaj więcej";

/** Layout draft photo, served from `public/` until `homepage.about.image` is set. */
export const FALLBACK_ABOUT_IMAGE = "/about-photo.jpg";

export const FALLBACK_HERO = {
  heading: "Drama i teatr jako narzędzia dialogu między pokoleniami",
  lead: "DramaWay tworzy projekty teatralne i edukacyjne oparte na metodzie dramy oraz Teatrze Zaangażowanym Społecznie — łącząc pokolenia, społeczności i tematy, o których trudno mówić wprost.",
  ctaLabel: "poznaj nasze projekty",
  ctaHref: "/projekty",
} as const;

export const FALLBACK_HOMEPAGE = {
  about: {
    heading: "Kim jesteśmy?",
    lead: "Drama Way Fundacja Edukacji i Kultury tworzy przestrzeń do dialogu, budowania zaufania i wzajemnego zrozumienia — poprzez teatr, dramę i pracę ze społecznościami.",
    ctaLabel: "poznajmy się",
    ctaHref: "/fundacja",
  },
  methods: {
    heading: "METODY",
    lead: "Pracujemy w oparciu o metodę dramy i Teatr Zaangażowany Społecznie — Teatr Forum, Teatr ze Społecznością i Teatr w Edukacji.",
    ctaLabel: "dowiedz się więcej",
    ctaHref: "/metody",
  },
  /** Label only — project title comes from `project.featured` on the page. */
  featured: {
    heading: "Projekty",
    lead: "Międzypokoleniowy projekt teatralny łączący młodsze i starsze pokolenia w procesie twórczym opartym na dramie. Od 2013 roku zrealizowaliśmy kilkanaście edycji na różne tematy.",
    ctaLabel: "poznaj nasze projekty",
    ctaHref: "/projekty",
  },
  czytelnia: {
    heading: "Czytelnia",
    lead: "Drama Way Fundacja Edukacji i Kultury tworzy przestrzeń do dialogu, budowania zaufania i wzajemnego zrozumienia",
    ctaLabel: "poznajmy się",
    ctaHref: "/czytelnia",
  },
} as const;

export const FALLBACK_FOOTER_NOTE =
  "Bez względu na to, czy mówimy o aktorach zespołów zawodowych, czy amatorskich, ta książka próbuje w każdym rozbudzić ten teatr, który nosi w sobie każdy człowiek. Jesteśmy teatrem, nawet jeśli go nie robimy A. Boal. Gry dla aktorów i nieaktorów.";
