import { defineArrayMember, defineField } from "sanity";
import { HeroSlideInput } from "../components/hero-slide-input";

/** Shared cap for every hero still list (homepage and inner pages). */
export const HERO_SLIDES_MAX = 5;

type HeroSlidesFieldOptions = {
  group?: string;
  title?: string;
  description?: string;
};

const DESCRIPTION_PL =
  "Do 5 zdjęć, w kolejności pokazu. Jedno zdjęcie zostaje kadrem bez slidera. Dwa lub więcej uruchamiają slider. Tempo i autoodtwarzanie są wspólne: Site settings → Hero → Slider hero. Pusta lista = brak kadru.";

/**
 * Up to five hero stills. One asset stays a static frame; more becomes the
 * shared slider configured on site settings.
 */
export function heroSlidesField(options: HeroSlidesFieldOptions = {}) {
  return defineField({
    name: "heroImages",
    title: options.title ?? "Zdjęcia hero",
    type: "array",
    ...(options.group ? { group: options.group } : {}),
    description: options.description ?? DESCRIPTION_PL,
    of: [
      defineArrayMember({
        type: "image",
        title: "Slajd",
        options: { hotspot: true },
        description:
          "Ustaw hotspot: kropka nawigatora przybliża ten obszar, żeby było widać, co jest na zdjęciu.",
        components: { input: HeroSlideInput },
        fields: [
          defineField({
            name: "alt",
            title: "Alt",
            type: "string",
            description:
              "Dla czytnika ekranu i gdy obraz się nie załaduje. Krótki opis treści zdjęcia. Może być taki sam jak podpis, gdy kadr jest zwykły, np. „Uczestnicy w kręgu na sali”. Gdy warto rozdzielić: „Cztery osoby na scenie w półmroku”.",
          }),
          defineField({
            name: "caption",
            title: "Podpis",
            type: "string",
            description:
              "Krótki podpis widoczny na stronie — na razie jako podpowiedź przy kropce slidera. Może być bardziej redakcyjny niż alt, np. „Finał Art Generacje, edycja XI”. Jedno zdjęcie nie ma kropek, więc podpis wtedy nie wychodzi na stronę.",
          }),
        ],
      }),
    ],
    validation: (rule) => rule.max(HERO_SLIDES_MAX),
  });
}

/** One place for every multi-image hero on the site. */
/** Single hero still before `heroImages`. Hidden until `pnpm patch:hero-images --unset-legacy`. */
export function legacyHeroImageField(options: HeroSlidesFieldOptions = {}) {
  return defineField({
    name: "image",
    title: "Zdjęcie (legacy)",
    type: "image",
    ...(options.group ? { group: options.group } : {}),
    hidden: true,
    readOnly: true,
    description:
      "Stare pole sprzed listy heroImages. Nie edytować — zniknie po `pnpm patch:hero-images -- --unset-legacy`.",
  });
}

export function heroSliderSettingsField() {
  return defineField({
    name: "heroSlider",
    title: "Slider hero",
    type: "object",
    group: "hero",
    description:
      "Wspólne dla każdego hero z co najmniej dwoma zdjęciami: strona główna, listingi, O fundacji, zwykłe strony i projekty. Jedno zdjęcie nie uruchamia slidera.",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "interval",
        title: "Czas klatki (sekundy)",
        type: "number",
        description: "Jak długo widać jedno zdjęcie. Puste = 7. Od 4 do 20.",
        initialValue: 7,
        validation: (rule) => rule.integer().min(4).max(20),
      }),
      defineField({
        name: "autoplay",
        title: "Autoodtwarzanie",
        type: "boolean",
        description:
          "Włączone: klatki zmieniają się same. Wyłączone: tylko kropki przy zdjęciu. Ustawienie systemu „mniej animacji” też zatrzymuje pokaz.",
        initialValue: true,
      }),
    ],
  });
}
