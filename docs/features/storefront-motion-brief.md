# Storefront motion brief

Date: 19 September 2026

Status: preview implementation underway; G1–G3 delegated to Codex on19September2026; final user preview review and production gates remain open

Owner: Devon Taft for every task in this workstream

## Outcome and audience

Make Infusion Diffusion's Home and About pages feel immersive through coordinated
scrolling, photography and typography while keeping fragrance choice and purchase
direct. The audience remains South African home-fragrance and gift buyers using
desktop and mobile, including constrained connections.

Devon supplied Mlab's homepage, its software-development page and SimonDev's
LERP video, specifically highlighting sections that hold while scrolling and
oversized floating background text. He approved systematic planning and Plane
task creation, then explicitly assigned every new task to himself. That ownership
supersedes the default preparation/verification owner only for this new workstream.
Existing tickets retain their owners.

## Verified reference observations

- [Mlab Home](https://mlab-studio.com/): background lettering is a separate repeated
  image layer behind the case-study imagery. Adapt the visual idea using accessible
  DOM text; do not copy Mlab's graphics, copy or code.
- [Software development](https://mlab-studio.com/services/software-development/):
  browser inspection confirmed the process section holds its vertical position
  as downward scrolling advances its horizontal cards. Public source uses
  ScrollTrigger pin/scrub and measured horizontal travel.
- [Public reference bundle](https://mlab-studio.com/wp-content/themes/mlabstudio/public/main.js?ver=1735229237):
  GSAP, ScrollTrigger, ScrollSmoother, SplitText and custom pointer interpolation
  are present. Their presence does not require adopting all of them.
- [SimonDev video](https://www.youtube.com/watch?v=YJB1QnEmlTs):
  title verified as “An In-Depth look at Lerp, Smoothstep, and Shaping Functions.”
  Playback/transcript were inaccessible in this research; do not claim it was watched.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and
  [responsive motion](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>):
  documentation checked during research, including Context7. Refresh the applicable
  official APIs at implementation time.

## Current baseline and reconciliation

Protected main was fetched over authenticated HTTPS after the configured SSH
transport failed, then safely fast-forwarded to e7242ad, the human-merged PR107.
No shared Git remote configuration was changed. The unrelated untracked output/
directory is preserved and excluded from this plan's commits.

PR106/INF-48 imagery is already approved, published and live. Reuse the actual
six square product masters, responsive artwork, four About campaign figures and
three-slide carousel. The code currently uses CSS/IntersectionObserver scroll
reveals and an editorial carousel; GSAP is not an installed application dependency.

INF-28/31 facts and content, INF-40 provider/account acceptance, INF-41 SEO,
INF-44 care/service, INF-36 independent shopping release and INF-42 commercial
gates remain open. This motion work does not become a prerequisite of those
existing release tickets. Isolated design and studies can proceed; live template
integration follows INF-36, preserving the existing after-shopping refinement
sequence. INF-47's physical-iPhone scroll acceptance blocks final motion release.
INF-37 retains GalleryViewer refinement; the new About task only adds approved
motion around the existing viewer and must not claim INF-37 complete.

## Proposed scope

1. A pinned desktop collection sequence with large photography and drifting
   fragrance names behind it. Content stops moving when the visitor stops scrolling.
2. An approved hero entrance and optional bounded pointer response for decorative
   reed-shadow layers. The existing carousel remains the content/control authority.
3. Sticky About imagery and coordinated chapter transitions, with masks only where
   studies establish a clear improvement.
4. Shared lifecycle/preferences/timing primitives; Storybook studies, composed
   components and templates; route integration; independent evidence and release.

Candidates remain provisional until the storyboard/studies gates. The design
task decides placement within existing sections and whether the collection
sequence replaces or supplements a band. No section removal, final timing,
global redesign or revised carousel transition is silently approved by this plan.

Out of scope: new commerce backend, custom checkout, account changes, new product
formats, a gallery-viewer redesign, new factual claims, source publication,
global scroll interception/smoothing, cursor replacement, WebGL, page-routing
replacement and automatic production deployment.

## Ownership and architecture

Devon owns every new Plane task, including preparation and coordination of
independent verification. Independent review remains independent even though
its tracking task is assigned to Devon. No agents are delegated by this planning
change. Default delivery is one branch/PR and sequential work; separately writing
agents/worktrees/PRs require explicit topology approval.

Next.js remains the renderer, Sanity the editorial source and Shopify commerce
truth. Motion components consume display data/children from existing boundaries;
they never fetch or duplicate product prices, availability, cart or customer state.
Use small client islands and visible server HTML. GSAP/ScrollTrigger are candidates
for complex sequencing; native CSS handles sufficient simple motion/sticky behavior.
Time-based LERP/damping is conditional on an approved pointer effect. No dependency
is installed during planning.

## Acceptance contract

- Preserve Marcellus/Manrope, semantic tokens, source-owned text, full product
  visibility, usable Shop links, navigation, announcement, footer and checkout.
- Baseline Figma authority is file jIMvwSBkilg7eplo3IiHPa, Approved page 2004:14,
  exact frames from the dated handoff and subsequent DESIGN.md amendments.
  New motion requires exact frame IDs plus interactive/recorded timing evidence.
- Deliver foundations, atoms, composed components and templates in Storybook
  before page integration. Keep Figma, DESIGN.md, .impeccable/design.json, runtime
  tokens and stories synchronized or name an approved divergence.
- At 1440/768/390/320 and short viewport heights, all content is reachable and
  legible. Pinning is conditional on space and input capability; mobile gets an
  approved static stack or native touch gallery with visible controls.
- Reduced motion initially or toggled at runtime removes decorative drift,
  parallax and pinning and exposes complete static content. A user can pause any
  approved decorative autoplay lasting longer than five seconds.
- Keyboard focus never becomes trapped or moves to an invisible card. A visible
  skip-past-sequence link bypasses desktop pinning. Decorative duplicate names
  are aria-hidden; meaningful text remains real accessible HTML.
- Default/no-JS/import-failure output is visible and usable. Handle empty/single/
  six-item data, long copy, missing imagery, late font/image loads and source errors.
- Scope and clean up triggers, spacers, observers, events and frame callbacks on
  unmount, route navigation and breakpoint/preference changes. Never animate the
  same transform as an existing carousel/reveal controller.
- Preserve browser back/forward, anchors, restored scroll, menu/viewer scroll
  locking and focus return. Avoid horizontal document overflow and blank footer
  space; physical-device evidence is required for the existing iPhone concern.
- Stop nonessential work when hidden/offscreen. Pointer damping, if selected,
  has comparable trajectories at 30/60/120Hz and cannot jump after tab resume.
- Capture baseline/candidate performance with the same device/network profile.
  Studies approve budgets before production implementation. Starting proposals:
  no animation-caused CLS; at most 10% median LCP regression over five comparable
  runs; p95 animation-frame interval at most 50ms on the agreed constrained profile.
  These are proposed lab guardrails, not measured results or field CWV claims.
- Prefer existing analytics if present; no new tracking provider, personal data
  collection or conversion claim. Record journey checks and performance evidence.
- Preview approval includes videos of forward/reverse motion, static/reduced-motion
  states, mobile behavior and a difference log. CI alone does not approve fidelity.
- Human visual acceptance and merge follow independent review, green required
  checks and exact-head pr:gate. Post-merge health/motion/commerce-link smoke is
  required before Done. Keep a named rollback commit and a content-preserving
  static fallback; rollback execution retains operations.md human gates.

## Decisions and gates

G1 — Devon approves the section map and responsive storyboard before experiments.

G2 — Devon selects effects and approves recorded/interactive studies, exact Figma
frames, timing/input contract and measured budgets before production components.

G3 — Devon accepts Storybook components/templates before live route integration.

G4 — Independent review, device/performance evidence, green required checks and
Devon's preview acceptance/human merge before production; post-merge smoke closes work.

The first two tasks own the unresolved creative choices: exact collection
placement/count, pin distance and thresholds, text speed, mask treatment, optional
hero pointer depth and mobile gallery versus stack. They are explicit design
decisions, not implementation placeholders. The approved study handoff supplies
exact runtime APIs and implementation-level tests before foundation work begins.

See the [delivery plan](../superpowers/plans/2026-09-19-storefront-motion.md).

## Preview implementation amendment — 19 September 2026

Devon requested end-to-end delivery and delegated all intermediate self-approvals.
The selected contract is `../superpowers/specs/2026-09-19-motion-preview-design.md`;
implementation and evidence are indexed in `../evidence/storefront-motion/README.md`.
This supersedes the G1–G3 human stops above for this preview only, and authorizes
preview integration before INF-36. INF-47 and production merge/smoke remain open.

User preview refinement: normal laptop heights720/768/800must show motion without
zooming. Selected compact composition and measured250–440px media sizing are in
the dated preview spec; eligibility is now1024×680with measured fit. Decorative
backdrop pointer response is18×12px/160ms; mobile remains a natural static stack.
