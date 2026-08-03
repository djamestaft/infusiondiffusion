# Operations

## Environments

- Local: `.env.local`, fallback content permitted.
- Preview: Vercel Preview for each pull request, Sanity preview dataset/config, no production Shopify Admin token.
- Production: protected `main`, production Sanity dataset, production Shopify storefront credentials.

Copy `.env.example` to `.env.local`. Obtain secrets from the relevant service; never move them into public variables.

## Runtime version

- Local development and CI use the exact Node release in `.nvmrc`.
- `package.json` constrains supported development and build runtimes to the same Node major.
- Vercel uses the corresponding Node major for Preview and Production deployments.
- Update `.nvmrc`, the `package.json` engine constraint, and the Vercel project setting together. Verify the full local gate and a Vercel Preview before merging.

## Release gate

1. CI passes formatting, lint, types, Vitest, Storybook tests/build, Next build, and Playwright.
2. Reviewer confirms acceptance criteria, accessibility, security boundaries, and screenshots.
3. Browser release debugger verifies the Vercel Preview and `/api/health`.
4. A human approves and merges the pull request.
5. Verify production homepage, metadata, health, content publishing, and runtime logs.

## Human approval points

Agents prepare evidence and recommendations at each gate, but do not substitute
their own approval for the named human decision.

| Gate              | Required evidence                                                                                  | Human decision                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Design            | Decision-complete brief, approved Figma frames, responsive states, and Storybook review            | Approve the visual and interaction contract before implementation is treated as final                                    |
| Merge             | Green required checks, independent review, and a reviewable Vercel Preview                         | Approve and merge the pull request; agents never merge their own delivery work                                           |
| Production        | Protected `main`, successful Vercel deployment, health check, and smoke-test plan                  | Authorize production promotion when it is not the automatic result of an approved merge                                  |
| Editorial publish | Valid Studio document and a preview of the intended content state                                  | Publish, disable, or schedule content in Sanity                                                                          |
| Rollback          | Confirmed impact, failing deployment or content state, and a named last-known-good recovery target | Authorize a Vercel rollback or destructive content recovery; reversible Sanity feature switches may be used by an editor |

Design rejection returns to the brief or Figma contract. Failed code or Preview
evidence returns to implementation. A failed production smoke test triggers
incident response; it never relaxes a gate.

## Parallel agent delivery

- Keep the primary checkout clean for coordination and review. Allocate every concurrent writing agent a leased Treehouse worktree and its own `agent/<task-slug>` branch using `.agents/skills/parallel-agent-worktrees/SKILL.md`.
- Integrate each task through a pull request so CI and Vercel Preview evaluate the exact branch before a human merges it.
- Sequence work that shares migrations, generated files, lockfiles, or the same component boundary unless ownership can be divided safely.
- Treat worktrees as file isolation, not secret or service isolation. Give concurrent servers unique ports and keep credentials in ignored, least-privilege environment files.

## Incident response

Capture the failing URL, deployment ID, commit SHA, timestamp, browser evidence, console/network output, and Vercel logs. Reproduce before changing code. If production is materially broken, recommend restoring the last known-good Vercel deployment; only a human may authorize the rollback. After resolution, add the missed regression check to CI or the relevant skill.

## Sanity content invalidation

Published changes in the `j222nd1i.production` dataset are coordinated by the
`invalidate-tags` Sanity Sync Tag function. The function sends the event's sync
tags to the protected production `/api/revalidate-tags` route before calling
`done()`. Production `SanityLive` subscriptions wait for that completion, which
prevents a live event from racing Vercel's tagged cache.

- Preview infrastructure changes with `pnpm exec sanity blueprints plan`.
- Deploy the function with `pnpm exec sanity blueprints deploy` after the
  storefront pull request is approved.
- Inspect deployed configuration with `pnpm exec sanity functions list --verbose`
  and runtime failures with `pnpm exec sanity functions logs invalidate-tags`.
- Keep exactly one Sync Tag invalidate function attached to a dataset.
- Configure the same `SANITY_REVALIDATE_TAGS_SECRET` as a server-only Production
  variable in Vercel and on the function. Configure the function's
  `SANITY_REVALIDATE_TAGS_ENDPOINT` as the production route URL.
- If publishing stops updating the storefront, compare the Content Lake
  `_updatedAt`, function logs, endpoint response, and Vercel cache headers. The
  function deliberately throws when the route or `done()` fails so Sanity does
  not acknowledge stale cache state.

## Remaining external provisioning

1. Install Superpowers from the Codex plugin marketplace if it remains useful to the delivery workflow.
2. Obtain the Figma plan and seat required for Code Connect if direct component mapping becomes necessary.
3. Add the final production domain and validate DNS.
4. In the commerce phase, audit the existing Shopify store and complete the South African payment-gateway and fee review before checkout work.
