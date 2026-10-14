export type NewsletterSubscribeResult =
  | { status: "invalid" }
  | { status: "unconfigured" };

/** Missing CMS value keeps the footer form visible. Only explicit false hides it. */
export function isNewsletterEnabled(
  enabled: boolean | null | undefined,
): boolean {
  return enabled !== false;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNewsletterEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (!email || email.length > 254) return false;
  return EMAIL_PATTERN.test(email);
}

/** Both secrets must be set before a later change can call MailerLite. */
export function mailerLiteConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const key = env.MAILERLITE_API_KEY?.trim();
  const group = env.MAILERLITE_GROUP_ID?.trim();
  return Boolean(key && group);
}

/**
 * Validates the address and stops. MailerLite is not called, even when the
 * API key and group id are already in the environment.
 */
export function subscribeNewsletter(
  email: unknown,
): NewsletterSubscribeResult {
  if (!isNewsletterEmail(email)) return { status: "invalid" };
  return { status: "unconfigured" };
}
