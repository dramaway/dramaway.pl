import { cn } from "@/lib/utils";

/**
 * Sand circle sitting behind a heading or acting as a list marker.
 * Needs a positioned ancestor (`.stack-item`, `.pt-term`). The stacking
 * context lives on `.stack` / `.portable-body` so the circle stays behind
 * neighbouring text, not only its own block.
 */
export function Blob({ className }: { className?: string }) {
  return <span aria-hidden className={cn("blob", className)} />;
}
