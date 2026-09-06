import type { Metadata } from "next";
import { FundacjaDocuments } from "@/components/sections/fundacja-documents";
import { FundacjaValues } from "@/components/sections/fundacja-values";
import { PageHero } from "@/components/sections/page-hero";
import { TeamBios } from "@/components/sections/team-bios";
import { DotBand } from "@/components/visual/dot-band";
import { PaletteRow } from "@/components/visual/palette-row";
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
      <PageHero
        title={copy.title}
        lead={copy.lead}
        ctaLabel={copy.ctaLabel}
        ctaHref={copy.ctaHref}
      />
      <FundacjaValues
        heading={copy.methods.title}
        lead={copy.methods.lead}
        ctaLabel={copy.methods.ctaLabel}
        ctaHref={copy.methods.href}
        values={copy.values}
      />
      <TeamBios
        heading={copy.teamHeading}
        people={people}
        ctaLabel={copy.teamCta}
        emptyMessage={copy.teamEmpty}
      />
      <DotBand />
      <div className="page py-section">
        <PaletteRow />
      </div>
      <FundacjaDocuments
        heading={copy.documents.heading}
        items={pages.map((page) => ({
          title: page.title,
          href: publicPathForPageSlug(page.slug),
        }))}
        emptyMessage={copy.documents.empty}
      />
    </>
  );
}
