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

/** Split roster names into separate display lines. */
export function splitRosterNames(names: string): string[] {
  const entries = names
    .split(/,|\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return entries.length > 0 ? entries : [names.trim()].filter(Boolean);
}
