import { defineArrayMember, defineField, defineType } from "sanity";
import { CreditsIcon } from "./creditsIcon";

/** First name in a comma- or newline-separated list, plus how many follow. */
function peoplePreview(people?: string) {
  const entries = (people ?? "")
    .split(/,|\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (entries.length === 0) return "";
  const [first, ...rest] = entries;
  return rest.length > 0 ? `${first} +${rest.length}` : first;
}

/** One role and the people in it. */
export const creditRow = defineType({
  name: "creditRow",
  title: "Rola",
  type: "object",
  fields: [
    defineField({
      name: "role",
      title: "Rola",
      type: "string",
      description:
        "Krótko, np. reżyseria, muzyka, koordynacja projektu. Dłuższe doprecyzowanie wpisz w Dopisek, nie tutaj.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Dopisek",
      type: "string",
      description:
        "Opcjonalne doprecyzowanie pod rolą, np. „w tym autorstwo i wykonanie utworu …”. Puste = brak dopisku.",
    }),
    defineField({
      name: "people",
      title: "Osoby",
      type: "text",
      rows: 2,
      description:
        "Nazwiska po przecinku albo każde w nowej linii. Mogą to być też instytucje.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { role: "role", note: "note", people: "people" },
    prepare({ role, note, people }) {
      return {
        title: role || "Rola",
        subtitle: [peoplePreview(people), note ? `(${note})` : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});

/** A list of people with no roles — the cast, or a plain team list. */
export const creditNames = defineType({
  name: "creditNames",
  title: "Lista bez ról",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etykieta",
      type: "string",
      description:
        "Opcjonalna etykieta po lewej, np. obsada. Puste = sam ciąg nazwisk na całą szerokość.",
    }),
    defineField({
      name: "people",
      title: "Osoby",
      type: "text",
      rows: 3,
      description:
        "Nazwiska po przecinku albo każde w nowej linii. Na stronie rozdziela je kropka środkowa.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: "label", people: "people" },
    prepare({ label, people }) {
      return {
        title: label || "Lista bez ról",
        subtitle: peoplePreview(people),
      };
    },
  },
});

/** A named run of rows — Autorstwo, Obsada, Realizacja, Produkcja, Partnerzy. */
export const creditGroup = defineType({
  name: "creditGroup",
  title: "Grupa",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Nagłówek grupy",
      type: "string",
      description:
        "Np. Autorstwo, Obsada, Realizacja artystyczna, Produkcja, Partnerzy. Puste = wiersze bez nagłówka (przy krótkim wykazie).",
    }),
    defineField({
      name: "rows",
      title: "Wiersze",
      type: "array",
      description: "Przeciągnij, żeby zmienić kolejność.",
      of: [
        defineArrayMember({ type: "creditRow" }),
        defineArrayMember({ type: "creditNames" }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", rows: "rows" },
    prepare({ title, rows }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return {
        title: title || "Grupa bez nagłówka",
        subtitle: count === 1 ? "1 wiersz" : `${count} wierszy`,
      };
    },
  },
});

/**
 * Credits for a project or an edition. Replaces the free-text block where
 * role and names ran together — see docs/design/system.md.
 */
export const credits = defineType({
  name: "credits",
  title: "Wykaz twórców",
  type: "object",
  icon: CreditsIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Nagłówek",
      type: "string",
      description:
        "Np. Twórcy, albo tytuł spektaklu, gdy edycja ma dwa wykazy. Puste = bez nagłówka.",
    }),
    defineField({
      name: "groups",
      title: "Grupy",
      type: "array",
      of: [defineArrayMember({ type: "creditGroup" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "note",
      title: "Notka końcowa",
      type: "text",
      rows: 2,
      description:
        "Np. „Projekt współfinansowany przez …”. Stoi pod wierszami, nie jest rolą. Puste = brak notki.",
    }),
  ],
  preview: {
    select: { heading: "heading", groups: "groups" },
    prepare({ heading, groups }) {
      const list = Array.isArray(groups) ? groups : [];
      const rows = list.reduce(
        (total: number, group: { rows?: unknown[] }) =>
          total + (Array.isArray(group?.rows) ? group.rows.length : 0),
        0,
      );
      return {
        title: heading || "Wykaz twórców",
        subtitle: `${list.length} grup · ${rows} wierszy`,
      };
    },
  },
});
