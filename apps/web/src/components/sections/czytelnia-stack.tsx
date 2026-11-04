import Link from "next/link";
import { CtaLink } from "@/components/visual/cta-link";
import { Media } from "@/components/visual/media";
import type { SanityImage } from "@/lib/sanity/types";

export type CzytelniaRowItem = {
  title: string;
  titleLanguage?: "pl" | "en" | "pt" | null;
  lead?: string | null;
  href: string;
  ctaLabel: string;
  fileDescription?: string | null;
  /** PDF destination; the row stays on this site. */
  external?: boolean;
  cover: SanityImage | null;
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
              <h3 className="pub-row-title font-body text-h4 font-semibold">
                {item.external ? (
                  <a
                    href={item.href}
                    className="card-link"
                  >
                    <span lang={item.titleLanguage ?? undefined}>
                      {item.title}
                    </span>
                    {item.fileDescription ? (
                      <span className="sr-only">
                        {" "}
                        ({item.fileDescription})
                      </span>
                    ) : null}
                    <span className="sr-only">, {item.ctaLabel}</span>
                  </a>
                ) : (
                  <Link href={item.href} className="card-link">
                    <span lang={item.titleLanguage ?? undefined}>
                      {item.title}
                    </span>
                  </Link>
                )}
              </h3>
              {item.lead ? (
                <p className="mt-5 text-body">{item.lead}</p>
              ) : null}
              <CtaLink href={item.href} presentational className="mt-8">
                {item.fileDescription
                  ? `${item.ctaLabel} (${item.fileDescription})`
                  : item.ctaLabel}
              </CtaLink>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
