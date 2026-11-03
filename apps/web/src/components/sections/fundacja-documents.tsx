import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";
import { withFileDescription } from "@/lib/file-description";

export type FundacjaDocumentLink = {
  title: string;
  href: string;
  external?: boolean;
  fileDescription?: string | null;
};

type FundacjaDocumentsProps = {
  heading?: string | null;
  items: FundacjaDocumentLink[];
};

/**
 * Foundation documents as a CTA list (page, PDF, or URL) — not blob cards.
 */
export function FundacjaDocuments({
  heading,
  items,
}: FundacjaDocumentsProps) {
  if (items.length === 0) return null;

  return (
    <Section id="dokumenty" className="fundacja-flow">
      <div className="stack-narrow">
        {heading ? (
          <h2 className="font-display text-h3 font-black">{heading}</h2>
        ) : null}
        <ul className={heading ? "document-list mt-8" : "document-list"}>
          {items.map((item) => (
            <li key={`${item.href}-${item.title}`}>
              <CtaLink href={item.href} external={item.external}>
                {withFileDescription(item.title, item.fileDescription)}
              </CtaLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
