/** News pages were migrated with slug prefix `aktualnosc-`. */
const newsSlugFilter = `slug.current match "aktualnosc-*"`;

export const contentCountsQuery = `{
  "people": count(*[_type == "person"]),
  "pages": count(*[_type == "page" && !(${newsSlugFilter})]),
  "news": count(*[_type == "page" && ${newsSlugFilter}]),
  "projects": count(*[_type == "project"])
}`;

export const peopleListQuery = `*[_type == "person"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  role,
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

export const newsListQuery = `*[_type == "page" && ${newsSlugFilter}] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "isNews": true,
  "cover": body[_type == "image"][0],
  "excerpt": pt::text(body)
}`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "isNews": ${newsSlugFilter},
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
  body,
  editions[] ${editionProjection},
  afterword,
  partners,
  sponsors
}`;

export const projectSlugsQuery = `*[_type == "project" && defined(slug.current)].slug.current`;

export const pagesBySlugsQuery = `*[_type == "page" && slug.current in $slugs] {
  _id,
  title,
  "slug": slug.current,
  "isNews": false
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _updatedAt,
  title,
  tagline,
  centrumUrl,
  footerNote,
  heroHeading,
  heroLead,
  heroCtaLabel,
  heroCtaHref,
  heroImage
}`;
