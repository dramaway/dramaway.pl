import { defineType, defineField } from "sanity";

const NEWS_SLUG_PREFIX = "aktualnosc-";

function isNewsDocument(document: unknown) {
  if (!document || typeof document !== "object") return false;
  const slug = "slug" in document ? document.slug : undefined;
  if (!slug || typeof slug !== "object") return false;
  const current = "current" in slug ? slug.current : undefined;
  return typeof current === "string" && current.startsWith(NEWS_SLUG_PREFIX);
}

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => isNewsDocument(document),
      description:
        "Dedicated header photo. Empty = no still; the split layout stays.",
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
      hidden: ({ document }) => isNewsDocument(document),
      description: "Shown under the H1. Empty = no lead (title + body only).",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      hidden: ({ document }) => isNewsDocument(document),
    }),
    defineField({
      name: "heroCtaHref",
      title: "Hero CTA target",
      type: "string",
      hidden: ({ document }) => isNewsDocument(document),
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
      description: "Date on the news card. Empty = no date shown.",
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
  ],
  preview: {
    select: { title: "title" },
  },
});
