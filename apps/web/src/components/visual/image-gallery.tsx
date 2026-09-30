"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Media } from "@/components/visual/media";
import {
  formatGalleryMore,
  planGallery,
  parseSanityImageDimensions,
  sanityAssetRef,
  type GalleryLayout,
} from "@/lib/gallery";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import { SUBPAGE } from "@/lib/subpage-copy";

const GalleryLightbox = dynamic(
  () =>
    import("./image-gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

type ImageGalleryProps = {
  images: SanityImage[];
  alt: string;
};

const LIGHTBOX_WIDTHS = [640, 960, 1280, 1600, 2400];

function tileRatio(layout: GalleryLayout, index: number) {
  if (layout === "hero-trio") return "none" as const;
  if (layout === "one") return "landscape" as const;
  if (layout === "pair") return "album" as const;
  if (index === 0) return "landscape" as const;
  return "album" as const;
}

function tileSizes(layout: GalleryLayout, index: number) {
  if (layout === "one") return "(min-width: 64rem) 70vw, 100vw";
  if (layout === "pair") return "(min-width: 64rem) 35vw, 50vw";
  if (layout === "hero-trio") {
    if (index === 0) return "(min-width: 64rem) 60vw, 100vw";
    return "(min-width: 64rem) 30vw, 50vw";
  }
  if (index === 0) return "(min-width: 64rem) 70vw, 100vw";
  return "(min-width: 64rem) 22vw, 50vw";
}

function imageAlt(image: SanityImage, fallback: string): string {
  if (image && typeof image === "object" && "alt" in image) {
    const value = image.alt;
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function toSlide(image: SanityImage, alt: string) {
  const dims = parseSanityImageDimensions(sanityAssetRef(image)) ?? {
    width: 1600,
    height: 1200,
  };
  const srcSet = LIGHTBOX_WIDTHS.filter(
    (width) => width <= dims.width || width === LIGHTBOX_WIDTHS[0],
  ).map((width) => ({
    src: urlFor(image).width(width).fit("max").auto("format").url(),
    width,
    height: Math.max(1, Math.round((dims.height / dims.width) * width)),
  }));
  const srcWidth = Math.min(2400, dims.width);
  return {
    src: urlFor(image).width(srcWidth).fit("max").auto("format").url(),
    width: dims.width,
    height: dims.height,
    alt,
    srcSet,
  };
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const { slides: slideImages, tiles, layout } = useMemo(
    () => planGallery(images),
    [images],
  );
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () => slideImages.map((image) => toSlide(image, imageAlt(image, alt))),
    [slideImages, alt],
  );

  if (!layout || tiles.length === 0) return null;

  const desktopHidden = slides.length - tiles.length;
  const mobileVisible =
    layout === "hero-trio" && tiles.length === 4 ? 3 : tiles.length;
  const mobileHidden = slides.length - mobileVisible;
  const trio = layout === "hero-trio" && tiles.length === 4;

  function openAt(tileIndex: number) {
    const image = tiles[tileIndex];
    const slideIndex = slideImages.indexOf(image);
    setIndex(slideIndex >= 0 ? slideIndex : tileIndex);
    setOpen(true);
  }

  return (
    <>
      <div className="gallery-mosaic" data-layout={layout}>
        {tiles.map((image, tileIndex) => {
          const overlays: { className: string; count: number }[] = [];
          if (trio) {
            if (tileIndex === 2 && mobileHidden > 0) {
              overlays.push({
                className: "gallery-mosaic-more gallery-mosaic-more-sm",
                count: mobileHidden,
              });
            }
            if (tileIndex === 3 && desktopHidden > 0) {
              overlays.push({
                className: "gallery-mosaic-more gallery-mosaic-more-lg",
                count: desktopHidden,
              });
            }
          } else if (tileIndex === tiles.length - 1 && desktopHidden > 0) {
            overlays.push({
              className: "gallery-mosaic-more",
              count: desktopHidden,
            });
          }

          return (
            <button
              key={sanityAssetRef(image) ?? tileIndex}
              type="button"
              className="gallery-tile"
              aria-label={SUBPAGE.gallery.open}
              onClick={() => openAt(tileIndex)}
            >
              <Media
                image={image}
                alt={imageAlt(image, alt)}
                variant="inset"
                ratio={tileRatio(layout, tileIndex)}
                sizes={tileSizes(layout, tileIndex)}
              />
              {overlays.map((overlay) => (
                <span key={overlay.className} className={overlay.className}>
                  {formatGalleryMore(SUBPAGE.gallery.more, overlay.count)}
                </span>
              ))}
            </button>
          );
        })}
      </div>
      {open ? (
        <GalleryLightbox
          index={index}
          slides={slides}
          onClose={() => setOpen(false)}
          onIndex={setIndex}
        />
      ) : null}
    </>
  );
}
