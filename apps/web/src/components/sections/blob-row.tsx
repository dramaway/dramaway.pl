import { Section } from "@/components/layout/section";
import { BlobStack, type BlobRowItem } from "@/components/sections/blob-stack";
import { LIST_EMPTY_MESSAGE } from "@/lib/subpage-copy";
import { cn } from "@/lib/utils";

export type { BlobRowItem };

export type BlobRowWidth = "page" | "narrow" | "wide";

type BlobRowProps = {
  items: BlobRowItem[];
  heading?: string | null;
  headingId?: string;
  /**
   * Column width for heading + rows. `wide` / `narrow` are centred
   * reading columns; default `page` is the full `.page` container.
   * `compact` density is two-up from `lg` on `.page`, with a magenta
   * sentence-case label and a light right-column stagger.
   */
  width?: BlobRowWidth;
  /** Archive listings sit two-up from `lg`; default is a single column. */
  density?: "default" | "compact";
  emptyMessage?: string;
  className?: string;
};

const DEFAULT_EMPTY = LIST_EMPTY_MESSAGE;

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
  width = "page",
  density = "default",
  emptyMessage = DEFAULT_EMPTY,
  className,
}: BlobRowProps) {
  const labelId = heading
    ? (headingId ?? idFromHeading(heading))
    : undefined;

  const columnClass =
    density === "compact"
      ? undefined
      : width === "narrow"
        ? "stack-narrow"
        : width === "wide"
          ? "measure"
          : undefined;

  const inner = (
    <>
      {heading ? (
        <h2
          id={labelId}
          className={
            density === "compact"
              ? "blob-row-label"
              : "font-display text-h3 font-black"
          }
        >
          {heading}
        </h2>
      ) : null}

      {items.length === 0 ? (
        <p className={cn("text-body", heading && density !== "compact" && "mt-8")}>
          {emptyMessage}
        </p>
      ) : (
        <div className={cn(heading && density !== "compact" && "mt-8")}>
          <BlobStack items={items} density={density} />
        </div>
      )}
    </>
  );

  return (
    <Section aria-labelledby={labelId} className={className}>
      {columnClass ? <div className={columnClass}>{inner}</div> : inner}
    </Section>
  );
}
