import Link from "next/link";
import { getProjects } from "@/lib/sanity/fetch";

export const metadata = { title: "Projekty — preview" };
export const revalidate = 60;

export default async function ProjectsPreviewPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/preview" className="hover:underline">
          Preview
        </Link>{" "}
        / Projekty
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Projekty</h1>
      <p className="mt-3 text-muted-foreground">
        Typ Sanity <code className="text-sm">project</code>. Art Generacje ma
        edycje; pozostałe to na razie archiwum z body strony Drupal.
      </p>
      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Brak dokumentów <code>project</code>. Odpal{" "}
          <code>pnpm migrate:art-generacje</code>.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {projects.map((project) => (
            <li key={project._id} className="py-4">
              <Link
                href={`/projekty/${project.slug}`}
                className="font-medium hover:underline"
              >
                {project.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.featured ? "wyróżniony · " : ""}
                {project.status || "—"}
                {project.editionCount
                  ? ` · ${project.editionCount} edycji`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
