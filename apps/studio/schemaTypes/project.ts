import { defineField, defineType } from "sanity";
import { heroSlidesField } from "./heroMedia";

export const project = defineType({
  name: "project",
  title: "Project",
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
    defineField({
      name: "featured",
      title: "Featured (e.g. Art Generacje)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    heroSlidesField({
      title: "Hero images",
      description:
        "Up to 5 stills for this project's hero. One image stays a static frame. Two or more use the shared slider (Site settings → Hero). Empty = the first edition-gallery image, as before.",
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "editions",
      title: "Editions",
      type: "array",
      of: [{ type: "edition" }],
    }),
    defineField({
      name: "afterword",
      title: "Credits / afterword",
      type: "blockContent",
      description: "Authors, articles, thanks — after the edition list",
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "sponsors",
      title: "Sponsors",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status" },
  },
  orderings: [
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
