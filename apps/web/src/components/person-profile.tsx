import Link from "next/link";
import { PortableBody } from "@/components/portable-body";
import { ArticleShell } from "@/components/article-shell";
import { Media } from "@/components/visual/media";
import type { PersonDetail } from "@/lib/sanity/types";

export function PersonProfile({ person }: { person: PersonDetail }) {
  return (
    <ArticleShell>
      <p className="text-sm text-muted-foreground">
        <Link href="/zespol" className="hover:underline">
          Zespół
        </Link>
        {" / "}
        {person.name}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{person.name}</h1>
      {person.role ? (
        <p className="mt-1 text-muted-foreground">{person.role}</p>
      ) : null}
      {person.email ? (
        <p className="mt-1 text-sm">
          <a href={`mailto:${person.email}`} className="underline underline-offset-2">
            {person.email}
          </a>
        </p>
      ) : null}
      {person.photo ? (
        <div className="mt-6 w-48">
          <Media
            image={person.photo}
            alt={person.name}
            ratio="album"
            variant="inset"
            sizes="12rem"
          />
        </div>
      ) : null}
      <PortableBody value={person.bio} />
    </ArticleShell>
  );
}
