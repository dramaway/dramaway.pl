import { defineArrayMember, defineType, defineField } from "sanity";
import { IcoFileInput } from "../components/ico-file-input";
import { contentSectionMembers } from "./contentModule";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "centrumUrl",
      title: "Centrum (external) URL",
      type: "url",
      group: "general",
      description: "Link to centrum.dramaway.pl — not migrated in MVP",
    }),
    defineField({
      name: "navigation",
      title: "Menu główne",
      type: "array",
      group: "navigation",
      description:
        "Pusta lista zostawia menu wbudowane: Projekty, Baza wiedzy (Czytelnia), O fundacji, Kontakt. Logo prowadzi na stronę główną.",
      of: [defineArrayMember({ type: "navItem" })],
      validation: (rule) => rule.max(12),
      initialValue: [
        {
          _key: "projekty",
          _type: "navItem",
          label: "Projekty",
          target: "reference",
          page: { _type: "reference", _ref: "landing-projekty" },
        },
        {
          _key: "baza-wiedzy",
          _type: "navItem",
          label: "Baza wiedzy",
          target: "path",
          href: "/baza-wiedzy",
          children: [
            {
              _key: "czytelnia",
              _type: "navChild",
              label: "Czytelnia",
              target: "reference",
              page: { _type: "reference", _ref: "landing-czytelnia" },
            },
          ],
        },
        {
          _key: "fundacja",
          _type: "navItem",
          label: "O fundacji",
          target: "reference",
          page: { _type: "reference", _ref: "aboutPage" },
        },
        {
          _key: "kontakt",
          _type: "navItem",
          label: "Kontakt",
          target: "path",
          href: "/kontakt",
        },
      ],
    }),
    defineField({
      name: "footerNote",
      title: "Footer note (legacy)",
      type: "text",
      group: "footer",
      hidden: true,
      description: "Replaced by Footer → Address. Still read if Address is empty.",
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      options: { columns: 2 },
      fieldsets: [
        { name: "left", title: "Left — logo & address" },
        { name: "right", title: "Right — quote" },
      ],
      fields: [
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          fieldset: "left",
          options: { hotspot: true },
          description:
            "Empty = the header wordmark (public/logo-dramaway.png).",
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "text",
          rows: 4,
          fieldset: "left",
          description: "Under the logo. Line breaks are kept.",
        }),
        defineField({
          name: "quote",
          title: "Quote",
          type: "text",
          rows: 6,
          fieldset: "right",
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          type: "string",
          fieldset: "right",
        }),
      ],
    }),
    defineField({
      name: "branding",
      title: "Icons & share image",
      type: "object",
      group: "branding",
      description:
        "Leave a field empty to keep the built-in file from public/brand. SVG is the tab icon that follows the browser light/dark chrome.",
      fields: [
        defineField({
          name: "faviconSvg",
          title: "Favicon (SVG)",
          type: "image",
          options: { accept: "image/svg+xml" },
          description:
            "Best for tabs. Prefer an SVG whose fill flips with prefers-color-scheme. Stored as an image so Media can preview it; the site still serves the raw SVG (not a rasterized CDN transform).",
        }),
        defineField({
          name: "faviconIco",
          title: "Favicon (ICO)",
          type: "file",
          options: {
            accept: ".ico,image/x-icon,image/vnd.microsoft.icon",
          },
          description:
            "Legacy tab fallback. Sanity cannot store ICO as an image, so this uses the built-in file picker (not Media). Upload here; a 32×32 preview appears once the file is attached.",
          components: { input: IcoFileInput },
        }),
        defineField({
          name: "faviconLight",
          title: "Favicon PNG — light chrome",
          type: "image",
          description:
            "Optional raster for browsers that ignore SVG. Dark mark, transparent background. Served with prefers-color-scheme: light.",
        }),
        defineField({
          name: "faviconDark",
          title: "Favicon PNG — dark chrome",
          type: "image",
          description:
            "Optional raster for dark browser chrome. Light mark, transparent background. Served with prefers-color-scheme: dark.",
        }),
        defineField({
          name: "appleTouchIcon",
          title: "Apple touch icon",
          type: "image",
          description: "180×180. iOS home screen; a filled square reads better than a thin transparent mark.",
        }),
        defineField({
          name: "appIcon",
          title: "App icon (512)",
          type: "image",
          description: "512×512 PWA / Android icon.",
        }),
        defineField({
          name: "shareImage",
          title: "Share image (Open Graph)",
          type: "image",
          description: "Link preview. Aim for 1200×630. Empty = no og:image.",
        }),
      ],
    }),
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
      group: "hero",
      description: "Główny nagłówek strony startowej.",
    }),
    defineField({
      name: "heroLead",
      title: "Hero lead",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      group: "hero",
      description: 'Np. „poznaj nasze projekty”. Pusty = brak przycisku.',
    }),
    defineField({
      name: "heroCtaHref",
      title: "Hero CTA target",
      type: "string",
      group: "hero",
      description: "Ścieżka wewnętrzna, np. /projekty",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "homepageSections",
      title: "Sekcje",
      type: "array",
      group: "homepage",
      description: "Pod hero. Pusta lista = na stronie głównej zostaje samo hero.",
      of: contentSectionMembers(),
    }),
  ],
  groups: [
    { name: "general", title: "Ogólne", default: true },
    { name: "navigation", title: "Nawigacja" },
    { name: "footer", title: "Stopka" },
    { name: "branding", title: "Ikony" },
    { name: "hero", title: "Hero" },
    { name: "homepage", title: "Sekcje" },
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
