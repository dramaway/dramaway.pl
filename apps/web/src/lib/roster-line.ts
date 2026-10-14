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

export type RosterSpan = {
  _key?: string;
  text?: string;
  marks?: string[];
};

/**
 * Role and the spans that follow the first colon, so marks (a mailto link,
 * bold) survive. A line with no role returns the original spans.
 */
export function splitRosterSpanLine(spans: readonly RosterSpan[]): {
  role: string | null;
  nameSpans: RosterSpan[];
} {
  const text = spans.map((span) => span.text ?? "").join("");
  const { role } = splitRosterLine(text);
  if (!role) return { role: null, nameSpans: [...spans] };
  const cut = text.indexOf(":");
  let start = cut + 1;
  while (start < text.length && /\s/.test(text[start] ?? "")) start += 1;
  return { role, nameSpans: sliceRosterSpans(spans, start, text.length) };
}

/** One chip per comma or newline, with leading and trailing space removed. */
export function groupRosterNameSpans(spans: readonly RosterSpan[]): RosterSpan[][] {
  const groups: RosterSpan[][] = [];
  let current: RosterSpan[] = [];

  const flush = () => {
    const trimmed = trimSpanGroup(current);
    if (trimmed.length > 0) groups.push(trimmed);
    current = [];
  };

  for (const span of spans) {
    const text = span.text ?? "";
    let buf = "";
    const pushBuf = () => {
      if (!buf) return;
      current.push({ ...span, text: buf });
      buf = "";
    };
    for (const ch of text) {
      if (ch === "," || ch === "\n") {
        pushBuf();
        flush();
      } else {
        buf += ch;
      }
    }
    pushBuf();
  }
  flush();
  return groups;
}

function sliceRosterSpans(
  spans: readonly RosterSpan[],
  start: number,
  end: number,
): RosterSpan[] {
  const out: RosterSpan[] = [];
  let cursor = 0;
  for (const span of spans) {
    const text = span.text ?? "";
    const spanStart = cursor;
    const spanEnd = cursor + text.length;
    cursor = spanEnd;
    const from = Math.max(start, spanStart);
    const to = Math.min(end, spanEnd);
    if (from >= to) continue;
    out.push({
      ...span,
      text: text.slice(from - spanStart, to - spanStart),
    });
  }
  return out;
}

function trimSpanGroup(spans: RosterSpan[]): RosterSpan[] {
  if (spans.length === 0) return [];
  const copy = spans.map((span) => ({ ...span, text: span.text ?? "" }));
  copy[0] = { ...copy[0], text: copy[0].text.replace(/^\s+/, "") };
  const last = copy.length - 1;
  copy[last] = { ...copy[last], text: copy[last].text.replace(/\s+$/, "") };
  return copy.filter((span) => span.text.length > 0);
}
