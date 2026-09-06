import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { FALLBACK_ABOUT_IMAGE } from "@/lib/homepage-copy";
import type { PortableContent, SanityImage } from "@/lib/sanity/types";
import Link from "next/link";

export type PageHeroLayout = "split" | "stack";

export type PageHeroContent = {
  title: string;
  lead?: string | null;
  /** Portable Text in the hero copy column (contact page body). */
  body?: PortableContent | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  image?: SanityImage | null;
  imageAlt?: string | null;
  parent?: { href: string; label: string } | null;
};

type PageHeroProps = PageHeroContent & {
  /**
   * Default `split` keeps overlay heroes (`data-split-hero` + photo + DotBand).
   * `stack` is text-only: H1 + lead, no photo column, no overlay, no band.
   */
  layout?: PageHeroLayout;
};

/**
 * Opening block for inner pages. Default is the same split, circular still,
 * and following dot band as `/`. `data-split-hero` overlays the header in the
 * left column at lg+ (do not reuse `data-home` — that hides `.subpage-palette`).
 * Pass `layout="stack"` for edition pages. Missing CMS photos on the split
 * use the about fallback until a cover is uploaded.
 */
export function PageHero({
  title,
  lead,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  parent,
  layout = "split",
}: PageHeroProps) {
  const hasBody = hasPortableContent(body);
  const hasCopy =
    Boolean(lead) || hasBody || Boolean(ctaLabel && ctaHref);
  const heading = (
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
  );
  const copy = hasCopy ? (
    <div className="hero-copy">
      {lead ? (
        <p className={layout === "stack" ? "text-lead" : "measure text-lead"}>
          {lead}
        </p>
      ) : null}
      {hasBody && body ? (
        <div className={layout === "stack" ? undefined : "measure"}>
          <PortableBody value={body} />
        </div>
      ) : null}
      {ctaLabel && ctaHref ? (
        <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
      ) : null}
    </div>
  ) : null;

  if (layout === "stack") {
    return (
      <section className="hero hero-stack">
        {heading}
        {copy}
      </section>
    );
  }

  return (
    <div data-split-hero="">
      <section className="hero split">
        <div className="split-text">
          {heading}
          {copy}
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
