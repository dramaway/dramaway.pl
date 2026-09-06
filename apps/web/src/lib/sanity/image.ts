import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** True when CMS actually picked an image — not an empty field or a stub. */
export function hasHeroImage(
  image: SanityImage | null | undefined,
): image is SanityImage {
  if (!image || typeof image !== "object") return false;
  return "asset" in image && image.asset != null;
}
