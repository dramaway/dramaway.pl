import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { knowledgeHubPath } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";

/**
 * Listing-only layout so the hero stays mounted while `searchParams` change.
 * Article routes (`[slug]`) sit beside this group and do not get the listing hero.
 */
export default function CzytelniaListingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const copy = SUBPAGE.czytelnia;

  return (
    <>
      <PageHero
        title={copy.title}
        lead={copy.lead}
        parent={{ href: knowledgeHubPath(), label: "Baza wiedzy" }}
      />
      {children}
    </>
  );
}
