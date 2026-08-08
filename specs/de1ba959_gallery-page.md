# Gallery page implementation plan

## Objective and delivery shape

Add a customer-facing `/gallery` route that lets South African shoppers browse rights-cleared editorial fragrance photography in a responsive grid and inspect an image in an accessible viewer. The page extends the established “Perfumer’s Cabinet” system; it does not redesign adjacent routes or add commerce behavior.

Delivery uses one implementation branch and one pull request. `storefront_engineer` is the only repository writer. `product_designer` is a read-only design advisor (Figma/design handoff, responsive and interaction critique), `browser_release_debugger` is a read-only preview verifier, and `quality_reviewer` independently reviews the completed change. No concurrent writer, extra worktree, or second pull request is authorized by this plan.

## Blocking decisions and human design gate

Implementation must not begin until a human product/design owner approves all of the following in a decision-complete brief and exact Figma frames:

1. The route and navigation contract: label `Gallery`, path `/gallery`, and proposed desktop/mobile order `Shop`, `Gallery`, `Fragrance Guide`, `About`, `Contact`.
2. The content contract: Sanity `editorialPage` slug `gallery`; page eyebrow/title/introduction/SEO; one to ten ordered, rights-confirmed 3:4 section images; section heading as the visible image title; section body as the optional caption. Final copy, asset rights, factual alt text, and the intended image order are owner/editor decisions.
3. The interaction contract: an ordered responsive grid; each image is operable as a real button; activation opens an existing Radix/shadcn-based `Dialog` composition with a contained full image, visible title/caption and position, Close, Previous, and Next controls; no autoplay, drag-only gesture, infinite animation, filtering, likes, sharing, or deep-link state.
4. Responsive states at 1440, 390, and 320 CSS pixels, including default/populated, one-item, maximum-content, empty/unavailable, loading, viewer-open, first item, middle item, and last item.
5. A design critique that explicitly assesses visual hierarchy, whether the artifact leads in Experience mode, grid rhythm without reordering the DOM, crop safety, navigation crowding, dialog scale, caption legibility, focus visibility, reduced motion, 200% zoom, image-loading behavior, and constrained-connection cost.

Create the work on Figma page `Feature / Gallery`, with frames named `Gallery / Desktop / <state>` and `Gallery / Mobile / <state>`, marked `Approved`. Record exact file/frame URLs and node IDs in `docs/features/gallery-page.md`. Current operations guidance says Pi/Figma MCP provider approval is pending and forbids live Figma calls; therefore the product designer or human must provide the approved capture packet without an agent attempting MCP access. Missing exact Approved frame links, missing responsive approval, or missing rights-cleared content/assets is a blocker, not permission to infer final direction from existing pages or provisional product fixtures.

## Acceptance criteria

1. Navigating directly to `/gallery` returns HTTP 200, renders one H1 and a useful introduction, emits approved `en-ZA` title/description/Open Graph metadata, preserves the cart utility, and marks only Gallery as `aria-current="page"` in desktop and mobile navigation.
2. Gallery copy and media remain Sanity-owned. The route reads the existing `editorialPage` projection in the correct published or draft perspective and does not duplicate price, stock, product, cart, customer, or order truth. Shopify is not queried for gallery content and gains no behavior.
3. A section becomes a gallery item only when it has a stable key, nonblank heading, image URL, factual nonblank alt text, and `storefrontRightsConfirmed === true`. Invalid or incomplete items are omitted without breaking the remaining sequence. Metadata and scalar copy use approved versioned fallbacks.
4. One to ten valid items render in authored order. The visual layout may vary image scale only as approved, but CSS must not change semantic/keyboard order. At 1440, 390, 320, and 200% zoom, content wraps naturally, controls remain visible, and the document has no horizontal overflow.
5. Every thumbnail is reachable and activatable by keyboard, has an accessible name derived from its item title, and exposes a visible focus indicator. Opening the viewer gives it an accessible title and description, contains focus, locks background interaction, supports Escape and the visible 44×44 CSS-pixel Close control, and restores focus to the invoking thumbnail.
6. Previous/Next controls are real buttons with accessible names and minimum 44×44 targets. They are omitted or disabled honestly at approved boundaries, work by pointer and keyboard, keep focus predictable, and update written `Image N of M` context; color, icon shape, or motion is never the sole state cue. A single-item viewer omits navigation controls.
7. Gallery imagery uses `next/image`, truthful alternatives, responsive `sizes`, a stable approved aspect-ratio box, lazy loading below the first meaningful image, and `object-contain` in the viewer. Grid cropping, if approved, uses the authored hotspot/crop and never crops product-recognition details contrary to `DESIGN.md`. A failed image remains understandable from alt/title/caption and does not remove the close/navigation path.
8. Motion is limited to an approved restrained dialog transition or state change, never required for comprehension, and is removed under `prefers-reduced-motion`. There is no autoplay. The page remains usable with JavaScript-delayed image loading and on a constrained connection.
9. With no eligible images, missing configuration, an absent `gallery` document, or a bounded Sanity read failure, the route still returns the approved text-first shell and a non-live, honest empty/unavailable message; it does not show provisional Storybook/product fixtures or claim that images loaded. Loading uses a labelled `aria-busy` skeleton with motion disabled for reduced-motion users.
10. Storybook covers the reusable gallery/viewer contract at desktop and mobile plus one item, maximum ten items, long/unbroken titles and captions, empty, loading, image failure, viewer open, first/middle/last navigation, keyboard close/focus restoration, and reduced-motion-relevant styling. Existing `Dialog`, `Navigation`, and content primitives are extended/composed rather than duplicated.
11. Automated tests cover Sanity normalization/fallbacks, template landmarks and current navigation, viewer keyboard and boundary behavior, invalid-item omission, metadata, no-overflow, axe WCAG 2 A/AA and 2.1 A/AA, console errors, reduced motion, 200% zoom, `/api/health`, and desktop/mobile customer journeys. The full repository gate and Playwright suite pass by exit status.
12. The implementation matches the approved desktop/mobile Figma frames and existing semantic tokens. Any needed durable visual-system change is approved first, mapped in `DESIGN.md`, runtime CSS, component code, and Storybook, with an explicit synchronization matrix; raw one-off colors and duplicate low-level controls are prohibited.

## System ownership boundaries

- **Next.js:** owns `/gallery`, metadata rendering, server composition, responsive UI, focus/keyboard behavior, fallbacks, and integration with the existing cart count.
- **Sanity:** owns gallery editorial copy, order, image assets, alt text, rights metadata, draft/published state, and editorial publication. Reuse the current generic `editorialPage` schema/query; do not change schema, GROQ, generated types, preview plumbing, or cache invalidation in this scope. If the approved design cannot fit the current maximum-ten section contract, stop and replan rather than silently changing it.
- **Shopify:** continues to own all commerce truth. Gallery adds no catalogue, pricing, stock, cart, checkout, or webhook work; only the existing `readCart()` navigation quantity remains.
- **Storybook:** owns the reusable `GalleryViewer` and `GalleryTemplate` states and interaction contract.
- **Figma / `DESIGN.md`:** own approved visual direction; code cannot substitute for missing approval.
- **Vercel:** owns PR preview/deployment state and runtime evidence. Production deployment is out of scope.

## Applicable project skills

1. **`feature-brief`** — required to turn the broad gallery request into observable outcomes, states, content ranges, ownership, failures, tests, preview evidence, and unresolved human decisions before design.
2. **`impeccable` (`shape` + new-surface/Experience guidance, then bounded critique/audit)** — required because this is a new visual surface with responsive interaction. It shapes composition before code and limits implementation inspection to one batched desktop/mobile round plus one confirmation round.
3. **`design-to-storybook`** — required for exact Approved Figma evidence, semantic-token/shadcn mapping, Storybook-first reusable states, screenshot comparison, and the Figma/`DESIGN.md`/CSS/component/Storybook sync matrix.
4. **`sanity-content-change`** — required for the bounded new gallery normalizer/read methods over the existing Sanity projection, including draft/published perspective, rights gating, fallbacks, metadata, cache behavior, and contract tests. It does not authorize schema/GROQ/generated-type edits.
5. **`quality-gate`** — required to map every criterion to tests/inspection, run proportional and full gates, inspect unrelated changes/secrets/artifacts, and report residual risk.
6. **`release-debug`** — required for independent Vercel Preview reproduction, screenshots, console/network evidence, `/api/health`, deployment identity, and rollback recommendation boundaries.

`shopify-storefront-change` does not trigger because no commerce contract changes. `parallel-agent-worktrees` does not trigger because this plan authorizes one writing owner on one delivery branch/PR; apply it only if a human later approves a non-primary checkout or multiple writers.

## Exact file ownership and planned changes

Only `storefront_engineer` may write the following implementation files on the delivery branch:

### Design contract and evidence

- `docs/features/gallery-page.md` (new): decision-complete feature brief, exact Approved Figma links/node IDs, content/state matrix, crop and rights rules, intentional divergences, and final synchronization matrix.
- `DESIGN.md` (modify after design approval): add the durable Gallery route/component contract and approved frame references; do not alter unrelated foundations.
- `.impeccable/design.json` (regenerate only as required by the documented `DESIGN.md` synchronization workflow; never hand-edit).
- `docs/features/evidence/gallery-local-1440.png` (new generated evidence).
- `docs/features/evidence/gallery-local-390.png` (new generated evidence).
- `docs/features/evidence/gallery-local-320.png` (new generated evidence).
- `docs/features/evidence/gallery-preview-verification.md` (new): commit SHA, deployment ID/URL, health result, tested content state, browser/viewport evidence, console/network/axe result, Figma comparison, and open risk. Do not record secrets or draft tokens.

### Route, content adapter, and UI

- `src/app/(website)/gallery/page.tsx` (new): metadata, published/draft fetch options, parallel gallery/cart reads, Suspense composition, and `/gallery` route.
- `src/sanity/lib/editorial-pages.ts` (modify): add `GalleryPage`/`GalleryItem` application types, approved scalar/metadata empty fallback, item normalization from the existing projection, and `getGalleryPage`/`getGalleryPageMetadata` with bounded logs and current cache/perspective behavior.
- `src/sanity/lib/editorial-pages.test.ts` (modify): test fallback, trimming, authored order, rights/alt/URL/heading gating, partial content, maximum items, draft/published read contract, and metadata fallback.
- `src/components/gallery-viewer.tsx` (new client boundary): ordered responsive figure grid and accessible Dialog-based viewer state/navigation; compose existing `Dialog`, `Button`, `Heading`, and related primitives.
- `src/components/gallery-viewer.test.tsx` (new): unit/interaction tests for semantics, invalid/one/many items, keyboard activation, previous/next boundaries, Escape and focus restoration, accessible position text, and failed-image-safe controls.
- `src/components/gallery-viewer.stories.tsx` (new, title `Components/GalleryViewer`): meaningful component states and play tests listed in acceptance criterion 10.
- `src/components/templates/storefront-templates.tsx` (modify): add `GalleryTemplate` and `GalleryLoadingTemplate`, composing Navigation, content primitives, GalleryViewer, and honest empty/loading states; no data fetching in templates.
- `src/components/templates/storefront-templates.test.tsx` (modify): template landmarks, current destination/cart, empty/loading, content extremes, and component composition.
- `src/components/templates/storefront-templates.stories.tsx` (modify): integrated `Templates/Storefront` gallery desktop/mobile/populated/empty/loading/long/maximum states using test-only fixtures clearly separated from production content.
- `src/components/navigation.tsx` (modify): add safe `/gallery` destination in the human-approved order.
- `src/components/navigation.test.tsx` (modify): assert Gallery href/current state and that desktop/mobile navigation remains operable with five destinations.
- `tests/e2e/gallery.spec.ts` (new): desktop 1440, mobile 390, small 320, viewer journey, keyboard/focus restoration, reduced motion, 200% zoom, no overflow, metadata, axe, console, health, and optional screenshot capture. The unconfigured-content run verifies the honest empty fallback; populated integration evidence comes from Storybook fixtures and the configured Vercel Preview document.

No changes are planned to `src/sanity/schemaTypes/**`, `src/sanity/lib/queries.ts`, `src/sanity/extract.json`, `src/sanity/generated.ts`, `src/app/globals.css`, `src/lib/shopify/**`, `public/images/products/fixtures/**`, dependencies, or lockfiles. A need to touch one of these is scope/design drift requiring explicit review and an updated plan before writing.

## Implementation sequence

1. **Brief and design:** product designer shapes the Experience-mode hierarchy and interaction against the existing system, records minimum/typical/maximum content, critiques desktop/mobile states, and supplies exact Approved Figma capture. Human design owner approves it. Stop if approval or rights-cleared asset direction is missing.
2. **Storybook-first contract:** storefront engineer writes the approved feature doc/sync references, adds `GalleryViewer` stories and play tests, and obtains human review of the meaningful responsive/viewer states before treating UI implementation as ready.
3. **Component/template:** implement the client viewer by composing existing primitives, then the server-safe Gallery/Loading templates. Preserve semantic order, focus behavior, reduced motion, and image performance.
4. **Sanity/route integration:** add only the application normalizer/read methods over the existing projection, metadata, route, current navigation state, and existing cart count. Do not publish content or change schema/query/generated files.
5. **Tests and bounded visual inspection:** add Vitest/Storybook/Playwright coverage; run one combined 1440/390/320 screenshot and Figma comparison pass, batch corrections, and run at most one confirmation pass. Record intentional deviations.
6. **Independent review and preview:** quality reviewer checks acceptance criteria, boundaries, accessibility, secrets, unrelated diff, and evidence. After CI is green, browser release debugger verifies the exact Vercel Preview and records evidence. Failed evidence returns to implementation; it does not waive a gate.
7. **Human gates:** a human approves merge. Separately, an authorized editor previews and publishes the Sanity `gallery` document. Production promotion/deployment remains out of scope and requires explicit human authorization if later requested.

## Deterministic verification

Run from the repository root with the pinned Node version and judge every command by exit status:

```bash
corepack pnpm install --frozen-lockfile
node .agents/skills/impeccable/scripts/detect.mjs --json
corepack pnpm exec vitest run --config vitest.config.ts src/components/gallery-viewer.test.tsx src/components/templates/storefront-templates.test.tsx src/components/navigation.test.tsx src/sanity/lib/editorial-pages.test.ts
corepack pnpm test:stories
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/gallery.spec.ts
corepack pnpm check
corepack pnpm test:e2e
git diff --check
```

During approved visual review, start Storybook with `corepack pnpm storybook` and the storefront with `corepack pnpm dev`; capture 1440×1000, 390×844, and 320×844 in the E2E evidence mode defined by the new test. Manual inspection supplements rather than replaces passing commands. Verify keyboard-only flow, visible focus, screen-reader names/position text, 200% zoom, reduced motion, image failure, slow loading, and no console/network errors.

After pushing the pull request:

```bash
just pr-gate <PR_NUMBER>
curl --fail --silent --show-error "$VERCEL_PREVIEW_URL/api/health"
curl --fail --silent --show-error --output /dev/null "$VERCEL_PREVIEW_URL/gallery"
PLAYWRIGHT_BASE_URL="$VERCEL_PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/gallery.spec.ts
```

The required GitHub `quality` check must pass; pending, missing, skipped, cancelled, timed-out, or failed is a red gate. Preview evidence must identify the URL, deployment ID, commit SHA, browser, viewport, published/draft content state, screenshots, console/network result, axe result, and `/api/health`. Do not claim Preview success from local evidence.

## Human approvals and release boundaries

- **Design:** human approval of brief, critique, exact Approved Figma desktop/mobile/state frames, navigation placement, interaction, copy/assets, and rights contract is required before implementation is treated as ready.
- **Storybook responsive review:** human design review is required after Storybook states and before final route integration/sign-off.
- **Editorial publish:** only an authorized human editor may preview and publish/schedule the Sanity `gallery` document and rights-cleared images. An agent may prepare validation evidence but cannot publish.
- **Merge:** a human approves and merges only after green required checks, independent quality review, and a reviewable Vercel Preview.
- **Production:** out of scope. Any later production promotion requires protected `main`, successful deployment/health evidence, and explicit human authorization where promotion is not automatic from approved merge.
- **Rollback:** an agent may recommend a target; only a human may authorize Vercel rollback, code revert merge, or destructive/unpublish content recovery.

## Rollback and recovery evidence

The code change is additive and has no migration: revert the single gallery pull request to remove the route/navigation/component while leaving an existing Sanity `gallery` document harmlessly orphaned. If gallery content alone is wrong, an authorized editor can unpublish/correct that document; the route falls back to the honest text-first empty state. If the Preview/runtime fails, record URL, deployment ID, SHA, timestamp, user impact, console/network/log evidence, and the last-known-good Vercel deployment before recommending rollback. Never execute production rollback without human authorization.

## Residual risks

- No Gallery Figma frames are currently recorded as Approved, and agent Figma MCP access is currently blocked by provider approval policy; implementation is blocked until a human-supplied approved capture exists.
- No rights-cleared final gallery asset set or published `gallery` document is evidenced. Storybook can prove behavior with labelled test fixtures, but a populated customer Preview requires authorized editorial content and remains a human publish gate.
- Reusing generic `editorialPage.sections` limits the first release to ten 3:4 rights-controlled items and exposes About-oriented Studio labels. A richer mixed-media, category, filter, or arbitrary-aspect authoring model requires a separately routed Sanity schema plan.
- Five primary destinations may crowd intermediate desktop widths or the 320px mobile drawer; approved responsive frames and browser tests must prove the result rather than shrinking targets/type.
- Large Sanity originals and many images can hurt constrained connections. Responsive optimization, lazy loading, stable aspect boxes, and preview network review reduce but do not eliminate source-asset weight risk.
- Dialog-based viewing has focus, viewport-height, and browser-history tradeoffs. Deep links, swipe-only behavior, and history-backed modal state are intentionally excluded; human approval must confirm that boundary.
- Preview and populated-state evidence depend on Vercel/Sanity availability. Service outages remain external residual risk and must not be hidden by fixtures or false success copy.
