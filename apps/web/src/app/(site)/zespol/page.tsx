import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { TeamRow } from "@/components/sections/team-row";
import { getTeamLanding } from "@/lib/landing-page";
import { getPeople } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "Zespół" };
export const revalidate = 60;

export default async function TeamPage() {
  const [people, landing] = await Promise.all([getPeople(), getTeamLanding()]);

  return (
    <>
      <PageHero
        title={landing.title}
        lead={landing.lead}
        ctaLabel={landing.ctaLabel}
        ctaHref={landing.ctaHref}
        slides={landing.slides}
        parent={{ href: "/fundacja", label: "O fundacji" }}
      />
      <TeamRow people={people} />
    </>
  );
}
