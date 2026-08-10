# Complete the cohesive storefront redesign

## Objective

Finish and verify the current `agent/storefront-redesign-phase-1` delivery so Home, Shop/Collection, Product detail, Gallery, Fragrance Guide, About, Contact, Account, and Cart render as one cohesive, responsive Perfumer’s Cabinet storefront rather than a collection of foundations and partial shells. Preserve the approved contracts and platform boundaries; fix only evidenced implementation gaps, and report content, asset, connector, or operational gaps as blockers rather than inventing truth.

## Baseline and planning evidence

- Planning checkout: `agent/storefront-redesign-phase-1` in the current Treehouse-managed worktree.
- The configured remote is `infusion-diffusion`. The planner ran `git fetch infusion-diffusion` and `git pull --ff-only`; the branch was clean and already current at `76e6f59000dd8176d6c7c37e5b56c2857702d085`.
- `infusion-diffusion/main` at planning time was `8b73ae7ab8b22c5fd9de21a09e119950b075b9b6`, an ancestor of the task branch; the branch was 23 commits ahead and 0 behind. The builder must repeat the clean/fetch/ancestry checks because this evidence can become stale.
- `docs/planning/roadmap.md` was reread after the fetch. Its statements that the responsive compositions are integrated are assertions to verify, not proof of completion. The plan requires correcting those statements if rendered evidence disagrees.
- Current source inspection shows the shared template, footer, loading skeleton, and motion work has begun, with existing route and Storybook coverage. It also shows likely audit targets: Account does not currently compose the shared footer; route error shells are inconsistent; not every named route has the same desktop/390/320, console, loading/error, and content-extreme evidence; existing evidence is fragmented by feature rather than a single release matrix.

## Typed specialist routing and branch topology

- **Implementation owner (only writer): `storefront_engineer`.** Owns all approved Next.js, CSS, Storybook, test, evidence, and truth-reconciliation edits listed below.
- **Read-only advisory specialist: `product_designer`.** Performs the rendered design audit, maps gaps to the exact approved contracts, shapes any missing responsive/interaction treatment, and prepares the design recommendation. The designer cannot approve its own recommendation or write implementation files.
- **Read-only advisory specialist: `browser_release_debugger`.** Verifies the exact commit on Vercel Preview, `/api/health`, browser console/network behavior, screenshots, and runtime logs. It does not deploy, promote, roll back, or edit application files.
- **Independent review owner: `quality_reviewer`.** Reviews the final diff and evidence independently from the writing owner, maps every acceptance criterion to proof, and can reject the handoff.
- Keep one delivery branch and one pull request. Do not create concurrent writers or split overlapping route/component work. This non-primary implementation checkout must continue to follow `.agents/skills/parallel-agent-worktrees/SKILL.md`; preserve unrelated branch changes and do not edit or merge `main`.

## Applicable skills

1. **`.agents/skills/feature-brief/SKILL.md`** — the request spans customer outcomes, responsive behavior, states, content, failure behavior, and several ownership boundaries; the route/state matrix below is the implementation brief.
2. **`.agents/skills/impeccable/SKILL.md`** — this is a redesign completion, visual audit, responsive hardening, motion, loading, and polish task. The builder runs `context.mjs` once, uses the audit/polish guidance in bounded passes, and runs the detector once if the hook requests it. Do not use this task to replace the approved Perfumer’s Cabinet direction.
3. **`.agents/skills/design-to-storybook/SKILL.md`** — Figma, `DESIGN.md`, semantic CSS, component contracts, Storybook, and rendered routes must remain synchronized. Implement reusable changes in Storybook first and finish with a sync matrix.
4. **`.agents/skills/shopify-storefront-change/SKILL.md`** — applies narrowly to verifying existing Product/Cart/Account customer states. Shopify remains authoritative and no Storefront GraphQL, normalization, cookies, checkout gating, account provisioning, or mutable commerce behavior may be changed in this UI completion. If an actual commerce-contract defect is discovered, stop and replan rather than crossing the selected owner boundary.
5. **`.agents/skills/quality-gate/SKILL.md`** — substantive UI work requires targeted tests, full local gates, Storybook, axe, keyboard/console checks, screenshots, diff review, and truthful roadmap reconciliation.
6. **`.agents/skills/release-debug/SKILL.md`** — the browser release debugger must verify the protected Vercel Preview and capture deployment/health/log evidence without treating Preview success as production approval.
7. **`.agents/skills/parallel-agent-worktrees/SKILL.md`** — the implementation is already on a non-primary task checkout. It remains a single-writer branch and one-PR delivery.

`sanity-content-change` does **not** trigger unless the audit proves that a schema, GROQ query, generated type, preview, or cache change is necessary. Those changes are outside this plan and require re-routing. Editorial fallbacks and presentation may be adjusted in Next.js components without changing Sanity’s source-of-truth contract.

## Figma targets and design evidence gate

Canonical file: `GYiQd7QSAwCSaGtt0alKG2` (`Infusion Diffusion Designs WEB`). Scope live evidence to the following 12 unique exact targets; do not browse the file broadly or substitute screenshots/inference for unavailable connector evidence.

| Contract | Exact node(s) | Expected state | Required evidence categories |
| --- | --- | --- | --- |
| Foundations implementation | `455:3` | Approved | dimensions/layout, semantic variables, typography, spacing/assets, responsive obligations, accessibility/interaction, content extremes, divergences |
| Release QA board | `456:2` | Approved | dimensions/layout, responsive obligations, accessibility/interaction, content extremes, divergences |
| Home | `255:616`, `255:638` | Approved | desktop/mobile composition, hierarchy, media, carousel spacing, semantic surfaces, typography, motion intent, divergences |
| Collection | `203:137` | Approved | browsing surface, ProductCard treatment, grid, hierarchy, long/empty behavior, responsive obligations |
| Product detail | `203:294` | Approved | media/details split, commerce hierarchy, purchase states, responsive obligations, divergences |
| Fragrance Guide / Editorial | `203:373` | Approved | reading hierarchy, measure, editorial sections, imagery, responsive obligations, content extremes |
| Gallery review section | `357:2` | Approved source containing the recorded populated/viewer/empty/loading contracts | authored order, layout cadence, viewer interaction, responsive states, empty/loading, divergences |
| About corrected handoff | `316:198` | Approved | light chapter composition, portrait FIT behavior, responsive states, content extremes, divergences |
| Contact default | `329:58` | Approved | direct-email composition, hierarchy, semantic feedback, responsive obligations, divergences |
| Account review board | `337:321` | Approved | hosted/loading/unavailable/error/long states, responsive behavior, intentional no-current-nav divergence |
| Cart page | `229:2` | Approved | populated/empty hierarchy, line and summary treatment, commerce truth, responsive obligations |

The repository records additional approved companion frames in `DESIGN.md` and feature documents, but the live capture remains bounded to the 12 targets above. Runtime-only 320px, 390px, tablet, wide desktop, keyboard, focus, reduced motion, loading/error, zoom, console, and content-extreme behavior is test-owned and must not be claimed as static Figma evidence.

**Blocking gate:** the product designer must obtain exact, read-only evidence through an approved official Figma connector or consume an already complete provenance-gated handoff for these exact targets. If connector authentication/access, approval labels, node identity, or an evidence category is missing, stop that comparison and report the design gate blocked. Do not use the pending Pi Catalog route, retry DCR/OAuth, broaden the target, or work around connector access. Existing approved direction authorizes fixes that exactly restore the recorded contract. Any new footer, responsive, motion, or route treatment not covered by that contract requires explicit human design approval before implementation.

## System ownership boundaries

- **Figma and `DESIGN.md`:** approved visual direction. The implementation must not silently fork from it; named, human-approved divergences only.
- **Next.js:** public routes, rendering, navigation/current state, responsive composition, loading/error/not-found presentation, accessibility, motion behavior, and customer-facing cart presentation.
- **Storybook:** reusable component and composition contracts, including interaction, loading, error/empty, long-content, and responsive states.
- **Sanity:** editorial narratives, gallery grouping/order/captions, guide/about/contact copy, SEO fields, media metadata, and publish state. Do not modify schemas, GROQ, generated types, cache behavior, or production documents. Use truthful existing fallbacks when content is absent.
- **Shopify:** products, variants, titles, images, price, compare-at price, availability, cart lines/totals/discounts, account destination, checkout URL, and orders. UI must consume normalized existing contracts and never recompute or invent these values.
- **Vercel:** Preview/deployment/health/log state. Agents may inspect Preview; production promotion and rollback remain human-controlled.
- No unsupported product longevity, service, response-time, delivery, policy, inventory, discount, account, or checkout claim may be added. Do not expose secrets or add `NEXT_PUBLIC_*` credentials.

## Exact file ownership

The single `storefront_engineer` owns these files for this task. “As evidenced” means edit only after the audit identifies a contract gap; do not churn a passing component.

### Public routes and route states

- `src/app/(website)/layout.tsx`
- `src/app/(website)/page.tsx`
- `src/app/(website)/loading.tsx`
- `src/app/(website)/error.tsx` (add a cohesive shared website error boundary if the audit confirms the current gaps)
- `src/app/(website)/not-found.tsx` or the nearest valid App Router not-found boundary (add only after verifying Next.js segment behavior)
- `src/app/(website)/shop/{page,loading,error}.tsx`
- `src/app/(website)/products/[handle]/{page,loading,error}.tsx`
- `src/app/(website)/gallery/page.tsx` and `src/app/(website)/gallery/loading.tsx` if a route transition boundary is needed
- `src/app/(website)/fragrance-guide/{page,loading}.tsx`
- `src/app/(website)/about/{page,loading}.tsx`
- `src/app/(website)/contact/{page,loading,error}.tsx`
- `src/app/(website)/account/{page,loading,error}.tsx`
- `src/app/(website)/cart/{page,loading}.tsx`
- `src/app/(website)/cart/actions.ts` is read-only for this UI task; no commerce behavior change is authorized.

### Shared UI and Storybook contracts

- `src/components/templates/storefront-templates.{tsx,stories.tsx,test.tsx}`
- `src/components/navigation.{tsx,stories.tsx,test.tsx}`
- `src/components/storefront-footer.{tsx,stories.tsx,test.tsx}`
- `src/components/hero-carousel.{tsx,stories.tsx,test.tsx}`
- `src/components/gallery-viewer.{tsx,stories.tsx,test.tsx}`
- `src/components/account/account-entry.{tsx,stories.tsx,test.tsx}`
- `src/components/cart/add-to-cart.tsx`, `cart-drawer.tsx`, `cart-line.tsx`, `cart-page.tsx`, `cart-shell.tsx`, `cart-summary.tsx`, `cart.stories.tsx`, and existing adjacent cart tests, as evidenced by the UI/state audit
- `src/components/ui/product-card.{tsx,stories.tsx,test.tsx}`, `content-primitives.*`, `feedback-alert.*`, `scroll-reveal*`, and existing approved primitives only where a shared contract gap is proven. Extend; do not duplicate.
- `src/app/globals.css`
- `.storybook/preview.ts`; `.storybook/main.ts` only if deterministic story/test configuration truly requires it.
- `.impeccable/design.json` only when `DESIGN.md` changes require sidecar synchronization.

### Automated and rendered evidence

- Existing route journeys under `tests/e2e/{homepage,catalog,gallery,fragrance-guide,about,contact,account,cart}.spec.ts`
- Add `tests/e2e/storefront-visual.spec.ts` for the unified route/viewport evidence matrix; keep it deterministic and avoid external writes.
- `playwright.config.ts` only if the test cannot express the 320/390/1440 matrix locally without changing global project behavior.
- Update adjacent Vitest/Storybook tests for every changed reusable contract.
- Add `docs/features/evidence/storefront-redesign-verification.md` with commit SHA, environment, commands/exit status, screenshot manifest, design divergences, console/network results, and blockers.
- Add fresh screenshots under:
  - `docs/features/evidence/storefront-redesign/desktop-1440/`
  - `docs/features/evidence/storefront-redesign/mobile-390/`
  - `docs/features/evidence/storefront-redesign/mobile-320/`
  with one full-page capture named `home.png`, `shop.png`, `product-bois-de-santal.png`, `gallery.png`, `fragrance-guide.png`, `about.png`, `contact.png`, `account.png`, and `cart.png` in each directory.

### Truth reconciliation

- `DESIGN.md`
- `docs/planning/roadmap.md`
- `specs/d001c771_storefront-redesign-handoff.md`

Do not edit `src/lib/shopify/**`, `src/sanity/**`, Sanity Studio/schema files, generated Sanity types, environment files, lockfiles, or deployment configuration. A necessary change there is an ownership conflict and a blocker requiring a new plan/routing decision.

## Implementation sequence

### 1. Re-establish the branch and capability baseline

1. Require a clean task checkout, fetch `infusion-diffusion`, verify the remote protected branch is still an ancestor (or deliberately integrate it), and reread the roadmap and current redesign handoff.
2. Run `node .agents/skills/impeccable/scripts/context.mjs --target 'src/app/(website)'` once. Follow its requested audit/hook guidance; do not run initialization or rewrite the visual world.
3. Confirm exact Figma evidence capability and record the 12 targets, approval state, provenance, and all eight evidence categories. Connector failure is a blocking result, not permission to infer.
4. Start one local Next.js server and one Storybook server on their standard isolated ports only for the bounded audit; record how they are stopped.

### 2. Audit before editing and obtain the design gate

1. Capture baseline renders at 1440px, 390px, and 320px for all nine route families. Use `/products/bois-de-santal-200ml` for Product. Seed a deterministic fixture cart before the populated Cart capture; separately inspect the empty cart. Use the hosted fixture state for local Account evidence and the truthful unavailable state on Preview when that is what the environment provides.
2. The product designer compares each route against the exact target and `DESIGN.md`, category by category: hierarchy/composition, dimensions/grid, semantic surfaces, typography, spacing/assets/image fit, responsive reading order, interactive/motion intent, content extremes, and divergence.
3. Produce a route-by-state defect matrix with severity, owning component/file, approved source, and evidence. Distinguish implementation defects from unavailable editorial assets/content, external account/checkout provisioning, and unapproved design requests.
4. Check shared continuity: announcement/navigation and current state; logo geometry; page canvas and section surfaces; headings/body measures; ProductCard/media treatment; controls and focus; loading/error/not-found shells; cart drawer and gallery dialog; motion; and a footer on every route where the approved shell requires it.
5. Use one bounded visual inspection round across desktop and both mobile widths, implement the agreed batch, then one confirmation round. No open-ended polishing loop.
6. If the matrix proposes anything beyond exact restoration—especially new footer destinations, search, newsletter, social/legal links, new claims, or a revised Account/Cart composition—stop for explicit human design/content approval. Recorded approval of existing exact targets is sufficient only for exact restoration.

### 3. Complete reusable contracts in Storybook first

1. Consolidate shell behavior so public pages use the same approved Navigation, route identity/current state, content surface, loading/error/not-found language, and StorefrontFooter without nested duplicate shells. Preserve the Account board’s intentional absence of an Account-current nav treatment.
2. Complete `StorefrontFooter` as an approved, factual navigation/support close. It may link only to real routes and the validated public email. Do not fabricate policy, social, newsletter, address, telephone, operating-hours, or service promises; list such absent content as a launch blocker.
3. Add or revise Storybook states for every changed reusable component. At minimum cover desktop/390/320, default, loading, error/unavailable, empty, long/unbroken content, missing media, reduced motion, and interaction states where applicable.
4. Keep Gallery authored order/viewer boundaries and the existing Sanity contract unchanged. Keep Product/Cart/Account values and actions on existing normalized Shopify contracts.
5. Use semantic variables and existing shadcn/Radix-based primitives. Do not add raw one-off colors, duplicate buttons/dialogs/drawers, or inaccessible rasterized UI. If `DESIGN.md` changes, synchronize `.impeccable/design.json`, CSS, component contract, and Storybook in the same change.

### 4. Integrate and harden every public route

- **Home:** complete the approved hero/carousel, collection band, guidance, service/founder/longevity/invitation rhythm, truthful empty/missing-image states, loading skeleton, reduced motion, and footer.
- **Shop/Collection:** complete the elevated browse canvas, result context, responsive populated/empty grids, card hover/focus continuity, loading/error recovery, and footer without implying unimplemented filters/sorting.
- **Product detail:** preserve Shopify truth; complete media/details reading order, price/availability, purchase action, missing image, long details, sold-out/unavailable behavior, loading/error/not-found recovery, add-to-cart feedback, and footer.
- **Gallery:** preserve approved campaign/market cadence and independent viewer scopes; verify populated, one-group, empty/unavailable, loading, one/many item, missing legacy caption fallback, focus restoration, and footer.
- **Fragrance Guide:** present the existing Sanity/fallback content as a useful, readable selection guide without inventing claims or new schema fields; verify missing image/sections, long content, loading/error fallback, route-current state, and footer.
- **About:** preserve the approved light chapter alternation and portrait FIT/contain contract; verify text-only, partial media, long copy, loading/error fallback, CTA, and footer.
- **Contact:** preserve direct-email-only behavior, validated `mailto:`, static unavailable message, error retry, no form/provider/success claim, long email/copy, loading, and footer.
- **Account:** preserve the hosted Shopify handoff and `noindex`; complete available, loading, disabled, configuration-missing, not-provisioned, provider-error, and long states inside the cohesive storefront shell, including footer where consistent with the approved page, without adding local authentication UI.
- **Cart:** preserve Shopify totals and checkout gating; complete populated, empty, loading, updating, unavailable line, optimistic rollback/error, discount/long-cart, 320 controls, Midnight summary, drawer keyboard behavior, and footer. Do not enable checkout or alter server actions.

### 5. Accessibility, motion, and content extremes

For the integrated routes and changed stories, verify:

- semantic header/nav/main/footer landmarks; exactly one visible H1 per page; ordered H2/H3 structure and logical DOM order;
- native link/button/form semantics, truthful disabled/busy behavior, written status meaning, and no color-only state;
- full keyboard operation, visible mode-aware focus, 44×44 targets, mobile menu/dialog/drawer focus containment, Escape, scroll lock, and exact trigger focus restoration;
- WCAG 2.1 AA axe and contrast on actual Sage, Bone, Midnight, hover, focus, disabled, error, and feedback surfaces;
- reduced-motion removal of page entry, reveals, skeleton pulse, carousel autoplay/crossfade, and drawer/dialog transitions while keeping content visible;
- no horizontal overflow at 320/390, natural-height/safe-area behavior, tablet/wide desktop checks, and true reflow at an effective 200% zoom;
- useful factual alt text for meaningful images, empty alt/decorative handling for ornaments, no labels baked into images, and rights/provenance called out for production assets;
- long and unbroken product names, scent notes, headings, email, gallery captions, section copy, ZAR/sale/from prices, large quantities, many cart lines, zero/many products, missing images, sold-out/low-stock/unavailable items, partial/empty editorial sections, provider failures, and account/cart gating;
- loading skeletons that preserve geometry, are non-interactive/non-live, expose an appropriate `aria-busy` label, and do not shift into the loaded layout;
- no uncaught browser console errors, unhandled page errors, hydration warnings, or failed first-party requests. Provider failures must render the designed fallback and be recorded; do not silently filter Preview errors.

## Observable acceptance criteria

1. A provenance-backed audit matrix covers all nine named route families and the 12 scoped Approved Figma nodes, with each discrepancy marked fixed, intentional human-approved divergence, content/provider blocked, or out of scope.
2. Fresh full-page screenshots exist for Home, Shop, the deterministic product handle, Gallery, Fragrance Guide, About, Contact, Account, and Cart at 1440px, 390px, and 320px (27 captures total), tied to the final commit SHA. They show loaded fonts/images or truthful fallbacks, no clipping/overflow, a coherent shell, and a footer treatment; screenshots use reduced motion/a stable carousel frame, while normal motion is tested separately.
3. Navigation, route identity, shared semantic surfaces, typography, spacing, controls, motion, loading/error/not-found presentation, and footer feel like one Perfumer’s Cabinet system across all routes. Existing approved Gallery behavior and Account no-current-nav divergence remain intact.
4. Every route has a layout-faithful loading experience and a truthful recoverable error/unavailable/not-found path at the nearest appropriate boundary. Empty states remain complete page compositions rather than bare text.
5. Home, Collection, Product, Gallery, Fragrance Guide, About, Contact, Account, and Cart satisfy the route-specific behavior in the integration section without changing Sanity or Shopify source-of-truth data.
6. Every changed reusable component/state is represented in Storybook with relevant desktop/390/320, loading, error/empty, long-content, missing-content, commerce, focus, and reduced-motion stories; interaction plays and Storybook axe pass.
7. Keyboard/focus, 44px targets, WCAG AA, heading/landmark order, dialogs/drawers, alt text, reduced motion, 200% zoom, content extremes, and 320px overflow pass the checks above.
8. Relevant Vitest and Playwright journeys pass with deterministic Shopify fixtures. The browser console, page errors, first-party network failures, and `/api/health` are clean locally and on the exact Vercel Preview commit, or a named blocker prevents readiness.
9. `corepack pnpm check` and the complete relevant Playwright suite pass by exit status. Skipped or failed required checks keep the gate red.
10. `DESIGN.md`, `.impeccable/design.json` when applicable, `docs/planning/roadmap.md`, and `specs/d001c771_storefront-redesign-handoff.md` accurately distinguish delivered runtime behavior from pending Figma/design review, content/assets, Preview, publish, merge, production, and rollback. No “synced” or “complete” claim remains without evidence.
11. The final diff contains no Sanity/Shopify source-of-truth edits, new unsupported claims, secrets, dependency churn, generated junk, direct deployment, editorial publication, or production/rollback action.

## Deterministic verification commands

Judge every command by exit status and record the command, timestamp, commit SHA, and result in `docs/features/evidence/storefront-redesign-verification.md`.

```bash
# Re-establish a safe task branch before work.
git status --short --branch
git fetch infusion-diffusion
git rev-list --left-right --count infusion-diffusion/main...HEAD
git merge-base --is-ancestor infusion-diffusion/main HEAD
corepack pnpm install --frozen-lockfile

# Once per implementation session.
node .agents/skills/impeccable/scripts/context.mjs --target 'src/app/(website)'

# Focused component/unit work; update the file list to exactly the changed tests.
corepack pnpm test -- src/components/templates/storefront-templates.test.tsx src/components/storefront-footer.test.tsx src/components/navigation.test.tsx src/components/account/account-entry.test.tsx src/components/hero-carousel.test.tsx src/components/gallery-viewer.test.tsx
corepack pnpm test:stories
corepack pnpm build-storybook

# Unified fresh 27-image evidence; the spec itself sets 1440/390/320 and seeds only local fixtures.
SAVE_STOREFRONT_EVIDENCE=1 corepack pnpm exec playwright test tests/e2e/storefront-visual.spec.ts --project=chromium

# All named customer journeys and accessibility/runtime assertions.
corepack pnpm exec playwright test tests/e2e/homepage.spec.ts tests/e2e/catalog.spec.ts tests/e2e/gallery.spec.ts tests/e2e/fragrance-guide.spec.ts tests/e2e/about.spec.ts tests/e2e/contact.spec.ts tests/e2e/account.spec.ts tests/e2e/cart.spec.ts tests/e2e/storefront-visual.spec.ts

# Run only if context.mjs says a manual detector is required; otherwise rely on the enabled hook.
node .agents/skills/impeccable/scripts/detect.mjs --json 'src/app/(website)' src/components src/app/globals.css

# Repository gates.
corepack pnpm check
corepack pnpm exec playwright install chromium
corepack pnpm test:e2e

git diff --check
git status --short
```

The visual test must wait for the H1, `document.fonts.ready`, required primary images or truthful fallback, and network/render settling; use a stable first carousel frame/reduced-motion media for screenshots. It must not write to Sanity, mutate a real Shopify cart, follow hosted account/checkout destinations, or call production services. The populated local cart capture is seeded through the existing `SHOPIFY_E2E_FIXTURES=1` journey. Preview Cart evidence remains read-only unless a human separately authorizes a test cart.

## Independent review, Preview, and release evidence

1. The `quality_reviewer` checks the acceptance-to-evidence matrix, rendered screenshots, Figma sync matrix, Storybook states, source/diff boundaries, content claims, axe/keyboard/zoom evidence, and all command exit statuses. It must explicitly reject stale screenshots or roadmap claims.
2. Push the single task branch and open/update one pull request. Record the exact PR number and commit SHA. Do not merge.
3. After GitHub’s required `quality` check passes, run `just pr-gate <PR_NUMBER>`. Pending, absent, skipped, cancelled, timed-out, or failed checks are red; local success cannot replace the GitHub check.
4. The `browser_release_debugger` records Preview URL, deployment ID, commit SHA, timestamp, protection/auth context, `/api/health` response, all nine route responses, desktop/390/320 screenshots, console/page errors, failed first-party requests, and relevant Vercel build/runtime logs. Use the existing Playwright route matrix against `PLAYWRIGHT_BASE_URL=<preview-url>` only for read-only journeys; do not follow checkout/account destinations or write editorial/commerce state.
5. Human design review compares the final responsive Preview and Storybook states to the Approved direction and approves or rejects named divergences. Preview verification is not merge or production approval.

## Rollback and human gates

- **Before implementation:** existing recorded Approved targets authorize exact restoration. Any new visual direction, responsive state, footer destination/content, interaction, or divergence requires explicit human design approval. Missing exact Figma evidence is a blocker.
- **Merge:** requires green `quality`, successful `just pr-gate`, independent `quality_reviewer` approval, reviewable Preview evidence, and explicit human merge approval. Agents do not merge.
- **Editorial publish:** no Sanity publication is part of this task. Final guide/about/contact/gallery copy or imagery remains under editor/content-owner review, rights validation, Preview, and explicit human publish/schedule approval.
- **Production:** no direct deployment, protection bypass, or production promotion. Production requires protected `main`, successful deployment/health/smoke evidence, and separate human authorization where promotion is not automatic from an approved merge.
- **Rollback:** identify the last-known-good Vercel deployment and the reverting commit before recommending action. For account or checkout exposure, the existing first containment is the relevant server-only gate remaining/returning false. Any Vercel rollback, production environment change, destructive content recovery, or code revert affecting the release requires human authorization. This UI task should need no Sanity or Shopify data rollback.
- **Preview recovery:** a bad Preview is corrected by another reviewed commit or by abandoning/reverting the task branch; it is not a reason to mutate production.

## Unresolved human decisions and blockers

1. Confirm whether every product-designer finding is an exact restoration or a proposed new direction. New direction must be approved before code changes.
2. Confirm final rights-cleared photography, factual alt text, copy, product claims, and editorial publication. Fallbacks may ship as truthful UI evidence, but cannot be mislabeled final content.
3. Confirm whether policy, delivery, returns, privacy, terms, accessibility, social, or newsletter destinations/content are authorized and actually exist. This plan does not fabricate routes or dead footer links; their absence remains a launch-readiness blocker, not a reason to invent them.
4. Shopify account provisioning, real payment provider, checkout enablement, discounts, live purchasing, and final operational policy remain outside this UI task. Account/Cart must truthfully show their gated states.
5. Required official Figma connector access may be unavailable in the executing lane. That blocks a fresh exact-node audit; pending Pi Catalog/DCR/OAuth work must not be retried as a workaround.

## Residual risks

- Current `DESIGN.md` and roadmap already claim broad synchronization; rendered inspection may expose overstatement and require status correction rather than more code.
- Production Sanity content and imagery can differ from deterministic local fallbacks; rights, crops, alt text, and publication remain human/content-owner risks.
- Shopify catalogue/account/cart responses and hosted destinations can change independently. The UI tests cover normalized fixtures, not live provider provisioning or checkout success.
- Full-page screenshot output can vary with fonts, remote imagery, and editorial content. Tie evidence to an exact SHA/environment, stabilize animation, and use screenshots as review evidence rather than the sole correctness assertion.
- Protected Preview access, connector authentication, or provider/network availability can block fresh evidence. A blocked check remains a red gate.
- Footer completeness is constrained by real approved destinations and legal/support content. Cohesion can be delivered without inventing links, but launch completeness cannot be claimed until owners supply and approve those surfaces.
- No production deployment, production smoke, real checkout, editorial publish, merge, or rollback is completed by this plan; those remain explicit human gates.
