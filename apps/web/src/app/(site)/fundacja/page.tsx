import type { Metadata } from "next";
import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { TeamRow } from "@/components/sections/team-row";
import { publicPathForPageSlug } from "@/lib/routes";
import { getPagesBySlugs, getPeople } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "O fundacji" };
export const revalidate = 60;

const DOCUMENT_SLUGS = ["statut", "sprawozdania", "jak-nas-wesprzec"] as const;

export default async function FundacjaIndexPage() {
  const [pages, people] = await Promise.all([
    getPagesBySlugs([...DOCUMENT_SLUGS]),
    getPeople(),
  ]);
  const copy = SUBPAGE.fundacja;

  return (
    <>
      <PageHero title={copy.title} lead={copy.lead} />
      <BlobRow
        heading="Metody i wartości"
        items={[
          {
            title: "Metody",
            lead: copy.methods.lead,
            href: copy.methods.href,
            ctaLabel: copy.methods.ctaLabel,
          },
        ]}
      />
      <TeamRow
        heading="Zespół"
        people={people}
        href="/zespol"
        ctaLabel={copy.teamCta}
      />
      <BlobRow
        heading="Dokumenty i sprawozdania"
        items={pages.map((page) => ({
          title: page.title,
          href: publicPathForPageSlug(page.slug),
        }))}
        emptyMessage="Brak dokumentów fundacji w CMS."
      />
    </>
  );
}
