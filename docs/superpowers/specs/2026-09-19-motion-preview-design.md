# Home and About motion preview

## Authority and delivery

On 19 September 2026 Devon explicitly requested end-to-end INF-49–57 execution,
delegated all intermediate design/implementation approvals to Codex, and requested
one final review on a Vercel preview branch. This supersedes G1–G3 human stops and
permits preview integration before INF-36, without claiming that unrelated launch
work or INF-47 physical-device acceptance is complete. Production merge and
post-merge verification remain outside this preview delivery. No source publication.

Baseline: main `67de810`, human-merged PR108. Delivery branch:
`agent/storefront-motion-delivery`. Treehouse allocation failed because all 19
trees were occupied/dirty; the clean tracked primary checkout is used by one
writer on this branch. Preserve unrelated untracked output/ and other worktrees.

## Selected direction

Use refined cinematic motion: the existing Home collection becomes the focal
sequence, with horizontal product travel and oversized fragrance names behind
the product imagery. Supporting hero and About motion is quiet. A restrained
static study remains available for comparison. Preserve Marcellus, Manrope,
semantic surfaces, current source facts, full bottle visibility, all page sections,
navigation, purchase links and the published three-slide carousel.

Figma authority: file jIMvwSBkilg7eplo3IiHPa, Approved page 2004:14.
Home frames 2349:2/104/207/301; About 2426:516/614/708/796 at
1440/768/390/320 respectively. Live Figma metadata and screenshots of desktop
Home and About were inspected by the independent design agent. Existing dated
DESIGN.md amendments govern newer imagery and carousel treatment. Motion is an
intentional divergence from these static frames, accepted by Codex under Devon's
delegation; final user acceptance remains the preview review.

## Runtime contract

- GSAP and ScrollTrigger load only for eligible motion surfaces. Use scoped
  contexts/matchMedia and revert owned effects on route, preference and breakpoint
  changes. Do not kill another component's triggers or replace native scrolling.
- Visible default HTML must work before hydration, with JS disabled and after
  animation import failure. Data comes through existing component props; no new
  Shopify/Sanity fetching or mutable commerce data inside motion modules.
- Desktop motion requires fine pointer, hover, width >=1024 and sufficient height
  (>=760px plus actual content fitting below the measured fixed header). Touch,
  reduced motion, short layouts and content extremes use a static grid/chapters.
- Collection uses existing ProductCard, source-owned names and prices; all supplied
  products remain accessible. Pin travel is measured from track scrollWidth minus
  viewport width; linear scrub stops when scroll stops. Provide a visible skip
  link and motion/static control, reveal keyboard-focused later cards, and restore
  natural flow on disable. Zero and one products do not pin. Long text cannot clip.
- Decorative repeated names are aria-hidden, noninteractive and use semantic
  color/type tokens. They never replace accessible headings or product names.
- Hero uses a separate wrapper for entrance/depth so carousel transforms and
  controls retain ownership. Entrance <=700ms, no opacity-zero LCP/CTA. Optional
  pointer depth <=8px, time-based exponential damping with delta clamp and settle
  cutoff. No cursor replacement, perpetual loop, or pointer work on touch.
- About keeps four chapters, full Born text, alternating image/copy composition,
  current square previews and GalleryViewer API. CSS sticky suffices for the
  photographs, with reversible bounded photographic travel; preserve viewer focus
  return and scroll lock. No hidden chapter text or duplicated meaningful images.
- User pause/static and live reduced-motion changes stop and revert motion.
  Hidden/offscreen pointer work stops. Font decode, image decode and resize refresh
  measurements without leaked observers, spacers or listeners.
- Existing template stories retain their static contracts; explicit motion-enabled
  template stories exercise the new composition. Live Home/About opt into motion.

## Verification and evidence

Implement and verify component stories before wiring live routes. Meaningful
states: cinematic/restrained, static/reduced-motion, touch, short viewport,
empty/single/six products, long names/copy, missing imagery, reverse scroll,
pause, keyboard skip and gallery interruption. Real fonts must finish loading.

Test damping at 30/60/120Hz and resumed-tab clamp; lifecycle cleanup/import failure;
browser pin entry/exit/reversal, focus, resize, preference toggles, 10 remounts,
no-JS, no horizontal overflow, Home/About and adjacent commerce/navigation smoke.
Run required formatting/lint/types/unit/Storybook/build/Playwright gates, independent
read-only review, exact-head CI gate and Vercel health/browser verification.

Capture 1440/768/390/320 screenshots and forward/reverse recordings. Compare five
baseline/candidate mobile lab runs at matching profiles: proposed thresholds are
no motion-induced CLS, <=10% median LCP regression, p95 animation frame interval
<=50ms on the documented constrained profile. Record actual evidence and limitations;
do not claim physical-device or field CWV results from emulation.

Final review gets preview URL, PR, exact commit, evidence index, selected decisions,
sync matrix and residual physical-device/production release work. INF-57/49 cannot
be labelled production-released just because the preview is ready.
