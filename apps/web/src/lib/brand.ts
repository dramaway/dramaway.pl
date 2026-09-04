import type { Metadata } from "next";
import { urlFor } from "@/lib/sanity/image";
import type { SanityFile, SanityImage, SiteSettings } from "@/lib/sanity/types";

/** Built-in files in `public/brand`. CMS fields override when filled. */
export const DEFAULT_BRAND = {
  svg: "/brand/icon.svg",
  ico: "/favicon.ico",
  apple: "/brand/apple-icon.png",
  png192: "/brand/icon-192.png",
  png512: "/brand/icon-512.png",
  manifest: "/brand/site.webmanifest",
} as const;

function fileUrl(file: SanityFile | null | undefined): string | null {
  const url = file?.asset?.url?.trim();
  return url || null;
}

function imageUrl(
  image: SanityImage | null | undefined,
  width: number,
): string | null {
  if (!image) return null;
  try {
    return urlFor(image).width(width).fit("max").url();
  } catch {
    return null;
  }
}

type IconLink = {
  url: string;
  type?: string;
  sizes?: string;
  media?: string;
};

/**
 * Tab icon: SVG (prefers-color-scheme inside the file) plus optional PNG
 * pair from Studio for browsers that ignore SVG. Apple / PWA / OG are
 * separate — they do not follow the tab chrome colour.
 */
export function brandMetadata(settings: SiteSettings | null): Metadata {
  const branding = settings?.branding;
  const svg = fileUrl(branding?.faviconSvg) ?? DEFAULT_BRAND.svg;
  const lightPng = imageUrl(branding?.faviconLight, 192);
  const darkPng = imageUrl(branding?.faviconDark, 192);
  const apple = imageUrl(branding?.appleTouchIcon, 180) ?? DEFAULT_BRAND.apple;
  const appIcon = imageUrl(branding?.appIcon, 512);
  const share = imageUrl(branding?.shareImage, 1200);

  const icon: IconLink[] = [
    { url: svg, type: "image/svg+xml", sizes: "any" },
  ];
  if (lightPng) {
    icon.push({
      url: lightPng,
      type: "image/png",
      media: "(prefers-color-scheme: light)",
    });
  }
  if (darkPng) {
    icon.push({
      url: darkPng,
      type: "image/png",
      media: "(prefers-color-scheme: dark)",
    });
  }
  if (!darkPng) {
    icon.push({
      url: DEFAULT_BRAND.png192,
      type: "image/png",
      media: "(prefers-color-scheme: dark)",
    });
  }
  icon.push({ url: DEFAULT_BRAND.ico, sizes: "32x32" });

  const metadata: Metadata = {
    icons: {
      icon,
      apple: [{ url: apple, sizes: "180x180" }],
    },
    manifest: DEFAULT_BRAND.manifest,
  };

  if (share) {
    metadata.openGraph = { images: [{ url: share, width: 1200 }] };
    metadata.twitter = { card: "summary_large_image", images: [share] };
  } else if (appIcon) {
    metadata.openGraph = {
      images: [{ url: appIcon, width: 512, height: 512 }],
    };
    metadata.twitter = { card: "summary", images: [appIcon] };
  }

  return metadata;
}
