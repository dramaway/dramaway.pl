import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicationArticle } from "@/components/publication-article";
import {
  portableBodyHasVideo,
  publicationDestination,
} from "@/lib/publication-destination";
import { safeHrefString } from "@/lib/safe-url";
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

  const fileHref = safeHrefString(publication.file?.asset?.url);
  const destination = publicationDestination({
    format: publication.format,
    hasFile: Boolean(fileHref),
    hasVideo: portableBodyHasVideo(publication.body),
  });
  // 307, not 308: adding a film or removing the file can restore the page.
  if (destination === "file" && fileHref) redirect(fileHref);

  return <PublicationArticle publication={publication} />;
}
