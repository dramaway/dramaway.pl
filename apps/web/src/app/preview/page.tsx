import Link from "next/link";
import { getContentCounts } from "@/lib/sanity/fetch";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Preview — Sanity",
};

export const revalidate = 60;

export default async function PreviewIndexPage() {
  const counts = await getContentCounts();
  const ready =
    counts.pages + counts.people + counts.news + (counts.projects ?? 0) > 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">Sanity preview</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Fundacja — treści z Sanity
      </h1>
      <p className="mt-3 text-muted-foreground">
        Live GROQ z datasetu <code className="text-sm">production</code> (typy{" "}
        <code className="text-sm">person</code>,{" "}
        <code className="text-sm">page</code>,{" "}
        <code className="text-sm">project</code>
        ). Lokalny JSON z extractu zostaje artefaktem migracji, nie źródłem tych
        widoków.
      </p>

      {!ready ? (
        <p className="mt-8 rounded-lg border border-dashed p-4 text-sm">
          Sanity nie zwróciło dokumentów. Sprawdź{" "}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> w{" "}
          <code>apps/web/.env.local</code> i czy migracja została odpalona (
          <code>pnpm migrate:fundacja</code>).
        </p>
      ) : (
        <dl className="mt-8 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Strony</dt>
            <dd className="text-2xl font-semibold">{counts.pages}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Zespół</dt>
            <dd className="text-2xl font-semibold">{counts.people}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Aktualności</dt>
            <dd className="text-2xl font-semibold">{counts.news}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Projekty</dt>
            <dd className="text-2xl font-semibold">{counts.projects}</dd>
          </div>
        </dl>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link className={cn(buttonVariants())} href="/preview/projekty">
          Projekty
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/preview/zespol">
          Zespół
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href="/preview/strony"
        >
          Strony
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "ghost" }))}
          href="/"
        >
          ← Scaffold home
        </Link>
      </div>
    </main>
  );
}
