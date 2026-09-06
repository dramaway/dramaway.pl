import Link from "next/link";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { LIST_CTA_LABEL } from "@/lib/subpage-copy";

export type BlobRowItem = {
  title: string;
  lead?: string | null;
  href: string;
  ctaLabel?: string | null;
};

const DEFAULT_CTA = LIST_CTA_LABEL;

/** Stack of blob rows without a section wrapper. */
export function BlobStack({
  items,
  density = "default",
}: {
  items: BlobRowItem[];
  density?: "default" | "compact";
}) {
  if (items.length === 0) return null;

  return (
    <ul className={density === "compact" ? "blob-row-compact" : "stack"}>
      {items.map((item) => (
        <li
          key={`${item.href}-${item.title}`}
          className="stack-item card-hover"
        >
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
  );
}
