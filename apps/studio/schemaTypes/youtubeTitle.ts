import { useEffect, useState } from "react";

const titles = new Map<string, string | null>();
const pending = new Map<string, Promise<string | null>>();

async function fetchYoutubeTitle(url: string): Promise<string | null> {
  const sources = [
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    `https://noembed.com/embed?url=${encodeURIComponent(url)}`,
  ];
  for (const src of sources) {
    try {
      const res = await fetch(src);
      if (!res.ok) continue;
      const data = (await res.json()) as { title?: string };
      const title = data.title?.trim();
      if (title) return title;
    } catch {
      /* try the next source */
    }
  }
  return null;
}

export function loadYoutubeTitle(url: string): Promise<string | null> {
  if (titles.has(url)) return Promise.resolve(titles.get(url) ?? null);
  const inflight = pending.get(url);
  if (inflight) return inflight;
  const request = fetchYoutubeTitle(url).then((title) => {
    titles.set(url, title);
    pending.delete(url);
    return title;
  });
  pending.set(url, request);
  return request;
}

export function youtubeLabel(title?: string): string {
  return title ? `YouTube: ${title}` : "YouTube film";
}

export function useYoutubeTitle(url?: string): string | undefined {
  const [title, setTitle] = useState<string | undefined>(() => {
    if (!url || !titles.has(url)) return undefined;
    return titles.get(url) ?? undefined;
  });

  useEffect(() => {
    if (!url) {
      setTitle(undefined);
      return;
    }
    let cancelled = false;
    void loadYoutubeTitle(url).then((next) => {
      if (!cancelled) setTitle(next ?? undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return title;
}

export function useYoutubeTitles(urls: string[]): Record<string, string> {
  const key = urls.join("\n");
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const list = key.length === 0 ? [] : key.split("\n");
    if (list.length === 0) {
      setMap({});
      return;
    }
    let cancelled = false;
    void Promise.all(
      list.map(async (url) => [url, await loadYoutubeTitle(url)] as const),
    ).then((entries) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const [url, title] of entries) {
        if (title) next[url] = title;
      }
      setMap(next);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return map;
}
