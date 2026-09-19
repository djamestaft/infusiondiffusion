# Carousel choreography evidence

User-approved follow-up to the motion candidate in PR #109. See
[the feature contract](../../features/hero-carousel-letter-arrival.md).

The component was implemented and inspected in Storybook before opting Home in.
Frame sampling confirmed outgoing letters moving left while incoming letters
remain invisible; the incoming letters start at220ms and the image at340ms.
The review refinement spreads letters by up to2.5px per character within each
line, with48px maximum extra spread and no text reflow. At230ms the outgoing
first letter was at-67.30px while the incoming first letter was at34.30px,
both visible; the last incoming letter was still at63.5px. The longer image
pulse reaches1.01 and returns to1; the full sequence lasts1.25s.
The final heading is unsplit, visible and accessible. Screenshots at
1440/768/390/320 showed complete imagery and copy, preserved desktop alignment
and mobile centering, with no horizontal overflow. The intended visual change
is temporal; settled composition retains the existing design.

Local detailed artifacts: /tmp/inf-carousel-choreography, including the original
Storybook recording, frame-timing JSON and full-resolution responsive captures.
The images and recording here show the reviewed component sequence; the separate
hover-continuity fix is owned by pane 1 and retained as the integration base.

## Final local verification

- Lint and TypeScript: pass.
- Vitest:432 tests across64 files pass, including real GSAP timeline assertions
  for outgoing precedence/overlap, horizontal entry, image timing, bounded
  long-text duration, per-line tracking reset/cap and reversible cleanup of both
  headings.
- Storybook:397 tests across34 files pass; production Storybook build passes.
- Next production build passes using the isolated .next-e2e output directory.
- Playwright: all5 choreography tests pass in each of Chromium, WebKit and
  Firefox (15 passes). Covers frame samples, rapid reversal, resize, reduced
  motion interruption, real Save-Data import prevention and responsive geometry.
- Existing editorial carousel suite:14/14 Chromium checks passed before this
  isolated timeline refinement, including
  1900/1440/1280/1024/768/390/320, short screens, keyboard, autoplay and axe.
- Independent read-only review: no remaining findings. The reviewer independently
  checked outgoing precedence, rapid navigation/reversal, resize, reduced-motion
  interruption, plain-text/ARIA restoration and the Save-Data readiness guard.
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
