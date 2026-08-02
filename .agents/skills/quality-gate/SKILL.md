---
name: quality-gate
description: Run proportional verification for a change and return release-ready evidence rather than an unsupported success claim.
---

# Quality gate

1. Map each acceptance criterion to a test or inspection.
2. Run targeted Vitest during development, then lint, typecheck, all relevant unit/integration tests, Storybook tests/build, and Next build.
3. For UI changes, run Playwright at mobile and desktop sizes, check keyboard flow and console errors, and run axe plus Impeccable audit/detect.
4. For content/commerce changes, verify schema/API contracts, fallbacks, secrets, webhook signatures, cache invalidation, and failure states.
5. Review the diff for unrelated changes, temporary artifacts, skipped tests, hardcoded credentials, and accidental generated files.
6. Report commands, results, screenshots/URLs, untested areas, and residual risk. A failed or skipped required check means the gate did not pass.
