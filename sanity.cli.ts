import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "./src/sanity/extract.json",
    generates: "./src/sanity/generated.ts",
    overloadClientMethods: false,
  },
});
