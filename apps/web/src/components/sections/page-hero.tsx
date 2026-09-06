import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { FALLBACK_ABOUT_IMAGE } from "@/lib/homepage-copy";
import type { SanityImage } from "@/lib/sanity/types";
import Link from "next/link";

export type PageHeroContent = {
  title: string;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  image?: SanityImage | null;
  imageAlt?: string | null;
  parent?: { href: string; label: string } | null;
};

/**
 * Opening block for inner pages. Same split, circular still, and following
 * dot band as `/`. `data-split-hero` overlays the header in the left column
 * at lg+ (do not reuse `data-home` — that hides `.subpage-palette`). Default
 * is the split; a stack layout without this attribute is a later variant.
 * Missing CMS photos use the about fallback until a cover is uploaded.
 */
export function PageHero({
  title,
  lead,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  parent,
}: PageHeroContent) {
  const hasCopy = Boolean(lead) || Boolean(ctaLabel && ctaHref);

  return (
    <div data-split-hero="">
      <section className="hero split">
        <div className="split-text">
          <div className="hero-heading">
            {parent ? (
              <p className="mb-4 text-small">
                <Link href={parent.href} className="hover:text-magenta">
                  {parent.label}
                </Link>
              </p>
            ) : null}
            <h1 className="hero-title font-display text-display font-black">
              {title}
            </h1>
          </div>

          {hasCopy ? (
            <div className="hero-copy">
              {lead ? <p className="measure text-lead">{lead}</p> : null}
              {ctaLabel && ctaHref ? (
                <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="hero-media-wrap split-media">
          <Blob />
          <Media
            image={image ?? null}
            alt={imageAlt?.trim() || title}
            variant="bleed"
            ratio="portrait"
            sizes="(min-width: 64rem) 34vw, 70vw"
            priority
            fallbackSrc={FALLBACK_ABOUT_IMAGE}
            className="hero-media"
          />
        </div>
      </section>
      <DotBand />
    </div>
  );
}
