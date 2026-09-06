import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { PortableBody } from "@/components/portable-body";
import { CtaLink } from "@/components/visual/cta-link";
import { czytelniaPath } from "@/lib/routes";
import { SUBPAGE } from "@/lib/subpage-copy";
import type { PublicationDetail } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

function authorLine(authors: string[] | null | undefined) {
  return (authors ?? []).map((name) => name.trim()).filter(Boolean);
}

function methodLabels(
  methods: PublicationDetail["methods"],
): string[] {
  return (methods ?? []).map((method) => method.title?.trim()).filter(Boolean);
}

/**
 * Reading-room article: shared PageHero, then authors / method tags / PDF
 * only when CMS has them. Methods are labels, not a second listing.
 */
export function PublicationArticle({
  publication,
}: {
  publication: PublicationDetail;
}) {
  const authors = authorLine(publication.authors);
  const methods = methodLabels(publication.methods);
  const fileUrl = publication.file?.asset?.url?.trim() || null;
  const hasMeta = authors.length > 0 || methods.length > 0 || Boolean(fileUrl);
  const hasBody = Boolean(publication.body);

  return (
    <>
      <PageHero
        title={publication.title}
        lead={publication.summary}
        parent={{ href: czytelniaPath(), label: "Czytelnia" }}
      />
      {hasMeta || hasBody ? (
        <Section>
          <div className="measure">
            {authors.length > 0 ? (
              <p className="text-body">{authors.join(", ")}</p>
            ) : null}
            {methods.length > 0 ? (
              <p className={cn("text-small", authors.length > 0 && "mt-5")}>
                {methods.join(" · ")}
              </p>
            ) : null}
            {fileUrl ? (
              <CtaLink
                href={fileUrl}
                external
                className={cn(
                  (authors.length > 0 || methods.length > 0) && "mt-8",
                )}
              >
                {SUBPAGE.czytelnia.pdfCta}
              </CtaLink>
            ) : null}
            {hasBody ? (
              <div className={cn(hasMeta && "mt-8")}>
                <PortableBody value={publication.body} />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
    </>
  );
}
