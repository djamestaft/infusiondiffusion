---
name: design-to-storybook
description: Shape and implement approved Figma or brand direction through Impeccable, semantic tokens, shadcn/ui, and Storybook.
---

# Design to Storybook

## Sources of truth

- Approved visual intent and variables: the Figma file and exact approved frame recorded in `DESIGN.md`.
- Durable repository-readable visual rules: `DESIGN.md` and `.impeccable/design.json`.
- Runtime token implementation: semantic CSS variables in `src/app/globals.css`.
- Reusable component contracts and states: Storybook stories and the corresponding source component.

These layers describe different parts of one system. A change is unfinished while they disagree without a documented, approved reason.

1. Read `PRODUCT.md` and `DESIGN.md`; inspect existing tokens, primitives, stories, and the target route.
2. Use Figma MCP to capture frame URLs/IDs, variables, layout rules, assets, states, and breakpoints. If Figma is missing, stop before inventing final brand direction and label any exploration provisional.
3. Use Impeccable `shape` for hierarchy and `craft` only when visual exploration is authorized.
4. Map Figma variables to semantic tokens. Extend existing shadcn-based primitives before creating new low-level components.
5. Implement the component in Storybook first with default, interaction, error/empty/loading, long-content, and responsive stories as applicable.
6. Run Storybook tests, Vitest, Impeccable detection/audit, and Playwright against the integrated page.
7. Compare screenshots to the approved frame at mobile and desktop sizes. Report intentional deviations.

## Synchronization workflow

1. Start from an exact Figma file and node URL. Confirm whether it is exploratory or approved.
2. For an approved foundation change, update Figma variables/styles and `DESIGN.md` in the same task. Regenerate `.impeccable/design.json` when `DESIGN.md` changes.
3. Map approved Figma semantic variables to `src/app/globals.css`; preserve semantic names even when primitive values change.
4. For an approved component change, keep the Figma component name, code component name, and Storybook title aligned. Update meaningful states in all three representations.
5. If a correction starts in code, update Figma and repository guidance before sign-off. Do not allow a code-first hotfix to become an undocumented design-system fork.
6. Verify variable values, mode behavior, typography, radii, spacing, focus treatment, component states, and mobile/desktop screenshots.
7. End every handoff with a sync matrix for Figma, `DESIGN.md`, CSS tokens, components, and Storybook. Mark each `synced`, `pending`, or `intentional divergence` with a reason.

When a phase intentionally stops before implementation, record the pending layers plainly. Pending is acceptable; silent drift is not.

Never use screenshot pixels as inaccessible HTML, bake UI copy into raster assets, or change a stable component API solely to match one frame.
