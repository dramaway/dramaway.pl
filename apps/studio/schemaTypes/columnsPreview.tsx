import type { PreviewProps, PreviewValue } from "sanity";
import { youtubeLabel, useYoutubeTitle, useYoutubeTitles } from "./youtubeTitle";

type Span = { text?: string };

export type ColumnBlock = {
  _type?: string;
  children?: Span[];
  label?: string;
  alt?: string;
  url?: string;
};

type ColumnPreview = {
  body?: unknown;
};

function blockText(
  block: ColumnBlock,
  titles: Record<string, string> = {},
): string {
  if (block._type === "block") {
    return (block.children ?? [])
      .map((child) => child.text ?? "")
      .join("")
      .trim();
  }
  if (block._type === "image") {
    const alt = block.alt?.trim();
    return alt ? `Image: ${alt}` : "Image";
  }
  if (block._type === "youtube") {
    const url = block.url?.trim();
    const film = url ? titles[url] : undefined;
    return youtubeLabel(film);
  }
  if (block._type === "ctaButton") {
    return block.label?.trim() ?? "";
  }
  return "";
}

/** List row for one column: skip empty paragraphs so an image or film is not “Empty column”. */
export function columnBodyPreview(body: unknown): PreviewValue {
  if (!Array.isArray(body)) {
    return { title: "Empty column" };
  }
  for (const raw of body) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as ColumnBlock;
    if (block._type === "youtube") {
      const url = block.url?.trim();
      return {
        title: youtubeLabel(),
        subtitle: url || undefined,
      };
    }
    const title = blockText(block);
    if (!title) continue;
    if (block._type === "image") {
      return { title, media: raw as PreviewValue["media"] };
    }
    return { title };
  }
  return { title: "Empty column" };
}

function columnSnippet(
  body: unknown,
  titles: Record<string, string> = {},
): string {
  if (!Array.isArray(body)) return "";
  return body
    .map((block) =>
      block && typeof block === "object"
        ? blockText(block as ColumnBlock, titles)
        : "",
    )
    .filter(Boolean)
    .join("\n");
}

function youtubeUrlsIn(body: unknown): string[] {
  if (!Array.isArray(body)) return [];
  const urls: string[] = [];
  for (const raw of body) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as ColumnBlock;
    const url = block._type === "youtube" ? block.url?.trim() : "";
    if (url) urls.push(url);
  }
  return urls;
}

/** Array row: fetch the film title so a YouTube-only column is not a generic label. */
export function ColumnItemPreview(props: PreviewProps) {
  const url =
    typeof props.subtitle === "string" && props.subtitle.startsWith("http")
      ? props.subtitle
      : undefined;
  const filmTitle = useYoutubeTitle(url);
  return props.renderDefault({
    ...props,
    title: url ? youtubeLabel(filmTitle) : props.title,
    subtitle: undefined,
  });
}

function ColumnSnippet({ body }: { body: unknown }) {
  const titles = useYoutubeTitles(youtubeUrlsIn(body));
  const snippet = columnSnippet(body, titles);
  return (
    <div
      style={{
        minHeight: 36,
        padding: snippet ? "6px 8px" : 0,
        borderRadius: 4,
        background: "rgba(241, 239, 232, 0.12)",
        fontSize: 12,
        lineHeight: 1.45,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 6,
        WebkitBoxOrient: "vertical",
        whiteSpace: "pre-wrap",
      }}
    >
      {snippet}
    </div>
  );
}

/**
 * Studio card for a Columns block. Shows a short snippet of each column
 * so editors can scan the copy without opening the object.
 */
export function ColumnsPreview(props: PreviewProps) {
  const columns = (props as { columns?: ColumnPreview[] }).columns;
  const count = Array.isArray(columns) ? columns.length : 0;
  const label = count === 3 ? "3 columns" : count === 2 ? "2 columns" : "Columns";
  const slots = Math.max(count, 2);

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))`,
          gap: 8,
        }}
      >
        {Array.from({ length: slots }, (_, index) => (
          <ColumnSnippet key={index} body={columns?.[index]?.body} />
        ))}
      </div>
    </div>
  );
}
