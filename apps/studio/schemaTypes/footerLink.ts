import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { LinkIcon } from "@sanity/icons/Link";
import type { ComponentType } from "react";
import { defineField, defineType } from "sanity";

/**
 * Keep ids in sync with `apps/web/src/lib/footer-links.ts`
 * (URL templates) and `apps/web/src/components/social-icon.tsx`.
 */
export const FOOTER_LINK_SERVICES = [
  { value: "facebook", title: "Facebook" },
  { value: "instagram", title: "Instagram" },
  { value: "youtube", title: "YouTube" },
  { value: "tiktok", title: "TikTok" },
  { value: "linkedin", title: "LinkedIn" },
  { value: "x", title: "X (Twitter)" },
  { value: "threads", title: "Threads" },
  { value: "bluesky", title: "Bluesky" },
  { value: "vimeo", title: "Vimeo" },
  { value: "spotify", title: "Spotify" },
  { value: "email", title: "E-mail" },
  { value: "phone", title: "Telefon" },
  { value: "custom", title: "Własny link" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s().-]{5,}$/;

type LinkParent = { service?: string };

function serviceOf(context: { parent?: unknown }): string | undefined {
  const parent = context.parent;
  return parent && typeof parent === "object"
    ? (parent as LinkParent).service
    : undefined;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function serviceTitle(service: string | undefined): string {
  return (
    FOOTER_LINK_SERVICES.find((item) => item.value === service)?.title ??
    "Link"
  );
}

function previewIcon(service: string | undefined): ComponentType {
  return service === "email" ? EnvelopeIcon : LinkIcon;
}

export const footerLink = defineType({
  name: "footerLink",
  title: "Kontakt / social media",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "service",
      title: "Serwis",
      type: "string",
      initialValue: "facebook",
      options: { list: [...FOOTER_LINK_SERVICES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Konto",
      type: "string",
      description:
        "Nazwa użytkownika (np. dramaway) albo pełny adres strony. E-mail: adres. Telefon: numer. Własny link: pełny adres https://…",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const text = typeof value === "string" ? value.trim() : "";
          if (!text) return true;
          const service = serviceOf(context);
          if (service === "email") {
            return EMAIL_RE.test(text.replace(/^mailto:/i, ""))
              ? true
              : "Podaj poprawny adres e-mail";
          }
          if (service === "phone") {
            return PHONE_RE.test(text.replace(/^tel:/i, ""))
              ? true
              : "Podaj numer telefonu";
          }
          if (service === "custom") {
            return isHttpUrl(text) ? true : "Podaj pełny adres https://…";
          }
          if (/^[a-z]+:/i.test(text) && !isHttpUrl(text)) {
            return "Podaj nazwę użytkownika albo adres https://…";
          }
          return true;
        }),
    }),
    defineField({
      name: "label",
      title: "Etykieta",
      type: "string",
      description:
        "Opcjonalny tekst widoczny obok ikony, zamiast adresu lub nazwy konta. Serwis z etykietą stoi na liście obok e-maila; bez etykiety zostaje sama ikona w rzędzie.",
    }),
    defineField({
      name: "icon",
      title: "Ikona",
      type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" },
      description:
        "Najlepiej jednokolorowe SVG na przezroczystym tle. Pusta = ikona ogólnego linku.",
      hidden: ({ parent }) =>
        (parent as LinkParent | undefined)?.service !== "custom",
    }),
  ],
  preview: {
    select: {
      service: "service",
      value: "value",
      label: "label",
      icon: "icon",
    },
    prepare: ({ service, value, label, icon }) => ({
      title: label || value || serviceTitle(service),
      subtitle:
        label && value
          ? `${serviceTitle(service)} · ${value}`
          : serviceTitle(service),
      media: icon ?? previewIcon(service),
    }),
  },
});
