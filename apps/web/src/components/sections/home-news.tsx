import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { NEWS_CTA_LABEL, NEWS_SECTION_HEADING } from "@/lib/homepage-copy";
import { cn } from "@/lib/utils";

export type HomeNewsItem = {
  _id: string;
  title: string;
  href: string;
  excerpt: string | null;
  publishedAt: string | null;
  ctaLabel?: string | null;
  /** When set, the button leaves the article the title still opens. */
  ctaHref?: string | null;
};

function formatPolishMonthYear(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Homepage news row: up to three text cards, no photos. Empty list is a
 * valid state — the section stays in the page rhythm without crashing.
 */
export function HomeNews({
  items,
  heading,
  headingId = "home-news-heading",
}: {
  items: HomeNewsItem[];
  heading?: string | null;
  headingId?: string;
}) {
  const cards = items.slice(0, 3);
  const title = heading?.trim() || NEWS_SECTION_HEADING;

  return (
    <Section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="sr-only"
      >
        {title}
      </h2>
      <ul className="cols-3">
        {cards.map((item, index) => {
          const date = item.publishedAt
            ? formatPolishMonthYear(item.publishedAt)
            : null;
          // Alternate magenta / navy for both date and title, card by card.
          const titleColor = index % 2 === 0 ? "text-magenta" : "text-navy";

          return (
            <li
              key={item._id}
              className="news-card card-hover relative isolate"
            >
              <Blob />
              {date ? (
                <p className={cn("font-display text-small", titleColor)}>
                  {date}
                </p>
              ) : null}
              {item.title ? (
                <h3
                  className={cn(
                    "news-card-title mt-2 line-clamp-2 font-display text-h4 font-black",
                    titleColor,
                  )}
                >
                  {item.href ? (
                    <Link href={item.href} className="card-link">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
              ) : null}
              <div className="news-card-body">
                {item.excerpt ? (
                  <p className="mt-5 line-clamp-4 text-body">{item.excerpt}</p>
                ) : null}
              </div>
              {item.ctaHref ? (
                <CtaLink
                  href={item.ctaHref}
                  className="news-card-cta cta-over mt-8"
                >
                  {item.ctaLabel?.trim() || NEWS_CTA_LABEL}
                </CtaLink>
              ) : item.href ? (
                <CtaLink
                  href={item.href}
                  presentational
                  className="news-card-cta mt-8"
                >
                  {item.ctaLabel?.trim() || NEWS_CTA_LABEL}
                </CtaLink>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
