# Contact page local verification

The default Contact-route captures were created from a local production `next start` server, before any drawer interaction. They are unobscured and contain no Next development indicator.

| Viewport  | Capture            | Verified default contract                                                                                                                                                                                                                               |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1440×1000 | `contact-1440.png` | Approved 80px/1280px grid, address and alert in leading six columns, intrinsic action at the captured cross-grid position; HTTP 200, metadata, H1/H2 hierarchy, visible/action mailto links, no form, empty cart, overflow, axe, console filter, health |
| 390×844   | `contact-390.png`  | Same unobscured default-page contract at mobile width                                                                                                                                                                                                   |
| 320×844   | `contact-320.png`  | Same unobscured default-page contract at small width                                                                                                                                                                                                    |

The production-capture command and exit status are in `logs/contact-production-captures.log` (`EXIT_STATUS=0`). The full Contact Playwright suite is recorded separately against the local development server in `logs/contact-playwright.log` (`EXIT_STATUS=0`): keyboard drawer open/Escape/focus restoration, browser page-scale 200% zoom with strict `scrollWidth <= clientWidth`, reduced motion, empty-cart label, overflow, axe, health, and default route checks. Browser page scale avoids mutating server-rendered markup and therefore avoids a hydration mismatch. Production-server capture coverage is deliberately limited to the unobscured default route; protected Preview review remains required for deployed interactive behavior. The global Sanity setting may supply a validated mailbox, so the tests assert that visible and action links share one safe `mailto:` value rather than assuming a published document uses fallback copy.

Current repository-scoped logs, all with `EXIT_STATUS=0`:

- `contact-targeted-vitest.log` — 4 files, 35 tests: route composition/metadata plus Contact fallback, partial-value, failed-read, metadata-fallback, and perspective tests.
- `contact-storybook-tests.log` — 20 files, 194 tests, including separate Contact 390px-default and 320px-small contracts.
- `contact-storybook-build.log` — static Storybook build.
- `contact-impeccable-detect.log` — no findings.
- `contact-pnpm-check.log` — formatting, lint, types, unit tests, Storybook tests/build, and Next build; 34 unit files/175 tests and 20 Storybook files/194 tests.
- `contact-production-server.log` — local production server used for clean default-route captures.

These are local working-tree records, not CI or deployment evidence. GitHub `quality`, exact-commit protected Vercel Preview, Sanity draft/published review, human Storybook/Figma comparison, editorial publication, merge, and production remain human gates.
