import type { Metadata } from "next";
import Link from "next/link";
import { ListingShell } from "@/components/article-shell";
import { publicPathForPersonSlug } from "@/lib/routes";
import { getPeople } from "@/lib/sanity/fetch";

export const metadata: Metadata = { title: "Zespół" };
export const revalidate = 60;

export default async function TeamPage() {
  const people = await getPeople();

  return (
    <ListingShell>
      <h1 className="text-3xl font-semibold tracking-tight">Zespół</h1>
      {people.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Brak osób w CMS.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {people.map((person) => (
            <li key={person._id} className="py-4">
              <Link
                href={publicPathForPersonSlug(person.slug)}
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
    </ListingShell>
  );
}
