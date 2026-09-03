import { cn } from "@/lib/utils";

type DotBandProps = {
  /**
   * Set when the section above ends with a photo on the **left**. Mirrors the
   * step so the row on the photo's side is the upper one and rides its bottom
   * edge, instead of sitting a full row below the photo.
   */
  mirror?: boolean;
  className?: string;
};

/**
 * Decorative band of tangent sand circles that steps halfway across.
 * Purely a background pattern — see `.dot-band` in globals.css.
 */
export function DotBand({ mirror = false, className }: DotBandProps) {
  return (
    <div
      aria-hidden
      className={cn("dot-band", mirror && "dot-band-mirror", className)}
    />
  );
}
