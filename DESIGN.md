# Design reset — Infusion Diffusion

Status: no storefront redesign direction is approved for implementation.

The previous visual system, Figma frames, component mappings, tokens, and
template claims are retired as implementation authority. They may be used only
as historical reference; do not extend, copy, or treat them as approved brand
truth.

## Required order of work

1. In Figma, clearly isolate legacy material and create a dedicated new
   redesign area.
2. Define and approve the new visual direction, exact Figma targets, semantic
   variables, responsive states, and accessibility decisions.
3. Record the approved Figma URLs and node IDs here.
4. Map the approved variables to runtime semantic tokens and Storybook before
   implementing customer-facing pages.

## Figma organization contract

Use page names that make design status unmistakable:

- `00 — Archive / Legacy` — previous concepts and references; never an
  implementation source.
- `10 — Redesign / Brief & References` — research, constraints, and the
  approved brief.
- `20 — Redesign / Exploration` — non-approved experiments.
- `30 — Redesign / Approved` — the only implementation source; every approved
  frame must carry a clear status label and desktop/mobile state.

No implementation may begin until an exact frame from `30 — Redesign /
Approved` is approved by a human and recorded here.

## Product constraints that remain true

- The storefront serves a South African luxury home-fragrance brand.
- Shopify remains the commerce source of truth.
- Sanity remains the editorial content source.
- The experience must be accessible, mobile-first, and resilient to content
  extremes and constrained connections.
