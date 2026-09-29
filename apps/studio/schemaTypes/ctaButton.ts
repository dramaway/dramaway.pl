import { defineField, defineType } from "sanity";
import { ButtonIcon } from "./buttonIcon";
import { CtaButtonPreview } from "./ctaButtonPreview";

/**
 * Page slugs hidden from the button's document picker.
 * Keep in sync with `HIDDEN_PAGE_SLUGS` in `navItem.ts`.
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

const PAGE_FILTER = `!(
  (_type == "page" && slug.current in $hiddenPageSlugs) ||
  (_type == "publication" && slug.current == "metody-tzs")
)`;

type CtaParent = {
  target?: string;
};

function parentOf(context: { parent?: unknown }): CtaParent {
  const parent = context.parent;
  return parent && typeof parent === "object" ? (parent as CtaParent) : {};
}

/** Path or http(s). Hash and query belong in the advanced fields. */
function isAddress(value: string | undefined): boolean {
  const href = value?.trim() ?? "";
  if (!href || href.startsWith("//") || href.startsWith("/\\")) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Keep in sync with `normalizeHash` in `apps/web/src/lib/cta-button.ts`. */
function isHash(value: string): boolean {
  const body = value.trim().replace(/^#/, "");
  return body.length > 0 && !/[\s?#]/.test(body) && !/[\u0000-\u001f\u007f]/.test(body);
}

/** Keep in sync with `normalizeQuery` in `apps/web/src/lib/cta-button.ts`. */
function isQuery(value: string): boolean {
  const body = value.trim().replace(/^\?/, "");
  if (!body || /[\s#]/.test(body) || /[\u0000-\u001f\u007f]/.test(body)) return false;
  if (/javascript:/i.test(body) || /data:/i.test(body)) return false;
  return true;
}

/**
 * Block in Portable Text — its own row, never an inline mark.
 * The site draws it with the green CTA (label, rule, dot), aligned left.
 */
export const ctaButton = defineType({
  name: "ctaButton",
  title: "Button",
  type: "object",
  icon: ButtonIcon,
  fieldsets: [
    {
      name: "advanced",
      title: "Zaawansowane",
      description: "Kotwica albo parametry doklejane do wybranego adresu.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "label",
      title: "Etykieta",
      type: "string",
      description: "Tekst na zielonym przycisku, np. więcej. Zawsze osobny wiersz.",
      validation: (rule) =>
        rule.custom((value) => {
          if (typeof value === "string" && value.trim()) return true;
          return "Podaj etykietę";
        }),
    }),
    defineField({
      name: "indent",
      title: "Wcięcie",
      type: "number",
      initialValue: 0,
      description:
        "Ten sam skok co lista Indent. Jeden stopień zrównuje przycisk z akapitem wciętym raz, na przykład pod hasłem Termin.",
      options: {
        list: [
          { title: "Bez wcięcia", value: 0 },
          { title: "1 stopień", value: 1 },
          { title: "2 stopnie", value: 2 },
          { title: "3 stopnie", value: 3 },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "target",
      title: "Cel",
      type: "string",
      initialValue: "reference",
      options: {
        list: [
          { title: "Dokument", value: "reference" },
          { title: "Plik", value: "file" },
          { title: "Adres", value: "url" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "page",
      title: "Dokument",
      type: "reference",
      description: "Strona, news, projekt, publikacja, listing, fundacja albo osoba.",
      hidden: ({ parent }) => parentOf({ parent }).target === "file" || parentOf({ parent }).target === "url",
      to: [
        { type: "page" },
        { type: "news" },
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
          const target = parentOf(context).target ?? "reference";
          if (target !== "reference") return true;
          if (value && typeof value === "object" && "_ref" in value && value._ref) return true;
          return "Wybierz dokument";
        }),
    }),
    defineField({
      name: "file",
      title: "Plik",
      type: "file",
      description: "PDF albo inne medium. Przycisk otwiera plik w nowej karcie.",
      hidden: ({ parent }) => parentOf({ parent }).target !== "file",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target !== "file") return true;
          if (
            value &&
            typeof value === "object" &&
            "asset" in value &&
            value.asset &&
            typeof value.asset === "object" &&
            "_ref" in value.asset &&
            value.asset._ref
          ) {
            return true;
          }
          return "Wybierz plik";
        }),
    }),
    defineField({
      name: "href",
      title: "Adres",
      type: "string",
      description: "Ścieżka od ukośnika (/projekty) albo adres https://. Kotwicę i parametry dodaj niżej.",
      hidden: ({ parent }) => parentOf({ parent }).target !== "url",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (parentOf(context).target !== "url") return true;
          if (isAddress(typeof value === "string" ? value : undefined)) return true;
          return "Ścieżka od / albo adres https://";
        }),
    }),
    defineField({
      name: "hash",
      title: "Kotwica",
      type: "string",
      fieldset: "advanced",
      description: "Gdy strona ma kotwicę. Samo id albo z #, np. edycje albo #edycje.",
      validation: (rule) =>
        rule.custom((value) => {
          if (typeof value !== "string" || !value.trim()) return true;
          return isHash(value) || "Kotwica bez spacji, np. edycje albo #edycje.";
        }),
    }),
    defineField({
      name: "query",
      title: "Parametry",
      type: "string",
      fieldset: "advanced",
      description: "Część po ?. Samo zapytanie albo z ?, np. rodzaj=books albo ?rodzaj=books.",
      validation: (rule) =>
        rule.custom((value) => {
          if (typeof value !== "string" || !value.trim()) return true;
          return isQuery(value) || "Parametry bez spacji i bez #, np. rodzaj=books.";
        }),
    }),
  ],
  preview: {
    select: {
      label: "label",
      pageTitle: "page.title",
      pageName: "page.name",
      filename: "file.asset.originalFilename",
      href: "href",
      hash: "hash",
      query: "query",
      indent: "indent",
    },
  },
  components: { preview: CtaButtonPreview },
});
