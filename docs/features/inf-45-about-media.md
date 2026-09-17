# INF-45 — About media refinement

## Scope and authority

Devon requested this visual refinement on 17 September 2026 after reviewing the
live About page: a new Imagegen landscape hero, optimized for web, and shorter,
square-like story images. This scoped follow-up to delivered INF-35 is owned by
Devon. INF-37's broader deferred refinement and dependencies remain unchanged.
Human visual acceptance and merge remain pending.

## Delivery contract

- About-only hero: `public/images/about/fragrance-still-life.webp`, 2160×720,
  90,484 bytes. Generated conceptual still life: amber glass, reeds, stone and
  linen with dark central space. This is evocative imagery, not a factual
  photograph of a workshop. No baked-in text, logo or invented product label.
- Source generated with the built-in Imagegen tool; PNG retained outside Git.
  Converted with Sharp to WebP quality 80, effort 6. Next Image serves responsive
  sizes. Homepage imagery no longer controls the About hero.
- Story previews: centered square cover crops, maximum min(400px,50svh).
  At 1440×1000 they are 400px tall versus the prior 872px viewport cap.
  Clicking still opens the full photograph with existing keyboard controls.
- Preserve all copy, Sanity gallery sources, market photos/captions, header,
  footer, account/cart state and other routes. No Sanity publication.

## Design synchronization

[Figma review section](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2776-883):
1440 `2776:884`, 768 `2776:974`, 390 `2776:1065`, 320 `2776:1150`.
Copies retain the original approved page composition and introduce only the
hero and story-media refinement. These copies are review-pending, not silently
promoted to approved. Historical header/footer in the copied frames are unchanged;
the runtime keeps the current shared components.

| Layer                           | Status                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Figma                           | Refinement frames synchronized; human review pending          |
| DESIGN.md / Impeccable contract | Updated to square previews and landscape hero                 |
| Semantic CSS tokens             | Existing roles reused; no token changes                       |
| GalleryViewer                   | About presentation refined; other gallery rendering unchanged |
| Combined About Storybook        | Hero fixture and documented contract updated                  |

## Verification

- Lint and TypeScript passed; 381 unit/integration tests passed.
- 21 About/gallery Storybook tests passed, including viewer keyboard/focus and
  missing/unavailable/long-content states.
- Storybook and Next production builds passed.
- Four About route Playwright tests passed at 1440, 768, 390 and 320 widths.
- Populated Storybook browser checks: square images measured 400, 400, 342,
  and 280px respectively; all source images loaded; no horizontal overflow;
  no WCAG A/AA axe violations in the About article.
- Inspected desktop/mobile crops and Figma hero. Read-only independent review
  found no runtime defects and requested the contract updates included here.
- Impeccable layout detector and git diff whitespace check passed.

Local screenshots and metrics are under `output/about-refinement` in the task
worktree (not committed). Final preview acceptance is the remaining visual gate.
