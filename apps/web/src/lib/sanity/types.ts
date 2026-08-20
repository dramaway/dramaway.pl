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
};

export type PageDetail = {
  _id: string;
  title: string;
  slug: string;
  isNews: boolean;
  body: PortableContent;
};

export type SiteSettings = {
  title: string | null;
  tagline: string | null;
  centrumUrl: string | null;
  footerNote: string | null;
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
