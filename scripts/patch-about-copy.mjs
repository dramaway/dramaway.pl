/**
 * One-shot: board copy under /fundacja team photos, and migrate
 * history.lead from a plain string to Portable Text.
 *
 * Does not touch people refs, history items, or values.
 *
 * Usage (from repo root):
 *   pnpm patch:about-copy            # write
 *   pnpm patch:about-copy -- --dry-run
 */

import { createClient } from "@sanity/client";
import { newKey } from "./lib/portable-text-repair.mjs";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID");
  process.exit(1);
}
if (!dryRun && !token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (needed unless --dry-run)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: dryRun ? token || undefined : token,
  useCdn: false,
});

const ABOUT_ID = "aboutPage";

function span(text, marks = []) {
  return { _type: "span", _key: newKey(), text, marks };
}

function block(style, children) {
  return {
    _type: "block",
    _key: newKey(),
    style,
    markDefs: [],
    children: Array.isArray(children) ? children : [span(children)],
  };
}

function roleLine(role, names) {
  return block("normal", [span(`${role}: `, ["em"]), span(names)]);
}

function stringToPortable(text) {
  return [block("normal", text)];
}

const teamBody = [
  block("h2", "Zespół"),
  roleLine(
    "Kierownictwo programowe i twórcze",
    "Adam Gąsecki, Aldona Żejmo-Kudelska",
  ),
  roleLine(
    "koordynatorki projektu Art Generacje",
    "Monika Zielińska, Aleksandra Szaro",
  ),
  roleLine("komunikacja", "Weronika Szmaja"),
  roleLine("księgowość", "Małgorzata Liwanowska, Ewa Olczak"),
  block(
    "normal",
    "Do wybranych działań zapraszamy twórców i twórczynie, którzy wzbogacają nasze działania o swoje metody pracy. Zapraszamy do zapoznania się z osobami współpracującymi przy opisach poszczególnych projektów.",
  ),
  block("h2", "Społeczność"),
  block(
    "normal",
    "Mamy poczucie, że jako Fundacja jesteśmy częścią większej Społeczności, która powstawała przez kolejne lata realizacji Art Generacji. Tworzą ją przede wszystkim Uczestniczki i Uczestnicy projektu, stali i wracający po „chwili” przerwy, wierni widzowie i widzki spektakli, animatorki i animatorzy kultury, praktyczki i praktycy Teatru Zaangażowanego Społecznie, przyglądający się naszym działaniom z ciekawością, a także osoby współpracujące z nami na różnych etapach naszej twórczej i fundacyjnej podróży.",
  ),
  block("normal", [
    span("Lubimy myśleć o nas jako Społeczności — że jesteśmy "),
    span("„zjednoczeni losem poszukiwaczek i odkrywców”", ["em"]),
    span(
      " — gotowych wyruszać w twórczą podróż w nieznane, badać i odkrywać różnorodne sensy poprzez twórcze metody pracy. Łączy nas przekonanie, że sztuka pozwala zbliżyć się do tajemnicy i Tajemnicy — że poprzez obraz, dźwięk, ruch czy słowo może nadać formę temu, co niewyrażalne. Że w ten sposób możemy znaleźć odpowiedzi na pytania, o których sformułowaniu intelekt mógłby tylko pomarzyć. Pielęgnujemy też wartość piękna, nawet jeśli możemy się różnić w jego definiowaniu.",
    ),
  ]),
  block(
    "normal",
    "Staramy się świadomie troszczyć o tę Społeczność — wspierać ją, ale też pozostawiać przestrzeń, by to ona wspierała nas.",
  ),
  block(
    "normal",
    "Świadomość, że są osoby, które czekają na następną edycję Art Generacji, wracają do wspólnych doświadczeń, rozmawiają o nich i planują kolejne spotkania wpływa na nasze decyzje o kontynuowaniu pracy i daje nam poczucie odpowiedzialności za coś większego niż pojedynczy projekt.",
  ),
  block(
    "normal",
    "Jednocześnie sama społeczność jest dla nas źródłem inspiracji. Obserwujemy, co uruchamiają w pracującej twórczo grupie poszczególne praktyki i sposoby pracy. To, czego wspólnie doświadczamy, wraca potem w naszych pomysłach i wpływa na kształt kolejnych edycji.",
  ),
  block(
    "normal",
    "Art Generacje są więc nie tylko projektem, który tworzymy dla naszej Społeczności. Są także projektem, który ta Społeczność współtworzy.",
  ),
];

const doc = await client.fetch(
  `*[_id == $id][0]{ _id, "heading": team.heading, "lead": history.lead }`,
  { id: ABOUT_ID },
);

if (!doc?._id) {
  console.error("aboutPage not found");
  process.exit(1);
}

const lead = doc.lead;
const leadIsString = typeof lead === "string";
const leadIsArray = Array.isArray(lead);
const migratedLead = leadIsString
  ? lead.trim()
    ? stringToPortable(lead.trim())
    : []
  : leadIsArray
    ? lead
    : [];

const patch = {
  "team.heading": "Zarząd",
  "team.body": teamBody,
};
if (leadIsString) {
  patch["history.lead"] = migratedLead;
}

console.log(
  `${dryRun ? "Would set" : "Setting"} team.heading: ${JSON.stringify(doc.heading)} → "Zarząd"`,
);
console.log(
  `${dryRun ? "Would set" : "Setting"} team.body (${teamBody.length} blocks)`,
);
if (leadIsString) {
  console.log(
    `${dryRun ? "Would migrate" : "Migrating"} history.lead string → Portable Text (${migratedLead.length} blocks)`,
  );
} else if (leadIsArray) {
  console.log(`history.lead already Portable Text (${lead.length} blocks) — leave`);
} else {
  console.log("history.lead empty — leave");
}

if (dryRun) {
  process.exit(0);
}

await client.patch(ABOUT_ID).set(patch).commit();
console.log("Wrote aboutPage team heading/body and history.lead (if migrated).");
