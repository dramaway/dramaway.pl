import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { ContentModules } from "@/components/sections/content-modules";
import { Section } from "@/components/layout/section";
import { PortableBody, hasPortableContent } from "@/components/portable-body";
import { cmsText } from "@/lib/cms-text";
import { splitContactBody } from "@/lib/contact-body";
import { resolveHeroSlides } from "@/lib/hero-slides";
import { getPageBySlug } from "@/lib/sanity/fetch";
import { SUBPAGE } from "@/lib/subpage-copy";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("kontakt");
  return { title: cmsText(page?.title) || "Kontakt" };
}

export default async function ContactPage() {
  const page = await getPageBySlug("kontakt");
  if (!page) notFound();

  const body = hasPortableContent(page.body) ? page.body : null;
  const contactBody = splitContactBody(body);

  return (
    <div className="page-hero-spacing">
      <PageHero
        title={cmsText(page.title)}
        lead={cmsText(page.heroLead)}
        textAlign={page.heroTextAlign}
        ctaLabel={page.heroCtaLabel}
        ctaHref={page.heroCtaHref}
        slides={resolveHeroSlides(page.heroImages, cmsText(page.title) || "")}
        showBand={false}
      >
      </PageHero>
      <Section
        aria-labelledby="contact-form-heading"
        className="contact-form-section"
      >
        <div className="contact-page-layout">
          <div className="contact-main">
            <h2
              id="contact-form-heading"
              className="font-display text-h3 font-black"
            >
              {SUBPAGE.contact.form.heading}
            </h2>
            <p className="mt-3">{SUBPAGE.contact.form.lead}</p>
            <ContactForm />
          </div>
          <div className="contact-layout">
            <section aria-labelledby="contact-direct-heading">
              <h2
                id="contact-direct-heading"
                className="font-display text-h3 font-black"
              >
                {SUBPAGE.contact.directHeading}
              </h2>
              {contactBody.direct ? (
                <PortableBody
                  value={contactBody.direct}
                  className="contact-body article-body"
                />
              ) : null}
              {contactBody.people.length > 0 ? (
                <ul className="contact-people">
                  {contactBody.people.map((person, index) => (
                    <li key={index}>
                      <PortableBody
                        value={[person]}
                        className="contact-person-body article-body"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
            {contactBody.address ? (
              <section
                className="contact-address"
                aria-label="Adres i numer konta"
              >
                <PortableBody
                  value={contactBody.address}
                  className="contact-body article-body"
                />
              </section>
            ) : null}
          </div>
        </div>
      </Section>
      <ContentModules sections={page.sections} variant="page" />
    </div>
  );
}
