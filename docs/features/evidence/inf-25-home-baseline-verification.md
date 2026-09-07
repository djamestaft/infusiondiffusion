# INF-25 Home baseline verification

Date: 7 September 2026  
Historical baseline: `b4feec3b617238d36ecd258db45b169a9f5e8706`  
Current verified production: `5096153`  
Production: <https://infusion-diffusion.vercel.app/>  
Health: <https://infusion-diffusion.vercel.app/api/health>

## Authority and method

The comparison authority is Figma file `jIMvwSBkilg7eplo3IiHPa`, page
`30 — Redesign / Approved`:

- `2070:2` — 1440px
- `2072:2` — 768px
- `2073:2` — 390px
- `2073:70` — 320px
- `2073:3389` — Home state contract

Fresh Figma exports were compared with production and Storybook renders at all
four widths. Scroll-reveal content was exercised by scrolling the full document
and with reduced motion enabled; a bare full-page capture before scrolling is
not valid evidence because waiting sections intentionally begin hidden.

## Resolved, transferred, and open matrix

| Previous finding                                          | Status                        | Current evidence / destination                                                                                                                                                                |
| --------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Below-fold sections were absent from captured evidence    | Resolved                      | All ordered Home sections are visible after scroll and with reduced motion. Production Playwright passed the four responsive order/overflow checks.                                           |
| Empty catalogue Storybook path crashed in `NextImage`     | Resolved                      | Storybook browser suite passed 245/245. The local Home Playwright long-content and empty-catalogue recovery test passed at 320px.                                                             |
| Long content lacked a complete browser verdict            | Resolved                      | The 320px long-content/empty-state browser test passed with no horizontal overflow.                                                                                                           |
| Missing-media had no independent browser proof            | Open / transfer to INF-34     | Unit and Storybook component contracts pass, but Home still has no dedicated browser story proving the complete missing-hero-media journey. Add that state before final journey verification. |
| Prettier reported a repository-wide baseline failure      | Open / maintenance            | `corepack pnpm check` now stops only on `PRODUCT.md` formatting. The file is byte-identical to `origin/main`; no unrelated formatting edit belongs in this verification ticket.               |
| Lint produced no verdict                                  | Resolved                      | ESLint passed with zero warnings.                                                                                                                                                             |
| Unit environment failed with matchers and worker timeouts | Resolved                      | Vitest passed 40 files and 224 tests.                                                                                                                                                         |
| Storybook tests did not complete                          | Resolved                      | Storybook browser tests passed 24 files and 245 tests.                                                                                                                                        |
| Storybook production build was incomplete                 | Resolved                      | Storybook production build completed successfully. Its large test-runner chunks remain a non-runtime build warning.                                                                           |
| Next build failed while prerendering `/about`             | Resolved                      | Next.js production build completed and generated all 18 routes.                                                                                                                               |
| Local Home Playwright had long/empty failures             | Resolved                      | The same long/empty test now passes. The complete local file records 24 passed, 4 intentional mobile skips, and 4 catalogue assertions blocked by absent local Shopify credentials.           |
| Exact visual parity was unproven                          | Partially resolved / transfer | Responsive screenshots and direct comparison are complete. The remaining deliberate or corrective differences are listed below for INF-32/33/34.                                              |

## Visual comparison findings

### P1 — Homepage catalogue selection no longer matches approved frames

The approved Home shows three cards at 1440px and three cards at 390/320px; the
768px frame shows four in a 2×2 grid. Current Home supplies four cards at every
width. At 1440px the fourth card wraps alone, weakening the intended cabinet
composition. This appeared after the shared product grid stopped hiding a card
to allow all six products on Shop. Shop must keep the complete catalogue while
Home receives an explicit, independent featured-product contract.

Transfer: INF-33 for the catalogue visibility rule and INF-34 for implementation.

### P1 — Fragrance-guidance composition differs from INF-16

The approved desktop/tablet frames pair the guidance introduction with three
room rows. Current Home instead presents one generic supporting paragraph. The
mobile hierarchy remains readable, but the source content and topology do not
match the approved Home evidence. INF-28/31 must confirm factual room guidance;
INF-32 must approve the real-content composition before INF-34 implements it.

### P1 — Closing invitation and shared footer remain unsynchronized

The approved INF-16 closing invitation is a centered gold band followed by the
dark footer contract. Current Home uses the base light surface, left-aligned
desktop content, and no shared customer footer. This is already part of the
later real-content journey scope rather than an isolated INF-25 code fix.

Transfer: INF-32 for exact approval and INF-34 for implementation.

### P2 — Home missing-media browser state is incomplete

Missing media is covered at component/unit level, but the full Home journey has
no dedicated browser state. Add one Storybook composition and Playwright proof
covering hierarchy, recovery copy, alt behavior, and stable geometry.

Transfer: INF-34.

### P2 — Windows Playwright launcher is not portable

`playwright.config.ts` uses POSIX inline environment assignment in the Next.js
web-server command. On Windows, `SHOPIFY_E2E_FIXTURES` is treated as a command.
Starting the same servers with PowerShell proves the application tests can run,
but the repository command itself is not cross-platform.

Transfer: INF-33 or a maintenance ticket before final release verification.

### P3 — Geometry assertion has no floating-point tolerance

The production-targeted cabinet-width assertion observed
`1280.0000305175781px` against a strict `<= 1280` expectation. This is browser
sub-pixel precision, not visible overflow. Use a small tolerance in the test.

### P3 — Storybook reports an LCP loading hint for editorial imagery

Storybook warns that `homepage-bespoke-diffuser-blurb.png` may become LCP in
isolated stories. Production hierarchy should be measured before changing
loading priority; do not eagerly load below-fold imagery by default.

## Technical audit

| Dimension                |            Score | Evidence                                                                                                                                                        |
| ------------------------ | ---------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility            |              4/4 | Production axe WCAG A/AA passed; semantic order, focusable CTAs, 44px targets, keyboard carousel behavior, reduced motion, and overflow checks passed.          |
| Performance              |              3/4 | Next Image and production build are healthy; isolated Storybook emits one editorial-image LCP hint and large test-bundle warnings.                              |
| Responsive design        |              3/4 | All four viewport structure/overflow tests pass; featured-product count and wrapping differ from the approved composition.                                      |
| Theming                  |              4/4 | Home uses semantic surface, content, action, navigation, and focus tokens; detector found no verified hard-coded layout/type drift.                             |
| Implementation integrity |              3/4 | The product-specific system is coherent, but shared-grid coupling changed Home selection and three approved content regions remain pending the evolved journey. |
| **Total**                | **17/20 — Good** | **No P0; 3 P1; 2 P2; 2 P3.**                                                                                                                                    |

The Impeccable detector returned no layout or typography findings for the Home
route, template, carousel, navigation, and product-card sources. The visual
findings above are human-verified contract differences, not detector output.

## Command evidence

- Production `/` — HTTP 200, title `Infusion Diffusion`.
- Production `/api/health` — HTTP 200, `status: ok`, version `5096153`.
- Production Home responsive structure — 4/4 passed at 1440/768/390/320.
- Production-targeted Home suite — 9 passed; one sub-pixel assertion failed;
  five test-only carousel checks cannot run because `/e2e-carousel` is not
  deployed publicly.
- ESLint — passed.
- TypeScript — passed.
- Vitest — 224/224 passed.
- Storybook browser tests — 245/245 passed.
- Storybook production build — passed.
- Next.js production build — passed.
- Full `pnpm check` — blocked only by existing `PRODUCT.md` formatting.
- Local Home Playwright after PowerShell server startup — 24 passed, 4 skipped,
  4 catalogue assertions unavailable without local Shopify credentials.

## Handoff

INF-25 can close after its transferred findings are linked in the destination
tickets. INF-22 is the human decision gate for this evidence. No storefront,
Shopify, Sanity, or production state was changed by this verification.
