import Link from "next/link";
import { publicPathForPageSlug } from "@/lib/routes";
import { getNewsPages, getPages } from "@/lib/sanity/fetch";

export const metadata = { title: "Strony — preview" };
export const revalidate = 60;

export default async function PagesPreviewPage() {
  const [pages, news] = await Promise.all([getPages(), getNewsPages()]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview" className="hover:underline">
          Preview
        </Link>{" "}
        / Strony
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Strony</h1>
      {pages.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Brak dokumentów <code>page</code> w Sanity.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {pages.map((page) => (
            <li key={page._id} className="py-3">
              <Link
                href={publicPathForPageSlug(page.slug)}
                className="font-medium hover:underline"
              >
                {page.title}
              </Link>
              <span className="ml-2 text-xs text-muted-foreground">
                /{page.slug}
              </span>
            </li>
          ))}
        </ul>
      )}

      {news.length > 0 ? (
        <>
          <h2 className="mt-12 text-xl font-semibold">Aktualności</h2>
          <ul className="mt-4 divide-y">
            {news.map((item) => (
              <li key={item._id} className="py-3">
                <Link
                  href={publicPathForPageSlug(item.slug)}
                  className="font-medium hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
