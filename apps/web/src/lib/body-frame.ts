export type BlockAlign = "left" | "center" | "right";
export type EmbedSize = "medium" | "full";

/** Empty alignment sits on the left, for pictures and films alike. */
export function blockAlign(value: string | undefined): BlockAlign {
  if (value === "center" || value === "right") return value;
  return "left";
}

/** Empty size is Medium. Full width is the only other film size. */
export function embedSize(value: string | undefined): EmbedSize {
  return value === "full" ? "full" : "medium";
}
