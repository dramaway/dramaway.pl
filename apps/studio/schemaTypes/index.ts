import { aboutPage } from "./aboutPage";
import { blockContent, textColumns, youtube } from "./blockContent";
import { contentModule, contentTile, newsFeedModule } from "./contentModule";
import { edition } from "./edition";
import { editionOutcome } from "./editionOutcome";
import { landingPage } from "./landingPage";
import { navChild, navItem } from "./navItem";
import { page } from "./page";
import { person } from "./person";
import { project } from "./project";
import { publication } from "./publication";
import { readingMethod } from "./readingMethod";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  blockContent,
  youtube,
  textColumns,
  contentTile,
  contentModule,
  newsFeedModule,
  editionOutcome,
  edition,
  project,
  person,
  page,
  landingPage,
  navChild,
  navItem,
  readingMethod,
  publication,
  aboutPage,
  siteSettings,
];
