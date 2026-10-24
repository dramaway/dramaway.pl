import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from "@portabletext/react";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { ImageGallery } from "@/components/visual/image-gallery";
import { categoryToneForTerm } from "@/lib/category-tones";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { CreditsList, type CreditsValue } from "@/components/visual/credits-list";
import { Roster, RosterRow } from "@/components/visual/roster";
import { ctaIndentLevel, resolveCtaButton, type CtaButtonInput } from "@/lib/cta-button";
import {
  groupPortableImageRuns,
  parseSanityImageDimensions,
  sanityAssetRef,
  type ImageGalleryNode,
  type PortableNode,
} from "@/lib/gallery";
import {
  groupRosterNameSpans,
  splitRosterSpanLine,
  type RosterSpan,
} from "@/lib/roster-line";
import { safeHref } from "@/lib/safe-url";
import type { PortableContent, SanityImage } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import { BodyReadMore } from "@/components/visual/body-read-more";
import { YoutubeEmbed } from "@/components/visual/youtube-embed";
import { splitPortableAtReadMore } from "@/lib/portable-read-more";
import { blockAlign, embedSize, type BlockAlign } from "@/lib/body-frame";
import { cn } from "@/lib/utils";

type BodyImageSize = "small" | "medium" | "wide";

const BODY_IMAGE_CDN_WIDTH: Record<BodyImageSize, number> = {
  small: 800,
  medium: 1200,
  wide: 1600,
};

const BODY_IMAGE_SIZES: Record<BodyImageSize, string> = {
  small: "(min-width: 24rem) 24rem, 100vw",
  medium: "(min-width: 48rem) 40rem, 100vw",
  wide: "(min-width: 75rem) 74rem, 100vw",
};

const BODY_IMAGE_SRCSET_WIDTHS = [400, 800, 1200, 1600] as const;

type ImageValue = {
  _type?: string;
  alt?: string;
  size?: string;
  align?: string;
  layout?: string;
  asset?: { _ref?: string; _id?: string };
};

type YoutubeValue = { _type?: string; url?: string; size?: string; align?: string };

type ColumnValue = {
  _key?: string;
  body?: PortableContent;
};

type ColumnsValue = {
  _type?: string;
  columns?: ColumnValue[];
};

function bodyImageSize(value: string | undefined): BodyImageSize {
  if (value === "small" || value === "medium" || value === "wide") {
    return value;
  }
  return "medium";
}

/** Wrap only beside a left or right picture that is not breaking out of the column. */
function bodyImageWraps(
  layout: string | undefined,
  size: BodyImageSize,
  align: BlockAlign,
): boolean {
  return layout === "inline" && size !== "wide" && align !== "center";
}

function bodyImageSrcSet(value: ImageValue, size: BodyImageSize): string {
  const max = BODY_IMAGE_CDN_WIDTH[size];
  return BODY_IMAGE_SRCSET_WIDTHS.filter(
    (width) => width <= max || width === BODY_IMAGE_SRCSET_WIDTHS[0],
  )
    .map((width) => `${urlFor(value).width(width).auto("format").url()} ${width}w`)
    .join(", ");
}

function PortableImage({ value }: PortableTextTypeComponentProps<ImageValue>) {
  if (!value?.asset) return null;
  const size = bodyImageSize(value.size);
  const align = blockAlign(value.align);
  const wraps = bodyImageWraps(value.layout, size, align);
  const cdnWidth = BODY_IMAGE_CDN_WIDTH[size];
  const dims = parseSanityImageDimensions(sanityAssetRef(value));
  const alt = value.alt || "";

  return (
    <figure
      className={cn(
        "body-figure",
        `body-figure-${size}`,
        `body-figure-${align}`,
        wraps && "body-figure-inline",
      )}
    >
      {dims ? (
        <Image
          src={urlFor(value).width(cdnWidth).auto("format").url()}
          alt={alt}
          width={dims.width}
          height={dims.height}
          sizes={BODY_IMAGE_SIZES[size]}
          className="body-image"
        />
      ) : (
        // Unknown aspect: keep intrinsic ratio; srcset still avoids a single huge file.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(value).width(cdnWidth).auto("format").url()}
          srcSet={bodyImageSrcSet(value, size)}
          sizes={BODY_IMAGE_SIZES[size]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="body-image"
        />
      )}
    </figure>
  );
}

function PortableImageGallery({
  value,
}: PortableTextTypeComponentProps<ImageGalleryNode>) {
  const images = value.images ?? [];
  if (images.length === 0) return null;
  return <ImageGallery images={images as SanityImage[]} alt="" />;
}

function PortableYoutube({
  value,
}: PortableTextTypeComponentProps<YoutubeValue>) {
  if (!value?.url) return null;
  const size = embedSize(value.size);
  return (
    <YoutubeEmbed
      url={value.url}
      className={cn(
        size === "full" ? "pt-embed-full" : "pt-embed-medium",
        `pt-embed-${blockAlign(value.align)}`,
      )}
    />
  );
}

function PortableLink({
  children,
  value,
}: PortableTextMarkComponentProps<{ _type: string; href?: string }>) {
  const safe = safeHref(value?.href);
  if (!safe) return <>{children}</>;
  const newTab = safe.kind === "http";
  return (
    <a
      href={safe.href}
      className="underline underline-offset-2"
      {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function PortableCta({
  value,
}: PortableTextTypeComponentProps<CtaButtonInput>) {
  const cta = resolveCtaButton(value);
  if (!cta) return null;
  const indent = ctaIndentLevel(value?.indent);
  return (
    <div className={cn("pt-cta", indent > 0 && `pt-cta-${indent}`)}>
      <CtaLink href={cta.href}>{cta.label}</CtaLink>
    </div>
  );
}

function PortableColumns({
  value,
}: PortableTextTypeComponentProps<ColumnsValue>) {
  const columns = (value.columns ?? []).slice(0, 3);
  if (columns.length === 0) return null;
  const layout = columns.length >= 3 ? "3" : columns.length === 2 ? "2" : "1";
  return (
    <div className={`pt-columns pt-columns-${layout}`}>
      {columns.map((column, index) => (
        <div
          key={column._key ?? index}
          className="pt-column portable-body space-y-4"
        >
          {hasPortableContent(column.body) ? (
            <PortableText
              value={
                Array.isArray(column.body) ? column.body : [column.body]
              }
              components={components}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

type RosterMarkDef = { _key?: string; _type?: string; href?: string };

function RosterItem({
  value,
}: {
  value?: { children?: RosterSpan[]; markDefs?: RosterMarkDef[] };
}) {
  const { role, nameSpans } = splitRosterSpanLine(value?.children ?? []);
  const markDefs = value?.markDefs ?? [];
  const people = groupRosterNameSpans(nameSpans).map((group, index) => (
    <Fragment key={index}>
      {group.map((span, spanIndex) => (
        <Fragment key={span._key ?? spanIndex}>
          {renderRosterSpan(span, markDefs)}
        </Fragment>
      ))}
    </Fragment>
  ));
  return <RosterRow role={role} people={people} />;
}

function renderRosterSpan(span: RosterSpan, markDefs: readonly RosterMarkDef[]) {
  let node: ReactNode = span.text ?? "";
  const marks = span.marks ?? [];
  if (marks.includes("em")) node = <em>{node}</em>;
  if (marks.includes("strong")) node = <strong>{node}</strong>;
  const link = markDefs.find(
    (def) => def._type === "link" && def._key && marks.includes(def._key),
  );
  const safe = safeHref(link?.href);
  if (!safe) return node;
  const newTab = safe.kind === "http";
  return (
    <a
      href={safe.href}
      className="underline underline-offset-2"
      {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {node}
    </a>
  );
}

function PortableCredits({
  value,
}: PortableTextTypeComponentProps<CreditsValue>) {
  return <CreditsList value={value} />;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-h2 font-black">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-display text-h3 font-black">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="whitespace-pre-wrap">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    term: ({ children, value }) => {
      const text = (value?.children ?? [])
        .map((child) => ("text" in child ? String(child.text ?? "") : ""))
        .join("");
      const tone = categoryToneForTerm(text);
      return (
      <p
        className="pt-term whitespace-pre-wrap"
        data-tone={tone ?? undefined}
      >
        <Blob />
        {children}
      </p>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-6">{children}</ol>
    ),
    indent: ({ children }) => <div className="pt-indent">{children}</div>,
    roster: ({ children }) => <Roster>{children}</Roster>,
  },
  listItem: {
    indent: ({ children }) => <div className="pt-indent-item">{children}</div>,
    roster: ({ value }) => <RosterItem value={value} />,
  },
  marks: {
    link: PortableLink,
  },
  types: {
    image: PortableImage,
    imageGallery: PortableImageGallery,
    youtube: PortableYoutube,
    textColumns: PortableColumns,
    ctaButton: PortableCta,
    credits: PortableCredits,
    readMoreBreak: () => null,
  },
};

function renderPortableBlocks(blocks: PortableNode[]) {
  const grouped = groupPortableImageRuns(blocks);
  return <PortableText value={grouped} components={components} />;
}

export function hasPortableContent(value: PortableContent | null | undefined) {
  if (!value) return false;
  const blocks = Array.isArray(value) ? value : [value];
  return blocks.length > 0;
}

export function PortableBody({
  value,
  className,
}: {
  value: PortableContent;
  className?: string;
}) {
  if (!hasPortableContent(value)) return null;
  const raw = Array.isArray(value) ? value : [value];
  const split = splitPortableAtReadMore(value);
  // No size class here: long copy inherits `text-body` (18 px) from `body`,
  // so anything a redactor adds gets the running-text size for free.
  const shell = cn("portable-body mt-8 max-w-none space-y-4", className);

  if (!split) {
    return (
      <div className={shell}>{renderPortableBlocks(raw as PortableNode[])}</div>
    );
  }

  return (
    <div className={shell}>
      <BodyReadMore
        before={renderPortableBlocks(split.before as PortableNode[])}
      >
        {renderPortableBlocks(split.after as PortableNode[])}
      </BodyReadMore>
    </div>
  );
}
