import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

/** Green label over a thick rule ending in a dot — the Figma file's default link. */
export function CtaLink({
  href,
  children,
  external = false,
  className,
}: CtaLinkProps) {
  const body = (
    <>
      <span>{children}</span>
      <span aria-hidden className="cta-rule" />
    </>
  );

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
