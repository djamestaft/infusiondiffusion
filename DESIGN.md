# Infusion Diffusion design system

Status: approved Figma foundation, reusable component contract, and INF-16
homepage direction. The runtime foundation and Home-required component
contracts are synchronized; broader template synchronization remains.

Last approved: 1 September 2026

## Source of truth

The implementation source is the Figma page `30 — Redesign / Approved` in
the [Infusion Diffusion Redesign file](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2039-32&m=dev).

- Implementation handoff: `2039:32`
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
- INF-16 Home: `2070:2` (1440), `2072:2` (768), `2073:2` (390),
  `2073:70` (320)
- INF-16 Home state contract: `2073:3389`

Only frames on `30 — Redesign / Approved` are implementation authority.
`00 — Archive / Legacy` is historical evidence, `10 — Redesign / Brief &
References` supplies context, and `20 — Redesign / Exploration` remains
non-approved experimentation.

The former `Infusion Diffusion Designs WEB` Figma file (`GYiQd7QSAwCSaGtt0alKG2`)
is retired. Its links may remain in historical delivery records, but it must
not be cited by new implementation work, visual review, Storybook contracts,
or release approval. When a historical record needs a current counterpart,
link the applicable frame on `30 — Redesign / Approved` instead.

## Approved INF-16 homepage direction

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

- Figma approved frames: synced
- `DESIGN.md`: synced
- Runtime semantic CSS tokens: synchronized for color, typography, spacing, and focus in INF-17; the approved background primitive returns to scope in INF-24 and must be implemented as the shared contract described above
- Reusable components: Home-required navigation, actions, content primitives,
  product-card commerce states, and media fallback synchronized in INF-18
- Storybook contracts: INF-16 homepage, INF-17 runtime foundation, and INF-18
  Home-required component states synchronized; remaining templates pending
- Customer-facing templates: Home template and live route synchronized through
  INF-19; remaining templates pending

Do not implement from the provisional holding-page styles or archived frames.
Any intentional divergence from the approved Figma evidence must be recorded
here before implementation is treated as complete.

## Product and architecture constraints

- The storefront serves a South African luxury home-fragrance brand.
- Shopify remains the source of truth for products, variants, prices,
  inventory, carts, discounts, customers, orders, and fulfillment.
- Sanity remains the source of truth for editorial content.
- Next.js owns the customer-facing storefront.
- The experience must be accessible, mobile-first, and resilient to content
  extremes and constrained connections.
