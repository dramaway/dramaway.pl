import type { PortableTextProps } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityImage = SanityImageSource;

export type PortableContent = PortableTextProps["value"];

export type PersonListItem = {
  _id: string;
  name: string;
  slug: string;
  role: string | null;
  excerpt: string | null;
};

export type PersonDetail = {
  _id: string;
  name: string;
  slug: string;
  role: string | null;
  email: string | null;
  photo: SanityImage | null;
  bio: PortableContent;
};

export type PageListItem = {
  _id: string;
  title: string;
  slug: string;
  isNews: boolean;
  cover?: SanityImage | null;
  excerpt?: string | null;
  publishedAt?: string | null;
};

export type PageDetail = {
  _id: string;
  title: string;
  slug: string;
  isNews: boolean;
  body: PortableContent;
};

export type SiteSettingsHomepageBlock = {
  heading?: string | null;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type SiteSettingsHomepageAbout = SiteSettingsHomepageBlock & {
  image?: (SanityImage & { alt?: string | null }) | null;
};

export type SiteSettingsHomepageFeatured = {
  label?: string | null;
  lead?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type SiteSettingsHomepage = {
  about?: SiteSettingsHomepageAbout | null;
  methods?: SiteSettingsHomepageBlock | null;
  featured?: SiteSettingsHomepageFeatured | null;
  czytelnia?: SiteSettingsHomepageBlock | null;
};

export type SanityFile = {
  asset?: {
    url?: string | null;
    mimeType?: string | null;
  } | null;
};

export type SiteSettingsBranding = {
  faviconSvg?: SanityFile | null;
  faviconIco?: SanityFile | null;
  faviconLight?: SanityImage | null;
  faviconDark?: SanityImage | null;
  appleTouchIcon?: SanityImage | null;
  appIcon?: SanityImage | null;
  shareImage?: SanityImage | null;
};

export type SiteSettings = {
  title: string | null;
  tagline: string | null;
  centrumUrl: string | null;
  footerNote: string | null;
  branding?: SiteSettingsBranding | null;
  heroHeading: string | null;
  heroLead: string | null;
  heroCtaLabel: string | null;
  heroCtaHref: string | null;
  heroImage: (SanityImage & { alt?: string | null }) | null;
  homepage?: SiteSettingsHomepage | null;
};

export type HeroContent = {
  heading: string;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string;
  image: SanityImage | null;
  imageAlt: string;
};

export type HomepageBlock = {
  heading: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HomepageAbout = HomepageBlock & {
  image: SanityImage | null;
  imageAlt: string;
};

/** Label/blurb/CTA only — project title comes from `project.featured` on the page. */
export type HomepageContent = {
  about: HomepageAbout;
  methods: HomepageBlock;
  featured: HomepageBlock;
  czytelnia: HomepageBlock;
};

export type ResolvedSite = {
  title: string;
  tagline: string | null;
  centrumUrl: string;
  footerNote: string;
  hero: HeroContent;
  homepage: HomepageContent;
};

export type ContentCounts = {
  people: number;
  pages: number;
  news: number;
  projects: number;
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  summary: string | null;
  editionCount: number;
  cover: SanityImage | null;
};

export type EditionOutcome = {
  title: string;
  subtitle: string | null;
  date: string | null;
  image: SanityImage | null;
  description: string | null;
};

export type ProjectEdition = {
  title: string;
  slug: string;
  year: number | null;
  years: string | null;
  theme: string | null;
  summary: string | null;
  body: PortableContent;
  gallery: SanityImage[] | null;
  partners: string[] | null;
  outcomes: EditionOutcome[] | null;
};

export type ProjectDetail = {
  _id: string;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  summary: string | null;
  body: PortableContent;
  editions: ProjectEdition[] | null;
  afterword: PortableContent;
  partners: string[] | null;
  sponsors: string[] | null;
};
