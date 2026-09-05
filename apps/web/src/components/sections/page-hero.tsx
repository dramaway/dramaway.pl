import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
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
 * Opening block for inner pages. Same type scale as the home hero title, but
 * no overlay nav and no circular still — those belong only to `/`.
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
  const copy = (
    <>
      {parent ? (
        <p className="mb-4 text-small">
          <Link href={parent.href} className="hover:text-magenta">
            {parent.label}
          </Link>
        </p>
      ) : null}
      <h1 className="font-display text-h1 font-black">{title}</h1>
      {lead ? <p className="measure mt-8 text-lead">{lead}</p> : null}
      {ctaLabel && ctaHref ? (
        <CtaLink href={ctaHref} className="mt-8">
          {ctaLabel}
        </CtaLink>
      ) : null}
    </>
  );

  if (!image) {
    return <Section>{copy}</Section>;
  }

  return (
    <Section bleed>
      <div className="split">
        <div className="split-text">{copy}</div>
        <Media
          image={image}
          alt={imageAlt?.trim() || title}
          variant="bleed"
          ratio="landscape"
          sizes="(min-width: 64rem) 40vw, 100vw"
          className="split-media"
        />
      </div>
    </Section>
  );
}
