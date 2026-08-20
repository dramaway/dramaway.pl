import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "centrumUrl",
      title: "Centrum (external) URL",
      type: "url",
      description: "Link to centrum.dramaway.pl — not migrated in MVP",
    }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "text",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
