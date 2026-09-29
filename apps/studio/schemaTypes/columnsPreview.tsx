import type { PreviewProps } from "sanity";

type Span = { text?: string };

type ColumnBlock = {
  _type?: string;
  children?: Span[];
  label?: string;
  alt?: string;
};

type ColumnPreview = {
  body?: unknown;
};

function blockText(block: ColumnBlock): string {
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
  if (block._type === "ctaButton") {
    return block.label?.trim() ?? "";
  }
  return "";
}

function columnSnippet(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return body
    .map((block) =>
      block && typeof block === "object" ? blockText(block as ColumnBlock) : "",
    )
    .filter(Boolean)
    .join("\n");
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
        {Array.from({ length: slots }, (_, index) => {
          const snippet = columnSnippet(columns?.[index]?.body);
          return (
            <div
              key={index}
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
        })}
      </div>
    </div>
  );
}
