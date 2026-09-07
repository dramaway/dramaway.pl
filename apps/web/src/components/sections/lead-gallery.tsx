import { Section } from "@/components/layout/section";
import { ImageGallery } from "@/components/visual/image-gallery";
import type { SanityImage } from "@/lib/sanity/types";

type LeadGalleryProps = {
  images: SanityImage[];
  alt: string;
};

/** Edition stills: mosaic preview (max 4) plus lightbox. Empty CMS gallery = omit. */
export function LeadGallery({ images, alt }: LeadGalleryProps) {
  if (images.length === 0) return null;

  return (
    <Section>
      <ImageGallery images={images} alt={alt} />
    </Section>
  );
}
