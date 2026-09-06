import type { PreviewProps } from "sanity";

type ColumnPreview = {
  body?: unknown[];
};

/** Studio card: how many columns, plus a snippet from the first. */
export function ColumnsPreview(props: PreviewProps) {
  const columns = (props as { columns?: ColumnPreview[] }).columns;
  const count = Array.isArray(columns) ? columns.length : 0;
  const label = count === 3 ? "3 columns" : count === 2 ? "2 columns" : "Columns";

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(count, 2)}, 1fr)`,
          gap: 8,
        }}
      >
        {Array.from({ length: Math.max(count, 2) }, (_, index) => (
          <div
            key={index}
            style={{
              minHeight: 36,
              borderRadius: 4,
              background: "rgba(241, 239, 232, 0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
