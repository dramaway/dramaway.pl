import type { CSSProperties } from "react";

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
  const filled = values.length >= 5;
  const ringCount = filled ? values.length - 1 : values.length;
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
        <ul
          className={cn("values-row", hasCopy && "values-row-after-copy")}
          data-ring={values.length >= 3 ? "" : undefined}
          style={{ "--values-count": ringCount } as CSSProperties}
        >
          {values.map((label, index) => (
            <li
              key={`${label}-${index}`}
              className={cn(
                "values-item",
                filled && index === 0 && "values-center",
                VALUE_TONES[index % VALUE_TONES.length],
              )}
              style={{ "--values-i": filled ? index - 1 : index } as CSSProperties}
            >
              <span className="values-label">{label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
