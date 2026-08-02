# Infusion Diffusion design system

Status: provisional until the approved Figma style guide is connected.

## Direction

The visual language should feel botanical, warm, tactile, and composed without becoming rustic, clinical, or generically “wellness.” Let typography, photography, proportion, and material detail carry the identity.

Avoid generic AI design tells: purple gradients, nested card grids, gratuitous pills, glowing surfaces, feature-icon tiles, excessive rounding, and vague decorative copy.

## Foundations

- Semantic CSS variables in `src/app/globals.css` are the token source of truth.
- Display typography is reserved for expressive headings and short statements.
- Body typography prioritizes clarity at mobile sizes.
- Color roles describe purpose (`primary`, `accent`, `muted`) rather than literal color names.
- Motion must explain state or hierarchy and respect reduced-motion preferences.
- All interactive targets are at least 44×44 CSS pixels.

## Components

- shadcn/ui source lives under `src/components/ui` and provides accessible primitives.
- Brand components compose primitives; feature code should consume brand components before styling primitives directly.
- Every reusable component has stories for default, interactive, disabled/loading/error, long-content, and responsive states where applicable.
- Figma component names should map to Storybook titles and code component names whenever practical.

## Design workflow

1. Read `PRODUCT.md` and the feature brief.
2. Inspect relevant Figma frames and variables through MCP.
3. Use Impeccable `shape` or `craft` to establish hierarchy and states.
4. Receive human approval before implementation when direction materially changes.
5. Implement through tokens and shadcn-based components.
6. Review in Storybook at mobile and desktop widths.
7. Run Impeccable `critique`, `audit`, and `polish` before preview approval.

Do not infer final brand values from the provisional holding page. Replace tokens deliberately when the style guide is approved, without changing stable component APIs unnecessarily.
