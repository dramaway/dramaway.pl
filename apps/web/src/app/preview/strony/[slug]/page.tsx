import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/portable-body";
import { getPageBySlug, getPageSlugs } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export default async function PagePreviewPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
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
        slug: {page.slug}
        {page.isNews ? " · aktualność" : ""}
      </p>
      <PortableBody value={page.body} />
    </main>
  );
}
