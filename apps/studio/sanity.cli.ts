import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "dramaway",
  deployment: {
    appId: "y6nvb6dtm2srjz49hvvyv99n",
  },
});
