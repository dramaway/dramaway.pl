import { cmsText } from "./cms-text";
import type { CmsFooterLink, FooterLink, FooterLinkService } from "./sanity/types";

/**
 * Profile URL per service, from a bare handle. A full http(s) URL in the
 * CMS skips the template. Keep ids in sync with
 * `apps/studio/schemaTypes/footerLink.ts`.
 */
const PROFILE_URL: Record<string, (handle: string) => string> = {
  facebook: (h) => `https://www.facebook.com/${h}`,
  instagram: (h) => `https://www.instagram.com/${h}`,
  youtube: (h) => `https://www.youtube.com/@${h}`,
  tiktok: (h) => `https://www.tiktok.com/@${h}`,
  linkedin: (h) => `https://www.linkedin.com/company/${h}`,
  x: (h) => `https://x.com/${h}`,
  threads: (h) => `https://www.threads.net/@${h}`,
  bluesky: (h) => `https://bsky.app/profile/${h}`,
  vimeo: (h) => `https://vimeo.com/${h}`,
  spotify: (h) => `https://open.spotify.com/${h}`,
};

export const FOOTER_LINK_NAMES: Record<FooterLinkService, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  threads: "Threads",
  bluesky: "Bluesky",
  vimeo: "Vimeo",
  spotify: "Spotify",
  email: "E-mail",
  phone: "Telefon",
  custom: "Link",
};

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const PHONE_RE = /^\+?[\d\s().-]{5,}$/;
const HANDLE_RE = /^[\w.\-/]+$/u;

function isService(value: string | null | undefined): value is FooterLinkService {
  return Boolean(value && value in FOOTER_LINK_NAMES);
}

function httpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function hrefFor(service: FooterLinkService, value: string): string | null {
  if (service === "email") {
    const email = value.replace(/^mailto:/i, "");
    return EMAIL_RE.test(email) ? `mailto:${email}` : null;
  }
  if (service === "phone") {
    const phone = value.replace(/^tel:/i, "");
    return PHONE_RE.test(phone) ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
  }
  const url = httpUrl(value);
  if (url || service === "custom") return url;
  const handle = value.replace(/^@/, "");
  if (!HANDLE_RE.test(handle)) return null;
  return PROFILE_URL[service](handle);
}

function visibleText(
  service: FooterLinkService,
  value: string,
  label: string | null,
): string | null {
  if (label) return label;
  if (service === "email") return value.replace(/^mailto:/i, "");
  if (service === "phone") return value.replace(/^tel:/i, "");
  return null;
}

/** Raw SVG keeps its paths; a raster goes through the CDN at 2× the glyph. */
function iconUrl(icon: CmsFooterLink["icon"]): string | null {
  const url = icon?.asset?.url;
  if (!url) return null;
  return icon.asset?.mimeType === "image/svg+xml" ? url : `${url}?w=64&h=64&fit=max`;
}

/** Bad or empty rows drop out instead of breaking the footer. */
export function resolveFooterLinks(
  links: CmsFooterLink[] | null | undefined,
): FooterLink[] {
  if (!Array.isArray(links)) return [];
  return links.flatMap((link, index) => {
    const service = link?.service;
    const value = cmsText(link?.value);
    if (!isService(service) || !value) return [];
    const href = hrefFor(service, value);
    if (!href) return [];
    const label = cmsText(link.label);
    const text = visibleText(service, value, label);
    const name =
      service === "custom" ? new URL(href).hostname : FOOTER_LINK_NAMES[service];
    return [
      {
        key: link._key || `${service}-${index}`,
        service,
        href,
        text,
        ariaLabel: label ? `${label} (${name})` : name,
        external: href.startsWith("http"),
        iconUrl: service === "custom" ? iconUrl(link.icon) : null,
      },
    ];
  });
}
