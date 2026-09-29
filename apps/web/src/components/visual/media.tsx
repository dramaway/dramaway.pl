import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { objectPositionFromHotspot } from "@/lib/sanity/hotspot";
import type { SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

const RATIO_CLASS = {
  portrait: "media-portrait",
  landscape: "media-landscape",
  album: "media-album",
} as const;

type MediaProps = {
  image: SanityImage | null;
  alt: string;
  /** `bleed` runs to the container edge with square corners, `inset` is rounded. */
  variant?: "bleed" | "inset";
  /**
   * Fixed frame. `none` leaves the box to its container — split heroes size
   * the still from the text column and crop with `object-fit: cover`.
   */
  ratio?: keyof typeof RATIO_CLASS | "none";
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Local asset used until an editor uploads the image to Sanity. */
  fallbackSrc?: string;
};

/**
 * Image frame with the two treatments used in Figma. Renders a sand block when
 * the image is missing, so sections survive editors leaving a field empty.
 */
export function Media({
  image,
  alt,
  variant = "inset",
  ratio = "portrait",
  sizes = "100vw",
  priority = false,
  className,
  fallbackSrc,
}: MediaProps) {
  const src = image
    ? urlFor(image).width(1600).fit("max").auto("format").url()
    : (fallbackSrc ?? null);
  const objectPosition = objectPositionFromHotspot(image);

  return (
    <div
      className={cn(
        "media",
        ratio !== "none" && RATIO_CLASS[ratio],
        variant === "inset" && "media-inset",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : null}
    </div>
  );
}
