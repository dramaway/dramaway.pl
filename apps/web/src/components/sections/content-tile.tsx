import Link from "next/link";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/visual/cta-link";
import { Blob } from "@/components/visual/blob";
import type { ResolvedTile } from "@/lib/sanity/types";
import { safeHref } from "@/lib/safe-url";

function TileAnchor({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const safe = safeHref(href);
  if (!safe) return <>{children}</>;
  if (safe.kind === "http") {
    return (
      <a href={safe.href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={safe.href} className={className}>
      {children}
    </Link>
  );
}

/**
 * One text tile: blob, title, excerpt, presentational CTA.
 * The title link covers the whole card.
 */
export function ContentTile({
  tile,
  heading = "h2",
  layout = "stack",
}: {
  tile: ResolvedTile;
  heading?: "h2" | "h3";
  /** `card` aligns the CTA with neighbouring grid tiles. */
  layout?: "stack" | "card";
}) {
  const Title = heading;
  const titleClass =
    layout === "card"
      ? "news-card-title mt-2 font-display text-h4 font-black"
      : "font-display text-h3 font-black";
  const title = tile.title ? (
    <Title className={titleClass}>
      {tile.href ? (
        <TileAnchor href={tile.href} className="card-link">
          {tile.title}
        </TileAnchor>
      ) : (
        tile.title
      )}
    </Title>
  ) : null;
  const excerpt = tile.excerpt ? (
    <p className="mt-5 text-body">{tile.excerpt}</p>
  ) : null;
  const cta =
    tile.href && tile.ctaLabel ? (
      <CtaLink
        href={tile.href}
        presentational
        className={layout === "card" ? "news-card-cta mt-8" : "mt-8"}
      >
        {tile.ctaLabel}
      </CtaLink>
    ) : null;

  if (layout === "card") {
    return (
      <>
        <Blob />
        {title}
        <div className="news-card-body">{excerpt}</div>
        {cta}
      </>
    );
  }

  return (
    <>
      <Blob />
      {title}
      {excerpt}
      {cta}
    </>
  );
}
