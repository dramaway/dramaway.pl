import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";

export type HomeFeaturedBlock = {
  label: string;
  heading: string;
  lead: string | null;
  /** The tile leads to this one project; the CTA below leads to the list. */
  href: string;
  ctaLabel: string | null;
  ctaHref: string;
};

export type HomeReadingBlock = {
  heading: string;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string;
};

type HomeFeaturedAndReadingProps = {
  featured: HomeFeaturedBlock;
  czytelnia: HomeReadingBlock;
};

/**
 * Short Art Generacje blurb plus the Czytelnia teaser. Copy-only — the
 * project grid and featured split no longer live on `/`. The stack is a
 * centred column (`.stack-narrow`); text inside stays left-aligned.
 */
export function HomeFeaturedAndReading({
  featured,
  czytelnia,
}: HomeFeaturedAndReadingProps) {
  return (
    <Section>
      <div className="stack stack-narrow">
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
            <p className="measure mt-5 text-body">{featured.lead}</p>
          ) : null}
          {featured.ctaLabel ? (
            <CtaLink href={featured.ctaHref} className="cta-over mt-8">
              {featured.ctaLabel}
            </CtaLink>
          ) : null}
        </div>

        <div className="stack-item card-hover">
          <Blob />
          {/* placeholder: czytelnia has no CMS content yet */}
          {czytelnia.heading ? (
            <h2 className="font-display text-h3 font-black">
              <Link href={czytelnia.ctaHref} className="card-link">
                {czytelnia.heading}
              </Link>
            </h2>
          ) : null}
          {czytelnia.lead ? (
            <p className="measure mt-5 text-body">{czytelnia.lead}</p>
          ) : null}
          {czytelnia.ctaLabel ? (
            <CtaLink
              href={czytelnia.ctaHref}
              presentational
              className="mt-8"
            >
              {czytelnia.ctaLabel}
            </CtaLink>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
