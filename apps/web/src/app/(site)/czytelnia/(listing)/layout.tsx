import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { getCzytelniaLanding } from "@/lib/landing-page";
import { knowledgeHubPath } from "@/lib/routes";

/**
 * Listing-only layout so the hero stays mounted while `searchParams` change.
 * Article routes (`[slug]`) sit beside this group and do not get the listing hero.
 */
export default async function CzytelniaListingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const landing = await getCzytelniaLanding();

  return (
    <>
      <PageHero
        title={landing.title}
        lead={landing.lead}
        ctaLabel={landing.ctaLabel}
        ctaHref={landing.ctaHref}
        slides={landing.slides}
        parent={{ href: knowledgeHubPath(), label: "Baza wiedzy" }}
      />
      {children}
    </>
  );
}
