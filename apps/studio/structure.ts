import type { StructureResolver } from "sanity/structure";

/** Document types the media plugin registers — edit them in the Media tool. */
const MEDIA_PLUGIN_TYPES = new Set(["media.tag", "media.folder"]);

/** Singletons listed by hand above the type lists. */
const SINGLETON_TYPES = new Set(["aboutPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("O fundacji")
        .id("aboutPage")
        .schemaType("aboutPage")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .title("O fundacji"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return !id || (!MEDIA_PLUGIN_TYPES.has(id) && !SINGLETON_TYPES.has(id));
      }),
    ]);
