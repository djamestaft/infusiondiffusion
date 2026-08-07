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

1. After every pull-request push, run `just pr-gate <PR number>`. Do not call the handoff ready, request merge, or move to Preview review until the factory records GitHub's required `quality` check as passed. Pending, missing, skipped, cancelled, timed-out, or failed checks are red gates.
   If GitHub drops a pull-request synchronize run, dispatch `CI` manually on the exact pull-request branch and run the same gate again; never substitute local evidence for a missing GitHub check.
2. CI passes formatting, lint, types, Vitest, Storybook tests/build, Next build, and Playwright.
3. Reviewer confirms acceptance criteria, accessibility, security boundaries, and screenshots.
4. Browser release debugger verifies the Vercel Preview and `/api/health`.
5. A human approves and merges the pull request.
6. Verify production homepage, metadata, health, content publishing, and runtime logs.

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

## Codex agent coordination

Codex is the project coordinator for feature work. HerdR may host visible
terminal sessions, Treehouse owns checkout isolation when parallel writers are
approved, and protected GitHub pull requests remain the integration boundary.

- Before delegation, tell the user which specialist roles will run, what each
  owns, whether they can write, and which approval gate comes next.
- Keep status, questions, worker results, and changes of direction visible in the
  coordinator conversation. Do not hide material decisions behind background
  execution.
- Default to one delivery branch and one pull request. Use concurrent writing
  agents only for independently mergeable ownership after the user approves the
  proposed branches and pull-request topology.
- Research, design, review, and debugging agents remain read-only unless their
  bounded task explicitly requires a change. Never give ordinary agents
  production, Shopify Admin, Sanity write, webhook, or deployment credentials.
- Stop at the documented design, merge, production, editorial publish, and
  rollback gates.

Pi orchestration remains retired because its background-worker model did not provide enough operator visibility. That decision is separate from this repository’s **hard-required Pi client** for the project-local Figma MCP route; Pi is not part of the storefront runtime.

### Required Pi Figma MCP status and runbook

- **Activation complete:** `.pi/settings.json` activates exactly `pi-mcp-adapter@2.20.1` with bundled skills disabled. The adapter is aligned with the exact `package.json` development dependency. `.pi/mcp.json` contains the single lazy `figma` server at `https://mcp.figma.com/mcp` with host discovery off.
- **Catalog registration submitted; approval pending:** Figma MCP Catalog registration has been submitted. Approval is provider-owned and pending; no response timeline or approval outcome is implied.
- **Observed provider boundary:** a Dynamic Client Registration attempt received HTTP 403 **before** browser OAuth. This is a coarse, upstream DCR-policy observation, not an OAuth denial, successful registration, or proof of live Pi/Figma support.
- **Post-approval gates:** only after Figma approval is independently confirmed and a human authorizes a new task may browser OAuth, tool enumeration, and one bounded read-only lookup be attempted.

Until that approval, `python3 -m unittest adws.tests.test_pi_mcp_config` is the unconditionally permitted offline activation check. Run `pi list --approve` or the RPC command-surface check only after a human has recorded review and approval of Pi project trust for this exact checkout. If that evidence is absent, do not run or repeat either `--approve` command, and do not treat a prior invocation as verification evidence. Do not run `/mcp-auth figma`, `/mcp tools`, a Figma tool, a direct endpoint probe, a DCR retry or workaround, or another Catalog submission. Do not add OAuth credentials, client identifiers, headers, tokens, or claims of current live support.

A human must review project trust for the exact checkout before its extension executes. Any future OAuth credential belongs only in the OS credential store. Never retain or report OAuth URLs, codes, tokens, identities, registration payloads or responses, or MCP result payloads. Sanitized evidence is limited to the adapter version, endpoint policy, submitted/pending state, the coarse pre-OAuth HTTP 403 location, and post-approval success or failure.

After approval, a separately authorized human-gated task may inspect the tool schema, enumerate tools, and make exactly one bounded read-only lookup. If `figma_whoami` is unavailable, use only a clearly read-only metadata lookup for the approved file/node after schema inspection; do not request exports, comments, broad file data, or modifying tools. OAuth denial, unavailable browser, insufficient scope, or another provider policy response remains a human approval gate, not a configuration workaround.

Rollback is a reviewed documentation/configuration revert that preserves the hosted endpoint in `.pi/mcp.json`; never restore immediate-auth guidance, expose credentials, or treat another client’s Figma MCP history as evidence that Pi is approved.

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
