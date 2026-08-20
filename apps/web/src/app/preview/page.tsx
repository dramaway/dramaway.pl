import Link from "next/link";
import { getFundacjaExtract } from "@/lib/fundacja-extract";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Preview — extracted Drupal data",
};

export default function PreviewIndexPage() {
  const data = getFundacjaExtract();
  const ready = data.counts.pages + data.counts.people + data.counts.news > 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">Local extract preview</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Fundacja — dane z dumpa
      </h1>
      <p className="mt-3 text-muted-foreground">
        Surowe templatki z JSON wygenerowanego skryptem{" "}
        <code className="text-sm">pnpm extract:fundacja</code>. Bez Sanity i bez
        Figmy — tylko sprawdzenie migracji treści.
      </p>

      {!ready ? (
        <p className="mt-8 rounded-lg border border-dashed p-4 text-sm">
          Brak pliku <code>src/data/extracted/fundacja.json</code>. Uruchom z
          roota repo: <code>pnpm extract:fundacja</code> (wymaga dumpa w{" "}
          <code>private/dumps/</code>).
        </p>
      ) : (
        <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Strony</dt>
            <dd className="text-2xl font-semibold">{data.counts.pages}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Zespół</dt>
            <dd className="text-2xl font-semibold">{data.counts.people}</dd>
          </div>
          <div className="rounded-lg border p-4">
            <dt className="text-sm text-muted-foreground">Aktualności</dt>
            <dd className="text-2xl font-semibold">{data.counts.news}</dd>
          </div>
        </dl>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link className={cn(buttonVariants())} href="/preview/zespol">
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

      {ready && (
        <p className="mt-6 text-xs text-muted-foreground">
          Źródło: {data.source} · extracted {data.extractedAt}
        </p>
      )}
    </main>
  );
}
