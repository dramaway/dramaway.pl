import type { PreviewProps } from "sanity";

function youtubeId(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "").split("/")[0] || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

/** Studio card: thumbnail + URL so editors see the film, not a blank object. */
export function YoutubePreview(props: PreviewProps) {
  const url =
    typeof (props as { url?: string }).url === "string"
      ? (props as { url?: string }).url
      : undefined;
  const id = youtubeId(url);
  const thumb = id
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : undefined;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 4 }}>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          width={96}
          height={54}
          style={{ objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
        />
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>YouTube</div>
        <div
          style={{
            fontSize: 12,
            opacity: 0.7,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {url || "Brak URL"}
        </div>
      </div>
    </div>
  );
}
