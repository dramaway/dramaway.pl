import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from "@portabletext/react";
import Image from "next/image";
import { ImageGallery } from "@/components/visual/image-gallery";
import { Blob } from "@/components/visual/blob";
import { CtaLink } from "@/components/visual/cta-link";
import { ctaIndentLevel, resolveCtaButton, type CtaButtonInput } from "@/lib/cta-button";
import {
  groupPortableImageRuns,
  parseSanityImageDimensions,
  sanityAssetRef,
  type ImageGalleryNode,
  type PortableNode,
} from "@/lib/gallery";
import { splitRosterLine, splitRosterNames } from "@/lib/roster-line";
import { safeHref } from "@/lib/safe-url";
import type { PortableContent, SanityImage } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import { youtubeEmbedSrc } from "@/lib/sanity/youtube";
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
  asset?: { _ref?: string; _id?: string };
};

type YoutubeValue = { _type?: string; url?: string };

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
  const cdnWidth = BODY_IMAGE_CDN_WIDTH[size];
  const dims = parseSanityImageDimensions(sanityAssetRef(value));
  const alt = value.alt || "";

  return (
    <figure className={`body-figure body-figure-${size}`}>
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
  const src = value?.url ? youtubeEmbedSrc(value.url) : null;
  if (!src) return null;
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-md border">
      <iframe
        src={src}
        title="YouTube"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
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
        <div key={column._key ?? index} className="pt-column">
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

type RosterSpan = { text?: string };

function rosterLineText(value: { children?: RosterSpan[] } | undefined) {
  return (value?.children ?? []).map((child) => child.text ?? "").join("");
}

function RosterItem({ value }: { value?: { children?: RosterSpan[] } }) {
  const { role, names } = splitRosterLine(rosterLineText(value));
  const people = splitRosterNames(names);
  return (
    <div className={cn("pt-roster-row", !role && "pt-roster-row-plain")}>
      {role ? <dt className="pt-roster-role">{role}</dt> : null}
      <dd className="pt-roster-names">
        {people.map((person, index) => (
          <span key={`${person}-${index}`} className="pt-roster-name">
            {person}
          </span>
        ))}
      </dd>
    </div>
  );
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
    term: ({ children }) => (
      <p className="pt-term whitespace-pre-wrap">
        <Blob />
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-6">{children}</ol>
    ),
    indent: ({ children }) => <div className="pt-indent">{children}</div>,
    roster: ({ children }) => <dl className="pt-roster">{children}</dl>,
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
  },
};

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
  const blocks = groupPortableImageRuns(raw as PortableNode[]);
  return (
    <div
      className={cn(
        "portable-body mt-8 max-w-none space-y-4 text-lead",
        className,
      )}
    >
      <PortableText value={blocks} components={components} />
    </div>
  );
}
