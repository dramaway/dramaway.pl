import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media, mediaAssetSource } from "sanity-plugin-media";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "dramaway",
  title: "DramaWay",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    media({
      creditLine: { enabled: true },
    }),
  ],
  form: {
    image: {
      assetSources: () => [mediaAssetSource],
    },
    file: {
      assetSources: () => [mediaAssetSource],
    },
  },
  schema: {
    types: schemaTypes,
  },
});
