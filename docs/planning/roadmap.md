# Infusion Diffusion Roadmap

Last updated: 3 September 2026

## Current program state

The existing storefront, commerce integrations, and operational infrastructure
remain in the repository as a functional baseline. The previous storefront
design direction is retired and must not be used as approval for further UI
work. The redesign starts as a new program, beginning with Figma
organization and an approved design brief.

## Roadmap governance

`docs/planning/roadmap.md` is the strategic source of truth for delivery order,
scope, decision gates, and system boundaries. The Infusion Diffusion Plane
project (`INF`) is the execution ledger: every active delivery item must name
its approved Figma evidence, accountable owner, dependencies, and required
human gate.

Before starting a roadmap item, the core agent must refresh protected `main`,
re-read this document, retrieve the matching Plane ticket, and reconcile any
conflict. Update this roadmap and Plane together when the approved direction or
sequence changes; do not silently infer readiness from a Done state alone.

## Redesign sequence

- [x] Separate and label legacy Figma material; create the new redesign pages.
- [x] Approve the initial Home visual direction and exact Figma frames.
- [x] Record approved frame URLs, semantic variables, responsive states,
      accessibility decisions, content extremes, and intentional divergences in
      `DESIGN.md`.
- [x] Map the approved color, typography, spacing, and focus system to runtime
      tokens and Storybook. The approved tapered-reed background returns to
      scope for the Home delivery.
- [x] Implement the initial Home-required reusable components and states.
- [ ] Complete the Home source-consolidation PR and secure human parity/merge
      approval. The protected branch and current production do not yet render
      the approved midnight Home composition.
- [ ] Approve the global shell and commerce-journey scope before route-family
      design begins.
- [ ] Design and approve Shop/product and editorial route templates from
      `30 — Redesign / Approved` before their implementation begins.
- [ ] Implement templates and customer journeys from their approved Figma
      evidence.
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

- INF-14 through INF-20 are historical delivery records, not proof that the
  approved redesign is live. Their stated Home release and shared-background
  completion must be reconciled with current Figma, source, and preview
  evidence.
- Protected `main` and the production deployment at `8573d8e` remain healthy
  but render the legacy light/sage Home hero. The approved midnight Home has
  unmerged implementation work and requires reviewable Preview evidence before
  a human merge decision.
- INF-21 has locked visual authority and returned the approved tapered-reed
  background to the Home delivery scope. INF-22 and INF-23 remain Devon's
  required product/release decisions: Home parity/merge approval; and global
  shell plus commerce-journey scope. INF-28 separately records the
  source-owned content and metadata approvals.
- After those gates, Shawnee owns INF-24 Home consolidation, INF-25 independent
  Home verification, INF-26 Shop/product Figma approval, and INF-27 editorial
  route Figma approval. Implementation tickets for those remaining route
  families are intentionally not scheduled before their Figma contracts exist.
- Existing live-site content must be migrated from Sanity and Shopify without
  generated replacements. Generate draft copy only for a confirmed new page.

## Active remediation: redesign-source consolidation

- The new `Infusion Diffusion Redesign` file (`jIMvwSBkilg7eplo3IiHPa`) is the
  only active design file.
- `30 — Redesign / Approved` (`2004:14`) is the sole implementation authority.
- `20 — Redesign / Exploration` (`2004:8`) may inform future review but cannot
  authorize runtime styling or replace an approved frame.
- The retired `GYiQd7QSAwCSaGtt0alKG2` file remains historical evidence only.

Implementation proceeds only after the relevant approval gate, using the exact
approved Figma frames recorded in `DESIGN.md`. See
`docs/planning/redesign-context.md` for the earlier handoff and residual risks.
