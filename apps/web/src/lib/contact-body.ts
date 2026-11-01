import type { PortableNode } from "@/lib/gallery";
import type { PortableContent } from "@/lib/sanity/types";

function isPortableNode(value: unknown): value is PortableNode {
  return Boolean(value && typeof value === "object");
}

function headingText(value: unknown) {
  if (!isPortableNode(value) || value._type !== "block") return null;
  if (!["h2", "h3", "h4"].includes(String(value.style))) return null;
  if (!Array.isArray(value.children)) return "";

  return value.children
    .map((child) => {
      if (!child || typeof child !== "object" || !("text" in child)) return "";
      return typeof child.text === "string" ? child.text : "";
    })
    .join("")
    .trim();
}

export function splitContactBody(value: PortableContent | null) {
  if (!value) return { direct: null, address: null };

  const blocks = Array.isArray(value) ? value : [value];
  const addressIndex = blocks.findIndex(
    (block) => headingText(block)?.toLocaleLowerCase("pl-PL") === "adres",
  );

  if (addressIndex < 0) return { direct: value, address: null };

  const direct = blocks.slice(0, addressIndex);
  const firstHeading = headingText(direct[0]);
  if (firstHeading?.toLocaleLowerCase("pl-PL").startsWith("napisz do nas")) {
    direct.shift();
  }

  return {
    direct: direct.length > 0 ? direct : null,
    address: blocks.slice(addressIndex),
  };
}
