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

export function FundacjaValuesRow({
  values,
  afterCopy,
}: {
  values: readonly string[];
  afterCopy: boolean;
}) {
  return (
    <ul className={cn("values-row", afterCopy && "values-row-after-copy")}>
      {values.map((label, index) => (
        <li
          key={`${label}-${index}`}
          className={cn("values-item", VALUE_TONES[index % VALUE_TONES.length])}
        >
          <span className="values-label">{label}</span>
        </li>
      ))}
    </ul>
  );
}
