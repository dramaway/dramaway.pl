/**
 * One colour per Czytelnia category, taken from the brand circles on
 * /fundacja (`--color-brand-1…7`). The tone marks the category in the library.
 */
export type CategoryTone = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const TONE_BY_SLUG: Record<string, CategoryTone> = {
  drama: 3,
  "teatr-forum": 1,
  "teatr-w-edukacji": 2,
  "teatr-ze-spolecznoscia": 4,
  "teatr-zaangazowany-spolecznie": 6,
  "metody-tworcze": 5,
};

const FALLBACK_TONES: readonly CategoryTone[] = [7, 1, 2, 3, 4, 5, 6];

export function categoryToneForSlug(
  slug: string,
  index = 0,
): CategoryTone {
  return TONE_BY_SLUG[slug] ?? FALLBACK_TONES[index % FALLBACK_TONES.length];
}
