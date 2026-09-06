import Link from "next/link";

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
 * One labelled row of filter chips. Links carry searchParams; no client JS.
 */
export function FilterRow({ label, chips }: FilterRowProps) {
  const labelId = `filter-${label}`;

  return (
    <nav className="filter-row" aria-labelledby={labelId}>
      <p
        id={labelId}
        className="font-display text-small font-semibold uppercase text-magenta"
      >
        {label}
      </p>
      <ul>
        {chips.map((chip) => (
          <li key={`${chip.href}-${chip.label}`}>
            <Link
              href={chip.href}
              aria-current={chip.current ? "true" : undefined}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
