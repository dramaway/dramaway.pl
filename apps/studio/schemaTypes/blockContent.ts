import { defineArrayMember, defineField, defineType } from "sanity";
import {
  columnBodyPreview,
  ColumnItemPreview,
  ColumnsPreview,
} from "./columnsPreview";
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
        direction: "horizontal",
      },
      initialValue: "medium",
      description:
        "How large the image renders on the site. Small = inset (~24rem), Medium = text column (default), Wide = wider than the text. Wide always stays its own row. Publish after changing. Existing images without a value render as medium.",
    }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Centre", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "center",
      description:
        "Where the picture sits in the text column. Most visible on Small, or when text wraps. Existing pictures without a value stay centred.",
    }),
    defineField({
      name: "layout",
      title: "Placement",
      type: "string",
      options: {
        list: [
          { title: "Block", value: "block" },
          { title: "Wrap text", value: "inline" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "block",
      description:
        "Block: the picture is its own row. Wrap text: the following paragraphs flow beside it. Wrap needs Left or Right, and Small or Medium. Centre and Wide stay a block. On a narrow screen wrap becomes a block. Publish after changing.",
      validation: (rule) =>
        rule
          .custom((value, context) => {
            if (value !== "inline") return true;
            const parent = context.parent as
              | { align?: string; size?: string }
              | undefined;
            if (parent?.size === "wide") {
              return "Wide stays a block. Choose Small or Medium to wrap text.";
            }
            if (!parent?.align || parent.align === "center") {
              return "Centre stays a block. Choose Left or Right to wrap text.";
            }
            return true;
          })
          .warning(),
    }),
  ],
});

/** Nested Portable Text for a column — no columns-inside-columns. */
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
        defineArrayMember({ type: "youtube", title: "YouTube film" }),
        defineArrayMember({ type: "ctaButton" }),
      ],
    }),
  ],
  preview: {
    select: { body: "body" },
    prepare({ body }) {
      return columnBodyPreview(body);
    },
  },
  components: { preview: ColumnItemPreview },
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
        "2 or 3 columns. Below 1024 px they become one column. A column can hold text, an image, a YouTube film, and a button.",
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
