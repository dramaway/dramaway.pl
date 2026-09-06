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
