import Link from "next/link";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import type { SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

export type CzytelniaRowItem = {
  title: string;
  lead?: string | null;
  href: string;
  ctaLabel: string;
  /** PDF opens in a new tab. The page row stays on this site. */
  external?: boolean;
  cover: SanityImage | null;
  /** File rows clamp the body text. Page rows show the CMS summary in full. */
  clampLead?: boolean;
};

/**
 * Czytelnia list row. One link, like BlobStack. The sand mark can hold the
 * first image from the text. Other lists keep BlobStack.
 */
export function CzytelniaStack({ items }: { items: CzytelniaRowItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="stack">
      {items.map((item) => {
        return (
          <li
            key={`${item.href}-${item.title}`}
            className="stack-item card-hover pub-row"
          >
            <span className="pub-mark" aria-hidden>
              {item.cover ? (
                <Media
                  image={item.cover}
                  alt=""
                  variant="bleed"
                  ratio="none"
                  sizes="9rem"
                  className="pub-mark-photo"
                />
              ) : null}
            </span>
            <div className="pub-row-copy">
              <h3 className="font-display text-h3 font-black">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="card-link"
                  >
                    {item.title}
                    <span className="sr-only">, {item.ctaLabel}</span>
                  </a>
                ) : (
                  <Link href={item.href} className="card-link">
                    {item.title}
                  </Link>
                )}
              </h3>
              {item.lead ? (
                <p
                  className={cn(
                    "mt-5 text-body",
                    item.clampLead && "pub-row-lead",
                  )}
                >
                  {item.lead}
                </p>
              ) : null}
              <CtaLink href={item.href} presentational className="mt-8">
                {item.ctaLabel}
              </CtaLink>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
