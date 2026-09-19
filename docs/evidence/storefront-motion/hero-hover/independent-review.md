# Independent hero-hover investigation

Reviewer: `/root/motion_code_review`; read-only repository inspection and browser instrumentation. Baseline inspected: `d64622c`. Existing local server: `http://127.0.0.1:3100`.

## Additional confirmed reset beyond ordinary pointerleave

`src/components/motion/motion-boundary.tsx:71–82,120–125` records hero `scrollWidth` in its layout signature. HeroAtmosphere writes `translate3d(...) scale(1.04)` to the backdrop. That transformed overflow changes the outer hero's `scrollWidth` even when its actual layout dimensions are unchanged. The next captured image-load event consequently schedules a teardown/rebuild, whose cleanup clears the hero transform and resets x/y.

Chromium1440×800 measurements:

- Initial hero offsetWidth/offsetHeight/scrollWidth:1440/800/1440.
- Active backdrop translate(6.48px,-5.39px)scale1.04:1440/800/1475.
- Continuous6second pointer sweep entirely inside the hero, without pointerleave/focus: three IMGload events followed120ms later by transform removal. Stack confirms `useMotionEffect.rebuild → media.revert → HeroAtmosphere.stop`.
- Injecting a same-size backdrop `load` event after an established pose independently causes the same cleanup path. The actual image-load reproduction establishes that this is not only a synthetic event concern.

Correction should distinguish real geometry measurements from overflow caused by the owned visual transform. The collection still needs real track scrollWidth to measure travel.

## Other triggers inspected

- Actual eligible resize1440→1439 clears the pose through the unconditional resize rebuild. This is separate from crossing an ineligible breakpoint. Preserve intended geometry refresh while deciding whether eligible pointer pose must survive.
- Carousel hover pauses autoplay; the continuous-hover trace remained paused, so the observed reset was not an automatic slide advance.
- Focus-in, document visibility change, offscreen intersection and true teardown explicitly share the destructive stop function in the baseline. Their corrected behavior needs lifecycle verification; these are not additional accidentally discovered autonomous reset sources.
- Hero callback is stable and does not depend on carousel active index. Carousel rerender alone does not explicitly rerun the React motion effect, but its image-load events can trigger the faulty dimension signature path above.

Root agent received concrete evidence and owns the fix. Independent exact-navigation/lifecycle verification remains pending the corrected implementation.

# Independent correction review

Reviewer: `/root/motion_code_review`. The corrected working tree after `d64622c19c8f21a4857320bc25ca19856fb654f4` has **no remaining material finding in this scoped hover-reset review**. Root remains responsible for final commit/CI and the separate three-engine/laptop capture.

Reviewed runtime diff SHA-256 (`git diff d64622c -- src/components/motion/hero-atmosphere.tsx src/components/motion/motion-boundary.tsx src/app/globals.css`): `207bfa2cddc0120536ee64ca4c8630007312e408a2372317373bcba710cf0545`. Final commit pending at review time.

## Independent Chromium1440×800 evidence

- Before first hover: computed backdrop scale1.04 with no inline transform. First pointer movement retains the same scale.
- Continuous6.25second sweep entirely inside hero: actual IMGload events occurred, with zero transform-removal events. Established pose remained(4.3,-5.28),scale1.04.
- Additional synthetic cached-image load: same pose retained; no transform removal. This supplements the actual-load observation.
- Exact header-boundary crossing, using measured header bottom: pose immediately before leaving and after250ms over navigation remained identically(4.5,-8.52),scale1.04. Re-entry damped onward to(6.52287,-8.52), with no centered reset or scale toggle. Actual cached image loads during the crossing also did not reset it.
- Keyboard focus: inline translation removed, centered CSS crop retained at1.04.
- Scroll hero offscreen and back: pose remained frozen; no automatic movement appeared on return.
- Reduced-motion switch: inline motion cleared and computed scale returned to1. Re-enable returned the centered1.04 crop.
- Explicit View without motion: inline transform cleared and computed transform became none.
- Simulated `document.hidden` plus visibilitychange: pose remained unchanged over400ms. This tests the event handler, not real operating-system tab scheduling.
- RAF instrumentation identified the hero callback by its transform-writing body:45callbacks until settlement, still45after another400ms. No idle hero loop continued.
- Home→About: cached Home DOM remained hidden (`checkVisibility=false`), its owned inline transform was cleared, and hero callback count stayed45. Return Home retained one hero and the centered1.04 crop. This records actual cached-route behavior rather than incorrectly claiming the cached DOM node was removed.

## Code and coverage disposition

`pause()` cancels only RAF/timestamp bookkeeping; ordinary leave, hidden and offscreen transitions preserve the visible pose. Focus/teardown use a separate centering/reset path. The CSS media query and explicit paused marker establish a consistent initial crop and remove it when ineligible/reduced/paused. The measurement guard now tracks layout width/height for scope and photographs and reserves scrollWidth for the collection track, avoiding transform-induced measurement feedback while preserving intrinsic travel measurement.

The new unit test explicitly changes only scope overflow and asserts no reload/reversion, then changes actual height and asserts a rebuild. Normal resize retains its deliberate rebuild; it is not part of the continuous-hover/no-layout-change defect. No unrelated source ownership, secret, or Server/Client boundary changes were introduced.

**Acceptance:** the two confirmed hover-reset causes are resolved in the reviewed working tree. This is read-only, scoped preview acceptance, not production approval or a substitute for final exact-commit cross-browser verification. No repository files were edited by the reviewer.
