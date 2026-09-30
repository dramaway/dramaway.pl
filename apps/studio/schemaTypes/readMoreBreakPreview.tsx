import type { PreviewProps } from "sanity";

/** In-editor card for the read-more fold marker (no fields). */
export function ReadMoreBreakPreview(_props: PreviewProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 4px",
        opacity: 0.85,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: "currentColor",
          opacity: 0.25,
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
        Ukryta część poniżej
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "currentColor",
          opacity: 0.25,
        }}
      />
    </div>
  );
}
