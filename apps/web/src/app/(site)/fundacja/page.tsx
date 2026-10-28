import type { Metadata } from "next";
import { FundacjaDocuments } from "@/components/sections/fundacja-documents";
import { FundacjaGallery } from "@/components/sections/fundacja-gallery";
import { FundacjaHistory } from "@/components/sections/fundacja-history";
import { FundacjaValues } from "@/components/sections/fundacja-values";
import { PageHero } from "@/components/sections/page-hero";
import { TeamBios } from "@/components/sections/team-bios";
import { DotBand } from "@/components/visual/dot-band";
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
      <FundacjaGallery
        heading={about.gallery.heading}
        images={about.gallery.images}
      />
      <FundacjaHistory
        heading={about.history.heading}
        lead={about.history.lead}
        layout={about.history.layout}
        items={about.history.items}
      />
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
