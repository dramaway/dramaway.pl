import { cn } from "@/lib/utils";

/**
 * Decorative band of tangent sand circles that steps up halfway across.
 * Purely a background pattern — see `.dot-band` in globals.css.
 */
export function DotBand({ className }: { className?: string }) {
  return <div aria-hidden className={cn("dot-band", className)} />;
}
