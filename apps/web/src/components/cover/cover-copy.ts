/**
 * Pre-launch cover copy. Move the premiere by editing PREMIERE only —
 * every variant reads the date from here.
 */
export const PREMIERE = {
  iso: "2026-11-15",
  /** "w niedzielę" — locative with the weekday, as used in a sentence. */
  weekday: "w\u00a0niedzielę",
  /** Day + month in the genitive. */
  date: "15 listopada",
} as const;

export const COVER_SITE_LABEL = "Nowa strona Fundacji DramaWay";

export const COVER_VARIANTS = [1, 2, 3] as const;
export type CoverVariant = (typeof COVER_VARIANTS)[number];

/** localStorage key of the last shown variant (rotation per visitor). */
export const COVER_STORAGE_KEY = "dw-cover";
/** `?wersja=1|2|3` forces a variant without touching the rotation. */
export const COVER_QUERY_PARAM = "wersja";
