# Infusion Diffusion agent guidance

This repository is a headless commerce storefront. Next.js owns the customer-facing experience, Sanity owns editorial content, and Shopify owns commerce truth.

## Read first

- Product intent and audience: `PRODUCT.md`
- Visual system and UI rules: `DESIGN.md`
- Architecture and system boundaries: `docs/architecture.md`
- Delivery, environments, and incidents: `docs/operations.md`

Keep this file short. Put reusable procedures in `.agents/skills` and deeper explanations in `docs`.

## Commands

- Install: `corepack pnpm install --frozen-lockfile`
- Develop: `corepack pnpm dev`
- Storybook: `corepack pnpm storybook`
- Fast verification: `corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test`
- Full local gate: `corepack pnpm check`
- Browser tests: `corepack pnpm exec playwright install chromium && corepack pnpm test:e2e`

## Non-negotiable rules

1. Before selecting or starting roadmap work, confirm the checkout is safe to update, fetch the configured remote, fast-forward the protected branch, and re-read `docs/planning/roadmap.md`. Never choose the next task from stale local state; if local changes prevent a safe update, report that before proceeding.
2. Work from explicit acceptance criteria. For UI work, shape and critique the design before implementation.
3. Use semantic design tokens and existing shadcn-based primitives. Do not introduce one-off raw colors or duplicate primitives.
4. Add or update Storybook stories whenever a reusable component or meaningful state changes.
5. Use Vitest for units and integrations; use Playwright for async Server Components and user journeys.
6. Preserve accessibility: semantic HTML, keyboard behavior, visible focus, WCAG AA contrast, reduced motion, and content extremes.
7. Shopify is the source of truth for products, variants, prices, inventory, carts, discounts, customers, orders, and fulfillment. Sanity may reference Shopify IDs but must not duplicate commerce state.
8. Admin API tokens, Sanity write/read tokens, webhook secrets, and deployment credentials are server-only. Never commit secrets or expose them via `NEXT_PUBLIC_*`.
9. Agents may verify Vercel previews. Production requires a green protected branch and explicit human merge; never run a direct production deployment unless the user explicitly authorizes it.
10. Preserve unrelated user changes. Report verification evidence and residual risk at every handoff.
11. When recurring review feedback reveals a durable rule, update the nearest relevant guidance or skill.
12. Keep approved Figma, `DESIGN.md`, runtime semantic tokens, and Storybook component contracts synchronized. Follow `.agents/skills/design-to-storybook/SKILL.md`, name any intentional divergence, and never treat the provisional holding-page styles as approved brand truth.
13. Concurrent implementation agents must use separate Treehouse-managed worktrees and task branches. Follow `.agents/skills/parallel-agent-worktrees/SKILL.md`; never let two writing agents share a checkout or branch, and integrate through reviewed pull requests rather than editing `main`.
14. Codex is the project agent coordinator. Before delegating, tell the user which roles will run, what each owns, and where human approval is required. Keep implementation on one delivery branch by default; create multiple writing agents, worktrees, or pull requests only when the user approves that topology.
15. Pi may scope and validate one typed Figma evidence fallback only: deterministic SSSF code may launch only Codex CLI `0.147.0` through the official `figma` connector for exact approved read-only nodes. Pi must never launch Codex directly; static indirection is denied fail-closed, readiness requires a complete sanitized `worker_tool` trace binding, and only a repository-configured trusted approver may authorize it. Codex has no repository write, merge, publish, deployment, production, or rollback authority, and humans retain all approval gates.
