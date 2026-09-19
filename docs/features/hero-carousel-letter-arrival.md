# Hero carousel letter arrival — 19 September 2026

Devon approved a headline-led transition: letters enter straight from the right,
with a small stagger and deceleration; the image follows almost immediately with
one soft pulse. In a follow-up Devon requested that the outgoing letters start
left just before the next slide enters, giving the sequence continuity.
Supporting copy and the CTA settle afterward. PR109 delivered the initial
choreography. After merging it, Devon requested a separate PR for the faster
sequence and smooth description fade documented below. This remains a scoped
refinement of the approved Home motion; physical-device and remaining INF-57
acceptance gates are unchanged.

## Contract

- The first server-rendered campaign stays visible. Do not delay its image load,
  split its heading on initial render, or add an entrance that postpones LCP.
- Desktop, tablet and mobile slide changes use a single GSAP timeline. Outgoing letters
  travel 24px left over 180ms with a 40ms total stagger and fade. Incoming letters
  start 60ms later, overlapping the departure rather than waiting for a blank frame.
  Incoming letters
  travel 36px horizontally from the right over 400ms, with a total stagger capped
  at 120ms and power2.out easing. Previous as well as Next uses that approved
  right-side letter arrival; the legacy fallback keeps its directional slide.
- Devon requested a longer stretch and more letter spacing. Add up to 2.5px of
  visual tracking per character, capped at 48px extra spread per line. Use
  individual transforms so original line breaks and settled typography remain
  unchanged; restart spacing at each wrapped line.
- The campaign image starts 40ms after the first letters: opacity 0 to 1 and
  scale 0.98 to 1.01 over 220ms, then scale 1 over 180ms. The containing layout
  stays stable and retains the full image in its existing 5:4 contain frame.
- The CTA appears immediately when the title settles at 580ms. The entire
  description fades from opacity 0 to 1 over 320ms with sine.out easing, starting
  at that same moment with no extra pause. Preserve native text shaping and
  line breaks: never split or stagger description letters or lines. No movement,
  colour change or blink. Total sequence: 900ms at every description length.
  Devon rejected the earlier row-by-row reveal as abrupt and reported a left
  snap when split glyphs returned to native typography; the intact fade fixes both.
- The outgoing image and supporting content fade over 140ms, starting at 40ms.
  Only the selected campaign is available
  to assistive technology and keyboard navigation.
- GSAP and SplitText are deferred until initial preferences are known and the
  user has not requested reduced motion or data saving. No extra animation library is
  added. Pointer smoothing remains owned by HeroAtmosphere on another element.
- The description remains one native, accessible paragraph throughout. Do not
  add a duplicate screen-reader copy or temporary paragraph ARIA label.
- SplitText supplies the full heading accessible name during the stagger and is
  reverted on completion, interruption, resize, preference changes and unmount.
  Focus entering the incoming content completes the sequence immediately so
  keyboard users never land on an invisible CTA.
  Heading changes use keyed nodes so cleanup cannot overwrite replacement copy.
- Preserve six-second autoplay, manual/focus pause, hover, hidden/offscreen
  handling, controls, announcements, swipe, fallback copy and media failure.
  MotionBoundary's pause also disables the enhanced carousel sequence.
- Devon explicitly extended this carousel choreography to mobile and touch.
  Its own eligibility query is independent of the desktop-only scroll/pointer
  scenes. Preserve swipe and manual controls at every width.
- Reduced motion and save-data use immediate readable content without new GSAP
  imports. Import failure retains the existing CSS transition. Empty/single
  slide behavior is unchanged.

## Delivery and synchronization

| Layer                                           | Status                                                                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Figma Home 2349:2/104/207/301, Approved 2004:14 | Static layout authority retained. Letter/image timing is Devon's explicitly approved divergence; no Figma frame was silently replaced.                      |
| DESIGN.md and .impeccable/design.json           | Same dated motion contract recorded.                                                                                                                        |
| Runtime                                         | Shared carouselMotion values in src/lib/motion/carousel-transition.ts; existing colors/type/spacing retained.                                               |
| Components                                      | HeroCarousel changes behind animateContent; independently owned choreography hook and CSS module.                                                           |
| Storybook                                       | Motion/Hero carousel: letter arrival, rapid navigation, reduced motion, save data, mobile, narrow mobile, long headline, missing image, description reveal. |
| Home                                            | HomeContent opts in through its existing motionEnabled contract after component verification.                                                               |

## Verification

Behavioral tests first failed because no letter movement or image pulse existed,
then passed against real GSAP timelines. They cover horizontal stagger before
image arrival, outgoing-left precedence and overlap, final scale/visibility,
reversible cleanup of both headings and bounded
duration with 180 letters. A real navigator.connection.saveData browser test
also reproduced an initial import race before the readiness guard was applied.

Browser coverage exercises the actual fixture carousel, a frame-by-frame
sequence sample, rapid forward/reverse controls, resize, live reduced motion,
normal laptop dimensions, mobile widths, original carousel behavior and axe.
Storybook uses the site's actual fonts and published campaign imagery snapshot.

Evidence and final check results are recorded in
[the evidence folder](../evidence/carousel-choreography/README.md).
This change does not claim the existing full-route no-JavaScript limitation is
resolved, and physical Safari/iPhone acceptance remains a human gate.

Rollback: remove HomeContent's animateContent opt-in to restore the previous
carousel transition without changing source content or the independent backdrop.
