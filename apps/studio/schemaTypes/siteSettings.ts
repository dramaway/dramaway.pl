import { defineType, defineField, type FieldDefinition } from "sanity";
import { IcoFileInput } from "../components/ico-file-input";

function ctaFields(): FieldDefinition[] {
  return [
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA target",
      type: "string",
      description: "Internal path, e.g. /fundacja",
    }),
  ];
}

function homepageTextFields(
  headingName: "heading" | "label",
  headingTitle: string,
): FieldDefinition[] {
  return [
    defineField({
      name: headingName,
      title: headingTitle,
      type: "string",
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "text",
      rows: 4,
    }),
    ...ctaFields(),
  ];
}

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
      name: "footerNote",
      title: "Footer note",
      type: "text",
      group: "general",
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
          type: "file",
          options: { accept: "image/svg+xml" },
          description:
            "Best for tabs. Prefer an SVG whose fill flips with prefers-color-scheme (dark mark on light chrome, light mark on dark).",
        }),
        defineField({
          name: "faviconIco",
          title: "Favicon (ICO)",
          type: "file",
          options: {
            accept: ".ico,image/x-icon,image/vnd.microsoft.icon",
          },
          description:
            "Legacy tab fallback. Upload here (as a file) — Sanity cannot store ICO as an image, so the Media tool will reject a drop onto the image grid.",
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
      name: "homepage",
      title: "Homepage",
      type: "object",
      group: "homepage",
      fields: [
        defineField({
          name: "about",
          title: "About",
          type: "object",
          fields: [
            ...homepageTextFields("heading", "Heading"),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              description: "Shared with the Methods column in the split layout.",
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "methods",
          title: "Methods",
          type: "object",
          fields: homepageTextFields("heading", "Heading"),
        }),
        defineField({
          name: "featured",
          title: "Featured project",
          type: "object",
          description:
            "Label and blurb only. The project title comes from the featured project document.",
          fields: homepageTextFields("label", "Label"),
        }),
        defineField({
          name: "czytelnia",
          title: "Czytelnia",
          type: "object",
          fields: homepageTextFields("heading", "Heading"),
        }),
      ],
    }),
  ],
  groups: [
    { name: "general", title: "Ogólne", default: true },
    { name: "branding", title: "Ikony" },
    { name: "hero", title: "Hero" },
    { name: "homepage", title: "Homepage" },
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
