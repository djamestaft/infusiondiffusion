# Operations

## Environments

- Local: `.env.local`, fallback content permitted.
- Preview: Vercel Preview for each pull request, Sanity preview dataset/config, no production Shopify Admin token.
- Production: protected `main`, production Sanity dataset, production Shopify storefront credentials.

Copy `.env.example` to `.env.local`. Obtain secrets from the relevant service; never move them into public variables.

## Release gate

1. CI passes formatting, lint, types, Vitest, Storybook tests/build, Next build, and Playwright.
2. Reviewer confirms acceptance criteria, accessibility, security boundaries, and screenshots.
3. Browser release debugger verifies the Vercel Preview and `/api/health`.
4. A human approves and merges the pull request.
5. Verify production homepage, metadata, health, content publishing, and runtime logs.

## Parallel agent delivery

- Keep the primary checkout clean for coordination and review. Allocate every concurrent writing agent a leased Treehouse worktree and its own `agent/<task-slug>` branch using `.agents/skills/parallel-agent-worktrees/SKILL.md`.
- Integrate each task through a pull request so CI and Vercel Preview evaluate the exact branch before a human merges it.
- Sequence work that shares migrations, generated files, lockfiles, or the same component boundary unless ownership can be divided safely.
- Treat worktrees as file isolation, not secret or service isolation. Give concurrent servers unique ports and keep credentials in ignored, least-privilege environment files.

## Incident response

Capture the failing URL, deployment ID, commit SHA, timestamp, browser evidence, console/network output, and Vercel logs. Reproduce before changing code. If production is materially broken, recommend restoring the last known-good Vercel deployment; only a human may authorize the rollback. After resolution, add the missed regression check to CI or the relevant skill.

## Sanity content invalidation

Published changes in the `j222nd1i.production` dataset are coordinated by the
`invalidate-tags` Sanity Sync Tag function. The storefront's `SanityLive`
subscription waits for that function before refreshing, which prevents a live
event from racing Vercel's tagged cache.

- Preview infrastructure changes with `pnpm exec sanity blueprints plan`.
- Deploy the function with `pnpm exec sanity blueprints deploy` after the
  storefront pull request is approved.
- Inspect deployed configuration with `pnpm exec sanity functions list --verbose`
  and runtime failures with `pnpm exec sanity functions logs invalidate-tags`.
- Keep exactly one Sync Tag invalidate function attached to a dataset.
- If publishing stops updating the storefront, inspect function logs first. A
  failed `done()` call is deliberately thrown so Sanity records the invocation
  as failed instead of acknowledging stale cache state.

## External provisioning still required

1. Create a GitHub repository, push this code, and protect `main` with required checks.
2. Create a Sanity project and production dataset; populate `.env.local`, configure CORS for local/Vercel URLs, and create least-privilege preview credentials.
3. Import the repository into Vercel, set Preview and Production variables separately, then verify a preview before enabling production.
4. Install Superpowers from the Codex plugin marketplace.
5. Connect Figma MCP and authorize only the required design files.
6. In the commerce phase, create a clean Shopify store and complete the South African payment-gateway and fee audit before checkout work.
