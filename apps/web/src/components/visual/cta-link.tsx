import Link from "next/link";
import type { ReactNode } from "react";
import { safeHref } from "@/lib/safe-url";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  /**
   * Render the CTA as decoration instead of a link. Used inside clickable
   * tiles, where the card's own link already covers this target and a second
   * copy would only add a duplicate stop for keyboard and screen readers.
   */
  presentational?: boolean;
  /** Internal Link only. False keeps scroll (Czytelnia format switches). */
  scroll?: boolean;
  /** Marks the active item in a radio-style row (`aria-current`). */
  current?: boolean;
  className?: string;
};

/** Green label over a thick rule ending in a dot — the Figma file's default link. */
export function CtaLink({
  href,
  children,
  external = false,
  presentational = false,
  scroll = true,
  current = false,
  className,
}: CtaLinkProps) {
  const body = (
    <>
      <span>{children}</span>
      <span aria-hidden className="cta-rule" />
    </>
  );

  if (presentational) {
    return (
      <span aria-hidden className={cn("cta", className)}>
        {body}
      </span>
    );
  }

  const safe = safeHref(href);
  if (!safe) return null;

  if (safe.kind === "mailto") {
    return (
      <a href={safe.href} className={cn("cta", className)}>
        {body}
      </a>
    );
  }

  if (external || safe.kind === "http") {
    return (
      <a
        href={safe.href}
        target="_blank"
        rel="noreferrer"
        className={cn("cta", className)}
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={safe.href}
      scroll={scroll}
      aria-current={current ? "true" : undefined}
      className={cn("cta", className)}
    >
      {body}
    </Link>
  );
}
