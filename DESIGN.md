# Infusion Diffusion design system

## Soft-launch announcement — 17 September 2026

Devon requested reuse of AnnouncementBar above shared navigation before the
www-domain soft launch: “Payments are in test mode. We’re launching shortly.”
Use existing announcement tokens and Manrope styling, with natural wrapping,
a minimum 44px strip and no dismissal, link or live-region announcement.
Keep it visible when scrolling and inside the mobile menu. Hide the gold
announcement separator while the floating header is transparent; show it with
the solid header and mobile menu. Retain border space to avoid a height shift. Preserve the
78/86px navigation row including its existing solid-route border. Sanity’s
existing announcement fields remain the editorial source and disable control.
This requested addition intentionally differs from Figma 2764:488, which has
no notice; all existing logo, account and menu states remain unchanged.
See [INF-42 banner](docs/features/inf-42-soft-launch-banner.md).

## Header loading and navigation — 17 September 2026

Devon requests semibold (600) header labels and a distinct account loading state.
Use Manrope Semibold for desktop and mobile navigation labels, preserving the
navigation-muted color, casing, spacing and existing sizes. The historical
Marcellus comparison story retains its available regular font.

While identity is unknown, show a 20px neutral LoaderCircle centered in the same
32px avatar slot and 44px Account link. Its accessible name is “Account, checking
sign-in status”, with aria-busy. Rotate only when reduced motion is not requested.
A verified identity retains the approved outlined/filled gold avatar. Do not
show the signed-out UserRound while checking; confirmed guests/errors retain it.

Header destinations and commerce links use client navigation so the shared
provider retains the verified profile in memory between pages. Concurrent checks
share one request. A focus check preserves the current visible profile until it
resolves; errors/expiry clear it. Hidden pages, pagehide and cross-tab sign-out
clear identity and invalidate outstanding responses. Full reloads verify afresh.
No profile or credentials are persisted in browser storage or public caches.

This explicitly requested refinement supersedes the regular header labels and
unresolved UserRound shown in Figma 2764:488 / 2764:487. Those approved historical
frames remain an intentional divergence pending design synchronization; the
signed-in avatar geometry, color and interactions are unchanged. Navigation
loading stories, runtime and this contract cover the new state.

## Account avatar — 17 September 2026

Devon approved the outlined default and filled current-page recommendation in
[Figma 2764:488](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2764-488),
with component set 2764:487, now on Approved. Use a 32px circle inside the existing
44px Account target, 1.5px gold outline and 12px Manrope Semibold initials.
Midnight uses navigation-accent gold-500 on ink-900 with porcelain initials.
Hover uses the lighter navigation-focus ring and a 12% accent tint; focus adds
a 2px circular ring inset within the target. Pressed and current /account states
use gold-500 fill with action-primary-foreground ink (7.36:1 contrast).
Focus remains visible alongside the filled state. No animation or layout shift.
The ivory adaptation uses the darker navigation-accent outline and focus.

Only a verified signed-in profile receives the ring. Missing initials retain
the existing UserRound inside it; signed-out and error states retain the neutral icon. Unresolved identity now
uses the loading treatment above. Keep the accessible name, bdi isolation, destination and
customer-session lifecycle. No changes to header size, logo, bag, menu, footer
or account content. See [avatar delivery](docs/features/inf-39-account-avatar.md).

## Favicon monogram — 17 September 2026

Devon selected a gold ID monogram on the site's midnight background for browser
and saved-site icons. Use outlined glyphs from the bundled Marcellus font, with
gold-500 (`#C5A447`) on ink-900 (`#191916`). This is an icon-specific extension;
the approved full wordmark remains unchanged.

`src/app/icon.svg` is the vector source. `favicon.ico` includes 16, 32, 48, 64
and 256px raster sizes; `apple-icon.png` is 180px with an opaque background and
square corners so the platform can apply its own mask. All share the same centered
mark and colors. The SVG uses paths and has no font or network dependency.
Next's file conventions supply the icon links without duplicate layout metadata.
Figma has no favicon frame yet; this user-approved addition is documented here
and in the Impeccable sidecar. Existing runtime color tokens remain unchanged.
Devon approved the rendered monogram and authorized release on 17 September.
[Size and tab preview](docs/evidence/favicon/preview.png) covers 16/32/48/64px
and light/dark tab contexts. Local browser checks confirm all three generated
icon links return the exact source files with successful responses; image
inspection confirms every ICO size and an opaque 180px Apple icon.

## Customer account area — 17 September 2026

Follow-up: Devon explicitly requested the black account header after merging
PR #91. AccountEntry now selects the existing midnight Navigation theme in
every account state, matching the Figma frames. Preserve shared Navigation
implementation, other routes, account content and Footer.

Original content approval: Devon approved implementing the account content in Figma handoff `2741:37`,
frames `2742:39/91/137/179` (1440/768/390/320), within PR #91. This approval
explicitly excludes the header and footer: preserve the current shared shell,
including the account page's ivory Navigation default. The dark header shown
in the Figma account frames is an intentional, user-directed divergence.

Use compact top-aligned content, 64px desktop / 40px smaller-screen top padding,
and separate Your details / Your orders sections. Use two equal columns with a
64px gap from 768px; stack with 32px gap below it. Keep the existing Marcellus
headings, Manrope copy, semantic surfaces, gold orders action and quiet Sign out.
Name/email remain read-only Shopify data; orders keep the hosted destination.
Preserve missing names, bidirectional isolation, wrapping and pending sign-out.

Persistent header identity remains the previously reviewed functional work:
44px Account target, 12px semibold initials, generic icon for missing names.
This layout refinement adds no changes to Navigation or Footer.
See [account layout evidence](docs/features/inf-39-account-layout.md).

## Header label refinement — 17 September 2026

Devon approved normal casing and tighter letter spacing for header navigation,
matching the footer link treatment. Preserve source labels (Shop, Fragrance Guide,
About, Contact), use normal letter spacing and the existing `navigation-muted`
text token on desktop and in the mobile menu. Midnight links match the footer's
soft ivory `#E8E2D5`. Preserve antialiased font smoothing. Devon’s later 17 September request
supersedes the original footer-matching 400 weight with header-only 600 weight.
Keep Manrope, current sizes, the gold active
underline, focus states, header geometry and utility icons.

This user-approved refinement supersedes uppercase navigation in the
12 September Figma captures `2664:2`, `2665:7` and `2675:27`; those historical
captures intentionally differ until a subsequent Figma synchronization.
Runtime tokens are reused unchanged; Navigation stories render this contract.

## Footer refinement — 16 September 2026

Devon approved the responsive footer and authorized implementation/push.
The Approved section `2730:37`, component set `2733:61`, and variants
`2730:45/75/106/139` (1440/768/390/320) supersede the footer in `2358:82`.
Use Marcellus 18/26 headings, Manrope Regular 15/24 links and supporting copy,
and 13/20 copyright. Keep the existing midnight surface and gold logo; crop
only the logo asset’s horizontal whitespace to align its visible edge.
Desktop has brand, Explore and Contact columns; tablet puts the brand above
navigation/contact; mobile stacks groups with two navigation columns. Retain
all four routes, the confirmed support mailbox and 44px targets. Separate the
left-aligned copyright with the navigation border token. At compact widths,
wrap the email after @. See [INF-43 delivery](docs/features/inf-43-footer.md).

## Navigation breathing room — 12 September 2026

Devon requested more space around the header logo. Use the shared responsive
`--navigation-height`: 86px from 1024px, 78px below. Keep existing logo widths
and 44px targets. Header, menu header and floating-hero offset share this token;
solid borders remain inside the total height. Transparent and scrolled states
have identical geometry. This supersedes the 64px contract below. The follow-up adds 3px per side.

Editorial autoplay advances every 6 seconds, with the 11px gold counter centred beneath the image.
The counter retains a 44px pause/resume target; no separate icon is shown.
Slide images use a 1px solid semantic gold border. Hover pauses temporarily; focus or manual navigation pauses
until Play. Hidden/offscreen content pauses; reduced motion, save-data and loading
disable autoplay. Automatic changes are not live-announced. At 1024–1535px,
hero insets are 96px, leaving 42px between arrows and content; mobile and wide
screen gutters stay. A 24px alpha mask softens the viewport edges only while
slides move, leaving resting photography crisp.

Phone carousel headlines use 30px type with 36px line height below 640px;
descriptions use 15px/24px and CTA labels 12px, retaining 48px button height.
Tablet and desktop typography is unchanged.

Phone hero alignment — 15 September 2026: below 640px, center each editorial
slide's heading, description and CTA within the content column. At 640px and
above retain left alignment. Image proportions, gutters and controls stay unchanged.
This user-approved refinement supersedes the left-aligned phone Figma copy.

Stacked mobile/tablet slides show image, copy and CTA, then controls. Desktop
retains copy on the left and image on the right.

Campaign media keeps a width-driven 5:4 frame at every viewport size, matching
Figma mobile image 2674:31 (342 × 273.6). Use contain fitting to preserve each
photo's proportions and show the complete bottles. Portrait images may have
side space. Short screens scroll rather than compressing or cropping images.
This 12 September user correction supersedes the viewport-height caps. Narrow layouts
use 16px copy gaps, 24px copy/media gaps and 24px/16px outer vertical padding.
Preserve text and touch targets; content extremes may scroll. Short Laptop and
Short Phone stories demonstrate the preserved frame; Figma retains its original
5:4 geometry. Contain fitting is the user-authorized change for mixed source ratios.

Carousel motion refinement: Next moves copy/media right-to-left; Previous reverses.
Use 600ms ease-in-out translation with no opacity pulse and instant reduced-motion
changes. Desktop arrows occupy the midpoint of the outer gutters. The scrolled
navigation has a 1px semantic gold bottom rule inside its 64px height.

## Editorial carousel and floating navigation — 12 September 2026

Devon authorized implementation of the reviewed Figma carousel/navigation on page
2004:8. See [the component contract](docs/features/carousel-navigation.md) for exact
nodes, authoring, responsive adaptations and review evidence. Use uppercase
Manrope navigation; Marcellus is a Storybook comparison. Header/hero share the site’s 1440px outer container and 20/24/40/64px responsive gutters. The hero fills at least 100svh and grows with content. Header height is 64px,
active underline is 3px below the text, and icon targets stay 44px. Home floats
over the shared reed-shadow background until scrollY exceeds 24px, then fills
with midnight. Other routes retain a solid header with the existing semantic gold bottom divider. Editorial slides own title,
subtitle, image and CTA with shared-content fallbacks and manual controls.
Existing semantic tokens and Home sections remain. Actual licensed fonts are
bundled locally and shared by the app and Storybook. This supersedes the earlier
Home hero and navigation presentation rules only within this approved scope.

## Interim editorial defaults — 12 September 2026

Devon retains the approved About, Contact and Guide layouts and authorizes
replaceable support content. Contact keeps its hero, centered email section
and gold content rail, adding Delivery enquiries, Returns or damaged items
and Diffuser care beneath Before you write. Existing section styles, tokens
and responsive behavior are retained. The confirmed Dione mailbox also serves
missing-data and error states. [Delivery contract](docs/features/inf-35-editorial-defaults.md).

Runtime and Storybook share these defaults. Historical Figma Contact frames
2529:2/19/37/55 retain their earlier copy: this is an intentional user-authorized
content divergence, not a new composition. Final policy/care content and source
publication remain deferred.

## Guide matching implementation - 9 September 2026

Devon's subsequent review puts Suggested fragrances above Your fragrance
preferences, after the form controls. Continue focuses the suggestions heading
when matches exist, or the preferences heading for empty/unavailable results.
Keep the original section styling; the preferences section uses the shared
gutters and 48px vertical padding below the suggestions.

Devon approved the [matching contract](docs/features/inf-35-fragrance-matching.md)
for a notes/character-only first version. Room, mood, presence and time remain
summary preferences, explicitly excluded from scoring. Preserve Variation 02
frames 2172:2, 2457:601/749/897 and state contract 2458:676, now synchronized
by the designer. Suggested fragrances replaces the fixed-three/ranked-atmosphere
claim. Show 1-3 source-explained matches only after valid submission; edits clear
results, equal scores indicate equal editorial ranking, and unavailable products
have a visible status. Empty/failure states retain the summary and Shop recovery.
Use the existing fluid result grid, tokens, typography and shared shell.
The accepted versioned repository mapping is interim while Sanity publication
remains paused. This supersedes earlier unavailable-matching statements below.

## Contact implementation — 9 September 2026

The [Contact brief](docs/features/inf-27-contact.md) records INF-27 approved
frames `2529:2/19/37/55` at 1440/768/390/320. Reuse the approved midnight shell,
Marcellus/Manrope and corrected gold action. Keep the existing source-owned
mailbox, direct-email behavior and factual copy. Devon requested centered hero
text over the existing Shop placeholder image, a centered email section, and
a gold-300 Before you write section with text spanning the full content rail.
Reuse collection-hero-scrim and collection-invitation-surface.
The duplicate email headings become “Contact us by email.”

Devon approved these frames and implementation on 9 September. They are now in
Approved with unchanged IDs; runtime and Storybook use the captured composition.
No new tokens, contact backend or source publication is included.

## About and Guide implementation — 9 September 2026

The [INF-35 contract](docs/features/inf-35-approved-editorial.md) maps combined
About and Guide Variation 02 to the exact approved frames. About combines
Sanity gallery media with editorial chapters and preserves the complete
source-owned Born text. On 17 September 2026 Devon requested a dedicated landscape
hero and smaller square story previews. The four campaign figures now center
within their columns, use square cover crops, and cap both dimensions at
min(400px, 50svh). Full source photographs remain available in the viewer.
This supersedes the previous 3:4 contain / viewport-minus-128px refinement.
The About-only conceptual still-life hero is a 2160×720 WebP (90,484 bytes),
with live text and a 40% semantic surface overlay. Review frames are in
Figma section 2776:883; see [INF-45 evidence](docs/features/inf-45-about-media.md).
The new frames are review-pending; retained approved frames remain historical
layout authority for all unchanged content and shared components.
Market roles preserve their captions; the lead uses 16:9,
the remaining four use 4:3, with the Market Table anchored at 58.81%.

Devon approved About and authorized Guide route integration on 9 September.
Guide now shows working preferences and a summary, with recommendations
explicitly unavailable. Sample rankings remain Storybook-only. Approved answer surface `#F7F3EA`, border
`rgb(132 101 35 / 55%)` and question-number ink `#846523` now have named
semantic roles. Existing button material, focus, typography and shared shell
are retained. Stories and the application share the same Marcellus/Manrope
font definitions; native fallback fonts are not visual comparison evidence.
Devon approved About; Guide visual review and independent review remain pending. Source publication remains paused.

## Home/shared shell/Cart implementation — 9 September 2026

The [INF-34 contract](docs/features/inf-34-approved-home-shell-cart.md) maps the
approved responsive Home, navigation/footer and Cart to runtime and Storybook.
Home preserves all approved sections and uses Shop-format cards with independent
3/4/3/3 selection. Plain hero imagery and failure frames use 5:4. Carousel
controls remain as a functional addition to static proofs.
Quiet surfaces use sage-100, the closing invitation gold-300, and gated checkout
uses #E8E2D5. Footer navigation is centered to the desktop frame, with even
visible gaps; mobile labels are left aligned below a centered logo.
Implementation is ready for verification and human review; final content
publication and About/Guide delivery remain pending.

## Shop/Product implementation — 9 September 2026

The [INF-33 component contract](docs/features/inf-33-approved-shop-product.md)
records the bounded reconciliation against the current approved frames.
Light ProductCard surface maps to porcelain-0 (#FCFAF5), with 20px titles,
12px metadata/status, 15px prices and 145% line height. The named
collection-hero-scrim preserves the approved #191916 / 54% overlay.
Shop/Product component synchronization is implemented for review; full-page
fidelity remains pending the shared shell in INF-34 and human acceptance.

## Current page approval — 8 September 2026

Devon approved all current customer pages on the main Exploration page.
The approved delivery set is Home, Shop, Product, Cart, combined About and
Fragrance Guide Variation 02 at 1440, 768, 390 and 320 widths. These exact
frames were promoted intact to `30 — Redesign / Approved` (`2004:14`).
The [approval and implementation handoff](docs/features/2026-09-08-design-approval.md)
records all 24 frame IDs, current contracts and remaining work.

This dated page approval supersedes earlier page composition references below
where they differ. The existing foundation tokens and primitives remain valid.
Contact has no frame in this delivery set. The separate card-by-card guide
experiment is not the selected Variation 02 design.

Figma and this authority record are synchronized for the approved design.
Runtime CSS, components and Storybook synchronization remain pending
implementation; no new foundation token values are introduced here.
Final photography, deferred facts/care copy and Sanity SEO remain open.
Visual approval does not validate fragrance matching or authorize publication,
merge, checkout enablement or production deployment.

## Implementation authority

Last approved: 8 September 2026. Consolidated after PR #70 merged as
`b11ad6f` on 9 September 2026. The user reaffirmed Approved page `2004:14`
as the project visual authority.

Follow the [atomic implementation contract](docs/design-implementation.md).
The dated handoff owns current page compositions and shared component changes;
the retained foundation below supplies unchanged tokens and primitives.
Historical approvals do not override the current 24-frame delivery set.

## Source of truth

The implementation source is the Figma page `30 — Redesign / Approved` in
the [Infusion Diffusion Redesign file](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2004-14).

- Current customer layouts: `2484:736` (exact frames in the dated handoff)
- Current supporting components and states: `2484:737`
- Retained foundation handoff: `2039:32`
- Foundation direction: `2039:69`
- Color roles: `2039:106`
- Typography: `2039:211`
- Layout, material, and interaction: `2039:253`
- Foundation responsive proofs: `2039:346` (768), `2039:376` (390),
  `2039:406` (320)
- Component contract index: `2039:436`
- Actions and forms: `2039:480`
- Navigation and overlays: `2039:571`
- Commerce and product cards: `2039:644`
- Feedback, content, and organisms: `2039:710`
- Component responsive proofs: `2039:759` (390), `2039:797` (320)
- Historical INF-16 Home: `2070:2` (1440), `2072:2` (768), `2073:2` (390),
  `2073:70` (320)
- INF-16 Home state contract: `2073:3389`
- Historical INF-26 Shop: `2209:24` (1440), `2209:25` (768), `2209:26` (390),
  `2209:27` (320)
- Historical INF-26 Product detail: `2209:28` (1440), `2209:29` (768), `2209:30`
  (390), `2209:31` (320)
- INF-26 Shop and product-detail state contract: `2209:32`

Only frames on `30 — Redesign / Approved` are implementation authority.
`00 — Archive / Legacy` is historical evidence, `10 — Redesign / Brief &
References` supplies context, and `20 — Redesign / Exploration` remains
non-approved experimentation.

The former `Infusion Diffusion Designs WEB` Figma file (`GYiQd7QSAwCSaGtt0alKG2`)
is retired. Its links may remain in historical delivery records, but it must
not be cited by new implementation work, visual review, Storybook contracts,
or release approval. When a historical record needs a current counterpart,
link the applicable frame on `30 — Redesign / Approved` instead.

## Historical INF-16 homepage baseline

The 8 September handoff supersedes this baseline wherever it differs. This
section explains the existing runtime; it is not the new implementation target.

The homepage uses the archived navigation `LogoTextLockup` in its Midnight
variants, with the desktop page navigation centred between the logo and cart.
`Shop` carries the Gold 300 active-page underline. The responsive content order
is hero, live Shopify catalogue entry, room-led guidance, bespoke diffuser
image blurb, 200 ml longevity, Artistry in Fragrance, service reassurance, and
the closing invitation. The former Born from fragrance block is not part of the
homepage; its responsive source remains preserved for future About-page work.

Homepage catalogue names, prices, formats, and ordering come from Shopify and
must not be replaced with invented fragrance data. Product imagery remains a
Shopify-owned runtime field. The approved editorial image treatments are backed
by `public/images/homepage-bespoke-diffuser-blurb.png` and
`public/images/homepage-artistry-in-fragrance.png`.

## Visual direction

The system should feel like a considered South African home-fragrance object:
quiet, tactile, warm, and editorial without compromising product clarity or
purchase confidence. Luxury comes from proportion, restrained material detail,
typography, and deliberate interaction—not decorative excess.

## Color

Use semantic roles rather than one-off colors. The approved core values are:

- Page background: `#EEF0E7`
- Primary ink (`ink/900`): `#191916`
- Default action gold: `#C5A447`
- Hover action gold: `#DDC77F`
- Focus outline gold: `#A9842D`

`ink/950` is retained as a primitive but is not used by approved frames;
approved usages resolve to `ink/900`. Backgrounds must remain consistent
between frames unless an approved semantic surface role explicitly differs.

## Typography

- Display and editorial headings: Marcellus
- Interface, body, labels, controls, and supporting copy: Manrope

These families are approved and must be retained. Typography must remain
legible at every responsive state, preserve clear hierarchy, and tolerate long
product names, prices, care information, delivery copy, and validation text.

## Materials and background pattern

The approved light surface includes a subtle antique-gold diffuser-reed motif.
It is a geometric background treatment derived from the product world, never a
generic grid or foreground illustration.

- Color: `#A9842D`
- Opacity: `5.5%`
- Each reed tapers continuously from approximately `3px` at its base to `1px`
  at its tip.
- Desktop cadence: `42px`; narrower approved frames use proportionally tighter
  spacing while preserving the same taper, curve language, and visual quiet.
- Reeds form disciplined curved fields at opposing edges, paired with restrained
  concentric diffusion arcs.
- The pattern is always a background-only layer. It must not reduce content,
  control, status, or focus visibility.
- The approved pattern is present across all 15 foundation, component, and
  responsive frames on `30 — Redesign / Approved`.

## Actions and interaction

- Default buttons use `#C5A447`; hover uses the lighter `#DDC77F`.
- Focus uses a slightly lighter antique-gold outline, `#A9842D`, with visible
  keyboard treatment.
- The metallic button overlay remains subtle at the approved 60% treatment.
- Button labels are optically and mathematically centered.
- Preserve keyboard behavior, visible focus, 44px minimum targets, WCAG AA
  contrast, and reduced-motion behavior.

## Responsive and content contract

The approved contract is represented at 1440, 768, 390, and 320 widths. Adapt
composition and pattern cadence rather than shrinking desktop layouts. Shopify
owns commerce truth, Sanity owns editorial content, and Storybook owns reusable
UI state contracts. Designs must cover default, hover, active, focus, disabled,
loading, error, success, empty, long-content, and reduced-motion states where
applicable.

## Synchronization status

| Layer                        | Current status                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Figma                        | Approved page `2004:14`; current layouts `2484:736`, support `2484:737`                  |
| DESIGN.md and dated handoff  | Current design authority synchronized                                                    |
| Foundation tokens            | Existing foundation retained; no visual token values changed by this consolidation       |
| Runtime components/templates | INF-33/34, Contact and initial Guide matching delivered; PR #83 refinements under review |
| Storybook                    | Current component contracts implemented; consolidated PR #83 verification required       |

A component is complete only when its Figma reference, semantic tokens,
implementation and Storybook states agree, with comparison evidence at the
applicable approved widths. Passing CI alone is not visual acceptance.
Intentional divergences require a named reason and human approval.

## Product and architecture constraints

- The storefront serves a South African luxury home-fragrance brand.
- Shopify remains the source of truth for products, variants, prices,
  inventory, carts, discounts, customers, orders, and fulfillment.
- Sanity remains the source of truth for editorial content.
- Next.js owns the customer-facing storefront.
- The experience must be accessible, mobile-first, and resilient to content
  extremes and constrained connections.

Button rendering correction: primary link labels must match the product Add to
Cart foreground. Keep the decorative gold material behind all content within
the isolated button stacking context, including plain-text anchor labels.
Components/Button/Primary Link Parity records native/link visual parity.

Shared carousel background — 15 September 2026: Devon selected Figma Exploration
node `2727:44` (Reed / Monstera, palm and fern). The optional Sanity Homepage
hero background selects the decorative shared image. Keep the existing responsive
crop and readability scrim; clearing the selection restores original Reed Shadows.
The comparison collection is `2727:37`. No token or layout changes.

## Navigation input-state correction — 17 September 2026

Logo and menu controls retain the approved keyboard focus indicator, but suppress
outlines after pointer/touch activation, including scripted menu entry and focus
restoration. Keyboard input anywhere in the document restores focus-visible
styling. Do not remove focus, the trap, or the account avatar's approved states.
Existing Figma default/keyboard states and tokens remain unchanged; Storybook
`Components/Navigation/TouchThenKeyboard` captures the transition.
See [INF-46 evidence](docs/features/inf-46-navigation-focus.md).

## Master photography framing — 18 September 2026

Devon requested the new website master imagery from Figma pages 2813:2,
2806:2 and 2809:2. The homepage accepts two to six campaigns, keeping the
existing 5:4 contain frame, composition, motion and tokens. Additional
reading-corner, Noir family and Blanc family photographs are editorial;
they do not establish room-mist or bundle availability.

Product cards use true square 1254×1254 outpainted masters and `object-cover`.
The background extends edge to edge; preserve full reeds, bottle bases, labels
and tassels without stretching the product or introducing side gutters.
This supersedes the earlier portrait-contain approval after Devon's explicit
feedback that the gutters must go. Card geometry and semantic tokens stay fixed.
Square masters are on Figma section `2832:2`.

Responsive editorial candidates are on website page `2835:2`, with refined
Contact/About/statement rows `2842:2`, `2842:5`, `2842:8`. These are review
candidates, not yet promoted to Approved. Sanity provides optional desktop and
phone sources through a single picture; missing phone artwork uses desktop.
Below 640px, authored Shop / Contact / About / Home statement compositions use
220 / 520 / 600 / 600px minimum heights respectively, with copy above the
products. About and Home statement align copy to the top on phones. Guide
switches to its phone composition below 1024px. Tablet About aligns the wide
photo left and the statement aligns right to keep a complete product visible.
Inspect actual text wrapping at 320px; asset-only inspection is insufficient.
Desktop layout, typography, navigation, announcement and tokens remain unchanged.
See [website imagery evidence](docs/features/website-imagery-refresh.md).

## Home and About motion candidate — 19 September 2026

Devon delegated G1–G3 decisions and requested one final Vercel preview review.
The exact Approved Home/About frames remain static brand/layout authority; this
motion candidate is an intentional divergence, not a Figma approval rewrite.
See `docs/evidence/storefront-motion/README.md` and the dated preview spec.

Use native scroll and complete visible content. On fine-pointer, hover-capable
screens at least1024×680, with no reduced-motion/save-data request, the collection
may pin only if measured cards and controls fit below the actual header. Retain
all supplied products. Names use semantic secondary ink at8%opacity, displayed
as decorative CSS text above and behind cards. Reserve80px above card media on tall screens. Below900px height, use a single
control row,36px/44px heading,48px name band and12px vertical padding. Measure
header/control wrapping and unchanged160px card copy to allocate a250–440px square
image. Normal1440×800,1366×768,1280×720and1024×768 laptops must work at100%zoom.
Static fallback remains for truly short or extreme-content layouts.
Use `src/lib/motion/tokens.ts` for shared entrance, drift and damping values.

Hero entrance remains visible,16px over700ms; decorative backdrop alone receives
18×12px pointer motion with160ms damping and1.04backdrop overscan. Carousel controls and600ms transitions remain unchanged.
About retains all four chapters, complete Born copy, square figures and viewer
behavior. Copy is vertically centered beside local sticky photographs; motion
never masks prose. Static controls revert owned effects and keyboard focus on
clipped products restores natural flow. Mobile/touch, reduced motion and
save-data use complete natural layouts. Do not replace native scrolling.

### Hero hover continuity — 19 September 2026

The eligible desktop backdrop has1.04overscan in its first CSS paint, before the
first pointer event. Crossing into overlaid navigation freezes the rendered pose
and stops RAF; re-entry damps from that pose with a fresh clock. Hidden/offscreen
states also suspend work without discarding the crop. Keyboard focus centers the
backdrop at the same overscan. Explicit pause, reduced motion and ineligible
viewports restore the unenhanced crop; teardown removes owned inline transforms.
This corrects confirmed hover-boundary and transformed-overflow rebuild resets;
18×12px travel,160ms damping, collection sizing and gallery behavior are unchanged.

## Fragrance consultation — 19 September 2026

19 September 2026 — INF-58 fragrance consultation (delegated preview approval). Figma exploration page 2876:963, introduction 2878:2, question 2880:9, compact 2883:50, mobile 2881:55, narrow 2883:118, results 2885:136 / 2886:143, refinement 2889:195. Intentionally supersedes simultaneous Guide Variation 02; Approved page remains untouched. One native question at a time; ruled answer rows, completed-step navigation, photographic introduction, fixed desktop photograph and decorative topic word. Results show existing Shopify photographs, source reasons and editable preferences. Reset guide returns to the introduction and clears every answer/result/error. Reset occupies its own utility row. Programmatically focused headings have no outline; interactive controls retain visible keyboard focus. Heading/topic transition ±32px over500ms power2.out; answer text y10px over420ms with35ms stagger, hit areas stationary. Text opacity .8→1 preserves contrast throughout. Results y20px over500ms, opacity .85→1. Decorative LERP bounded±8px/±4px, damping160ms; focus anywhere in guide resets it. Reduced motion is immediate. Mobile uses prepaint CSS eligibility, no desktop GSAP import; no late entrance flash. The consultation boundary clips horizontal entrance overflow; page width must remain fixed throughout animation, with vertical scrolling and inset control focus rings preserved. Semantic colors and shared shell unchanged. Source matcher remains notes/character only; other answers are transparently summary-only.

See `docs/features/fragrance-guide-motion-brief.md` and `docs/evidence/fragrance-guide/`.

## Gold basket quantity — 19 September 2026

Basket badge follow-up: Devon requested a gold circle behind the navigation cart
quantity in PR109. Reuse action-primary gold and action-primary-foreground ink,
with a20px circle and centered semibold digits;99+ uses24px to retain a circular
shape. Preserve the44px cart target, full accessible count, hidden zero and
unavailable dash. Navigation GoldCartCount stories cover midnight, ivory, mobile
and overflow. This explicitly approved badge treatment supersedes the surface
colored badge in existing static Figma frames; other navigation geometry stays
unchanged.

## Hero carousel letter arrival — 19 September 2026

Devon approved letters entering straight from the right, then a soft image pulse,
and authorized pushing the implementation to PR #109. This supersedes the 600ms
whole-panel slide on eligible Home motion transitions only. Preserve the initial
visible campaign, all source copy, 5:4 contain imagery, controls and six-second
autoplay. Use one GSAP timeline: outgoing letters travel 24px left over 180ms
with 40ms total stagger and fade. Incoming letters begin 60ms later: 36px
horizontal travel over 400ms, stagger capped at 120ms, power2.out. Image starts
40ms after incoming letters, scaling 0.98→1.01→1 over 220ms+180ms. Description
fades as one intact paragraph from opacity 0 to 1 over 320ms with sine.out easing
when the title settles at 580ms; the CTA appears immediately. No additional
pause, character/line stagger, translation, colour change or blink. Devon rejected
the previous row reveal as abrupt and reported a sideways snap during split
cleanup; preserve native paragraph text shaping and wrapping throughout.
Visual tracking expands by up to 2.5px per character, capped at 48px per line,
using transforms to preserve line breaks and return to normal spacing.
No vertical letter movement. Total sequence 900ms; restore unsplit headings
after completion or interruption. Devon also approved this carousel sequence on
mobile/touch; its independent eligibility leaves scroll/pointer scenes unchanged.
Reduced-motion,
save-data, hidden/offscreen and motion-pause protections remain authoritative.
Pointer smoothing owns a separate backdrop transform. Runtime carouselMotion
values and Motion/Hero carousel stories define this explicit user-approved
divergence from the static Figma frames; no layout or token redesign.
The description remains a single native accessible paragraph; do not split it,
add a duplicate screen-reader copy or apply an aria-label to the paragraph.
See [the contract](docs/features/hero-carousel-letter-arrival.md).
