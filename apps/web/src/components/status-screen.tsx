import { CtaLink } from "@/components/visual/cta-link";

type StatusScreenProps = {
  title: string;
  lead: string;
  cta: string;
};

/** Branded empty/error chrome — composition classes only, copy from SUBPAGE. */
export function StatusScreen({ title, lead, cta }: StatusScreenProps) {
  return (
    <div className="page py-section">
      <div className="stack-narrow">
        <h1 className="hero-title font-display text-display font-black">
          {title}
        </h1>
        <p className="mt-8 text-lead">{lead}</p>
        <CtaLink href="/" className="mt-8">
          {cta}
        </CtaLink>
      </div>
    </div>
  );
}
