# Infusion Diffusion design system

## Navigation breathing room — 12 September 2026

Devon requested more space around the header logo. Use the shared responsive
`--navigation-height`: 86px from 1024px, 78px below. Keep existing logo widths
and 44px targets. Header, menu header and floating-hero offset share this token;
solid borders remain inside the total height. Transparent and scrolled states
have identical geometry. This supersedes the 64px contract below. The follow-up adds 3px per side.

Editorial autoplay advances every 6 seconds, with a 44px Pause/Play control
beside the count. Hover pauses temporarily; focus or manual navigation pauses
until Play. Hidden/offscreen content pauses; reduced motion, save-data and loading
disable autoplay. Automatic changes are not live-announced. At 1024–1535px,
hero insets are 96px, leaving 42px between arrows and content; mobile and wide
screen gutters stay. A 24px alpha mask softens the viewport edges only while
slides move, leaving resting photography crisp.

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
source-owned Born text. Campaign roles use stable IDs, 3:4 imagery and no
visible captions. Devon subsequently requested smaller, fully visible first-four
images: center them, cap height at calc(100svh - 128px), with width following the 3:4 ratio, and use contain
fitting. This explicitly supersedes the original full-column image size in Figma.
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
