import { ImageGallery } from "@/components/visual/image-gallery";
import type { SanityImage } from "@/lib/sanity/types";

type LeadGalleryProps = {
  images: SanityImage[];
  alt: string;
};

/**
 * Edition stills: mosaic preview (max 4) plus lightbox. Empty CMS gallery = omit.
 * No section of its own — the edition page places it in the same section as the body.
 */
export function LeadGallery({ images, alt }: LeadGalleryProps) {
  if (images.length === 0) return null;

  return <ImageGallery images={images} alt={alt} />;
}
