# Hero backdrop hover continuity correction

Request: Devon's confirmed report at d64622c, with Chromium/WebKit reproduction
at1440×800. Work remains in PR109 on the existing delivery branch.

Two causes were corrected:

1. Ordinary pointerleave called teardown, immediately discarding translation and
   scale. Hover leave now freezes the pose/cancels RAF; re-entry damps from the
   retained position with a fresh frame clock. Eligible overscan is present in
   first-paint CSS, before JavaScript or pointer input. Keyboard focus centers at
   the same crop. Hidden/offscreen pause; reduced motion, explicit pause,
   ineligibility and lifecycle cleanup restore the appropriate static state.
2. Animated backdrop overflow grew the hero's scrollWidth from1440to1475 without
   a layout change. A subsequent image load mistakenly tore down the effect.
   Scope/photograph measurements now use layout dimensions; only the collection
   track measures intrinsic scrollWidth for travel. Real size changes still rebuild.

Independent review found and reproduced the second cause during continuous
hover, beyond the supplied navigation-boundary reproduction. See
[independent runtime review](independent-review.md).

Visual samples from corrected local browser recordings:
[Chromium boundary sequence](chromium-boundary-review.png),
[WebKit1280×720 sequence](webkit-1280x720-visual-review.png).
The independent designer compared these against the original reset sequence and
found no obvious scale pop or snap-back; foreground content and complete laptop
hero remained stable. [Local frame summary](local-frame-summary.json) retains
all nine engine/viewport measurements and numerical/environment limitations.

Reproduce with `node scripts/verify-hero-hover.mjs` using an existing local server.
Set MOTION_REPRO_URL for the preview, OUT_DIR for artifacts and optional
HEADERS_FILE for existing preview access. Headers are scoped to the exact preview
origin; no protection is disabled. The script saves frame-level browser-trace.json,
a visual index.html, screenshots and representative Chromium/WebKit recordings.
It verifies first hover, four navigation crossings, six seconds of continuous
movement with image loads, offscreen return, keyboard centering and reduced motion.

New unit regressions first failed on destructive leave, repeated crossings,
hidden/offscreen pose loss and transform-induced rebuilds. The new browser test
first failed because pre-hover scale was1instead1.04. Corrected tests cover those
behaviors plus single RAF ownership, settling, unmount cleanup, real geometry and
intrinsic collection-track overflow. The existing motion/gallery/laptop tests are
retained. HeroStudy documents the changed interaction and exposes the shared pause
control for manual review.

The coordinator records final exact-commit CI, health, deployed frame/video results
and full immutable preview URL in the final PR109 verification comment. That
record is required before final handoff; local recordings alone do not establish
deployed acceptance. No production deployment or merge is authorized.

Local gate: `pnpm check` passed427unit tests,389Storybook tests, formatting,
lint, type checking and both builds. New hover tests passed all three laptop sizes;
adjacent pointer/laptop checks passed. The gallery fixture encountered one
Storybook execution-context reload, then passed its targeted rerun without a
runtime change. Full exact-head CI and deployed reproduction remain the final gate.
