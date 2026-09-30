/** Default BlobRow CTA when a row has no own label. */
export const LIST_CTA_LABEL = "więcej";

export const LIST_EMPTY_MESSAGE = "Nie ma jeszcze pozycji w CMS.";

/**
 * Inner-page UI chrome. Editorial copy (leads, titles, summaries) comes from
 * CMS. Empty CMS field = omit on the page. Do not add fallback body copy here.
 */
export const SUBPAGE = {
  /** In-article read-more fold (Portable Text separator). */
  bodyReadMore: {
    expand: "Czytaj więcej",
    collapse: "Zwiń",
  },
  artGeneracje: {
    ctaLabel: "zobacz wszystkie edycje",
    ctaHref: "#edycje",
    editionsHeading: "Edycje",
    editionCta: "zobacz jak graliśmy",
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
  video: {
    play: "Odtwórz film",
  },
  a11y: {
    skipToContent: "Przejdź do treści",
    moreNav: "Więcej w menu",
  },
  notFound: {
    title: "Nie znaleziono strony",
    lead: "Ten adres nie istnieje albo treść została przeniesiona.",
    cta: "wróć na stronę główną",
  },
  error: {
    title: "Coś poszło nie tak",
    lead: "Spróbuj odświeżyć stronę albo wróć na początek.",
    cta: "wróć na stronę główną",
  },
} as const;
