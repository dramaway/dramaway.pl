import { DEFAULT_CENTRUM_URL } from "./routes";
import { getSiteSettings } from "./sanity/fetch";

export const FALLBACK_SITE_TITLE = "Fundacja Drama Way";

export async function getResolvedSite() {
  const settings = await getSiteSettings();
  return {
    title: settings?.title?.trim() || FALLBACK_SITE_TITLE,
    tagline: settings?.tagline?.trim() || null,
    centrumUrl: settings?.centrumUrl?.trim() || DEFAULT_CENTRUM_URL,
    footerNote: settings?.footerNote?.trim() || null,
  };
}
