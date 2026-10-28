import { Section } from "@/components/layout/section";
import { ImageGallery } from "@/components/visual/image-gallery";
import type { SanityImage } from "@/lib/sanity/types";

type FundacjaGalleryProps = {
  heading?: string | null;
  images: readonly SanityImage[];
};

export function FundacjaGallery({ heading, images }: FundacjaGalleryProps) {
  if (images.length === 0) return null;

  return (
    <Section
      className="fundacja-flow"
      aria-labelledby={heading ? "fundacja-galeria" : undefined}
    >
      <div className="stack-wide space-y-6">
        {heading ? (
          <h2
            id="fundacja-galeria"
            className="font-display text-h3 font-black"
          >
            {heading}
          </h2>
        ) : null}
        <ImageGallery images={[...images]} alt={heading || "O fundacji"} />
      </div>
    </Section>
  );
}
