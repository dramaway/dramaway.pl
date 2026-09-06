import { CtaLink } from "@/components/visual/cta-link";
import { Blob } from "@/components/visual/blob";
import { Media } from "@/components/visual/media";
import type { HeroContent } from "@/lib/sanity/types";

/**
 * Opening composition. From lg: text in the left column (padded under the
 * overlay nav), portrait occupying the right column from the top of the page
 * and bleeding to the viewport edge. Below lg: heading, circular still, then
 * lead and CTA. Nav never sits on the photo — see system.md.
 */
export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="hero split">
      <div className="split-text">
        {hero.heading ? (
          <h1 className="hero-title font-display text-display font-black">
            {hero.heading}
          </h1>
        ) : null}

        {hero.lead || (hero.ctaLabel && hero.ctaHref) ? (
          <div className="hero-copy">
            {hero.lead ? <p className="measure text-lead">{hero.lead}</p> : null}

            {hero.ctaLabel && hero.ctaHref ? (
              <CtaLink href={hero.ctaHref}>{hero.ctaLabel}</CtaLink>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="hero-media-wrap split-media">
        <Blob />
        <Media
          image={hero.image}
          alt={hero.imageAlt}
          variant="bleed"
          ratio="portrait"
          sizes="(min-width: 64rem) 34vw, 70vw"
          priority
          className="hero-media"
        />
      </div>
    </section>
  );
}
