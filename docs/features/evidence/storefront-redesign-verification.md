# Storefront redesign verification

## Scope and provenance

- Workspace branch: `agent/storefront-redesign-phase-1`.
- Figma foundations/release gate: approved nodes `455:3` and `456:2`, capture request `figma-706eadfe-e335-enabled`, phase `df28dccf_24_figma_codex_capture_1`, result hash `b64f05f159f47a692d06c063d90eb2ac9eed531db48ebd7c65a19df59396cc78`, with design-authority approval `706eadfe555a02aa9d0fab48b03290264506f4e532ad64e36cc87fb9cec890cc`.
- Route authority: approved nodes `255:616`, `255:638`, `203:137`, `203:294`, `203:373`, `357:2`, `316:198`, `329:58`, `337:321`, and `229:2`, with design-authority approval `9e5b74525942b60d674a12cb1568aac53c5a9e3d13124a96cc2432144330255b` (trace `evt_c454a3e38078`).
- Static capture facts are limited to composition, semantic variables, typography, spacing, assets, and approved divergences. Runtime-only behavior is verified by Storybook/browser tests.

## Provenance-backed discrepancy and disposition matrix

| Target / route            | Approved source                        | Finding and owner                                                                                                                                                                                 | Severity | Disposition                                                         |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `455:3` Foundations       | gated capture and approval `706eadfe…` | Existing semantic token, typography, layout, focus, and motion primitives were retained; no raw replacement palette or primitive was introduced. Owner: `src/app/globals.css`, shared primitives. | none     | fixed / preserved                                                   |
| `456:2` Release QA        | gated capture and approval `706eadfe…` | Shared website error/not-found shell had been absent. Owner: `src/app/(website)/error.tsx`, `not-found.tsx`, `storefront-templates.tsx`.                                                          | P1       | fixed                                                               |
| `255:616`, `255:638` Home | approved Home desktop/mobile           | Shared shell/footer, elevated Cabinet band, carousel, and reduced-motion capture are present. Owner: `HomeTemplate`.                                                                              | none     | fixed / verified by browser test                                    |
| `203:137` Shop            | approved Collection                    | Shop error previously bypassed shared navigation/footer. Owner: `shop/error.tsx`.                                                                                                                 | P1       | fixed                                                               |
| `203:294` Product         | approved Product detail                | Product error/not-found previously bypassed shared shell. Owner: `products/[handle]/error.tsx`, website not-found boundary.                                                                       | P1       | fixed                                                               |
| `203:373` Fragrance Guide | approved Editorial                     | Existing constrained reading composition/loading/footer retained. Owner: `EditorialTemplate`.                                                                                                     | none     | verified by browser test                                            |
| `357:2` Gallery           | approved Gallery packet                | Authored campaign/market cadence, viewer boundaries, and fallback remain unchanged. Owner: `GalleryTemplate`, `GalleryViewer`.                                                                    | none     | approved divergence preserved                                       |
| `316:198` About           | corrected About handoff                | FIT/contain 3:4 artwork in 4:3 slots and About-current navigation retained. Owner: `AboutTemplate`.                                                                                               | none     | approved divergence preserved                                       |
| `329:58` Contact          | approved Contact packet                | Direct-email fallback/error retains Contact-current navigation and truthful submitted-message wording. Owner: `ContactTemplate`, `ContactErrorTemplate`.                                          | none     | approved divergence preserved                                       |
| `337:321` Account         | approved Account board                 | Account had no shared footer. Owner: `account-entry.tsx`.                                                                                                                                         | P1       | fixed; no Account-current navigation remains an approved divergence |
| `229:2` Cart              | approved Cart                          | Midnight summary, checkout gating, and shared footer remain on Shopify normalized contract. Owner: Cart compositions.                                                                             | none     | verified by browser test                                            |

Content/provider-blocked items are final editorial assets, factual image alternatives, rights applicability, hosted account provisioning, and checkout enablement; no code fallback invents those facts. No out-of-scope Shopify or Sanity contract change was made.

## Local evidence manifest

`tests/e2e/storefront-visual.spec.ts` emits the 27 deterministic full-page captures below only with `SAVE_STOREFRONT_EVIDENCE=1` and local Shopify fixtures. It waits for the H1, reduced-motion rendering, network idle, and loaded fonts; it seeds the fixture cart before each Cart capture.

- `desktop-1440/{home,shop,product-bois-de-santal,gallery,fragrance-guide,about,contact,account,cart}.png`
- `mobile-390/{home,shop,product-bois-de-santal,gallery,fragrance-guide,about,contact,account,cart}.png`
- `mobile-320/{home,shop,product-bois-de-santal,gallery,fragrance-guide,about,contact,account,cart}.png`

## Current media-resilience verification

The current uncommitted media-resilience update was verified locally at `2026-08-10T05:09:30Z`; it must be rerun on the final pushed SHA. The approved registry is recorded in [`media-manifest.md`](./storefront-redesign/media-manifest.md). Provider images remain first priority, exact mapped repository media is the one-shot second priority, and unknown products or intentional published-empty Gallery content remain honest omissions.

| Command                                                                                                                                                                                                                                                                  | Result                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `corepack pnpm typecheck`                                                                                                                                                                                                                                                | exit 0                                            |
| `corepack pnpm test -- src/components/ui/product-card.test.tsx src/components/templates/storefront-templates.test.tsx src/components/hero-carousel.test.tsx src/sanity/lib/editorial-pages.test.ts src/sanity/lib/settings.test.ts src/lib/shopify/presentation.test.ts` | exit 0: 39 files / 219 tests                      |
| `corepack pnpm lint`                                                                                                                                                                                                                                                     | exit 0                                            |
| `corepack pnpm build`                                                                                                                                                                                                                                                    | exit 0                                            |
| `corepack pnpm test:stories`                                                                                                                                                                                                                                             | exit 0: 24 files / 244 tests                      |
| `corepack pnpm build-storybook`                                                                                                                                                                                                                                          | exit 0                                            |
| `corepack pnpm exec playwright test tests/e2e/storefront-visual.spec.ts --project=chromium`                                                                                                                                                                              | exit 0: 4 passed at 1440/390/320 plus 200% reflow |
| `git diff --check`                                                                                                                                                                                                                                                       | exit 0                                            |

## Prior baseline execution record

The prior full local gate was executed against exact source commit `01fd51c9dc71f7abae583037ece5e68d85dc8f99`. Sanitized command logs are committed under `docs/features/evidence/storefront-redesign/logs/`; the subsequent evidence-record commit changes documentation only. Remote GitHub quality and Vercel Preview checks must still validate the final branch SHA before release readiness.

| Command                                                                                     | Started (UTC)          | Finished (UTC)         | Result                                                                                                              |
| ------------------------------------------------------------------------------------------- | ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `corepack pnpm check`                                                                       | `2026-08-10T03:24:50Z` | `2026-08-10T03:25:56Z` | exit 0: 39 files / 219 unit tests; 24 files / 243 Storybook tests; Storybook build and Next production build passed |
| `corepack pnpm test:e2e`                                                                    | `2026-08-10T03:26:26Z` | `2026-08-10T03:28:00Z` | exit 0: 107 passed; 5 intentional mobile-project skips covered by Chromium viewport tests                           |
| `corepack pnpm exec playwright test tests/e2e/storefront-visual.spec.ts --project=chromium` | `2026-08-10`           | `2026-08-10`           | exit 0: 4 passed; 1440/390/320 route matrix plus effective-200%-zoom coverage includes seeded Cart                  |

The 27 committed screenshots cover all nine named public routes at desktop 1440px, mobile 390px, and mobile 320px. The browser matrix verifies reduced motion, keyboard entry, desktop axe/WCAG checks, overflow, footer continuity, console/page errors, configured-origin first-party request failures, and Cart at effective 200% zoom.

## Release gates and residual risk

No Preview, PR quality gate, merge, editorial publication, production deployment, or rollback was performed. Final editorial imagery, factual image alternatives, and rights applicability remain content-owner obligations; Shopify account/customer provisioning and checkout availability remain provider-owned gates. The footer deliberately links only to existing public routes and the existing public email; legal, policy, social, newsletter, and support-destination completeness is still a human launch-readiness decision.
