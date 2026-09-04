import type { StructureResolver } from "sanity/structure";

/** Document types the media plugin registers — edit them in the Media tool. */
const MEDIA_PLUGIN_TYPES = new Set(["media.tag", "media.folder"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items(
      S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return !id || !MEDIA_PLUGIN_TYPES.has(id);
      }),
    );
