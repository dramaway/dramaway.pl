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
        { title: "Português", value: "pt" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    description:
      "Język tytułu wyświetlanego na stronie. Wybierz język tytułu, nie język całego nagrania.",
  });
}
