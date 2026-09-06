import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { cn } from "@/lib/utils";

/**
 * Eight tones: brand 1–7, then brand-3 (gold) as in Figma frame `130:1316`.
 * Extra labels wrap this list.
 */
const VALUE_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
  "bg-brand-3",
] as const;

type FundacjaValuesProps = {
  heading: string;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref: string;
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
      </div>
      {values.length > 0 ? (
        <ul className="values-row mt-8">
          {values.map((label, index) => (
            <li
              key={`${label}-${index}`}
              className={cn("values-item", VALUE_TONES[index % VALUE_TONES.length])}
            >
              <span className="values-label">{label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
