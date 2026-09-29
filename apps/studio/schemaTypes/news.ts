import { defineField, defineType, type SlugValue } from "sanity";

const NEWS_SLUG_PREFIX = "aktualnosc-";

/** Path or http(s) only — same allowlist the site uses for menu hrefs. */
function isAllowedCtaHref(value: string): boolean {
  const href = value.trim();
  if (!href || href.startsWith("//") || href.startsWith("/\\")) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ctaHrefOf(document: unknown): string {
  if (!document || typeof document !== "object" || !("ctaHref" in document)) return "";
  const href = document.ctaHref;
  return typeof href === "string" ? href.trim() : "";
}

export const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value: SlugValue | undefined) => {
          const current = value?.current?.trim() ?? "";
          if (current.startsWith(NEWS_SLUG_PREFIX)) {
            return "Nie dodawaj przedrostka aktualnosc-. Adres to sam slug.";
          }
          return true;
        }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Data na karcie. Puste = data dodania dokumentu.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Krótki opis na karcie. Puste = początek treści.",
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "ctaHref",
      title: "CTA target",
      type: "string",
      description:
        "Puste = przycisk „czytaj więcej” prowadzi do tej aktualności. Inny adres (ścieżka od / albo https) wymaga własnej etykiety.",
      validation: (rule) =>
        rule.custom((value) => {
          if (typeof value !== "string" || !value.trim()) return true;
          return (
            isAllowedCtaHref(value) ||
            "Podaj ścieżkę od ukośnika albo adres https://."
          );
        }),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      description:
        "Własny tekst przycisku. Wymagany, gdy adres prowadzi gdzie indziej niż do tej aktualności.",
      hidden: ({ document }) => !ctaHrefOf(document),
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!ctaHrefOf(context.document)) return true;
          if (typeof value === "string" && value.trim()) return true;
          return "Inny adres wymaga własnej etykiety przycisku.";
        }),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: typeof slug === "string" && slug ? `/${slug}` : undefined,
      };
    },
  },
});
