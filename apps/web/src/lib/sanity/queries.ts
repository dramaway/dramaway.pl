import { EXCERPT_FALLBACK_MAX } from "../homepage-copy";
import { FEED_LIMIT_MAX } from "../content-sections";
import { navigationProjection } from "./navigation-query";

const ctaButtonProjection = `_type == "ctaButton" => {
  page->{
    _type,
    "slug": slug.current,
    route
  },
  file { asset->{ url } }
}`;

/** Resolves Button targets inside Portable Text, including a button nested in Columns. */
export const portableBodyProjection = `{
  ...,
  ${ctaButtonProjection},
  _type == "textColumns" => {
    columns[] {
      ...,
      body[] {
        ...,
        ${ctaButtonProjection}
      }
    }
  }
}`;

/** Pages that have not been converted to `news` yet. */
const legacyNewsSlugFilter = `slug.current match "aktualnosc-*"`;

const excerptFallback = `array::join(string::split(pt::text(body), "")[0...${EXCERPT_FALLBACK_MAX}], "")`;

export const peopleListQuery = `*[_type == "person"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  role,
  email,
  photo,
  "excerpt": pt::text(bio)
}`;

export const personBySlugQuery = `*[_type == "person" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  role,
  email,
  photo,
  bio[] ${portableBodyProjection}
}`;

export const personSlugsQuery = `*[_type == "person" && defined(slug.current)].slug.current`;

export const pagesListQuery = `*[_type == "page" && !(${legacyNewsSlugFilter})] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}`;

const feedDoc = `{
  _id,
  _createdAt,
  publishedAt,
  title,
  "slug": slug.current,
  ctaHref,
  ctaLabel,
  "excerpt": select(
    defined(excerpt) && excerpt != "" => excerpt,
    array::join(string::split(pt::text(body), "")[0...${EXCERPT_FALLBACK_MAX}], "")
  )
}`;

/** Newest documents per kind. A section mixes the pools it asked for and keeps the overall newest. */
export const contentFeedQuery = `{
  "news": *[_type == "news" || (_type == "page" && ${legacyNewsSlugFilter})] | order(coalesce(publishedAt, _createdAt) desc) [0...${FEED_LIMIT_MAX}] ${feedDoc},
  "page": *[_type == "page" && !(${legacyNewsSlugFilter})] | order(_createdAt desc) [0...${FEED_LIMIT_MAX}] ${feedDoc},
  "person": *[_type == "person" && defined(slug.current)] | order(_createdAt desc) [0...${FEED_LIMIT_MAX}] {
    _id,
    _createdAt,
    "title": name,
    "slug": slug.current,
    "excerpt": pt::text(bio)
  },
  "project": *[_type == "project" && defined(slug.current)] | order(_createdAt desc) [0...${FEED_LIMIT_MAX}] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    "excerpt": summary
  },
  "publication": *[_type == "publication" && defined(slug.current) && slug.current != "metody-tzs"] | order(_createdAt desc) [0...${FEED_LIMIT_MAX}] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    "excerpt": summary
  }
}`;

/** Shared by homepage and page documents. */
export const contentSectionsProjection = `{
  _key,
  _type,
  heading,
  limit,
  sources,
  textLayout,
  image,
  tiles[] {
    _key,
    target,
    href,
    title,
    excerpt,
    ctaLabel,
    page->{
      _type,
      title,
      name,
      "slug": slug.current,
      route,
      "docExcerpt": select(
        _type == "person" => pt::text(bio),
        _type == "project" => summary,
        _type == "publication" => summary,
        _type == "landingPage" => lead,
        _type == "aboutPage" => lead,
        _type == "news" => select(
          defined(excerpt) && excerpt != "" => excerpt,
          pt::text(body)
        ),
        _type == "page" => select(
          defined(excerpt) && excerpt != "" => excerpt,
          defined(heroLead) && heroLead != "" => heroLead,
          pt::text(body)
        )
      )
    }
  }
}`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  heroLead,
  heroCtaLabel,
  heroCtaHref,
  "excerpt": select(
    defined(excerpt) && excerpt != "" => excerpt,
    defined(heroLead) && heroLead != "" => heroLead,
    array::join(string::split(pt::text(body), "")[0...${EXCERPT_FALLBACK_MAX}], "")
  ),
  "cover": heroImage,
  sections[] ${contentSectionsProjection},
  body[] ${portableBodyProjection}
}`;

export const pageRoutesQuery = `*[_type == "page" && defined(slug.current)]{
  "slug": slug.current
}`;

export const newsBySlugQuery = `*[_type == "news" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "excerpt": select(
    defined(excerpt) && excerpt != "" => excerpt,
    ${excerptFallback}
  ),
  publishedAt,
  ctaHref,
  ctaLabel,
  body[] ${portableBodyProjection}
}`;

export const newsRoutesQuery = `*[_type == "news" && defined(slug.current)]{
  "slug": slug.current
}`;

const editionProjection = `{
  title,
  "slug": slug.current,
  year,
  years,
  theme,
  summary,
  body[] ${portableBodyProjection},
  gallery,
  partners,
  outcomes
}`;

export const projectsListQuery = `*[_type == "project"] | order(featured desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  status,
  featured,
  summary,
  "editionCount": count(editions),
  "cover": coalesce(
    (editions[].gallery[])[defined(asset)][0],
    *[_type == "page" && slug.current == ^.slug.current][0].body[_type == "image"][0]
  )
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  status,
  featured,
  summary,
  "cover": coalesce(
    (editions[].gallery[])[defined(asset)][0],
    body[_type == "image"][0]
  ),
  body[] ${portableBodyProjection},
  editions[] ${editionProjection},
  afterword[] ${portableBodyProjection},
  partners,
  sponsors
}`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current)].slug.current`;

export const projectEditionParamsQuery = `*[_type == "project" && defined(slug.current)]{
  "slug": slug.current,
  "editionSlugs": editions[defined(slug.current)].slug.current
}`;

export const pagesBySlugsQuery = `*[_type == "page" && slug.current in $slugs] {
  _id,
  title,
  "slug": slug.current
}`;

export const landingPageByIdQuery = `*[_type == "landingPage" && _id == $id][0] {
  title,
  lead,
  ctaLabel,
  ctaHref,
  image,
  showCzytelnia
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0] {
  title,
  lead,
  ctaLabel,
  ctaHref,
  image,
  methods {
    heading,
    lead,
    ctaLabel,
    ctaHref,
    values[] { label }
  },
  team {
    heading,
    ctaLabel,
    body[] ${portableBodyProjection},
    people[]->{
      _id,
      name,
      "slug": slug.current,
      role,
      email,
      photo,
      "excerpt": pt::text(bio)
    }
  },
  history {
    heading,
    lead[] ${portableBodyProjection},
    items[] { year, title, body }
  },
  documents {
    heading,
    items[] {
      title,
      href,
      "page": page->{ title, "slug": slug.current },
      file { asset->{ url, originalFilename, mimeType } }
    }
  }
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _updatedAt,
  title,
  tagline,
  centrumUrl,
  navigation[] {
    ${navigationProjection}
  },
  footerNote,
  footer {
    logo,
    address,
    quote,
    attribution
  },
  branding {
    faviconSvg { asset->{ url, mimeType } },
    faviconIco { asset->{ url, mimeType } },
    faviconLight,
    faviconDark,
    appleTouchIcon,
    appIcon,
    shareImage
  },
  heroHeading,
  heroLead,
  heroCtaLabel,
  heroCtaHref,
  heroImage,
  homepageSections[] ${contentSectionsProjection}
}`;

const publicationFileProjection = `file { asset->{ url, originalFilename, mimeType } }`;
/** First picture in the text is the listing mark. YouTube in Columns still counts as a page. */
const publicationListingSignalsProjection = `
  "bodyText": pt::text(body),
  "hasVideo": (count(body[_type == "youtube"]) + count(body[_type == "textColumns"].columns[].body[_type == "youtube"])) > 0,
  "cover": body[_type == "image"][0]{
    _type,
    alt,
    hotspot,
    crop,
    asset
  }
`;
const publicationMethodsProjection = `methods[]->{ title, "slug": slug.current }`;
/** Public enum, with Drupal-string fallback until `pnpm patch:publication-format`. Keep in sync with scripts/patch-publication-format.mjs. */
const publicationFormatProjection = `"format": select(
  format in ["articles", "books", "scripts", "multimedia"] => format,
  lower(coalesce(legacyDrupal.format, "")) == "publikacje" => "articles",
  lower(coalesce(legacyDrupal.format, "")) == "publikacja" => "articles",
  lower(coalesce(legacyDrupal.format, "")) == "artykuły i publikacje" => "articles",
  lower(coalesce(legacyDrupal.format, "")) == "książki" => "books",
  lower(coalesce(legacyDrupal.format, "")) == "książka" => "books",
  lower(coalesce(legacyDrupal.format, "")) == "ksiazki" => "books",
  lower(coalesce(legacyDrupal.format, "")) == "scenariusze" => "scripts",
  lower(coalesce(legacyDrupal.format, "")) == "scenariusz" => "scripts",
  lower(coalesce(legacyDrupal.format, "")) == "multimedia" => "multimedia"
)`;

export const publicationsListQuery = `*[_type == "publication" && listed == true && defined(slug.current)] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  authors,
  ${publicationFormatProjection},
  ${publicationMethodsProjection},
  ${publicationFileProjection},
  ${publicationListingSignalsProjection}
}`;

export const publicationBySlugQuery = `*[_type == "publication" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  summary,
  authors,
  ${publicationFormatProjection},
  ${publicationMethodsProjection},
  ${publicationFileProjection},
  ${publicationListingSignalsProjection},
  body[] ${portableBodyProjection}
}`;

/** Every publication URL, including unlisted. Sitemap keeps only page destinations. */
export const publicationRoutesQuery = `*[_type == "publication" && defined(slug.current)]{
  "slug": slug.current,
  ${publicationFormatProjection},
  "fileUrl": file.asset->url,
  "hasVideo": (count(body[_type == "youtube"]) + count(body[_type == "textColumns"].columns[].body[_type == "youtube"])) > 0
}`;

export const readingMethodsQuery = `*[_type == "readingMethod"] | order(order asc) {
  title,
  "slug": slug.current,
  order
}`;

export const publicationSlugsQuery = `*[_type == "publication" && defined(slug.current)].slug.current`;
