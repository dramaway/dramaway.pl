import { CtaLink } from "@/components/visual/cta-link";

export type FilterChip = {
  href: string;
  label: string;
  current: boolean;
};

type FilterRowProps = {
  label: string;
  chips: FilterChip[];
};

/**
 * Czytelnia format drawers (CTA rule + dot). Empty formats are omitted by
 * the caller; a single remaining drawer is not rendered.
 */
export function FilterRow({ label, chips }: FilterRowProps) {
  if (chips.length < 2) return null;

  return (
    <nav className="filter-row-switches" aria-label={label}>
      <ul>
        {chips.map((chip) => (
          <li key={`${chip.href}-${chip.label}`}>
            <CtaLink href={chip.href} scroll={false} current={chip.current}>
              {chip.label}
            </CtaLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
