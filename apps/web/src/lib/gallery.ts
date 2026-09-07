import type { SanityImage } from "@/lib/sanity/types";

/** Skip mosaic tiles when the shorter asset side is below this. Lightbox still lists them. */
export const GALLERY_MIN_SHORT_SIDE = 400;

/** Never more than this many tiles in the preview DOM. */
export const GALLERY_MAX_PREVIEW = 4;

export type GalleryLayout = "one" | "pair" | "hero-pair" | "hero-trio";

export type GalleryPlan<T> = {
  slides: T[];
  tiles: T[];
  layout: GalleryLayout | null;
};

export type PortableNode = {
  _type?: string;
  _key?: string;
  [key: string]: unknown;
};

export type ImageGalleryNode = {
  _type: "imageGallery";
  _key: string;
  images: SanityImage[];
};

const IMAGE_REF_SIZE = /-(\d+)x(\d+)-[a-z0-9]+$/i;

export function sanityAssetRef(image: unknown): string | undefined {
  if (!image || typeof image !== "object") return undefined;
  const asset = "asset" in image ? image.asset : undefined;
  if (typeof asset === "string") return asset;
  if (asset && typeof asset === "object") {
    if ("_ref" in asset && typeof asset._ref === "string") return asset._ref;
    if ("_id" in asset && typeof asset._id === "string") return asset._id;
  }
  return undefined;
}

export function parseSanityImageDimensions(
  ref: string | undefined,
): { width: number; height: number } | null {
  if (!ref) return null;
  const match = ref.match(IMAGE_REF_SIZE);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return null;
  }
  return { width, height };
}

export function isGalleryPreviewEligible(image: unknown): boolean {
  const dims = parseSanityImageDimensions(sanityAssetRef(image));
  if (!dims) return true;
  return Math.min(dims.width, dims.height) >= GALLERY_MIN_SHORT_SIDE;
}

export function galleryLayoutForCount(count: number): GalleryLayout | null {
  if (count <= 0) return null;
  if (count === 1) return "one";
  if (count === 2) return "pair";
  if (count === 3) return "hero-pair";
  return "hero-trio";
}

export function planGallery<T>(images: T[]): GalleryPlan<T> {
  const slides = images.filter((image) => Boolean(sanityAssetRef(image)));
  const tiles = slides
    .filter((image) => isGalleryPreviewEligible(image))
    .slice(0, GALLERY_MAX_PREVIEW);
  return {
    slides,
    tiles,
    layout: galleryLayoutForCount(tiles.length),
  };
}

function isImageNode(node: PortableNode): boolean {
  return node._type === "image" && Boolean(sanityAssetRef(node));
}

function childText(child: unknown): string {
  if (typeof child === "string") return child;
  if (child && typeof child === "object" && "text" in child) {
    return String((child as { text?: unknown }).text ?? "");
  }
  return "";
}

/** Drupal leftovers: a normal block whose spans are empty / whitespace / nbsp. */
export function isEmptyParagraph(node: PortableNode): boolean {
  if (node._type !== "block") return false;
  if (node.listItem) return false;
  const style = node.style;
  if (style && style !== "normal") return false;
  const children = Array.isArray(node.children) ? node.children : [];
  if (children.length === 0) return true;
  return children.every((child) => childText(child).replace(/\u00a0/g, " ").trim() === "");
}

/**
 * Collapse consecutive Portable Text images into a virtual `imageGallery` block.
 * Empty paragraphs between images are glue (dropped). A lone image stays an `image`.
 */
export function groupPortableImageRuns(
  blocks: PortableNode[],
): Array<PortableNode | ImageGalleryNode> {
  const out: Array<PortableNode | ImageGalleryNode> = [];
  let index = 0;

  while (index < blocks.length) {
    const current = blocks[index];
    if (!isImageNode(current)) {
      out.push(current);
      index += 1;
      continue;
    }

    const images: SanityImage[] = [current as SanityImage];
    let cursor = index + 1;

    while (cursor < blocks.length) {
      const next = blocks[cursor];
      if (isImageNode(next)) {
        images.push(next as SanityImage);
        cursor += 1;
        continue;
      }
      if (isEmptyParagraph(next)) {
        let look = cursor + 1;
        while (look < blocks.length && isEmptyParagraph(blocks[look])) look += 1;
        if (look < blocks.length && isImageNode(blocks[look])) {
          cursor = look;
          continue;
        }
      }
      break;
    }

    if (images.length === 1) {
      out.push(current);
    } else {
      out.push({
        _type: "imageGallery",
        _key: `gallery-${current._key ?? index}`,
        images,
      });
    }
    index = cursor;
  }

  return out;
}

export function formatGalleryMore(template: string, count: number): string {
  return template.replace("{n}", String(count));
}
