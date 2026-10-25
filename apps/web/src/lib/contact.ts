export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  subject: 160,
  message: 5000,
} as const;

/** Netlify detects the form from this static file (see public/__forms.html). */
export const CONTACT_FORM_NAME = "contact";
export const CONTACT_FORM_ENDPOINT = "/__forms.html";
