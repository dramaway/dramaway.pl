import type { ProjectEdition } from "@/lib/sanity/types";

type EditionName = Pick<ProjectEdition, "title" | "theme" | "year" | "years">;

/** Prefer theme + year when both exist; never invent a theme. */
export function editionHeading(edition: EditionName) {
  const theme = edition.theme?.trim();
  const year =
    edition.years?.trim() ||
    (edition.year != null ? String(edition.year) : "");
  if (theme && year) return `${year}: ${theme}`;
  if (theme) return theme;
  return edition.title;
}
