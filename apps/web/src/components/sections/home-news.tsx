import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { NEWS_CTA_LABEL } from "@/lib/homepage-copy";

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
    <Section aria-label="Aktualności">
      <ul className="cols-3">
        {cards.map((item) => {
          const date = item.publishedAt
            ? formatPolishMonthYear(item.publishedAt)
            : null;

          return (
            <li key={item._id} className="relative isolate">
              <Blob />
              {date ? (
                <p className="font-display text-small font-semibold text-magenta">
                  {date}
                </p>
              ) : null}
              {item.title ? (
                <h3 className="mt-2 font-display text-h3 font-extrabold">
                  {item.title}
                </h3>
              ) : null}
              {item.excerpt ? (
                <p className="mt-3 line-clamp-4 text-body">{item.excerpt}</p>
              ) : null}
              {item.href ? (
                <CtaLink href={item.href} className="mt-8">
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
