import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";

const BRAND_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
] as const;

type FundacjaValuesProps = {
  heading: string;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref: string;
  values: readonly string[];
};

/**
 * Methods lead plus labeled brand circles. Values are chrome, not CMS —
 * the row is omitted when the list is empty.
 */
export function FundacjaValues({
  heading,
  lead,
  ctaLabel,
  ctaHref,
  values,
}: FundacjaValuesProps) {
  return (
    <Section>
      <div className="stack-wide">
        <h2 className="font-display text-h3 font-black">{heading}</h2>
        {lead ? <p className="mt-8 text-lead">{lead}</p> : null}
        {ctaLabel ? (
          <CtaLink href={ctaHref} className="mt-8">
            {ctaLabel}
          </CtaLink>
        ) : null}
        {values.length > 0 ? (
          <ul className="values-row mt-8">
            {values.map((label, index) => (
              <li key={label} className="values-item">
                <span
                  aria-hidden
                  className={BRAND_TONES[index % BRAND_TONES.length]}
                />
                <p className="font-display text-small font-black">{label}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
