import type { Metadata } from "next";
import { FundacjaDocuments } from "@/components/sections/fundacja-documents";
import { FundacjaHistory } from "@/components/sections/fundacja-history";
import { FundacjaValues } from "@/components/sections/fundacja-values";
import { PageHero } from "@/components/sections/page-hero";
import { TeamBios } from "@/components/sections/team-bios";
import { DotBand } from "@/components/visual/dot-band";
import { PaletteRow } from "@/components/visual/palette-row";
import { getResolvedAboutPage } from "@/lib/about-page";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getResolvedAboutPage();
  return { title: about.title };
}

export default async function FundacjaIndexPage() {
  const about = await getResolvedAboutPage();

  return (
    <div data-no-palette="">
      <PageHero
        title={about.title}
        lead={about.lead}
        ctaLabel={about.ctaLabel}
        ctaHref={about.ctaHref}
        image={about.image}
        imageAlt={about.imageAlt}
      />
      <FundacjaValues
        heading={about.methods.heading}
        lead={about.methods.lead}
        ctaLabel={about.methods.ctaLabel}
        ctaHref={about.methods.ctaHref}
        values={about.methods.values}
      />
      <TeamBios
        heading={about.team.heading}
        people={about.team.people}
        ctaLabel={about.team.ctaLabel}
        emptyMessage={about.team.emptyMessage}
      />
      <DotBand />
      <FundacjaHistory
        heading={about.history.heading}
        lead={about.history.lead}
        items={about.history.items}
      />
      {about.history.items.length > 0 ? (
        <div className="page py-section">
          <PaletteRow />
        </div>
      ) : null}
      <FundacjaDocuments
        heading={about.documents.heading}
        items={about.documents.items}
        emptyMessage={about.documents.emptyMessage}
      />
      <DotBand />
    </div>
  );
}
