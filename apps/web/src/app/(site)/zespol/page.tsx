import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { TeamRow } from "@/components/sections/team-row";
import { getPeople } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "Zespół" };
export const revalidate = 60;

export default async function TeamPage() {
  const people = await getPeople();

  return (
    <>
      <PageHero
        title="Zespół"
        lead="Osoby, które prowadzą projekty, warsztaty i pracę ze społecznościami."
        parent={{ href: "/fundacja", label: "O fundacji" }}
      />
      <TeamRow people={people} />
    </>
  );
}
