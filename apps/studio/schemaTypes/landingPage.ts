import { defineField, defineType } from "sanity";

export const LANDING_ROUTES = [
  { title: "Projekty", value: "projekty" },
  { title: "Baza wiedzy", value: "baza-wiedzy" },
  { title: "Czytelnia", value: "czytelnia" },
  { title: "Zespół", value: "zespol" },
] as const;

const ROUTE_TITLES: Record<string, string> = Object.fromEntries(
  LANDING_ROUTES.map((route) => [route.value, route.title]),
);

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "listing", title: "Listing" },
  ],
  fields: [
    defineField({
      name: "route",
      title: "Strona",
      type: "string",
      group: "hero",
      readOnly: ({ value }) => Boolean(value),
      description:
        "Ustawiane przy pierwszym zapisie (albo przez pnpm seed:landing-pages). Potem zablokowane.",
      options: {
        list: [...LANDING_ROUTES],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      group: "hero",
      description: "H1. Puste = nagłówek nie pojawia się na stronie.",
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "text",
      rows: 4,
      group: "hero",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA — etykieta",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA — cel",
      type: "string",
      group: "hero",
      description: "Ścieżka wewnętrzna, np. /projekty/art-generacje",
    }),
    defineField({
      name: "image",
      title: "Zdjęcie hero",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "Puste = brak zdjęcia hero. Układ splitu (szerokość tekstu) zostaje.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "czytelniaTeaser",
      title: "Wiersz Czytelni",
      type: "object",
      group: "listing",
      hidden: ({ document }) => document?.route !== "projekty",
      description:
        "Kafelek Czytelni na /projekty. Puste pola = wiersz nie pojawia się. Link zawsze /czytelnia.",
      fields: [
        defineField({ name: "title", title: "Tytuł", type: "string" }),
        defineField({ name: "lead", title: "Lead", type: "text", rows: 3 }),
        defineField({
          name: "ctaLabel",
          title: "CTA — etykieta",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", route: "route" },
    prepare({ title, route }) {
      const routeTitle = (route && ROUTE_TITLES[route]) || "Landing";
      return {
        title: title || routeTitle,
        subtitle: route ? `/${route}` : undefined,
      };
    },
  },
});
