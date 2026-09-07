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
 * Published-content client. Skip the Sanity HTTP CDN: it has its own ~60s
 * lag, which would undo on-demand revalidation after Studio publish.
 * Brochure traffic is well within the API quota; a read token is still only
 * needed if the dataset is later made private.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken || undefined,
  perspective: "published",
});
