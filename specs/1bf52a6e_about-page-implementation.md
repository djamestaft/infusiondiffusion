# Implement the approved Sanity-managed About page

## Delivery intent

Implement `/about` as an approved, Sanity-managed, four-chapter editorial story. Treat these Figma frames as visual authority:

- [About / Desktop / Approved — `316:99`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-99)
- [About / Mobile / Approved — `316:151`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-151)
- [About / Handoff / Approved — `316:196`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-196)

The prompt records product-owner approval of these frames and the defaults in `specs/1bf52a6e_about-page-brief.md`; this satisfies the pre-implementation design gate for the stated direction. The implementer must still capture the frames through Figma MCP, transcribe their approved content and measurements rather than guessing, and obtain human visual acceptance of Storybook/Preview evidence before merge.

Roadmap freshness was checked before this plan: the configured remote `infusion-diffusion` was fetched with pruning; protected local and remote `main` and current branch HEAD all resolve to `3c90594b44e306523aaec81420a491d61b8c1972`; the only working-tree content is the prior untracked `specs/` planning record. `docs/planning/roadmap.md` was reread after the fetch and names the About page as immediate next action 3.

## Approved product decisions

The implementation should resolve the earlier brief’s defaults as follows; do not reopen them unless Figma contradicts them or required evidence is unavailable:

- Use third-person brand voice. Do not name or invent an Infusion Diffusion founder identity that is not present in approved evidence.
- Use only the product-owner-approved founder claims recorded in the brief, the Figma handoff, and `docs/features/homepage-content-expansion.md`: more than 130 fragrance oils were explored before refinement to six room fragrances; Jacqui Kirchmann of Jacqui Candles – Scented Wax Melts may be credited using the approved “guidance and encouragement” relationship; scent is framed as changing the feeling of a lived-in room. Do not add chronology, sourcing, sustainability, hand-made, local-production, perfumer, award, or biography claims without evidence.
- Render exactly four ordered editorial chapters from the approved Figma copy. The Figma handoff is the source for chapter titles, body copy, image-role labels, spacing, focal behavior, and CTA presentation; repository fallback copy must match the approved handoff and contain no invented extension.
- Keep homepage founder content independently editable and document the possibility of editorial drift; do not create a Sanity cross-document dependency in this slice.
- Launch safely without final photography. Each chapter has one optional, independently managed 4:3 editorial image role. If an image is absent, incomplete, or not rights-confirmed, that chapter uses its approved text-first layout. Never pull a Shopify image into About.
- Include the approved CTA to `/fragrance-guide` using the existing link/button primitive shown in Figma. Do not add a Shop CTA or analytics event.
- Use the approved fully light treatment and `Current=About` navigation state. No Midnight section or navigation treatment is permitted on `/about`.
- Public code may ship with approved version-controlled fallback content before a Sanity document is published. Unpublish/unavailable behavior returns to that fallback rather than hiding the route.
- Add no feature-specific analytics. Global pageview/consent work remains deferred.

## User outcome and scope

A visitor choosing About from desktop or mobile navigation can understand why the brand exists, how its six-fragrance collection was refined, and who supported that process. The story must be legible and credible before it is atmospheric. The brand owner can draft, preview, and later publish chapter copy and rights-cleared imagery in Sanity without a code deployment.

### In scope

- New Next.js `/about` route, metadata, Suspense behavior, current navigation state, and existing live cart count.
- A specialized About composition built from approved primitives and the existing editorial-page infrastructure.
- Four light chapter bands alternating in this exact sequence: chapter 1 Mineral Sage `color/background/base` (`#EEF0E7`), chapter 2 Bone `color/bone/50` (`#F5F1E8`), chapter 3 Mineral Sage, chapter 4 Bone.
- Alternating desktop text/image composition from the approved frame; semantic/mobile DOM order is always heading, body, then image.
- Four optional 4:3 chapter images with hotspot/focal support, factual required alt when an asset exists, rights/licensing guidance, and independent omission/fallback.
- Additive Sanity schema/query/application/generated-type changes; published/draft/missing/partial/unavailable normalization; SEO fallbacks.
- About and Navigation Storybook states, Vitest, Playwright, axe, long-content/320 px evidence, Figma comparison, feature documentation, and evidence-based roadmap reconciliation.

### Out of scope

- Creating, buying, licensing, or publishing final photography.
- Publishing, scheduling, or deleting the Sanity `about` document.
- Shopify catalogue/cart/checkout changes; the existing cart summary is read-only global navigation truth.
- Feature analytics, new consent behavior, rich portable text, video, galleries, timelines, forms, embedded products, or a general page builder.
- New visual exploration, Midnight sections, raw one-off colour classes/values, unrelated primitive redesign, merge, production deployment, or rollback execution.

## System ownership boundaries

| Concern                                                                                                                 | Owner and required boundary                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Public route, SEO rendering, responsive composition, accessibility, normalization consumption, current navigation state | **Next.js**. `/about` may call `readCart()` for the existing cart count but must not call Shopify catalogue helpers.       |
| About copy, chapter order/roles, optional editorial images, alt, focal point, licensing record/guidance, SEO values     | **Sanity**. Use the existing `editorialPage` document type with slug `about`, extended additively for chapter media/roles. |
| Products, variants, product imagery, prices, inventory, discounts, cart truth, customers, checkout, orders              | **Shopify**. No Shopify-owned value is copied into About, fallback content, Sanity, or Storybook editorial fixtures.       |
| Approved visual direction, chapter alternation, image roles, CTA and responsive layouts                                 | **Figma `316:99`, `316:151`, `316:196`**, then durable `DESIGN.md`. Do not infer missing measurements.                     |
| Reusable About composition and meaningful states                                                                        | **Storybook**. Story fixtures are non-production evidence and must not masquerade as licensed final photography.           |
| Preview, deployment ID, health and runtime logs                                                                         | **Vercel**. Preview verification is not production authorization.                                                          |
| Publish/unpublish and image-rights acceptance                                                                           | **Human editor/product owner**. Agents may build schema and preview but may not publish or assert rights clearance.        |

## Implementation design

### 1. Capture and synchronize approved design authority

Before UI edits, the storefront engineer must:

1. Run the Impeccable session context for the target and read the `shape`/approved-direction guidance; load `reference/craft-floor.md` immediately before editing UI.
2. Use Figma MCP on all three exact nodes. Record frame dimensions, layout/grid, chapter text, order, alternating desktop direction, mobile order, typography treatments, image aspect/crop/focal behavior, CTA primitive/state, semantic variables, spacing, and Current=About navigation state in `docs/features/about-page.md`.
3. Stop rather than guess if any of those nodes is inaccessible or is not marked Approved.
4. Add the exact frame links and durable About contract to `DESIGN.md`.
5. Keep `.impeccable/design.json` synchronized with the durable design record. Add/update only the sidecar narrative/token metadata needed for the new approved semantic role; do not rewrite unrelated generated context.
6. Add a semantic runtime role for the alternate Bone chapter surface in `src/app/globals.css`, backed by canonical `#F5F1E8`. Prefer a role such as `editorial-chapter-alternate`/`bg-editorial-chapter-alternate`, not a raw `bg-[#F5F1E8]`, generic `bg-bone-*`, action-hover token, or repurposed elevated-surface token. Reuse `bg-content-surface` for Mineral Sage.
7. Extend `src/app/design-tokens.test.ts` so the semantic role’s canonical value and light-only intent are protected.

### 2. Extend the Sanity editorial contract additively

Retain one `editorialPage` document with slug `about`; do not introduce a second page document type.

- In `src/sanity/schemaTypes/editorial-page.ts`, add optional stable chapter-role and chapter-image fields to each `editorialSection` without breaking Fragrance Guide documents.
- Encode four stable About role IDs matching the approved handoff order. Use human-readable schema titles/descriptions from the Figma handoff; role IDs are application identity and must not depend on mutable headings.
- For slug `about`, Studio validation must require exactly one of each approved chapter role and prevent duplicate roles. Do not impose that rule on `fragrance-guide`.
- Each chapter image is optional, uses Sanity hotspot/crop support, and is authored/displayed as 4:3. Its schema guidance must identify the specific editorial role, instruct the editor to set the focal point, require concise factual alt text when an asset exists, and state that only rights-cleared/licensed media may be used.
- Add a positive rights confirmation and a short licence/source reference (or the exact equivalent named in handoff). Require both when an image asset is attached. Keep licence/source text out of rendered UI and public metadata. This records guidance/evidence; it does not let an agent grant rights.
- Preserve the existing top-level `heroImage` for Fragrance Guide compatibility; About should not use it as a fifth image or fallback.
- Update `EDITORIAL_PAGE_QUERY` to project section `_key`, stable role, heading/body, and only runtime-required chapter image values: asset URL, factual alt, rights confirmation, and hotspot/crop/focal data. Do not project licence notes to the browser unless an operational requirement is documented.
- Extend the application type in `src/sanity/lib/editorial-pages.ts` (or move it to `src/sanity/types.ts` only if the change improves the existing boundary without unrelated refactor). Add a typed `AboutChapterRole`, normalized 4:3 image/focal type, `fallbackAboutPage`, `getAboutPage`, and `getAboutPageMetadata`.
- Implement an About-specific normalizer keyed by stable role. Always return the four roles in approved order. Merge missing/blank heading and body values from the approved role-specific fallback; omit only the affected chapter image when URL, alt, rights confirmation, or focal data is invalid. Never splice a fifth section, borrow an image from another chapter, or reuse Shopify imagery.
- Preserve generic Fragrance Guide behavior and tests. A missing document, Sanity configuration, or failed read returns all four approved fallback chapters and fallback metadata. Draft perspective uses draft content without leaking it to public perspective.
- Regenerate `src/sanity/extract.json` and `src/sanity/generated.ts` with repository commands. Review generated changes; never edit generated files manually.

### 3. Build the reusable About composition and route

Add an `AboutTemplate` beside the existing storefront templates rather than forcing the Fragrance Guide’s single-hero `EditorialTemplate` to represent a materially different four-image chapter contract.

- Compose existing `Navigation`, `ContentHeader`/`Eyebrow`/`Heading`/`Lead`, and the exact approved CTA primitive. Do not duplicate low-level components.
- Render one `<main>` and one `<article>` with exactly one H1. Each of the four chapters is a semantic `<section>` with one H2 and paragraph-preserving body text.
- Each chapter owns a full-width light surface. Apply Sage/Bone/Sage/Bone by role/order through semantic classes only. Do not add `.dark`, Midnight tokens, gradients, shadows, arbitrary borders, or ornamental dividers absent from Figma.
- On desktop, alternate copy/image sides exactly as `316:99`. Keep DOM order heading/body/image for all chapters and use responsive CSS grid/order only for visual alternation. This guarantees the approved mobile order from `316:151` and a logical assistive-technology order.
- Render each valid image in a 4:3 container with responsive `sizes`, Sanity focal point translated to object positioning/crop behavior, and editor alt text. Missing/invalid image collapses that chapter to the handoff’s text-first layout with no blank column, reserved empty frame, or substituted image.
- Keep text measure, chapter balance, max-width, spacing and CTA placement exactly aligned with `316:196`. Long copy may increase chapter height; do not clamp founder content.
- Add the Fragrance Guide destination as a real link to `/fragrance-guide`; preserve 44px target, underline/focus behavior and no feature event.
- Add `src/app/(website)/about/page.tsx` following the Fragrance Guide route’s draft/published metadata pattern. Fetch only `getAboutPage(options)` and `readCart()` in parallel; do not import `getCachedHomepageProducts`, `toProductCard`, or any catalogue helper. Pass `currentHref="/about"` and an Ivory navigation theme.
- The Suspense shell should use the approved light base surface and `aria-busy` without presenting false content or trapping focus.
- Metadata uses Sanity SEO title/description with approved fallbacks, `en_ZA`, and the Figma/brief-approved Open Graph type. It must not expose draft values in public mode.

### 4. Add Storybook and navigation contracts

- Add About stories under the established template title (or `Templates/About` if the Figma/code/Storybook name is `AboutTemplate`; document the mapping).
- Required stories: approved desktop with all four image slots represented by explicitly non-production, non-Shopify fixtures; approved mobile; all-images-missing text-first; one/alternating partial image set; maximum/long copy; and Sanity partial/unavailable fallback data.
- Do not add final photography. Image-present stories may use rights-cleared Figma handoff assets only if rights status is recorded, otherwise use an unmistakably test-only neutral fixture that cannot ship through the route and document it as visual-contract evidence.
- Add a `CurrentAbout` navigation story showing desktop and mobile current state from handoff `316:196`. Route/template stories must assert the visible About link has `aria-current="page"`.
- Story play functions should verify all four chapter surfaces by computed RGB (`238, 240, 231` then `245, 241, 232` alternating), four H2s, 4:3 media boxes where present, CTA destination, current navigation, and no dark class.

### 5. Document delivery and reconcile roadmap truth

Create `docs/features/about-page.md` with:

- user outcome, approved decisions and exact Figma links;
- four chapter/role inventory and approved fallback source;
- content/image authoring guidance, rights and publish gate;
- Sanity/Next.js/Shopify/Storybook ownership;
- draft/published/missing/partial/unavailable behavior;
- accessibility/content extremes;
- test and Preview evidence status;
- rollback plan and a Figma → `DESIGN.md` → sidecar → runtime token → component → Storybook synchronization matrix.

After code and local evidence are complete, update `docs/planning/roadmap.md` narrowly:

- record the About runtime/schema/Storybook integration as implemented only if its evidence has landed;
- retain final photography and Sanity publication as explicit human content gates;
- change immediate next action 3 to Preview review and editorial document creation/publication rather than claiming completion;
- do not mark Preview, merge, production, or publish as complete before the corresponding evidence/human action exists.

## Exact file ownership

The sole `storefront_engineer` owns all writes on one delivery branch/PR. Sanity work remains inside that branch and must be reviewed against `sanity-content-change`; do not create a second writing agent implicitly.

### Expected additions

- `src/app/(website)/about/page.tsx` — route, metadata, draft/published fetch, cart summary, current navigation and Suspense shell.
- `tests/e2e/about.spec.ts` — integrated desktop/mobile/320 px/accessibility/metadata/current-nav/surface/fallback journey.
- `docs/features/about-page.md` — feature contract, Figma handoff, authoring guidance, evidence and sync matrix.

### Expected modifications

- `DESIGN.md` — exact approved About frames, four-chapter light contract, semantic Bone alternate role, mobile/desktop/image fallback rules and Current=About state.
- `.impeccable/design.json` — synchronized design-sidecar metadata/narrative for the approved About/token contract.
- `src/app/globals.css` — one semantic alternate editorial chapter surface mapped to canonical Bone `#F5F1E8`.
- `src/app/design-tokens.test.ts` — canonical token mapping/no raw drift coverage.
- `src/components/templates/storefront-templates.tsx` — `AboutTemplate` and typed chapter/image/focal props, without regressing `EditorialTemplate`.
- `src/components/templates/storefront-templates.stories.tsx` — approved About responsive, missing/partial-image and content-extreme stories.
- `src/components/templates/storefront-templates.test.tsx` — semantic hierarchy, alternating surfaces/layout, mobile DOM order, CTA, current navigation and text-first fallback.
- `src/components/navigation.stories.tsx` — approved Current=About evidence.
- `src/components/navigation.test.tsx` — focused `aria-current` About assertion if not already fully protected by template/integration tests.
- `src/sanity/schemaTypes/editorial-page.ts` — additive stable chapter role and optional rights-controlled chapter image authoring contract.
- `src/sanity/lib/queries.ts` — role/key/chapter-image/focal projection.
- `src/sanity/lib/editorial-pages.ts` — About types, approved fallback, normalization and content/metadata accessors.
- `src/sanity/lib/editorial-pages.test.ts` — role-order, independent text/image fallback, published/draft input normalization and unavailable behavior.
- `src/sanity/extract.json` and `src/sanity/generated.ts` — command-generated schema/query types.
- `docs/features/sanity-editorial-pages.md` — extend the generic editorial model record to include About’s additive chapter media contract while preserving Fragrance Guide differences.
- `docs/planning/roadmap.md` — evidence-based status reconciliation only after local delivery evidence.

### Expected unchanged boundaries

- `src/components/navigation.tsx` already supports `/about` and current state; do not modify unless Figma reveals an approved contract gap.
- `src/lib/shopify/**` and all Shopify schema/API code remain unchanged.
- `src/app/(website)/fragrance-guide/page.tsx` and Fragrance Guide rendering remain behaviorally unchanged.
- Figma is already approved; do not edit it in this implementation task. If code cannot match it without a design change, stop for human approval rather than changing Figma autonomously.
- No final editorial image file is added under `public/`.

## State and fallback matrix

| State                                   | Required result                                                                                                                                                                        |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Published                               | Public `/about` uses published four-role Sanity text/eligible images, fallback per missing text field, published metadata, live cart count and About current state.                    |
| Draft                                   | Authenticated draft/Visual Editing shows draft perspective and draft metadata; public session remains published.                                                                       |
| Missing document or Sanity unconfigured | Four complete approved fallback chapters, no images, fallback metadata; route is 200 and navigable.                                                                                    |
| Partial chapter text                    | Role-specific blank heading/body uses that role’s fallback while valid editor text is retained; order stays fixed.                                                                     |
| Missing role                            | That role renders its complete fallback text with no image; other roles remain authored.                                                                                               |
| Extra/duplicate/unknown role            | Studio blocks valid About publication; runtime ignores unknown/duplicate extras deterministically, logs bounded diagnostics if appropriate, and renders one chapter per approved role. |
| Image missing                           | The affected chapter alone uses text-first layout.                                                                                                                                     |
| Image incomplete or unconfirmed         | Missing URL, factual alt, rights confirmation or required licence reference prevents rendering; no empty frame and no cross-role/Shopify fallback.                                     |
| Sanity read failure                     | Server diagnostic contains no token/content secret; all four fallback chapters and fallback metadata render.                                                                           |
| Long content                            | No clamp or overflow; chapter expands while text measure and alternating surface sequence remain intact.                                                                               |
| Cart unavailable                        | Preserve existing cart boundary’s safe behavior; About content never depends on commerce response and no quantity is invented.                                                         |

## Accessibility and content extremes

- Exactly one H1 and four ordered H2s; section landmarks follow the approved chapter order.
- Mobile/accessibility DOM order is heading → body → image for every chapter, including desktop rows that visually place image first.
- Four image roles remain understandable when all images are absent. Alt describes visible content factually and does not repeat the chapter, identify an unverified person, include “image of,” or carry SEO copy.
- At 320 CSS px and 200% text zoom: no horizontal overflow, clipped title/current underline, overlapping CTA, broken 4:3 box, or desktop-order leakage. Navigation may use its existing mobile drawer.
- Preserve keyboard operation, visible focus, 44×44 targets, mobile menu containment/Escape/focus restoration, real-link semantics and `aria-current="page"`.
- Test 40-character eyebrow, 100-character H1, 320-character lead, four 90-character H2s, bodies approaching 1200 characters with paragraph breaks, long collaborator wording, all images, no images, one image, and a cart count over 99.
- Surface/text/focus/link pairs must meet WCAG AA. Colour and alternation are decorative hierarchy, never the only carrier of chapter meaning.
- No new motion is specified. Existing reduced-motion behavior remains intact; do not add scroll reveals simply because Home uses them.
- Axe must report zero WCAG 2 A/AA and 2.1 A/AA violations; browser console must be clean in normal/fallback page journeys.

## Observable acceptance criteria

1. `/about` returns a complete page in local fallback mode and Preview, with one H1, four ordered H2 chapters, a Fragrance Guide CTA to `/fragrance-guide`, live existing cart presentation, and a visible About link marked `aria-current="page"` on desktop/mobile.
2. The page exactly follows approved Figma desktop `316:99`, mobile `316:151`, and handoff `316:196`; deviations are documented and human-approved before merge.
3. Chapter surfaces alternate Sage `#EEF0E7`, Bone `#F5F1E8`, Sage, Bone through semantic tokens. There is no Midnight/dark section, raw one-off colour, gradient, shadow, or repurposed action/elevated token.
4. Desktop chapter rows alternate text/image placement per Figma. Every mobile and semantic DOM sequence is heading, body, image. Missing images collapse independently to the approved balanced text-first state.
5. Each eligible image renders at 4:3 with approved focal behavior and factual alt. Images lacking rights confirmation/licence reference, asset URL, or alt do not render. No Shopify product image or other chapter image substitutes.
6. Sanity uses one `editorialPage` slug `about`, four stable unique chapter roles, additive image/alt/hotspot/rights guidance, and unchanged Fragrance Guide compatibility. Generated schema/types match sources.
7. Published, draft, missing, partial, unknown/duplicate role, incomplete image, unconfigured and unavailable Sanity cases produce the deterministic state matrix above; public metadata never leaks a draft.
8. Runtime/fallback copy matches approved Figma/brief claims and adds no founder identity, chronology, sourcing, sustainability, production, award, or commerce claims.
9. About imports no Shopify catalogue/presentation helper and writes no commerce value to Sanity. The only Shopify-facing runtime concern is existing `readCart()` navigation truth.
10. Storybook covers approved desktop/mobile, Current=About, all-image, no-image, partial-image, unavailable/partial content and long/max-content states, with interaction/computed-style assertions and screenshots.
11. Vitest covers token mapping, role normalization/order, independent text/image fallbacks, metadata fallback, template semantics/layout classes, CTA/current navigation and Fragrance Guide regression.
12. Playwright covers desktop/mobile, 320 px, 200% zoom inspection, four computed surfaces, mobile order, CTA/current navigation, image/no-image behavior, metadata, overflow, console cleanliness, axe and `/api/health`.
13. `DESIGN.md`, `.impeccable/design.json`, runtime semantic token, `AboutTemplate`, Storybook, feature docs and generated Sanity contracts are synchronized with no unexplained divergence.
14. `docs/planning/roadmap.md` reports implemented versus Preview/publish/final-photo status truthfully; no unperformed gate is marked complete.
15. Full local gate and targeted browser checks pass. A Vercel Preview tied to the reviewed SHA is independently verified before human merge approval.

## Deterministic verification

Run targeted checks during implementation, then the full gate. Judge commands by exit status.

```bash
corepack pnpm sanity:schema
corepack pnpm sanity:typegen
corepack pnpm test -- src/app/design-tokens.test.ts src/sanity/lib/editorial-pages.test.ts src/components/templates/storefront-templates.test.tsx src/components/navigation.test.tsx
node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/templates/storefront-templates.tsx src/components/templates/storefront-templates.stories.tsx
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile
corepack pnpm check
git diff --check
```

Also inspect the diff to confirm:

```bash
git diff -- src/sanity/extract.json src/sanity/generated.ts
git diff -- DESIGN.md .impeccable/design.json src/app/globals.css
git diff -- src/lib/shopify
```

The last command should be empty. Re-run schema extraction and type generation after the final schema/query edit; generated files must contain the new source contract and no manual changes.

### Required visual/Storybook evidence

- Record exact story IDs and screenshots for desktop, mobile, no-images, partial-images and long-content.
- Compare desktop/mobile screenshots to `316:99` and `316:151`; use `316:196` to audit token names, measurements, chapter order, image roles and Current=About state.
- Inspect 320 px and 200% text zoom; verify computed Sage/Bone values, 4:3 ratios, copy/image desktop alternation, mobile heading/body/image order, focus/current states and no dark class.
- Product designer is read-only and supplies a comparison/critique; only the human design authority accepts the match.

### Required Vercel Preview evidence

The browser release debugger records Preview URL, deployment ID, commit SHA, timestamp and environment, then verifies the exact deployment:

```bash
curl --fail --silent --show-error "$PREVIEW_URL/api/health"
PLAYWRIGHT_BASE_URL="$PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile
```

Retain:

- desktop/mobile/320 px `/about` screenshots and Figma comparison;
- public published/fallback result and authenticated draft-mode result, without exposing preview secrets;
- metadata/Open Graph inspection and proof public mode excludes drafts;
- Current=About desktop/mobile navigation, CTA, keyboard/focus and cart label;
- console, failed network requests, `/api/health`, deployment logs where needed;
- controlled missing/unavailable Sanity evidence and text-first no-image state;
- confirmation that no Shopify catalogue request/value or final unlicensed image is used.

A protected Preview that cannot be authenticated or a skipped draft/unavailable check is an explicit failed/incomplete gate, not a pass.

## Specialist routing and applicable skills

### Typed execution contract

- **Implementation owner:** `storefront_engineer` — the one writing owner for Next.js, UI, Storybook, additive Sanity integration, tests and docs on one branch/PR.
- **Advisory specialists:** `product_designer` (read-only Figma/responsive/component comparison) and `browser_release_debugger` (read-only Preview/runtime evidence).
- **Independent review owner:** `quality_reviewer` — reviews acceptance coverage, visual evidence, accessibility, Sanity/Shopify boundaries, generated files and roadmap truth. The implementation owner cannot self-approve.

### Skills

- **`feature-brief`:** use the approved prior brief and this prompt’s resolutions as acceptance truth; do not revive closed choices or invent missing claims.
- **`impeccable`:** triggered by a new approved customer-facing composition, responsive alternation, typography, long content, accessibility and polish. Load context once in the implementer’s session and craft floor immediately before UI edits; use bounded desktop/mobile inspection.
- **`design-to-storybook`:** mandatory because exact approved Figma frames, semantic tokens, reusable About composition and Storybook states must stay synchronized. Record a final sync matrix.
- **`sanity-content-change`:** mandatory for additive schema, GROQ, application/generated types, draft/published, image authoring, fallback and cache behavior. No tokens or rights records may leak to the browser unnecessarily.
- **`quality-gate`:** maps every criterion to tests/inspection, runs targeted then full gates, reviews generated/unrelated files, and reconciles roadmap status.
- **`release-debug`:** mandatory for Preview identity, screenshots, console/network/health and any Sanity/runtime diagnosis; never authorizes production or rollback.
- **`shopify-storefront-change`:** not triggered; no commerce behavior changes. Escalate and stop if implementation appears to require one.
- **`parallel-agent-worktrees`:** not triggered because one writer/branch/PR is mandated. Apply only after explicit engineer approval for a different topology.

## Human gates

| Gate                           | Status/evidence                                                                                                                                          | Required human action                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Design before implementation   | Opened by this request’s approval of frames `316:99`, `316:151`, `316:196` and defaults. Builder must confirm frame access/Approved status before edits. | If frames are inaccessible, changed, or implementation requires divergence, human design approval is required again before proceeding.           |
| Image rights/editorial content | No final photography is in scope. Schema records guidance/confirmation; text-first fallback is approved.                                                 | Human editor verifies actual image licence/source, focal point, alt and claims before any image/content publish. An agent cannot certify rights. |
| Merge                          | Green CI/local gate, generated contracts, quality review, visual diff and exact Vercel Preview.                                                          | Human approves and merges; agents do not self-merge.                                                                                             |
| Editorial publish              | Valid draft `about` document, four roles, final copy/metadata, rights-cleared images if any, and draft Preview.                                          | Human Sanity editor publishes/schedules/unpublishes. Code delivery does not imply publication.                                                   |
| Production                     | Protected `main`, successful deployment, health/smoke plan and runtime evidence.                                                                         | Human authorizes production when not automatic from approved merge. No direct agent production deploy.                                           |
| Rollback                       | Confirmed impact, failing deployment/content revision and named last-known-good target.                                                                  | Human authorizes Vercel rollback, content revision restore, or unpublish. Agents only recommend and verify.                                      |

## Rollback and failure strategy

- Prefer content rollback when code is healthy: human restores a prior Sanity revision or unpublishes the `about` document; the route deterministically displays versioned four-chapter text fallback with no images.
- Additive chapter fields are backward-compatible. Old code ignores them, and Fragrance Guide retains its current fields. Do not delete fields or migrate documents destructively in this slice.
- For an application incident, identify deployment ID/SHA and recommend the named last-known-good Vercel deployment. Human authorization is required. Note that rolling back before this feature restores the known `/about` navigation destination without a route (404), so a content rollback or forward fix is less disruptive when possible.
- If the alternate token/component causes visual regression, revert the About route/template/token/schema integration together; do not leave raw colour patches or partially generated contracts.
- Never publish, delete Sanity content, execute production deployment, or execute rollback automatically.

## Residual risks

- Exact chapter text, labels, image-role names and dimensions are available only through the approved Figma nodes, not current repository docs. Inaccessible Figma is a hard implementation blocker; the builder must not infer them from this plan.
- The prior brief says founder identity is unknown. Third-person brand copy avoids invention, but any Figma copy naming a founder must be checked against explicit evidence before landing.
- Four role-specific chapter images broaden the generic editorial schema. Conditional validation and Fragrance Guide regression tests are essential to avoid harming the proven route.
- Sanity hotspot/crop data must be translated consistently to Next Image behavior; visual evidence must catch incorrect focal positioning.
- A rights-confirmation field records an editor assertion, not legal proof. Human publication review remains responsible for licences and consent.
- No final photography means integrated Preview may intentionally show the all-images-missing text-first state; image-present Storybook fixtures must be clearly non-production and non-Shopify.
- Separate homepage and About copy can drift. This slice documents but does not eliminate that editorial governance risk.
- Protected Preview/draft credentials may limit automated checks. Missing evidence keeps the merge gate closed.
- Pre-feature deployment rollback reintroduces the existing dangling `/about` 404.

## Completion handoff

The implementation owner must report changed files, commands and exit status, story IDs/screenshots, Figma deviations, Preview URL/deployment/SHA, unpublished content/image status, roadmap reconciliation, untested areas and residual risks. Stop at human merge approval; do not publish Sanity content, deploy production, or roll back.
