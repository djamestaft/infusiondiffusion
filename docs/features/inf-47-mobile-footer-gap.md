# INF-47 — persistent mobile footer gap

Status: In Progress, Devon. Draft PR #101; physical Chrome iOS acceptance pending.

## Scope and acceptance

Prevent the persistent blank region beyond the footer reported across pages in
Chrome iOS. Preserve content, design, normal scrolling, keyboard focus, menu
behavior and horizontal browser gestures. Do not merely repaint or clip the gap.
Human merge and affected-phone verification remain required.

## Evidence — 17 September 2026

Fresh production About, Contact, Account and Fragrance Guide checks in Chromium
and WebKit mobile emulation placed the document end at the footer within 1px.
The opt-in preview diagnostic subsequently captured on the affected phone:

- Document/body height: 6062px; normal inner/visual viewport height: 665px.
- Furthest scroll Y: 6054px; footer bottom: 8px; visual viewport height: 8px.
- Reported visible bottom beyond document end: 657px.
- Returning upward restored the normal viewport; space after footer remained 0.

This establishes scrolling beyond the normal document boundary, not an extra
DOM section after the footer. The exact browser trigger is still unconfirmed.
The first preview trial sets root `overscroll-behavior-y: none` only for
`hover: none` / `pointer: coarse` devices. This also suppresses vertical bounce
and pull-to-refresh on applicable devices; desktop and horizontal behavior are
unchanged. No JavaScript scroll clamping or fixed-height page shell is added.

The diagnostic is preview-only and query opt-in (`viewport-debug=1`), stores
measurements only in component memory and has no telemetry. Remove it before
converting the draft to a mergeable fix.

## Verification

- CSS formatting passed.
- Chromium and WebKit, mobile and desktop: About, Contact, Account and Fragrance
  Guide retain footer alignment, no horizontal overflow and scrolling back up.
  Touch devices compute the new rule; desktop retains `auto`.
- Existing mobile navigation focus/menu tests: 2 passed.
- Read-only review found no blocker to this trial; retained measurements were
  reset on route changes following review feedback.
- Actual Chrome iOS fix confirmation remains pending. Do not mark Done or claim
  the physical-device issue is fixed based on emulation or CI.

Reference: [MDN scrollY overscroll behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY).
