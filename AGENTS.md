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

1. Work from explicit acceptance criteria. For UI work, shape and critique the design before implementation.
2. Use semantic design tokens and existing shadcn-based primitives. Do not introduce one-off raw colors or duplicate primitives.
3. Add or update Storybook stories whenever a reusable component or meaningful state changes.
4. Use Vitest for units and integrations; use Playwright for async Server Components and user journeys.
5. Preserve accessibility: semantic HTML, keyboard behavior, visible focus, WCAG AA contrast, reduced motion, and content extremes.
6. Shopify is the source of truth for products, variants, prices, inventory, carts, discounts, customers, orders, and fulfillment. Sanity may reference Shopify IDs but must not duplicate commerce state.
7. Admin API tokens, Sanity write/read tokens, webhook secrets, and deployment credentials are server-only. Never commit secrets or expose them via `NEXT_PUBLIC_*`.
8. Agents may verify Vercel previews. Production requires a green protected branch and explicit human merge; never run a direct production deployment unless the user explicitly authorizes it.
9. Preserve unrelated user changes. Report verification evidence and residual risk at every handoff.
10. When recurring review feedback reveals a durable rule, update the nearest relevant guidance or skill.
11. Keep approved Figma, `DESIGN.md`, runtime semantic tokens, and Storybook component contracts synchronized. Follow `.agents/skills/design-to-storybook/SKILL.md`, name any intentional divergence, and never treat the provisional holding-page styles as approved brand truth.
12. Concurrent implementation agents must use separate Treehouse-managed worktrees and task branches. Follow `.agents/skills/parallel-agent-worktrees/SKILL.md`; never let two writing agents share a checkout or branch, and integrate through reviewed pull requests rather than editing `main`.
