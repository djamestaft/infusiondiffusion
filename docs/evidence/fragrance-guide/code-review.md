# INF-58 independent code review

Reviewer: Codex `/root/motion_code_review`, read-only repository lane. Scope: optional-image data commit27578b7 and uncommitted guide implementation againstcdc47e9, including the consultation/controller, native controls, motion, results, shared HeroAtmosphere extension, scoped CSS, stories and tests. No repository writes, extra agents or suite reruns. Existing local3100 used for narrow real-source browser probes.

## Finding

### P2 — Guide keyboard focus does not suspend decorative pointer motion

Locations: `src/components/templates/fragrance-guide-motion.tsx:100–105` and `src/components/motion/hero-atmosphere.tsx` focus listener/activeElement containment.

GuideAtmosphere places HeroAtmosphere around only its aria-hidden sidebar. Its focusin listener and `element.contains(document.activeElement)` guard consequently cannot observe the native answer inputs in the sibling question panel. The sidebar continues pointer animation during keyboard answer selection, contrary to brief acceptance6 (keyboard focus stops owned background work).

Confirmed Chromium1440×900 against real-source3100: focus Bedroom, move pointer inside the sidebar to(350,550), and the decorative topic word acquires translate(1.84748,.759834) while Bedroom remains focused. Move again and press ArrowDown: focus correctly changes to Entrance, but the running pose continues from(2.24,.840079) to(2.59994,.998411) over the following100ms. This is not a stale-focus-in-removed-panel defect; the live sibling control is correctly focused while unrelated decorative movement continues.

Use a guide-wide focus scope or equivalent coordination for the guide variant while keeping pointer ownership on its sidebar and preserving the existing Home default. Add a sibling-control focus regression; the existing HeroAtmosphere tests put the focusable control inside the effect's own wrapper and therefore cannot catch this integration defect.

Root has accepted the finding and owns the correction; independent fix rereview remains pending.

## Verification issue

The newly added browser journey currently uses `.check()`/`.click()` directly on native `sr-only` inputs. A separate1280×720 probe of Bedroom `.check()` timed out because the visible label span intercepts the pointer over the1px input; repeated automatic scrolling also encounters the sticky header. This is a test-target issue, not a customer click failure: clicking the visible label works correctly. Exercise the visible label or keyboard focus+Space and retain checked-state assertions, without `force:true`. Root was notified because several current E2E checkbox/radio lines use the same target pattern.

## Verified behavior and ownership

- Real-source1280×720 journey through visible labels passed: Begin; Bedroom; rapid Continue double-click stopped on the unanswered Feeling question with exactly one group and a live input focused; completed Feeling; chose Amber&vanilla plus Spice&woods; third Spa-like calm attempt was rejected with the correct recoverable message; completed Presence/Time; received the three authentic products in matcher order; results heading focused; no horizontal overflow.
- Observed result order and current Shopify titles: Blanc De Blanc-200ml, Noir De La Nuit-200ml, Ambre Egyptian-200ml. Links preserve existing source handles under `/products/`. No invented ranking percentage or product facts introduced.
- Editing notes removed the old results immediately, restored the populated Notes panel and focused its current heading. State updates do not wait for animations. Only one question's controls mount; transition cleanup uses the established cancellable import/scoped reversion utility.
- Room/Feeling/Notes/Presence/Time labels and choices are retained. Initial answers are filtered/deduplicated/capped. Each step validates before advancing, all answers validate before final submission, and callback values are copied.
- Optional product photography maps only existing Shopify featuredImage through the server-only catalog boundary. Matcher logic/order/reasons/ties/availability are unchanged. New data tests compare complete normalized shape and photo/no-photo matching equivalence.
- Null catalog and empty catalog remain distinct. Both preserve editable preferences and collection exit links. Missing images leave complete text links; image error removes the image/column, preserving reasons and availability. The new failure test asserts the same link survives.
- Motion touches decorative topic words and marked heading/copy/media, not native answer hit areas. Home's pointer defaults and entrance default are preserved by the optional configuration extension. Desktop imports retain cancellable ownership; mobile short transitions use CSS instead of importing heavy motion chunks.
- Reduced motion, explicit pause and initial save-data preference suppress the relevant enhancements. Pointer lifecycle and route cleanup reuse the previously reviewed utility. The reported keyboard focus integration is the exception needing correction.
- Stories cover intro, each question, selected notes, validation, results, unavailable/empty source, one/two/three results, missing/failed imagery, sold-out and long titles, phone/narrow widths. Story controls retain native keyboard behavior. Full current-head integration/CI and deployed checks remain root-owned and were not inferred from the reported30story pass.

## Initial verdict

Changes requested for the one material keyboard-motion finding. No additional material progression, matching/source-authenticity, secret exposure, Server/Client ownership, image-fallback or stale-result regression found in this scoped review. The known full-route no-JavaScript limitation remains separate and must not be called passed by static component fallback evidence.

# Scoped fix and user-steering rereview

Reviewer `/root/motion_code_review`, read-only. Reviewed the uncommitted guide files after27578b7, including the optional focusScope fix, newly requested Reset guide, stronger step/answer transitions and removal of programmatically focused title outlines. The later user instruction authorizes those visual/interaction changes; it supersedes earlier timing/heading-outline details without removing native control focus treatment.

**The original P2 is resolved; no remaining material finding in the reviewed preview implementation.**

Independent Chromium1440×900 actual-source3100 checks:

- Started decorative LERP with no focused guide descendant, observed translate(1.55723,.455713), then focused Bedroom. Inline motion cleared immediately. Subsequent pointer movement over the sidebar did not restart it while the sibling radio retained focus.
- Reset from Feeling after answered Room/Feeling: returned to the introduction, focused its heading, and left zero answer inputs and zero sidebar backdrop nodes. Begin again had zero checked answers and current Room heading focus.
- Completed all five questions, then Reset from results: previous result region removed and introduction restored.
- Rapid Continue then Back during the stronger transition left exactly one Room question group with its current heading focused. No focus remained in removed content.
- Toggling reduced motion during the active step transition cleared heading inline transform and yielded computed transform none.

Code inspection confirms that the guide passes its complete consultation ref while HeroAtmosphere defaults to its own wrapper for existing Home usage. Focus registration and cleanup use the same captured focus element; pointer listeners stay on the decorative sidebar. The added regression starts actual mock-rAF work, focuses an external scoped input, asserts pose cleanup/no queued frame, and prevents pointer restart. Reset clears answers/error/reviewed/started/current question/direction; it does not submit or retain old recommendations. Stronger animations target text and decorative content, keeping native controls immediately active and at stable hit areas; the existing scoped motion lifecycle cancels abandoned transitions. The visible-label E2E changes address the previously reported sr-only pointer-target problem.

## Reviewed working-tree fingerprint

HEAD at review: `27578b7deb1c0c2095d711d81fcb1aca8981af74`; final implementation commit pending. SHA-256 file fingerprints include untracked files (which a plain git diff would omit):

| File                             | SHA-256                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| fragrance-guide-consultation.tsx | d18cfa2e004d900a4b682fa370a59cb61ef83262efd70426791f33a39d5bee04 |
| fragrance-guide-motion.tsx       | 0f67b088940e5c877df924fc4af966543fbcd9960dfa0a6dadd45266b759e524 |
| fragrance-guide-results.tsx      | a7d3ea038859c6b653925141920416f9f2b6d6db6dd7f953e32948ee5acbf642 |
| fragrance-guide-controls.tsx     | b4b9ae6a26bfc6f1c951df98f54d0336e36c025f26be35b6e4c40841f4b131cc |
| motion/hero-atmosphere.tsx       | d497ee214e43cb5da17a6fd8f9e2688497dfc718c660900089a26283f6b46960 |
| app/globals.css                  | fa699e75a3951e060fbbc4391b21b9ad58e1e194b170e4dfd5f02968523d51b4 |

**Final scoped verdict: accepted for preview on code/functional review.** Exact-commit full gates, final deployed/cross-browser evidence and final human visual review remain root-owned. This is not production approval, and the existing full-route no-JavaScript limitation remains explicitly unmet. No repository files were edited by this reviewer.
