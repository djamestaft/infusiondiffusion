# Storefront Motion Delivery Plan

> **For agentic workers:** Use superpowers:executing-plans for sequential execution
> after the applicable design gates. Subagent-driven execution or multiple writing
> worktrees is not selected by this plan.

**Goal:** Deliver an approved motion language for Home and About using the
published fragrance imagery, without obstructing shopping or mobile access.

**Architecture:** Visible server-rendered content with small route-scoped client
motion boundaries. Use GSAP/ScrollTrigger for approved coordinated sequences,
CSS for simple transitions/sticky layouts and time-based damping only where selected.

**Tech Stack:** Existing Next.js/React/TypeScript, semantic CSS tokens,
Storybook, Vitest and Playwright; GSAP dependencies selected at the study gate.

**Spec:** [Storefront motion brief](../../features/storefront-motion-brief.md)

This is the complete delivery and acceptance plan requested on 19 September.
It schedules design and runnable studies before production implementation.
Exact runtime APIs and code-level steps are an output of the approved studies,
rather than pretending that unreviewed compositions are final specifications.

## Global constraints

- Every new task is assigned to Devon Taft, as explicitly requested.
- One delivery branch/PR by default; sequential implementation and independent review.
- Existing approved imagery, factual copy, commerce ownership and purchase routes remain.
- Follow foundations → atoms → composed components → templates in Storybook → live pages.
- Figma Approved page 2004:14, dated handoffs and DESIGN.md remain visual authority.
- Capture comparisons at 1440/768/390/320, short heights, touch and reduced motion.
- No source publication, global scroll replacement, live payments or direct production deployment.
- G1 storyboard, G2 motion studies, G3 component acceptance and G4 release gates apply.
- Existing launch work does not depend on motion. Live integration waits for INF-36;
  motion release also waits for INF-47 physical-device acceptance.
- INF-37's separate viewer redesign and current ownership remain unchanged.

## Review focus

1. Late fonts/images and resizing must not strand the viewport in a pin spacer.
2. Keyboard focus, anchors and history must reach visible content inside/past the sequence.
3. Preference changes or failed JS must restore a complete, usable static document.
4. Carousel/menu/viewer interactions must not compete for transforms or scroll locks.
5. iPhone browser chrome, keyboard and overscroll must not recreate the footer gap.

Each condition is assigned concrete verification in the owning tasks below.

## Dependency order

Design map → studies and approval → foundations → collection / hero / About →
template integration → independent verification and human release.

The three component tasks share foundations but run sequentially on the one
delivery branch. Dependency branches describe prerequisites, not authorization
for parallel writers. The parent remains Todo; design is Todo and downstream
tasks remain Backlog until their gates clear. Dates/estimates are not invented
before the studies establish scope.

## Plane execution ledger

Parent: **INF-49 — Storefront motion — Home and About delivery**, assigned to Devon, Todo.

| Task   | Deliverable                                                        | Owner | Initial state | Blocked by                     |
| ------ | ------------------------------------------------------------------ | ----- | ------------- | ------------------------------ |
| INF-50 | map Home and About sequences and approve the storyboard            | Devon | Todo          | —                              |
| INF-51 | build Storybook studies and approve the final interaction contract | Devon | Backlog       | INF-50                         |
| INF-52 | implement accessible GSAP lifecycle and motion primitives          | Devon | Backlog       | INF-51                         |
| INF-53 | build the pinned fragrance collection and drifting typography      | Devon | Backlog       | INF-52                         |
| INF-54 | build the approved hero entrance and pointer atmosphere            | Devon | Backlog       | INF-52                         |
| INF-55 | build sticky About chapters and photographic transitions           | Devon | Backlog       | INF-52                         |
| INF-56 | integrate approved Home and About templates in preview             | Devon | Backlog       | INF-53, INF-54, INF-55, INF-36 |
| INF-57 | verify accessibility, performance and release evidence             | Devon | Backlog       | INF-56, INF-47                 |

All eight tasks are children of INF-49. Plane's current plan does
not support Epic types, so INF-49 is a normal parent work item.
Real blocked-by relations encode the prerequisites above. INF-49
relates to INF-37 and completed INF-48; INF-55 also relates
to INF-37. These links do not reassign or close existing work.

## Task contracts

### INF-50. Motion: map Home and About sequences and approve the storyboard

**Owner:** Devon Taft

**Initial state:** Todo

**Depends on:** None; planning is authorized

**Deliverable:** A concrete map of the existing Home and About pages with approved placements and responsive storyboards; this is the first task to start.

**Files and surfaces:**

- docs/features/storefront-motion-brief.md
- docs/features/2026-09-08-design-approval.md
- DESIGN.md
- src/components/templates/home-content.tsx
- src/components/templates/combined-about.tsx

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Inventory existing sections, current approved Figma frames and dated amendments, actual INF-48 imagery, current scroll-reveal/carousel behavior and fixed announcement/navigation geometry. Record reuse/change/add per component and avoid reopening imagery publication.
- [ ] Compare two directions using the same assets: restrained editorial motion and a richer cinematic collection/story sequence. Map the pinned collection, oversized background names, hero atmosphere and About chapters onto actual sections; preserve sections and links unless a specific change is approved.
- [ ] Specify entry/hold/exit, timing/easing, travel and pin distance, overlapping effects, pause/skip controls, readable rest states, touch behavior and compact/short-screen alternatives at 1440/768/390/320. Select a bounded subset; hero pointer depth and additional masks may be rejected independently.
- [ ] Capture baseline mobile loading, route JS, scroll trace and layout stability under a documented repeatable device/network profile; propose measurable budgets before implementation.
- [ ] Record exact frame/node URLs and written storyboard approval from Devon. Mark Figma/document/token/story layers pending or approved explicitly. Produce the design input for Storybook studies; approval here permits experiments, not final live integration.

**Verification:** Review the section inventory against current source and approved assets; check every proposed sequence has a static, touch, keyboard and reduced-motion treatment. No runtime changes.

### INF-51. Motion: build Storybook studies and approve the final interaction contract

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-50

**Deliverable:** Reviewable animated experiments and an approved final motion contract before production components are built.

**Files and surfaces:**

- src/components/motion/motion-studies.stories.tsx (new, exploratory)
- src/components/templates/website-imagery.fixture.json
- src/components/templates/combined-about.fixture.json
- docs/features/storefront-motion-brief.md
- DESIGN.md
- .impeccable/design.json

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Use the storyboard and real licensed imagery to build isolated Storybook studies for the pinned collection with drifting names, hero atmosphere and a sticky About chapter. Keep experiments off live routes.
- [ ] Demonstrate normal, touch, reduced-motion, paused/static, short viewport, long name/copy, empty/missing image and rapid reverse-scroll variants. Load actual fonts and wait for document.fonts.ready.
- [ ] Compare the restrained and cinematic directions side by side in short recordings and interactive stories. Critique hierarchy, brand fit, reading comfort, perceived performance and whether shopping links remain immediate.
- [ ] Measure the prototype against the baseline and lock budgets, device profile, pin eligibility, distance, easing, duration, input rules and static fallback. Recommended starting guardrails: no more than 50ms p95 animation-frame interval on the agreed constrained profile, no animation-caused CLS, no more than 10% median LCP regression across five comparable runs; budget deviations require explicit recorded review.
- [ ] Devon selects/rejects each effect and approves the final Figma/Storybook contract with exact IDs, recordings and date. Synchronize DESIGN.md and its sidecar; record any intentional divergence. Complete the implementation-level API/test plan from this approved contract before foundation work starts. Do not treat these provisional plan filenames as approved final APIs.

**Verification:** Storybook interaction and accessibility checks plus desktop/mobile recordings; verify pointer-only work is absent on touch and reduced-motion examples remain fully usable. Experimental dependencies stay isolated from live routes.

### INF-52. Motion: implement accessible GSAP lifecycle and motion primitives

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-51

**Deliverable:** Small reusable client-side motion primitives with deterministic lifecycle, preferences and visible static HTML.

**Files and surfaces:**

- package.json
- pnpm-lock.yaml
- src/components/motion/motion-boundary.tsx (new)
- src/components/motion/motion-boundary.test.tsx (new)
- src/components/motion/motion-primitives.stories.tsx (new)
- src/lib/motion/damp.ts (new only if approved pointer effect needs it)
- src/lib/motion/damp.test.ts (conditional)
- src/app/globals.css

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Use current official GSAP/React documentation via Context7 to select the smallest dependency set after studies; GSAP and ScrollTrigger only where justified, optional useGSAP for lifecycle, CSS for simple transitions. No global smooth-scroll replacement, Barba routing or WebGL for this slice.
- [ ] Keep Shopify/Sanity fetching and commerce truth outside animation code. Components receive source-owned display data/children; default server HTML is visible and navigable before hydration, with JS disabled or after animation import failure.
- [ ] Implement scoped setup/cleanup for React remounts, route changes and breakpoint changes; remove only owned triggers, observers, event handlers and ticker callbacks. Avoid duplicate pin spacers or competing transforms with ScrollReveal and HeroCarousel.
- [ ] Handle live prefers-reduced-motion changes, fine/coarse pointers, hidden/offscreen pause and user pause state. Time-based damping must settle identically at 30/60/120Hz, stop near its target and clamp resumed-tab elapsed time; omit the helper if studies reject the effect.
- [ ] Add approved semantic duration/easing/distance tokens and Storybook states. Ensure any decorative loop lasting over five seconds has pause/stop/hide control, with keyboard access; prefer scroll-bound text that stops when scrolling stops.

**Verification:** Vitest tests for runtime preference changes, cleanup on repeated mounts and no-JS/default visibility; if damping exists, compare one-second 30/60/120Hz trajectories and resumed-tab clamping. Browser checks for no leaked spacers/triggers after 10 route/remount cycles; Storybook axe/keyboard checks.

### INF-53. Motion: build the pinned fragrance collection and drifting typography

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-52

**Deliverable:** A Storybook-approved collection sequence using real source-owned fragrance names and imagery, with an accessible static/touch alternative.

**Files and surfaces:**

- src/components/motion/fragrance-journey.tsx (new)
- src/components/motion/fragrance-journey.stories.tsx (new)
- src/components/motion/fragrance-journey.test.tsx (new)
- src/components/ui/product-card.tsx (reuse)

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Implement approved collection composition and scroll mapping; vertical scrolling advances the horizontal imagery track on eligible desktop layouts, then releases cleanly in both directions.
- [ ] Place decorative oversized fragrance names behind photography using approved tokens, DOM text and aria-hidden duplicate labels. Foreground headings/links retain accessible names and AA contrast. Stop background motion when scroll stops unless a separately approved paused loop exists.
- [ ] Use layout-measured travel distance and refresh after fonts/images/resize. Disable pinning when available height cannot show content comfortably; 320/390 widths and touch get the approved static stack or native swipe gallery with visible controls.
- [ ] Keep all products reachable by keyboard, reveal an offscreen focused card and provide a visible skip-past-sequence link. No focus trapping, hidden purchasable links or movement of the primary purchase target.
- [ ] Preserve source image fit/bottle visibility and current card commerce states. Handle 0/1/6 products, sold out/unavailable, long names, missing images and resized orientation without blank page gaps or horizontal document overflow.
- [ ] Attach resting/midpoint/exit comparisons and forward/reverse recordings for Devon's component acceptance before template integration.

**Verification:** Vitest for 0/1/6-item fallback/content semantics; Playwright/Storybook browser tests for pin entry/exit/reversal, skip link, focus on later cards, resize, image decode, short screens and reduced motion. No live route wiring yet.

### INF-54. Motion: build the approved hero entrance and pointer atmosphere

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-52

**Deliverable:** Approved hero motion that works with the existing three-slide editorial carousel and preserves its controls and image geometry.

**Files and surfaces:**

- src/components/hero-carousel.tsx
- src/components/hero-carousel-editorial.stories.tsx
- src/components/hero-carousel-editorial.test.tsx
- src/components/motion/hero-atmosphere.tsx (new only if selected)

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Implement only the effects selected in studies: coordinated entrance plus optional reed-shadow/decorative depth. If Devon rejects pointer depth, record that disposition and deliver the selected entrance alone.
- [ ] Keep the current three-slide content, 5:4 contain imagery, full bottle visibility, header/announcement geometry and approved 600ms directional carousel transition unless the studies explicitly approve changes.
- [ ] Compose entrance/atmosphere on separate wrappers to avoid overriding carousel translation. Do not delay the main image load or hide the CTA until a long animation completes.
- [ ] Preserve six-second autoplay and existing pause on focus/manual navigation, hidden/offscreen, reduced motion, save-data and loading. Pointer tracking is bounded to fine-pointer hover devices and stops on exit, offscreen and hidden tabs.
- [ ] Provide static/reduced-motion and interruption stories including rapid Previous/Next, pause/resume, touch swipe, keyboard and long copy. Synchronize any approved changed contract with Figma/DESIGN.md.

**Verification:** Existing carousel unit/Storybook regressions plus editorial-carousel browser suite; prove interaction interruption cannot leave mixed slides, invisible content, duplicate announcements or a permanently running pointer loop.

### INF-55. Motion: build sticky About chapters and photographic transitions

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-52

**Deliverable:** A Storybook-approved About storytelling composition using the existing four campaign photographs, complete Born copy and working GalleryViewer.

**Files and surfaces:**

- src/components/motion/story-chapters.tsx (new)
- src/components/motion/story-chapters.stories.tsx (new)
- src/components/templates/combined-about.tsx
- src/components/templates/combined-about.stories.tsx
- src/components/gallery-viewer.tsx (preserve API)

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Build the approved sticky image/chapter relationship and photographic transition using the current campaign roles and source captions. Use CSS sticky when sufficient; GSAP coordinates only the approved sequence.
- [ ] Preserve full Born text, existing editorial chapters, existing viewer opening/closing, alt text and access to uncropped source photography. Do not invent scent, care or provenance claims.
- [ ] Remove sticky/pinned behavior for touch/short-height/reduced-motion layouts where required by the approved contract; render readable static chapters with full content.
- [ ] Keep viewer focus return and body scroll restoration correct when opened halfway through the sequence. Missing campaign figures, long copy, single figure and unloaded images must not create empty held panels.
- [ ] Record the boundary with INF-37: this task delivers motion only; it does not complete or duplicate the separate GalleryViewer redesign. Live About integration remains after INF-36, preserving the existing after-shopping milestone gate.

**Verification:** Storybook keyboard/axe plus About/Gallery browser regressions for viewer opening at mid-scroll, close/focus restoration, long text, missing imagery and reduced motion. Record exact visual differences.

### INF-56. Motion: integrate approved Home and About templates in preview

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-53, INF-54, INF-55, INF-36

**Deliverable:** A named preview with approved components integrated into actual pages and an immediately usable static fallback.

**Files and surfaces:**

- src/components/templates/home-content.tsx
- src/components/templates/combined-about.tsx
- src/components/templates/storefront-templates.stories.tsx
- src/components/templates/combined-about.stories.tsx
- src/app/(website)/page.tsx
- src/app/(website)/about/page.tsx
- src/components/ui/scroll-reveal-controller.tsx (only if affected)
- tests/e2e/homepage.spec.ts
- tests/e2e/about.spec.ts
- tests/e2e/editorial-carousel.spec.ts
- tests/e2e/storefront-motion.spec.ts (new)

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Start only after component acceptance and INF-36 shopping-release review; advance isolated design/studies earlier without changing launch priority or adding motion as a launch blocker.
- [ ] Wire approved components through the existing templates using existing Shopify/Sanity contracts; keep source data outside animation code. No schema/content publication in this scope.
- [ ] Replace overlapping reveal wrappers only on selected sections. Preserve all existing sections, routes, commerce semantics, announcement/navigation, footer and direct Shop links unless the final design explicitly approves a change.
- [ ] Keep one delivery branch/PR, route-scoped lazy motion loading and a documented static rendering path. Record a last-known-good base and how to revert motion without removing content.
- [ ] Verify client navigation/back-forward/deep links, resize/orientation, late font/image decode, sticky header offsets, menu/viewer scroll lock and initial script failure.
- [ ] Compare integrated pages and Storybook at 1440/768/390/320, record videos and design differences, and run proportional checks plus full CI. No production promotion at this stage.

**Verification:** Playwright motion, Home, About, Gallery, carousel, navigation, cart and account smoke; JS-disabled and module-failure fallback; keyboard/reduced-motion/axe/overflow at four widths. Existing checkout remains unchanged and any fixture smoke is not real-provider acceptance.

### INF-57. Motion: verify accessibility, performance and release evidence

**Owner:** Devon Taft

**Initial state:** Backlog

**Depends on:** INF-56, INF-47

**Deliverable:** Independent review, human visual acceptance and merge, then recorded production motion smoke with rollback evidence.

**Files and surfaces:**

- docs/evidence/storefront-motion/ (new evidence index)
- docs/features/storefront-motion-brief.md
- docs/planning/roadmap.md
- tests/e2e/storefront-motion.spec.ts

New filenames are proposed ownership locations; finalize their public APIs in
the study handoff before production implementation.

**Actions and acceptance:**

- [ ] Devon coordinates an independent read-only reviewer against the exact preview commit. Audit approved Figma/Storybook/video comparisons and resolve or explicitly disposition every deviation; the implementer's own screenshots alone are insufficient.
- [ ] Complete Chromium/WebKit/Firefox coverage where supported, physical iPhone Safari/Chrome and a representative Android check. Consume INF-47 physical-device result before release and prove no footer gap, scroll trapping or content clipping with browser chrome/keyboard/rotation.
- [ ] Exercise reduced motion both initially and while open, keyboard/skip/focus, 200% zoom/reflow, no JS/import failure, long/missing/empty content, reverse scrolling, rapid route transitions and hidden/offscreen pause.
- [ ] Measure five comparable baseline/candidate mobile runs and a scroll trace with the agreed study budgets. Record JS/image deltas, LCP/CLS and interaction latency/frame intervals. Distinguish lab evidence from field Core Web Vitals; no unmeasured 60fps claim.
- [ ] Run required lint/types/Vitest/Storybook/build/Playwright checks and exact-head pnpm pr:gate. Attach Vercel preview/health, recordings, risks, static fallback and named rollback target. Devon gives visual acceptance and human merge; no agent merge or direct production deployment.
- [ ] After the authorized merge, verify production health, Home/About forward/reverse motion, mobile static mode, reduced motion, Shop/product/cart links and account/navigation continuity. Mark Done only with recorded post-merge evidence; retain all unrelated commercial/content gates.

**Verification:** Full required CI and pr:gate plus independent visual/accessibility/performance/device evidence. Production checks only after human merge; no paid checkout or live-payment changes.

## Verification commands and evidence

For each implementation task, run the tests that exercise its behavior; do not
write tests that merely mirror styling values. Focused suite examples after the
new files exist:

```sh
corepack pnpm exec vitest run --config vitest.config.ts src/components/motion
corepack pnpm test:stories
corepack pnpm exec playwright test tests/e2e/storefront-motion.spec.ts
corepack pnpm exec playwright test tests/e2e/editorial-carousel.spec.ts tests/e2e/about.spec.ts tests/e2e/gallery.spec.ts
corepack pnpm check
corepack pnpm test:e2e
corepack pnpm pr:gate <actual-PR-number>
```

A successful local check does not substitute for the exact PR head's required
GitHub quality result. Attach environment/profile, baseline and candidate commit,
raw measurements, four-width comparisons, motion recordings, failures and their
disposition. Re-run only when a new change, failure or unresolved concern requires it.

For this planning-only change: format the two new documents and roadmap, run
git diff --check, read back created Plane tasks/owners/states/parent/dependencies,
and confirm the dependency graph has no cycle. No animation runtime has changed,
so no animation acceptance or performance result is claimed.

## Definition of done and rollback

All selected effects satisfy the accepted study contract; source-of-truth layers
are synchronized; required checks and independent review pass; Devon accepts
the exact preview and merges; production smoke is recorded. Work that is deferred
or rejected has an explicit disposition. The parent closes only after its selected
children close and the production evidence exists.

A named pre-motion commit and a static content path are retained. Failed motion
must not hide content. Rollback/promotion follows docs/operations.md; planning
authorizes neither. Preserve Payfast Test mode and existing content/commercial gates.
