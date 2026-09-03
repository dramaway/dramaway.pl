import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";

export type HomeFeaturedBlock = {
  label: string;
  heading: string;
  lead: string | null;
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
 * project grid and featured split no longer live on `/`.
 */
export function HomeFeaturedAndReading({
  featured,
  czytelnia,
}: HomeFeaturedAndReadingProps) {
  return (
    <Section>
      <div className="stack">
        <div>
          {featured.label ? (
            <p className="font-display text-small font-semibold uppercase text-magenta">
              {featured.label}
            </p>
          ) : null}
          {featured.heading ? (
            <h2 className="mt-2 font-display text-h2 font-extrabold">
              {featured.heading}
            </h2>
          ) : null}
          {featured.lead ? (
            <p className="measure mt-6 text-lead">{featured.lead}</p>
          ) : null}
          {featured.ctaLabel ? (
            <CtaLink href={featured.ctaHref} className="mt-8">
              {featured.ctaLabel}
            </CtaLink>
          ) : null}
        </div>

        <div>
          {/* placeholder: czytelnia has no CMS content yet */}
          {czytelnia.heading ? (
            <h2 className="font-display text-h2 font-extrabold">
              {czytelnia.heading}
            </h2>
          ) : null}
          {czytelnia.lead ? (
            <p className="measure mt-6 text-lead">{czytelnia.lead}</p>
          ) : null}
          {czytelnia.ctaLabel ? (
            <CtaLink href={czytelnia.ctaHref} className="mt-8">
              {czytelnia.ctaLabel}
            </CtaLink>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
