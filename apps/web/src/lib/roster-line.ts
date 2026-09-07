/** Split a Portable Text Roles line on the first colon. */
export function splitRosterLine(text: string): {
  role: string | null;
  names: string;
} {
  const trimmed = text.trim();
  const cut = trimmed.indexOf(":");
  if (cut <= 0) return { role: null, names: trimmed };
  const role = trimmed.slice(0, cut).trim();
  const names = trimmed.slice(cut + 1).trim();
  return { role: role || null, names };
}
