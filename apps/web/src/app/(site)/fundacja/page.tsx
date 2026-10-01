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
  return { title: about.title || "O fundacji" };
}

export default async function FundacjaIndexPage() {
  const about = await getResolvedAboutPage();
  const methods = about.methods;
  const showMethods = Boolean(
    methods.heading ||
      methods.lead ||
      (methods.ctaLabel && methods.ctaHref) ||
      methods.values.length > 0,
  );

  return (
    <div data-no-palette="">
      <PageHero
        title={about.title}
        lead={about.lead}
        ctaLabel={about.ctaLabel}
        ctaHref={about.ctaHref}
        slides={about.slides}
      />
      {showMethods ? (
        <FundacjaValues
          heading={methods.heading}
          lead={methods.lead}
          ctaLabel={methods.ctaLabel}
          ctaHref={methods.ctaHref}
          values={methods.values}
        />
      ) : null}
      <TeamBios
        heading={about.team.heading}
        people={about.team.people}
        ctaLabel={about.team.ctaLabel}
        body={about.team.body}
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
      {about.documents.items.length > 0 ? (
        <FundacjaDocuments
          heading={about.documents.heading}
          items={about.documents.items}
        />
      ) : null}
      <DotBand />
    </div>
  );
}
