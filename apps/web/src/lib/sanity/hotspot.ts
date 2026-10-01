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

/**
 * Fraction of the shorter visible side shown in a slider dot when the
 * hotspot is the whole frame. A real hotspot rectangle is framed instead.
 */
export const HERO_THUMB_ZOOM = 0.42;

const HERO_THUMB_MIN_ZOOM = 0.24;
const HERO_THUMB_HOTSPOT_PAD = 1.12;
const FULL_HOTSPOT = 0.92;

export type FocalThumbRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Tight square, in source pixels, centred on the Sanity hotspot.
 * Passed to the image URL as `rect` so the dot shows the focal area
 * instead of a whole-frame cover crop.
 */
export function focalThumbRect(image: unknown): FocalThumbRect | null {
  const asset = assetSize(image);
  if (!asset) return null;

  const record = image as {
    hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
    crop?: Crop | null;
  };
  const crop = record.crop;
  const hotspot = record.hotspot;

  const cropLeft = fraction(crop?.left) * asset.width;
  const cropTop = fraction(crop?.top) * asset.height;
  const visibleWidth = Math.max(
    1,
    asset.width - cropLeft - fraction(crop?.right) * asset.width,
  );
  const visibleHeight = Math.max(
    1,
    asset.height - cropTop - fraction(crop?.bottom) * asset.height,
  );

  const centerX = fraction(hotspot?.x, 0.5) * asset.width;
  const centerY = fraction(hotspot?.y, 0.5) * asset.height;
  const hotWidth = fraction(hotspot?.width, 1);
  const hotHeight = fraction(hotspot?.height, 1);
  const shorter = Math.min(visibleWidth, visibleHeight);
  const explicit = hotWidth < FULL_HOTSPOT || hotHeight < FULL_HOTSPOT;
  const framed = explicit
    ? Math.max(hotWidth * asset.width, hotHeight * asset.height) * HERO_THUMB_HOTSPOT_PAD
    : shorter * HERO_THUMB_ZOOM;
  const side = Math.min(shorter, Math.max(shorter * HERO_THUMB_MIN_ZOOM, framed));

  const maxLeft = cropLeft + visibleWidth - side;
  const maxTop = cropTop + visibleHeight - side;
  const left = clampRange(centerX - side / 2, cropLeft, maxLeft);
  const top = clampRange(centerY - side / 2, cropTop, maxTop);

  return squareInside(left, top, side, cropLeft, cropTop, visibleWidth, visibleHeight);
}

function assetSize(image: unknown): { width: number; height: number } | null {
  if (!image || typeof image !== "object") return null;
  const ref = (image as { asset?: { _ref?: string } }).asset?._ref;
  if (typeof ref !== "string") return null;
  const match = ref.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return null;
  }
  return { width, height };
}

function fraction(value: number | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampRange(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function squareInside(
  left: number,
  top: number,
  side: number,
  originLeft: number,
  originTop: number,
  visibleWidth: number,
  visibleHeight: number,
): FocalThumbRect {
  const right = originLeft + visibleWidth;
  const bottom = originTop + visibleHeight;
  let x = Math.round(left);
  let y = Math.round(top);
  let size = Math.max(1, Math.round(side));
  if (x < originLeft) x = Math.ceil(originLeft);
  if (y < originTop) y = Math.ceil(originTop);
  if (x + size > right) size = Math.max(1, Math.floor(right - x));
  if (y + size > bottom) size = Math.max(1, Math.floor(bottom - y));
  if (x + size > right) x = Math.max(Math.ceil(originLeft), Math.floor(right - size));
  return { left: x, top: y, width: size, height: size };
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
