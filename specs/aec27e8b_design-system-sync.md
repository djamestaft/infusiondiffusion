# Canonical design-system foundations and atoms synchronization plan

## Objective

Synchronize the approved design-system foundations and reusable atoms from the canonical Figma refresh into repository guidance, semantic runtime tokens, existing UI primitives, and Storybook without changing public component APIs or the approved Gallery composition. This is a design-system synchronization slice only: no page migration, Gallery layout work, Sanity/Shopify changes, merge, publish, or production deployment.

## Typed specialist routing and delivery topology

- **Implementation owner — `storefront_engineer` (sole writer):** owns all repository edits listed below on one delivery branch and one pull request.
- **Advisory specialist — `product_designer` (read-only):** captures and compares the exact approved Figma nodes, confirms design/interaction/responsive intent, reviews Storybook evidence, and identifies approved divergences. The advisor does not edit repository files or Figma.
- **Advisory specialist — `browser_release_debugger` (read-only):** verifies the resulting Vercel Preview, representative routes, Gallery regression, console/network state, and `/api/health`; it does not deploy, roll back, or write code.
- **Independent review owner — `quality_reviewer` (read-only):** maps acceptance criteria to evidence, reviews API/accessibility/scope preservation, and decides whether the change is ready for the human merge gate.
- **Topology:** exactly one writing owner; no concurrent writers. Keep one task branch and one PR. Because implementation will occur in a non-primary Treehouse checkout, follow the worktree skill: resolve the configured remote, fetch its current `main`, use a clean leased worktree and `agent/design-system-sync`-style branch based on `<remote>/main`, and do not edit or merge `main`. If the existing `agent/storefront-redesign-phase-1` checkout is proposed for reuse, first prove it is clean, current, and dedicated to this delivery; otherwise allocate a fresh lease. Do not create a second writer, branch, or PR without engineer approval.

## Applicable project skills

1. **`.agents/skills/feature-brief/SKILL.md`** — the prompt must become observable acceptance criteria, explicit ownership boundaries, state coverage, evidence, and human decisions before edits.
2. **`.agents/skills/impeccable/SKILL.md`** — this is a UI-system refinement involving typography, color, spacing, interactions, responsive behavior, accessibility, motion, and content extremes. Use the incumbent visual direction; do not invent a replacement world. The context preflight already reported that `PRODUCT.md` uses the legacy record shape and that `.impeccable/design.json` is stale. The product-record modernization is out of scope; refreshing the sidecar is in scope because `DESIGN.md` will change.
3. **`.agents/skills/design-to-storybook/SKILL.md`** — Figma, `DESIGN.md`, `.impeccable/design.json`, CSS variables, components, and Storybook are one synchronization contract. Exact approved Figma evidence is required before implementation.
4. **`.agents/skills/quality-gate/SKILL.md`** — substantive global UI changes require targeted tests, Storybook tests/build, full repository checks, browser/a11y review, diff review, and evidence rather than a success assertion.
5. **`.agents/skills/release-debug/SKILL.md`** — global token and primitive changes have broad runtime blast radius, so a read-only browser specialist must verify the Vercel Preview and health endpoint before merge review.
6. **`.agents/skills/parallel-agent-worktrees/SKILL.md`** — implementation is planned in a non-primary checkout. Apply its clean-remote-base and isolated single-writer rules even though work is sequential.

`sanity-content-change` and `shopify-storefront-change` do not trigger: no schema, GROQ, preview-content, generated Sanity types, cache, catalog, cart, customer, checkout, or webhook behavior may change.

## Canonical Figma targets and blocking capture gate

Use exactly these typed, read-only targets in canonical file key `GYiQd7QSAwCSaGtt0alKG2`:

| Typed target | Exact node | Expected state | Required evidence |
| --- | --- | --- | --- |
| `DESIGN_SYSTEM_FOUNDATIONS_AND_ATOMS` | `403:2` | `Approved` | dimensions/layout; semantic variables and mode values; typography; radii, spacing, depth, and assets; atom names/variants/states; responsive behavior; accessibility/interaction; content extremes; divergences |
| `IMPLEMENTATION_CONTRACT` | `455:2` | `Approved` | component-to-code/Storybook mapping; preserved API requirements; state applicability; breakpoints; reduced-motion behavior; accessibility decisions; test/evidence requirements; intentional divergences |

The request asserts that both targets are approved. Before code edits, the `product_designer` must record a sanitized structured capture for both exact nodes, confirm their `Approved` marker and canonical-file identity, and produce one frozen inventory of foundations and atoms. The capture must bind each approved Figma item to its semantic token, code component, Storybook title, applicable states, and responsive behavior. A complete previously captured handoff may be reused only if it names these exact file/node IDs and all evidence categories.

**Blocking rule:** unavailable/unauthenticated connector access, a wrong or unlabeled node, missing approval evidence, or an incomplete capture blocks implementation. Do not infer final values from the current code, screenshots, or prose and do not ask another agent to work around connector access. The implementation owner consumes the approved capture and does not independently browse Figma. If Figma and the implementation contract conflict, return to the human design gate rather than choosing silently.

## System ownership boundaries

- **Figma and `DESIGN.md`:** approved visual direction and durable design rules. This task reads Figma and updates repository guidance; it does not edit or publish Figma.
- **Next.js:** owns runtime semantic CSS and customer-facing behavior. Only global tokens and mapped reusable UI primitives are changed; page structures and data composition remain unchanged.
- **Storybook:** owns reusable component contracts and meaningful visual/interaction states. It is the primary implementation review surface for this slice.
- **Sanity:** continues to own editorial copy and Gallery content. No schema, content, query, generated type, preview, or publish operation is allowed.
- **Shopify:** continues to own prices, inventory, product/variant truth, carts, customers, and checkout. Storybook fixtures remain illustrative and must not become duplicated commerce truth.
- **Vercel:** owns preview/deployment state. Agents may inspect a PR Preview; production promotion and rollback remain human decisions.
- **Gallery:** its approved DOM order, grid dimensions/cadence, viewer behavior, copy fallback, and responsive layout remain authoritative. Global tokens may restyle approved atoms used by Gallery only to the extent required by the refresh; they must not alter Gallery layout or behavior.

## Exact file ownership

### Files the sole implementation owner is expected to modify

1. `DESIGN.md`
   - Replace stale foundation/atom facts with the exact approved values and rules from nodes `403:2` and `455:2`.
   - Preserve product truth, system boundaries, existing approved page contracts, and especially the entire approved Gallery layout/behavior contract. Record new node links and any approved runtime divergence.
2. `.impeccable/design.json`
   - Regenerate/synchronize the sidecar after `DESIGN.md` changes, preserving schema v2 and carrying extensions that frontmatter cannot represent (ramps, breakpoints, depth, motion, and component snippets). Do not hand-edit it into disagreement with `DESIGN.md`.
3. `src/app/globals.css`
   - Map the captured primitive and semantic variables for every approved mode, preserving semantic token names where possible and avoiding one-off component colors.
   - Keep reduced-motion behavior explicit and retain stable Tailwind semantic aliases.
4. `src/app/design-tokens.test.ts`
   - Expand exact-value, mode, alias, pair, radius/spacing/typography, and Gallery-protection assertions so token drift fails deterministically.
5. `src/components/ui/design-foundations.stories.tsx` (new if the capture confirms no equivalent story)
   - Provide a reviewable foundations contract for approved color modes, typography, spacing, radii, depth, and focus/motion examples without creating a runtime component API.
6. `.storybook/preview.ts`
   - Synchronize deterministic review canvases/viewports for 320px, 390px, tablet, standard desktop, and wide desktop, and retain `@storybook/addon-a11y` as an error gate. Configure approved mode canvases only through semantic tokens.
7. `specs/d001c771_storefront-redesign-handoff.md`
   - Append a dated canonical refresh addendum that supersedes only the affected foundation/atom contract. Include the final sync matrix, exact Figma references, evidence links/IDs, preserved APIs, Gallery-preservation result, and divergences. Do not rewrite the broader redesign mission or imply page migration/release completion.

### Existing atom files owned conditionally by the sole implementation owner

The frozen Figma inventory decides which rows actually change. For each mapped atom, update its source, matching story, and matching test together; if a row is absent from the approved capture, leave it unchanged and mark `not in approved refresh` in the sync matrix.

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
- `src/components/ui/price-display.tsx`, `price-display.stories.tsx`, `price-display.test.tsx` only if explicitly present in node `403:2`; preserve normalized money inputs and Shopify ownership
- `src/components/ui/commerce-status.tsx`, `commerce-status.stories.tsx`, `commerce-status.test.tsx` only if explicitly present; preserve written status and Shopify ownership
- `src/components/ui/product-card.tsx`, `product-card.stories.tsx`, `product-card.test.tsx`, and `product-card.fixtures.ts` only if explicitly present; preserve its browse-only API, normalized price/status composition, and provisional fixture status

`.storybook/main.ts` and `vitest.storybook.config.ts` are inspect-only unless the approved capture requires a review capability the current a11y/Vitest configuration cannot express. Any proposed addon/dependency/config change requires an explicit reason in the handoff and must not introduce a new lockfile change by default.

### Prohibited edits

Do not edit `src/components/gallery-viewer.tsx`, Gallery route files, Gallery stories/tests, `src/components/ui/scroll-reveal*`, page/template layout files, Sanity or Shopify files, environment files, deployment configuration, or `docs/planning/roadmap.md`. Existing `tests/e2e/gallery.spec.ts` is a regression oracle, not an implementation target; change it only if an independently approved Gallery contract changes, which is out of scope here.

## Implementation sequence

### 1. Establish the approved delta

- Complete the typed Figma capture gate and obtain the frozen atom inventory.
- Build a before/after table of each primitive token, semantic role, mode, typography role, radius, spacing, depth signal, breakpoint, motion value, atom variant, and state.
- For each difference, classify it as `sync required`, `already synced`, `not applicable`, or `potential conflict`.
- Have the product designer resolve all potential conflicts and confirm desktop/mobile/responsive states. Preserve the prompt's explicit API and Gallery constraints over any ambiguous static artifact; an actual approved contradiction requires a human decision, not an agent assumption.

### 2. Synchronize durable guidance and runtime foundations

- Update `DESIGN.md` first from the approved delta, then regenerate `.impeccable/design.json` so the repository-readable contracts agree.
- Update `globals.css` primitive/semantic values and aliases. Keep component code on semantic roles; do not substitute raw values in TSX. Keep Ivory/Midnight (or exact captured names) complete rather than allowing fallback leakage between modes.
- Encode exact assertions in `design-tokens.test.ts`, including foreground/background pairs, focus tokens, typography roles, spacing/radius values, and unchanged Gallery-critical values where the refresh does not supersede them.
- Verify WCAG AA contrast on actual Storybook canvases for default, hover, active, disabled, feedback, and focus states; do not accept a token pair based only on an isolated swatch.

### 3. Synchronize atom contracts without breaking APIs

- Preserve every exported component name, prop/type name, variant and size string, default, event behavior, `asChild` behavior, ref/attribute passthrough, data slot used by consumers, and legacy compatibility alias unless the implementation contract explicitly requires an additive adapter. Existing consumers must typecheck without migration.
- Prefer CSS/class and internal markup changes. If approved Figma naming differs from a public API, keep the API and document the name mapping; additive aliases require tests. Any removal or semantic break is rejected as out of scope and returned to the human design gate.
- Extend existing Radix/shadcn-derived primitives rather than introducing duplicate controls. Preserve native semantics: anchors for destinations, buttons for actions, native inputs/textarea, and Radix focus/escape/restoration behavior for overlays.
- Add/update Storybook stories only where a state is meaningful:
  - default and both approved modes;
  - hover, active, and keyboard focus for interactive controls;
  - disabled for controls that support it (never invent a disabled link);
  - loading/busy with stable dimensions and repeat-activation suppression where supported;
  - invalid/error/read-only for form controls and fields;
  - long labels, long values, multiline descriptions, large money strings, missing media, or status extremes as appropriate;
  - responsive 320/390/tablet/desktop/wide presentations where geometry changes;
  - reduced-motion evidence where transition/loading behavior exists;
  - empty/failure only for components whose API truthfully supports those states.
- Add focused unit and Storybook interaction assertions for semantics, keyboard focus, accessible names/descriptions, busy/disabled behavior, overlay focus containment/restoration, and unchanged public variants.

### 4. Protect integrated behavior, especially Gallery

- Review representative current consumers after atom changes rather than editing their layouts. At minimum inspect Home, Collection/Product, Contact/Account, mobile Navigation/overlay behavior, and Gallery viewer controls.
- Compare Gallery at 390px and 1440px to its existing approved contract. Confirm authored/DOM order, campaign/market cadence, grid widths/gaps, captions, viewer focus, close/next/previous behavior, and 200% zoom/reduced-motion behavior are unchanged.
- If a foundation change would shift Gallery layout, first attempt a semantic component implementation that preserves Gallery. If the approved refresh truly conflicts, stop and record the conflict; do not alter Gallery or silently fork the design system.

### 5. Produce the final synchronization handoff

Append a matrix to `specs/d001c771_storefront-redesign-handoff.md` with one row per foundation and mapped atom and these columns:

`Figma file/node` | `approved Figma value/state` | `DESIGN.md` | `.impeccable/design.json` | `CSS token` | `component/API` | `Storybook story/state` | `test/evidence` | `status` | `divergence/reason/approver`

Statuses are only `synced`, `pending/blocking`, `intentional divergence`, `already synced`, or `not applicable`. An intentional divergence must name the accessibility/runtime/API reason and the human approver. Include exact screenshot names/URLs, command exit statuses, Preview URL/deployment ID/commit SHA, Gallery regression result, and residual risk. Do not claim page migration, content publish, commerce completion, merge, or production readiness.

## Observable acceptance criteria

1. A structured capture exists for canonical file `GYiQd7QSAwCSaGtt0alKG2`, nodes `403:2` and `455:2`, both confirmed `Approved`, with all required evidence categories and a frozen foundation/atom inventory.
2. `DESIGN.md`, `.impeccable/design.json`, and the approved Figma foundation values agree for colors/modes, typography, spacing, radii, depth, breakpoints, focus, and motion; any difference is explicitly approved and recorded.
3. `globals.css` exposes the approved values through semantic names in every approved mode, and `design-tokens.test.ts` fails on drift in values, aliases, or key semantic pairs.
4. Every mapped atom's code name and Storybook title remain aligned with Figma, and source/story/test are updated together. Components not present in the approved refresh are not restyled speculatively.
5. Existing public component APIs and behavior remain source-compatible. Repository typecheck and existing consumer tests pass without page migration; temporary Button aliases remain unless an additive compatibility plan is approved.
6. Storybook presents all applicable default, interaction, disabled, focus, loading, error/read-only, long-content, reduced-motion, and responsive states in approved modes. Inapplicable states are omitted and explained rather than fabricated.
7. Accessibility is preserved or improved: semantic elements; complete keyboard operation; visible mode-aware focus; 44×44 minimum interactive targets; WCAG AA text/control/state contrast; labels and error descriptions; truthful busy/disabled semantics; overlay focus containment, Escape, scroll lock, and focus restoration; no color-only meaning; no unsolicited live regions; and a useful reduced-motion alternative.
8. Content extremes remain usable at 320px, 390px, tablet, 1440px/wide desktop, natural height, and 200% zoom without horizontal overflow, clipped labels, hidden focus, unstable loading dimensions, or reliance on hover alone. Long/localized labels, multiline body/error text, long prices, missing imagery, and status extremes are covered where relevant.
9. The approved Gallery layout and viewer behavior are unchanged. Existing Gallery unit/Playwright tests pass, and desktop/mobile comparison evidence shows no cadence, grid, caption, DOM-order, focus, or viewer-navigation regression.
10. The final handoff contains the requested Figma → `DESIGN.md` → CSS → components → Storybook sync matrix, plus sidecar/test/Preview evidence and every intentional divergence.
11. Fast verification, Storybook tests/build, the full local gate, and relevant browser tests all exit successfully. Required failures or skipped gates are reported as blockers, not success.
12. The diff contains no page migrations, Gallery implementation edits, Sanity/Shopify changes, secrets, unrelated formatting churn, production deployment, or merge to `main`.

## Accessibility and content-extreme evidence checklist

- Keyboard-only pass for Button/link/input/textarea/Field and each mapped overlay; focus is always visible and ordered.
- Screen-reader-oriented DOM inspection for accessible names, descriptions, required/invalid/busy/disabled state, status text, dialog naming, and restored trigger focus.
- Automated Storybook a11y checks with zero serious/critical violations and manual contrast calculations for every actual state pair in each mode.
- Pointer/touch targets measured at or above 44×44 CSS px; inline prose links are exempt only where the approved contract says so.
- 320×844, 390×844, tablet, 1440×900, and wide desktop captures; repeat critical stories/routes at 200% zoom.
- Long unbroken label/value, two-to-three-line label/body copy, long ZAR amount, missing image, all commerce statuses, long validation error, and long dialog content as applicable.
- `prefers-reduced-motion: reduce` capture proving no decorative continuous motion while state/focus feedback remains understandable.
- No essential label baked into an image and no new content or commerce claim introduced by fixtures.

## Deterministic verification commands

Run from the clean implementation worktree and judge each command only by exit status:

```bash
corepack pnpm install --frozen-lockfile

# Focused token and UI unit/integration gate
corepack pnpm exec vitest run --config vitest.config.ts src/app/design-tokens.test.ts src/components/ui/*.test.tsx

# Deterministic design-system anti-pattern scan
node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/ui .storybook

# Storybook contracts and static build
corepack pnpm test:stories
corepack pnpm build-storybook

# Required repository fast verification
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test

# Full local gate (format, lint, typecheck, Vitest, Storybook tests/build, Next build)
corepack pnpm check

# Browser prerequisites and Gallery-specific regression
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium --project=mobile

# Full browser regression because global tokens/primitives have broad consumers
corepack pnpm test:e2e
```

After pushing the single PR branch, require the exact branch CI and Preview:

```bash
just pr-gate <PR-number>
```

A pending, missing, skipped, cancelled, timed-out, or failed required check is a failed gate. Do not replace a missing GitHub check with local evidence. The quality reviewer must also inspect the final diff for unrelated files, raw one-off colors, API changes, test weakening, skipped stories, generated artifacts, and secrets. No roadmap edit is expected because this slice does not change roadmap scope; the reviewer should state that explicitly rather than editing `docs/planning/roadmap.md`.

## Preview and rollback evidence

### Local/Storybook evidence

Capture stable, named screenshots of the foundations story and every changed atom in each applicable mode at 320, 390, tablet, and 1440/wide widths. Include keyboard focus, hover/active, disabled, loading, invalid/error, long-content, reduced-motion, and overlay open states where applicable. Use one bounded desktop/mobile review pass, one consolidated fix pass, and at most one confirmation pass.

### Vercel Preview evidence

After green CI, the read-only `browser_release_debugger` records Preview URL, deployment ID, commit SHA, timestamp, and successful `/api/health`. Inspect `/`, `/shop`, one product route, `/gallery`, and one form/overlay consumer such as `/contact` or `/account` at mobile and desktop widths. Capture screenshots, keyboard/focus evidence, console errors, failed network requests, and the Gallery preservation check. Preview review is evidence for the human merge decision, not production authorization.

### Rollback

No production rollback should be needed because production deployment is out of scope. Keep the change in reviewable commits so the delivery can be reverted as one PR/commit or corrected by restoring the previous `DESIGN.md`, sidecar, CSS, atom, story, and test versions on the task branch. Record the parent commit and last-known-good Preview SHA/URL. If a merged change later causes material production impact, the browser specialist may recommend the last-known-good Vercel deployment, but only a human may authorize rollback; no agent executes it.

## Human approval gates

1. **Before implementation:** the human design owner must have approved the exact nodes and responsive/interaction direction. The prompt supplies an approval assertion; the product designer must bind that assertion to nodes `403:2` and `455:2` and record complete evidence. Missing evidence is blocking.
2. **During design review:** any conflict affecting API compatibility, Gallery layout, accessibility, or an absent Figma state returns to the human design owner. Agents cannot approve a divergence.
3. **Before merge:** require green required checks, Storybook/Preview evidence, independent `quality_reviewer` approval, and explicit human approval to merge. The implementation owner never merges its own work.
4. **Publish:** no Sanity editorial publish or Figma publish/edit is in scope. If either becomes necessary, stop and obtain separate human authorization; agents do not publish.
5. **Production:** explicitly out of scope. A human must separately authorize any production promotion after protected `main`; this plan grants no deployment authority.
6. **Rollback:** only a human may authorize Vercel rollback or destructive recovery. Agents may collect evidence and recommend a last-known-good target.

## Residual risks and blockers

- **Figma access/evidence:** current repository operations document a provider approval boundary for the project-local Figma path. If no approved, authenticated read-only capture for the exact nodes is available, implementation cannot start; screenshots/current code are not substitutes.
- **Global blast radius:** semantic token changes affect routes outside Storybook even without page edits. Full browser and Preview sampling reduce but cannot eliminate visual regressions on every content permutation.
- **Static-to-runtime mismatch:** Figma cannot prove keyboard, focus containment, loading semantics, reduced motion, zoom, or natural wrapping. The implementation contract and runtime accessibility evidence govern those gaps, and approved divergences must be documented.
- **API versus visual naming:** a refreshed Figma variant may conflict with established prop values. The no-breaking-API requirement wins unless a human approves a separate migration; additive aliases can increase temporary maintenance cost.
- **Gallery coupling:** Dialog/Button/token changes can affect Gallery indirectly. Existing geometric and keyboard regression tests are mandatory, but final visual comparison still requires human judgment.
- **Sidecar drift:** `.impeccable/design.json` is currently stale. Updating `DESIGN.md` without regenerating and reviewing it would leave the task incomplete.
- **Legacy product record:** `PRODUCT.md` lacks the current Impeccable schema sections. That modernization belongs to a separately requested `$impeccable init` task and must not expand this delivery.
- **Visual evidence stability:** font rendering and OS/browser differences may make pixel-perfect comparison noisy. Review dimensions, computed tokens, semantics, and bounded screenshots together rather than relying on screenshot pixels alone.
