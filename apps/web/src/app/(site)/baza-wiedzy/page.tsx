import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { BlobRow } from "@/components/sections/blob-row";
import {
  getKnowledgeChannels,
  getKnowledgeLanding,
} from "@/lib/landing-page";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Baza wiedzy" };
export const revalidate = 60;

export default async function KnowledgeHubPage() {
  const [landing, channels] = await Promise.all([
    getKnowledgeLanding(),
    getKnowledgeChannels(),
  ]);
  return (
    <>
      <PageHero
        title={landing.title}
        lead={landing.lead}
        ctaLabel={landing.ctaLabel}
        ctaHref={landing.ctaHref}
        image={landing.image}
        imageAlt={landing.imageAlt}
      />
      <BlobRow
        width="wide"
        items={channels.map((channel) => ({ ...channel, excerpt: true }))}
        emptyMessage={SUBPAGE.knowledge.empty}
      />
    </>
  );
}
