/**
 * Fold the retired /metody page into /baza-wiedzy.
 * Pure helpers — the Sanity write lives in scripts/patch-knowledge-page.mjs.
 */

export const KNOWLEDGE_LANDING_ID = "landing-baza-wiedzy";
export const KNOWLEDGE_PATH = "/baza-wiedzy";
export const RETIRED_METHODS_PATH = "/metody";

function spanText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) {
    return "";
  }
  return block.children
    .filter((child) => child && child._type === "span" && typeof child.text === "string")
    .map((child) => child.text)
    .join("");
}

export function plainTextBlocks(text, createKey) {
  const key = createKey ?? (() => Math.random().toString(16).slice(2, 14));
  return String(text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _key: key(),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: key(),
          _type: "span",
          marks: [],
          text: line,
        },
      ],
    }));
}

/** Put the old methods lead in front of the essay, once. */
export function prependPlainLead(body, lead, createKey) {
  const blocks = plainTextBlocks(lead, createKey);
  const existing = Array.isArray(body) ? body : [];
  if (blocks.length === 0) return existing;
  const first = spanText(existing[0]).trim();
  if (first && first === blocks[0].children[0].text) return existing;
  return [...blocks, ...existing];
}

/**
 * Fields to set when the methods page still has slug `metody`.
 * Returns null once the page already lives at `baza-wiedzy`.
 * The landing lead becomes the hero; the previous hero lead moves into the body.
 */
export function knowledgePagePatch(page, landing, createKey) {
  if (!page || page.slug !== "metody") return null;
  const landingLead = typeof landing?.lead === "string" ? landing.lead : "";
  const previousLead = typeof page.heroLead === "string" ? page.heroLead : "";
  const set = {
    title: "Baza wiedzy",
    slug: { _type: "slug", current: "baza-wiedzy" },
  };
  if (landingLead.trim()) {
    set.heroLead = landingLead;
    if (previousLead.trim() && previousLead.trim() !== landingLead.trim()) {
      set.body = prependPlainLead(page.body, previousLead, createKey);
    }
  }
  return set;
}

export function replaceDocumentRef(value, fromId, toId) {
  if (Array.isArray(value)) {
    return value.map((item) => replaceDocumentRef(item, fromId, toId));
  }
  if (!value || typeof value !== "object") return value;
  const next = {};
  for (const [key, child] of Object.entries(value)) {
    next[key] = key === "_ref" && child === fromId ? toId : replaceDocumentRef(child, fromId, toId);
  }
  return next;
}

function isKnowledgeHubItem(item, { pageId, landingId }) {
  const ref = item.page?._ref;
  if (ref === landingId || (pageId && ref === pageId)) return true;
  if (typeof item.href === "string" && item.href.trim() === KNOWLEDGE_PATH) return true;
  if (typeof item.label === "string" && item.label.trim() === "Baza wiedzy") return true;
  return false;
}

function isRetiredMethodsChild(child, pageId) {
  if (!child || typeof child !== "object") return false;
  if (typeof child.href === "string" && child.href.trim() === RETIRED_METHODS_PATH) {
    return true;
  }
  if (typeof child.label === "string" && child.label.trim() === "Metody") return true;
  if (pageId && child.page?._ref === pageId) return true;
  return false;
}

/**
 * Point the Baza wiedzy menu row at the page document and drop the Metody child.
 * Czytelnia stays. Other rows are only rewritten when they still reference the landing.
 */
export function foldKnowledgeNavigation(navigation, { pageId, landingId = KNOWLEDGE_LANDING_ID }) {
  if (!Array.isArray(navigation)) return navigation;
  return navigation.map((item) => {
    if (!item || typeof item !== "object") return item;
    const hub = isKnowledgeHubItem(item, { pageId, landingId });
    const rewritten = replaceDocumentRef(item, landingId, pageId);
    if (!hub) return rewritten;
    const children = Array.isArray(rewritten.children)
      ? rewritten.children.filter((child) => !isRetiredMethodsChild(child, pageId))
      : undefined;
    const { href: _href, ...rest } = rewritten;
    const parent = {
      ...rest,
      target: "reference",
      page: {
        ...(rest.page && typeof rest.page === "object" ? rest.page : {}),
        _type: "reference",
        _ref: pageId,
      },
    };
    if (children && children.length > 0) parent.children = children;
    else delete parent.children;
    return parent;
  });
}

/**
 * Patch fields for one document that still points at the retired landing.
 * `null` means nothing to write.
 */
export function knowledgeReferencePatch(doc, { pageId, landingId = KNOWLEDGE_LANDING_ID }) {
  if (!doc || typeof doc !== "object") return null;
  if (doc._id === landingId || doc._id === `drafts.${landingId}`) return null;
  const set = {};
  let changed = false;
  for (const [key, value] of Object.entries(doc)) {
    if (key.startsWith("_")) continue;
    if (key === "navigation") {
      const folded = foldKnowledgeNavigation(value, { pageId, landingId });
      if (JSON.stringify(folded) !== JSON.stringify(value)) {
        set.navigation = folded;
        changed = true;
      }
      continue;
    }
    const json = JSON.stringify(value);
    if (!json || !json.includes(landingId)) continue;
    set[key] = replaceDocumentRef(value, landingId, pageId);
    changed = true;
  }
  return changed ? set : null;
}
