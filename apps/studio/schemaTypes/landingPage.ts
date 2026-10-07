import { defineField, defineType } from "sanity";
import { contentSectionMembers } from "./contentModule";
import { heroSlidesField, legacyHeroImageField } from "./heroMedia";

export const LANDING_ROUTES = [
  { title: "Projekty", value: "projekty" },
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
    heroSlidesField({ group: "hero" }),
    legacyHeroImageField({ group: "hero" }),
    defineField({
      name: "sections",
      title: "Sekcje",
      type: "array",
      group: "listing",
      hidden: ({ document }) => document?.route !== "projekty",
      description:
        "Nad zakończonymi projektami. Te same bloki co na stronie głównej: zdjęcie i kafelki albo aktualności. Pusta lista zostawia automatyczny wiersz aktywnych projektów.",
      of: contentSectionMembers(),
    }),
    defineField({
      name: "showCzytelnia",
      title: "Pokaż Czytelnię",
      type: "boolean",
      group: "listing",
      hidden: ({ document }) => {
        if (document?.route !== "projekty") return true;
        return Array.isArray(document.sections) && document.sections.length > 0;
      },
      description:
        "Wiersz na /projekty, gdy lista Sekcje jest pusta. Tytuł, lead i CTA biorą się z dokumentu Czytelnia — tutaj tylko włącznik. Odznacz, żeby schować. Po dodaniu sekcji ten wiersz znika; Czytelnię wstaw jako kafelek.",
      initialValue: true,
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
