import { defineArrayMember, defineType } from "sanity";

/** Shared Portable Text: blocks + inline images (migration stores images in body/bio). */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
      ],
    }),
  ],
});
