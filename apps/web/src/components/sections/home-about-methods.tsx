import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import type { SanityImage } from "@/lib/sanity/types";

export type HomeTextBlock = {
  heading: string;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string;
};

type HomeAboutMethodsProps = {
  about: HomeTextBlock;
  methods: HomeTextBlock;
  image: SanityImage | null;
  imageAlt: string;
};

function TextStack({ block }: { block: HomeTextBlock }) {
  return (
    <div>
      {block.heading ? (
        <h2 className="font-display text-h2 font-extrabold">{block.heading}</h2>
      ) : null}
      {block.lead ? (
        <p className="measure mt-6 text-lead">{block.lead}</p>
      ) : null}
      {block.ctaLabel ? (
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
      <div className="split-text py-section">
        <div className="stack">
          <TextStack block={about} />
          <TextStack block={methods} />
        </div>
      </div>
      <Media
        image={image}
        alt={imageAlt}
        variant="bleed"
        ratio="portrait"
        sizes="(min-width: 64rem) 34vw, 100vw"
        className="split-media"
      />
    </section>
  );
}
