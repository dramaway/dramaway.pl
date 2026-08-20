import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/portable-body";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/fetch";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export default async function ProjectPreviewPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const editions = project.editions ?? [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview/projekty" className="hover:underline">
          Projekty
        </Link>{" "}
        / {project.title}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        slug: {project.slug}
        {project.featured ? " · featured" : ""}
        {project.status ? ` · ${project.status}` : ""}
      </p>
      <PortableBody value={project.body} />

      {editions.length > 0 ? (
        <nav className="mt-10 rounded-lg border p-4 text-sm">
          <p className="font-medium">Edycje</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {editions.map((edition) => (
              <li key={edition.slug}>
                <a href={`#${edition.slug}`} className="hover:underline">
                  {edition.title}
                </a>
                {edition.years ? (
                  <span className="text-muted-foreground">
                    {" "}
                    ({edition.years})
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {editions.map((edition) => (
        <section
          key={edition.slug}
          id={edition.slug}
          className="mt-12 border-t pt-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            {edition.title}
          </h2>
          {edition.years ? (
            <p className="mt-1 text-sm text-muted-foreground">{edition.years}</p>
          ) : null}
          <PortableBody value={edition.body} />
          {edition.outcomes && edition.outcomes.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {edition.outcomes.map((outcome) => (
                <li key={outcome.title} className="rounded-md border p-4">
                  <p className="font-medium">{outcome.title}</p>
                  {outcome.subtitle || outcome.date ? (
                    <p className="text-sm text-muted-foreground">
                      {[outcome.subtitle, outcome.date].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  {outcome.description ? (
                    <p className="mt-2 text-sm">{outcome.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {project.partners && project.partners.length > 0 ? (
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold">Partnerzy</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {project.partners.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <PortableBody value={project.afterword} />
    </main>
  );
}
