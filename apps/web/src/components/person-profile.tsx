import Image from "next/image";
import Link from "next/link";
import { PortableBody } from "@/components/portable-body";
import { ArticleShell } from "@/components/article-shell";
import { urlFor } from "@/lib/sanity/image";
import type { PersonDetail } from "@/lib/sanity/types";

export function PersonProfile({ person }: { person: PersonDetail }) {
  const photoUrl = person.photo
    ? urlFor(person.photo).width(400).height(500).fit("crop").url()
    : null;

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
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={person.name}
          width={400}
          height={500}
          className="mt-6 h-auto w-48 object-cover"
        />
      ) : null}
      <PortableBody value={person.bio} />
    </ArticleShell>
  );
}
