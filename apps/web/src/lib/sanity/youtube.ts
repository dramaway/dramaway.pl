/** Privacy-enhanced YouTube embed URL, or null if the href is not an allowed host/id. */

const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const VIDEO_ID_RE = /^[\w-]{11}$/;
const PLAYLIST_ID_RE = /^[\w-]+$/;
const PATH_ID_PREFIX = new Set(["embed", "shorts", "live", "v"]);

function youtubeVideoId(parsed: URL): string | null {
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    return VIDEO_ID_RE.test(id) ? id : null;
  }

  const fromQuery = parsed.searchParams.get("v");
  if (fromQuery && VIDEO_ID_RE.test(fromQuery)) return fromQuery;

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (
    parts[0] &&
    PATH_ID_PREFIX.has(parts[0]) &&
    parts[1] &&
    VIDEO_ID_RE.test(parts[1])
  ) {
    return parts[1];
  }

  return null;
}

function youtubePlaylistId(parsed: URL): string | null {
  const list = parsed.searchParams.get("list");
  if (!list || !PLAYLIST_ID_RE.test(list)) return null;
  return list;
}

function startSeconds(parsed: URL): number {
  const raw = parsed.searchParams.get("t") ?? parsed.searchParams.get("start");
  if (!raw) return 0;
  return Number.parseInt(raw, 10) || 0;
}

export function youtubeEmbedSrc(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) return null;

    const id = youtubeVideoId(parsed);
    if (id) {
      const start = startSeconds(parsed);
      const startQuery = start > 0 ? `?start=${start}` : "";
      return `https://www.youtube-nocookie.com/embed/${id}${startQuery}`;
    }

    const list = youtubePlaylistId(parsed);
    if (list) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
  } catch {
    return null;
  }
  return null;
}
