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
    heroSlidesField({
      title: "Hero images",
      description:
        "Up to 5 stills, in show order. One image stays a static frame. Two or more use the shared slider (Site settings → Hero). A non-empty list replaces the single image below. Empty list = that single image, or no still.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (single)",
      type: "image",
      options: { hotspot: true },
      description:
        "Used only while Hero images is empty. Move this still onto that list before adding more — the list replaces this field.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
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
