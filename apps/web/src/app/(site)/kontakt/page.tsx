import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { getPageBySlug, getPeople } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return { title: SUBPAGE.contact.title };
}

export default async function ContactPage() {
  const [page, people] = await Promise.all([
    getPageBySlug("kontakt"),
    getPeople(),
  ]);
  if (!page) notFound();

  const withEmail = people.filter((person) => person.email?.trim());

  return (
    <>
      <PageHero title={SUBPAGE.contact.title} lead={SUBPAGE.contact.lead} />
      <Section>
        <div className="measure">
          <PortableBody value={page.body} />
        </div>
      </Section>
      {withEmail.length > 0 ? (
        <Section>
          <h2 className="font-display text-h3 font-black">Napisz bezpośrednio</h2>
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
