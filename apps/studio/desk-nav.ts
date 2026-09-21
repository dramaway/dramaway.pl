/** A nav row as stored on `siteSettings.navigation`, after a light GROQ projection. */
export type DeskNavSource = {
  _key?: string | null;
  label?: string | null;
  target?: string | null;
  pageId?: string | null;
  pageType?: string | null;
  pageTitle?: string | null;
  children?: DeskNavSource[] | null;
};

/** One shortcut in the Studio desk. `children` is empty for a plain document link. */
export type DeskNavEntry = {
  id: string;
  title: string;
  schemaType: string;
  documentId: string;
  children: DeskNavEntry[];
};

function publishedId(id: string): string {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}

function titleFor(item: DeskNavSource): string {
  const label = item.label?.trim();
  if (label) return label;
  const pageTitle = item.pageTitle?.trim();
  if (pageTitle) return pageTitle;
  return "Pozycja";
}

function toEntry(
  item: DeskNavSource,
  index: number,
  omit: ReadonlySet<string>,
): DeskNavEntry | null {
  if (item.target === "path") return null;
  const rawId = item.pageId?.trim();
  const schemaType = item.pageType?.trim();
  if (!rawId || !schemaType) return null;

  const documentId = publishedId(rawId);
  if (omit.has(documentId)) return null;

  const children = (item.children ?? [])
    .map((child, childIndex) => toEntry(child, childIndex, omit))
    .filter((child): child is DeskNavEntry => child !== null);

  const key = item._key?.trim() || `${documentId}-${index}`;
  return {
    id: `nav-${key}`,
    title: titleFor(item),
    schemaType,
    documentId,
    children,
  };
}

/**
 * Desk shortcuts from the site menu. Path-only rows and rows without a
 * document are omitted. An empty result means the caller should use the
 * built-in shortcut list.
 */
export function deskNavFromSettings(
  items: DeskNavSource[] | null | undefined,
  omitDocumentIds: readonly string[] = [],
): DeskNavEntry[] {
  const omit = new Set(omitDocumentIds.map(publishedId));
  return (items ?? [])
    .map((item, index) => toEntry(item, index, omit))
    .filter((item): item is DeskNavEntry => item !== null);
}

/** `page` documents already shown as shortcuts, so the Page list can hide them. */
export function pageDocumentIds(entries: readonly DeskNavEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    if (entry.schemaType === "page") ids.push(entry.documentId);
    ids.push(...pageDocumentIds(entry.children));
  }
  return ids;
}
