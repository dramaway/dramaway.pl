import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { cn } from "@/lib/utils";

export type BlobRowItem = {
  title: string;
  lead?: string | null;
  href: string;
  ctaLabel?: string | null;
};

type BlobRowProps = {
  items: BlobRowItem[];
  heading?: string | null;
  headingId?: string;
  /** Archive listings sit two-up from `lg`; default is a single column. */
  density?: "default" | "compact";
  emptyMessage?: string;
};

const DEFAULT_CTA = "więcej";
const DEFAULT_EMPTY = "Nie ma jeszcze pozycji w CMS.";

function idFromHeading(heading: string) {
  return heading
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Repeatable list row: sand circle, title, lead, CTA. Same data shape on
 * `/projekty`, Art Generacje editions, and Czytelnia. Survives an empty array.
 */
export function BlobRow({
  items,
  heading,
  headingId,
  density = "default",
  emptyMessage = DEFAULT_EMPTY,
}: BlobRowProps) {
  const labelId = heading
    ? (headingId ?? idFromHeading(heading))
    : undefined;

  return (
    <Section aria-labelledby={labelId}>
      {heading ? (
        <h2
          id={labelId}
          className="font-display text-h3 font-black"
        >
          {heading}
        </h2>
      ) : null}

      {items.length === 0 ? (
        <p className={cn("text-body", heading && "mt-8")}>{emptyMessage}</p>
      ) : (
        <ul
          className={cn(
            density === "compact" ? "blob-row-compact" : "stack",
            heading && "mt-8",
          )}
        >
          {items.map((item) => (
            <li key={`${item.href}-${item.title}`} className="stack-item card-hover">
              <Blob />
              <h3 className="font-display text-h3 font-black">
                <Link href={item.href} className="card-link">
                  {item.title}
                </Link>
              </h3>
              {item.lead ? (
                <p className="measure mt-5 text-body">{item.lead}</p>
              ) : null}
              <CtaLink href={item.href} presentational className="mt-8">
                {item.ctaLabel?.trim() || DEFAULT_CTA}
              </CtaLink>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
