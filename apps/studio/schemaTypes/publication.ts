import { defineType, defineField } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Reading room article", value: "article" },
          { title: "Book / publisher item", value: "book" },
          { title: "Report / PDF", value: "report" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "article",
    }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({ name: "file", title: "File (PDF)", type: "file" }),
  ],
  preview: {
    select: { title: "title", subtitle: "kind" },
  },
});
