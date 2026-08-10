# PR #51 — exact storefront redesign and protected-media completion plan

## Objective

Replace PR #51’s visually generic shared-template treatment with the exact Approved Infusion Diffusion compositions for every public customer route, and make each media-bearing composition render approved, rights-cleared imagery on the protected Vercel Preview without relying on production Sanity/Shopify media availability. Keep Sanity authoritative for editorial content and Shopify authoritative for commerce truth; repository media is a presentation-resilience layer, not a competing catalogue or CMS.

This plan covers Home, Shop/Collection, Product detail, Gallery, Fragrance Guide, About, Contact, Account, and Cart. It does not authorize invented product/editorial claims, unapproved visual direction, protection bypass, custom commerce truth, or a structure-only “visual” sign-off.

## Baseline and planning evidence

- Planning checkout: Treehouse-managed non-primary worktree on `agent/storefront-redesign-phase-1`, the branch used by draft PR #51.
- The configured remote is `infusion-diffusion`. The planner confirmed a clean checkout, fetched `main` and the task branch successfully, reread `docs/planning/roadmap.md`, and verified the remote task SHA equals local `HEAD` at `5b590b20919894f7a4473ae2ffb9f3d72e1cd0e2`. The branch is 28 commits ahead and 0 behind `infusion-diffusion/main`.
- PR #51 is open and Draft. Its current `quality` and Vercel checks are green, but the product owner explicitly reopened visual acceptance after direct Preview review. Those checks are stale as acceptance evidence because they accepted generic compositions and missing-media fallbacks.
- The committed 1440px captures prove the defect: Home shows generic `I·D` art, Collection/Product/Cart use “IMAGE COMING SOON”, and Gallery is empty. `tests/e2e/storefront-visual.spec.ts` explicitly accepts those strings, so its current passing result is not visual fidelity evidence.
- Current implementation centralizes route treatments in `src/components/templates/storefront-templates.tsx`; the route-specific visual hierarchy is therefore too generic even though semantic tokens, primitives, tests, and shell behavior exist.
- `images-for-gallery/` contains four rights-recorded campaign images and five published market photographs; `public/images/products/fixtures/` contains six named product visuals. Existing Gallery publication evidence records rights for the Gallery assets. Before any product fixture becomes a public resilience asset, its rights/provenance and truthful product mapping must be added to the release media manifest.
- The builder must repeat clean-status, fetch, branch identity, and protected-branch ancestry checks immediately before editing because this evidence can become stale. Preserve all unrelated PR changes; do not reset, clean, or rewrite branch history.

## Typed specialist routing and delivery topology

- **Implementation owner (only writer): `storefront_engineer`.** Owns the Next.js route compositions, presentation-only media resilience, semantic CSS, Storybook, tests, evidence, and documentation listed below. There is one delivery branch and one PR (#51); do not create another writer, worktree, or PR implicitly.
- **Read-only advisor: `product_designer`.** Captures/consumes exact approved Figma evidence, produces the route-by-route discrepancy matrix, verifies desktop/mobile compositions and assets, and performs the bounded visual comparison. The advisor cannot approve its own work or write implementation files.
- **Read-only advisor: `browser_release_debugger`.** Verifies protected Preview and post-merge Production identity, routes, media requests, health, logs, console/network behavior, and screenshots. It cannot weaken protection, deploy directly, merge, publish, promote, or roll back.
- **Independent review owner: `quality_reviewer`.** Reviews the final diff and acceptance-to-evidence matrix independently of the writer and may reject stale, placeholder-tolerant, or non-Figma comparison evidence.
- Apply `.agents/skills/parallel-agent-worktrees/SKILL.md` because implementation is in a non-primary checkout. Keep the current single-writer branch; use isolation rules for branch safety, not to create parallel writers.

## Applicable project skills

1. **`feature-brief`** — the request spans nine routes, route-specific outcomes, responsive behavior, failure states, external content, accessibility, release evidence, and human decisions. This document is the decision-complete implementation brief.
2. **`impeccable`** — this is an explicit redesign correction and visual-fidelity audit. Run `context.mjs` once, use the audit/adapt/harden/polish guidance in bounded passes, and preserve the approved Perfumer’s Cabinet direction rather than inventing a replacement.
3. **`design-to-storybook`** — exact Figma nodes, `DESIGN.md`, semantic tokens, reusable component contracts, Storybook states, and runtime pages must agree. Capture exact design evidence first; implement reusable contracts in Storybook before route integration; finish with a sync matrix.
4. **`sanity-content-change`** — triggers narrowly because Home, Gallery, Fragrance Guide, and About presentation fallbacks are normalized at the Sanity boundary. Keep schema, GROQ, generated types, draft/published behavior, rights filtering, and cache semantics unchanged unless an evidenced contract defect requires an additive change. Any schema/query/type change must follow regeneration and draft/published/cache checks.
5. **`shopify-storefront-change`** — triggers narrowly for product/card/detail/cart media presentation. Shopify remains authoritative for handles, titles, variants, prices, availability, cart totals, checkout, and customers. A repository image may be selected by an existing Shopify handle/title only; it must never supply or override mutable commerce data.
6. **`quality-gate`** — substantive UI and boundary work requires targeted Vitest, Storybook tests/build, Next build, full Playwright, axe, keyboard, zoom, content extremes, diff review, Preview proof, and truthful roadmap reconciliation.
7. **`release-debug`** — required for protected Preview diagnosis, exact deployment/SHA binding, `/api/health`, media/network/log inspection, post-merge Production smoke tests, and rollback recommendations.
8. **`parallel-agent-worktrees`** — required by the non-primary implementation checkout and one-branch delivery contract.

## Exact Figma targets and blocking design-evidence gate

Canonical typed target: Figma design file `GYiQd7QSAwCSaGtt0alKG2` (`Infusion Diffusion Designs WEB`). Expected approval state for every target below: **Approved**.

Use exactly these 12 unique live targets for the bounded evidence capture:

| Surface                     | Node IDs             | Evidence required                                                                                                                                                                        |
| --------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                        | `255:616`, `255:638` | desktop/mobile composition, hierarchy, media role/crop, surface roles, typography, spacing, responsive reading order, content extremes, divergences                                      |
| HeroCarousel                | `296:100`, `296:174` | media dimensions, brackets, controls, spacing, responsive behavior, motion/interaction intent, assets, divergences                                                                       |
| Collection                  | `203:137`            | approved browse hierarchy, elevated canvas, ProductCard geometry/grid, assets, long/empty intent and companion responsive rules recorded in `docs/features/responsive-page-templates.md` |
| Product detail              | `203:294`            | media/details split, sticky behavior, purchase hierarchy, media role, content/commerce states and companion responsive rules                                                             |
| Editorial / Fragrance Guide | `203:373`            | introduction, reading grid/measure, imagery, section cadence, long/missing content and companion responsive rules                                                                        |
| Gallery                     | `357:2`              | populated/viewer/empty/loading packet, authored cadence, image roles, focus interaction, responsive rules and approved divergences                                                       |
| About                       | `316:198`            | corrected light composition, alternating chapters, portrait FIT contract, responsive/content extremes and assets                                                                         |
| Contact                     | `329:58`             | direct-email composition, asymmetric grid, feedback treatment, responsive/natural-height divergences                                                                                     |
| Account                     | `337:321`            | hosted/loading/unavailable/error/long states, responsive behavior, no-current-nav divergence                                                                                             |
| Cart                        | `229:2`              | populated/empty hierarchy, line media, Midnight summary, responsive/commerce states                                                                                                      |

For every target, the capture/handoff must contain these categories: `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, and `divergences`. Companion mobile/state node IDs already recorded in `DESIGN.md` and feature documents inform implementation, but the bounded live capture must not broaden beyond the 12 nodes above.

**Blocking gate:** the product designer must use an approved official Figma connector or an already complete provenance-gated handoff for these exact nodes. Missing file identity, node identity, Approved state, asset mapping, or any evidence category blocks implementation comparison. Do not retry the pending Pi Catalog/DCR/OAuth path, infer exact geometry from old runtime screenshots, or work around missing connector access. Existing approval authorizes exact restoration only; any new layout, interaction, copy, asset substitution, or divergence requires a new explicit human decision.

## System ownership boundaries

- **Figma / `DESIGN.md`:** exact visual authority. Runtime may diverge only for documented accessibility/content-flow reasons already approved or with new human approval.
- **Next.js:** public routing, SEO rendering, route-specific composition, responsive behavior, media resilience, loading/error/not-found UI, accessibility, and customer-facing cart presentation.
- **Storybook:** reusable component and full composition contracts, including responsive, interaction, missing/failed media, loading, error/empty, and long-content states.
- **Sanity:** editorial copy, page composition fields, carousel order, gallery order/groups/captions, alt text, rights metadata, and publish state. Repository fallbacks are versioned, approved resilience content used only when a document/read/media is unavailable under the precedence rules below; they do not become editable CMS truth.
- **Shopify:** product/variant identity, title, format, price, compare-at price, inventory/availability, cart lines/totals/discounts, customer destination, checkout URL, and orders. Static media lookup must not modify or synthesize these values.
- **Vercel:** protected Preview and Production deployment identity, environment, health, runtime logs, and automatic deployment state. Do not weaken SSO/protection.
- **Humans:** product/design owner retains design/divergence approval; content/legal owner retains rights/alt/copy approval; editor retains Sanity publication; repository owner retains merge; authorized operator retains promotion and rollback.
- Never expose server tokens or add credential-bearing `NEXT_PUBLIC_*` variables.

## Media resilience contract

1. Build one typed, server-safe approved-media registry keyed by route role and, where relevant, existing Shopify product handle. Each entry records local public path, factual alt text, source, owner, rights status, approval reference, intended crop/fit, and allowed surfaces.
2. Asset precedence is deterministic:
   1. valid rights-confirmed Sanity or Shopify media;
   2. exact route/handle-matched approved repository fallback;
   3. collapse optional media without leaving a reserved blank region and render the approved honest unavailable state.
3. Do not render `I·D` fallback art, “IMAGE COMING SOON”, empty hero/gallery boxes, or silent failed images on public routes. Loading skeletons are allowed only while loading and must disappear when settled.
4. A remote image load failure may switch once to its mapped approved local fallback without layout shift. It must not loop, announce decorative noise, or replace factual alt text with a generic label.
5. Product fallback media may be selected from the Shopify handle/title but may not provide title, description, price, availability, variant, discount, or checkout data. A mismatched product image is worse than omission and is forbidden.
6. Sanity fallbacks preserve approved editorial order/copy and rights facts. An explicitly published empty editorial state remains editorial truth unless the existing approved contract says missing document/read uses the versioned fallback; do not silently repopulate an editor-intended empty state.
7. About uses its approved portrait FIT/contain behavior; Product recognition crops protect vessels, caps, flames, triggers, and reed tips; Gallery preserves hotspots/crop and independent viewer order.
8. Before copying/exporting any asset to `public/`, add it to the media manifest and obtain/record human rights and factual-alt approval. Existing Gallery rights evidence may be referenced; product fixture provenance must be proved rather than assumed from a filename.

## Exact file ownership

Only `storefront_engineer` writes these files. Read first and edit only when the discrepancy/media matrix proves a need.

### Public routes and route boundaries

- `src/app/(website)/layout.tsx`
- `src/app/(website)/page.tsx`
- `src/app/(website)/loading.tsx`
- `src/app/(website)/error.tsx`
- `src/app/(website)/not-found.tsx`
- `src/app/(website)/shop/page.tsx`
- `src/app/(website)/shop/loading.tsx`
- `src/app/(website)/shop/error.tsx`
- `src/app/(website)/products/[handle]/page.tsx`
- `src/app/(website)/products/[handle]/loading.tsx`
- `src/app/(website)/products/[handle]/error.tsx`
- `src/app/(website)/gallery/page.tsx`
- `src/app/(website)/fragrance-guide/page.tsx`
- `src/app/(website)/fragrance-guide/loading.tsx`
- `src/app/(website)/about/page.tsx`
- `src/app/(website)/about/loading.tsx`
- `src/app/(website)/contact/page.tsx`
- `src/app/(website)/contact/loading.tsx`
- `src/app/(website)/contact/error.tsx`
- `src/app/(website)/account/page.tsx`
- `src/app/(website)/account/loading.tsx`
- `src/app/(website)/account/error.tsx`
- `src/app/(website)/cart/page.tsx`
- `src/app/(website)/cart/loading.tsx`
- `src/app/(website)/cart/actions.ts` remains read-only; no cart mutation behavior is authorized.

### Route-specific compositions and reusable UI

Split the monolithic legacy treatment into explicit route compositions while keeping the approved shell/primitives shared:

- `src/components/templates/storefront-templates.tsx` — reduce to shared shell/loading/error exports or compatibility re-exports; do not keep one generic layout algorithm for all routes.
- New `src/components/templates/home-template.tsx`
- New `src/components/templates/collection-template.tsx`
- New `src/components/templates/product-detail-template.tsx`
- New `src/components/templates/editorial-template.tsx`
- New `src/components/templates/gallery-template.tsx`
- New `src/components/templates/about-template.tsx`
- New `src/components/templates/contact-template.tsx`
- New `src/components/storefront-media.tsx` and `src/components/storefront-media.test.tsx` for one-shot remote-to-approved-local fallback and stable aspect behavior.
- `src/components/templates/storefront-templates.stories.tsx`
- `src/components/templates/storefront-templates.test.tsx`
- `src/components/hero-carousel.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/gallery-viewer.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/navigation.tsx`, `.stories.tsx`, `.test.tsx` only if exact comparison proves a shell defect.
- `src/components/storefront-footer.tsx`, `.stories.tsx`, `.test.tsx` only if an approved route composition includes it; do not invent footer content or destinations.
- `src/components/ui/product-card.tsx`, `.stories.tsx`, `.test.tsx`, and `product-card.fixtures.ts`
- `src/components/account/account-entry.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/cart/cart-line.tsx`, `cart-page.tsx`, `cart-shell.tsx`, `cart-summary.tsx`, `cart.stories.tsx`, and adjacent cart tests.
- `src/app/globals.css` for semantic/layout mappings only; no raw one-off replacement palette.
- `.storybook/preview.ts` only if viewport/reduced-motion configuration needs deterministic correction.

### Presentation data and approved media

- New `src/content/storefront-media.ts` and `src/content/storefront-media.test.ts` — typed registry, route/handle lookup, rights metadata, and precedence.
- `src/lib/shopify/presentation.ts` and `src/lib/shopify/presentation.test.ts` — attach only presentation media fallback to normalized Shopify products; keep all commerce values unchanged.
- `src/lib/shopify/e2e-fixtures.ts` — deterministic commerce plus approved image fixtures; retain separate missing/failed-media cases.
- `src/sanity/types.ts`
- `src/sanity/lib/settings.ts` and a new adjacent `src/sanity/lib/settings.test.ts` if needed.
- `src/sanity/lib/editorial-pages.ts` and `src/sanity/lib/editorial-pages.test.ts`
- `src/sanity/lib/queries.ts`, `src/sanity/schemaTypes/**`, `src/sanity/extract.json`, and `src/sanity/generated.ts` are out of scope unless a proven projection/schema defect blocks exact approved media. If touched, use additive schema changes, regenerate outputs, and document migration/rollback before continuing.
- Approved copies/exports under new `public/images/storefront/approved/`; source files in `images-for-gallery/**` remain read-only inputs and must not be renamed, deleted, or edited.
- `next.config.ts` only if exact approved remote delivery needs a restrictive image-host rule; do not broaden hosts unnecessarily.

### Tests and release evidence

- `tests/e2e/homepage.spec.ts`
- `tests/e2e/catalog.spec.ts`
- `tests/e2e/gallery.spec.ts`
- `tests/e2e/fragrance-guide.spec.ts`
- `tests/e2e/about.spec.ts`
- `tests/e2e/contact.spec.ts`
- `tests/e2e/account.spec.ts`
- `tests/e2e/cart.spec.ts`
- Rewrite `tests/e2e/storefront-visual.spec.ts` so placeholders fail and exact layout/media assertions are route-specific.
- New `tests/e2e/storefront-release.spec.ts` for read-only protected Preview/Production smoke verification; it must not add to a live cart or follow account/checkout destinations.
- `playwright.config.ts` only for deterministic viewport/server configuration.
- Replace stale evidence in `docs/features/evidence/storefront-redesign/desktop-1440/`, `mobile-390/`, and `mobile-320/` with fresh final-SHA captures for all nine routes.
- Add `docs/features/evidence/storefront-redesign/figma-reference/` for exact target exports, `comparison/` for paired/overlay evidence and route discrepancy notes, and `media-manifest.md` for source/rights/alt/crop/usage evidence.
- Rewrite `docs/features/evidence/storefront-redesign-verification.md`; do not preserve the current false “complete” disposition.
- Update `DESIGN.md`, `.impeccable/design.json` only when approved durable guidance changes, `docs/planning/roadmap.md`, and `specs/d001c771_storefront-redesign-handoff.md` so status matches evidence.

Do not change dependencies/lockfiles, Storefront/Admin clients, GraphQL operations, cart cookies/actions, customer/checkout gates, Sanity project/dataset configuration, cache-invalidation infrastructure, deployment protection, environment secrets, or production data. A required change outside this list is an ownership blocker and requires a revised plan.

## Implementation sequence

### 1. Re-establish safety and capture exact design/media evidence

1. Confirm clean status, fetch the configured remote, verify PR #51 head identity and main ancestry, reread the roadmap, PR comments, and current evidence. Do not start from stale green checks.
2. Run `node .agents/skills/impeccable/scripts/context.mjs --target 'src/app/(website)'` once. Load the applicable audit/adapt/harden/polish references; do not run a visual-world replacement.
3. Product designer captures the 12 exact Approved Figma nodes and all eight evidence categories, including exact asset roles/exports and approved mobile behavior. Record exact export dimensions and whether each asset may be committed/served.
4. Build a media provenance matrix from Figma asset evidence, `images-for-gallery/**`, existing Sanity publication evidence, and product fixtures. For each intended public asset record source, owner, rights, factual alt, product/route mapping, fit/crop, and approval. Missing rights or a questionable product match is a blocker, not permission to use generic art.
5. Capture current PR baseline renders at 1440×1000, 390×844, and 320×844. Record placeholder text, image load failures, reserved blank areas, console/network failures, and owning files.

### 2. Produce and approve a route-by-route discrepancy matrix

For each route and viewport, the product designer compares runtime to its exact contract across hierarchy, grid/dimensions, surfaces, typography, spacing, media/crop, responsive reading order, interaction/motion, content extremes, and approved divergences. Classify every finding as:

- implementation defect to fix;
- approved intentional divergence to preserve;
- rights/content/provider blocker;
- new direction requiring human approval;
- out of scope.

The matrix must explicitly reject the current generic shared-template approach where it differs from the Approved composition. The recorded user pre-approval opens exact-restoration implementation after this matrix is complete; it does not approve a newly invented design or unverified asset.

### 3. Establish deterministic approved media resilience

1. Copy/export only manifest-approved assets to `public/images/storefront/approved/`; optimize without changing visual truth, preserve useful intrinsic dimensions, and avoid unnecessary high-resolution bloat.
2. Implement the typed media registry and one-shot resilient image composition. Add tests for provider-first selection, route/handle fallback, no cross-product substitution, failure switching, intrinsic aspect, priority/lazy behavior, alt semantics, and no fallback loop.
3. At the Shopify presentation boundary, add only matched media fallback. Preserve every normalized commerce field byte-for-byte and keep unknown products truthful (no invented image).
4. At the Sanity presentation boundary, provide the approved versioned Home/Gallery/Guide/About fallback only for the contractually allowed missing/unconfigured/unavailable cases. Preserve rights filtering, authored order, published intentional emptiness, draft/published separation, metadata, and cache behavior.
5. Remove public settled-state `I·D`, “IMAGE COMING SOON”, and blank fixed media regions. Keep explicit Storybook states for no approved fallback so omission/failure remains testable and honest.

### 4. Rebuild exact route compositions in Storybook first

- **Home:** reproduce `255:616`/`255:638`, including first-view split, exact HeroCarousel envelope/control placement from `296:100`/`296:174`, Cabinet band, route-specific section proportions, founder/service/longevity/closing invitation, responsive reading order, and approved media. The stable H1/copy/CTA remain server rendered.
- **Shop/Collection:** reproduce the decisive intro, elevated browse field, exact grid/card proportions and rhythm, populated/empty/error/loading states, and real product media without implying filters/sort that do not exist.
- **Product detail:** reproduce full-height media/details split, sticky desktop media, uninterrupted mobile order, commerce hierarchy, sold-out/unavailable states, long detail content, and mapped product media. Shopify truth and add-to-cart behavior remain unchanged.
- **Gallery:** preserve the approved authored campaign/market cadence, rights filtering, local viewer counts, image fit/hotspots, focus behavior, populated/one-group/empty/unavailable/loading states, while ensuring the approved resilience set appears when the content source is contractually absent.
- **Fragrance Guide:** reproduce the Editorial composition, readable measure/asymmetry, approved hero/editorial media, short/long/missing content, and factual guide copy only.
- **About:** reproduce the fully light alternating chapter composition and exact 3:4 artwork inside 4:3 FIT slots; text-only behavior remains valid when no approved asset applies.
- **Contact:** reproduce the direct-email composition exactly; do not add a form, phone, address, hours, response-time promise, or decorative media absent from the contract.
- **Account:** reproduce the approved hosted handoff board and all unavailable/error/loading/long states, preserving no Account-current navigation and no local authentication UI.
- **Cart:** reproduce populated/empty hierarchy, exact line-media proportions, Midnight summary, updating/error/unavailable/long-cart states, and checkout gating without modifying commerce actions.

Each changed composition/component gets desktop, 390, 320, loading, error/unavailable, empty, long/unbroken content, missing and failed media, focus, commerce, and reduced-motion stories as applicable. Use semantic tokens and existing shadcn/Radix primitives; do not duplicate controls or encode text into raster images.

### 5. Integrate routes and harden all public states

1. Wire each route to its explicit composition and approved media precedence. Shared shell primitives may remain shared, but page hierarchy/proportion must be route-owned.
2. Ensure loading skeleton geometry reflects the destination composition and never counts as final media. Error/not-found/empty states must remain complete compositions with truthful recovery.
3. Preserve Gallery/Sanity and Account/Cart/Shopify behavior while removing production-media dependency from the presentation layer only.
4. Run one bounded combined desktop/390/320 comparison pass, fix the complete discrepancy batch, then run one confirmation pass. Do not substitute repeated subjective polishing for the independent review gate.

## Accessibility, responsive, and content-extreme coverage

Verify in changed stories and integrated routes:

- semantic header/nav/main/article/section/footer landmarks; exactly one visible H1; ordered H2/H3 hierarchy; logical DOM order independent of desktop visual alternation;
- native links/buttons/fieldset controls, truthful disabled/busy states, written status meaning, and no image/color-only essential information;
- keyboard-only navigation; 44×44 minimum targets; visible mode-aware focus; mobile menu, Gallery dialog, Cart drawer focus containment; Escape; scroll lock; exact trigger focus restoration;
- WCAG 2.1 AA axe and manual contrast checks on Sage, Bone, Midnight, gold, hover, focus, disabled, sale, error and feedback states;
- reduced motion disables carousel autoplay/crossfade, reveals, skeleton pulse, and overlay transitions while leaving all content/media visible; Save-Data behavior remains honest;
- no horizontal overflow at 320/390, natural-height/safe-area handling, tablet and wide-desktop interpolation, and reflow at effective 200% zoom without clipped controls or text;
- factual alt text for meaningful media; empty alt/decorative semantics where appropriate; no asset used outside its approved route/product meaning; image failures preserve geometry only when the contract requires it;
- long/unbroken product names, scent notes, headings, email, captions and sections; large ZAR/sale/from values; zero/one/many products; sold-out/low-stock/unavailable variants; many cart lines and quantities; partial/empty editorial data; invalid rights metadata; provider errors; account/checkout gates;
- image loading priorities: one appropriate first-view image eager, later media lazy; stable intrinsic/aspect sizing; constrained responsive `sizes`; no unnecessary image transfer on constrained connections;
- no uncaught console errors, hydration warnings, page errors, failed first-party requests, or failed final image requests. Expected provider failure must result in the designed fallback and be explicitly asserted.

## Observable acceptance criteria

1. A provenance-backed discrepancy matrix covers all nine public route families and all 12 scoped Approved Figma nodes, with every issue marked fixed, approved divergence, blocker, or out of scope.
2. Home, Shop/Collection, Product detail, Gallery, Fragrance Guide, About, Contact, Account, and Cart use route-specific Approved desktop/mobile compositions rather than one generic legacy template treatment.
3. Fresh full-page final-SHA renders exist for all nine routes at 1440px, 390px, and 320px (27 runtime captures), paired route-by-route with exact Figma reference/comparison evidence. The product designer and quality reviewer record discrepancies and their dispositions; green structural tests alone cannot satisfy this criterion.
4. Every composition that calls for media shows approved, rights-recorded media on the protected Preview. No settled public route contains `I·D` fallback art, “IMAGE COMING SOON”, an unintended empty media region, a broken image, a test-only data URI, or an unapproved cross-product substitution.
5. Approved repository fallbacks work without production media data, while valid Sanity/Shopify media remains first priority. Shopify continues to own all commerce truth and Sanity all editable editorial truth/order/publish state.
6. HeroCarousel matches the exact desktop/mobile geometry and interaction intent, retains a stable server-rendered H1/copy/CTA, and satisfies ordinary autoplay plus focus/hidden/offscreen/pause/manual/reduced-motion/Save-Data behavior.
7. Route-specific populated/loading/error/empty/not-found/content-extreme states are complete, layout-faithful, truthful, and recoverable; skeletons never pass as final imagery.
8. Storybook contains and tests every changed reusable and route composition state at relevant desktop/390/320 widths, including approved media, absent/failed media, long content, focus, commerce states, and reduced motion. Storybook interaction and axe tests pass.
9. Keyboard/focus, 44px targets, WCAG AA, semantic order, dialog/drawer behavior, factual alternatives, reduced motion, 200% zoom, responsive overflow, and content extremes pass the coverage above.
10. Targeted Vitest, `corepack pnpm check`, the complete Playwright suite, GitHub `quality`, and `just pr-gate 51` pass by exit status on the final PR SHA. Missing/skipped/cancelled/timed-out required checks are failures.
11. The browser release debugger verifies the exact protected Preview deployment: authenticated/protected HTTP 200 for `/api/health` and all nine route families, expected image requests, loaded image dimensions, no placeholder strings, no console/page/first-party failures, and 1440/390/320 screenshots tied to SHA/deployment ID.
12. Independent `quality_reviewer` review passes the acceptance-to-evidence matrix, source-of-truth boundaries, media manifest/rights, final diff, Storybook, rendered Figma comparisons, accessibility evidence, and release records.
13. `DESIGN.md`, sidecar when applicable, roadmap, redesign handoff, evidence, and PR description truthfully replace the current false completion claim and identify any remaining launch blockers.
14. PR #51 is no longer Draft only after all prior criteria pass. A human performs the protected merge. The resulting protected-`main` Vercel Production deployment is then verified read-only for health, metadata, all route families, intended media, browser/network errors, and logs.
15. The final diff contains no invented claims/commerce values, secrets, production data mutation, protection weakening, unrelated changes, generated junk, dependency churn, direct production deploy, editorial publication, or unauthorized rollback.

## Deterministic verification commands

Judge every command only by exit status. Record command, UTC timestamp, source SHA, environment, and result in `docs/features/evidence/storefront-redesign-verification.md`.

```bash
# Safety and exact branch identity before editing.
git status --short --branch
git fetch infusion-diffusion main agent/storefront-redesign-phase-1
git rev-list --left-right --count infusion-diffusion/main...HEAD
git merge-base --is-ancestor infusion-diffusion/main HEAD
gh pr view 51 --json state,isDraft,headRefName,headRefOid,baseRefName,statusCheckRollup,url
corepack pnpm install --frozen-lockfile

# Once per implementation session.
node .agents/skills/impeccable/scripts/context.mjs --target 'src/app/(website)'

# Focused contracts; add exact adjacent tests for every changed file.
corepack pnpm test -- src/content/storefront-media.test.ts src/components/storefront-media.test.tsx src/lib/shopify/presentation.test.ts src/sanity/lib/settings.test.ts src/sanity/lib/editorial-pages.test.ts src/components/hero-carousel.test.tsx src/components/gallery-viewer.test.tsx src/components/templates/storefront-templates.test.tsx src/components/account/account-entry.test.tsx
corepack pnpm test:stories
corepack pnpm build-storybook

# Only if a Sanity schema/query/generated-type file changed.
corepack pnpm exec sanity schemas validate --level error
corepack pnpm sanity:schema
corepack pnpm sanity:typegen
git diff --exit-code -- src/sanity/extract.json src/sanity/generated.ts

# Fresh local 27-route evidence and explicit placeholder/media/layout rejection.
SAVE_STOREFRONT_EVIDENCE=1 corepack pnpm exec playwright test tests/e2e/storefront-visual.spec.ts --project=chromium

# All customer journeys and runtime accessibility assertions.
corepack pnpm exec playwright test tests/e2e/homepage.spec.ts tests/e2e/catalog.spec.ts tests/e2e/gallery.spec.ts tests/e2e/fragrance-guide.spec.ts tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/account.spec.ts tests/e2e/cart.spec.ts tests/e2e/storefront-visual.spec.ts --project=chromium

# Run if context.mjs requests manual detection; otherwise preserve the enabled hook evidence.
node .agents/skills/impeccable/scripts/detect.mjs --json 'src/app/(website)' src/components src/app/globals.css

# Full repository gates.
corepack pnpm check
corepack pnpm exec playwright install chromium
corepack pnpm test:e2e
git diff --check
git status --short

# Required protected PR gate after pushing the final SHA.
just pr-gate 51
```

The visual spec must wait for the route H1, `document.fonts.ready`, all required first-view images to complete with positive `naturalWidth`, reduced-motion/stable-carousel rendering, and network settling. It must explicitly fail on case-insensitive `IMAGE COMING SOON`, visible generic `I·D` fallback art, failed required images, unintended empty media containers, horizontal overflow, console/page errors, or failed first-party requests. It must assert route-specific dimensions/ordering from the captured Figma handoff rather than only taking screenshots.

For the exact protected Preview, use only an already authorized Vercel SSO session or scoped protection credential supplied through the operator’s live environment; never print it or commit it:

```bash
PLAYWRIGHT_BASE_URL="$VERCEL_PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/storefront-release.spec.ts --project=chromium
```

`storefront-release.spec.ts` must be read-only: discover a current product destination from `/shop`, do not add to a live cart, do not follow hosted account/checkout links, do not publish content, and do not change provider state. If authentication is unavailable, protected Preview verification is blocked; a green Vercel build is not a substitute.

After the human merge and successful automatic Production deployment:

```bash
PLAYWRIGHT_BASE_URL="$PRODUCTION_URL" corepack pnpm exec playwright test tests/e2e/storefront-release.spec.ts --project=chromium
```

Also record the Production deployment ID, protected-main SHA, `/api/health`, route/status/metadata/media results, console/network summary, and relevant Vercel build/runtime logs. Do not run a direct production deployment command.

## Preview and comparison evidence

The final evidence record must include:

- PR #51, final branch SHA, Preview URL/deployment ID, protection/auth context, timestamp, browser and environment;
- exact Figma file/node/Approved-state provenance and all eight evidence categories;
- exact Figma exports plus 27 runtime screenshots at 1440×1000, 390×844, and 320×844;
- paired/overlay or side-by-side route comparisons with measurable discrepancy notes for hierarchy, grid, typography, spacing, media/crop, and responsive order;
- media manifest with source, owner, rights approval, factual alt, intrinsic dimensions, optimization, route/product mapping, and request URL evidence;
- Storybook story/state inventory and interaction/axe results;
- keyboard, focus, reduced motion, 200% zoom, content extremes, loaded-image, console/page/network, `/api/health`, and logs evidence;
- command exit statuses tied to the final SHA;
- sync matrix for Figma, `DESIGN.md`, sidecar, CSS, components, Storybook, route runtime, Sanity/Shopify boundaries, Preview, and Production;
- every intentional divergence or remaining blocker. Do not call the release pixel-perfect where browser/content accessibility intentionally differs; name and approve the divergence.

## Human gates and recorded pre-approval

- **Design before implementation:** the exact listed frames are already Approved, and the user’s recorded “I pre approve everything” authorizes faithful restoration and use of already rights-approved assets after evidence capture. The product designer must still prove that each change is exact restoration. Any new direction, unsupported asset substitution, copy, interaction, or divergence remains blocked pending a specific human approval.
- **Media/content rights:** the content/legal owner must have approved every public fallback’s source, product/route mapping, factual alt, and rights. Existing Gallery publication evidence can satisfy its entries; filenames or Figma presence alone cannot satisfy product-fixture rights.
- **Storybook/responsive review:** final desktop/mobile composition evidence requires human design acceptance. The product designer provides a recommendation but cannot grant the gate.
- **Editorial publish:** no Sanity publication is required or authorized by this implementation plan; resilience media must make Preview review possible without it. If an editor chooses to alter/publish Sanity content, an authorized human must review the whole document/draft and explicitly publish or schedule it.
- **Merge:** the user has pre-authorized merge once all objective gates genuinely pass, but repository policy still requires a human to perform the protected merge; the writing agent must not merge its own PR. PR #51 remains Draft until evidence and independent review pass.
- **Production:** use the protected-`main` automatic deployment resulting from the human merge. If Vercel requires manual promotion, an authorized human performs it; no agent bypasses protection or deploys directly. The browser release debugger may perform read-only post-deployment verification.
- **Rollback:** blanket pre-approval is not an impact-specific rollback decision. Record the incident, affected URLs, deployment/SHA, logs, and named last-known-good target; obtain fresh human authorization before a Vercel rollback, code revert merge, environment change, or destructive content recovery.

## Rollback and recovery

Before merge, record the current Production deployment ID/SHA as the last-known-good target. If Preview fails, correct PR #51 with another reviewed commit or abandon/revert the branch; never mutate Production to fix Preview. If post-merge Production has a material regression, recommend restoring the recorded last-known-good Vercel deployment or reverting PR #51 through the protected branch, then wait for human authorization. The presentation-media change requires no Shopify or Sanity data rollback. Do not delete Sanity assets or alter commerce data. After recovery, repeat health/route/media/console checks and add the missed regression assertion.

## Unresolved decisions and blockers

1. Exact official Figma connector/handoff availability for all 12 nodes and asset evidence. Missing exact evidence blocks the fidelity phase.
2. Rights/provenance and truthful mapping for each existing product fixture. Only Gallery assets currently have a clear repository rights record.
3. Whether every Approved Figma media asset can legally be exported and served from the repository. If not, the content owner must provide an approved alternative matching the same role/crop; the implementation cannot invent one.
4. Protected Preview authentication for automated browser evidence. No SSO weakening or anonymous substitution is allowed.
5. Final live Shopify catalogue/account/checkout provisioning may differ from deterministic fixtures. This task verifies presentation and truthful gates, not a real purchase or customer login.
6. Any request to publish new Sanity content, change product facts/prices, add legal/footer destinations, or alter production environment flags requires a separate owner decision.

## Residual risks

- Existing documentation and green checks overstate completion; reviewers may accidentally trust stale screenshots unless all old evidence is explicitly superseded.
- Figma-to-browser comparison is sensitive to font rendering, image encoding, and dynamic content. Use exact dimensions and paired visual review, document tolerances/divergences, and do not reduce acceptance to an undifferentiated pixel threshold.
- Static fallback assets can become stale or mismatched as Shopify handles/products change. Unknown mappings must fail closed to honest omission, and the manifest needs maintenance with catalogue changes.
- Repository fallback editorial media can drift from Sanity. Provider-first precedence, explicit missing-document semantics, and tests are required to avoid overriding intentional publication choices.
- Public local images increase bundle/deployment size. Optimize approved copies and verify responsive transfer sizes on constrained connections without degrading the approved composition.
- Protected Preview, Figma, Sanity, Shopify, GitHub, or Vercel availability can block evidence. A blocked external check keeps the release gate red.
- User pre-approval does not let the implementation owner self-approve design evidence, merge its own work, publish editorial content, bypass Production protection, or perform an uninformed rollback.
