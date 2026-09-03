import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { NEWS_CTA_LABEL } from "@/lib/homepage-copy";
import { cn } from "@/lib/utils";

export type HomeNewsItem = {
  _id: string;
  title: string;
  href: string;
  excerpt: string | null;
  publishedAt: string | null;
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
export function HomeNews({ items }: { items: HomeNewsItem[] }) {
  const cards = items.slice(0, 3);

  return (
    <Section aria-labelledby="home-news-heading">
      <h2
        id="home-news-heading"
        className="font-display text-display font-black uppercase"
      >
        Aktualności
      </h2>
      <ul className="cols-3 mt-8">
        {cards.map((item, index) => {
          const date = item.publishedAt
            ? formatPolishMonthYear(item.publishedAt)
            : null;
          // Figma alternates the title colour card by card.
          const titleColor = index % 2 === 0 ? "text-magenta" : "text-navy";

          return (
            <li
              key={item._id}
              className="news-card card-hover relative isolate"
            >
              <Blob />
              {date ? (
                <p className="font-display text-small text-magenta">{date}</p>
              ) : null}
              {item.title ? (
                <h3
                  className={cn(
                    "news-card-title mt-2 line-clamp-2 font-display text-h3 font-extrabold",
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
                  <p className="mt-3 line-clamp-4 text-body">{item.excerpt}</p>
                ) : null}
              </div>
              {item.href ? (
                <CtaLink
                  href={item.href}
                  presentational
                  className="news-card-cta mt-8"
                >
                  {NEWS_CTA_LABEL}
                </CtaLink>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
