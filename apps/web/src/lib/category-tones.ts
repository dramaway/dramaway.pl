/**
 * One colour per Czytelnia category, taken from the brand circles on
 * /fundacja (`--color-brand-1…7`). The same tone marks the category in the
 * library and the matching headword in the Baza wiedzy essay.
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

/** Essay headwords start with the category name or a close synonym. */
const SLUG_BY_TERM_PREFIX: readonly [string, string][] = [
  ["teatr zaangazowany", "teatr-zaangazowany-spolecznie"],
  ["teatr forum", "teatr-forum"],
  ["teatr w edukacji", "teatr-w-edukacji"],
  ["teatr ze spolecznoscia", "teatr-ze-spolecznoscia"],
  ["warsztaty tworcze", "metody-tworcze"],
  ["metody tworcze", "metody-tworcze"],
  ["drama", "drama"],
];

const FALLBACK_TONES: readonly CategoryTone[] = [7, 1, 2, 3, 4, 5, 6];

function fold(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function categoryToneForSlug(
  slug: string,
  index = 0,
): CategoryTone {
  return TONE_BY_SLUG[slug] ?? FALLBACK_TONES[index % FALLBACK_TONES.length];
}

export function categoryToneForTerm(text: string): CategoryTone | null {
  const folded = fold(text);
  const hit = SLUG_BY_TERM_PREFIX.find(([prefix]) => folded.startsWith(prefix));
  return hit ? categoryToneForSlug(hit[1]) : null;
}
