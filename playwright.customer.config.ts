import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/customer-account",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3022", trace: "retain-on-failure" },
  webServer: {
    command:
      "CI=true SHOPIFY_E2E_FIXTURES=1 SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true SHOPIFY_CUSTOMER_SESSION_ENABLED=true NEXT_DIST_DIR=.next-e2e corepack pnpm exec next dev --hostname 127.0.0.1 --port 3022",
    url: "http://127.0.0.1:3022/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
