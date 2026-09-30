import type { PortableContent } from "@/lib/sanity/types";

export const READ_MORE_BREAK_TYPE = "readMoreBreak";

type PortableSpan = { text?: string };

export type PortableBlockLike = {
  _type?: string;
  children?: PortableSpan[];
  asset?: { _ref?: string; _id?: string };
  url?: string;
  label?: string;
  columns?: unknown[];
};

function nodes(value: PortableContent | null | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function portableBlockText(block: PortableBlockLike): string {
  if (block._type !== "block" || !block.children) return "";
  return block.children.map((child) => child.text ?? "").join("");
}

export function isSubstantivePortableBlock(block: unknown): block is PortableBlockLike {
  if (typeof block !== "object" || block === null) return false;
  const node = block as PortableBlockLike;
  if (node._type === READ_MORE_BREAK_TYPE) return false;

  if (node._type === "block") {
    return portableBlockText(node).trim().length > 0;
  }
  if (node._type === "image") {
    return Boolean(node.asset?._ref || node.asset?._id);
  }
  if (node._type === "youtube") {
    return Boolean(node.url?.trim());
  }
  if (node._type === "textColumns") {
    return Array.isArray(node.columns) && node.columns.length > 0;
  }
  if (node._type === "ctaButton") {
    return Boolean(node.label?.trim());
  }
  return false;
}

export type PortableReadMoreSplit = {
  before: PortableContent;
  after: PortableContent;
};

/**
 * Split body blocks at a single read-more marker. Returns null when there is
 * no marker, or when data is invalid (multiple markers) — render full body.
 */
export function splitPortableAtReadMore(
  value: PortableContent | null | undefined,
): PortableReadMoreSplit | null {
  const blocks = nodes(value);
  if (blocks.length === 0) return null;

  const indices: number[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as PortableBlockLike | undefined;
    if (block?._type === READ_MORE_BREAK_TYPE) indices.push(i);
  }

  if (indices.length !== 1) return null;

  const index = indices[0]!;
  const before = blocks.slice(0, index);
  const after = blocks.slice(index + 1);

  if (
    !before.some(isSubstantivePortableBlock) ||
    !after.some(isSubstantivePortableBlock)
  ) {
    return null;
  }

  return { before, after };
}
