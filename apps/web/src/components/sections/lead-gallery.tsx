import { Section } from "@/components/layout/section";
import { Media } from "@/components/visual/media";
import type { SanityImage } from "@/lib/sanity/types";

type LeadGalleryProps = {
  images: SanityImage[];
  alt: string;
};

/**
 * First still landscape, next three portraits — the edition-frame recipe.
 * Fewer images just fill what they can; leftovers sit in `.cols-3`.
 */
export function LeadGallery({ images, alt }: LeadGalleryProps) {
  if (images.length === 0) return null;

  const [hero, ...rest] = images;
  const trio = rest.slice(0, 3);
  const overflow = rest.slice(3);

  return (
    <Section>
      <div className="gallery-lead">
        <Media
          image={hero}
          alt={alt}
          variant="inset"
          ratio="landscape"
          sizes="(min-width: 64rem) 70vw, 100vw"
        />
        {trio.length > 0 ? (
          <div className="gallery-lead-row">
            {trio.map((image, index) => (
              <Media
                key={index}
                image={image}
                alt={`${alt} — ${index + 2}`}
                variant="inset"
                ratio="album"
                sizes="(min-width: 64rem) 22vw, 100vw"
              />
            ))}
          </div>
        ) : null}
        {overflow.length > 0 ? (
          <div className="cols-3">
            {overflow.map((image, index) => (
              <Media
                key={index}
                image={image}
                alt={`${alt} — ${index + 5}`}
                variant="inset"
                ratio="album"
                sizes="(min-width: 64rem) 30vw, 100vw"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
