/** Build a privacy-enhanced YouTube embed URL, or null if the href is not YouTube. */
export function youtubeEmbedSrc(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    const list = parsed.searchParams.get("list");
    const id = parsed.searchParams.get("v");
    if (list && !id) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
    if (id) {
      const t = parsed.searchParams.get("t");
      const start = t ? `?start=${Number.parseInt(t, 10) || 0}` : "";
      return `https://www.youtube-nocookie.com/embed/${id}${start}`;
    }
  } catch {
    return null;
  }
  return null;
}
