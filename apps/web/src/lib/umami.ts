/**
 * Cookie-free Umami Cloud, off unless a website id is set.
 *
 * The cloud tracker posts to https://gateway.umami.is/api/send unless
 * data-host-url says otherwise. We point that attribute at the script
 * origin so CSP script-src and connect-src share one host from
 * NEXT_PUBLIC_UMAMI_SCRIPT_URL.
 */

export const DEFAULT_UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** Production hostname only. Preview (netlify.app) and localhost stay uncounted. */
export const UMAMI_TRACKED_DOMAINS = "fundacja.dramaway.pl";

export type UmamiSettings = {
  websiteId?: string;
  scriptUrl?: string;
};

export type UmamiScript = {
  src: string;
  websiteId: string;
  domains: string;
  hostUrl: string;
};

function trimmed(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function resolveUmamiScriptUrl(scriptUrl: string | undefined): string {
  return trimmed(scriptUrl) || DEFAULT_UMAMI_SCRIPT_URL;
}

/** https origin of the script, or null when the tag must not render. */
export function umamiCollectOrigin(settings: UmamiSettings): string | null {
  if (!trimmed(settings.websiteId)) return null;
  let url: URL;
  try {
    url = new URL(resolveUmamiScriptUrl(settings.scriptUrl));
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  return url.origin;
}

export function umamiScript(settings: UmamiSettings): UmamiScript | null {
  const websiteId = trimmed(settings.websiteId);
  const hostUrl = umamiCollectOrigin(settings);
  if (!websiteId || !hostUrl) return null;
  return {
    src: resolveUmamiScriptUrl(settings.scriptUrl),
    websiteId,
    domains: UMAMI_TRACKED_DOMAINS,
    hostUrl,
  };
}
