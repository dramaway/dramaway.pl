import { FALLBACK_HERO, FALLBACK_HOMEPAGE } from "./homepage-copy";
import { czytelniaPath, methodsPath } from "./routes";

/** Default BlobRow / hub channel CTA — Figma Group 43 instances use a full phrase; this is the short fallback when a row has no own label. */
export const LIST_CTA_LABEL = "więcej";

export const LIST_EMPTY_MESSAGE = "Nie ma jeszcze pozycji w CMS.";

/** Art Generacje intro — Figma frame `79:183` text `79:191`, not the homepage teaser. */
const ART_GENERACJE_LEAD =
  "Międzypokoleniowy projekt teatru zaangażowanego społecznie, skierowany do ludzi wszystkich pokoleń: Młodzieży (od 13 lat), Dorosłych i Starszych. Z naszych doświadczeń i obserwacji wynika, że te grupy mają głęboką potrzebę poczucia wspólnoty spowodowanej działaniami artystycznymi. Zarówno młodzi, jak i trochę starsi chcą rozwijać swoje umiejętności i talent; chcą by ich artystyczny głos został dostrzeżony i szanowany.";

/**
 * Inner-page chrome copy. New strings: quote Figma, or add a row to the copy
 * exceptions table in `docs/design/system.md`. Do not invent synonyms.
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
    lead: ART_GENERACJE_LEAD,
    ctaLabel: "zobacz wszystkie edycje",
    ctaHref: "#edycje",
    editionsHeading: "Edycje",
    editionCta: "zobacz jak graliśmy",
  },
  knowledge: {
    title: "Baza wiedzy",
    lead: FALLBACK_HERO.lead,
    channelCta: LIST_CTA_LABEL,
    channels: [
      {
        href: methodsPath(),
        title: "Metody",
        lead: FALLBACK_HOMEPAGE.methods.lead,
      },
      {
        href: czytelniaPath(),
        title: "Czytelnia",
        lead: FALLBACK_HOMEPAGE.czytelnia.lead,
      },
    ],
  },
  czytelnia: {
    pdfCta: "pobierz PDF",
    empty: "Czytelnia jest pusta — w CMS nie ma jeszcze publikacji.",
    emptyFiltered: "Żadna publikacja nie pasuje do wybranych filtrów.",
    filters: {
      all: "wszystkie",
      formatLabel: "Rodzaj",
      categoryLabel: "Kategoria",
      formats: {
        articles: "artykuły i publikacje",
        books: "książki",
        scripts: "scenariusze",
        multimedia: "multimedia",
      },
    },
  },
  fundacja: {
    title: "O fundacji",
    lead: FALLBACK_HOMEPAGE.about.lead,
    /** Figma Group 43 instance `130:1331` — quoted, not a synonym of „poznajmy się”. */
    ctaLabel: "zobacz nasze publikacje",
    ctaHref: czytelniaPath(),
    methods: {
      title: "Metody i wartości",
      lead: FALLBACK_HOMEPAGE.methods.lead,
      href: methodsPath(),
      ctaLabel: FALLBACK_HOMEPAGE.methods.ctaLabel,
    },
    /** Chrome labels from frame `130:1316` (7+1 circles). Not CMS. */
    values: [
      "Zaufanie",
      "Energia",
      "Dialog",
      "Otwartość",
      "Wolność",
      "Szacunek",
      "Przestrzeń",
      "Ambicja",
    ],
    teamHeading: "Zespół",
    teamCta: "zobacz pełne bio",
    teamEmpty: "Brak osób w CMS.",
    documents: {
      heading: "Dokumenty i sprawozdania",
      empty: "Brak dokumentów fundacji w CMS.",
    },
  },
  contact: {
    title: "Napisz do nas",
    lead: "Adres, dane rejestrowe i osoby, do których możesz napisać — bez formularza.",
  },
} as const;
