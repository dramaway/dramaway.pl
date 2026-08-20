import Link from "next/link";
import { notFound } from "next/navigation";
import { getFundacjaExtract } from "@/lib/fundacja-extract";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getFundacjaExtract().people.map((p) => ({ slug: p.slug }));
}

export default async function PersonPreviewPage({ params }: Props) {
  const { slug } = await params;
  const person = getFundacjaExtract().people.find((p) => p.slug === slug);
  if (!person) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview/zespol" className="hover:underline">
          Zespół
        </Link>{" "}
        / {person.title}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {person.title}
      </h1>
      {person.photo ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Legacy photo file: {person.photo}
        </p>
      ) : null}
      <article
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: person.bodyHtml }}
      />
    </main>
  );
}
