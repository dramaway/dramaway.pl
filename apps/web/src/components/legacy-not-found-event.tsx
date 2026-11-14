"use client";

import { useEffect } from "react";

type UmamiWindow = Window & {
  umami?: {
    track?: (event: string, data?: Record<string, string>) => void;
  };
};

/** Counts a legacy 404 only when the Umami snippet is already on the page. */
export function LegacyNotFoundEvent({
  kind,
  path,
}: {
  kind: "A" | "B" | "C";
  path: string;
}) {
  useEffect(() => {
    const track = (window as UmamiWindow).umami?.track;
    if (typeof track !== "function") return;
    track("legacy-404", { kind, path });
  }, [kind, path]);

  return null;
}
