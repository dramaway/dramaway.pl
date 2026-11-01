import { defineField } from "sanity";

export function titleLanguageField(group?: string) {
  return defineField({
    name: "titleLanguage",
    title: "Język tytułu",
    type: "string",
    ...(group ? { group } : {}),
    initialValue: "pl",
    options: {
      list: [
        { title: "Polski", value: "pl" },
        { title: "English", value: "en" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    description:
      "Język tytułu wyświetlanego na stronie. Dla tytułu angielskiego wybierz English.",
  });
}
