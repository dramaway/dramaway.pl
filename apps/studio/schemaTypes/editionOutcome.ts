import { defineField, defineType } from "sanity";

/** Generic result of an edition: spectacle, event, publication, etc. Shape may tighten with Figma. */
export const editionOutcome = defineType({
  name: "editionOutcome",
  title: "Edition outcome",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
});
