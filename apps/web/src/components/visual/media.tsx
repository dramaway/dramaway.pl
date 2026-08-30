import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
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
  ratio?: keyof typeof RATIO_CLASS;
  sizes?: string;
  priority?: boolean;
  className?: string;
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
}: MediaProps) {
  const src = image
    ? urlFor(image).width(1600).fit("max").auto("format").url()
    : null;

  return (
    <div
      className={cn(
        "media",
        RATIO_CLASS[ratio],
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
        />
      ) : null}
    </div>
  );
}
