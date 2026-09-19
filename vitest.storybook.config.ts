import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
  // Discover optional motion imports before tests start; a late dependency
  // optimization reload otherwise invalidates active story/a11y modules.
  optimizeDeps: { include: ["next/link", "gsap", "gsap/SplitText"] },
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
