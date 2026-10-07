/**
 * Turn free-text credits in Portable Text into the `credits` block.
 *
 * Editions were written three ways: a bullet list of `role: names`, one
 * paragraph per role, or a single paragraph with `\n` between roles. All three
 * are read here; the result is reviewed by hand in `scripts/project-credits.json`
 * before anything is written back. See docs/HANDOFF.md — guessing roles from
 * colons was deliberately avoided at runtime, so it happens once, offline.
 */

/** Group order on the page. */
export const GROUP_ORDER = [
  "Autorstwo",
  "Obsada",
  "Realizacja artystyczna",
  "Produkcja",
  "Partnerzy",
];

/** role fragment (lowercased, no diacritics folding) → group */
const GROUP_RULES = [
  [/^(koncepcja projektu|opieka merytoryczna|koncepcja i prowadzenie|autorki|autor)/, "Autorstwo"],
  [/^(scenariusz|rezyseria|reżyseria|monologi|dramaturgia)/, "Autorstwo"],
  [/^(obsada|osoby tworzace|osoby tworzące|wystepuja|występują|aktorki)/, "Obsada"],
  [/^(koordynacja|produkcja|promocja|zoom|obsluga techniczna|obsługa techniczna)/, "Produkcja"],
  [/^(partner|partnerzy|sponsor|wspolpraca|współpraca)/, "Partnerzy"],
];

/** Anything role-like that is not matched above is a craft credit. */
const DEFAULT_GROUP = "Realizacja artystyczna";

/**
 * A cast reads as a wrapping sequence of first names, not as one name per
 * line — twenty-five rows of a table where a paragraph would do.
 */
const CAST_ROLE = /^(obsada|osoby tworzace|osoby tworzące|wystepuja|występują|aktorki)/;

/** Qualifiers that belong under the role, not inside its name. */
const NOTE_SPLIT = /,\s*(w tym\s.+)$/i;

/** Separators a redactor used instead of a colon. */
const DASH_SEPARATOR = /\s+[–—-]\s+/;

const HEADING_WORDS = /^(tworcy|twórcy|tworczynie i tworcy|tworcy i tworczynie)$/i;

/** Closing line that is a funding note, not a role. */
const NOTE_LINE =
  /(wspolfinansowan|współfinansowan|dofinansowan|sfinansowan|ze srodkow|ze środków|zrealizowano w ramach)/i;

/** Collapse the `&nbsp;` leftovers from Drupal and tidy spacing. */
export function normalizeText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

/** Flattened text of a Portable Text block, newlines kept. */
export function blockText(block) {
  if (!block || block._type !== "block") return "";
  return (block.children ?? [])
    .map((child) => (child?._type === "span" ? (child.text ?? "") : ""))
    .join("");
}

/** Every link href a block carries, so the report can list what is dropped. */
export function blockLinks(block) {
  return (block?.markDefs ?? [])
    .filter((def) => def?._type === "link" && def.href)
    .map((def) => def.href);
}

/** Normalise a role for dictionary lookup. */
function roleKey(role) {
  return role
    .toLowerCase()
    .replace(/[„”"“']/g, "")
    .trim();
}

/** Which group a role belongs to. */
export function groupForRole(role) {
  const key = roleKey(role);
  for (const [pattern, group] of GROUP_RULES) {
    if (pattern.test(key)) return group;
  }
  return DEFAULT_GROUP;
}

/**
 * A half-open quote means the line was cut mid-sentence ("Spektakl \"404"),
 * so it is prose. A balanced pair is fine — one real role quotes a title
 * ("Oprawa oświetleniowa spektaklu „Tańczące z cieniami”").
 */
function unbalancedQuotes(text) {
  const open = (text.match(/[„“»]/gu) ?? []).length;
  const close = (text.match(/[”«]/gu) ?? []).length;
  const straight = (text.match(/"/gu) ?? []).length;
  return open !== close || straight % 2 !== 0;
}

/** A full stop followed by a capital is a sentence, not a list of names. */
const SENTENCE = /[.!?]\s/;

/**
 * Split one written line into role, optional qualifier and people.
 * Returns null when the line does not read as a credit at all.
 *
 * Deliberately strict: the dataset mixes credits with prose that happens to
 * contain a colon ("Spektakl \"404: Los not found. …\""), and a false positive
 * would quietly move a paragraph of body copy into the credits block.
 */
export function parseCreditLine(line) {
  const text = normalizeText(line).replace(/\n/g, " ");
  if (!text) return null;

  let role = null;
  let people = null;
  let separator = "colon";

  const colon = text.indexOf(":");
  if (colon > 0) {
    role = text.slice(0, colon).trim();
    people = text.slice(colon + 1).trim();
  } else {
    const dash = text.match(DASH_SEPARATOR);
    if (dash && dash.index > 0) {
      role = text.slice(0, dash.index).trim();
      people = text.slice(dash.index + dash[0].length).trim();
      separator = "dash";
    }
  }

  if (!role || !people) return null;

  // Pull the qualifier out before measuring the role — the longest role in the
  // dataset is only long because it carries one.
  let note = null;
  const noteMatch = role.match(NOTE_SPLIT);
  if (noteMatch) {
    note = noteMatch[1].trim();
    role = role.slice(0, noteMatch.index).trim();
  }
  if (!role) return null;

  if (role.length > 90 || SENTENCE.test(role) || unbalancedQuotes(role)) {
    return null;
  }
  // The longest real role in the dataset is six words
  // ("Opieka merytoryczna, prowadzenie grup i reżyseria"); anything longer is
  // a sentence that ends in a colon.
  if (role.split(/\s+/).length > 7) return null;
  if (people.length > 600 || SENTENCE.test(people) || unbalancedQuotes(people)) {
    return null;
  }

  // A dash is a weak signal — a title and its subtitle look the same. Accept it
  // only for a short, plain role followed by something that starts like a name.
  if (separator === "dash") {
    if (role.length > 40 || /\d/.test(role)) return null;
    if (people.length > 120) return null;
    if (!/^\p{Lu}/u.test(people)) return null;
  }

  return { role, note, people, separator };
}

/** Styles that are never a credit row. */
const NON_ROW_STYLES = new Set(["h1", "h2", "h3", "h4", "blockquote", "term"]);

/** Is this block a line (or a run of lines) of credits? */
function creditLinesOf(block) {
  if (!block || block._type !== "block") return [];
  if (NON_ROW_STYLES.has(block.style ?? "normal")) return [];
  const text = blockText(block);
  if (!normalizeText(text)) return [];
  const lines = normalizeText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const parsed = lines.map(parseCreditLine);
  if (parsed.length === 0) return [];
  const hits = parsed.filter(Boolean).length;
  // One line must parse; a multi-line block needs a clear majority, so prose
  // with a stray colon is never mistaken for a list.
  if (lines.length === 1) return parsed[0] ? [parsed[0]] : [];
  return hits >= Math.ceil(lines.length * 0.7) ? parsed : [];
}

function isHeadingBlock(block) {
  if (!block || block._type !== "block") return false;
  const style = block.style ?? "normal";
  const text = normalizeText(blockText(block));
  if (!text) return false;
  // Never h2: on a project afterword an h2 is the accordion title that
  // `splitPortableByHeading` needs, so it must stay in the body.
  if (style === "h3" || style === "h4") return true;
  // A paragraph that is entirely bold and short works as a heading too —
  // that is how the older editions titled each spectacle.
  const children = block.children ?? [];
  const allStrong =
    children.length > 0 &&
    children.every(
      (child) =>
        (child.text ?? "").trim() === "" ||
        (child.marks ?? []).includes("strong"),
    );
  if (allStrong && text.length <= 120 && !text.endsWith(".")) return true;
  // "VI Edycja Art Generacje - Harmonia:" — a plain line that only announces
  // the list below it.
  return (
    text.endsWith(":") && text.length <= 120 && text.indexOf(":") === text.length - 1
  );
}

function headingLabel(block) {
  const text = normalizeText(blockText(block)).replace(/:$/, "").trim();
  return HEADING_WORDS.test(text) ? "Twórcy" : text;
}

/**
 * Find every run of credit lines in a Portable Text array.
 *
 * Each find carries the `_key`s it covers, so the writer can locate the run
 * again without trusting indexes.
 */
export function findCreditRuns(blocks) {
  const list = Array.isArray(blocks) ? blocks : [];
  const runs = [];
  let index = 0;

  while (index < list.length) {
    const lines = creditLinesOf(list[index]);
    if (lines.length === 0) {
      index += 1;
      continue;
    }

    const start = index;
    const collected = [];
    while (index < list.length) {
      const next = creditLinesOf(list[index]);
      if (next.length === 0) break;
      collected.push({ block: list[index], lines: next });
      index += 1;
    }

    // A single unparsed line is not a list.
    const parsedCount = collected.reduce(
      (total, entry) => total + entry.lines.filter(Boolean).length,
      0,
    );
    if (parsedCount === 0) continue;

    const headingBlock =
      start > 0 && isHeadingBlock(list[start - 1]) ? list[start - 1] : null;

    // A funding line right after the run belongs to the credits, not the body.
    let noteBlock = null;
    if (index < list.length && list[index]?._type === "block") {
      const text = normalizeText(blockText(list[index]));
      if (text && NOTE_LINE.test(text) && text.length <= 300) {
        noteBlock = list[index];
        index += 1;
      } else if (text === "" && index + 1 < list.length) {
        const after = list[index + 1];
        const afterText = normalizeText(blockText(after));
        if (afterText && NOTE_LINE.test(afterText) && afterText.length <= 300) {
          noteBlock = after;
          index += 2;
        }
      }
    }

    runs.push(buildRun({ collected, headingBlock, noteBlock }));
  }

  return runs;
}

function buildRun({ collected, headingBlock, noteBlock }) {
  const warnings = [];
  const links = [];
  const rows = [];

  for (const entry of collected) {
    links.push(...blockLinks(entry.block));
    entry.lines.forEach((line, lineIndex) => {
      if (!line) {
        warnings.push(
          `nieprzeczytana linia: ${JSON.stringify(
            normalizeText(blockText(entry.block)).split("\n")[lineIndex] ?? "",
          )}`,
        );
        return;
      }
      if (line.separator === "dash") {
        warnings.push(`rozdzielone półpauzą, nie dwukropkiem: "${line.role}"`);
      }
      if (line.note) {
        warnings.push(`dopisek wyjęty z nazwy roli: "${line.role}" — "${line.note}"`);
      }
      rows.push({ ...line, group: groupForRole(line.role) });
    });
  }

  const groups = [];
  for (const name of GROUP_ORDER) {
    const inGroup = rows.filter((row) => row.group === name);
    if (inGroup.length === 0) continue;
    groups.push({
      title: name,
      rows: inGroup.map((row) =>
        CAST_ROLE.test(roleKey(row.role))
          ? {
              _type: "creditNames",
              label: row.role,
              people: row.people,
            }
          : {
              _type: "creditRow",
              role: row.role,
              ...(row.note ? { note: row.note } : {}),
              people: row.people,
            },
      ),
    });
  }

  const heading = headingBlock ? headingLabel(headingBlock) : null;
  if (headingBlock && heading !== "Twórcy") {
    warnings.push(`nagłówek wykazu przeniesiony z treści: "${heading}"`);
  }
  if (links.length > 0) {
    warnings.push(`linki do starego Drupala zostaną zgubione: ${links.join(", ")}`);
  }

  const keys = collected.map((entry) => entry.block._key).filter(Boolean);
  if (headingBlock?._key) keys.unshift(headingBlock._key);
  if (noteBlock?._key) keys.push(noteBlock._key);

  return {
    replaceKeys: keys,
    credits: {
      _type: "credits",
      ...(heading ? { heading } : {}),
      groups,
      ...(noteBlock ? { note: normalizeText(blockText(noteBlock)) } : {}),
    },
    warnings,
  };
}

/**
 * A flat list of names under a heading (project afterword) — no roles.
 * Returned as a one-row credits block so it renders like every other list.
 */
export function namesRunFromBlock(block, label) {
  const text = normalizeText(blockText(block));
  if (!text) return null;
  return {
    replaceKeys: [block._key].filter(Boolean),
    credits: {
      _type: "credits",
      groups: [
        {
          title: null,
          rows: [
            {
              _type: "creditNames",
              ...(label ? { label } : {}),
              people: text,
            },
          ],
        },
      ],
    },
    warnings: blockLinks(block).length
      ? [`linki do starego Drupala zostaną zgubione: ${blockLinks(block).join(", ")}`]
      : [],
  };
}

/**
 * Word bag for the no-loss check. Punctuation and separators change by design
 * (a colon becomes a column, a comma becomes a row); words must not.
 */
export function wordBag(text) {
  return normalizeText(text)
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .sort();
}

/** Words read straight off the original blocks. */
export function blocksWordBag(blocks) {
  return wordBag((blocks ?? []).map(blockText).join("\n"));
}

/** Words carried by a credits block. */
export function creditsWordBag(credits) {
  const parts = [];
  if (credits?.heading) parts.push(credits.heading);
  if (credits?.note) parts.push(credits.note);
  for (const group of credits?.groups ?? []) {
    for (const row of group?.rows ?? []) {
      if (row.role) parts.push(row.role);
      if (row.label) parts.push(row.label);
      if (row.note) parts.push(row.note);
      if (row.people) parts.push(row.people);
    }
  }
  return wordBag(parts.join("\n"));
}

/** Words present in `a` but missing from `b`, counted. */
export function missingWords(a, b) {
  const left = [...a];
  const counts = new Map();
  for (const word of b) counts.set(word, (counts.get(word) ?? 0) + 1);
  const missing = [];
  for (const word of left) {
    const seen = counts.get(word) ?? 0;
    if (seen > 0) counts.set(word, seen - 1);
    else missing.push(word);
  }
  return missing;
}
