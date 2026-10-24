import { Fragment, type ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { ContentTile } from "@/components/sections/content-tile";
import { HomeNews } from "@/components/sections/home-news";
import { DotBand } from "@/components/visual/dot-band";
import { Media } from "@/components/visual/media";
import { PaletteRow } from "@/components/visual/palette-row";
import { selectFeedItems, toFeedCandidates, type FeedCandidate } from "@/lib/content-sections";
import { getContentFeed } from "@/lib/sanity/fetch";
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
  feed,
}: {
  section: PlacedSection;
  feed: FeedCandidate[];
}) {
  if (section.kind === "news") {
    const items = selectFeedItems(feed, section).map((item) => ({
      _id: item.id,
      title: item.title,
      href: item.href,
      excerpt: item.excerpt,
      publishedAt: item.createdAt,
      ctaLabel: item.ctaLabel,
      ctaHref: item.ctaHref,
    }));
    return (
      <HomeNews
        items={items}
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
        <div className="split-media-frame">
          <Media
            image={section.image}
            alt={section.imageAlt}
            variant="bleed"
            ratio="portrait"
            sizes="(min-width: 64rem) 34vw, 100vw"
            className="split-media"
          />
        </div>
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
  feed,
}: {
  sections: ResolvedSection[];
  feed: FeedCandidate[];
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

    blocks.push(<ModuleView key={section.key} section={section} feed={feed} />);

    const next = placed[index + 1];
    if (!next) return;
    const hasImage = section.kind === "module" && Boolean(section.image);
    const nextIsFirstList = isTextList(next) && !paletteBeforeList;
    if (hasImage || !nextIsFirstList) {
      blocks.push(<DotBand key={`band-${section.key}`} />);
    }
  });

  blocks.push(<DotBand key="before-footer" />);

  return <>{blocks}</>;
}

function PageRhythm({
  sections,
  feed,
}: {
  sections: ResolvedSection[];
  feed: FeedCandidate[];
}) {
  const placed = place(sections);
  return placed.map((section, index) => {
    const next = placed[index + 1];
    const hasImage = section.kind === "module" && Boolean(section.image);
    return (
      <Fragment key={section.key}>
        <ModuleView section={section} feed={feed} />
        {next && hasImage ? <DotBand /> : null}
      </Fragment>
    );
  });
}

export async function ContentModules({ sections, variant }: ContentModulesProps) {
  if (variant === "page" && sections.length === 0) return null;
  const needsFeed = sections.some((section) => section.kind === "news");
  const feed = needsFeed ? toFeedCandidates(await getContentFeed()) : [];
  if (variant === "home") return <HomeRhythm sections={sections} feed={feed} />;
  return <PageRhythm sections={sections} feed={feed} />;
}
