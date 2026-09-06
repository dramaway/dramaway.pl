import type { CSSProperties, ReactNode } from "react";

type TermStyleProps = {
  children?: ReactNode;
};

const wrap: CSSProperties = {
  position: "relative",
  fontWeight: "inherit",
  lineHeight: 1.55,
};

const blob: CSSProperties = {
  position: "absolute",
  zIndex: 0,
  width: 88,
  height: 88,
  borderRadius: "50%",
  background: "rgba(241, 239, 232, 0.16)",
  insetBlockStart: -28,
  insetInlineStart: -28,
  pointerEvents: "none",
};

const label: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

/** Studio preview for the Portable Text `term` style. */
export function TermStyle({ children }: TermStyleProps) {
  return (
    <div style={wrap}>
      <span aria-hidden style={blob} />
      <span style={label}>{children}</span>
    </div>
  );
}
