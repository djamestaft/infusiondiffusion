# Infusion Diffusion Roadmap

Last updated: 27 August 2026

## Current program state

The existing storefront, commerce integrations, and operational infrastructure
remain in the repository as a functional baseline. The previous storefront
design direction is retired and must not be used as approval for further UI
work. The redesign starts as a new program, beginning with Figma
organization and an approved design brief.

## Redesign sequence

- [ ] Separate and label legacy Figma material; create the new redesign pages.
- [ ] Approve a decision-complete visual direction and exact Figma frames.
- [ ] Record approved frame URLs, semantic variables, responsive states,
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

## Current blockers

- Figma page organization has not been completed in a write-enabled session.
- No new visual direction or implementation frame has human approval.

No redesign implementation work may start until both blockers are resolved.
