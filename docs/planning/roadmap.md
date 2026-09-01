# Infusion Diffusion Roadmap

Last updated: 1 September 2026

## Current program state

The existing storefront, commerce integrations, and operational infrastructure
remain in the repository as a functional baseline. The previous storefront
design direction is retired and must not be used as approval for further UI
work. The redesign starts as a new program, beginning with Figma
organization and an approved design brief.

## Redesign sequence

- [x] Separate and label legacy Figma material; create the new redesign pages.
- [x] Approve a decision-complete visual direction and exact Figma frames.
- [x] Record approved frame URLs, semantic variables, responsive states,
      accessibility decisions, content extremes, and intentional divergences in
      `DESIGN.md`.
- [ ] Map the approved system to runtime tokens and Storybook.
- [ ] Implement reusable components and states.
- [ ] Implement templates and customer journeys from approved Figma evidence.
- [ ] Verify accessibility, performance, Storybook, unit, integration, and
      browser coverage before release review.

## Delivery boundaries

- Next.js owns the storefront experience.
- Sanity owns editorial content.
- Shopify owns catalog, price, inventory, carts, checkout, customers, and
  orders.
- Figma is the sole source of approved visual direction.
- Storybook is the executable contract for reusable UI states.

## Current phase

- Figma organization, foundation/component approval, responsive proofs, and the
  repository-readable `DESIGN.md` handoff are complete on
  `agent/design-pattern-sync`.
- Runtime semantic tokens, reusable components, Storybook contracts, and
  customer-facing templates remain pending.
- Existing live-site content must be migrated from Sanity and Shopify without
  generated replacements. Generate draft copy only for a confirmed new page.

Implementation may begin after the documentation branch is reviewed and merged,
using the exact approved Figma frames recorded in `DESIGN.md`. See
`docs/planning/redesign-context.md` for the complete handoff and residual risks.
