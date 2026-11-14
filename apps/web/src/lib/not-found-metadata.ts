import type { Metadata } from "next";
import { SUBPAGE } from "./subpage-copy";

/** Document title for every not-found response, including routes that call notFound(). */
export const notFoundMetadata: Metadata = {
  title: { absolute: SUBPAGE.notFound.documentTitle },
};
