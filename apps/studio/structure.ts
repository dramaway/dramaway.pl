import type { StructureBuilder, StructureResolver } from "sanity/structure";
import {
  deskNavFromSettings,
  pageDocumentIds,
  type DeskNavEntry,
  type DeskNavSource,
} from "./desk-nav";
import {
  ABOUT_PAGE_ID,
  ART_GENERACJE_ID,
  LANDING_PAGES,
  SINGLETON_SCHEMA_TYPES,
} from "./singletons";
import {
  DRUPAL_PAGE_SLUGS,
  PAGE_DRUPAL_FILTER,
  PAGE_MENU_FILTER,
  PAGE_REST_FILTER,
  pageDeskIds,
} from "./page-desk";

/** Document types the media plugin registers — edit them in the Media tool. */
const MEDIA_PLUGIN_TYPES = new Set(["media.tag", "media.folder"]);

type ListItem = ReturnType<StructureBuilder["listItem"]>;

type SettingsRow = {
  _id: string;
  navigation: DeskNavSource[] | null;
};

function singletonItem(
  S: StructureBuilder,
  opts: { id: string; title: string; schemaType: string; documentId: string },
): ListItem {
  return S.listItem()
    .title(opts.title)
    .id(opts.id)
    .schemaType(opts.schemaType)
    .child(
      S.document()
        .schemaType(opts.schemaType)
        .documentId(opts.documentId)
        .title(opts.title),
    );
}

function navListItem(S: StructureBuilder, entry: DeskNavEntry): ListItem {
  if (entry.children.length === 0) {
    return singletonItem(S, entry);
  }

  return S.listItem()
    .id(entry.id)
    .title(entry.title)
    .schemaType(entry.schemaType)
    .child(
      S.list()
        .title(entry.title)
        .items([
          singletonItem(S, {
            id: `${entry.id}-open`,
            title: entry.title,
            schemaType: entry.schemaType,
            documentId: entry.documentId,
          }),
          ...entry.children.map((child) => navListItem(S, child)),
        ]),
    );
}

function landingShortcut(S: StructureBuilder, route: (typeof LANDING_PAGES)[number]["route"]) {
  const landing = LANDING_PAGES.find((item) => item.route === route);
  if (!landing) return null;
  return singletonItem(S, {
    id: landing.id,
    title: landing.title,
    schemaType: "landingPage",
    documentId: landing.id,
  });
}

/** Shortcuts used when `siteSettings.navigation` has no openable documents. */
function fallbackShortcuts(
  S: StructureBuilder,
  ids: {
    artGeneracje: string | null;
    knowledge: string | null;
    kontakt: string | null;
  },
) {
  return [
    landingShortcut(S, "projekty"),
    ids.artGeneracje
      ? singletonItem(S, {
          id: "artGeneracje",
          title: "Art Generacje",
          schemaType: "project",
          documentId: ids.artGeneracje,
        })
      : null,
    ids.knowledge
      ? singletonItem(S, {
          id: "page-baza-wiedzy",
          title: "Baza wiedzy",
          schemaType: "page",
          documentId: ids.knowledge,
        })
      : null,
    landingShortcut(S, "czytelnia"),
    singletonItem(S, {
      id: ABOUT_PAGE_ID,
      title: "O fundacji",
      schemaType: "aboutPage",
      documentId: ABOUT_PAGE_ID,
    }),
    ids.kontakt
      ? singletonItem(S, {
          id: "page-kontakt",
          title: "Kontakt",
          schemaType: "page",
          documentId: ids.kontakt,
        })
      : null,
    landingShortcut(S, "zespol"),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: "2025-01-01" });
  const ids: {
    siteSettings: SettingsRow | null;
    artGeneracje: string | null;
    knowledge: string | null;
    kontakt: string | null;
  } = await client.fetch(
    `{
      "siteSettings": *[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
        _id,
        "navigation": coalesce(
          *[_id == "drafts." + ^._id][0].navigation,
          navigation
        )[]{
          _key,
          label,
          target,
          "pageId": page._ref,
          "pageType": page->_type,
          "pageTitle": coalesce(page->title, page->name),
          children[]{
            _key,
            label,
            target,
            "pageId": page._ref,
            "pageType": page->_type,
            "pageTitle": coalesce(page->title, page->name)
          }
        }
      },
      "artGeneracje": *[_type == "project" && !(_id in path("drafts.**")) && (_id == $artId || slug.current == "art-generacje")][0]._id,
      "knowledge": *[_type == "page" && !(_id in path("drafts.**")) && slug.current == "baza-wiedzy"][0]._id,
      "kontakt": *[_type == "page" && !(_id in path("drafts.**")) && slug.current == "kontakt"][0]._id
    }`,
    { artId: ART_GENERACJE_ID },
  );

  const settingsId = ids.siteSettings?._id ?? null;
  const fromMenu = deskNavFromSettings(ids.siteSettings?.navigation, settingsId ? [settingsId] : []);
  const pinnedPageIds =
    fromMenu.length > 0
      ? pageDocumentIds(fromMenu)
      : [ids.knowledge, ids.kontakt].filter((id): id is string => Boolean(id));

  const home = settingsId
    ? singletonItem(S, {
        id: "homePage",
        title: "Strona główna",
        schemaType: "siteSettings",
        documentId: settingsId,
      })
    : null;

  const shortcuts =
    fromMenu.length > 0
      ? fromMenu.map((entry) => navListItem(S, entry))
      : fallbackShortcuts(S, ids);

  const typeItems = S.documentTypeListItems().flatMap((item) => {
    const id = item.getId();
    if (!id || MEDIA_PLUGIN_TYPES.has(id) || SINGLETON_SCHEMA_TYPES.has(id)) {
      return [];
    }
    if (id === "page") {
      return [
        S.listItem()
          .id("page")
          .title(item.getTitle() || "Page")
          .icon(item.getIcon())
          .schemaType("page")
          .child(
            S.list()
              .title("Page")
              .items([
                S.listItem()
                  .id("page-drupal")
                  .title("Drupal")
                  .schemaType("page")
                  .child(
                    S.documentTypeList("page")
                      .title("Drupal")
                      .filter(PAGE_DRUPAL_FILTER)
                      .params({ drupal: [...DRUPAL_PAGE_SLUGS] }),
                  ),
                S.listItem()
                  .id("page-menu")
                  .title("W menu")
                  .schemaType("page")
                  .child(
                    S.documentTypeList("page")
                      .title("W menu")
                      .filter(PAGE_MENU_FILTER)
                      .params({
                        pinned: pageDeskIds(pinnedPageIds),
                        drupal: [...DRUPAL_PAGE_SLUGS],
                      }),
                  ),
                S.listItem()
                  .id("page-rest")
                  .title("Poza menu")
                  .schemaType("page")
                  .child(
                    S.documentTypeList("page")
                      .title("Poza menu")
                      .filter(PAGE_REST_FILTER)
                      .params({
                        pinned: pageDeskIds(pinnedPageIds),
                        drupal: [...DRUPAL_PAGE_SLUGS],
                      }),
                  ),
              ]),
          ),
      ];
    }
    return [item];
  });

  const siteSettingsItem = settingsId
    ? singletonItem(S, {
        id: "siteSettings",
        title: "Site settings",
        schemaType: "siteSettings",
        documentId: settingsId,
      })
    : null;

  return S.list()
    .title("Content")
    .items([
      ...(home ? [home] : []),
      ...shortcuts,
      S.divider(),
      ...typeItems,
      ...(siteSettingsItem ? [S.divider(), siteSettingsItem] : []),
    ]);
};
