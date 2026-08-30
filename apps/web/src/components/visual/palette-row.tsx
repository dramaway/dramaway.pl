import { cn } from "@/lib/utils";

/** Brand palette, left to right as it appears in Figma. */
const BRAND_TONES = [
  "bg-brand-1",
  "bg-brand-2",
  "bg-brand-3",
  "bg-brand-4",
  "bg-brand-5",
  "bg-brand-6",
  "bg-brand-7",
] as const;

/** Row of seven tangent brand circles used as a section divider. */
export function PaletteRow({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("palette-row", className)}>
      {BRAND_TONES.map((tone) => (
        <span key={tone} className={tone} />
      ))}
    </div>
  );
}
