# Infusion Diffusion design system

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

| Layer                        | Current status                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Figma                        | Approved page `2004:14`; current layouts `2484:736`, support `2484:737`                        |
| DESIGN.md and dated handoff  | Current design authority synchronized                                                          |
| Foundation tokens            | Existing foundation retained; no visual token values changed by this consolidation             |
| Runtime components/templates | Existing Home and Shop/product baseline delivered; revised designs pending INF-33/34/35        |
| Storybook                    | Existing contracts retained; revised states and composition comparisons pending implementation |

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
