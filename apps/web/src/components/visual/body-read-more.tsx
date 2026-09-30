"use client";

import { useId, useState, type ReactNode } from "react";
import { SUBPAGE } from "@/lib/subpage-copy";
import { cn } from "@/lib/utils";

type BodyReadMoreProps = {
  /** Visible excerpt above the fold; faded at the bottom while collapsed. */
  before: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Fold for the trailing part of a long article body (Portable Text). */
export function BodyReadMore({ before, children, className }: BodyReadMoreProps) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const copy = SUBPAGE.bodyReadMore;

  return (
    <div className={cn("pt-readmore", className)}>
      <div
        className={cn(
          "pt-readmore-fade space-y-4",
          !open && "pt-readmore-fade-active",
        )}
      >
        {before}
      </div>
      {!open ? (
        <button
          type="button"
          className="pt-readmore-trigger pt-readmore-trigger-expand"
          aria-expanded={false}
          aria-controls={regionId}
          onClick={() => setOpen(true)}
        >
          <span className="pt-readmore-label">{copy.expand}</span>
          <span aria-hidden className="pt-readmore-rule">
            <span className="pt-readmore-line" />
            <span className="pt-readmore-dot" />
          </span>
        </button>
      ) : null}
      <div id={regionId} hidden={!open} className="pt-readmore-rest space-y-4">
        {children}
      </div>
      {open ? (
        <button
          type="button"
          className="pt-readmore-trigger pt-readmore-trigger-collapse"
          aria-expanded
          aria-controls={regionId}
          onClick={() => setOpen(false)}
        >
          <span className="pt-readmore-label">{copy.collapse}</span>
          <span aria-hidden className="pt-readmore-rule">
            <span className="pt-readmore-line" />
            <span className="pt-readmore-dot" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
