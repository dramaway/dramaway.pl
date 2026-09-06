import type { PortableTextProps } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityImage = SanityImageSource;

export type PortableContent = PortableTextProps["value"];

export type PersonListItem = {
  _id: string;
  name: string;
  slug: string;
  role: string | null;
  email: string | null;
  photo: SanityImage | null;
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
  heroLead?: string | null;
  heroCtaLabel?: string | null;
  heroCtaHref?: string | null;
  cover?: SanityImage | null;
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
    originalFilename?: string | null;
  } | null;
};

export type PublicationFormat =
  | "articles"
  | "books"
  | "scripts"
  | "multimedia";

export type ReadingMethodRef = {
  title: string;
  slug: string | null;
};

export type ReadingMethodListItem = ReadingMethodRef & {
  order: number;
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

export type SiteSettingsFooter = {
  logo?: (SanityImage & { alt?: string | null }) | null;
  address?: string | null;
  quote?: string | null;
  attribution?: string | null;
};

export type SiteSettings = {
  title: string | null;
  tagline: string | null;
  centrumUrl: string | null;
  footerNote: string | null;
  footer?: SiteSettingsFooter | null;
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

export type ResolvedFooter = {
  logo: SanityImage | null;
  logoAlt: string;
  address: string;
  quote: string;
  attribution: string | null;
};

export type ResolvedSite = {
  title: string;
  tagline: string | null;
  centrumUrl: string;
  footer: ResolvedFooter;
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
  cover: SanityImage | null;
  body: PortableContent;
  editions: ProjectEdition[] | null;
  afterword: PortableContent;
  partners: string[] | null;
  sponsors: string[] | null;
};

export type PublicationListItem = {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  authors: string[] | null;
  format: PublicationFormat | null;
  methods: ReadingMethodRef[] | null;
  file: SanityFile | null;
};

export type PublicationDetail = PublicationListItem & {
  cover?: SanityImage | null;
  body: PortableContent;
};

export type LandingPage = {
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: (SanityImage & { alt?: string | null }) | null;
  czytelniaTeaser: {
    title: string | null;
    lead: string | null;
    ctaLabel: string | null;
  } | null;
};

export type AboutValue = {
  label: string | null;
};

export type AboutHistoryItem = {
  year: string | null;
  title: string | null;
  body: string | null;
};

export type AboutDocumentPage = {
  title: string | null;
  slug: string | null;
};

export type AboutDocumentItem = {
  title: string | null;
  href: string | null;
  page: AboutDocumentPage | null;
  file: SanityFile | null;
};

export type AboutPage = {
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: (SanityImage & { alt?: string | null }) | null;
  methods: {
    heading: string | null;
    lead: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
    values: AboutValue[] | null;
  } | null;
  team: {
    heading: string | null;
    ctaLabel: string | null;
    people: PersonListItem[] | null;
  } | null;
  history: {
    heading: string | null;
    lead: string | null;
    items: AboutHistoryItem[] | null;
  } | null;
  documents: {
    heading: string | null;
    items: AboutDocumentItem[] | null;
  } | null;
};

export type ResolvedAboutDocument = {
  title: string;
  href: string;
  external: boolean;
};

export type ResolvedAboutHistoryItem = {
  year: string;
  title: string;
  body: string | null;
};

export type ResolvedAboutPage = {
  title: string;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: SanityImage | null;
  imageAlt: string;
  methods: {
    heading: string;
    lead: string | null;
    ctaLabel: string | null;
    ctaHref: string;
    values: string[];
  };
  team: {
    heading: string;
    ctaLabel: string;
    people: PersonListItem[];
    emptyMessage: string;
  };
  history: {
    heading: string;
    lead: string | null;
    items: ResolvedAboutHistoryItem[];
  };
  documents: {
    heading: string;
    items: ResolvedAboutDocument[];
    emptyMessage: string;
  };
};
