import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { czytelniaPath } from "@/lib/routes";
import {
  getPublicationBySlug,
  getPublicationSlugs,
} from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublicationSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  return { title: publication?.title ?? "Czytelnia" };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  return (
    <>
      <PageHero
        title={publication.title}
        lead={publication.summary}
        image={publication.cover}
        parent={{ href: czytelniaPath(), label: "Czytelnia" }}
      />
      {publication.body ? (
        <Section>
          <div className="measure">
            <PortableBody value={publication.body} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
