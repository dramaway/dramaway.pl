import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { hasHeroImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import Link from "next/link";
import type { ReactNode } from "react";

export type PageHeroLayout = "split" | "stack";

export type PageHeroContent = {
  title?: string | null;
  lead?: string | null;
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
  /** Extra copy in the hero column (e.g. contact Portable Text). Omit when empty. */
  children?: ReactNode;
};

/**
 * Opening block for inner pages. Default is the same split as `/`: at lg+
 * the text column sets the height and the still fills it (cover + hotspot);
 * below lg the still is a circle. `data-split-hero` overlays the header in
 * the left column at lg+ (do not reuse `data-home` — that hides
 * `.subpage-palette`). Pass `layout="stack"` for edition pages. No CMS
 * photo = no still; the split column and media slot stay so text width
 * does not jump.
 * Do not import PortableBody from this file — listing pages must stay free
 * of the gallery/lightbox client graph.
 */
export function PageHero({
  title,
  lead,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  parent,
  layout = "split",
  children,
}: PageHeroProps) {
  const hasTitle = Boolean(title?.trim());
  const hasCopy =
    Boolean(lead) || Boolean(children) || Boolean(ctaLabel && ctaHref);
  if (!hasTitle && !hasCopy && !hasHeroImage(image)) return null;
  const heading = (
    <div className="hero-heading">
      {parent ? (
        <p className="mb-4 text-small">
          <Link href={parent.href} className="hover:text-magenta">
            {parent.label}
          </Link>
        </p>
      ) : null}
      {hasTitle ? (
        <h1 className="hero-title font-display text-display font-black">
          {title}
        </h1>
      ) : null}
    </div>
  );
  const copy = hasCopy ? (
    <div className="hero-copy">
      {lead ? (
        <p className={layout === "stack" ? "text-lead" : "measure text-lead"}>
          {lead}
        </p>
      ) : null}
      {children ? (
        <div className={layout === "stack" ? undefined : "measure"}>
          {children}
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
          {hasHeroImage(image) ? (
            <>
              <Blob />
              <Media
                image={image}
                alt={imageAlt?.trim() || title?.trim() || ""}
                variant="bleed"
                ratio="none"
                sizes="(min-width: 64rem) 34vw, 70vw"
                priority
                className="hero-media"
              />
            </>
          ) : (
            <div
              className="hero-media hero-media-empty"
              aria-hidden
            />
          )}
        </div>
      </section>
      <DotBand />
    </div>
  );
}
