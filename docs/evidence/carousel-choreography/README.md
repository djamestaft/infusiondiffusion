# Carousel choreography evidence

## Smooth description fade — PR110 correction

Devon rejected the initial row-by-row reveal as abrupt and reported a slight
left snap. A character-range browser probe reproduced the shift: temporary
SplitText glyph wrappers changed native spacing and wrapping; cleanup moved the
first mobile glyph about 15px. The earlier settled-layout checks missed this.

The description now stays one native accessible paragraph. One opacity tween
fades it from 0 to 1 over 320ms with sine.out easing, immediately after the title
settles at 580ms. No character/line stagger, added pause, colour change or text
movement. The CTA appears at 580ms; the full sequence finishes at 900ms.
Headline letter motion and the image pulse retain their approved faster timing.

Current `smooth/` recordings and frame JSON cover long copy at 1440, 390 and
320px. Opacity increases continuously; the text rectangles remain identical
through the fade and cleanup, with zero measured glyph movement in the desktop
and mobile reproduction. There are no description child elements or temporary
ARIA attributes. Screenshots have no horizontal overflow or page errors.
The earlier `reveal/` artifacts show the rejected candidate, not this correction.

Local verification: lint and TypeScript, 444 unit tests, 418 Storybook checks,
Storybook/Next production builds, and all 33 applicable carousel browser checks
across Chromium, Firefox, WebKit, Pixel 7 and iPhone 13 emulation. The two
keyboard-only cases remain intentionally skipped in touch projects. Tests cover
continuous intermediate opacity, fixed description position, reversal, resize,
reduced motion, Save-Data and valid paragraph accessibility during animation.
Independent review confirmed Firefox interruption cleanup without residual
styles or browser errors. Exact deployment evidence is in PR110.

The single discrete CTA tween still avoids Firefox reversion ordering between
competing zero-duration sets. The paragraph needs no split-text accessibility
workaround because its text and semantics are never replaced.

## Merge-gate correction: Guide entrance overflow

At carousel head `5208b60`, CI passed 144 browser checks but the shared-shell
Account journey failed while visiting the fragrance guide at 390px. Its existing
32px mobile entrance moved text beyond the document edge. The containment fix
adds horizontal clipping to the consultation boundary. New 390/320px tests
measure the start pose and every frame, reproducing 398/332px before the fix
and passing at the viewport width afterward. The original Account journey also
passes. This correction leaves the visually approved carousel unchanged.
Devon approved the smooth carousel visually; merge remains gated on exact-head
CI and the PR gate.

## Historical PR109 evidence

User-approved follow-up to the motion candidate in PR #109. See
[the feature contract](../../features/hero-carousel-letter-arrival.md).

The component was implemented and inspected in Storybook before opting Home in.
Frame sampling confirmed outgoing letters moving left while incoming letters
remain invisible; the incoming letters start at220ms and the image at340ms.
The review refinement spreads letters by up to2.5px per character within each
line, with48px maximum extra spread and no text reflow. The title settles at1.25s.
Devon’s final pacing adjustment brings description and CTA in after a50ms pause,
starting at1.30s and1.38s, each fading in place over100ms. The full sequence ends
at1.48s. The included recordings/frame JSON capture the preceding600ms support
fade (2.1s total); composition, title motion and stationary support remain the
same. Current timeline and desktop/mobile browser checks verify the faster pace.
Image scale reaches1.01 and returns to1 before supporting content arrives.
The final heading is unsplit, visible and accessible. Screenshots at
1440/768/390/320 showed complete imagery and copy, preserved desktop alignment
and mobile centering, with no horizontal overflow. The intended visual change
is temporal; settled composition retains the existing design.

Local detailed artifacts: /tmp/inf-carousel-choreography, including the original
Storybook recording, frame-timing JSON and full-resolution responsive captures.
The images and recording here show the reviewed component sequence; the separate
hover-continuity fix is owned by pane 1 and retained as the integration base.

## Final local verification

The full regression results below were refreshed for9b0dd0f. Devon then set the
support fade to exactly100ms. That constant-only tuning re-runs29 relevant unit
tests,35 carousel Storybook tests and the live sequence/axe check in five browser
contexts (Chromium, Firefox, WebKit, Pixel7 and iPhone13 emulation), all passing.
Lint, typecheck and both builds also pass for the100ms candidate.

- Lint and TypeScript: pass.
- Vitest:433 tests across64 files pass, including real GSAP timeline assertions
  for outgoing precedence/overlap, horizontal entry, image timing, bounded
  long-text duration, per-line tracking reset/cap and reversible cleanup of both
  headings.
- Storybook:401 tests across34 files pass after the gold basket badge addition;
  production Storybook build passes.
- Next production build passes using the isolated .next-e2e output directory.
- Playwright: all6 choreography tests pass in each of Chromium, WebKit and
  Firefox (18 passes). Covers frame samples, rapid reversal, resize, reduced
  motion interruption, visible keyboard-focus interruption, real Save-Data import prevention and responsive geometry.
- Mobile emulation: five relevant tests each pass in Pixel7/Chromium and
  iPhone13/WebKit (10 more passes). The desktop keyboard traversal test is
  intentionally omitted from touch projects and verified in all three desktop
  engines. Mobile Storybook stories now exercise the same arrival sequence.
- Existing editorial carousel suite:14/14 Chromium checks passed before this
  isolated timeline refinement, including
  1900/1440/1280/1024/768/390/320, short screens, keyboard, autoplay and axe.
- Independent read-only review: no remaining findings. The reviewer independently
  checked outgoing precedence, rapid navigation/reversal, resize, reduced-motion
  interruption, plain-text/ARIA restoration and the Save-Data readiness guard.
  Touch swipes and immediate reverse swipes at320px and390px also preserve long
  headline wrapping/height and restore split text correctly without overflow.
- Integration base: pane1's cdc47e9, including its hover-continuity correction.
  No hover or fragrance-guide implementation was edited by this follow-up.

The first browser run exposed an initial preference/import race; waiting for
preference readiness fixes it, with a regression test. Reduced-motion browser
tests now wait for the hydrated disabled autoplay control before clicking.
The fixture's unrelated remote Sanity event stream is isolated in the new
browser tests because this temporary local port is not an allowed CORS origin.
An existing tablet test initially stalled on the development image optimizer;
restarting this worktree's own server resolved it and the original, unmodified
14-test suite passed. No image behavior or test expectations were weakened.

The local Home route opts in and advances to the selected readable headline.
Its remote optimized Sanity images timed out in the local Node process, so the
recorded visual evidence uses Storybook with the published campaign imagery.
This is not a claim of deployed Home image delivery or physical-device sign-off.
Human visual acceptance, physical Safari/iPhone and the existing full-route
no-JavaScript limitation remain under INF-49/57; no merge or production deploy.

Devon explicitly extended this carousel sequence to touch/mobile. Its preference
query is now independent of the desktop scroll/pointer scenes. The mobile
recording and settled screenshot show actual published campaign imagery; reduced
motion and Save-Data continue to prevent the optional import and animation.

The later support fade exposed an invisible keyboard-focus state. A new real
Previous → backward-tab browser regression failed before the correction: focusing
incoming content now completes the sequence immediately and restores the visible
CTA and its focus indicator. WebKit's default macOS policy uses Option+Shift+Tab
to include links. Pointer-driven transitions retain the slower fade.

## Gold basket badge follow-up

Devon also requested a gold circle behind the header cart quantity in this PR.
The existing count span now uses action-primary and action-primary-foreground,
with a20px circle (24px for99+). Zero/unavailable behavior, full accessible
quantity and44px link target are unchanged.

Four new Navigation stories cover midnight, ivory,99+ and320px mobile. Browser
inspection confirmed circular geometry, legible dark digits, no horizontal
overflow and zero axe violations in all four. The screenshots and measured
results are included here. Lint, typecheck,433 unit tests,401 Storybook tests
and both production builds pass. No cart data or commerce logic changed.
This small visual follow-up does not change roadmap milestones or release gates.
