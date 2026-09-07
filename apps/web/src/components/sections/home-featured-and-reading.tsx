import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";

export type HomeFeaturedBlock = {
  label: string | null;
  heading: string | null;
  lead: string | null;
  /** The tile leads to this one project; the CTA below leads to the list. */
  href: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type HomeReadingBlock = {
  heading: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

type HomeFeaturedAndReadingProps = {
  featured: HomeFeaturedBlock | null;
  czytelnia: HomeReadingBlock | null;
};

function FeaturedTile({ featured }: { featured: HomeFeaturedBlock }) {
  return (
    <div className="stack-item">
      <Blob />
      {featured.label ? (
        <p className="font-display text-small font-semibold uppercase text-magenta">
          {featured.label}
        </p>
      ) : null}
      {featured.heading ? (
        <h2 className="mt-2 font-display text-h3 font-black">
          <Link href={featured.href} className="card-link">
            {featured.heading}
          </Link>
        </h2>
      ) : null}
      {featured.lead ? (
        <p className="mt-5 text-body">{featured.lead}</p>
      ) : null}
      {featured.ctaLabel && featured.ctaHref ? (
        <CtaLink href={featured.ctaHref} className="cta-over mt-8">
          {featured.ctaLabel}
        </CtaLink>
      ) : null}
    </div>
  );
}

function CzytelniaTile({ czytelnia }: { czytelnia: HomeReadingBlock }) {
  const href = czytelnia.ctaHref;
  return (
    <div className="stack-item card-hover">
      <Blob />
      {czytelnia.heading && href ? (
        <h2 className="font-display text-h3 font-black">
          <Link href={href} className="card-link">
            {czytelnia.heading}
          </Link>
        </h2>
      ) : czytelnia.heading ? (
        <h2 className="font-display text-h3 font-black">{czytelnia.heading}</h2>
      ) : null}
      {czytelnia.lead ? (
        <p className="blob-row-excerpt mt-5 text-body">{czytelnia.lead}</p>
      ) : null}
      {czytelnia.ctaLabel && href ? (
        <CtaLink href={href} presentational className="mt-8">
          {czytelnia.ctaLabel}
        </CtaLink>
      ) : null}
    </div>
  );
}

/**
 * Featured project blurb plus the Czytelnia teaser. Copy-only — the
 * project grid and featured split no longer live on `/`. The stack is a
 * centred column (`.stack-narrow`); text inside stays left-aligned.
 */
export function HomeFeaturedAndReading({
  featured,
  czytelnia,
}: HomeFeaturedAndReadingProps) {
  if (!featured && !czytelnia) return null;

  return (
    <Section>
      <div className="stack stack-narrow">
        {featured ? <FeaturedTile featured={featured} /> : null}
        {czytelnia ? <CzytelniaTile czytelnia={czytelnia} /> : null}
      </div>
    </Section>
  );
}
