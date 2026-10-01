import { defineField, defineType } from "sanity";
import { contentSectionMembers } from "./contentModule";
import { heroSlidesField } from "./heroMedia";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    heroSlidesField(),
    defineField({
      name: "heroLead",
      title: "Hero lead",
      type: "text",
      rows: 3,
      description: "Shown under the H1. Empty = no lead (title + body only).",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
    }),
    defineField({
      name: "heroCtaHref",
      title: "Hero CTA target",
      type: "string",
      description: "Internal path, e.g. /czytelnia",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short card teaser. Empty = first ~400 characters of body.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Optional date. Empty = not shown.",
    }),
    defineField({
      name: "sections",
      title: "Sekcje",
      type: "array",
      description: "Moduły nad treścią artykułu. Pusta lista = sam artykuł.",
      of: contentSectionMembers(),
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: previewPath(slug) };
    },
  },
});

function previewPath(slug: unknown) {
  if (typeof slug !== "string" || !slug) return undefined;
  return `/${slug}`;
}
