import { defineField, defineType } from "sanity";

export const projectTextSection = defineType({
  name: "projectTextSection",
  title: "Blok tekstowy projektu",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Nagłówek",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingColor",
      title: "Kolor nagłówka",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "Kolory marki", value: "brand" },
          { title: "Czarny", value: "black" },
        ],
      },
      initialValue: "brand",
    }),
    defineField({
      name: "text",
      title: "Tekst",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "text" },
    prepare({ title, subtitle }) {
      return {
        title: title?.trim() || "Blok tekstowy",
        subtitle: subtitle?.trim(),
      };
    },
  },
});
