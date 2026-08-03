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
6. Before handoff, reconcile the feature brief and project roadmap with the delivered state. Update completed milestones, current phase wording, and immediate next actions when the task changes them; otherwise state that no roadmap change was required. Do not leave an item described as active or pending after its evidence has landed.
7. Report commands, results, screenshots/URLs, untested areas, roadmap status, and residual risk. A failed or skipped required check means the gate did not pass.
