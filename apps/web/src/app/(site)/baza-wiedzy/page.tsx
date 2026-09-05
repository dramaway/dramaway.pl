import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { czytelniaPath, methodsPath } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Baza wiedzy" };

const CHANNELS = [
  {
    href: methodsPath(),
    title: "Metody",
    lead: "Drama, Teatr Zaangażowany Społecznie, Teatr Forum, Teatr ze Społecznością i Teatr w Edukacji.",
  },
  {
    href: czytelniaPath(),
    title: "Czytelnia",
    lead: "Artykuły i publikacje — osobny tor treści, nie projekt fundacji.",
  },
] as const;

export default function KnowledgeHubPage() {
  return (
    <>
      <PageHero title={SUBPAGE.knowledge.title} lead={SUBPAGE.knowledge.lead} />
      <Section>
        <div className="stack stack-narrow">
          {CHANNELS.map((channel) => (
            <div key={channel.href} className="stack-item card-hover">
              <Blob />
              <h2 className="font-display text-h3 font-black">
                <Link href={channel.href} className="card-link">
                  {channel.title}
                </Link>
              </h2>
              <p className="measure mt-5 text-body">{channel.lead}</p>
              <CtaLink href={channel.href} presentational className="mt-8">
                więcej
              </CtaLink>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
