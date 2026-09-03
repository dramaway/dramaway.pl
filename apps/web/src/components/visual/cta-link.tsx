import Link from "next/link";
import type { ReactNode } from "react";
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
  className?: string;
};

/** Green label over a thick rule ending in a dot — the Figma file's default link. */
export function CtaLink({
  href,
  children,
  external = false,
  presentational = false,
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

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn("cta", className)}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={cn("cta", className)}>
      {body}
    </Link>
  );
}
