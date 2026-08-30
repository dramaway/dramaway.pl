import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import type { HeroContent } from "@/lib/sanity/types";

/**
 * Opening composition: text column beside a photo running to the container
 * edge. In Figma the photo also sits above the header; here it starts below it
 * — see the deviations list in docs/design/system.md.
 */
export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="split">
      <div className="split-text py-section">
        <h1 className="font-display text-display font-black">{hero.heading}</h1>

        {hero.lead ? (
          <p className="measure mt-8 text-lead">{hero.lead}</p>
        ) : null}

        {hero.ctaLabel ? (
          <CtaLink href={hero.ctaHref} className="mt-10">
            {hero.ctaLabel}
          </CtaLink>
        ) : null}
      </div>

      <Media
        image={hero.image}
        alt={hero.imageAlt}
        variant="bleed"
        ratio="portrait"
        sizes="(min-width: 64rem) 34vw, 100vw"
        priority
        className="split-media"
      />
    </section>
  );
}
