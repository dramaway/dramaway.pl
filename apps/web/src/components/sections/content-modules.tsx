import { Fragment, type ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { ContentTile } from "@/components/sections/content-tile";
import { HomeNews, type HomeNewsItem } from "@/components/sections/home-news";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { PaletteRow } from "@/components/visual/palette-row";
import { publicPathForPageSlug } from "@/lib/routes";
import { getHomepageNews } from "@/lib/sanity/fetch";
import type { ResolvedSection } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

type ContentModulesProps = {
  sections: ResolvedSection[];
  /** `home` paints the homepage rhythm (bands + palette). `page` is quieter. */
  variant: "home" | "page";
};

type PlacedModule = Extract<ResolvedSection, { kind: "module" }> & {
  imageOnLeft: boolean;
};
type PlacedSection = Extract<ResolvedSection, { kind: "news" }> | PlacedModule;

function place(sections: ResolvedSection[]): PlacedSection[] {
  let images = 0;
  return sections.map((section) => {
    if (section.kind !== "module") return section;
    if (!section.image) return { ...section, imageOnLeft: false };
    const imageOnLeft = images % 2 === 0;
    images += 1;
    return { ...section, imageOnLeft };
  });
}

function isTextList(section: PlacedSection): boolean {
  return section.kind === "module" && !section.image && section.textLayout === "list";
}

function ModuleView({
  section,
  news,
}: {
  section: PlacedSection;
  news: HomeNewsItem[];
}) {
  if (section.kind === "news") {
    return (
      <HomeNews
        items={news}
        heading={section.heading}
        headingId={`news-${section.key}`}
      />
    );
  }

  const clamp = section.tiles.length >= 2;

  if (section.image) {
    const solo = section.tiles.length === 1;
    return (
      <section
        className={cn(
          "split content-split",
          section.imageOnLeft && "split-reverse",
          solo && "content-split-solo",
        )}
      >
        <div className="split-text">
          <div className={solo ? undefined : "stack"}>
            {section.tiles.map((tile) => (
              <div
                key={tile.key}
                className={cn("stack-item", tile.href && "card-hover")}
              >
                <ContentTile tile={tile} clamp={clamp} />
              </div>
            ))}
          </div>
        </div>
        <Media
          image={section.image}
          alt={section.imageAlt}
          variant="bleed"
          ratio="portrait"
          sizes="(min-width: 64rem) 34vw, 100vw"
          className="split-media"
        />
      </section>
    );
  }

  if (section.textLayout === "list") {
    return (
      <Section>
        <div className="stack stack-narrow">
          {section.tiles.map((tile) => (
            <div
              key={tile.key}
              className={cn("stack-item", tile.href && "card-hover")}
            >
              <ContentTile tile={tile} clamp={clamp} />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <ul className="cols-3">
        {section.tiles.map((tile) => (
          <li
            key={tile.key}
            className={cn("news-card relative isolate", tile.href && "card-hover")}
          >
            <ContentTile tile={tile} clamp={clamp} heading="h3" layout="card" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function HomeRhythm({
  sections,
  news,
}: {
  sections: ResolvedSection[];
  news: HomeNewsItem[];
}) {
  const placed = place(sections);
  const blocks: ReactNode[] = [<DotBand key="after-hero" />];
  let paletteBeforeList = false;

  placed.forEach((section, index) => {
    if (isTextList(section) && !paletteBeforeList) {
      blocks.push(
        <div key={`palette-before-${section.key}`} className="page py-section">
          <PaletteRow />
        </div>,
      );
      paletteBeforeList = true;
    }

    blocks.push(<ModuleView key={section.key} section={section} news={news} />);

    const next = placed[index + 1];
    if (!next) return;
    const hasImage = section.kind === "module" && Boolean(section.image);
    const nextIsFirstList = isTextList(next) && !paletteBeforeList;
    if (hasImage || !nextIsFirstList) {
      const imageOnLeft =
        section.kind === "module" && section.imageOnLeft && hasImage;
      blocks.push(
        <DotBand key={`band-${section.key}`} mirror={imageOnLeft} />,
      );
    }
  });

  blocks.push(
    <div key="palette-end" className="page pb-section">
      <PaletteRow />
    </div>,
  );

  return <>{blocks}</>;
}

function PageRhythm({
  sections,
  news,
}: {
  sections: ResolvedSection[];
  news: HomeNewsItem[];
}) {
  const placed = place(sections);
  return placed.map((section, index) => {
    const next = placed[index + 1];
    const hasImage = section.kind === "module" && Boolean(section.image);
    const imageOnLeft = section.kind === "module" && section.imageOnLeft;
    return (
      <Fragment key={section.key}>
        <ModuleView section={section} news={news} />
        {next && hasImage ? <DotBand mirror={imageOnLeft} /> : null}
      </Fragment>
    );
  });
}

function newsItems(
  pages: Awaited<ReturnType<typeof getHomepageNews>>,
): HomeNewsItem[] {
  return pages.map((item) => ({
    _id: item._id,
    title: item.title.replace(/^\[Aktualność\]\s*/i, "").trim(),
    href: publicPathForPageSlug(item.slug),
    excerpt: item.excerpt?.trim() || null,
    publishedAt: item.publishedAt?.trim() || null,
  }));
}

export async function ContentModules({ sections, variant }: ContentModulesProps) {
  if (variant === "page" && sections.length === 0) return null;
  const needsNews = sections.some((section) => section.kind === "news");
  const news = needsNews ? newsItems(await getHomepageNews()) : [];
  if (variant === "home") return <HomeRhythm sections={sections} news={news} />;
  return <PageRhythm sections={sections} news={news} />;
}
