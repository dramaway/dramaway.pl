import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { getKnowledgeLanding } from "@/lib/landing-page";
import { SUBPAGE } from "@/lib/subpage-copy";

export const metadata: Metadata = { title: "Baza wiedzy" };
export const revalidate = 60;

export default async function KnowledgeHubPage() {
  const landing = await getKnowledgeLanding();
  const copy = SUBPAGE.knowledge;
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
