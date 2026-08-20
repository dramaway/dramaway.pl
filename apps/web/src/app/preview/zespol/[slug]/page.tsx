import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/portable-body";
import { getPersonBySlug, getPersonSlugs } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPersonSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export default async function PersonPreviewPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  const photoUrl = person.photo
    ? urlFor(person.photo).width(400).height(500).fit("crop").url()
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview/zespol" className="hover:underline">
          Zespół
        </Link>{" "}
        / {person.name}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {person.name}
      </h1>
      {person.role ? (
        <p className="mt-1 text-muted-foreground">{person.role}</p>
      ) : null}
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={person.name}
          width={400}
          height={500}
          className="mt-6 h-auto w-48 object-cover"
        />
      ) : null}
      <PortableBody value={person.bio} />
    </main>
  );
}
