/** Dereferenced nav link. Keep the site query and the seed check on this string. */
export const navigationLinkProjection = `
  label,
  target,
  href,
  page->{
    _type,
    title,
    name,
    "slug": slug.current,
    route
  }
`;

export const navigationProjection = `
  ${navigationLinkProjection},
  children[] {
    ${navigationLinkProjection}
  }
`;
