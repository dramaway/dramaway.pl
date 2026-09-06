import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { hasHeroImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

export type HomeTextBlock = {
  heading: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

type HomeAboutMethodsProps = {
  about: HomeTextBlock;
  methods: HomeTextBlock;
  image: SanityImage | null;
  imageAlt: string;
};

function TextStack({ block }: { block: HomeTextBlock }) {
  if (!block.heading && !block.lead && !(block.ctaLabel && block.ctaHref)) {
    return null;
  }
  return (
    <div>
      {block.heading ? (
        <h2 className="font-display text-h3 font-black">{block.heading}</h2>
      ) : null}
      {block.lead ? (
        <p className="mt-6 text-body">{block.lead}</p>
      ) : null}
      {block.ctaLabel && block.ctaHref ? (
        <CtaLink href={block.ctaHref} className="mt-8">
          {block.ctaLabel}
        </CtaLink>
      ) : null}
    </div>
  );
}

/**
 * “Kim jesteśmy?” and “Metody” beside one bleed photo. Same split as Hero,
 * reversed so the image sits on the left from `lg`.
 */
export function HomeAboutMethods({
  about,
  methods,
  image,
  imageAlt,
}: HomeAboutMethodsProps) {
  return (
    <section className="split split-reverse">
      <div className="split-text">
        <div className="stack">
          <TextStack block={about} />
          <TextStack block={methods} />
        </div>
      </div>
      {hasHeroImage(image) ? (
        <Media
          image={image}
          alt={imageAlt}
          variant="bleed"
          ratio="portrait"
          sizes="(min-width: 64rem) 34vw, 100vw"
          className="split-media"
        />
      ) : (
        <div className="split-media hero-media-empty media-portrait" aria-hidden />
      )}
    </section>
  );
}
