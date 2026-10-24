export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  subject: 160,
  message: 5000,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResult =
  | { status: "ok"; value: ContactInput }
  | { status: "spam" }
  | { status: "invalid" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Header fields must stay on one line (no header injection). */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

export function parseContact(body: unknown): ContactResult {
  if (!body || typeof body !== "object") return { status: "invalid" };
  const raw = body as Record<string, unknown>;

  if (text(raw.website)) return { status: "spam" };
  if (raw.consent !== true) return { status: "invalid" };

  const name = oneLine(text(raw.name));
  const email = text(raw.email);
  const subject = oneLine(text(raw.subject));
  const message = text(raw.message);

  if (!name || name.length > CONTACT_LIMITS.name) return { status: "invalid" };
  if (
    !email ||
    email.length > CONTACT_LIMITS.email ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { status: "invalid" };
  }
  if (subject.length > CONTACT_LIMITS.subject) return { status: "invalid" };
  if (!message || message.length > CONTACT_LIMITS.message) {
    return { status: "invalid" };
  }
  return { status: "ok", value: { name, email, subject, message } };
}

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
  from: string;
};

export function smtpConfig(
  env: NodeJS.ProcessEnv = process.env,
): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(env.SMTP_PORT) || 587;
  return {
    host,
    port,
    user,
    pass,
    to: env.CONTACT_TO?.trim() || "biuro@dramaway.pl",
    from: env.CONTACT_FROM?.trim() || user,
  };
}
