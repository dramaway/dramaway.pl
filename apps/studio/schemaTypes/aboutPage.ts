import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "O fundacji",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "methods", title: "Metody i wartości" },
    { name: "team", title: "Zespół" },
    { name: "history", title: "Historia" },
    { name: "documents", title: "Dokumenty" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      group: "hero",
      description: "H1. Puste = „O fundacji”.",
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
      description: "Ścieżka wewnętrzna, np. /czytelnia",
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
      name: "methods",
      title: "Metody i wartości",
      type: "object",
      group: "methods",
      fields: [
        defineField({ name: "heading", title: "Nagłówek", type: "string" }),
        defineField({ name: "lead", title: "Lead", type: "text", rows: 4 }),
        defineField({ name: "ctaLabel", title: "CTA — etykieta", type: "string" }),
        defineField({
          name: "ctaHref",
          title: "CTA — cel",
          type: "string",
          description: "Ścieżka wewnętrzna, np. /metody",
        }),
        defineField({
          name: "values",
          title: "Wartości",
          type: "array",
          description:
            "Etykiety w kołach (kolejność = kolejność na stronie). Pusta lista = kanon z ramki.",
          of: [
            defineArrayMember({
              type: "object",
              name: "aboutValue",
              fields: [
                defineField({
                  name: "label",
                  title: "Etykieta",
                  type: "string",
                  validation: (r) => r.required(),
                }),
              ],
              preview: {
                select: { title: "label" },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "team",
      title: "Zespół",
      type: "object",
      group: "team",
      fields: [
        defineField({ name: "heading", title: "Nagłówek", type: "string" }),
        defineField({
          name: "ctaLabel",
          title: "CTA przy osobie",
          type: "string",
          description: "Puste = „zobacz pełne bio”.",
        }),
        defineField({
          name: "people",
          title: "Osoby na tej stronie",
          type: "array",
          description:
            "Kogo pokazać i w jakiej kolejności. Pusta lista = wszyscy z typu Person (ta sama lista co /zespol). Żeby kogoś zdjąć, wybierz tu tylko te osoby, które mają zostać.",
          of: [
            defineArrayMember({
              type: "reference",
              to: [{ type: "person" }],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "history",
      title: "Historia fundacji",
      type: "object",
      group: "history",
      description:
        "Pusta lista wpisów = sekcja znika ze strony. Nie wklejaj lorem z Figmy.",
      fields: [
        defineField({ name: "heading", title: "Nagłówek", type: "string" }),
        defineField({ name: "lead", title: "Lead", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Wpis na osi czasu",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "aboutHistoryItem",
              fields: [
                defineField({
                  name: "year",
                  title: "Rok / znacznik",
                  type: "string",
                  description: "Tekst w kole, np. ‘11 albo 2011.",
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "title",
                  title: "Tytuł",
                  type: "string",
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "body",
                  title: "Opis",
                  type: "text",
                  rows: 4,
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "year" },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "documents",
      title: "Dokumenty i sprawozdania",
      type: "object",
      group: "documents",
      fields: [
        defineField({ name: "heading", title: "Nagłówek", type: "string" }),
        defineField({
          name: "items",
          title: "Pozycje",
          type: "array",
          description:
            "Pusta lista = statut, sprawozdania i jak nas wesprzeć (strony z CMS). Po dodaniu pierwszej pozycji lista jest wyłącznie stąd: strona wewnętrzna, plik (PDF) albo URL.",
          of: [
            defineArrayMember({
              type: "object",
              name: "aboutDocument",
              fields: [
                defineField({
                  name: "title",
                  title: "Etykieta na stronie",
                  type: "string",
                  description: "Puste = tytuł strony albo nazwa pliku.",
                }),
                defineField({
                  name: "page",
                  title: "Strona",
                  type: "reference",
                  to: [{ type: "page" }],
                  description: "Np. statut, sprawozdania, jak nas wesprzeć.",
                }),
                defineField({
                  name: "file",
                  title: "Plik (PDF)",
                  type: "file",
                  options: {
                    accept: ".pdf,application/pdf",
                  },
                  description: "Jeśli jest plik, link idzie do niego, nie do strony.",
                }),
                defineField({
                  name: "href",
                  title: "URL",
                  type: "string",
                  description:
                    "Gdy nie ma strony ani pliku. Ścieżka /… albo http(s).",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  pageTitle: "page.title",
                  filename: "file.asset.originalFilename",
                  href: "href",
                },
                prepare({ title, pageTitle, filename, href }) {
                  return {
                    title: title || pageTitle || filename || href || "Dokument",
                    subtitle: filename
                      ? "Plik"
                      : pageTitle
                        ? "Strona"
                        : href
                          ? "URL"
                          : "Brak celu",
                  };
                },
              },
              validation: (rule) =>
                rule.custom((value) => {
                  if (!value) return true;
                  const item = value as {
                    page?: unknown;
                    file?: unknown;
                    href?: string;
                  };
                  if (item.page || item.file || item.href?.trim()) return true;
                  return "Dodaj stronę, plik albo URL.";
                }),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "O fundacji" }),
  },
});
