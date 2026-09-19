# Independent motion code review

Reviewed snapshot: `67de810..3ba4c8e` on `agent/storefront-motion-delivery`.
Read-only repository review; no repository files changed, no additional agents spawned, and no test suite repeated. Narrow browser probes used the existing candidate server at `http://127.0.0.1:3100`. Review authority includes the approved motion preview spec, execution plan, evidence ledger, project ownership rules, and delegated G1–G3 approval scope.

## Findings, ordered by severity

### P2 — Closing a motion-enabled About photograph changes the reading position

Location: `src/components/motion/story-chapters.tsx:26–39`, integrated by `src/components/templates/combined-about.tsx:105–114`. Existing focus restoration in `src/components/gallery-viewer.tsx:268–272` needs to account for the new sticky/transformed composition.

At 1440×1000, all four chapters have active motion. Scroll the principles photograph into view, click its visible center, and close with Escape. In a direct Chromium mouse probe, the photograph was entirely visible at x180/y289 with size400×400. Scroll position was1727 before opening and while open, then2239 after closing: a512px jump. Focus correctly returned to the photograph. With reduced motion, the same interaction kept1159 before/open/after. This is a motion-specific regression against the explicit gallery interruption/scroll-restoration acceptance criterion.

The existing `onCloseAutoFocus` calls `focus()` without `preventScroll`; the implementation should preserve the prior reading position while restoring focus under the active chapter layout. Do not merely change the test expectation to allow the jump.

Regression coverage currently misses the defect: `tests/e2e/storefront-motion.spec.ts:101–117` uses default Desktop Chrome1280×720, below the800px motion eligibility threshold, and asserts only focus/dialog state. Run this journey at an eligible viewport, assert active chapter effects, and compare pre/post-close scroll position.

### P2 — The collection can retain a partially clipped keyboard-focused product

Location: `src/components/motion/fragrance-journey.tsx:77–80`.

The focus guard compares card bounds with0 and `window.innerWidth`, but cards are actually clipped by `[data-motion-viewport]`, inset64px from each side at1440px. Therefore a card can fit inside the browser window and still be clipped inside the collection. `overflow: clip` cannot scroll that clipped content into view automatically.

Reproduction at1440×1000: wait for the collection pin, scroll to933 (collection document top1044 minus header offset146 plus35), then focus the first product. Its bounds are left33/right421; its clipping viewport is left64/right1376. Motion remains active with one pin, leaving31px of the focused card and focus indication clipped. This is a real case during reverse scrolling or keyboard return to the first card, not just an artificial extreme.

Compare with the actual clipping viewport bounds (including sufficient focus-ring clearance), then restore natural flow before scrolling the target into view. Cover a partially clipped first and/or last card during active travel; the current test focuses a completely offscreen last card and only checks browser-window bounds.

### P2 — Failed setup does not restore the static layout after manual mutations

Locations: `src/components/motion/motion-boundary.tsx:78–85`, `src/components/motion/fragrance-journey.tsx:34–67`, and `src/components/motion/story-chapters.tsx:15–45`.

The catch block calls `media.revert()`, which reverts registered GSAP effects. Collection setup first assigns `data-motion-active`, and chapter setup first assigns the custom top property and chapter attributes. Their non-GSAP cleanup functions are registered only when the entire setup callback returns successfully. An exception after the first mutation prevents that return; `media.revert()` cannot remove those manually applied attributes/styles. The collection then retains a clipped horizontal track without its working scrolling animation, making later products unavailable by ordinary vertical scrolling.

Confirmed with a narrow fault-injection probe using the exact committed FragranceJourney source, real installed GSAP matchMedia, and a timeline creation exception: after the surrounding catch/revert, `data-motion-active` remained `"true"`. This is separate from import failure, whose static behavior is sound.

Register cleanup before effect acquisition, or make setup locally exception-safe and explicitly roll back partial mutations. Add a setup-failure test that throws after layout activation and asserts static classes/attributes, owned triggers/spacers, and listeners are restored. Existing unit tests cover import rejection and deferred cancellation but do not exercise partial setup failure.

## Spec compliance verdict

**Not yet compliant with the complete runtime acceptance contract at3ba4c8e.** The three findings above need corrections. The candidate remains within the authorized single-branch preview scope and respects the final human visual review/merge gates.

- Deferred imports: cancellation before completion is guarded; a canceled generation cannot call its DOM mount. Exactly-once cleanup is covered by meaningful helper tests.
- Normal lifecycle: scoped matchMedia reversion, preference/breakpoint rebuilds, listeners and resize/font/image scheduling are present. No global kill-all usage. The existing targeted results support normal pin removal and route remount behavior, without proving partial setup rollback.
- Product availability: all supplied cards remain in the DOM; empty/single cases avoid pinning; source names/prices remain props. The actual content-height check rejects an over-tall collection after activating its measured row layout. Keyboard clipping still has the edge-case defect above.
- Responsive/reduced/save-data: heavy GSAP imports are gated by the fine-pointer/hover/1024×800/no-reduced-motion query and save-data check. Static grid and chapter markup remain available when enhancement is ineligible.
- Pointer work: the rAF loop settles, observes intersection, and stops on pointer leave, focus, visibility change and cleanup. The decorative background is separate from carousel transforms. No continuous idle loop was introduced.
- About: four chapters, full text, gallery API and source images are retained. Sticky composition causes the reproduced scroll-restoration regression.
- Server/client and secrets: route fetch/personalization architecture is unchanged; Shopify remains commerce truth, Sanity editorial truth. Client motion receives normalized props. No new credentials, private fetches, or server-only modules were introduced into motion components.
- Storybook: cinematic/restrained/empty/single/long/missing imagery/mobile and integrated Home/About stories exist; unchanged template defaults remain static. Story interaction assertions are mostly content checks and do not independently prove pin, pointer, gallery-interruption, or failure behavior.

The no-JavaScript route requirement is **not met**: both baseline67de810 and candidate Home/About have a pre-existing full-page async Suspense streaming limitation. The expected-failure test at `tests/e2e/storefront-motion.spec.ts:119–145` records rather than fixes it. This is not a branch regression, and preserving the cache/personalization architecture is reasonable for the explicitly narrowed preview delivery, but neither a green suite with the expected failure nor visible static component HTML establishes full-route no-JS acceptance. The whole original spec must not be described as fully passed. The failure stops the loop on Home, so that one test also does not independently establish About's behavior; existing separate browser evidence is needed for both.

## Task quality verdict

**Changes requested before declaring the preview runtime ready.** The implementation is focused and largely maintains ownership and interaction boundaries, with useful native-scroll fallbacks, semantic tokens and explicit evidence limitations. The main quality gap is testing the easiest lifecycle states while missing partially clipped focus, an actual motion-enabled gallery interruption, and partial setup rollback.

No severity-one security/data-loss issue was found. No style-only requests or new design direction are proposed. The known no-JS baseline limitation should remain an explicit residual acceptance item, with final user preview review, physical-device acceptance and production merge/smoke still open.

## Verification performed by this reviewer

- Inspected committed whole-branch diff, motion runtime/components/styles, integration, relevant primitives/gallery/navigation, tests, stories, spec/plan/evidence and ownership guidance.
- Confirmed keyboard clipping in existing local candidate with actual DOM bounds and retained pin.
- Confirmed gallery motion scroll jump using a real visible-center mouse click, with reduced-motion control comparison; focus returned in both cases.
- Confirmed partial-setup failure attribute leakage through exact-source isolated fault injection and installed GSAP.
- Did not rerun the full suite or claim exact-head CI/preview/performance gates passed. Those gates were still owned by the implementation/coordinating agent at review time.

# Scoped rereview of `1a66bf4` (first fix pass)

Reviewed `3ba4c8e..1a66bf4` only for the three original P2 findings and related regressions. At this pass, `/tmp/motion-implementation-report.md` was not yet present. Full suite results reported by the coordinator were not rerun independently.

- **Keyboard clipping: resolved.** The comparison now uses the actual clipping viewport with inset clearance. Repeating the exact first-card probe yielded x33 before focus, then x64 with zero pin spacers after focus, preserving focus and exposing the card. An active-pin partial-first-card regression test was added.
- **Partial setup rollback: resolved for the reported collection/chapter layout mutations.** Both components register manual cleanup before mutations; the surrounding catch executes it after GSAP reversion. The new unit test injects failure after manual layout activation and checks attribute removal and reversion. These cleanups are idempotent; their normal double invocation does not create a material issue.
- **Gallery scroll restoration: still open, P2.** Despite the loaded `preventScroll:true` fix, actual-source Chromium at1440×1000 still jumps. The exact visible-center click probe starts with the principles image fully visible at x180/y289.4/w400/h400 and scrollY1727. Immediate Escape leaves scrollY2239 after400ms. Allowing400ms with the viewer open shows it has already shifted to2239; closing then reaches3007 after400ms. Intercepting `HTMLElement.prototype.focus` confirms the opener receives `{preventScroll:true}`, so this is not stale loaded gallery code. The close control's opening autoFocus has no options. The original finding therefore extends to movement during the interruption as well as after it. Exact probe was delivered to the sole implementation writer for diagnosis.

**Scoped verdict at1a66bf4: changes still requested for the real-source gallery interruption.** No additional unrelated design or implementation work requested. The original no-JavaScript route limitation remains an explicitly unmet baseline acceptance item; no claim of full original-spec compliance is made.

# Scoped gallery rereview after dimension-signature guard

Reviewed the working-tree change to `src/components/motion/motion-boundary.tsx` after1a66bf4 and its gallery regression test. Scope excludes the concurrent laptop sizing/pointer tuning, which the coordinator is verifying separately.

**Remaining gallery P2 resolved in the reviewed working tree.** Repeated the original actual-source3100 Chromium1440×1000 reproduction: principles photograph fully visible at x180/y289.4/w400/h400; native mouse click at its center;600ms dwell open; Escape;600ms dwell closed. ScrollY remained1727 before/open/after, opener regained focus, and all four motion chapters stayed active.

The guard compares element/track/photograph dimensions before responding to load/font events, so unchanged cached thumbnail load events no longer tear down and recreate the sticky chapter layout. Changed dimensions still schedule a rebuild, and viewport resize remains an unconditional rebuild trigger. No material regression found in this scoped check. The strengthened deterministic Storybook journey uses a native center click and waits while open and after close before asserting scroll position.

**Scoped final verdict: all three original P2 findings resolved; no remaining material issue in their reviewed fix scope.** This accepts those runtime fixes for preview, not the entire concurrent branch or production readiness. Full CI/current-commit and laptop/performance verification remain coordinator-owned. The known baseline no-JavaScript full-route requirement remains unmet and explicitly disclosed.

## Read-only reviewer acceptance record

Reviewer: Codex independent quality reviewer `/root/motion_code_review`.
Acceptance: **the narrowed preview fixes for all three original P2 findings are accepted**, subject to final commit/CI verification and the explicitly retained no-JavaScript baseline limitation. This is not production approval or sign-off on subsequent unrelated tuning.

Reviewed committed fixes: `1a66bf4269fa5717c15bf518fc11bfb28040b73f`.
Final gallery guard commit: pending at review time. SHA-256 of `git diff 1a66bf4 -- src/components/motion/motion-boundary.tsx`: `d88b76566957b788714dc138df4cb80762f9d47a4ef2075841457cc5b9eb6a05`.

No repository files were edited by this reviewer. The reproduction history above preserves why the first gallery fix was insufficient and the evidence supporting the final scoped acceptance.
