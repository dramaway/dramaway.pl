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

/** Shortcuts used when `siteSettings.navigation` has no openable documents. */
function fallbackShortcuts(
  S: StructureBuilder,
  ids: {
    artGeneracje: string | null;
    metody: string | null;
    kontakt: string | null;
  },
) {
  return [
    singletonItem(S, {
      id: LANDING_PAGES[0].id,
      title: LANDING_PAGES[0].title,
      schemaType: "landingPage",
      documentId: LANDING_PAGES[0].id,
    }),
    ids.artGeneracje
      ? singletonItem(S, {
          id: "artGeneracje",
          title: "Art Generacje",
          schemaType: "project",
          documentId: ids.artGeneracje,
        })
      : null,
    singletonItem(S, {
      id: LANDING_PAGES[1].id,
      title: LANDING_PAGES[1].title,
      schemaType: "landingPage",
      documentId: LANDING_PAGES[1].id,
    }),
    ids.metody
      ? singletonItem(S, {
          id: "page-metody",
          title: "Metody",
          schemaType: "page",
          documentId: ids.metody,
        })
      : null,
    singletonItem(S, {
      id: LANDING_PAGES[2].id,
      title: LANDING_PAGES[2].title,
      schemaType: "landingPage",
      documentId: LANDING_PAGES[2].id,
    }),
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
    singletonItem(S, {
      id: LANDING_PAGES[3].id,
      title: LANDING_PAGES[3].title,
      schemaType: "landingPage",
      documentId: LANDING_PAGES[3].id,
    }),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: "2025-01-01" });
  const ids: {
    siteSettings: SettingsRow | null;
    artGeneracje: string | null;
    metody: string | null;
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
      "metody": *[_type == "page" && !(_id in path("drafts.**")) && slug.current == "metody"][0]._id,
      "kontakt": *[_type == "page" && !(_id in path("drafts.**")) && slug.current == "kontakt"][0]._id
    }`,
    { artId: ART_GENERACJE_ID },
  );

  const settingsId = ids.siteSettings?._id ?? null;
  const fromMenu = deskNavFromSettings(ids.siteSettings?.navigation, settingsId ? [settingsId] : []);
  const pinnedPageIds =
    fromMenu.length > 0
      ? pageDocumentIds(fromMenu)
      : [ids.metody, ids.kontakt].filter((id): id is string => Boolean(id));

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
            S.documentTypeList("page")
              .title("Page")
              .filter('_type == "page" && !(_id in $pinned)')
              .params({ pinned: pinnedPageIds }),
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
