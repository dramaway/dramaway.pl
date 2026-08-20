import Link from "next/link";
import { notFound } from "next/navigation";
import { getFundacjaExtract } from "@/lib/fundacja-extract";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = getFundacjaExtract();
  return [...data.pages, ...data.news].map((p) => ({ slug: p.slug }));
}

export default async function PagePreviewPage({ params }: Props) {
  const { slug } = await params;
  const data = getFundacjaExtract();
  const page =
    data.pages.find((p) => p.slug === slug) ||
    data.news.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview/strony" className="hover:underline">
          Strony
        </Link>{" "}
        / {page.title}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {page.title}
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Drupal path: {page.path} · type: {page.drupalType}
      </p>
      <article
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
    </main>
  );
}
