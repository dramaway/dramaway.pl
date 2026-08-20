import Link from "next/link";
import { getPeople } from "@/lib/sanity/fetch";

export const metadata = { title: "Zespół — preview" };
export const revalidate = 60;

export default async function TeamPreviewPage() {
  const people = await getPeople();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview" className="underline-offset-4 hover:underline">
          Preview
        </Link>{" "}
        / Zespół
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Zespół</h1>
      {people.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Brak dokumentów <code>person</code> w Sanity.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {people.map((person) => (
            <li key={person._id} className="py-4">
              <Link
                href={`/preview/zespol/${person.slug}`}
                className="text-lg font-medium hover:underline"
              >
                {person.name}
              </Link>
              {person.role ? (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {person.role}
                </p>
              ) : null}
              {person.excerpt ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {person.excerpt}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
