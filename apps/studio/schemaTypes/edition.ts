import { defineField, defineType } from "sanity";

export const edition = defineType({
  name: "edition",
  title: "Edition",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Edition title",
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
      name: "year",
      title: "Year (sort)",
      type: "number",
      description: "First year of the edition, used for ordering",
    }),
    defineField({
      name: "years",
      title: "Years (display)",
      type: "string",
      description: "e.g. 2015–2016",
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
    }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      description:
        "Spectacles, events, or other results of this edition (0–n). Generic until Figma.",
      type: "array",
      of: [{ type: "editionOutcome" }],
    }),
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
  preview: {
    select: { title: "title", subtitle: "years" },
  },
});
