import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Leftover pages that should not be picked as tiles.
 * News is its own document type. Keep in sync with `HIDDEN_PAGE_SLUGS` in `navItem.ts`.
 */
const HIDDEN_PAGE_SLUGS = [
  "projekty-zakonczone",
  "portal-wiedzy",
  "szkolenia",
  "art-generacje-0",
  "art-generacje",
  "teatr-codzienny",
  "to-mi-gra",
  "boal-practice",
];

const TILE_FILTER = `!(
  (_type == "page" && slug.current in $hiddenPageSlugs) ||
  (_type == "publication" && slug.current == "metody-tzs")
)`;

type TileParent = {
  target?: string;
  title?: string;
  href?: string;
  page?: { _ref?: string };
};

function parentOf(context: { parent?: unknown }): TileParent {
  const parent = context.parent;
  return parent && typeof parent === "object" ? (parent as TileParent) : {};
}

function isTileHref(value: string | undefined): boolean {
  const href = value?.trim() ?? "";
  if (!href) return false;
  if (href.startsWith("//") || href.startsWith("/\\")) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function tileCount(count: number): string {
  if (count === 1) return "1 kafelek";
  const last = count % 10;
  const lastTwo = count % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} kafelki`;
  }
  return `${count} kafelków`;
}

export const contentTile = defineType({
  name: "contentTile",
  title: "Kafelek",
  type: "object",
  fields: [
    defineField({
      name: "target",
      title: "Cel",
      type: "string",
      initialValue: "reference",
      options: {
        list: [
          { title: "Dokument z CMS", value: "reference" },
          { title: "Adres", value: "path" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "page",
      title: "Dokument",
      type: "reference",
      description: "Strona, news, projekt, publikacja, listing, fundacja albo osoba.",
      hidden: ({ parent }) => (parent as TileParent | undefined)?.target === "path",
      to: [
        { type: "page" },
        { type: "news" },
        { type: "project" },
        { type: "publication" },
        { type: "landingPage" },
        { type: "aboutPage" },
        { type: "person" },
      ],
      options: {
        disableNew: true,
        filter: TILE_FILTER,
        filterParams: { hiddenPageSlugs: HIDDEN_PAGE_SLUGS },
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target === "path") return true;
          if (value && typeof value === "object" && "_ref" in value && value._ref) {
            return true;
          }
          return "Wybierz dokument";
        }),
    }),
    defineField({
      name: "href",
      title: "Adres",
      type: "string",
      description: "Ścieżka od ukośnika (/projekty) albo adres https://.",
      hidden: ({ parent }) => (parent as TileParent | undefined)?.target !== "path",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target !== "path") return true;
          const href = typeof value === "string" ? value.trim() : "";
          if (!href || isTileHref(href)) return true;
          return "Ścieżka od / albo adres http(s)";
        }),
    }),
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      description: "Puste = tytuł dokumentu.",
    }),
    defineField({
      name: "excerpt",
      title: "Opis",
      type: "text",
      rows: 3,
      description: "Puste = zajawka dokumentu.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Etykieta linku",
      type: "string",
      description: "Puste = „zobacz” albo „czytaj więcej”. Cały kafelek prowadzi w to samo miejsce.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      pageTitle: "page.title",
      pageName: "page.name",
      href: "href",
    },
    prepare(selection: {
      title?: string;
      pageTitle?: string;
      pageName?: string;
      href?: string;
    }) {
      const title =
        selection.title?.trim() ||
        selection.pageTitle?.trim() ||
        selection.pageName?.trim() ||
        selection.href?.trim() ||
        "Kafelek";
      return { title };
    },
  },
});

export const contentModule = defineType({
  name: "contentModule",
  title: "Kafelki",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Zdjęcie",
      type: "image",
      options: { hotspot: true },
      description:
        "Puste = same kafelki (siatka albo lista). Ze zdjęciem strona kadru ustawia się sama: lewo, prawo, lewo…",
      fields: [
        defineField({
          name: "alt",
          title: "Tekst alternatywny",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "textLayout",
      title: "Układ tekstu",
      type: "string",
      initialValue: "grid",
      hidden: ({ parent }) => {
        const image = (parent as { image?: { asset?: unknown } } | undefined)?.image;
        return Boolean(image?.asset);
      },
      options: {
        list: [
          { title: "Siatka (do 3 kolumn)", value: "grid" },
          { title: "Lista (jeden pod drugim)", value: "list" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "tiles",
      title: "Kafelki",
      type: "array",
      of: [defineArrayMember({ type: "contentTile" })],
      validation: (rule) => rule.required().min(1).max(3),
    }),
  ],
  preview: {
    select: {
      tiles: "tiles",
      image: "image",
      layout: "textLayout",
    },
    prepare(selection: {
      tiles?: unknown;
      image?: { asset?: unknown };
      layout?: string;
    }) {
      const count = Array.isArray(selection.tiles) ? selection.tiles.length : 0;
      const mode = selection.image?.asset
        ? "ze zdjęciem"
        : selection.layout === "list"
          ? "lista"
          : "siatka";
      return { title: "Kafelki", subtitle: `${tileCount(count)} · ${mode}` };
    },
  },
});

export const newsFeedModule = defineType({
  name: "newsFeedModule",
  title: "Aktualności",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Nagłówek",
      type: "string",
      description: "Puste = „Aktualności”.",
    }),
    defineField({
      name: "limit",
      title: "Ile najnowszych",
      type: "number",
      initialValue: 3,
      description: "Od 1 do 12. Puste = 3.",
      validation: (rule) => rule.integer().min(1).max(12),
    }),
    defineField({
      name: "sources",
      title: "Rodzaje treści",
      type: "array",
      description:
        "Można zaznaczyć kilka. Na stronie zostają najnowsze według daty dodania. Puste = same News.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Strony", value: "page" },
          { title: "Osoby", value: "person" },
          { title: "Projekty", value: "project" },
          { title: "Publikacje", value: "publication" },
        ],
        layout: "grid",
      },
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { heading: "heading", limit: "limit" },
    prepare(selection: { heading?: string; limit?: number }) {
      const count =
        typeof selection.limit === "number" && selection.limit > 0
          ? selection.limit
          : 3;
      return {
        title: selection.heading?.trim() || "Aktualności",
        subtitle: count === 1 ? "1 najnowszy" : `${count} najnowszych`,
      };
    },
  },
});

export const quoteModule = defineType({
  name: "quoteModule",
  title: "Cytat",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Cytat",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
      description: "Puste = bez podpisu.",
    }),
  ],
  preview: {
    select: { text: "text", author: "author" },
    prepare(selection: { text?: string; author?: string }) {
      return {
        title: selection.text?.trim() || "Cytat",
        subtitle: selection.author?.trim() || "Cytat",
      };
    },
  },
});

/** Shared `sections` members for the homepage, page documents, and /projekty. */
export function contentSectionMembers() {
  return [
    defineArrayMember({ type: "contentModule" }),
    defineArrayMember({ type: "newsFeedModule" }),
  ];
}

/** Page documents also take quotes (before and after the article). */
export function pageSectionMembers() {
  return [...contentSectionMembers(), defineArrayMember({ type: "quoteModule" })];
}
