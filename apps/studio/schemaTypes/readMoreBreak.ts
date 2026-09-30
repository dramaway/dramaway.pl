import { defineField, defineType } from "sanity";
import { ReadMoreIcon } from "./blockInsertIcons";
import { ReadMoreBreakPreview } from "./readMoreBreakPreview";

/** Marker in main body Portable Text — site folds content below this block. */
export const readMoreBreak = defineType({
  name: "readMoreBreak",
  title: "Czytaj więcej (separator)",
  type: "object",
  icon: ReadMoreIcon,
  fields: [
    defineField({
      name: "marker",
      type: "string",
      initialValue: "readMore",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Separator — ukryta część poniżej" };
    },
  },
  components: { preview: ReadMoreBreakPreview },
});
