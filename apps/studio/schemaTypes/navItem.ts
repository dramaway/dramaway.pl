import { defineField, defineType, type FieldDefinition } from "sanity";

/**
 * Page slugs hidden from the nav picker.
 * News (`aktualnosc-*`) and the publication leftover `metody-tzs` are filtered
 * in GROQ below. Keep the slug list in sync with `apps/web/src/lib/routes.ts`
 * (`PROJECT_SECTION_PAGE_SLUGS`, `PROJECT_DOCUMENT_SLUGS`).
 */
const HIDDEN_PAGE_SLUGS = [
  "wydawnictwo",
  "projekty-zakonczone",
  "portal-wiedzy",
  "szkolenia",
  "art-generacje-0",
  "art-generacje",
  "teatr-codzienny",
  "to-mi-gra",
  "boal-practice",
];

const PAGE_FILTER = `!(
  (_type == "page" && (
    slug.current match "aktualnosc-*" ||
    slug.current in $hiddenPageSlugs
  )) ||
  (_type == "publication" && slug.current == "metody-tzs")
)`;

type NavParent = {
  target?: string;
  label?: string;
  href?: string;
  page?: { _ref?: string };
};

function parentOf(context: { parent?: unknown }): NavParent {
  const parent = context.parent;
  return parent && typeof parent === "object" ? (parent as NavParent) : {};
}

/** Path or http(s) only — same allowlist the site uses for menu hrefs. */
function isNavHref(value: string | undefined): boolean {
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

function podpozycje(count: number): string {
  if (count === 1) return "1 podpozycja";
  const last = count % 10;
  const lastTwo = count % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} podpozycje`;
  }
  return `${count} podpozycji`;
}

function navLinkFields(): FieldDefinition[] {
  return [
    defineField({
      name: "label",
      title: "Etykieta",
      type: "string",
      description: "Pusta = tytuł wybranej strony.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target !== "path") return true;
          if (typeof value === "string" && value.trim()) return true;
          return "Podaj etykietę";
        }),
    }),
    defineField({
      name: "target",
      title: "Cel",
      type: "string",
      initialValue: "reference",
      options: {
        list: [
          { title: "Strona z CMS", value: "reference" },
          { title: "Adres", value: "path" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "page",
      title: "Strona",
      type: "reference",
      description: "Dokument, który już ma adres na serwisie.",
      hidden: ({ parent }) => (parent as NavParent | undefined)?.target === "path",
      to: [
        { type: "page" },
        { type: "project" },
        { type: "publication" },
        { type: "person" },
        { type: "landingPage" },
        { type: "aboutPage" },
      ],
      options: {
        disableNew: true,
        filter: PAGE_FILTER,
        filterParams: { hiddenPageSlugs: HIDDEN_PAGE_SLUGS },
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target === "path") return true;
          if (value && typeof value === "object" && "_ref" in value && value._ref) {
            return true;
          }
          return "Wybierz stronę";
        }),
    }),
    defineField({
      name: "href",
      title: "Adres",
      type: "string",
      description: "Ścieżka od ukośnika (/projekty) albo adres https://.",
      hidden: ({ parent }) => (parent as NavParent | undefined)?.target !== "path",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target !== "path") return true;
          if (isNavHref(typeof value === "string" ? value : undefined)) return true;
          return "Ścieżka od / albo adres http(s)";
        }),
    }),
  ];
}

type NavPreview = {
  label?: string;
  pageTitle?: string;
  pageName?: string;
  href?: string;
  children?: unknown;
};

function previewTitle({ label, pageTitle, pageName, href }: NavPreview): string {
  const title = label?.trim() || pageTitle?.trim() || pageName?.trim() || href?.trim();
  return title || "Pozycja";
}

export const navChild = defineType({
  name: "navChild",
  title: "Podpozycja",
  type: "object",
  fields: navLinkFields(),
  preview: {
    select: {
      label: "label",
      pageTitle: "page.title",
      pageName: "page.name",
      href: "href",
    },
    prepare(selection: NavPreview) {
      const title = previewTitle(selection);
      const subtitle =
        selection.href?.trim() ||
        (selection.label?.trim() && selection.pageTitle?.trim() && selection.label.trim() !== selection.pageTitle.trim()
          ? selection.pageTitle.trim()
          : undefined);
      return { title, subtitle };
    },
  },
});

export const navItem = defineType({
  name: "navItem",
  title: "Pozycja",
  type: "object",
  fields: [
    ...navLinkFields(),
    defineField({
      name: "children",
      title: "Podpozycje",
      type: "array",
      description: "Drugi poziom. Menu nie ma trzeciego.",
      of: [{ type: "navChild" }],
      validation: (rule) => rule.max(8),
    }),
  ],
  preview: {
    select: {
      label: "label",
      pageTitle: "page.title",
      pageName: "page.name",
      href: "href",
      children: "children",
    },
    prepare(selection: NavPreview) {
      const count = Array.isArray(selection.children) ? selection.children.length : 0;
      const subtitle =
        count > 0
          ? podpozycje(count)
          : selection.href?.trim() ||
            (selection.label?.trim() &&
            selection.pageTitle?.trim() &&
            selection.label.trim() !== selection.pageTitle.trim()
              ? selection.pageTitle.trim()
              : undefined);
      return { title: previewTitle(selection), subtitle };
    },
  },
});
