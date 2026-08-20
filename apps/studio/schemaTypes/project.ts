import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Archive", value: "archive" },
        ],
      },
      initialValue: "active",
    }),
    defineField({ name: "featured", title: "Featured (e.g. Art Generacje)", type: "boolean", initialValue: false }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "editions",
      title: "Editions",
      type: "array",
      of: [
        {
          type: "object",
          name: "edition",
          fields: [
            defineField({ name: "title", title: "Edition title", type: "string" }),
            defineField({ name: "year", title: "Year", type: "number" }),
            defineField({ name: "summary", title: "Summary", type: "text" }),
            defineField({
              name: "gallery",
              title: "Gallery",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
            defineField({
              name: "partners",
              title: "Partners",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: { select: { title: "title", subtitle: "year" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status" },
  },
});
