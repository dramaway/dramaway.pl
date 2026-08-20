import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonProfile } from "@/components/person-profile";
import { getPersonBySlug, getPersonSlugs } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPersonSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  return { title: person?.name ?? "Zespół" };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();
  return <PersonProfile person={person} />;
}
