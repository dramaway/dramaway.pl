import Link from "next/link";
import { CtaLink } from "@/components/visual/cta-link";

export type FilterChip = {
  href: string;
  label: string;
  current: boolean;
};

type FilterRowProps = {
  /** Visible on `tags`; `switches` uses it only as the nav accessible name. */
  label: string;
  chips: FilterChip[];
  variant: "switches" | "tags";
};

/**
 * Czytelnia filters. `switches` = Figma format drawers (CTA rule + dot).
 * `tags` = quieter category links. Both keep scroll position (`scroll={false}`).
 */
export function FilterRow({ label, chips, variant }: FilterRowProps) {
  const labelId = variant === "tags" ? `filter-${label}` : undefined;

  return (
    <nav
      className={`filter-row filter-row-${variant}`}
      {...(labelId
        ? { "aria-labelledby": labelId }
        : { "aria-label": label })}
    >
      {variant === "tags" ? (
        <p
          id={labelId}
          className="font-display text-small font-semibold uppercase text-magenta"
        >
          {label}
        </p>
      ) : null}
      <ul>
        {chips.map((chip) => (
          <li key={`${chip.href}-${chip.label}`}>
            {variant === "switches" ? (
              <CtaLink href={chip.href} scroll={false} current={chip.current}>
                {chip.label}
              </CtaLink>
            ) : (
              <Link
                href={chip.href}
                scroll={false}
                aria-current={chip.current ? "true" : undefined}
              >
                {chip.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
