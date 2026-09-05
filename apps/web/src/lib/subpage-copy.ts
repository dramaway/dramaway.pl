import { FALLBACK_HERO, FALLBACK_HOMEPAGE } from "./homepage-copy";
import { czytelniaPath, methodsPath } from "./routes";

/**
 * Figma inner-page copy until matching Studio fields exist.
 * Nav labels stay on the IA; these strings are headings, leads, and CTAs.
 */
export const SUBPAGE = {
  projects: {
    title: "Co robimy?",
    lead: FALLBACK_HERO.lead,
    ctaLabel: "zobacz Art Generacje",
    ctaHref: "/projekty/art-generacje",
    czytelnia: {
      title: FALLBACK_HOMEPAGE.czytelnia.heading,
      lead: FALLBACK_HOMEPAGE.czytelnia.lead,
      href: czytelniaPath(),
      ctaLabel: "wejdź do czytelni",
    },
  },
  artGeneracje: {
    lead: FALLBACK_HOMEPAGE.featured.lead,
    ctaLabel: "zobacz wszystkie relacje",
    ctaHref: "#edycje",
    editionCta: "zobacz jak graliśmy",
  },
  knowledge: {
    title: "Baza wiedzy",
    lead: FALLBACK_HERO.lead,
  },
  czytelnia: {
    pdfCta: "pobierz PDF",
  },
  fundacja: {
    title: "O fundacji",
    lead: FALLBACK_HOMEPAGE.about.lead,
    methods: {
      title: "Metody i wartości",
      lead: FALLBACK_HOMEPAGE.methods.lead,
      href: methodsPath(),
      ctaLabel: FALLBACK_HOMEPAGE.methods.ctaLabel,
    },
    teamCta: "więcej",
  },
  contact: {
    title: "Napisz do nas",
    lead: "Adres, dane rejestrowe i osoby, do których możesz napisać — bez formularza.",
  },
} as const;
