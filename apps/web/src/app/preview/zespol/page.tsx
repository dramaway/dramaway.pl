import Link from "next/link";
import { getFundacjaExtract } from "@/lib/fundacja-extract";

export const metadata = { title: "Zespół — preview" };

export default function TeamPreviewPage() {
  const { people } = getFundacjaExtract();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview" className="underline-offset-4 hover:underline">
          Preview
        </Link>{" "}
        / Zespół
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Zespół</h1>
      <ul className="mt-8 divide-y">
        {people.map((person) => (
          <li key={person.nid} className="py-4">
            <Link
              href={`/preview/zespol/${person.slug}`}
              className="text-lg font-medium hover:underline"
            >
              {person.title}
            </Link>
            {person.summary ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {person.summary}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
