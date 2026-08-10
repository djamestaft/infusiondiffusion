# Ship the initial Infusion Diffusion storefront redesign release

## Objective

Finish PR #51 as the initial public Perfumer’s Cabinet redesign release. Replace the visibly old/shared-template treatment across Home, Shop/Collection, Product detail, Gallery, Fragrance Guide, About, Contact, Account, and Cart; make Home, Shop, and Product detail the strongest exact composition matches; and guarantee that approved repository media appears wherever the approved composition calls for imagery without depending on production Sanity or Shopify media.

Use `specs/e59196a4_storefront-redesign-fidelity.md` and `DESIGN.md` as the approved implementation handoff. This release intentionally does **not** require a new live Figma connection, per-node provenance packet, pixel-overlay archive, exhaustive localization matrix, or another design exploration phase.

## Baseline and release intent

- Delivery remains on the existing Treehouse-managed `agent/storefront-redesign-phase-1` branch and draft PR #51. Use one delivery branch and one PR.
- The last inspected PR head was `5b590b20919894f7a4473ae2ffb9f3d72e1cd0e2`, 28 commits ahead and 0 behind the configured remote’s `main`. The builder must fetch and recheck this before editing.
- PR #51’s existing green CI/Vercel statuses are not acceptance evidence: direct Preview review reopened visual acceptance because the deployed pages still look old and current tests explicitly tolerate `I·D`, “IMAGE COMING SOON”, empty Gallery content, and missing images.
- Existing committed screenshots identify the highest-impact failures: generic Home hero art, sparse Collection/Product compositions, product/cart placeholder labels, and an empty Gallery.
- The user’s existing blanket approval covers implementing and releasing the already documented Perfumer’s Cabinet direction once objective gates pass. It does not authorize invented claims, mismatched product imagery, protection bypass, failed-check bypass, self-approval by the implementation owner, or an uninformed rollback.

## Specialist routing and branch topology

- **Implementation owner (only writer): `storefront_engineer`.** Owns Next.js/UI, approved media presentation fallbacks, Storybook, tests, release evidence, and documentation within the file boundaries below.
- **Read-only advisor: `product_designer`.** Uses `DESIGN.md`, the committed fidelity plan, existing approved references, and rendered pages to shape the route-specific hierarchy and perform a concise desktop/390/320 visual review. No new live Figma capture is requested.
- **Read-only advisor: `browser_release_debugger`.** Verifies the protected Vercel Preview and post-merge Production deployment, health, media/network behavior, console errors, and route smoke tests. It does not edit, merge, deploy directly, weaken protection, publish content, or roll back.
- **Independent review owner: `quality_reviewer`.** Reviews the final implementation and evidence separately from the writer and can reject technically green but visibly old output.
- Keep one writer, one branch, and PR #51. Apply `.agents/skills/parallel-agent-worktrees/SKILL.md` because this is a non-primary checkout; do not create concurrent writing agents or a second PR.

## Applicable project skills

1. **`feature-brief`** — this plan defines route outcomes, states, ownership, media behavior, accessibility, verification, release gates, and failure handling for a nine-route release.
2. **`impeccable`** — the task is a redesign correction, responsive adaptation, hardening, and bounded polish pass. Run context once, preserve the Perfumer’s Cabinet visual world, inspect all viewports in one batch, fix the batch, and perform one confirmation pass.
3. **`design-to-storybook`** — the implementation must keep `DESIGN.md`, semantic tokens, reusable contracts, Storybook, and runtime routes synchronized. Repository-approved design guidance replaces a new live Figma capture for this release.
4. **`sanity-content-change`** — applies narrowly to presentation fallbacks for Home, Gallery, Fragrance Guide, and About. Preserve Sanity’s editorial ownership, draft/published behavior, rights filtering, queries, generated types, and cache behavior.
5. **`shopify-storefront-change`** — applies narrowly to image presentation for ProductCard, Product detail, and Cart lines. Preserve Shopify product, variant, price, inventory, cart, checkout, and customer truth.
6. **`quality-gate`** — requires targeted component checks, full unit tests, Storybook tests/build, Next build, focused route E2E, accessibility/runtime evidence, CI, and an independent diff review.
7. **`release-debug`** — required for protected Preview and Production identity, `/api/health`, media and browser errors, logs, and rollback recommendations.
8. **`parallel-agent-worktrees`** — required for safe work on the existing non-primary delivery branch.

## Approved design references — repository guidance, not a new capture gate

Canonical Figma file recorded by `DESIGN.md`: `GYiQd7QSAwCSaGtt0alKG2`, expected state **Approved**. The following exact IDs remain the typed design references, but implementation proceeds from `DESIGN.md`, feature docs, existing captures, and `specs/e59196a4_storefront-redesign-fidelity.md`; do not invoke or wait for a live connector.

| Surface | Approved reference IDs |
| --- | --- |
| Home | `255:616`, `255:638` |
| HeroCarousel | `296:100`, `296:174` |
| Collection | `203:137` |
| Product detail | `203:294` |
| Editorial / Fragrance Guide | `203:373` |
| Gallery | `357:2` |
| About | `316:198` |
| Contact | `329:58` |
| Account | `337:321` |
| Cart | `229:2` |

The repository guidance supplies dimensions/layout, semantic variables, typography, spacing/assets, responsive behavior, accessibility/interaction, content extremes, and intentional divergences. If the repository guidance is genuinely contradictory or lacks a necessary decision, the product designer makes the smallest recommendation consistent with the approved direction; only a new direction or unsupported claim returns to a specific human approval gate.

## System ownership boundaries

- **Figma / `DESIGN.md` / committed fidelity plan:** approved visual direction and documented responsive contracts. No live capture or new visual world is in scope.
- **Next.js:** public route compositions, rendering, responsive layout, loading/error/empty UI, accessible interaction, media fallback selection at the presentation layer, and cart presentation.
- **Storybook:** reusable component and page-composition contracts, including responsive, loading, empty/error, long-content, commerce, and media-failure states.
- **Sanity:** editable editorial copy, page fields, carousel and Gallery order, captions, alt text, rights metadata, draft/published state, and editorial publication. Repository fallbacks are release resilience, not editable CMS truth.
- **Shopify:** products, handles, variants, titles, prices, availability, carts, discounts, checkout URLs, customer handoff, and orders. Static repository media cannot supply or override these values.
- **Vercel:** protected Preview/Production deployment identity, environment, health, and logs. Deployment protection remains enabled.
- **Humans:** product/design owner retains approval for new direction; content/legal owner retains media-rights and factual-alt approval; editor retains publication; repository owner performs merge; authorized operator controls manual promotion and rollback.
- Never add public credentials, expose tokens, or introduce new `NEXT_PUBLIC_*` secrets.

## Approved media and presentation fallback contract

1. Use only repository media identified by the user as approved and rights-safe, with existing Gallery rights records and same-name product fixture mapping. Add a concise manifest containing source, owner/approval reference, route or Shopify handle, factual alt, intrinsic dimensions, and fit/crop intent.
2. Deterministic priority:
   1. valid provider media from Sanity/Shopify;
   2. exact route-role or product-handle-matched approved repository media;
   3. remove an optional media slot and close the layout gap, or show the route’s honest unavailable state.
3. Never use a different product’s image as a substitute. Repository media may supplement presentation only; it cannot supply product names, descriptions, prices, variants, inventory, discounts, totals, checkout, or customer state.
4. Home receives two or three approved local carousel/hero images when Sanity media is absent or fails. Fragrance Guide receives an approved editorial image fallback. Gallery receives its approved campaign/market fallback only for missing/unconfigured/unavailable content according to the existing fallback contract; do not override an intentional published empty state. ProductCard, Product detail, and Cart line media use same-product handle/title fallbacks.
5. A failed remote image may switch once to its approved local fallback without layout shift. Prevent retry loops and preserve factual alternative text.
6. Remove settled-state generic `I·D` art, “IMAGE COMING SOON”, broken images, accidental blank media frames, and test-only data URIs from public routes. Loading skeletons may appear only during loading.
7. Preserve approved image behavior: 4:5 HeroCarousel, 3:4 ProductCard/media recognition, Gallery hotspots/crops and authored order, and About’s 3:4 artwork contained in 4:3 slots when approved portrait media exists.

## Exact file ownership

Only `storefront_engineer` writes the following. Preserve unrelated PR changes and avoid churn in files that already satisfy the release contract.

### Public routes and boundaries

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
- `src/app/(website)/cart/actions.ts` is read-only; no cart/checkout behavior change is authorized.

### UI, route compositions, and Storybook

- `src/components/templates/storefront-templates.tsx`
- `src/components/templates/storefront-templates.stories.tsx`
- `src/components/templates/storefront-templates.test.tsx`
- New route-specific modules are allowed when they eliminate the generic template treatment without unnecessary churn:
  - `src/components/templates/home-template.tsx`
  - `src/components/templates/collection-template.tsx`
  - `src/components/templates/product-detail-template.tsx`
- `src/components/hero-carousel.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/gallery-viewer.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/ui/product-card.tsx`, `.stories.tsx`, `.test.tsx`, and `product-card.fixtures.ts`
- `src/components/account/account-entry.tsx`, `.stories.tsx`, `.test.tsx`
- `src/components/cart/cart-line.tsx`, `cart-page.tsx`, `cart-shell.tsx`, `cart-summary.tsx`, `cart.stories.tsx`, and adjacent cart tests
- `src/components/navigation.tsx`, `storefront-footer.tsx`, and their stories/tests only when the cohesive-shell review finds a concrete defect
- New `src/components/storefront-media.tsx` and `src/components/storefront-media.test.tsx` for stable, one-shot provider-to-local media fallback
- `src/app/globals.css` for semantic/layout changes; use existing tokens and primitives rather than raw replacement colors
- `.storybook/preview.ts` only if viewport or reduced-motion determinism requires correction

### Presentation data and approved repository media

- New `src/content/storefront-media.ts` and `src/content/storefront-media.test.ts`
- `src/lib/shopify/presentation.ts` and `src/lib/shopify/presentation.test.ts`
- `src/lib/shopify/e2e-fixtures.ts`
- `src/sanity/types.ts`
- `src/sanity/lib/settings.ts` and adjacent tests if added
- `src/sanity/lib/editorial-pages.ts` and `src/sanity/lib/editorial-pages.test.ts`
- Approved public copies under new `public/images/storefront/approved/`
- `images-for-gallery/**` remains a read-only source; do not rename, delete, or modify source files
- `next.config.ts` only if a restrictive image-host adjustment is proven necessary

Do not modify Shopify GraphQL/client/cart-cookie/action behavior, Sanity schema/GROQ/generated types/cache infrastructure, dependencies, lockfiles, deployment protection, secrets, or provider data. If a schema/query/API change becomes necessary, stop and re-route rather than silently crossing the selected owner boundary.

### Tests, evidence, and release records

- `tests/e2e/homepage.spec.ts`
- `tests/e2e/catalog.spec.ts`
- `tests/e2e/gallery.spec.ts`
- `tests/e2e/fragrance-guide.spec.ts`
- `tests/e2e/about.spec.ts`
- `tests/e2e/contact.spec.ts`
- `tests/e2e/account.spec.ts`
- `tests/e2e/cart.spec.ts`
- Rewrite `tests/e2e/storefront-visual.spec.ts` so placeholders, broken required media, old hero art, and overflow fail
- New `tests/e2e/storefront-release.spec.ts` for concise, read-only Preview/Production smoke verification
- `playwright.config.ts` only if needed for deterministic local/remote execution
- Replace stale final-route images under `docs/features/evidence/storefront-redesign/{desktop-1440,mobile-390,mobile-320}/`
- Rewrite `docs/features/evidence/storefront-redesign-verification.md` as a concise release record
- Add `docs/features/evidence/storefront-redesign/media-manifest.md`
- Update `DESIGN.md` and `.impeccable/design.json` only if durable approved guidance changes
- Update `docs/planning/roadmap.md` and `specs/d001c771_storefront-redesign-handoff.md` so they no longer claim unverified completion

## Implementation sequence

### 1. Re-establish the branch and run a concise design/media audit

1. Require a clean implementation checkout, fetch `infusion-diffusion/main` and the PR branch, confirm PR #51 head/ancestry, and reread the roadmap and committed fidelity plan.
2. Run Impeccable context once for `src/app/(website)`. Do not initialize a new visual world.
3. The product designer reviews current 1440, 390, and 320 renders against `DESIGN.md` and the fidelity plan, producing a concise route checklist: composition/hierarchy, responsive order, media, typography/surfaces, key spacing, and approved divergences. No connector call, provenance packet, pixel overlay, or exhaustive evidence matrix is required.
4. Confirm the approved repository asset mapping before copying media. Same-name product assets and already rights-recorded Gallery assets may proceed under the user’s approval; ambiguous mappings remain blocked.

### 2. Fix the strongest release surfaces first

- **Home:** replace the generic split/`I·D` treatment with the documented first-viewport composition, approved HeroCarousel media and geometry, stable H1/copy/CTA, Cabinet section, founder/service/longevity/closing sections, responsive order, and reduced-motion behavior.
- **Shop/Collection:** implement the documented decisive introduction, elevated browse canvas, intentional product-grid proportions and rhythm, complete cards with approved media, and useful populated/empty/error/loading states.
- **Product detail:** implement the documented full-height media/details split, sticky desktop image, continuous mobile reading order, strong product hierarchy, availability/purchase states, long details, and same-product fallback media.

Build or revise the corresponding Storybook compositions before integrating route changes. Avoid preserving generic template abstractions when they prevent these three pages from matching their distinct approved hierarchy.

### 3. Bring every remaining public route into the same release system

- **Gallery:** preserve approved campaign/market cadence, captions, viewer scopes, focus behavior, hotspots/crops, and honest empty/unavailable behavior; render approved fallback content only under the existing missing-source contract.
- **Fragrance Guide:** retain factual editorial copy, improve the documented intro/image/reading-grid composition, and use approved editorial fallback media.
- **About:** preserve the fully light alternating chapters, exact portrait FIT behavior, text-first missing-media state, CTA, and natural content height.
- **Contact:** preserve the approved direct-email asymmetric composition and static unavailable notice; add no form, phone, address, hours, response-time promise, or decorative claim.
- **Account:** preserve hosted Shopify handoff, truthful unavailable/error/loading states, no Account-current navigation divergence, and no local authentication UI.
- **Cart:** preserve Shopify-owned totals and checkout gating while aligning page hierarchy, line media, updating/error/empty states, mobile controls, and Midnight summary with the redesign.
- Keep Navigation, footer, focus treatment, semantic surfaces, and error/loading shells cohesive without flattening route-specific layouts back into one generic template.

### 4. Add deterministic media resilience and regression checks

1. Create the approved media registry/manifest and public optimized copies.
2. Use provider-first, exact local fallback second, honest omission/unavailable state third.
3. Add one-shot failure handling to HeroCarousel, ProductCard/detail, editorial media, Gallery where allowed, and Cart lines.
4. Update local fixtures so normal visual tests exercise real approved media. Retain explicit Storybook/unit states for no mapping and image failure.
5. Remove tests that treat placeholder labels or generic art as acceptable. Add explicit assertions that final-route content contains none of the forbidden fallback strings and that required images have positive `naturalWidth`.

### 5. Bounded responsive polish and integration

1. Run one combined visual pass at 1440×1000, 390×844, and 320×844 for all nine route families.
2. Fix the full batch of visible hierarchy, spacing, overflow, media-fit, focus, and reduced-motion defects.
3. Run one confirmation pass and stop. The product designer records a concise pass/fail route checklist; the quality reviewer independently inspects the final render and diff.
4. Update screenshots and the concise release record on the final SHA. Do not create an exhaustive overlay archive.

## Accessibility and proportional content-extreme coverage

This initial release must cover the following without expanding into exhaustive localization permutations:

- one visible H1 per route; logical H2/H3 order and semantic header/nav/main/article/section/footer landmarks;
- native link/button/fieldset semantics, truthful disabled/busy states, written commerce/error meaning, and no color-only status;
- keyboard basics across global navigation, Home carousel controls, Product purchase controls, Gallery viewer, Account recovery, Cart quantity/remove, mobile menu and Cart drawer;
- visible focus, minimum 44×44 targets, Escape/focus containment/restoration for menu/dialog/drawer, and no keyboard trap;
- WCAG 2.1 AA axe checks plus manual contrast review on Sage, Bone, Midnight, gold, focus, disabled, sale, and error surfaces;
- reduced motion disables autoplay/reveals/pulse/transitions as appropriate while preserving all content and media;
- no horizontal overflow or clipped actions at 390 and 320; natural-height reflow and a representative 200% zoom check on Home, Product, Gallery, Contact, and Cart;
- meaningful factual alt text, decorative empty alt where appropriate, stable aspect ratios, and no mismatched product depiction;
- representative long product title/scent notes, long editorial heading/body/caption/email, sale/sold-out/unavailable product, zero/many products, one/many Gallery items, empty and updating/error Cart, and Account unavailable/error states;
- no uncaught console/page errors, hydration warnings, failed required first-party requests, or broken final images.

## Observable acceptance criteria

1. Home, Shop/Collection, Product detail, Gallery, Fragrance Guide, About, Contact, Account, and Cart visibly read as one cohesive Perfumer’s Cabinet release rather than the old shared-template storefront.
2. Home, Shop, and Product detail receive distinct, high-fidelity documented compositions with the strongest hierarchy, proportion, and media treatment; they are not superficial color/typography restyles of the old template.
3. Every media-bearing route renders valid approved media on the protected Preview without requiring production Sanity/Shopify media. Provider media remains first priority, and all commerce/editorial ownership boundaries remain intact.
4. No settled public route shows generic `I·D` fallback art, case-insensitive “IMAGE COMING SOON”, broken images, unintended empty hero/product/gallery media, or a test-only data URI.
5. All nine routes render cleanly at 1440, 390, and 320 with no horizontal overflow, clipped primary content/actions, broken responsive order, or visibly old route treatment. Fresh final-SHA screenshots support the concise route checklist.
6. Home carousel, global/mobile navigation, Product actions, Gallery viewer, Account recovery, Cart controls/drawer, loading/error/empty states, and reduced-motion behavior remain functional and truthful.
7. Shopify continues to own price, availability, cart, checkout and customer truth; Sanity continues to own editable editorial truth and publication. No unsupported commerce/editorial claim is introduced.
8. Changed reusable components and page compositions have proportional Storybook states for desktop/mobile, approved media, missing/failed media, loading/error/empty, representative long content, commerce states, focus, and reduced motion. Storybook tests and build pass.
9. Keyboard basics, visible focus, 44px targets, WCAG AA, semantic headings/landmarks, dialog/drawer behavior, factual alternatives, reduced motion, representative 200% zoom, and the proportional content extremes above pass.
10. Focused route Playwright tests, full Vitest unit/integration tests, lint, typecheck, Storybook tests/build, Next production build, and the final GitHub `quality`/`just pr-gate 51` pass by exit status.
11. The browser release debugger verifies the exact protected Preview SHA/deployment: `/api/health`, all nine route families, required images, no forbidden fallback strings, desktop/390/320 smoke, console/page/request failures, and relevant Vercel logs.
12. The independent quality reviewer confirms the final diff is visually new, route-specific, accessible at the agreed proportional level, media-safe, and boundary-safe. Technical green status alone is insufficient.
13. PR #51 is moved out of Draft only after the prior gates pass. A human performs the protected merge. The automatic protected-`main` Production deployment is then verified read-only for health, metadata, all route families, intended media, console/network errors, and logs.
14. The final diff contains no secrets, production data writes, protection weakening, direct deployment, self-merge, editorial publish, invented claims, dependency churn, unrelated cleanup, or generated junk.

## Deterministic verification commands

Judge commands only by exit status. Record the final SHA, environment, command, and result in `docs/features/evidence/storefront-redesign-verification.md`.

```bash
# Safety and current PR identity.
git status --short --branch
git fetch infusion-diffusion main agent/storefront-redesign-phase-1
git rev-list --left-right --count infusion-diffusion/main...HEAD
git merge-base --is-ancestor infusion-diffusion/main HEAD
gh pr view 51 --json state,isDraft,headRefName,headRefOid,baseRefName,statusCheckRollup,url
corepack pnpm install --frozen-lockfile

# Once for this implementation session.
node .agents/skills/impeccable/scripts/context.mjs --target 'src/app/(website)'

# Focused changed contracts; adjust to include every changed adjacent test.
corepack pnpm test -- src/content/storefront-media.test.ts src/components/storefront-media.test.tsx src/lib/shopify/presentation.test.ts src/sanity/lib/editorial-pages.test.ts src/components/hero-carousel.test.tsx src/components/gallery-viewer.test.tsx src/components/templates/storefront-templates.test.tsx src/components/account/account-entry.test.tsx

# Full unit/integration and component gates.
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build

# Focused route, responsive, media, accessibility, and visual checks.
SAVE_STOREFRONT_EVIDENCE=1 corepack pnpm exec playwright test tests/e2e/storefront-visual.spec.ts --project=chromium
corepack pnpm exec playwright test tests/e2e/homepage.spec.ts tests/e2e/catalog.spec.ts tests/e2e/gallery.spec.ts tests/e2e/fragrance-guide.spec.ts tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/account.spec.ts tests/e2e/cart.spec.ts tests/e2e/storefront-visual.spec.ts --project=chromium

# Use only if context.mjs requests a manual detector run.
node .agents/skills/impeccable/scripts/detect.mjs --json 'src/app/(website)' src/components src/app/globals.css

git diff --check
git status --short

# After pushing the final PR SHA and GitHub quality completion.
just pr-gate 51
```

The visual test must wait for the H1, `document.fonts.ready`, required images to complete with positive `naturalWidth`, reduced-motion/stable-carousel rendering, and network settling. It must fail on visible `IMAGE COMING SOON`, generic Home `I·D` fallback art, broken required images, unintended blank media regions, horizontal overflow, console/page errors, or failed first-party requests.

Run the concise protected Preview smoke with an already authorized SSO session or scoped credential from the operator environment. Never print or commit authentication material and never weaken protection:

```bash
PLAYWRIGHT_BASE_URL="$VERCEL_PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/storefront-release.spec.ts --project=chromium
```

The release smoke must be read-only: check all route families at desktop and mobile sizing, inspect required image completion and forbidden fallback strings, discover a current Product URL from Shop, and verify health/console/network state. Do not add to a live cart, follow checkout/account destinations, publish content, or mutate provider data. If protected access is unavailable, Preview is blocked; green Vercel build status does not substitute.

After the human merge and successful protected-`main` deployment:

```bash
PLAYWRIGHT_BASE_URL="$PRODUCTION_URL" corepack pnpm exec playwright test tests/e2e/storefront-release.spec.ts --project=chromium
```

No direct `vercel deploy --prod` command is authorized.

## Preview, production, and rollback evidence

The concise release record must contain:

- PR #51 and final SHA; Preview URL/deployment ID; protection/auth context; timestamp/browser;
- 1440/390/320 screenshot manifest for all nine routes and the product URL used;
- concise product-designer route checklist, with Home/Shop/Product called out separately;
- approved media manifest and evidence that expected image requests loaded without forbidden fallback output;
- accessibility/keyboard/reduced-motion/zoom summary and Storybook state summary;
- command exit statuses, GitHub `quality`, and `just pr-gate 51` result;
- Preview `/api/health`, route status, console/page/request failures, and relevant Vercel logs;
- after merge: Production deployment ID, protected-main SHA, health/routes/media/metadata/browser/log results;
- named intentional divergences and residual blockers. Do not claim exhaustive pixel parity or localization coverage.

Before merge, record the current Production deployment ID and SHA as the last-known-good recovery target. A bad Preview is fixed by a new reviewed PR commit, never by mutating Production. A material post-merge failure may lead to a recommendation to restore the named Vercel deployment or revert PR #51 through the protected branch; only a human may authorize and execute rollback. No Shopify/Sanity data rollback should be necessary for presentation-only fallback changes.

## Human gates and blanket approval

- **Implementation/design direction:** existing Approved direction in `DESIGN.md`, the committed fidelity plan, approved responsive records, and the user’s blanket approval permit implementation now without new live Figma capture. Any newly invented direction, claim, or unapproved media mapping still requires a specific human decision.
- **Media rights/content:** the prompt identifies approved rights-safe repository media. The implementation owner must still record exact source/mapping/alt in the manifest and stop on ambiguity; the agent cannot infer legal rights from a filename.
- **Responsive design acceptance:** existing human approval of the documented direction remains in force. The product designer supplies a read-only final recommendation; the quality reviewer independently verifies it. A discovered deviation outside the approved direction returns to a human decision.
- **Editorial publish:** no Sanity publication is needed for this release plan. Any new publish/schedule/unpublish action remains an explicit authorized-editor gate.
- **Merge:** the user’s blanket approval records intent to merge after all checks genuinely pass, but project policy requires a human to perform the protected merge. The implementation agent must not merge its own PR.
- **Production:** automatic deployment from the human-protected merge is authorized for verification. If Vercel requires manual promotion, an authorized human performs it; agents do not deploy directly or bypass protection.
- **Rollback:** blanket release approval is not an informed incident-specific rollback authorization. Capture impact and the last-known-good target, then obtain fresh human authorization before any rollback, revert merge, environment change, or destructive content recovery.

## Residual risks

- Existing green CI and evidence are misleading because placeholder-tolerant tests passed; stale screenshots or status claims may be mistaken for final evidence unless explicitly superseded.
- Product fallback media can become stale if Shopify handles/titles change. Unknown or ambiguous products must fail closed to honest omission rather than display a different product.
- Repository editorial fallbacks can drift from Sanity. Provider-first precedence and explicit missing-source behavior must prevent overriding intentional publication choices.
- Browser font rendering, live copy length, and provider data can differ from local fixtures. This release uses concise visual review rather than exhaustive overlays, so minor non-structural differences remain possible.
- Local public imagery increases deployment size. Optimize approved copies and verify responsive `sizes`/lazy loading without degrading the first view.
- Protected Preview authentication, GitHub, Vercel, Sanity, or Shopify availability can block release evidence. Blocked checks remain red gates.
- The user’s blanket approval does not allow the writing agent to self-merge, publish Sanity content, weaken protection, bypass failed checks, deploy directly, or perform an uninformed rollback.
