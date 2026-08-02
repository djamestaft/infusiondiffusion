---
name: design-to-storybook
description: Shape and implement approved Figma or brand direction through Impeccable, semantic tokens, shadcn/ui, and Storybook.
---

# Design to Storybook

1. Read `PRODUCT.md` and `DESIGN.md`; inspect existing tokens, primitives, stories, and the target route.
2. Use Figma MCP to capture frame URLs/IDs, variables, layout rules, assets, states, and breakpoints. If Figma is missing, stop before inventing final brand direction and label any exploration provisional.
3. Use Impeccable `shape` for hierarchy and `craft` only when visual exploration is authorized.
4. Map Figma variables to semantic tokens. Extend existing shadcn-based primitives before creating new low-level components.
5. Implement the component in Storybook first with default, interaction, error/empty/loading, long-content, and responsive stories as applicable.
6. Run Storybook tests, Vitest, Impeccable detection/audit, and Playwright against the integrated page.
7. Compare screenshots to the approved frame at mobile and desktop sizes. Report intentional deviations.

Never use screenshot pixels as inaccessible HTML, bake UI copy into raster assets, or change a stable component API solely to match one frame.
