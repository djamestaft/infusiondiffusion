# Foundations + Atoms design-system refresh plan

## Objective

Implement the approved Foundations + Atoms slice from the canonical Infusion Diffusion Figma file, synchronizing durable design guidance, runtime semantic tokens, reusable atoms, Storybook contracts, and verification evidence while preserving all existing public component APIs and the approved Gallery layout and behavior.

This is one substantive UI delivery by one writing owner on one delivery branch and one pull request. It does not authorize page migration, Gallery layout or implementation changes, Sanity or Shopify changes, Figma/Sanity publishing, production deployment, merge to `main`, or rollback.

## Specialist routing and delivery topology

- **Implementation owner — `storefront_engineer` (sole writer):** owns all repository edits named below. No other role may write code, stories, tests, docs, configuration, or Figma.
- **Advisory specialist — `product_designer` (read-only):** validates the seven exact approved Figma evidence records, freezes the approved foundation/atom inventory, reviews responsive and interaction mapping, and identifies unresolved divergences. This role cannot grant human design approval.
- **Advisory specialist — `browser_release_debugger` (read-only):** verifies the eventual Vercel Preview, representative consumers, Gallery regression behavior, console/network health, and `/api/health`; it does not deploy or roll back.
- **Independent review owner — `quality_reviewer` (read-only):** maps acceptance criteria to evidence and independently reviews scope, accessibility, API compatibility, Storybook coverage, tests, Preview evidence, and the final synchronization matrix.
- **Topology:** exactly one implementation writer, one Treehouse-managed delivery worktree/branch, and one pull request. The current non-primary checkout is `agent/storefront-redesign-phase-1`, tracking `infusion-diffusion/main` and currently three commits ahead. Do not silently add implementation to that history. The engineer must either approve reusing that branch for the same PR or create a fresh Treehouse-leased `agent/foundations-atoms-refresh` branch from freshly fetched `<remote>/main` following `parallel-agent-worktrees`. A second writer, branch, or PR requires explicit engineer approval.

## Seven distinct typed Figma targets and blocking evidence gate

Do not aggregate these into one multi-node target. Maintain seven separate target records, each containing exactly one node ID:

| Target | File key | Node ID | Expected approval | Required evidence categories |
| --- | --- | --- | --- | --- |
| 1 | `GYiQd7QSAwCSaGtt0alKG2` | `403:3` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 2 | `GYiQd7QSAwCSaGtt0alKG2` | `403:4` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 3 | `GYiQd7QSAwCSaGtt0alKG2` | `403:5` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 4 | `GYiQd7QSAwCSaGtt0alKG2` | `403:6` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 5 | `GYiQd7QSAwCSaGtt0alKG2` | `403:7` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 6 | `GYiQd7QSAwCSaGtt0alKG2` | `455:3` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |
| 7 | `GYiQd7QSAwCSaGtt0alKG2` | `456:2` | `Approved` | `dimensions_layout`, `semantic_variables`, `typography`, `spacing_assets`, `responsive`, `accessibility_interaction`, `content_extremes`, `divergences` |

Before implementation, the product designer must validate seven separate sanitized, node-bound evidence records. Each record must identify the node’s visible name and `Approved` state and capture the eight categories above, including component/state inventory, variable collection and modes, dimensions, breakpoints, typography, spacing/radius/depth, assets/icons, responsive behavior, interaction/accessibility decisions, content extremes, and divergences. Create a frozen crosswalk from each captured item to `DESIGN.md`, `.impeccable/design.json`, CSS token, code component/public API, Storybook title/state, and test.

The prompt asserts that the direction is approved, but incomplete or unauthenticated connector evidence, a wrong node, absent `Approved` state, or provenance mismatch remains blocking. Do not infer missing values from screenshots, current CSS, or the earlier combined-target plan. Do not ask an implementation agent to work around missing connector access. Where static Figma cannot specify a runtime state, preserve the existing accessible behavior and document the gap for human divergence review rather than inventing visual truth.

## Applicable project skills

1. **`.agents/skills/feature-brief/SKILL.md`** — this UI slice needs observable scope, state behavior, ownership, accessibility, content extremes, evidence, rollback considerations, and human decisions before edits.
2. **`.agents/skills/impeccable/SKILL.md`** — typography, color, spacing, control states, responsive behavior, accessibility, and reduced motion are being refined. Use the approved incumbent direction, run its context command once for the chosen UI target before editing, and load the craft floor only immediately before UI edits.
3. **`.agents/skills/design-to-storybook/SKILL.md`** — exact Figma evidence, `DESIGN.md`, `.impeccable/design.json`, semantic CSS, component contracts, and Storybook states must remain synchronized.
4. **`.agents/skills/quality-gate/SKILL.md`** — global tokens and reusable atom changes have broad impact and require targeted tests, Storybook tests/build, full checks, browser/a11y evidence, diff review, and residual-risk reporting.
5. **`.agents/skills/release-debug/SKILL.md`** — a read-only Vercel Preview and runtime regression check are required before merge readiness.
6. **`.agents/skills/parallel-agent-worktrees/SKILL.md`** — implementation is in a non-primary checkout; apply remote discovery, fresh-base, branch isolation, and one-writer rules.

`sanity-content-change` and `shopify-storefront-change` do not trigger because schemas, GROQ, generated Sanity types, cache behavior, catalog, price, inventory, cart, customer, checkout, and webhooks are out of scope.

## System ownership boundaries

- **Figma and `DESIGN.md`:** own approved visual direction and durable visual rules. This task consumes exact approved nodes and updates repository guidance; it does not edit or publish Figma.
- **Next.js:** owns customer UI and runtime token behavior. Only semantic foundations and reusable atoms may change; routes and page compositions remain unchanged.
- **Storybook:** owns reusable component contracts and meaningful visual/interaction states and is the primary review surface for this slice.
- **Sanity:** retains editorial content, Gallery grouping/captions, and image metadata. No schema, content, preview, cache, or publish action changes.
- **Shopify:** retains products, variants, prices, inventory, discounts, customers, carts, checkout, orders, and fulfilment. Story fixtures remain illustrative and must not become commerce truth.
- **Vercel:** owns Preview/deployment state. Preview may be inspected read-only; production promotion and rollback remain human decisions.
- **Gallery:** its approved DOM/authored order, campaign and market grids, dimensions/cadence, captions, responsive rules, viewer semantics, boundary behavior, and focus restoration are immutable in this slice. Shared tokens/atoms may flow through only if they do not change that contract.

No analytics contract changes are required.

## Exact file ownership

### Required synchronization files owned by the sole writer

- `DESIGN.md`
  - Replace only stale Foundations + Atoms facts with captured approved values and seven exact node links.
  - Preserve approved page contracts, especially the complete Gallery section.
  - Document compatibility mappings and intentional runtime divergences.
- `.impeccable/design.json`
  - Regenerate/synchronize the schema-v2 sidecar after `DESIGN.md` changes, including captured modes, ramps, breakpoints, depth, motion, and atom snippets that frontmatter cannot express.
- `src/app/globals.css`
  - Map approved primitives to stable semantic variables and Tailwind aliases for every approved mode.
  - Avoid new component-level raw colors, incomplete mode mappings, and unrelated motion/page changes.
- `src/app/design-tokens.test.ts`
  - Add deterministic assertions for approved primitive values, aliases and semantic pairs, modes, typography, spacing, radii, depth, focus, motion, and Gallery-critical semantic stability.
- `src/components/ui/design-foundations.stories.tsx` **(new if the captured inventory warrants a dedicated review surface)**
  - Present colors/modes, typography, spacing, radii, depth, focus, and reduced-motion examples without creating a public runtime API.
- `.storybook/preview.ts`
  - Synchronize deterministic 320px, 390px, tablet, standard-desktop, and wide-desktop viewports/canvases while preserving fullscreen behavior and `a11y: { test: "error" }`.
- `specs/d001c771_storefront-redesign-handoff.md`
  - Append a dated Foundations + Atoms addendum with seven target records, evidence references, API preservation, Gallery regression result, verification/Preview evidence, synchronization matrix, intentional divergences, residual risks, and roadmap status.

### `src/components/ui` source/story/test ownership

Audit every existing triplet against the frozen seven-target inventory. Update a source, its story, and its test together only when captured evidence includes it; mark absent or already-correct entries in the handoff matrix rather than speculatively restyling them.

- `button.tsx`, `button.stories.tsx`, `button.test.tsx`
- `text-link.tsx`, `text-link.stories.tsx`, `text-link.test.tsx`
- `input.tsx`, `input.stories.tsx`, `input.test.tsx`
- `textarea.tsx`, `textarea.stories.tsx`, `textarea.test.tsx`
- `field.tsx`, `field.stories.tsx`, `field.test.tsx`
- `badge.tsx`, `badge.stories.tsx`, `badge.test.tsx`
- `content-primitives.tsx`, `content-primitives.stories.tsx`, `content-primitives.test.tsx`
- `feedback-alert.tsx`, `feedback-alert.stories.tsx`, `feedback-alert.test.tsx`
- `dialog.tsx`, `dialog.stories.tsx`
- `drawer.tsx`, `drawer.stories.tsx`
- `alert-dialog.tsx`, `alert-dialog.stories.tsx`
- `overlay-primitives.test.tsx` for shared Dialog/Drawer/AlertDialog behavior
- `price-display.tsx`, `price-display.stories.tsx`, `price-display.test.tsx` only if captured; normalized money inputs and Shopify ownership cannot change
- `commerce-status.tsx`, `commerce-status.stories.tsx`, `commerce-status.test.tsx` only if captured; written status and Shopify ownership cannot change
- `product-card.tsx`, `product-card.stories.tsx`, `product-card.test.tsx`, `product-card.fixtures.ts` only if captured; preserve browse-only semantics, PriceDisplay/CommerceStatus composition, and provisional fixture status

Preserve exported names, prop/type names, variant and size strings, defaults, `asChild`, attribute/event passthrough, `data-slot` markers, native semantics, and compatibility aliases (`default`, `outline`, `ghost`, and `lg`). Prefer internal classes, semantic token mappings, and non-breaking markup changes. No removal or semantic break is permitted.

### Inspect-only and prohibited files

- `.storybook/main.ts` and `vitest.storybook.config.ts` are inspect-only unless an approved state cannot be represented by the existing a11y/Vitest setup. Any edit needs a recorded reason; no dependency or lockfile change is expected.
- `tests/e2e/gallery.spec.ts` is a regression oracle, not an implementation target. Do not weaken geometry, order, accessibility, or focus assertions to make shared changes pass.
- Do not edit `src/components/ui/scroll-reveal.tsx`, `scroll-reveal-controller.tsx`, or their tests.
- Do not edit `src/components/gallery-viewer.tsx`, Gallery route/story/component implementation, page/template layouts, Navigation/Gallery composition, Sanity or Shopify files, environment/deployment files, `package.json`, the lockfile, or `docs/planning/roadmap.md`.

## Implementation sequence

1. **Prepare isolated delivery:** resolve the configured remote, fetch current remote `main`, confirm the approved single-branch topology, and establish the sole writer in one Treehouse-managed worktree. Preserve unrelated changes.
2. **Freeze the approved delta:** validate all seven distinct evidence records. Build a before/after inventory for primitive and semantic values, modes, type roles, spacing/radius/depth, breakpoints, focus/motion, atom variants/sizes/states, assets, responsive rules, and divergences. Classify each item `sync required`, `already synced`, `not applicable`, or `blocking conflict`.
3. **Synchronize foundations:** update `DESIGN.md`, then `.impeccable/design.json`, then `globals.css` and exact token tests. Keep semantic names stable where practical and record Figma-to-runtime naming mappings rather than breaking consumers.
4. **Synchronize atoms:** extend existing shadcn/Radix-based primitives; do not duplicate low-level controls. Preserve buttons as actions, anchors as destinations, native input/textarea semantics, and Radix overlay focus/Escape/scroll-lock/restoration behavior.
5. **Synchronize Storybook:** align Figma component name, code name, and `Components/*` title. Add only applicable default/mode, hover/active, keyboard focus, disabled, loading/busy, invalid/error/read-only, long-content, reduced-motion, and responsive stories with meaningful `play` assertions. Do not invent disabled links, loading static metadata, or unsolicited live regions.
6. **Protect integrations:** inspect representative Home, Shop/Product, Contact or Account, an overlay flow, and Gallery without migrating pages. Verify Gallery at 320px, 390px, 1440px, natural height, 200% zoom, and reduced motion. If approved atom styling conflicts with Gallery, accessibility, or a public API, stop for a human decision rather than forking tokens or changing Gallery.
7. **Complete the handoff:** append a matrix to `specs/d001c771_storefront-redesign-handoff.md` with columns `Figma target/node`, `approved evidence/value/state`, `DESIGN.md`, `.impeccable/design.json`, `CSS token`, `component/public API`, `Storybook title/state`, `test/Preview evidence`, `status`, and `divergence/reason/approver`. Allowed statuses are `synced`, `already synced`, `not applicable`, `pending/blocking`, and `intentional divergence`.
8. **Independent review and Preview:** run all deterministic checks, push the one PR branch, require green protected checks, collect read-only Preview evidence, and stop for human merge approval.

## Observable acceptance criteria

1. Seven separate sanitized evidence records bind file `GYiQd7QSAwCSaGtt0alKG2` individually to nodes `403:3`, `403:4`, `403:5`, `403:6`, `403:7`, `455:3`, and `456:2`; each is confirmed `Approved` and contains all eight required evidence categories.
2. Approved foundations agree across Figma, `DESIGN.md`, `.impeccable/design.json`, `globals.css`, the foundations Storybook review surface where used, and deterministic token tests for modes, values, typography, spacing, radii, depth, breakpoints, focus, and motion. Any difference is a named, human-approved intentional divergence.
3. Semantic token names remain reusable and mode-complete. Included atom TSX uses semantic tokens, introduces no one-off raw colors or duplicate primitives, and token tests fail deterministically on value, alias, or pair drift.
4. Every captured atom maps to its existing code component and matching `Components/*` Storybook title. Included source/story/test triplets are synchronized; excluded components remain unchanged and are accounted for in the matrix.
5. Existing public component APIs remain source-compatible: exports, props, variants, sizes, defaults, aliases, `asChild`, events, attributes, native element semantics, and Radix behavior are preserved. Existing consumers typecheck without page migration.
6. Storybook demonstrates and tests every meaningful applicable state: approved modes and defaults, hover/active, keyboard focus, disabled, loading/busy, invalid/error/read-only, long content, responsive behavior, and reduced motion. Inapplicable states are omitted with a documented reason.
7. Accessibility is preserved or improved: semantic HTML, keyboard operation, visible mode-aware focus, WCAG AA contrast on actual canvases, minimum 44×44 targets where applicable, accessible icon-only names, correct labels/descriptions/errors, truthful busy/disabled semantics, written non-color-only status, no unsolicited live regions, and correct overlay naming/focus containment/Escape/scroll lock/restoration.
8. Content extremes work at 320px, 390px, tablet, 1440px, wide desktop, natural height, and 200% zoom without horizontal overflow, clipped essential text, hidden focus, hover-only meaning, or unstable loading dimensions. Cover long/localized labels, long unbroken values, multiline descriptions/errors, long ZAR amounts, missing imagery, relevant status values, and long overlay content where applicable.
9. Reduced-motion evidence shows decorative animation/transition removal while state changes, progress, focus, and loading meaning remain understandable.
10. The approved Gallery layout and behavior remain unchanged. Existing Gallery Playwright checks pass in desktop and mobile projects, and Preview review shows no regression in grid/cadence, caption spacing, DOM order, viewer navigation boundaries, Escape, focus restoration, reduced motion, zoom, or overflow.
11. The redesign handoff contains the complete Figma → `DESIGN.md` → sidecar → CSS → component/API → Storybook → test/Preview matrix, with all seven targets separate and every intentional divergence carrying a reason and named human approver.
12. Focused tests, fast verification, Storybook tests/build, the full local gate, relevant Gallery tests, broad browser tests, protected CI, and Preview health all succeed by exit status. Missing, skipped, cancelled, timed-out, or failed required evidence is blocking.
13. The final diff contains no page migration, Gallery implementation/layout edit, Sanity/Shopify change, secret, dependency/lockfile churn, unrelated formatting, Figma/Sanity publish, production deployment, or merge to `main`.

## Accessibility and content-extreme evidence

- Run a keyboard-only Storybook pass for each interactive atom and overlay; capture visible focus in every approved mode.
- Inspect accessible names, label/description/error associations, required/invalid/busy/disabled states, static status meaning, dialog titles/descriptions, focus containment, Escape behavior, and trigger-focus restoration.
- Require Storybook a11y tests with violations treated as errors, plus computed/manual contrast evidence for default, hover, active, disabled, feedback, and focus pairs on their actual backgrounds.
- Measure 44×44 CSS-pixel targets for buttons, standalone links, and icon controls; preserve the approved inline-prose-link exception.
- Capture representative states at 320×844, 390×844, tablet, 1440×900, and a wide desktop; repeat critical atoms and Gallery at 200% zoom and natural height.
- Exercise long button/link/metadata text, long email or unbroken values, multiline supporting/error copy, long ZAR display, missing image, all applicable commerce statuses, and long dialog/drawer content.
- Emulate `prefers-reduced-motion: reduce` and confirm animation does not carry exclusive meaning.
- Do not bake essential labels into images or introduce unsupported marketing, editorial, inventory, price, fulfilment, or accessibility claims in fixtures.

## Deterministic verification commands

Run from the isolated implementation worktree and judge each command only by exit status.

```bash
corepack pnpm install --frozen-lockfile

# Focused foundations and reusable atom tests
corepack pnpm exec vitest run --config vitest.config.ts src/app/design-tokens.test.ts src/components/ui/*.test.tsx

# Deterministic UI anti-pattern scan
node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/ui .storybook

# Storybook interaction/a11y contracts and static output
corepack pnpm test:stories
corepack pnpm build-storybook

# Required fast verification
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test

# Full local gate: format, lint, types, Vitest, Storybook tests/build, Next build
corepack pnpm check

# Gallery regression in both configured projects
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium --project=mobile

# Broad regression because global tokens and atoms affect many consumers
corepack pnpm test:e2e
```

After pushing the single PR branch:

```bash
just pr-gate <PR-number>
```

A pending, missing, skipped, cancelled, timed-out, or failed check is a red gate; local results cannot replace a missing protected check. The quality reviewer must also inspect the final diff for API changes, raw colors, weakened/skipped tests, unrelated files, generated artifacts, and secrets.

## Preview and rollback evidence

### Storybook/local evidence

Capture named foundations and changed-atom screenshots in each approved mode at mobile, tablet, desktop, and wide widths. Include applicable focus, hover/active, disabled, loading, invalid/error, long-content, reduced-motion, and open-overlay states. Use one bounded desktop/mobile inspection pass, one consolidated correction pass, and at most one confirmation pass.

### Vercel Preview evidence

After green branch CI, the `browser_release_debugger` records the Preview URL, deployment ID, commit SHA, timestamp, and `/api/health` result. Inspect `/`, `/shop`, one product route, `/gallery`, and one form/overlay consumer such as `/contact` or `/account` at mobile and desktop widths. Record screenshots, keyboard/focus behavior, axe result where applicable, console errors, failed network requests, and Gallery preservation. Preview evidence supports review and human merge; it is not production authorization.

### Rollback

Production deployment is out of scope, so no production rollback is planned. Keep docs, sidecar, CSS, atoms, stories, and tests in coherent reviewable commits so the unmerged PR can be corrected or abandoned, or the merged change can later be reverted as one synchronized unit. Record the parent commit and last-known-good Preview SHA/URL. If a later production incident occurs, the browser specialist may recommend a named last-known-good Vercel deployment, but only a human may authorize rollback and no agent executes it.

## Human approval gates and unresolved decisions

1. **Before implementation:** the exact approved direction and responsive states must be evidenced for all seven separate targets and acknowledged by the human design owner. The prompt supplies expected approval, but missing exact-node evidence remains blocking; no agent may grant approval.
2. **Before any divergence:** a mismatch involving Figma, accessibility, responsive behavior, public APIs, or Gallery requires a documented human decision. API removal and Gallery layout changes remain out of scope even if suggested by a static frame.
3. **Delivery topology:** the engineer must approve whether the current three-commits-ahead branch is the intended delivery PR or whether a fresh branch is required. No second writer/PR is implicit.
4. **Before merge:** require green protected checks, independent `quality_reviewer` review, complete Storybook and Preview evidence, and explicit human merge approval. The implementation owner never merges its own work.
5. **Publish:** Figma and Sanity publishing are not required. If either becomes necessary, stop for separate human authorization; agents cannot publish.
6. **Production:** production deployment is expressly out of scope and requires separate human authorization after protected `main` is green.
7. **Rollback:** only a human may authorize Vercel rollback or destructive recovery; agents collect evidence and recommend a named target.

## Residual risks and blockers

- **Figma connector/provenance:** repository operations document an external provider approval boundary. Without complete authenticated read-only evidence for each exact node, implementation is blocked; an older parent-node or combined-node record is insufficient.
- **Unknown inventory before capture:** exact atom edits cannot be narrowed beyond the audited file list without inventing target contents. The frozen crosswalk determines what changes; all other atoms remain untouched.
- **Global blast radius:** semantic token changes can alter every route without route-file edits. Full Storybook/browser gates and sampled Preview routes reduce but cannot eliminate regressions under all real content.
- **Static-to-runtime gaps:** Figma cannot prove keyboard behavior, focus containment/restoration, busy semantics, reduced motion, zoom, or natural wrapping. Existing accessible runtime behavior governs absent states, with any visual mismatch documented for human approval.
- **API versus visual naming:** approved naming may differ from established props or legacy aliases. Compatibility wins in this slice; additive mapping can create maintenance debt, while removals require a separate migration.
- **Gallery coupling:** Button/Dialog/token changes can indirectly affect Gallery. Automated geometry, keyboard, axe, zoom, and responsive checks are mandatory, but final visual equivalence still needs human review.
- **Sidecar drift:** changing `DESIGN.md` without synchronizing `.impeccable/design.json` would leave the design contract incomplete.
- **Visual evidence variance:** font rasterization and browser/OS differences make raw pixel matching noisy; evaluate dimensions, computed tokens, semantics, and bounded screenshots together.
- **Preview availability:** Vercel evidence depends on a PR Preview and valid environment configuration; inability to obtain it blocks merge readiness, not local implementation.
- **Roadmap:** this is an explicitly requested approved slice, not roadmap selection. `docs/planning/roadmap.md` remains unchanged; the final handoff must state that no roadmap update was required.
