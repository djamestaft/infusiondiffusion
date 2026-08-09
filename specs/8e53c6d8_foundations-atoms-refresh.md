# Foundations + Atoms design-system refresh plan

## Objective and outcome

Implement only the approved Foundations + Atoms slice from the canonical Infusion Diffusion Figma file. Synchronize the durable design rules, generated design sidecar, semantic runtime tokens, existing reusable atoms, Storybook contracts, tests, and redesign handoff while preserving every existing public component API and the approved Gallery layout/behavior.

This is one substantive UI delivery on one task branch and one pull request. It does not authorize page migration, Gallery layout edits, Sanity or Shopify work, Figma publishing, production deployment, merge to `main`, or rollback.

## Typed specialist routing and delivery topology

- **Implementation owner — `storefront_engineer` (sole writer):** owns every repository edit listed below. No other specialist writes code, docs, stories, tests, Figma, or configuration.
- **Advisory specialist — `product_designer` (read-only):** verifies the exact approved Figma evidence, freezes the foundation/atom inventory, resolves design interpretation, and reviews responsive, interaction, content-extreme, and divergence evidence. The advisor cannot approve a divergence on the human’s behalf.
- **Advisory specialist — `browser_release_debugger` (read-only):** after a PR Preview exists, verifies representative runtime consumers, Gallery regression, console/network state, and `/api/health`. It does not deploy or roll back.
- **Independent review owner — `quality_reviewer` (read-only):** maps each acceptance criterion to evidence and reviews scope, public APIs, accessibility, tests, Preview evidence, and the final sync matrix before the human merge gate.
- **Topology:** exactly one writer, one delivery branch, and one PR. The current checkout is `agent/storefront-redesign-phase-1`, is two commits ahead of its configured remote branch, and already contains a prior plan plus bounded-capture code changes. Do not implicitly add implementation to that history. By default, resolve the configured remote, fetch current remote `main`, and use a fresh Treehouse-leased worktree and `agent/foundations-atoms-refresh` branch from `<remote>/main`. Reusing the current branch requires explicit engineer approval that its existing commits belong in the same PR. Do not create concurrent writers or additional PRs without approval.

## Applicable project skills

1. **`.agents/skills/feature-brief/SKILL.md`** — triggered because the approved prompt still needs observable scope, ownership, responsive/state behavior, failure handling, evidence, and human gates before edits.
2. **`.agents/skills/impeccable/SKILL.md`** — triggered by refinement of typography, color, spacing, controls, interaction, responsiveness, accessibility, and motion. Use the incumbent approved direction, not a new visual territory. The implementation owner runs its context command once for the UI target before editing; craft-floor instructions are loaded only immediately before UI edits.
3. **`.agents/skills/design-to-storybook/SKILL.md`** — triggered because Figma, `DESIGN.md`, `.impeccable/design.json`, CSS tokens, components, and Storybook must remain one synchronized contract. Exact approved capture is a blocking prerequisite.
4. **`.agents/skills/quality-gate/SKILL.md`** — triggered by global tokens and reusable-component changes with broad consumer impact; verification must include targeted tests, Storybook tests/build, the full local gate, browser/a11y checks, diff review, and residual risk.
5. **`.agents/skills/release-debug/SKILL.md`** — triggered for the planned read-only Vercel Preview and runtime regression verification before merge readiness.
6. **`.agents/skills/parallel-agent-worktrees/SKILL.md`** — triggered because implementation is planned away from the primary checkout. Apply its remote discovery, fresh-base, isolated-worktree, branch, and single-writer rules even though writing is sequential.

`sanity-content-change` and `shopify-storefront-change` do not trigger: no schema, GROQ, Sanity preview/type/cache, catalog, price, inventory, cart, customer, checkout, or webhook contract may change.

## Canonical Figma target and blocking evidence gate

Use exactly one typed read-only target:

- **File key:** `GYiQd7QSAwCSaGtt0alKG2`
- **Unique node IDs:** `403:3`, `403:4`, `403:5`, `403:6`, `403:7`, `455:3`, `456:2`
- **Expected approval state for every node:** `Approved`
- **Required evidence categories for the target:** `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences`

Before any implementation edit, the read-only `product_designer` must produce or validate one sanitized, structured capture bound to this exact file and all seven nodes. It must record each node’s visible name and `Approved` marker; dimensions and layout; variable collection/mode/value mappings; type family/weight/size/line-height/tracking; spacing, radii, depth, icons/assets; atom names, variants, sizes and states; mobile/desktop behavior; accessibility/interaction decisions; content extremes; and any explicit divergence. Freeze a mapping from each captured item to `DESIGN.md`, `.impeccable/design.json`, CSS token, code component, Storybook title/state, and test.

The prompt records authorization and expected approval, but those statements do not substitute for the complete node-bound evidence. Missing connector access, unauthenticated access, a wrong node, a missing `Approved` marker, incomplete evidence, or provenance mismatch is blocking. Do not infer final values from screenshots, current CSS, or the older `specs/aec27e8b_design-system-sync.md`: that earlier record names parent nodes `403:2` and `455:2`, not this task’s authorized targets. Do not ask another agent to work around connector access. If the static design omits a runtime state, preserve the accessible existing behavior and record the gap for human divergence approval rather than inventing visual truth.

## System ownership boundaries

- **Figma / `DESIGN.md`:** own approved visual direction and durable repository-readable rules. This task reads exact approved Figma nodes and updates repository documentation; it does not modify or publish Figma.
- **Next.js:** owns customer-facing runtime behavior and `src/app/globals.css`. Only semantic foundations and mapped reusable atoms change; route/page composition stays unchanged.
- **Storybook:** owns reusable component contracts and meaningful visual/interaction states. Storybook is the primary review surface for this slice.
- **Sanity:** retains editorial copy, Gallery content, and image metadata. No Sanity files or publish actions are allowed.
- **Shopify:** retains product, variant, price, inventory, discount, cart, customer, checkout, order, and fulfilment truth. Story fixtures remain illustrative and cannot become commerce truth.
- **Vercel:** owns Preview/deployment state. A read-only PR Preview may be inspected; production promotion and rollback remain human decisions.
- **Gallery:** its approved route composition, DOM/authored order, campaign/market grids, dimensions/cadence, captions, viewer behavior, fallbacks, responsive behavior, and focus contract remain unchanged. Shared token/atom styling may flow through only when it does not alter that contract.

## Exact file ownership

### Required synchronization files owned by the sole writer

1. `DESIGN.md`
   - Replace only stale Foundations + Atoms facts with the captured approved values and exact seven-node links.
   - Preserve all approved page contracts, especially the complete Gallery section, and document API-preservation mappings and approved runtime divergences.
2. `.impeccable/design.json`
   - Regenerate/synchronize the schema-v2 sidecar after `DESIGN.md` changes, including captured ramps, modes, breakpoints, depth, motion, and atom snippets that frontmatter cannot express. It must not disagree with `DESIGN.md`.
3. `src/app/globals.css`
   - Map captured primitive values into stable semantic variables and Tailwind aliases for every approved mode. Avoid raw one-off colors in components, incomplete mode fallbacks, or unrelated scroll/hero/page changes.
4. `src/app/design-tokens.test.ts`
   - Add exact deterministic assertions for approved primitive values, semantic aliases/pairs, modes, typography, spacing, radii, depth/focus/motion, and unchanged Gallery-critical semantics.
5. `src/components/ui/design-foundations.stories.tsx` **(new)**
   - Add a review-only foundations Storybook surface for approved colors/modes, typography, spacing, radii, depth, focus, and reduced-motion examples. It must not create a public runtime component API.
6. `.storybook/preview.ts`
   - Provide deterministic 320px, 390px, tablet, standard-desktop, and wide-desktop viewports/canvases; retain fullscreen defaults and `a11y: { test: "error" }`; expose modes only through semantic tokens.
7. `specs/d001c771_storefront-redesign-handoff.md`
   - Append a dated Foundations + Atoms implementation addendum. Include exact targets, evidence identifiers, preserved APIs, Gallery result, command/Preview evidence, residual risk, and the required sync matrix without rewriting unrelated redesign history.

### Atom source/story/test triplets owned after the capture freezes scope

Audit every listed row against the seven-node inventory. If included, update source, story, and test together. If absent or already exact, leave source unchanged and mark `not in approved slice` or `already synced` in the matrix; never speculate.

- `src/components/ui/button.tsx`, `button.stories.tsx`, `button.test.tsx`
- `src/components/ui/text-link.tsx`, `text-link.stories.tsx`, `text-link.test.tsx`
- `src/components/ui/input.tsx`, `input.stories.tsx`, `input.test.tsx`
- `src/components/ui/textarea.tsx`, `textarea.stories.tsx`, `textarea.test.tsx`
- `src/components/ui/field.tsx`, `field.stories.tsx`, `field.test.tsx`
- `src/components/ui/badge.tsx`, `badge.stories.tsx`, `badge.test.tsx`
- `src/components/ui/content-primitives.tsx`, `content-primitives.stories.tsx`, `content-primitives.test.tsx`
- `src/components/ui/feedback-alert.tsx`, `feedback-alert.stories.tsx`, `feedback-alert.test.tsx`
- `src/components/ui/dialog.tsx`, `dialog.stories.tsx`
- `src/components/ui/drawer.tsx`, `drawer.stories.tsx`
- `src/components/ui/alert-dialog.tsx`, `alert-dialog.stories.tsx`
- `src/components/ui/overlay-primitives.test.tsx` for shared Dialog/Drawer/AlertDialog behavior
- `src/components/ui/price-display.tsx`, `price-display.stories.tsx`, `price-display.test.tsx` only if the exact capture includes it; normalized money inputs and Shopify ownership cannot change
- `src/components/ui/commerce-status.tsx`, `commerce-status.stories.tsx`, `commerce-status.test.tsx` only if included; written status and Shopify ownership cannot change
- `src/components/ui/product-card.tsx`, `product-card.stories.tsx`, `product-card.test.tsx`, and `product-card.fixtures.ts` only if included; preserve its browse-only API, PriceDisplay/CommerceStatus composition, and provisional fixture status

### Inspect-only and prohibited files

- `.storybook/main.ts` and `vitest.storybook.config.ts` are inspect-only unless captured requirements cannot be represented by the existing a11y/Vitest setup. Any change needs a reason in the handoff; do not add an addon, dependency, or lockfile change by default.
- Do not edit `src/components/ui/scroll-reveal.tsx`, `scroll-reveal-controller.tsx`, or their tests.
- Do not edit `src/components/gallery-viewer.tsx`, Gallery route/story/test implementation, page/template layouts, Navigation/Gallery composition, Sanity or Shopify files, environment files, deployment configuration, `package.json`, the lockfile, or `docs/planning/roadmap.md`.
- `tests/e2e/gallery.spec.ts` is a regression oracle, not an implementation target. A failing approved-geometry assertion requires fixing shared changes or stopping for a human decision, not weakening the test.

## Implementation sequence

### 1. Establish the approved delta

- Complete the exact-node capture gate and freeze the inventory before edits.
- Build a before/after table for each primitive, semantic role/mode, type role, spacing/radius/depth value, breakpoint, focus/motion value, atom variant/size/state, and responsive rule.
- Classify each item `sync required`, `already synced`, `not applicable`, or `conflict/blocking`.
- The product designer confirms the mapping and applicable states. Any conflict with public APIs, Gallery, accessibility, or content truth returns to the human design owner.

### 2. Synchronize foundations

- Update `DESIGN.md`, then `.impeccable/design.json`, then semantic CSS and token tests so repository guidance precedes implementation.
- Keep semantic names stable where practical. If Figma naming differs from an established public token/API name, preserve runtime compatibility and document the mapping.
- Add the foundations story and deterministic viewports. Verify computed foreground/background, hover/active/disabled/focus pairs on actual Ivory/Midnight canvases, not isolated swatches.

### 3. Synchronize atoms without API breaks

- Preserve exported names, prop/type names, variant and size strings, defaults, `asChild`, ref/attribute/event passthrough, data slots, semantics, and legacy aliases. Prefer CSS/class/internal-markup updates. Removals or semantic breaks are out of scope.
- Extend existing shadcn/Radix-derived primitives rather than duplicating controls. Destinations remain anchors; actions remain buttons; inputs/textarea remain native; overlays retain Radix focus, Escape, scroll-lock, outside-interaction, and restoration behavior.
- For each included atom, align the Figma name, code name, and `Components/*` Storybook title. Add only applicable stories/tests for default/modes, hover/active, keyboard focus, disabled, busy/loading, invalid/error/read-only, long content, responsive reflow, reduced motion, and empty/failure. Never invent disabled links, loading for static metadata, or live-region behavior unsupported by the API.

### 4. Protect integrated behavior

- Inspect representative consumers without editing their layouts: Home, Shop/Product, Contact or Account, one overlay flow, and Gallery.
- Verify Gallery at 320px, 390px, 1440px, reduced motion, and 200% zoom. Its DOM/authored order, grid/cadence/gaps, captions, no-overflow behavior, viewer close/previous/next semantics, boundary disabling, Escape, initial/restored focus, and axe result must remain unchanged.
- If an approved atom appearance cannot coexist with Gallery’s approved layout/API/accessibility contract, stop and request a human decision; do not alter Gallery or fork tokens silently.

### 5. Complete handoff and review

Append a matrix to `specs/d001c771_storefront-redesign-handoff.md` with columns:

`Figma file/node` | `approved evidence/value/state` | `DESIGN.md` | `.impeccable/design.json` | `CSS token` | `component/public API` | `Storybook title/state` | `test/preview evidence` | `status` | `divergence/reason/approver`

Allowed statuses: `synced`, `already synced`, `not applicable`, `pending/blocking`, and `intentional divergence`. Every intentional divergence needs an accessibility/runtime/API reason and named human approver. Record exact command exit statuses, screenshot names/URLs, Preview deployment/commit identity, Gallery result, untested areas, and residual risk. State that no roadmap change was required.

## Observable acceptance criteria

1. One sanitized capture binds canonical file `GYiQd7QSAwCSaGtt0alKG2` and exactly nodes `403:3`, `403:4`, `403:5`, `403:6`, `403:7`, `455:3`, and `456:2`; every node is confirmed `Approved`; all eight required evidence categories and a frozen inventory are present.
2. Approved foundations agree across Figma, `DESIGN.md`, `.impeccable/design.json`, `globals.css`, the foundations story, and exact token tests for modes, values, typography, spacing, radii, depth, breakpoints, focus, and motion. Differences are explicitly approved and recorded.
3. Semantic runtime token names and mode behavior remain reusable; atom TSX contains no new raw one-off colors or duplicate primitives, and token tests fail deterministically on value/alias/pair drift.
4. Every captured atom maps to the matching existing code component and `Components/*` Storybook title. Included source/story/test triplets are synchronized; excluded components are not restyled speculatively.
5. Existing public component APIs and behavior are source-compatible. All existing consumers typecheck without page migration; legacy compatibility aliases remain; native element semantics and Radix behavior are preserved.
6. Storybook shows and tests every meaningful applicable state: default and approved modes, hover/active, keyboard focus, disabled, loading/busy, invalid/error/read-only, long-content, reduced-motion, and responsive behavior. Inapplicable states are omitted and explained.
7. Accessibility is preserved or improved: semantic HTML; keyboard operation; visible mode-aware focus; WCAG AA text/control/state contrast; minimum 44×44 targets where required; accessible icon-only names; labels/descriptions/error association; truthful busy/disabled semantics; no color-only meaning or unsolicited live regions; overlay naming, containment, Escape, scroll lock, and focus restoration; and a useful reduced-motion alternative.
8. Content extremes work at 320px, 390px, tablet, 1440px, wide desktop, natural height, and 200% zoom without horizontal overflow, clipped essential text, hidden focus, unstable loading dimensions, or hover-only meaning. Cover long/localized labels, long unbroken values, multiline descriptions/errors, long ZAR amounts, missing imagery, all relevant statuses, and long overlay content where applicable.
9. The approved Gallery layout and behavior are unchanged. Existing Gallery browser tests pass at desktop/mobile, and Preview comparison shows no cadence, grid, caption, DOM-order, focus, viewer-navigation, reduced-motion, zoom, or overflow regression.
10. The handoff includes the complete Figma → `DESIGN.md` → sidecar → CSS → component/API → Storybook → test/Preview sync matrix and every intentional divergence with reason and approver.
11. Focused tests, fast verification, Storybook tests/build, full local gate, and relevant Gallery/browser tests exit successfully. Missing, skipped, timed-out, or failed required checks are blockers, never success.
12. The final diff contains no page migration, Gallery implementation/layout edits, Sanity/Shopify changes, secrets, dependency/lockfile churn, unrelated formatting, Figma publish, production deployment, or merge to `main`.

## Accessibility and content-extreme evidence

- Keyboard-only Storybook pass for each interactive atom and overlay; capture focus-visible states in every approved mode.
- DOM/screen-reader-oriented inspection for names, labels, descriptions, required/invalid/busy/disabled state, static status text, dialog titles/descriptions, and trigger-focus restoration.
- Storybook a11y tests with no violations accepted as errors, plus manual/computed contrast evidence for default, hover, active, disabled, feedback, and focus pairs on their actual canvases.
- Measured 44×44 CSS-pixel control targets; inline prose links follow their approved exception while standalone links and icon controls meet the target.
- Stable captures at 320×844, 390×844, tablet, 1440×900, and wide desktop; repeat critical atoms and Gallery at 200% zoom and natural height.
- Long button/link/metadata labels, long email/unbroken value, multiline support/error text, long ZAR price, missing image, all relevant commerce statuses, and long dialog/drawer text where those atoms are included.
- `prefers-reduced-motion: reduce` evidence showing decorative transitions/progress stop while state changes and focus remain understandable.
- No essential labels baked into images and no new marketing, editorial, inventory, price, fulfilment, or accessibility claims in fixtures.

## Deterministic verification commands

Run from the isolated implementation worktree. Judge every command only by its exit status.

```bash
corepack pnpm install --frozen-lockfile

# Focused foundations and atom tests
corepack pnpm exec vitest run --config vitest.config.ts src/app/design-tokens.test.ts src/components/ui/*.test.tsx

# Deterministic UI anti-pattern scan
node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/ui .storybook

# Storybook interaction/a11y contracts and static build
corepack pnpm test:stories
corepack pnpm build-storybook

# Required fast verification
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test

# Full local gate: format check, lint, types, Vitest, Storybook tests/build, Next build
corepack pnpm check

# Approved Gallery regression in both configured projects
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium --project=mobile

# Broad browser regression because global tokens/atoms affect many consumers
corepack pnpm test:e2e
```

After pushing the single PR branch, require the exact branch’s protected checks:

```bash
just pr-gate <PR-number>
```

Pending, missing, skipped, cancelled, timed-out, or failed CI is a red gate. Local evidence cannot replace a missing GitHub check. The quality reviewer also inspects the final diff for API changes, raw colors, weakened tests, skipped stories, unrelated files, generated artifacts, and secrets.

## Preview and rollback evidence

### Storybook/local evidence

Capture named foundations and changed-atom screenshots in each approved mode at 320, 390, tablet, and desktop/wide widths. Include applicable focus, hover/active, disabled, loading, invalid/error, long-content, reduced-motion, and open-overlay states. Follow one bounded desktop/mobile inspection pass, one consolidated correction pass, and at most one confirmation pass.

### Vercel Preview evidence

After green branch CI, the read-only `browser_release_debugger` records Preview URL, deployment ID, commit SHA, timestamp, and successful `/api/health`. Inspect `/`, `/shop`, one product route, `/gallery`, and one form/overlay consumer such as `/contact` or `/account` at mobile and desktop widths. Record screenshots, keyboard/focus behavior, axe result where applicable, console errors, failed network requests, and Gallery preservation. Preview evidence supports review and the human merge decision; it is not production authorization.

### Rollback

Production deployment is out of scope, so no production rollback is planned. Keep the foundations/atoms delivery in coherent reviewable commits so the PR can be corrected or reverted as one unit while restoring the previous docs, sidecar, tokens, atoms, stories, and tests together. Record the parent commit and last-known-good Preview SHA/URL. If a merged change later causes material impact, the browser specialist may identify and recommend the last-known-good Vercel deployment, but only a human may authorize rollback and no agent executes it.

## Human approval gates and unresolved decisions

1. **Before implementation:** the prompt asserts approval of the exact target, but implementation begins only after read-only evidence confirms all seven exact nodes are `Approved` and captures responsive/interaction details. Missing evidence is a blocker. No agent can grant design approval.
2. **Design divergence:** any mismatch involving Figma, responsive behavior, accessibility, public APIs, or Gallery requires the human design owner to approve the documented resolution. API removal and Gallery layout change remain out of scope even if suggested by a static frame.
3. **Topology:** one fresh branch/PR is the default. Reuse of the current ahead branch or any second writer/PR requires explicit engineer approval.
4. **Before merge:** require green required checks, independent `quality_reviewer` approval, complete Storybook/Preview evidence, and explicit human approval to merge. The implementation owner never merges its own work.
5. **Publish:** no Figma or Sanity publish is in scope. If one becomes necessary, stop for separate human authorization; agents cannot publish.
6. **Production:** expressly out of scope. A human must separately authorize any production promotion after protected `main`.
7. **Rollback:** only a human may authorize Vercel rollback or destructive recovery; agents collect evidence and recommend a named target.

## Residual risks and blockers

- **Exact Figma access:** repository operations currently document an external/provider approval boundary for project-local Figma access. Without a complete authenticated read-only capture of these exact seven nodes, implementation is blocked; the older parent-node plan is not sufficient.
- **Unknown node inventory until capture:** file-level atom edits cannot be narrowed further without inventing node contents. The frozen mapping must decide which enumerated triplets change; everything else remains untouched and is accounted for in the matrix.
- **Global blast radius:** semantic token changes can alter every route without page-file edits. Storybook, full browser tests, and sampled Preview routes reduce but cannot eliminate regressions across all real content.
- **Static-to-runtime gaps:** Figma cannot prove keyboard operation, focus containment/restoration, busy semantics, reduced motion, zoom, or natural wrapping. Existing accessible runtime behavior governs absent states, with any visual divergence human-approved and documented.
- **API versus visual naming:** approved variant names may differ from established props. Compatibility wins in this slice; additive aliases can carry maintenance cost, while removals require a separate migration.
- **Gallery coupling:** shared Button/Dialog/token changes can indirectly affect Gallery. Automated geometry and keyboard checks are mandatory, but final visual equivalence still requires human review.
- **Design sidecar drift:** changing `DESIGN.md` without synchronizing `.impeccable/design.json` leaves an incomplete design-system contract.
- **Visual evidence variance:** font rasterization and browser/OS differences make raw pixel matching noisy. Evaluate dimensions, computed tokens, semantics, and bounded screenshots together.
- **No roadmap change:** this slice implements an already authorized subset and does not select roadmap work. `docs/planning/roadmap.md` remains untouched; the reviewer must state that no roadmap update was required.
