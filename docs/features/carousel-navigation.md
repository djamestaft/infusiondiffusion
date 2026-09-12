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

Header is 64px, with the site-wide 1440px outer container and 64px desktop gutters, uppercase Manrope links and
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

Desktop copy/media keeps the 520/600 ratio with a 64px gap and 5:4 image.
Gutters match the rest of the site: 20px below 375px, 24px mobile, 40px tablet and 64px desktop. Content grows for long copy; overlapping grid
slides reserve the largest slide's height. Following Devon’s review, the hero has a 100svh minimum height and centers its content vertically, growing for longer content.
The integrated header reserves exactly
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

### Follow-up review — shared gutters and viewport height

Devon requested matching navigation/hero gutters with the rest of the site and a
viewport-filling hero to keep the following light section below the initial fold.
Runtime, affected Figma navigation compositions and Storybook use that refinement.
Local Studio’s missing-configuration screen was caused by an absent worktree
`.env.local`. Public project/dataset configuration is now present in the ignored
local file. Studio shows its normal sign-in screen, CLI project access succeeds,
and a read-only production query finds three existing hero slides. No source
mutation, publication, token rotation or copying of API tokens occurred.

Follow-up verification: shared gutters and minimum viewport height checked at
1900/1440/768/390/320; 33 affected Storybook tests and 20 relevant Chromium tests
passed. Formatting, lint, types, Impeccable and both builds passed. The existing
SEO metadata test was excluded from the follow-up layout run after reconnecting
Sanity revealed the already-deferred production description still mentions room
sprays and candles; no metadata publication was authorized. Axe checks run with
reduced motion to avoid sampling a transient section-reveal opacity.

The app on port 3000 was restarted with the existing primary checkout environment
loaded into process memory, plus the previously diagnosed Node connection timeout.
All three production slide images now decode locally. No secrets were written
into the worktree configuration. The local Studio reaches its normal login screen.

### Follow-up review — horizontal movement and outer-gutter controls

Devon requested horizontal slide movement like Finnkino, wider desktop arrow
placement and a gold scrolled-header bottom rule. Copy and image now enter from
the right while the previous slide exits left; backward navigation reverses.
The 600ms ease-in-out timing is an implementation choice because Finnkino’s
Cloudflare challenge prevented inspecting its precise easing/duration. There is
no opacity animation. The shared backdrop stays fixed. Outgoing slides are inert
and hidden from assistive technology immediately; reduced motion switches without
animation. The overlapping grid retains height, including on wraparound and rapid
input. An 8px clip inset preserves CTA focus-ring space.

Desktop arrow centers sit midway through the outer gutters (left edge 10px at
1440, 125px at 1900); mobile controls stay below the image. The scrolled header
adds a 1px existing navigation-divider gold rule through an absolutely positioned
pseudo-element, preserving the 64px height. Figma scrolled strips and motion notes
are synchronized. Semantic colors are unchanged; new CSS keyframes own the motion.

Motion follow-up verification: 15 targeted units, 33 affected Storybook tests and
six Chromium tests passed (five viewport/control checks plus deterministic
mid-transition, reverse, wraparound and rapid-click checks). Lint, types,
formatting, Impeccable and both builds passed. Local screenshots confirm the
mid-transition uses translation at full opacity and the scrolled gold rule is
visible. No Sanity source changes or publication were made.

## Post-merge navigation spacing — 12 September 2026

PR #83 merged at `9df487d`. Devon requested more space around the existing
logo. Header height is now 80px at 1024px+, 72px below, using the shared
`--navigation-height` token for header, mobile menu header and hero offset.
The solid border is included in that total. Logo widths, gutters, slide
geometry, animation and 24px scroll threshold stay. This supersedes 64px
references above. Reuse Navigation and Editorial Carousel stories; verify
1440/768/390/320, keyboard access and equal top/scrolled heights.

Spacing verification: local `pnpm check` passed (276 units, 305 Storybook tests,
formatting/lint/types and both builds); 93 Chromium tests passed without retries.
Reviewed Storybook captures at 1440/768/390/320 and transparent/scrolled headers.
Impeccable navigation detection returned no findings. Figma variants 2664:17,
2665:8, 2672:27/45, 2674:37, 2675:28/49 and their scrolled containers are updated;
logo sizes remain. DESIGN.md, the semantic height token, components and stories
are synchronized. The initial unit run exposed an obsolete `pt-16` assertion;
it now checks the shared offset. Preview acceptance and human merge remain gates.

## Autoplay and laptop follow-up — PR #84

Devon requested 3px more above and below the nav: shared height is 86px desktop,
78px mobile/tablet. This supersedes the intermediate 80/72px values. At CSS widths
1024–1535px the carousel alone uses 96px insets, leaving 42px between the 44px
arrows and content. Navigation and later sections retain the shared site gutters;
this is the requested bounded divergence. At 1536px+ and below 1024px the existing
carousel gutters stay. Use the Laptop Storybook story at 1280px for review.

Editorial slides now auto-advance every six seconds using the existing horizontal
600ms motion. A 44px Pause/Play control sits beside the counter. Hover pauses while
the pointer is inside; native boundary events handle the separately hydrated
floating navigation correctly. Focus or manual navigation pauses until explicit
Play. Hidden tabs and offscreen carousels suspend the timer; reduced-motion,
save-data and loading states disable autoplay. Zero/single-slide states have no
rotation controls. Automatic changes are not live-announced; manual ones are.

The moving viewport uses a 24px alpha edge mask to soften clipping against the
shared photographic background. This is an alpha fade, not a surface-color
approximation, and only exists during movement. Resting media is sharp; reduced
motion suppresses animation and masking. Existing source fields and maximum three
slides remain. No source publication or checkout enablement is included.

Figma navigation variants and main compositions are synchronized, including
pause controls 2691:38/42/45. The motion contract is appended to 2676:40. Runtime
CSS, DESIGN.md, components and Storybook use the same behavior and spacing.

Follow-up verification: local full gate passed with 279 units and 309 Storybook
tests, formatting/lint/types and both builds. All 96 Chromium tests passed with
no retries. Autoplay tests cover six-second cadence, Pause/Play, manual/focus/hover
pause, reduced-motion/data-saving/loading and offscreen suspension. The motion
test checks edge masking during translation and its removal at rest. Desktop
clearance is verified at 1024/1280/1440 and the original wide gutter at 1900.
Reviewed seven-width Storybook captures and the paused transition midpoint;
Impeccable found no carousel issues. Fixed a hover-resume issue caused by replacing
the Play/Pause icon under the pointer: native boundary listeners plus pointer
movement reconcile hover when moving onto the separately hydrated header.
