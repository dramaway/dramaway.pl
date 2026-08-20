import { readFileSync, existsSync } from "fs";
import path from "path";

export type ExtractedItem = {
  nid: number;
  type: "page" | "person" | "news";
  drupalType: string;
  title: string;
  slug: string;
  path: string;
  bodyHtml: string;
  summary: string;
  photo?: string | null;
};

export type FundacjaExtract = {
  source: string;
  database: string;
  extractedAt: string;
  counts: { pages: number; people: number; news: number };
  pages: ExtractedItem[];
  people: ExtractedItem[];
  news: ExtractedItem[];
};

const empty: FundacjaExtract = {
  source: "",
  database: "drama_mfund",
  extractedAt: "",
  counts: { pages: 0, people: 0, news: 0 },
  pages: [],
  people: [],
  news: [],
};

export function getFundacjaExtract(): FundacjaExtract {
  const file = path.join(
    process.cwd(),
    "src/data/extracted/fundacja.json",
  );
  if (!existsSync(file)) {
    return empty;
  }
  return JSON.parse(readFileSync(file, "utf8")) as FundacjaExtract;
}
