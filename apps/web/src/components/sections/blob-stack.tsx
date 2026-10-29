import Link from "next/link";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import { LIST_CTA_LABEL } from "@/lib/subpage-copy";
import type { SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

export type BlobRowItem = {
  title: string;
  lead?: string | null;
  href: string;
  ctaLabel?: string | null;
  image?: SanityImage | null;
};

const DEFAULT_CTA = LIST_CTA_LABEL;

/** Stack of blob rows without a section wrapper. */
export function BlobStack({
  items,
  density = "default",
  variant = "blob",
}: {
  items: BlobRowItem[];
  density?: "default" | "compact";
  variant?: "blob" | "thumbnail";
}) {
  if (items.length === 0) return null;

  const compact = density === "compact";
  const thumbnails = variant === "thumbnail";

  return (
    <ul
      className={
        compact ? "blob-row-compact" : thumbnails ? "blob-row-thumbnails" : "stack"
      }
    >
      {items.map((item) => (
        <li
          key={`${item.href}-${item.title}`}
          className={cn(
            "stack-item card-hover",
            thumbnails && "blob-row-thumbnail",
            thumbnails && item.image && "has-thumbnail",
          )}
        >
          {thumbnails ? (
            item.image ? (
              <Media
                image={item.image}
                alt=""
                variant="inset"
                ratio="none"
                sizes="(min-width: 64rem) 12rem, 30vw"
                className="blob-row-thumbnail-image"
              />
            ) : null
          ) : compact ? null : (
            <Blob />
          )}
          <div className={thumbnails ? "blob-row-thumbnail-copy" : undefined}>
            <h3 className="font-display text-h3 font-black">
              <Link href={item.href} className="card-link">
                {item.title}
              </Link>
            </h3>
            {item.lead ? (
              <p
                className={cn("text-body", compact ? "blob-row-lead" : "mt-5")}
              >
                {item.lead}
              </p>
            ) : null}
            <CtaLink
              href={item.href}
              presentational
              className={compact ? undefined : "mt-8"}
            >
              {item.ctaLabel?.trim() || DEFAULT_CTA}
            </CtaLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
