/**
 * Cookie-free Umami Cloud, off unless a website id is set.
 *
 * The official snippet posts to https://gateway.umami.is/api/send and does
 * not set data-host-url. script-src allows the script origin. connect-src
 * allows that gateway. NEXT_PUBLIC_UMAMI_HOST_URL, when set, is passed as
 * data-host-url and replaces the gateway in connect-src.
 */

export const DEFAULT_UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** Where the cloud tracker posts when data-host-url is omitted. */
export const DEFAULT_UMAMI_COLLECT_ORIGIN = "https://gateway.umami.is";

/** Production hostname only. Preview (netlify.app) and localhost stay uncounted. */
export const UMAMI_TRACKED_DOMAINS = "fundacja.dramaway.pl";

export type UmamiSettings = {
  websiteId?: string;
  scriptUrl?: string;
  hostUrl?: string;
};

export type UmamiScript = {
  src: string;
  websiteId: string;
  domains: string;
};

function trimmed(value: string | undefined): string {
  return value?.trim() ?? "";
}

function httpsUrl(raw: string | undefined): URL | null {
  const value = trimmed(raw);
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  return url;
}

export function resolveUmamiScriptUrl(scriptUrl: string | undefined): string {
  return trimmed(scriptUrl) || DEFAULT_UMAMI_SCRIPT_URL;
}

/** https origin of the tracker script, or null when the tag must not render. */
export function umamiScriptOrigin(settings: UmamiSettings): string | null {
  if (!trimmed(settings.websiteId)) return null;
  return httpsUrl(resolveUmamiScriptUrl(settings.scriptUrl))?.origin ?? null;
}

/**
 * Value for data-host-url. Null means omit the attribute so the script
 * uses https://gateway.umami.is/api/send.
 */
export function umamiDataHostUrl(settings: UmamiSettings): string | null {
  if (!umamiScriptOrigin(settings)) return null;
  if (!httpsUrl(settings.hostUrl)) return null;
  return trimmed(settings.hostUrl);
}

/** Origin the browser will POST to, or null when analytics is off. */
export function umamiCollectOrigin(settings: UmamiSettings): string | null {
  if (!umamiScriptOrigin(settings)) return null;
  return httpsUrl(settings.hostUrl)?.origin ?? DEFAULT_UMAMI_COLLECT_ORIGIN;
}

export function umamiScript(settings: UmamiSettings): UmamiScript | null {
  const websiteId = trimmed(settings.websiteId);
  if (!websiteId || !umamiScriptOrigin(settings)) return null;
  return {
    src: resolveUmamiScriptUrl(settings.scriptUrl),
    websiteId,
    domains: UMAMI_TRACKED_DOMAINS,
  };
}
