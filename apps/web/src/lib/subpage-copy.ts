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
  /** One control above the /fundacja timeline. Scroll still opens the centre years. */
  history: {
    expandAll: "rozwiń całość",
    collapseAll: "zwiń całość",
  },
  artGeneracje: {
    ctaLabel: "zobacz wszystkie edycje",
    ctaHref: "#edycje",
    editionsHeading: "Edycje",
    editionsListHeading: "Zobacz wszystkie edycje",
    editionCta: "zobacz jak graliśmy",
  },
  czytelnia: {
    pdfCta: "pobierz PDF",
    featuredHeading: "Polecane",
    heading: "Pełna biblioteka",
    libraryCta: "zobacz pełną bibliotekę",
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
      all: "Wszystkie",
      navLabel: "Kategorie",
      uncategorized: "Pozostałe",
    },
  },
  contact: {
    directHeading: "Lub napisz do nas bezpośrednio",
    form: {
      heading: "Formularz kontaktowy",
      lead: "Masz pytanie, pomysł na współpracę albo chcesz dołączyć do naszych działań? Napisz — odpowiadamy w ciągu kilku dni roboczych.",
      name: "Imię i nazwisko",
      email: "E-mail",
      subject: "Temat (opcjonalnie)",
      message: "Wiadomość",
      notice:
        "Wiem, że Fundacja użyje tych danych, żeby odpowiedzieć na wiadomość. Szczegóły są w",
      noticeLink: "polityce prywatności",
      submit: "wyślij wiadomość",
      pending: "Wysyłam…",
      success: "Dziękujemy! Wiadomość została wysłana. Odezwiemy się wkrótce.",
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na biuro@dramaway.pl.",
    },
  },
  gallery: {
    more: "+{n}",
    open: "Otwórz zdjęcie {n} z {total} w galerii: {alt}",
    dialog: "Galeria zdjęć",
    close: "Zamknij",
    next: "Następne zdjęcie",
    previous: "Poprzednie zdjęcie",
    zoomIn: "Powiększ",
    zoomOut: "Pomniejsz",
  },
  video: {
    play: "Odtwórz film",
    fallbackTitle: "Film na YouTube",
  },
  hero: {
    slider: {
      region: "Zdjęcia",
      pause: "Zatrzymaj pokaz",
      play: "Wznów pokaz",
      goTo: "Zdjęcie {n} z {total}",
    },
  },
  newsletter: {
    lead: "Chcesz być na bieżąco? Zapisz się do naszego newslettera",
    emailLabel: "E-mail",
    placeholder: "wpisz swój e-mail",
    submit: "zapisz",
    pending: "Zapisuję…",
    success: "Dziękujemy za zapisanie się do newslettera.",
    unconfigured: "Zapis do newslettera jeszcze nie jest podłączony.",
    invalid: "Podaj prawidłowy adres e-mail.",
    error: "Nie udało się zapisać. Spróbuj ponownie.",
  },
  a11y: {
    skipToContent: "Przejdź do treści",
    moreNav: "Więcej w menu",
    footerLinks: "Kontakt i media społecznościowe",
  },
  notFound: {
    documentTitle: "Nie znaleziono strony — Fundacja Drama Way",
    moved: {
      title: "Ta strona się przeprowadziła",
      lead: "Ten link prowadzi do naszej poprzedniej strony internetowej. Mamy nową stronę i\u00a0część adresów się zmieniła.",
      oneHeading: "Wygląda na to, że chodzi\u00a0o:",
      manyHeading: "Może chodzi o\u00a0jedną z\u00a0tych stron:",
      cta: "Przejdź do strony",
      note: "Dopasowaliśmy to automatycznie, więc możemy się mylić. Jeśli to nie to, czego szukasz, zajrzyj do działów poniżej albo napisz do nas: biuro@dramaway.pl.",
    },
    file: {
      title: "Ten plik był na naszej poprzedniej stronie",
      lead: "Pod tym adresem już go nie ma. Wiele naszych publikacji i\u00a0materiałów znajdziesz w\u00a0Czytelni. Jeśli potrzebujesz konkretnego dokumentu, napisz do nas: biuro@dramaway.pl\u00a0– chętnie go prześlemy.",
      cta: "Przejdź do Czytelni",
    },
    unknown: {
      title: "Nie znaleźliśmy tej strony",
      lead: "Możliwe, że pochodzi z\u00a0naszej poprzedniej strony internetowej, została przeniesiona albo w\u00a0adresie jest literówka.",
      suggestions: "Może zainteresuje Cię:",
    },
    sectionsHeading: "Zajrzyj do działów:",
    pathLabel: "Szukany adres:",
    email: "biuro@dramaway.pl",
  },
  error: {
    title: "Coś poszło nie tak",
    lead: "Spróbuj odświeżyć stronę albo wróć na początek.",
    cta: "wróć na stronę główną",
  },
} as const;
