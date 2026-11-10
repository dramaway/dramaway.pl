/** https share link for the Studio tool, or null when the tool must stay hidden. */
export function umamiShareUrl(raw: string | undefined): string | null {
  const value = raw?.trim() ?? "";
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  return url.toString();
}

export function studioToolsWithStatistics<T>(
  tools: readonly T[],
  rawShareUrl: string | undefined,
  createTool: (shareUrl: string) => T,
): T[] {
  const shareUrl = umamiShareUrl(rawShareUrl);
  if (!shareUrl) return [...tools];
  return [...tools, createTool(shareUrl)];
}
