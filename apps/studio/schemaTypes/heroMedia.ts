import { defineArrayMember, defineField } from "sanity";

/** Shared cap for every hero still list (homepage and inner pages). */
export const HERO_SLIDES_MAX = 5;

type HeroSlidesFieldOptions = {
  group?: string;
  title?: string;
  description?: string;
};

const DESCRIPTION_PL =
  "Do 5 zdjęć, w kolejności pokazu. Jedno zdjęcie zostaje kadrem bez slidera. Dwa lub więcej uruchamiają slider. Tempo i autoodtwarzanie są wspólne: Site settings → Hero → Slider hero. Gdy ta lista ma zdjęcie, pojedyncze pole obok nie jest używane.";

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
        name: "heroSlide",
        title: "Slajd",
        options: { hotspot: true },
        fields: [
          defineField({
            name: "alt",
            title: "Alt text",
            type: "string",
          }),
        ],
      }),
    ],
    validation: (rule) => rule.max(HERO_SLIDES_MAX),
  });
}

/** One place for every multi-image hero on the site. */
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
