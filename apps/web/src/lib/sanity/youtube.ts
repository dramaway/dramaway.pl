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

function parseYoutubeUrl(url: string): URL | null {
  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function youtubeVideoIdFromUrl(url: string): string | null {
  const parsed = parseYoutubeUrl(url);
  return parsed ? youtubeVideoId(parsed) : null;
}

/** Cover stills, sharpest first. A missing size often returns a 120×90 placeholder. */
export function youtubePosterUrls(videoId: string): string[] {
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
}

export function youtubeEmbedSrc(
  url: string,
  options: { autoplay?: boolean } = {},
): string | null {
  const parsed = parseYoutubeUrl(url);
  if (!parsed) return null;

  const params = new URLSearchParams();
  const start = startSeconds(parsed);
  if (start > 0) params.set("start", String(start));
  if (options.autoplay) params.set("autoplay", "1");
  const query = params.toString();
  const suffix = query ? `?${query}` : "";

  const id = youtubeVideoId(parsed);
  if (id) {
    return `https://www.youtube-nocookie.com/embed/${id}${suffix}`;
  }

  const list = youtubePlaylistId(parsed);
  if (list) {
    params.set("list", list);
    const listQuery = params.toString();
    return `https://www.youtube-nocookie.com/embed/videoseries?${listQuery}`;
  }

  return null;
}
