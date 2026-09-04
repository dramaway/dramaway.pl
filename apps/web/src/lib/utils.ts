import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom scale tokens (`text-h3`, `text-lead`, …) live in the same `text-*`
 * namespace as colours. Without this, `cn("text-h3", "text-magenta")` drops
 * the size and the heading inherits body type.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-lead",
        "text-body",
        "text-small",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
