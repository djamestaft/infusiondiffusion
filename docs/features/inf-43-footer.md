# INF-43 — Approved footer refinement

Devon approved the Figma design and authorized implementation and push on
16 September 2026. This is a bounded follow-up to completed INF-34; Devon owns
implementation. PR #92 was human-merged on 16 September 2026 as `062674d`. INF-43 is Done; full launch review remains INF-36.

## Authority and acceptance

[Approved footer section](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2730-37)
now lives on Approved page `2004:14`. Component set `2733:61` preserves variants
`2730:45`, `2730:75`, `2730:106`, `2730:139` at 1440/768/390/320. It supersedes
the footer composition in `2358:82`, including earlier centered-navigation and
right-aligned copyright instructions. Other approved page compositions stay.

- Reuse the logo asset and approved colours. Crop only its horizontal whitespace
  to align the visible mark; the Gold 300 inverse-link token matches Figma.
- Marcellus Regular headings use 18/26; Manrope Regular supporting text and links
  use 15/24; copyright uses 13/20. Scope font smoothing to the footer for Figma
  parity on macOS without changing the rest of the site.
- Desktop: brand, Explore and Contact columns; tablet: brand above two columns;
  mobile: stacked sections with two navigation columns. Preserve all four routes,
  44px link targets and visible keyboard focus.
- Reuse the confirmed `defaultContactEmail` source. Keep one accessible email
  link; wrap after @ below 360px to match the compact frame. The brand line is
  existing homepage language. No service promises or new destination routes.
- Retain semantic surface/text/divider/focus roles and shared TextLink styling.

## Component inventory

| Component      | Source / consumers                                                         | Story states                                              | Decision                                |
| -------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------- |
| Footer         | `src/components/footer.tsx`; shared TemplateShell across storefront routes | Components/Footer: Desktop, Tablet, Mobile, MobileCompact | Change composition to approved variants |
| LogoTextLockup | Existing `logo-text-lockup.tsx` and SVG                                    | Exercised inside footer at four widths                    | Reuse; footer-only optical crop         |
| TextLink       | Existing `ui/text-link.tsx`                                                | Footer email and navigation; keyboard evidence            | Reuse component/variant styling         |

## Visual comparison

Fonts were loaded before capture. Screenshots cover the real Storybook component
and integrated Home footer. Captures use local deterministic Shopify fixtures;
they do not verify live commerce. Browser-reported footer heights are 399, 503,
551.17 and 555.17px, matching the Figma geometry (fractional mobile rounding <1px).
Columns, line breaks, logo edges, heading baselines, divider and copyright align.
Font smoothing resolved the initially heavier browser rendering. Remaining
subpixel text rasterization differences are platform rendering, with no intended
layout or typography divergence.

| Width | Figma                                          | Storybook                                          | Home                                           |
| ----- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| 1440  | [Reference](../evidence/inf-43/figma-1440.png) | [Component](../evidence/inf-43/storybook-1440.png) | [Integrated](../evidence/inf-43/home-1440.png) |
| 768   | [Reference](../evidence/inf-43/figma-768.png)  | [Component](../evidence/inf-43/storybook-768.png)  | [Integrated](../evidence/inf-43/home-768.png)  |
| 390   | [Reference](../evidence/inf-43/figma-390.png)  | [Component](../evidence/inf-43/storybook-390.png)  | [Integrated](../evidence/inf-43/home-390.png)  |
| 320   | [Reference](../evidence/inf-43/figma-320.png)  | [Component](../evidence/inf-43/storybook-320.png)  | [Integrated](../evidence/inf-43/home-320.png)  |

[Browser evidence](../evidence/inf-43/browser-report.json) records no overflow,
axe violations or page errors across all eight captures. Keyboard order is
home → Shop → Fragrance Guide → About → Contact → email, with visible outlines.
Independent read-only review also checked 320/360/640/1024 widths and found no
footer defects. Human merge is recorded above. Full storefront release acceptance remains INF-36.

## Verification

- Footer stories first failed because the Explore heading/email were absent,
  then all four passed after implementation.
- Full `corepack pnpm check`: formatting, lint, types, 289 unit/integration tests,
  319 Storybook checks, Storybook build and Next production build passed.
- Targeted Chromium shared-shell, navigation accessibility, About and Contact suites: 22 passed.
  The initial local run omitted `CI=true`, which is required alongside
  `SHOPIFY_E2E_FIXTURES=1`; this made catalogue pages unavailable. Restarting the
  isolated server with both flags resolved the failures without source changes.
- Contact menu regression now waits for the resolved page before interacting: the
  streamed loading shell owns a different menu instance. Earlier failures came
  from clicking that transient shell. Heading-count assertions are scoped to main
  content so the new footer headings do not affect page hierarchy checks.
- Impeccable detection and `git diff --check` passed.
- Remote current-head quality and preview evidence are recorded in the PR/Plane.

## Synchronization

| Layer                  | Status | Evidence                                                  |
| ---------------------- | ------ | --------------------------------------------------------- |
| Figma                  | synced | User-approved frames promoted intact to Approved          |
| DESIGN.md / Impeccable | synced | Footer contract and narrative updated                     |
| Semantic CSS tokens    | synced | Existing tokens reused; no global token changes           |
| Runtime component      | synced | Approved footer composition and contact link              |
| Storybook              | synced | Four responsive states, real fonts and interaction checks |

INF-43 is Done following the approved delivery, recorded review and human merge.
Payment/account, final content and launch dependencies are unchanged.
