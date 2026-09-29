/** Pure helpers for turning a prefixed page into a News document. */

export const NEWS_SLUG_PREFIX = "aktualnosc-";
const TITLE_PREFIX = /^\[Aktualność\]\s*/i;

export function newsSlugFromLegacy(slug) {
  const current = typeof slug === "string" ? slug.trim() : "";
  return current.startsWith(NEWS_SLUG_PREFIX)
    ? current.slice(NEWS_SLUG_PREFIX.length)
    : current;
}

export function newsTitleFromLegacy(title) {
  const current = typeof title === "string" ? title.trim() : "";
  const stripped = current.replace(TITLE_PREFIX, "").trim();
  return stripped || current;
}
