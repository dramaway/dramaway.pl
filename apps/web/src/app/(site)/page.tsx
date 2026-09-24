import type { Metadata } from "next";
import { ContentModules } from "@/components/sections/content-modules";
import { Hero } from "@/components/sections/hero";
import { getResolvedSite } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getResolvedSite();
  return {
    title: site.title,
    description: site.tagline ?? undefined,
  };
}

export default async function HomePage() {
  const site = await getResolvedSite();

  return (
    <div data-home="">
      <Hero hero={site.hero} />
      <ContentModules sections={site.homepage.sections} variant="home" />
    </div>
  );
}
