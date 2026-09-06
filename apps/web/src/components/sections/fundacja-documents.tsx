import { Section } from "@/components/layout/section";
import { CtaLink } from "@/components/visual/cta-link";

export type FundacjaDocumentLink = {
  title: string;
  href: string;
};

type FundacjaDocumentsProps = {
  heading: string;
  items: FundacjaDocumentLink[];
  emptyMessage: string;
};

/**
 * Foundation documents as a CTA list (statut, reports, support) — not blob cards.
 */
export function FundacjaDocuments({
  heading,
  items,
  emptyMessage,
}: FundacjaDocumentsProps) {
  return (
    <Section>
      <h2 className="font-display text-h3 font-black">{heading}</h2>
      {items.length === 0 ? (
        <p className="mt-8 text-body">{emptyMessage}</p>
      ) : (
        <ul className="stack mt-8">
          {items.map((item) => (
            <li key={item.href}>
              <CtaLink href={item.href}>{item.title}</CtaLink>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
