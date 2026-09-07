/**
 * Reshape completed-project Portable Text onto the existing project IA:
 * editions, edition outcomes, afterword FoldList, Columns, partners.
 *
 * Does not invent copy. Does not turn a one-cycle project into fake editions.
 */

import { newKey } from "./portable-text-repair.mjs";

const IMAGE_REF_SIZE = /-(\d+)x(\d+)-[a-z0-9]+$/i;

export const FORUM_TRACK = "Teatr Forum";
export const COMMUNITY_TRACK = "Teatr ze Społecznością";

const HEADING_TITLES = {
  "zespół projektowy": "Zespół",
  zespół: "Zespół",
  dziękujemy: "Dziękujemy",
  partnerzy: "Partnerzy",
  sponsorzy: "Sponsorzy",
};

const DESCRIPTION_START =
  /^(spektakl|przedstawienie|przestawienie|adresatami|etiuda)\b/i;

export function blockText(block) {
  if (!block || block._type !== "block") return "";
  return (block.children || []).map((child) => child.text || "").join("");
}

export function normalizedText(block) {
  return blockText(block)
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyHeading(block) {
  if (!block || block._type !== "block") return false;
  if (block.style !== "h2" && block.style !== "h3") return false;
  return normalizedText(block) === "";
}

export function isHeading(block, pattern) {
  if (!block || block._type !== "block") return false;
  if (block.style !== "h2" && block.style !== "h3") return false;
  return pattern.test(normalizedText(block));
}

export function findHeadingIndex(blocks, pattern, from = 0) {
  const list = blocks || [];
  for (let i = from; i < list.length; i++) {
    if (isHeading(list[i], pattern)) return i;
  }
  return -1;
}

export function softenTitle(text) {
  const raw = (text || "").replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
  if (!raw) return raw;
  const letters = raw.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "");
  if (!letters) return raw;
  if (letters !== letters.toUpperCase()) return raw;
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

export function sentenceHeading(text) {
  const normalized = (text || "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const mapped = HEADING_TITLES[normalized.toLowerCase()];
  if (mapped) return mapped;
  return softenTitle(normalized);
}

export function parseYear(text) {
  const match = String(text || "").match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : undefined;
}

export function unwrapDrupalLines(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) {
    return block;
  }
  const children = [];
  for (const child of block.children) {
    const text = child?.text ?? "";
    const marks = child?.marks;
    const wrap =
      text === "\n" && (!marks || marks.length === 0) && children.length > 0;
    if (wrap) {
      const prev = children[children.length - 1];
      if (prev?.text && !prev.text.endsWith(" ") && !prev.text.endsWith("\n")) {
        children[children.length - 1] = { ...prev, text: `${prev.text} ` };
      }
      continue;
    }
    children.push({
      ...child,
      text: text.replace(/\n/g, " "),
    });
  }
  if (children[0]?.text) {
    children[0] = {
      ...children[0],
      text: children[0].text.replace(/^[\u00A0\s]+/, ""),
    };
  }
  return { ...block, children };
}

export function cloneBlock(block) {
  if (!block || typeof block !== "object") return block;
  if (block._type === "image") {
    return withWideBanner({ ...block, _key: newKey() });
  }
  if (block._type === "youtube") {
    return { ...block, _key: newKey() };
  }
  if (block._type === "textColumns") {
    return {
      ...block,
      _key: newKey(),
      columns: (block.columns || []).map((column) => ({
        ...column,
        _key: newKey(),
        body: (column.body || []).map((item) => cloneBlock(item)),
      })),
    };
  }
  const next = {
    ...block,
    _key: newKey(),
    children: (block.children || []).map((child) => ({
      ...child,
      _key: newKey(),
    })),
  };
  return unwrapDrupalLines(next);
}

function assetRef(image) {
  const asset = image?.asset;
  if (typeof asset === "string") return asset;
  if (asset && typeof asset === "object") {
    if (typeof asset._ref === "string") return asset._ref;
    if (typeof asset._id === "string") return asset._id;
  }
  return "";
}

function withWideBanner(image) {
  const match = assetRef(image).match(IMAGE_REF_SIZE);
  if (!match) return image;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return image;
  if (width / height < 2.5) return image;
  if (image.size) return image;
  return { ...image, size: "wide" };
}

export function headingBlock(title, style = "h2") {
  return {
    _type: "block",
    _key: newKey(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: newKey(),
        marks: [],
        text: title,
      },
    ],
  };
}

function isImage(block) {
  return Boolean(block && block._type === "image" && assetRef(block));
}

function isYoutube(block) {
  return Boolean(block && block._type === "youtube" && block.url);
}

function looksLikeConcatenatedSpectacle(text) {
  return (
    /\bpremiera\b/i.test(text) &&
    DESCRIPTION_START.test(text.replace(/^[\s\S]*?\bpremiera\b[^\n]*\n?/i, ""))
  );
}

export function splitConcatenatedSpectacle(text) {
  const raw = (text || "").replace(/\u00A0/g, " ").replace(/\r/g, "");
  const lines = raw
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (lines.length >= 3) {
    const premiereIndex = lines.findIndex((line) => /^premiera\b/i.test(line));
    const descriptionIndex = lines.findIndex((line) =>
      DESCRIPTION_START.test(line),
    );
    if (premiereIndex > 0 && descriptionIndex > premiereIndex) {
      return {
        title: lines[0],
        creditLines: lines.slice(1, premiereIndex),
        premiereLine: lines[premiereIndex],
        year: parseYear(lines[premiereIndex]),
        description: lines.slice(descriptionIndex).join(" "),
      };
    }
  }
  const premiere = raw.match(/premiera[:\s]+(?:19|20)\d{2}(?:\s*rok)?/i);
  const descriptionMatch = raw.match(
    /(spektakl|przedstawienie|przestawienie|adresatami|etiuda)\b[\s\S]+/i,
  );
  const beforePremiere = premiere
    ? raw.slice(0, premiere.index).replace(/\s+/g, " ").trim()
    : raw.replace(/\s+/g, " ").trim();
  const [title, ...credits] = beforePremiere.split(/(?=\bopieka\b|\breżyseria\b)/i);
  return {
    title: (title || "").trim(),
    creditLines: credits.map((line) => line.trim()).filter(Boolean),
    premiereLine: premiere ? premiere[0].trim() : "",
    year: parseYear(premiere ? premiere[0] : raw),
    description: descriptionMatch
      ? descriptionMatch[0].replace(/\s+/g, " ").trim()
      : "",
  };
}

export function parseSpectacleRun(blocks, track) {
  const items = [];
  let current = null;

  const flush = () => {
    if (current?.title) items.push(current);
    current = null;
  };

  for (const block of blocks || []) {
    if (isEmptyHeading(block)) continue;
    if (isImage(block)) {
      flush();
      current = {
        track,
        image: block,
        title: "",
        creditLines: [],
        premiereLine: "",
        year: undefined,
        description: "",
      };
      continue;
    }
    const text = normalizedText(block);
    if (!text || !current) continue;

    const fullText = blockText(block);
    if (!current.title && looksLikeConcatenatedSpectacle(fullText)) {
      const split = splitConcatenatedSpectacle(fullText);
      current.title = split.title;
      current.creditLines = split.creditLines;
      current.premiereLine = split.premiereLine;
      current.year = split.year;
      current.description = split.description;
      continue;
    }
    if (!current.title) {
      current.title = text;
      continue;
    }
    if (/^premiera\b/i.test(text)) {
      current.premiereLine = text;
      current.year = parseYear(text);
      continue;
    }
    if (DESCRIPTION_START.test(text)) {
      current.description = text;
      continue;
    }
    current.creditLines.push(text);
  }
  flush();
  return items;
}

function joinCredits(lines) {
  const cleaned = (lines || [])
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (cleaned.length === 0) return "";
  const merged = [];
  for (const line of cleaned) {
    const prev = merged[merged.length - 1];
    if (prev && /[:：]$/.test(prev)) {
      merged[merged.length - 1] = `${prev} ${line}`;
    } else {
      merged.push(line);
    }
  }
  return merged.join(" · ");
}

export function spectacleToOutcome(item) {
  const title = softenTitle(item.title);
  const subtitle = [item.track, joinCredits(item.creditLines), item.premiereLine]
    .filter(Boolean)
    .join(" · ");
  const image = item.image
    ? {
        ...cloneBlock(item.image),
        alt: item.image.alt || title,
      }
    : undefined;
  return {
    _type: "editionOutcome",
    _key: newKey(),
    title,
    ...(subtitle ? { subtitle } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(image ? { image } : {}),
  };
}

export function spectaclesToEditions(items) {
  const years = [
    ...new Set(items.map((item) => item.year).filter((year) => year != null)),
  ].sort((a, b) => a - b);

  return years.map((year) => {
    const yearItems = items.filter((item) => item.year === year);
    const outcomes = yearItems.map((item) => spectacleToOutcome(item));
    const summary = outcomes.map((outcome) => outcome.title).join(" · ");
    return {
      _type: "edition",
      _key: newKey(),
      title: `Edycja ${year}`,
      slug: { _type: "slug", current: `edycja-${year}` },
      year,
      years: String(year),
      summary,
      body: [],
      outcomes,
    };
  });
}

function sliceExclusive(blocks, start, end) {
  if (start < 0) return [];
  return (blocks || []).slice(start, end < 0 ? undefined : end);
}

function firstYoutube(blocks) {
  return (blocks || []).find(isYoutube) || null;
}

function nonEmptyBlocks(blocks) {
  return (blocks || []).filter((block) => {
    if (!block) return false;
    if (isEmptyHeading(block)) return false;
    if (block._type !== "block") return true;
    return normalizedText(block) !== "";
  });
}

export function reshapeTeatrCodzienny(body) {
  const blocks = body || [];
  const forumH2 = findHeadingIndex(blocks, /^teatr forum$/i);
  const forumScripts = findHeadingIndex(
    blocks,
    /^scenariusze spektakli/i,
    Math.max(forumH2, 0),
  );
  const forumTeam = findHeadingIndex(
    blocks,
    /^zesp[oó]ł projektowy$/i,
    Math.max(forumScripts, 0),
  );
  const communityH2 = findHeadingIndex(
    blocks,
    /^teatr ze spo[łl]eczno[śs]ci[ąa]$/i,
  );
  const communityActions = findHeadingIndex(
    blocks,
    /^dzia[łl]ania zrealizowane/i,
    Math.max(communityH2, 0),
  );
  const communityTeam = findHeadingIndex(
    blocks,
    /^zesp[oó]ł projektowy$/i,
    Math.max(communityActions, 0),
  );
  const thanksH2 = findHeadingIndex(blocks, /^dzi[ęe]kujemy$/i);
  const partnersH2 = findHeadingIndex(blocks, /^partnerzy$/i);
  const sponsorsH2 = findHeadingIndex(blocks, /^sponsorzy$/i);

  if (forumH2 < 0 || communityH2 < 0 || forumScripts < 0 || communityActions < 0) {
    throw new Error("Teatr Codzienny: missing method or spectacle headings");
  }

  const introBlocks = sliceExclusive(blocks, 0, forumH2);
  const introText = introBlocks
    .map((block) => normalizedText(block))
    .find((text) => text);
  const banner = introBlocks.find(isImage);

  const forumDesc = nonEmptyBlocks(
    sliceExclusive(blocks, forumH2 + 1, forumScripts),
  );
  const forumSpectacles = parseSpectacleRun(
    sliceExclusive(blocks, forumScripts + 1, forumTeam),
    FORUM_TRACK,
  );
  const forumTeamBlocks = sliceExclusive(
    blocks,
    forumTeam + 1,
    communityH2,
  );
  const forumYoutube = firstYoutube(forumTeamBlocks);
  const forumTeamPara = forumTeamBlocks.find(
    (block) => block._type === "block" && normalizedText(block),
  );

  const communityDesc = nonEmptyBlocks(
    sliceExclusive(blocks, communityH2 + 1, communityActions),
  );
  const communitySpectacles = parseSpectacleRun(
    sliceExclusive(blocks, communityActions + 1, communityTeam),
    COMMUNITY_TRACK,
  );
  const afterCommunityTeam = sliceExclusive(
    blocks,
    communityTeam + 1,
    thanksH2,
  );
  const communityYoutube = firstYoutube(afterCommunityTeam);
  const communityTeamPara = afterCommunityTeam.find(
    (block) => block._type === "block" && normalizedText(block),
  );
  const closingBanner = afterCommunityTeam.find(isImage);

  const spectacles = [...forumSpectacles, ...communitySpectacles];
  const editions = spectaclesToEditions(spectacles);
  if (editions.length !== 6) {
    throw new Error(
      `Teatr Codzienny: expected 6 editions, got ${editions.length}`,
    );
  }
  if (spectacles.length !== 20) {
    throw new Error(
      `Teatr Codzienny: expected 20 spectacles, got ${spectacles.length}`,
    );
  }

  const partnersText =
    partnersH2 >= 0
      ? normalizedText(blocks[partnersH2 + 1] || {})
      : "";
  const partners = partnersText
    ? partnersText
        .split(",")
        .map((name) => name.replace(/\s+/g, " ").trim())
        .filter(Boolean)
    : [];

  const projectBody = [
    banner ? cloneBlock(banner) : null,
    headingBlock(FORUM_TRACK),
    ...forumDesc.map((block) => cloneBlock(block)),
    forumYoutube ? cloneBlock(forumYoutube) : null,
    headingBlock(COMMUNITY_TRACK),
    ...communityDesc.map((block) => cloneBlock(block)),
    communityYoutube ? cloneBlock(communityYoutube) : null,
  ].filter(Boolean);

  const afterword = [
    closingBanner ? cloneBlock(closingBanner) : null,
    headingBlock("Zespół — Teatr Forum"),
    forumTeamPara ? cloneBlock(forumTeamPara) : null,
    headingBlock("Zespół — Teatr ze Społecznością"),
    communityTeamPara ? cloneBlock(communityTeamPara) : null,
    headingBlock("Dziękujemy"),
    thanksH2 >= 0 && blocks[thanksH2 + 1]
      ? cloneBlock(blocks[thanksH2 + 1])
      : null,
    headingBlock("Sponsorzy"),
    ...sliceExclusive(
      blocks,
      sponsorsH2 + 1,
      blocks.length,
    )
      .filter(isImage)
      .map((image) => cloneBlock(image)),
  ].filter(Boolean);

  return {
    summary: introText || "",
    body: projectBody,
    editions,
    afterword,
    partners,
  };
}

export function splitAfterword(body) {
  const blocks = body || [];
  const firstH2 = blocks.findIndex(
    (block) => block?._type === "block" && block.style === "h2",
  );
  if (firstH2 < 0) {
    return { body: blocks.map((block) => cloneBlock(block)), afterword: [] };
  }
  const preamble = blocks.slice(0, firstH2).map((block) => cloneBlock(block));
  const afterword = [];
  for (const block of blocks.slice(firstH2)) {
    if (isHeading(block, /./) && block.style === "h2") {
      afterword.push(headingBlock(sentenceHeading(normalizedText(block))));
      continue;
    }
    afterword.push(cloneBlock(block));
  }
  return { body: preamble, afterword };
}

export function reshapeToMiGra(body) {
  const { body: preamble, afterword } = splitAfterword(body);
  const cleanedBody = preamble.map((block) => unwrapDrupalLines(block));
  const summary =
    cleanedBody.map((block) => normalizedText(block)).find((text) => text) ||
    "";
  return {
    summary,
    body: cleanedBody,
    afterword,
  };
}

export function reshapeBoalPractice(body) {
  const blocks = (body || []).map((block) => unwrapDrupalLines(block));
  const image = blocks.find(isImage);
  const enMarker = blocks.findIndex(
    (block) => normalizedText(block).toLowerCase() === "[en]",
  );
  if (enMarker < 0) {
    throw new Error("BOAL IN PRACTICE: missing [EN] marker");
  }
  const start = image ? 1 : 0;
  const pl = nonEmptyBlocks(blocks.slice(start, enMarker));
  const en = nonEmptyBlocks(blocks.slice(enMarker + 1));
  const summary = normalizedText(pl[0]) || "";
  const columns = {
    _type: "textColumns",
    _key: newKey(),
    columns: [
      {
        _type: "column",
        _key: newKey(),
        body: pl.map((block) => cloneBlock(block)),
      },
      {
        _type: "column",
        _key: newKey(),
        body: [
          headingBlock("English", "h3"),
          ...en.map((block) => cloneBlock(block)),
        ],
      },
    ],
  };
  return {
    summary,
    body: [image ? cloneBlock(image) : null, columns].filter(Boolean),
  };
}

export function reshapeWieloglos(body) {
  const blocks = body || [];
  const image = blocks.find(isImage);
  const paragraphs = blocks.filter(
    (block) =>
      block?._type === "block" &&
      block.style === "normal" &&
      normalizedText(block),
  );
  const coordinator = paragraphs.find((block) =>
    /^koordynator projektu/i.test(normalizedText(block)),
  );
  const story = paragraphs.filter((block) => block !== coordinator);
  const summary = story[0] ? normalizedText(story[0]) : "";
  return {
    title: "Wielogłos",
    slug: "wieloglos",
    summary,
    body: [
      image ? cloneBlock(image) : null,
      ...story.map((block) => cloneBlock(block)),
    ].filter(Boolean),
    afterword: coordinator
      ? [headingBlock("Zespół"), cloneBlock(coordinator)]
      : [],
  };
}

export function teatrCodziennyIsFlat(body) {
  return findHeadingIndex(body || [], /^scenariusze spektakli/i) >= 0;
}

export function boalIsFlat(body) {
  return (body || []).some(
    (block) => normalizedText(block).toLowerCase() === "[en]",
  );
}

export function toMiGraIsFlat(body, afterword) {
  if (afterword && afterword.length > 0) return false;
  return (body || []).some((block) =>
    isHeading(block, /^zesp[oó]ł projektowy$/i),
  );
}
