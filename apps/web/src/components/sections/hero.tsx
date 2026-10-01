import { CtaLink } from "@/components/visual/cta-link";
import { HeroMedia } from "@/components/visual/hero-media";
import type { HeroContent } from "@/lib/sanity/types";

/**
 * Opening composition. From lg: the text column sets the section height;
 * the still fills that box (cover + Sanity hotspot) and bleeds to the
 * viewport edge. Below lg: heading, circular still, then lead and CTA.
 * Nav never sits on the photo — see system.md.
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
        <HeroMedia slides={hero.slides} empty="sand" />
      </div>
    </section>
  );
}
