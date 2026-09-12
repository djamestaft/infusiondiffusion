# Editorial carousel and floating navigation — 12 September 2026

Devon approved implementing the reviewed Figma exploration in a single Treehouse
worktree, extending the existing carousel/navigation and providing Storybook tests.
Branch: `agent/carousel-navigation`. Coordinator is the sole writer.

## Design authority and acceptance

Figma file `jIMvwSBkilg7eplo3IiHPa`, Exploration page `2004:8`:

- Carousel desktop `2650:2`, `2651:2`, `2651:17`; mobile `2652:2/17/32`.
- Uppercase Manrope navigation composition `2664:2`, solid state `2665:7`.
- Marcellus comparison `2672:12`; mobile `2674:22`, menu `2675:27`.

Each slide owns title, subtitle, image and internal CTA. Existing published
slides fall back to the homepage copy/action. Copy/media move together; manual
previous/next controls, keyboard arrows, horizontal swipe and polite announcements
replace the image-progress treatment in the editorial presentation. Legacy
image-only presentations remain available to their existing consumers.

The shared photographic background remains fixed across slides. Generated
reed-shadows is the implementation background; warm-limestone and botanical-shadows
are Storybook-only comparisons. No generated product identity or final catalogue
asset acceptance is implied. Existing product images and Home sections are retained.

Header is 64px, with a centered 1184px desktop rail, uppercase Manrope links and
a 3px gap between text and active underline. The optional display-font comparison
uses Marcellus. Bag/account icons have 44px targets. Account remains conditional
on the existing provisioned account destination; Storybook supplies it explicitly.
Cart badges and accessible names retain zero, unavailable and confirmed counts.
Mobile has a hamburger, full-screen scrollable menu, focus trap, Escape handling
and responsive focus restoration. Home uses a fixed transparent header that fills
with midnight after 24px scroll; other pages retain a solid sticky header.
Reduced motion removes the color/slide transitions. The carousel does not autoplay.

## Authoring and boundaries

In Sanity Site settings → Homepage → Hero carousel slides, optional `title`,
`subtitle` and `cta {label, href}` override the shared Home defaults. Supply both
action fields; destinations must be internal paths. Blank/invalid fields fall back.
Schema/projection/types are additive; no migration, publication, credentials or
commerce changes. Existing visibility, maximum-three and media validity rules stay.
Background comparisons and sample campaign copy live in Storybook fixtures.

## Typography and assets

Manrope (200–800) and Marcellus (400) are bundled from the official Google Fonts
repository with their OFL licenses in `src/app/font-assets`. This preserves the
approved families and removes the build-time Google Fonts network dependency
that failed in this environment. Next and Storybook share these font definitions.

Generated background source: built-in image generation, 12 September 2026.
Optimized WebP files: reed-shadows 91 KB, warm-limestone 142 KB,
botanical-shadows 55 KB. UI remains accessible HTML, never baked into the image.

## Deliberate responsive adaptations

Desktop copy/media uses the approved 520/600 ratio with a 64px gap and 5:4 image.
Mobile stacks with 24px gutters. Content grows for long copy; overlapping grid
slides reserve the largest slide's height. The integrated header reserves exactly
64px rather than the Figma extra composition's 72px spacer. Native cart badges and
conditional account availability preserve working application contracts.

## Verification and review

Storybook: Components / HeroCarousel / Editorial, including standalone,
with navigation, alternate font/backgrounds, mobile/tablet, loading, missing media,
empty and long content. Local review URL: http://localhost:6017/.

Verification evidence is recorded at handoff. Sanity Studio source publication,
authenticated draft/Visual Editing verification, deployment and human merge remain
separate from this local review. INF-35 remains In Progress (Devon); INF-36 remains
downstream. This bounded refinement does not complete their deferred release scope.

### Local verification result

- 276 Vitest tests passed; 305 Storybook tests passed, including a final rerun
  of all 33 affected editorial-carousel/navigation stories.
- All 26 targeted Chromium journeys passed: integrated editorial carousel at
  1440/768/390/320, existing Home sections/legacy carousel, and shopping navigation.
- Additional Storybook browser captures at those four widths showed no overflow,
  page errors or axe violations; menu Escape restores focus and scroll fill is
  the existing midnight value. Impeccable detector returned no findings.
- Formatting, lint, TypeScript, Storybook build and Next production build passed.
- Initial test failures identified obsolete visual assertions, a loading-state
  ARIA role, an incorrect new Playwright matcher, missing test configuration and
  this machine's short Node connection-attempt timeout. Corrected and rerun.
  The local test server uses `--network-family-autoselection-attempt-timeout=3000`;
  this is a process-only setting, not a production configuration change.
- `NEXT_DIST_DIR=.next-e2e` and `STORYBOOK_BASE_URL` support isolated test servers
  without stopping another running dev process. Generated files remain ignored.

| Layer                         | Status                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Figma                         | Synced to the captured, user-approved component intent; responsive spacer and live-commerce adaptations documented above |
| DESIGN.md / Impeccable        | Synced                                                                                                                   |
| CSS tokens                    | Synced; existing semantic values reused                                                                                  |
| Components / Sanity contracts | Synced; additive fields, no publication                                                                                  |
| Storybook                     | Synced; generated alternatives remain review fixtures                                                                    |

Authenticated Studio/draft Visual Editing and deployment review were not exercised.
No production deployment or human merge is included in this local delivery.
