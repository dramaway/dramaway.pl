import { defineField } from "sanity";

export function imageAltField() {
  return defineField({
    name: "alt",
    title: "Tekst alternatywny",
    type: "string",
    description:
      "Krótko opisz najważniejszą treść zdjęcia. Zostaw puste tylko wtedy, gdy zdjęcie jest dekoracyjne.",
  });
}
