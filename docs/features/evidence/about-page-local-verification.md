# About page local verification

Final local commands recorded after commit preparation:

| Command                                                                                                                                                                                       | Result           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `corepack pnpm sanity:schema`                                                                                                                                                                 | exit 0           |
| `corepack pnpm sanity:typegen`                                                                                                                                                                | exit 0           |
| `node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/templates/storefront-templates.tsx src/components/templates/storefront-templates.stories.tsx` | exit 0           |
| `PLAYWRIGHT_BASE_URL=http://localhost:3122 corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile`                  | exit 0, 8 passed |

Local browser comparison targets remain Figma desktop `316:99` (1440×3394), mobile `316:151` (390×3632), and corrected handoff `316:198`. At these widths the template contract is 560×420/315×420 desktop and 350×262/196.5×262 mobile; 320px is 280×210/157.5×210. Protected Vercel Preview screenshot comparison remains a human release gate.

Captured local fallback screenshots: `about-1440.png` (1440px desktop comparison) and `about-390.png` (390px mobile comparison). Story IDs reviewed by browser tests: `templates-storefront--about-with-portraits`, `templates-storefront--about-portraits-mobile`, `templates-storefront--about-maximum-content`, and `templates-storefront--about-partial-unavailable`.
