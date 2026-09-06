import type { StructureBuilder, StructureResolver } from "sanity/structure";
import {
  ABOUT_PAGE_ID,
  ART_GENERACJE_ID,
  LANDING_PAGES,
  PINNED_PAGE_SLUGS,
  SINGLETON_SCHEMA_TYPES,
} from "./singletons";

/** Document types the media plugin registers — edit them in the Media tool. */
const MEDIA_PLUGIN_TYPES = new Set(["media.tag", "media.folder"]);

const PINNED_PAGE_SLUG_LIST = [...PINNED_PAGE_SLUGS];

function singletonItem(
  S: StructureBuilder,
  opts: { id: string; title: string; schemaType: string; documentId: string },
) {
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

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: "2025-01-01" });
  const ids: {
    siteSettings: string | null;
    artGeneracje: string | null;
    metody: string | null;
    kontakt: string | null;
  } = await client.fetch(
    `{
      "siteSettings": *[_type == "siteSettings"][0]._id,
      "artGeneracje": *[_type == "project" && (_id == $artId || slug.current == "art-generacje")][0]._id,
      "metody": *[_type == "page" && slug.current == "metody"][0]._id,
      "kontakt": *[_type == "page" && slug.current == "kontakt"][0]._id
    }`,
    { artId: ART_GENERACJE_ID },
  );

  const mainPages = [
    ids.siteSettings
      ? singletonItem(S, {
          id: "homePage",
          title: "Strona główna",
          schemaType: "siteSettings",
          documentId: ids.siteSettings,
        })
      : null,
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
              .filter("_type == \"page\" && !(slug.current in $pinned)")
              .params({ pinned: PINNED_PAGE_SLUG_LIST }),
          ),
      ];
    }
    return [item];
  });

  const siteSettingsItem = ids.siteSettings
    ? singletonItem(S, {
        id: "siteSettings",
        title: "Site settings",
        schemaType: "siteSettings",
        documentId: ids.siteSettings,
      })
    : null;

  return S.list()
    .title("Content")
    .items([
      ...mainPages,
      S.divider(),
      ...typeItems,
      ...(siteSettingsItem ? [S.divider(), siteSettingsItem] : []),
    ]);
};
