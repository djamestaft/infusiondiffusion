# Motion preview execution plan

**Goal:** Deliver INF-50–56 and the automatable preview-verification portion of
INF-57 in one reviewable Vercel branch.

**Spec:** ../specs/2026-09-19-motion-preview-design.md

**Architecture:** Existing content boundaries feed opt-in client motion wrappers.
Scoped, dynamically imported GSAP owns complex collection sequencing; CSS owns
sticky layout; a small time-based damping helper owns optional pointer response.
Default HTML stays visible. No commerce or source-content changes.

**Execution:** One implementation writer, sequential component delivery, independent
design capture and final read-only review. Codex makes intermediate decisions under
the user's explicit delegation and records any deviation. No per-phase user stops.

## Global constraints

Preserve all existing source facts, page sections, purchase paths and carousel
behavior. Existing semantic tokens and primitives are authoritative. No source
publication, production deployment or merge. Reduced-motion, touch, no-JS and
import failure must retain full usable content. One branch/PR. Preserve output/.

## Review focus

1. Async GSAP import completing after unmount must not create orphan triggers.
2. Keyboard focus on offscreen products must bring those products into view.
3. Short viewport/long text must disable pinning before content is clipped.
4. Gallery opening halfway through About must restore focus and scroll position.
5. Live reduced-motion/resize/route transitions must remove all owned spacers.

## Task 1 — Storyboard and isolated studies (INF-50/51)

- [x] Record exact Figma capture, design critique and selected contract in evidence.
- [x] Add real-imagery Storybook studies for restrained/cinematic collection,
      hero and About; static/touch/reduced-motion and content extremes.
- [x] Review stories with fonts ready before live integration. Document timing,
      measured pin distance, eligibility, damping and performance budget decisions.

## Task 2 — Foundations and composed components (INF-52–55)

Files: src/lib/motion/{damp,runtime}.ts as needed;
src/components/motion/{motion-boundary,fragrance-journey,hero-atmosphere,story-chapters}.tsx
and matching stories/tests; package.json/pnpm-lock.yaml; src/app/globals.css.

- [x] Write behavior tests first for damping equivalence/clamp, static output,
      preference changes and late import cleanup. Observe expected failure.
- [x] Implement small scoped lifecycle API and semantic motion tokens.
- [x] Compose ProductCard collection with measured travel, visible skip/static
      controls and keyboard-focus handling. Add 0/1/6 item/missing/long-content tests.
- [x] Add hero wrapper preserving the carousel's own transforms and controls.
- [x] Add About chapter wrapper preserving source figures and GalleryViewer API.
- [x] Run targeted unit and Storybook checks; record real results and self-review.

## Task 3 — Integrated preview (INF-56)

Files: HomeContent/HomeTemplate, CombinedAboutTemplate, live Home/About routes,
template stories and tests/e2e/storefront-motion.spec.ts.

- [x] Wire an explicit motion opt-in, preserving default static template stories.
- [x] Test forward/reverse pinning, skip/focus, responsive eligibility, paused,
      import failure, route/remount and gallery interruption cases in browser.
      Full-route no-JS remains an explicitly documented pre-existing exception.
- [x] Capture all four widths and fix observed visual defects as one batch.
- [x] Keep Shopify/Sanity inputs and existing carousel/gallery behavior intact.

## Task 4 — Evidence and delivery (INF-57 preview scope)

- [ ] Run formatting, lint, typecheck, unit, Storybook tests/build, Next build and
      relevant Playwright suites. Complete exact-head CI/pr:gate after push.
- [ ] Independent reviewer checks whole branch; fix material findings and verify.
- [ ] Push agent/storefront-motion-delivery and create one reviewable PR.
- [ ] Verify Vercel preview commit/health, Home/About screenshots and interactions.
- [ ] Compare baseline/candidate performance; record limitations and fallback.
- [ ] Update DESIGN.md, .impeccable/design.json, brief, roadmap and Plane with
      delivered scope and remaining final user/physical-device/production acceptance.

## Decision ledger

- User delegated G1–G3 decisions and authorized integrated preview before existing
  launch prerequisites finish. These prerequisites retain production significance.
- Treehouse capacity exhausted: one writer uses primary checkout on delivery branch;
  no existing tree is deleted or reused.
- Static Figma frames remain authoritative for brand/layout. New motion is a
  documented candidate divergence for the final review, not a silently edited approval.
- Main PR108 is merged at 67de810; earlier awaiting-merge wording is superseded.
