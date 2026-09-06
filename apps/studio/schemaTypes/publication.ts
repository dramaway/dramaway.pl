import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "Articles", value: "articles" },
          { title: "Books", value: "books" },
          { title: "Scripts", value: "scripts" },
          { title: "Multimedia", value: "multimedia" },
        ],
      },
      description:
        "Czytelnia drawer (Drupal field_kategoria_czytelnii). Front copy is Polish in the site, not here.",
    }),
    defineField({
      name: "methods",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "readingMethod" }] }],
      description:
        "Czytelnia tags from the Word list. Not the /metody essays and not a second listing.",
    }),
    defineField({
      name: "listed",
      title: "Listed in Czytelnia",
      type: "boolean",
      initialValue: false,
      description:
        "True = Word curation; shown on /czytelnia when that listing exists. False = URL only.",
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "string" }],
      description: "Portal persona names as strings — not person documents.",
    }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({ name: "file", title: "File (PDF)", type: "file" }),
    defineField({
      name: "legacyDrupal",
      title: "Legacy Drupal",
      type: "object",
      hidden: true,
      fields: [
        defineField({ name: "nid", title: "nid", type: "number" }),
        defineField({ name: "alias", title: "Old alias", type: "string" }),
        defineField({
          name: "format",
          title: "Old Drupal format drawer",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", listed: "listed" },
    prepare: ({ title, listed }) => ({
      title,
      subtitle: listed ? "Listed" : "Unlisted",
    }),
  },
});
