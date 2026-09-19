# Fragrance consultation preview evidence

INF-58 extends PR109 on the existing delivery branch. The five-question consultation includes Reset guide from questions and results, directional500ms headings,420ms staggered answer text and bounded decorative LERP. Headings retain programmatic focus with outline:none; interactive focus remains visible.

Figma exploration: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2876-963

- `design-handoff.md`: initial layout contract; `design-refinement.md` supersedes timings, reset placement and title focus treatment.
- `code-review.md`: independent code review, scoped correction and verification.
- `visual-review.md` and `visual-confirmation.json`: independent actual-source visual review at1440,1280×720,390 and320px; both findings corrected.
- `laptop-question.png`, `phone-summary.png`: runtime inspection captures.

Local verification:32 catalog/matcher tests,12 guide/hero tests,30 guide/control Storybook cases and12 guide/navigation Playwright journeys passed. The Impeccable detector reports no findings. Full `pnpm check` passes:437 unit tests,405 Storybook cases, formatting, lint, types and both Storybook/Next production builds. The immutable deployed matrix is recorded in the delivery comment after publication.

The matcher remains notes/character only, disclosed in the UI. No new source claims, prices or commerce mutations. Existing full-route no-JavaScript streaming limitation and physical-device acceptance remain open. No merge or production deployment.

Combined branch verification after preserving carousel/basket commits through c21e8d8:443 unit tests,417 Storybook tests and both builds pass. The new SplitText dynamic import is pre-bundled in the Storybook test runner to avoid dependency-discovery reloads. Carousel browser regression:11 passed,1 intentional mobile keyboard-only skip. Guide source journeys:6/6 passed after integration.
