import { czytelniaPath, methodsPath } from "./routes";

/** Default BlobRow CTA when a row has no own label. */
export const LIST_CTA_LABEL = "więcej";

export const LIST_EMPTY_MESSAGE = "Nie ma jeszcze pozycji w CMS.";

/**
 * Inner-page UI chrome. Editorial copy (leads, titles, summaries) comes from
 * CMS. Empty CMS field = omit on the page. Do not add fallback body copy here.
 */
export const SUBPAGE = {
  artGeneracje: {
    ctaLabel: "zobacz wszystkie edycje",
    ctaHref: "#edycje",
    editionsHeading: "Edycje",
    editionCta: "zobacz jak graliśmy",
  },
  knowledge: {
    channelCta: LIST_CTA_LABEL,
    empty: "Brak kanałów w CMS — uzupełnij Metody i Czytelnię.",
    channels: [
      {
        href: methodsPath(),
        title: "Metody",
      },
      {
        href: czytelniaPath(),
        title: "Czytelnia",
      },
    ],
  },
  czytelnia: {
    pdfCta: "pobierz PDF",
    empty: "Czytelnia jest pusta — w CMS nie ma jeszcze publikacji.",
    filters: {
      formatLabel: "Rodzaj",
      formats: {
        articles: "artykuły i publikacje",
        books: "książki",
        scripts: "scenariusze",
        multimedia: "multimedia",
      },
    },
    sections: {
      expand: "pokaż wszystkie",
      collapse: "zwiń",
      uncategorized: "Pozostałe",
    },
  },
  contact: {
    directHeading: "Napisz bezpośrednio",
  },
  gallery: {
    more: "+{n}",
    open: "Otwórz galerię",
    close: "Zamknij",
    next: "Następne zdjęcie",
    previous: "Poprzednie zdjęcie",
    zoomIn: "Powiększ",
    zoomOut: "Pomniejsz",
  },
} as const;
