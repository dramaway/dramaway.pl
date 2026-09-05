import type { Metadata } from "next";
import { BlobRow } from "@/components/sections/blob-row";
import { PageHero } from "@/components/sections/page-hero";
import { FUNDACJA_PAGE_SLUGS, publicPathForPageSlug } from "@/lib/routes";
import { getPagesBySlugs } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "O fundacji" };
export const revalidate = 60;

export default async function FundacjaIndexPage() {
  const pages = await getPagesBySlugs(FUNDACJA_PAGE_SLUGS);

  return (
    <>
      <PageHero title="O fundacji" />
      <BlobRow
        items={pages.map((page) => ({
          title: page.title,
          href: publicPathForPageSlug(page.slug),
        }))}
        emptyMessage="Brak podstron fundacji w CMS."
      />
    </>
  );
}
