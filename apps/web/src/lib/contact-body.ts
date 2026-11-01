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

function hasMailtoLink(value: unknown) {
  if (!isPortableNode(value) || !Array.isArray(value.markDefs)) return false;
  return value.markDefs.some(
    (mark) =>
      isPortableNode(mark) &&
      typeof mark.href === "string" &&
      mark.href.startsWith("mailto:"),
  );
}

export function splitContactBody(value: PortableContent | null) {
  if (!value) return { direct: null, people: [], address: null };

  const blocks = Array.isArray(value) ? value : [value];
  const addressIndex = blocks.findIndex(
    (block) => headingText(block)?.toLocaleLowerCase("pl-PL") === "adres",
  );

  if (addressIndex < 0) return { direct: value, people: [], address: null };

  const direct = blocks.slice(0, addressIndex);
  const firstHeading = headingText(direct[0]);
  if (firstHeading?.toLocaleLowerCase("pl-PL").startsWith("napisz do nas")) {
    direct.shift();
  }

  const peopleIndex = direct.findIndex(hasMailtoLink);
  const office = peopleIndex < 0 ? direct : direct.slice(0, peopleIndex);
  return {
    direct: office.length > 0 ? office : null,
    people: peopleIndex < 0 ? [] : direct.slice(peopleIndex),
    address: blocks.slice(addressIndex),
  };
}
