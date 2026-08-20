import type { Metadata } from "next";
import Link from "next/link";
import { ListingShell } from "@/components/article-shell";
import { FUNDACJA_PAGE_SLUGS, publicPathForPageSlug } from "@/lib/routes";
import { getPagesBySlugs } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "O fundacji" };
export const revalidate = 60;

export default async function FundacjaIndexPage() {
  const pages = await getPagesBySlugs(FUNDACJA_PAGE_SLUGS);

  return (
    <ListingShell>
      <h1 className="text-3xl font-semibold tracking-tight">O fundacji</h1>
      <ul className="mt-8 divide-y">
        {pages.map((page) => (
          <li key={page._id} className="py-3">
            <Link
              href={publicPathForPageSlug(page.slug)}
              className="font-medium hover:underline"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </ListingShell>
  );
}
