import type { PortableContent, PublicationFormat } from "./sanity/types";

export type PublicationDestination = "page" | "file";

/**
 * A Czytelnia row opens a page when there is something to read or watch
 * on the site. An article or script whose work is the PDF opens the file.
 */
export function publicationDestination(input: {
  format: PublicationFormat | null;
  hasFile: boolean;
  hasVideo: boolean;
}): PublicationDestination {
  const { format, hasFile, hasVideo } = input;
  if (
    format === "books" ||
    format === "multimedia" ||
    hasVideo ||
    !hasFile
  ) {
    return "page";
  }
  if (format === "articles" || format === "scripts") return "file";
  return "page";
}

/** Listing lead. File rows use the body text so the blurb is not trapped on a page we do not render. */
export function publicationListLead(input: {
  destination: PublicationDestination;
  summary: string | null | undefined;
  bodyText: string | null | undefined;
}): string | null {
  const summary = input.summary?.trim() || "";
  if (input.destination === "file") {
    const body = input.bodyText?.trim() || "";
    return body || summary || null;
  }
  return summary || null;
}

function blockHasVideo(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  for (const block of value) {
    if (!block || typeof block !== "object") continue;
    const record = block as {
      _type?: string;
      columns?: { body?: unknown }[] | null;
    };
    if (record._type === "youtube") return true;
    if (record._type === "textColumns" && Array.isArray(record.columns)) {
      for (const column of record.columns) {
        if (blockHasVideo(column?.body)) return true;
      }
    }
  }
  return false;
}

/** True when Portable Text contains a YouTube block, including one inside Columns. */
export function portableBodyHasVideo(
  body: PortableContent | null | undefined,
): boolean {
  return blockHasVideo(body);
}
