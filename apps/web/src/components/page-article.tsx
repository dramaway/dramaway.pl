import Link from "next/link";
import { PortableBody } from "@/components/portable-body";
import { ArticleShell } from "@/components/article-shell";
import type { PageDetail } from "@/lib/sanity/types";

type Crumb = { href: string; label: string };

export function PageArticle({
  page,
  parent,
}: {
  page: PageDetail;
  parent?: Crumb;
}) {
  return (
    <ArticleShell>
      {parent ? (
        <p className="text-sm text-muted-foreground">
          <Link href={parent.href} className="hover:underline">
            {parent.label}
          </Link>
          {" / "}
          {page.title}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{page.title}</h1>
      <PortableBody value={page.body} />
    </ArticleShell>
  );
}
