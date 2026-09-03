# INF-25 Home parity and release evidence

Date: 3 September 2026  
Verified commit: `b4feec3b617238d36ecd258db45b169a9f5e8706` (protected `main`, PR #61)

## Approved source

- Figma file: [Infusion Diffusion Redesign](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2004-14)
- Home 1440: [`2070:2`](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2070-2)
- Home 768: [`2072:2`](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2072-2)
- Home 390: [`2073:2`](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2073-2)
- Home 320: [`2073:70`](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2073-70)
- State contract: [`2073:3389`](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2073-3389)

## Deployment evidence

- Vercel deployment inspector: <https://vercel.com/devon-james-tafts-projects/infusion-diffusion/81FkdRHW6BHVV8j9T97rg8y5NKLP>
- Immutable deployment: <https://infusion-diffusion-6w228591k-devon-james-tafts-projects.vercel.app> (Vercel authentication required)
- Public production alias: <https://infusion-diffusion.vercel.app/>
- Health: `GET https://infusion-diffusion.vercel.app/api/health` returned HTTP 200 with `status: ok` and `version: b4feec3`.
- GitHub check `quality` and Vercel deployment status both completed successfully for `b4feec3`.

## Verification results

| Check | Result | Evidence |
| --- | --- | --- |
| Responsive composition | Pass with visual deviations | Playwright passed 1440, 768, 390, and 320 layout/order/overflow checks; screenshots are stored beside this record. Direct comparison found the runtime closing section/footer treatment does not fully match the approved frames, and lazy below-fold imagery was not consistently present in the full-page capture. |
| Production smoke and axe | Pass | 10/10 selected production Home checks passed, including all four widths, SEO, WCAG A/AA axe scan, console errors, reduced-motion reveal, 320 shell/CTA, catalogue spacing, and `/api/health`. |
| Carousel controls and keyboard | Pass | Local Playwright verified visible controls, 44 px targets, keyboard pagination, manual pause/play, focus-driven pause, live status, bracket geometry, and reduced-motion autoplay suppression. |
| Long content | Pass before state transition | The 320 Storybook long-content frame rendered without horizontal overflow. |
| Empty catalogue | Blocked/fail | Storybook failed before rendering the empty state: `NextImage` raised `Cannot read properties of null (reading 'useContext')`; the expected recovery copy was absent. |
| Missing media | Partial | Component contracts exist for `MediaFallback` and carousel failed-media fallback, but the unit gate was invalidated by missing jest-dom matchers and worker timeouts; no independent green browser state proof was produced. |
| Formatting | Fail | `prettier --check .` reported 240 files, including unchanged baseline files and the pre-existing untracked `package-lock.json`. |
| Lint | Inconclusive | The repository lint command remained active without output beyond the bounded wait and was stopped; no pass is claimed. |
| Typecheck | Pass | `corepack pnpm typecheck`. |
| Unit tests | Fail | 53 failed / 47 passed, with missing jest-dom matcher registration and 14 worker-start timeouts under the local run. |
| Storybook tests | Fail/inconclusive | Browser-backed Storybook test run did not complete within the bounded run and was stopped. |
| Storybook build | Pass | `corepack pnpm build-storybook`. |
| Next production build | Fail | Compilation and TypeScript passed, then `/about` prerender failed with `Invariant: Expected workStore to be initialized`. |
| Local Home Playwright | Fail overall | 26 passed, 4 intentionally skipped mobile-only duplicates, 2 failed on the Storybook long/empty state path. |

## Release disposition and residual risk

INF-25 is **not release-ready** and must remain open. Production is healthy at the verified commit, but the required local gate is not green, the empty and missing-media state evidence is incomplete, and direct visual comparison identifies material parity deviations. These findings feed Devon's INF-22 decision; they do not authorize deployment, merge, Sanity publishing, Shopify mutation, or completion of INF-22.
