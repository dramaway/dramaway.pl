import { EXCERPT_FALLBACK_MAX } from "../homepage-copy";

/** News pages were migrated with slug prefix `aktualnosc-`. */
const newsSlugFilter = `slug.current match "aktualnosc-*"`;

const newsProjection = `{
  _id,
  title,
  "slug": slug.current,
  "isNews": true,
  "cover": body[_type == "image"][0],
  "excerpt": select(
    defined(excerpt) && excerpt != "" => excerpt,
    array::join(string::split(pt::text(body), "")[0...${EXCERPT_FALLBACK_MAX}], "")
  ),
  publishedAt
}`;

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
  bio
}`;

export const personSlugsQuery = `*[_type == "person" && defined(slug.current)].slug.current`;

export const pagesListQuery = `*[_type == "page" && !(${newsSlugFilter})] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "isNews": false
}`;

export const newsListQuery = `*[_type == "page" && ${newsSlugFilter}] | order(coalesce(publishedAt, _createdAt) desc) ${newsProjection}`;

export const homepageNewsQuery = `*[_type == "page" && ${newsSlugFilter}] | order(coalesce(publishedAt, _createdAt) desc) [0...3] ${newsProjection}`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "isNews": ${newsSlugFilter},
  heroLead,
  heroCtaLabel,
  heroCtaHref,
  "excerpt": select(
    defined(excerpt) && excerpt != "" => excerpt,
    defined(heroLead) && heroLead != "" => heroLead,
    array::join(string::split(pt::text(body), "")[0...${EXCERPT_FALLBACK_MAX}], "")
  ),
  "cover": heroImage,
  body
}`;

export const pageSlugsQuery = `*[_type == "page" && defined(slug.current)].slug.current`;

const editionProjection = `{
  title,
  "slug": slug.current,
  year,
  years,
  theme,
  summary,
  body,
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
  body,
  editions[] ${editionProjection},
  afterword,
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
  "slug": slug.current,
  "isNews": false
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
    body,
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
    lead,
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
  homepage {
    about {
      heading,
      lead,
      ctaLabel,
      ctaHref,
      image
    },
    methods {
      heading,
      lead,
      ctaLabel,
      ctaHref
    },
    featured {
      label,
      lead,
      ctaLabel,
      ctaHref
    },
    czytelnia {
      heading,
      lead,
      ctaLabel,
      ctaHref
    }
  }
}`;

const publicationFileProjection = `file { asset->{ url, originalFilename, mimeType } }`;
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
  ${publicationFileProjection}
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
  body
}`;

export const readingMethodsQuery = `*[_type == "readingMethod"] | order(order asc) {
  title,
  "slug": slug.current,
  order
}`;

export const publicationSlugsQuery = `*[_type == "publication" && defined(slug.current)].slug.current`;
