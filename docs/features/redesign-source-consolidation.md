# Redesign source consolidation

Status: In progress

## Outcome

The customer-facing storefront and its executable design contracts use the
approved page of the current Infusion Diffusion Redesign Figma file. The
retired Figma file cannot silently steer future implementation or release
review.

## Authority

- Active file: `jIMvwSBkilg7eplo3IiHPa`.
- Implementation authority: `30 — Redesign / Approved` (`2004:14`).
- Home contract: `2070:2` (1440), `2072:2` (768), `2073:2` (390),
  `2073:70` (320), and `2073:3389` (states).
- `20 — Redesign / Exploration` (`2004:8`) is a research input only.
- Retired file: `GYiQd7QSAwCSaGtt0alKG2`.

## Scope

- Replace active legacy Figma references in design guidance, component
  contracts, Storybook stories, and release criteria with approved current-file
  frames.
- Reconcile the Home route with the approved midnight navigation and hero,
  including the approved responsive composition and owned media fallback.
- Retain Sanity editorial and Shopify commerce boundaries; do not invent copy
  or mutate content/commerce sources.
- Add durable visual and accessibility evidence to the relevant Plane work
  item before it is closed.

## Out of scope

- Rewriting historical delivery records solely to erase their provenance.
- Implementing exploration frames.
- Sanity publication, Shopify mutations, checkout changes, or production
  deployment without human approval.

## Acceptance criteria

1. `DESIGN.md`, the roadmap, active feature specifications, and new tickets
   cite the current Figma file and exact approved nodes; retired-file links are
   explicitly historical or superseded.
2. Home matches the approved hero's midnight navigation/surface, light copy,
   pill action, media geometry, and responsive layouts at 1440, 768, 390, and
   320 pixels.
3. The Home carousel or fallback has an approved, accessible presentation;
   legacy decorative corner brackets do not appear unless an approved current
   Figma frame calls for them.
4. Shared tokens and Storybook stories express the same approved semantics as
   Figma; any remaining divergence is named, approved, and linked here.
5. Preview evidence includes visual comparison, keyboard, reduced-motion, axe,
   long-content, empty/media-fallback, and console checks before human release
   review.

## Intentional Home-media divergence

The approved desktop fallback box is 656×692. The live Home carousel renders
at 656×680 when multiple slides need visible controls inside the fixed
above-the-fold hero. This prevents the control row from being clipped by the
following collection section. The 390px fallback remains the approved
342×470. Reconcile this 12px desktop adjustment in Figma if the carousel
control treatment itself is approved as a permanent Home contract.
