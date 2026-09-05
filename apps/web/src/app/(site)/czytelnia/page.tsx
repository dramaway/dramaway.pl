import type { Metadata } from "next";
import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { knowledgeHubPath, publicationPath } from "@/lib/routes";
import { getPublications } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "Czytelnia" };
export const revalidate = 60;

export default async function CzytelniaPage() {
  const publications = await getPublications();

  return (
    <>
      <PageHero
        title="Czytelnia"
        lead="Publikacje z portalu wiedzy. Lista pokazuje to, co jest w CMS."
        parent={{ href: knowledgeHubPath(), label: "Baza wiedzy" }}
      />
      <BlobRow
        items={publications.map((item) => ({
          title: item.title,
          lead: item.summary,
          href: publicationPath(item.slug),
        }))}
        emptyMessage="Czytelnia jest pusta — w CMS nie ma jeszcze publikacji."
      />
    </>
  );
}
