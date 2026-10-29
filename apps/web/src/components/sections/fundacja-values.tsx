import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { FundacjaValuesRow } from "@/components/sections/fundacja-values-row";

type FundacjaValuesProps = {
  heading?: string | null;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  values: readonly string[];
};

/**
 * Methods lead plus tangent brand circles with the label inside (sand/white
 * type). The row is omitted when the list is empty.
 */
export function FundacjaValues({
  heading,
  lead,
  ctaLabel,
  ctaHref,
  values,
}: FundacjaValuesProps) {
  const hasCopy = Boolean(heading || lead || (ctaLabel && ctaHref));
  if (!hasCopy && values.length === 0) return null;

  return (
    <Section className="fundacja-flow fundacja-values">
      {heading ? (
        <h2 className="font-display text-h3 font-black">{heading}</h2>
      ) : null}
      {lead ? <p className={heading ? "mt-8" : undefined}>{lead}</p> : null}
      {ctaLabel && ctaHref ? (
        <CtaLink href={ctaHref} className="mt-8">
          {ctaLabel}
        </CtaLink>
      ) : null}
      {values.length > 0 ? (
        <FundacjaValuesRow values={values} afterCopy={hasCopy} />
      ) : null}
    </Section>
  );
}
