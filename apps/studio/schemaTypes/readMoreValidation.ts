/** Portable Text block types that count as real content around a read-more separator. */

type PortableSpan = { text?: string };

export type PortableBlockLike = {
  _type?: string;
  style?: string;
  children?: PortableSpan[];
  asset?: { _ref?: string; _id?: string };
  url?: string;
  label?: string;
  columns?: unknown[];
};

export function portableBlockText(block: PortableBlockLike): string {
  if (block._type !== "block" || !block.children) return "";
  return block.children.map((child) => child.text ?? "").join("");
}

export function isSubstantivePortableBlock(
  block: unknown,
): block is PortableBlockLike {
  if (typeof block !== "object" || block === null) return false;
  const node = block as PortableBlockLike;
  if (node._type === "readMoreBreak") return false;

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

export function validateReadMoreBreaks(blocks: unknown): true | string {
  if (!Array.isArray(blocks)) return true;

  const indices: number[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as PortableBlockLike | undefined;
    if (block?._type === "readMoreBreak") indices.push(i);
  }

  if (indices.length === 0) return true;
  if (indices.length > 1) {
    return "Można dodać tylko jeden separator „Czytaj więcej” w treści.";
  }

  const index = indices[0]!;
  const last = blocks.length - 1;
  if (index === 0) {
    return "Separator nie może być na początku treści — wstaw go w środku artykułu.";
  }
  if (index === last) {
    return "Separator nie może być na końcu treści — poniżej musi zostać ukryta część.";
  }

  const before = blocks.slice(0, index);
  const after = blocks.slice(index + 1);
  const hasBefore = before.some(isSubstantivePortableBlock);
  const hasAfter = after.some(isSubstantivePortableBlock);

  if (!hasBefore || !hasAfter) {
    return "Separator musi mieć akapit lub inny blok przed sobą i po sobie.";
  }

  return true;
}
