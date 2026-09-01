# Runtime foundation

Status: Implemented for INF-17

## Outcome

Approved color, typography, spacing, and focus decisions are available through the existing runtime semantic-token API and are demonstrated in Storybook without changing page composition.

## Acceptance criteria

1. Sage 050, Ink 900, Graphite 700, Bone 050, Porcelain 000, Gold 700/500/300, Olive 700, and Resin 700 exist as named primitives.
2. Light mode maps canvas/text to Sage 050/Ink 900 and primary default/hover/focus to Gold 500/Gold 300/Gold 700. Dark mode maps primary/focus to Gold 300 with Ink 900 labels.
3. Marcellus remains the display family; Manrope remains the body, UI, price, and commerce family.
4. The approved 4, 8, 12, 16, 24, 32, 48, 64, and 96px spacing steps are exposed to runtime utilities.
5. Shared buttons preserve a 44px minimum target and use a 3px, mode-aware visible focus outline.
6. Storybook proves the foundation at 1440, 768, 390, and 320px.

## Out of scope

- The approved tapered-reed background primitive is intentionally deferred by the product owner.
- Page-template integration, content changes, and new image assets.
- Production deployment or merge without human approval.

## Approved source

- Figma `Approved / 02 / Foundation / 01 / Color Roles` (`2039:106`)
- Figma `Approved / 03 / Foundation / 02 / Typography` (`2039:211`)
- Figma `Approved / 04 / Foundation / 03 / Layout Material Interaction` (`2039:253`)
- `DESIGN.md`
