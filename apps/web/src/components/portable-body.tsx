import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { PortableContent } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import { youtubeEmbedSrc } from "@/lib/sanity/youtube";

type BodyImageSize = "small" | "medium" | "wide";

const BODY_IMAGE_CDN_WIDTH: Record<BodyImageSize, number> = {
  small: 800,
  medium: 1200,
  wide: 1600,
};

type ImageValue = {
  _type?: string;
  alt?: string;
  size?: string;
  asset?: { _ref?: string; _id?: string };
};

type YoutubeValue = { _type?: string; url?: string };

function bodyImageSize(value: string | undefined): BodyImageSize {
  if (value === "small" || value === "medium" || value === "wide") {
    return value;
  }
  return "medium";
}

function PortableImage({ value }: PortableTextTypeComponentProps<ImageValue>) {
  if (!value?.asset) return null;
  const size = bodyImageSize(value.size);
  return (
    <figure className={`body-figure body-figure-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- body images have unknown aspect ratio */}
      <img
        src={urlFor(value).width(BODY_IMAGE_CDN_WIDTH[size]).url()}
        alt={value.alt || ""}
        className="body-image"
      />
    </figure>
  );
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
  const href = value?.href;
  if (!href) return <>{children}</>;
  const internal = href.startsWith("/") || href.startsWith("mailto:");
  return (
    <a
      href={href}
      className="underline underline-offset-2"
      {...(internal ? {} : { target: "_blank", rel: "noreferrer" })}
    >
      {children}
    </a>
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
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: PortableLink,
  },
  types: {
    image: PortableImage,
    youtube: PortableYoutube,
  },
};

export function PortableBody({ value }: { value: PortableContent }) {
  if (!value) return null;
  const blocks = Array.isArray(value) ? value : [value];
  if (blocks.length === 0) return null;
  return (
    <div className="portable-body mt-8 max-w-none space-y-4 text-lead">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
