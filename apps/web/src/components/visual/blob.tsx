import { cn } from "@/lib/utils";

/**
 * Sand circle sitting behind a heading or acting as a list marker.
 * Needs a positioned ancestor — use `.stack-item` or add `relative isolate`.
 */
export function Blob({ className }: { className?: string }) {
  return <span aria-hidden className={cn("blob", className)} />;
}
