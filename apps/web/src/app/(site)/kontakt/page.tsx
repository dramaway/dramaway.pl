import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { ContentModules } from "@/components/sections/content-modules";
import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { cmsText } from "@/lib/cms-text";
import { resolveHeroSlides } from "@/lib/hero-slides";
import { getPageBySlug, getPeople } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("kontakt");
  return { title: cmsText(page?.title) || "Kontakt" };
}

export default async function ContactPage() {
  const [page, people] = await Promise.all([
    getPageBySlug("kontakt"),
    getPeople(),
  ]);
  if (!page) notFound();

  const withEmail = people.filter((person) => person.email?.trim());
  const body = hasPortableContent(page.body) ? page.body : null;

  return (
    <>
      <PageHero
        title={cmsText(page.title)}
        lead={body ? null : cmsText(page.heroLead)}
        ctaLabel={page.heroCtaLabel}
        ctaHref={page.heroCtaHref}
        slides={resolveHeroSlides(page.heroImages, cmsText(page.title) || "")}
      >
        {body ? <PortableBody value={body} /> : null}
      </PageHero>
      <ContentModules sections={page.sections} variant="page" />
      {withEmail.length > 0 ? (
        <Section>
          <h2 className="font-display text-h3 font-black">
            {SUBPAGE.contact.directHeading}
          </h2>
          <ul className="team-row mt-8">
            {withEmail.map((person) => (
              <li key={person.slug}>
                <p className="font-display text-h4 font-black">{person.name}</p>
                {person.role ? (
                  <p className="mt-2 text-small">{person.role}</p>
                ) : null}
                <a
                  href={`mailto:${person.email}`}
                  className="mt-4 inline-block text-green-ink"
                >
                  {person.email}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
