import type { PortableTextProps } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import type { NavItem } from "../routes";

export type SanityImage = SanityImageSource;

/** Image field that may carry a slide key and alt (hero lists and the legacy still). */
export type CmsHeroImage = SanityImage & {
  _key?: string | null;
  alt?: string | null;
};

export type CmsHeroSlider = {
  interval?: number | null;
  autoplay?: boolean | null;
} | null;

/** One hero still after legacy single-image fallback. */
export type HeroSlide = {
  _key: string;
  image: SanityImage;
  alt: string;
};

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

export type PageRoute = {
  slug: string;
};

export type PageListItem = {
  _id: string;
  title: string;
  slug: string;
  cover?: SanityImage | null;
  excerpt?: string | null;
  publishedAt?: string | null;
};

export type FeedSource = "news" | "page" | "person" | "project" | "publication";

export type ContentFeedDoc = {
  _id: string;
  _createdAt?: string | null;
  publishedAt?: string | null;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
};

export type ContentFeedPool = Record<FeedSource, ContentFeedDoc[] | null>;

export type CmsContentImage = SanityImage & { alt?: string | null };

export type CmsContentTileTarget = {
  _type: string;
  title: string | null;
  name: string | null;
  slug: string | null;
  route: string | null;
  docExcerpt: string | null;
};

export type CmsContentTile = {
  _key: string;
  target?: "reference" | "path" | string | null;
  href?: string | null;
  title?: string | null;
  excerpt?: string | null;
  ctaLabel?: string | null;
  page?: CmsContentTileTarget | null;
};

export type CmsContentSection = {
  _key: string;
  _type: string;
  heading?: string | null;
  /** News-feed cap. Empty = 3. */
  limit?: number | null;
  /** News-feed document kinds. Empty = News only. */
  sources?: string[] | null;
  textLayout?: "grid" | "list" | string | null;
  image?: CmsContentImage | null;
  tiles?: CmsContentTile[] | null;
};

export type ResolvedTile = {
  key: string;
  title: string | null;
  excerpt: string | null;
  href: string | null;
  ctaLabel: string | null;
};

export type ResolvedNewsSection = {
  key: string;
  kind: "news";
  heading: string | null;
  /** How many newest documents to show (1–12). */
  limit: number;
  /** Document kinds mixed into one list, newest `_createdAt` first. */
  sources: FeedSource[];
};

export type ResolvedContentModule = {
  key: string;
  kind: "module";
  image: SanityImage | null;
  imageAlt: string;
  textLayout: "grid" | "list";
  tiles: ResolvedTile[];
};

export type ResolvedSection = ResolvedNewsSection | ResolvedContentModule;

export type PageDetail = {
  _id: string;
  title: string;
  slug: string;
  heroLead?: string | null;
  heroCtaLabel?: string | null;
  heroCtaHref?: string | null;
  heroImages?: CmsHeroImage[] | null;
  excerpt?: string | null;
  cover?: CmsHeroImage | null;
  sections: ResolvedSection[];
  body: PortableContent;
};

export type NewsDetail = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  body: PortableContent;
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

export type SiteSettingsNavPage = {
  _type: string;
  title: string | null;
  name: string | null;
  slug: string | null;
  route: string | null;
};

export type SiteSettingsNavLink = {
  label?: string | null;
  target?: "reference" | "path" | string | null;
  href?: string | null;
  page?: SiteSettingsNavPage | null;
};

export type SiteSettingsNavItem = SiteSettingsNavLink & {
  children?: SiteSettingsNavLink[] | null;
};

export type SiteSettings = {
  title: string | null;
  tagline: string | null;
  centrumUrl: string | null;
  navigation?: SiteSettingsNavItem[] | null;
  footerNote: string | null;
  footer?: SiteSettingsFooter | null;
  branding?: SiteSettingsBranding | null;
  heroHeading: string | null;
  heroLead: string | null;
  heroCtaLabel: string | null;
  heroCtaHref: string | null;
  heroImages?: CmsHeroImage[] | null;
  heroImage: CmsHeroImage | null;
  heroSlider?: CmsHeroSlider;
  homepageSections?: CmsContentSection[] | null;
};

export type HeroContent = {
  heading: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  /** One still is static. Two or more use the shared hero slider. */
  slides: HeroSlide[];
};

export type HomepageContent = {
  sections: ResolvedSection[];
};

export type ResolvedFooter = {
  logo: SanityImage | null;
  logoAlt: string;
  address: string | null;
  quote: string | null;
  attribution: string | null;
};

export type ResolvedSite = {
  title: string;
  tagline: string | null;
  centrumUrl: string;
  nav: NavItem[];
  footer: ResolvedFooter;
  hero: HeroContent;
  homepage: HomepageContent;
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
  heroImages?: CmsHeroImage[] | null;
  cover: SanityImage | null;
  body: PortableContent;
  editions: ProjectEdition[] | null;
  afterword: PortableContent;
  partners: string[] | null;
  sponsors: string[] | null;
};

export type PublicationCover = SanityImage & { alt?: string | null };

export type PublicationListItem = {
  _id: string;
  title: string;
  slug: string;
  summary: string | null;
  authors: string[] | null;
  format: PublicationFormat | null;
  methods: ReadingMethodRef[] | null;
  file: SanityFile | null;
  /** First image in `body`. Empty when the text has no picture. */
  cover: PublicationCover | null;
  /** Plain text of `body`, for the file-row lead. */
  bodyText: string | null;
  hasVideo: boolean | null;
};

export type PublicationRoute = {
  slug: string | null;
  format: PublicationFormat | null;
  fileUrl: string | null;
  hasVideo: boolean | null;
};

export type PublicationDetail = PublicationListItem & {
  body: PortableContent;
};

export type LandingPage = {
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  heroImages?: CmsHeroImage[] | null;
  image: CmsHeroImage | null;
  showCzytelnia?: boolean | null;
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
  heroImages?: CmsHeroImage[] | null;
  image: CmsHeroImage | null;
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
    body: PortableContent | null;
    people: PersonListItem[] | null;
  } | null;
  history: {
    heading: string | null;
    lead: PortableContent | string | null;
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
  title: string | null;
  lead: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  slides: HeroSlide[];
  methods: {
    heading: string | null;
    lead: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
    values: string[];
  };
  team: {
    heading: string | null;
    ctaLabel: string | null;
    body: PortableContent | null;
    people: PersonListItem[];
  };
  history: {
    heading: string | null;
    lead: PortableContent | null;
    items: ResolvedAboutHistoryItem[];
  };
  documents: {
    heading: string | null;
    items: ResolvedAboutDocument[];
  };
};
