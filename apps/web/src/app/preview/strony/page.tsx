import Link from "next/link";
import { getFundacjaExtract } from "@/lib/fundacja-extract";

export const metadata = { title: "Strony — preview" };

export default function PagesPreviewPage() {
  const { pages, news } = getFundacjaExtract();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview" className="hover:underline">
          Preview
        </Link>{" "}
        / Strony
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Strony</h1>
      <ul className="mt-8 divide-y">
        {pages.map((page) => (
          <li key={page.nid} className="py-3">
            <Link
              href={`/preview/strony/${page.slug}`}
              className="font-medium hover:underline"
            >
              {page.title}
            </Link>
            <span className="ml-2 text-xs text-muted-foreground">
              {page.path}
            </span>
          </li>
        ))}
      </ul>

      {news.length > 0 ? (
        <>
          <h2 className="mt-12 text-xl font-semibold">Aktualności</h2>
          <ul className="mt-4 divide-y">
            {news.map((item) => (
              <li key={item.nid} className="py-3">
                <Link
                  href={`/preview/strony/${item.slug}`}
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
