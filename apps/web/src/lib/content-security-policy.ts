import {
  umamiCollectOrigin,
  umamiScriptOrigin,
  type UmamiSettings,
} from "./umami";

export type ContentSecurityPolicyEnv = UmamiSettings & {
  nodeEnv?: string;
};

function sources(directive: string, values: Array<string | null>): string {
  return `${directive} ${values.filter((value): value is string => Boolean(value)).join(" ")}`;
}

/**
 * CSP for the public site. Umami hosts are added only when a website id is
 * set: the script origin on script-src, and the collect origin on connect-src.
 */
export function contentSecurityPolicy(env: ContentSecurityPolicyEnv): string {
  const scriptOrigin = umamiScriptOrigin(env);
  const collectOrigin = umamiCollectOrigin(env);
  const directives = [
    "default-src 'self'",
    sources("script-src", ["'self'", "'unsafe-inline'", "'unsafe-eval'", scriptOrigin]),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://i.ytimg.com https://*.ytimg.com https://*.netlify.app https://*.dramaway.pl https://*.fundacja.dramaway.pl https://dramaway.pl https://fundacja.dramaway.pl https://www.fundacja.dramaway.pl https://centrum.dramaway.pl",
    "media-src 'self' blob: https://cdn.sanity.io https://*.sanity.io https://*.dramaway.pl https://dramaway.pl https://fundacja.dramaway.pl https://www.fundacja.dramaway.pl",
    "font-src 'self'",
    sources("connect-src", [
      "'self'",
      "ws:",
      "wss:",
      "https://cdn.sanity.io",
      "https://*.sanity.io",
      "https://*.netlify.app",
      "https://*.dramaway.pl",
      "https://dramaway.pl",
      "https://fundacja.dramaway.pl",
      "https://centrum.dramaway.pl",
      collectOrigin,
    ]),
    "frame-src https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  if (env.nodeEnv === "production") {
    directives.push("upgrade-insecure-requests");
  }
  return directives.join("; ");
}
