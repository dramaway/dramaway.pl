import { defineArrayMember, defineField, defineType } from "sanity";
import { YoutubePreview } from "./youtubePreview";

export const youtube = defineType({
  name: "youtube",
  title: "YouTube",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { url: "url", title: "url" },
  },
  components: { preview: YoutubePreview },
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
        defineField({
          name: "size",
          title: "Size",
          type: "string",
          options: {
            list: [
              { title: "Small", value: "small" },
              { title: "Medium", value: "medium" },
              { title: "Wide", value: "wide" },
            ],
            layout: "radio",
          },
          initialValue: "medium",
          description:
            "Display width in the article. Existing images without a value render as medium.",
        }),
      ],
    }),
    defineArrayMember({ type: "youtube", title: "YouTube film" }),
  ],
});
