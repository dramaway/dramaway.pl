import {
  PortableText,
  type PortableTextComponents,
  type PortableTextTypeComponentProps,
} from "@portabletext/react";
import type { PortableContent } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

type ImageValue = {
  _type?: string;
  alt?: string;
  asset?: { _ref?: string; _id?: string };
};

function PortableImage({ value }: PortableTextTypeComponentProps<ImageValue>) {
  if (!value?.asset) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- body images have unknown aspect ratio
    <img
      src={urlFor(value).width(1200).url()}
      alt={value.alt || ""}
      className="my-6 h-auto w-full"
    />
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-semibold">{children}</h3>
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
  types: {
    image: PortableImage,
  },
};

export function PortableBody({ value }: { value: PortableContent }) {
  if (!value) return null;
  const blocks = Array.isArray(value) ? value : [value];
  if (blocks.length === 0) return null;
  return (
    <div className="mt-8 max-w-none space-y-4 text-base leading-relaxed">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
