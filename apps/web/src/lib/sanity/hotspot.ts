type Hotspot = { x?: number; y?: number };
type Crop = { top?: number; bottom?: number; left?: number; right?: number };

/**
 * CSS `object-position` for a Sanity image cropped with `object-fit: cover`.
 * Hotspot x/y are fractions of the original file. Crop trims the edges first,
 * so the point is remapped into what remains.
 */
export function objectPositionFromHotspot(image: unknown): string | undefined {
  if (!image || typeof image !== "object") return undefined;
  const record = image as {
    hotspot?: Hotspot | null;
    crop?: Crop | null;
  };
  const hotspot = record.hotspot;
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") {
    return undefined;
  }

  const crop = record.crop;
  const left = crop?.left ?? 0;
  const top = crop?.top ?? 0;
  const width = 1 - left - (crop?.right ?? 0);
  const height = 1 - top - (crop?.bottom ?? 0);
  if (width <= 0 || height <= 0) return undefined;

  const x = clamp((hotspot.x - left) / width);
  const y = clamp((hotspot.y - top) / height);
  return `${x * 100}% ${y * 100}%`;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
