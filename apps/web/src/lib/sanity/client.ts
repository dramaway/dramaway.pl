import "server-only";

import { createClient } from "@sanity/client";
import {
  apiVersion,
  assertSanityConfig,
  dataset,
  projectId,
  readToken,
} from "./env";

assertSanityConfig();

/**
 * Published-content client. Public dataset → CDN, no token.
 * If SANITY_API_READ_TOKEN is set (private dataset), skip the CDN.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken || undefined,
  perspective: "published",
});
