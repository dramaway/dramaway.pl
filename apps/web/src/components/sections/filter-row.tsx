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

/** Format tabs for the library; empty formats and a single tab are omitted. */
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
