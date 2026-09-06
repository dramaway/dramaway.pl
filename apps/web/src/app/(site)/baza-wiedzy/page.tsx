import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Baza wiedzy" };

export default function KnowledgeHubPage() {
  const copy = SUBPAGE.knowledge;
  return (
    <>
      <PageHero title={copy.title} lead={copy.lead} />
      <Section>
        <div className="stack stack-narrow">
          {copy.channels.map((channel) => (
            <div key={channel.href} className="stack-item card-hover">
              <Blob />
              <h2 className="font-display text-h3 font-black">
                <Link href={channel.href} className="card-link">
                  {channel.title}
                </Link>
              </h2>
              <p className="measure mt-5 text-body">{channel.lead}</p>
              <CtaLink href={channel.href} presentational className="mt-8">
                {copy.channelCta}
              </CtaLink>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
