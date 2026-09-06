import type { ProjectEdition } from "@/lib/sanity/types";

type EditionYearFields = Pick<ProjectEdition, "year" | "years">;

const YEAR_IN_TEXT = /(?:19|20)\d{2}/;

/** First calendar year in a display string (`2015 - 2016`, `2015–2016`). */
export function firstYearFromYears(years: string | null | undefined) {
  if (!years) return null;
  const match = years.match(YEAR_IN_TEXT);
  return match ? Number(match[0]) : null;
}

/**
 * Sort key: numeric `year`, else first year parsed from `years`.
 * `null` means the caller should fall back to reverse original index.
 */
export function editionYear(edition: EditionYearFields) {
  if (typeof edition.year === "number" && Number.isFinite(edition.year)) {
    return edition.year;
  }
  return firstYearFromYears(edition.years);
}

/**
 * Newest-first copy. Does not mutate the input (CMS array stays as authored).
 * Missing years sort after dated editions, then by reverse original index.
 */
export function sortEditionsNewestFirst<T extends EditionYearFields>(
  editions: readonly T[],
): T[] {
  return editions
    .map((edition, index) => ({ edition, index }))
    .sort((a, b) => {
      const yearA = editionYear(a.edition);
      const yearB = editionYear(b.edition);
      if (yearA != null && yearB != null && yearA !== yearB) {
        return yearB - yearA;
      }
      if (yearA != null && yearB == null) return -1;
      if (yearA == null && yearB != null) return 1;
      return b.index - a.index;
    })
    .map(({ edition }) => edition);
}
