# INF-58 bounded visual review

Local current source http://localhost:3100/fragrance-guide, 19 September 2026. Read-only application review. Browser: Chromium, viewport1440×900,1280×720,390×844,320×844. Screenshots opened and inspected; source-backed guide completed at every width. Video captures for1280 and390; per-frame transforms/focus/reset evidence in report.json.

## Accepted

- Clear editorial hierarchy, complete source bottles, readable serif choice labels and native radio/checkbox glyphs. Intro desktop/laptop and narrow mobile preserve the intended composition.
- Zero horizontal overflow measured on Room, Notes and results at all four widths.
- Stronger heading/answer entrances visibly distinguish steps; control row hit positions stay stable. Reduced-motion/global/browser coverage remains root-owned.
- H1 focus outline:none at all four widths; keyboard Back retains a3px solid focus outline. Programmatic focus remains H1 during transition.
- Reset from results returns intro; Begin shows zero checked Room choices at every width. Other answer clearing is additionally root unit-test territory.
- Separate Reset utility row below Back/Continue accepted for320px breathing room and synchronized to Figma. Notes with inline limit error naturally extends past720px height without clipping; scroll remains available.

## Two corrections, one batch

1. Result-summary action spacing. Explore the collection and Reset guide touch on one line at desktop and mobile. See1440x900-results.png and390x844-results.png. Use separate44px rows, or a clearly spaced wrapping group with12px minimum gap. Figma results already show separated rows.
2. Mobile entrance first-paint flash. New Feeling heading first paints at transform:none / opacity1, then jumps one frame later to x32 / opacity0.45 before animating home. At390:33.2ms final pose,49.2ms entrance start. At320:33.8ms final pose,51ms entrance start. Answer labels similarly go opacity1→0.35. Cause suggested by runtime: lightMotion begins false and turns true in an effect after mount. Move eligibility before paint or make CSS media conditions apply on the first paint; keep reduced motion and user pause respected. Do not hide content by default indefinitely.

Only these corrections require designer confirmation; no broader restyle or additional approval needed. Next.js development badge visible in local screenshots is environment UI, not a storefront design issue.

## Final confirmation

Both corrections passed the focused follow-up. Mobile390/320 first new-question samples begin at x32, opacity0.8, then settle continuously; no final-position first-frame flash remains in the captured sequence. Desktop1440/mobile390 collection and Reset actions are separate44px rows with16px spacing. Updated opacity preserves stronger motion while keeping text readable. Opened and inspected confirmed-390-transition.png, confirmed-320-transition.png, confirmed-390-summary.png and confirmed-1440-summary.png. Per-frame and geometry data: confirmation.json. No outstanding material visual findings; accepted for preview review. This is bounded local visual disposition, not a substitute for root-owned CI/accessibility/preview checks.
