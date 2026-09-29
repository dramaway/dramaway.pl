import { defineArrayMember, defineField, defineType } from "sanity";
import { ColumnsPreview } from "./columnsPreview";
import { IndentIcon } from "./indentIcon";
import { RosterIcon } from "./rosterIcon";
import { TermStyle } from "./termStyle";
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

const blockMarks = {
  annotations: [
    {
      name: "link",
      type: "object",
      title: "Link",
      fields: [
        defineField({
          name: "href",
          type: "url",
          title: "URL",
          validation: (rule) =>
            rule.uri({
              allowRelative: true,
              scheme: ["http", "https", "mailto", "tel"],
            }),
        }),
      ],
    },
  ],
};

const textBlockMember = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H1", value: "h1" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
    { title: "Quote", value: "blockquote" },
    // Dictionary headword with listing blob. Not Quote — keep blockquote.
    { title: "Termin", value: "term", component: TermStyle },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
    { title: "Indent", value: "indent", icon: IndentIcon },
    { title: "Roles", value: "roster", icon: RosterIcon },
  ],
  marks: blockMarks,
});

const imageBlockMember = defineArrayMember({
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
        "How large the image renders on the site. Small = inset (~24rem), Medium = text column (default), Wide = wider than the text. Publish after changing. Existing images without a value render as medium.",
    }),
  ],
});

/** Nested Portable Text for a column — no columns-inside-columns, no YouTube. */
const columnBodyMember = defineArrayMember({
  type: "object",
  name: "column",
  title: "Column",
  fields: [
    defineField({
      name: "body",
      title: "Text",
      type: "array",
      of: [
        textBlockMember,
        imageBlockMember,
        defineArrayMember({ type: "ctaButton" }),
      ],
    }),
  ],
  preview: {
    select: { body: "body" },
    prepare({ body }) {
      const first = Array.isArray(body) ? body[0] : null;
      if (
        first &&
        typeof first === "object" &&
        "_type" in first &&
        first._type === "ctaButton" &&
        "label" in first &&
        typeof first.label === "string" &&
        first.label.trim()
      ) {
        return { title: first.label.trim() };
      }
      const children = first && typeof first === "object" && "children" in first
        ? (first as { children?: { text?: string }[] }).children
        : undefined;
      const snippet = children?.map((child) => child.text ?? "").join("") ?? "";
      return {
        title: snippet.trim() || "Empty column",
      };
    },
  },
});

export const textColumns = defineType({
  name: "textColumns",
  title: "Columns",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      of: [columnBodyMember],
      initialValue: [
        { _type: "column", body: [] },
        { _type: "column", body: [] },
      ],
      validation: (rule) =>
        rule
          .required()
          .min(2)
          .max(3)
          .error("Use 2 or 3 columns. They stack to one on small screens."),
      description:
        "2 or 3 columns. Below 1024 px they become one column. A column can hold text, an image, and a button.",
    }),
  ],
  preview: {
    select: { columns: "columns" },
  },
  components: { preview: ColumnsPreview },
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    textBlockMember,
    imageBlockMember,
    defineArrayMember({ type: "youtube", title: "YouTube film" }),
    defineArrayMember({ type: "textColumns", title: "Columns" }),
    defineArrayMember({ type: "ctaButton", title: "Button" }),
  ],
});
