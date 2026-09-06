import type { PortableContent } from "@/lib/sanity/types";

type PortableNode = {
  _type?: string;
  style?: string;
};

function nodes(value: PortableContent | null | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function asNode(value: unknown): PortableNode | null {
  if (typeof value !== "object" || value === null) return null;
  return value as PortableNode;
}

function isYoutube(value: unknown) {
  return asNode(value)?._type === "youtube";
}

function isHeading(value: unknown) {
  const node = asNode(value);
  return (
    node?._type === "block" &&
    (node.style === "h2" || node.style === "h3")
  );
}

function isH2(value: unknown) {
  const node = asNode(value);
  return node?._type === "block" && node.style === "h2";
}

type PortableSpan = { text?: string };

export function portableBlockText(value: unknown) {
  const node = asNode(value) as (PortableNode & { children?: PortableSpan[] }) | null;
  if (!node?.children) return "";
  return node.children.map((child) => child.text ?? "").join("");
}

type PortableBlockList = ReturnType<typeof nodes>;

export type PortableHeadingSection = {
  title: string;
  blocks: PortableBlockList;
};

/**
 * Split Portable Text into an optional preamble (blocks before the first h2)
 * and titled sections. The h2 itself becomes `title` and is omitted from
 * `blocks` so a fold trigger can reuse it without duplicating the heading.
 */
export function splitPortableByHeading(
  value: PortableContent | null | undefined,
) {
  const blocks = nodes(value);
  const preamble: PortableBlockList = [];
  const sections: PortableHeadingSection[] = [];
  let current: PortableHeadingSection | null = null;

  for (const block of blocks) {
    if (isH2(block)) {
      const title = portableBlockText(block).replace(/\s+/g, " ").trim();
      if (!title) {
        if (current) current.blocks.push(block);
        else preamble.push(block);
        continue;
      }
      if (current) sections.push(current);
      current = { title, blocks: [] };
      continue;
    }
    if (current) current.blocks.push(block);
    else preamble.push(block);
  }
  if (current) sections.push(current);

  return {
    preamble: preamble.length > 0 ? preamble : null,
    sections,
  };
}

function isParagraph(value: unknown) {
  const node = asNode(value);
  return node?._type === "block" && !isHeading(value);
}

const INTRO_PARAGRAPHS = 3;

/**
 * Peel a short intro and the first YouTube block off a Portable Text body
 * so a project page can open like the Figma frame instead of dumping HTML.
 */
export function splitIntroAndVideo(body: PortableContent | null | undefined) {
  const blocks = nodes(body);
  const youtube = blocks.find(isYoutube) ?? null;

  let cut = blocks.length;
  let paragraphs = 0;
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (isYoutube(block)) {
      cut = index;
      break;
    }
    if (isHeading(block) && index > 0) {
      cut = index;
      break;
    }
    if (isParagraph(block)) {
      paragraphs += 1;
      if (paragraphs >= INTRO_PARAGRAPHS) {
        cut = index + 1;
        break;
      }
    }
  }

  const intro = blocks
    .slice(0, cut)
    .filter((block) => !isYoutube(block));
  const rest = blocks.filter(
    (block, index) => index >= cut && block !== youtube,
  );

  return {
    intro: intro.length > 0 ? intro : null,
    youtube: youtube as PortableContent | null,
    rest: rest.length > 0 ? rest : null,
  };
}
