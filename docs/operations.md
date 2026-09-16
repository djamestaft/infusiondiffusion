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

1. After every pull-request push, run `corepack pnpm pr:gate <PR number>` (or `just pr-gate <PR number>`) from the delivery checkout. Do not call the handoff ready, request merge, or move to Preview review until the gate records GitHub's required `quality` check as passed for that checkout's HEAD and the current PR head. Pending, missing, skipped, cancelled, timed-out, or failed checks are red gates. The command checks once; rerun it when CI finishes.
   If GitHub drops a pull-request synchronize run, dispatch `CI` manually on the exact pull-request branch and run the same gate again; never substitute local evidence for a missing GitHub check.
2. CI passes formatting, lint, types, Vitest, Storybook tests/build, Next build, and Playwright.
3. Reviewer confirms acceptance criteria, accessibility, security boundaries, and screenshots.
4. Browser release debugger verifies the Vercel Preview and `/api/health`.
5. A human approves and merges the pull request.
6. Verify production homepage, metadata, health, content publishing, and runtime logs.

### Local PR gate

The SSSF factory and its old `justfile` were intentionally removed in the
27 August redesign reset (`15181f0`). The remaining factory-only instruction
was stale. `scripts/pr-gate.mjs` now performs this bounded check without the
retired factory, Python, or GitHub CLI dependencies.

The gate derives the GitHub repository from `origin` (or the sole configured
remote), requires local HEAD to equal the PR head in that repository, checks
the latest GitHub Actions `quality` result, and rechecks the PR head before
recording success. It accepts only completed/success. Authentication uses
`GH_TOKEN`, `GITHUB_TOKEN`, or the existing Git credential manager; credentials
are never written to the result. GitHub access is read-only.

Results are stored under `git rev-parse --git-path pr-gates/<PR number>.json`,
outside tracked files and separately for each worktree. Starting a new check
invalidates older success; failures remain red. A record is a timestamped
observation, not permanent permission: rerun after a push or CI rerun. It does
not replace independent review, Preview verification or human merge approval.

Use the pnpm command if `just` is not on PATH. Run `corepack pnpm test:gate`
for the gate's regression tests; CI runs the same suite.

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

## Account-entry hosted handoff

`SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false` is the default server-only gate for the
shared Account navigation and `/account` handoff. Only exact `true` enables entry.
Shopify owns sign-in and order history. Storefront API 2026-07 supplies the shop ID
and optional vanity account URL; without a vanity domain, use Shopify's standard
`https://shopify.com/<shop-id>/account` destination. A null vanity URL does not
mean accounts are disabled. See [INF-39](features/inf-39-customer-accounts.md).

Verify the hosted sign-in destination in Preview and have an inbox-controlled
customer verify their own orders, logout and return-to-store behavior. Production
account enablement retains Devon's approval after preview evidence. Roll back by
setting the flag to `false` and rebuilding; this hides Account and restores the
unavailable page without changing Shopify customer data. Account domains remain
an optional branding step in the final domain switchover.

## Persistent customer sessions (INF-39)

The new runtime is disabled by default. The hosted `/account` link remains the
fallback. Enable `SHOPIFY_CUSTOMER_SESSION_ENABLED=true` only after the following
setup and preview acceptance; keep `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true`.

- In Shopify Headless, use a **Confidential** Customer Account API client. Switching
  client type replaces its credentials. Use the new client ID and secret, stored as
  `SHOPIFY_CUSTOMER_CLIENT_ID` and `SHOPIFY_CUSTOMER_CLIENT_SECRET` server variables.
- Set `SHOPIFY_CUSTOMER_ORIGIN` to the exact HTTPS origin. Register
  `<origin>/account/callback` and `<origin>/account` as callback/logout URIs.
  The user registered `https://infusion-diffusion.vercel.app` on 16 September;
  a branch preview origin must also be registered before preview authentication.
- Connect Upstash Redis via Vercel, using the **Free** plan with `autoUpgrade=false`
  and `prodPack=false`. Devon approved an available free plan. Do not select a paid
  plan. Devon accepted marketplace terms; `infusion-customer-sessions-test` is created
  in iad1 and connected to Preview only. Its REST smoke passed. Keep Production
  isolated and use the returned REST URL/token as `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN` (map the integration's variable names if different).
- Generate a 32-byte random hex `SHOPIFY_CUSTOMER_SESSION_KEY` directly into secret
  storage, without printing it. Changing this key or origin/client configuration
  invalidates existing sessions. No `NEXT_PUBLIC_` credential variables.
- Local credentials can be entered in ignored `.env.local`; never paste them into
  chat, commits, screenshots, commands or logs. Never reuse the Storefront token.

Shopify confidential-client authentication uses Base64 of the literal
`client_id:client_secret`, without form-escaping punctuation first. Keep the
Shopify-specific `ClientAuth` adapter for code exchange and refresh; the generic
OAuth `ClientSecretBasic` encoder escapes UUID hyphens and causes `invalid_client`
on this provider. Both grant bodies must include `client_id`. See the
[Shopify authentication contract](https://shopify.dev/docs/api/customer/latest#authorization-header-confidential-client-only).
Regression tests must use punctuated synthetic credentials.

The real Customer Account ID token returned a numeric `sub` on 16 September 2026.
The pinned `oauth4webapi@3.8.8` pnpm patch accepts only positive safe integers from
Shopify authentication issuers and normalizes the parsed subject to a decimal
string after issuer/audience checks. Other providers retain strict string-only
subjects. The signed JWT bytes are never changed; `enableNonRepudiationChecks`
must remain enabled for code and refresh grants. Nonce, state, PKCE, expiry and
refresh subject matching remain enforced. Keep the patch, workspace declaration
and lock hash together. Before updating this dependency, re-evaluate whether the
patch is still needed and rerun numeric/string subject, forged-signature, invalid
claim, refresh-identity and original-token-preservation tests. Do not drop the
patch or disable token checks to get an upgrade through CI.

Sessions last at most seven days. The opaque Secure/HttpOnly/SameSite=Lax cookie
contains no profile/tokens. Redis holds AES-GCM encrypted token bundles with TTL,
origin/client key namespaces, revocable login transactions and atomic refresh.
The browser requests only normalized name/email/initials through private,
no-store `/api/account`; personal details are absent from shared page HTML.
Focus/return revalidates identity, and logout notifies other tabs to clear it.
Shopify is authoritative for identity and orders; no account/order database is
created. There is no process-memory production fallback during an outage.

Current discovery validation supports the store's default `shopify.com` account
authentication endpoints. Before introducing an account vanity domain, update
and review endpoint validation. INF-42 must register final-domain callback/logout
URIs, update the configured origin, and repeat real authentication checks.
Hosted-only sign-in still needs a storefront OAuth round trip. Independent logout
on Shopify does not promise immediate revocation of our existing refresh grant;
verify provider behaviour before making a global-logout claim.

Validation: `corepack pnpm test src/lib/shopify/customer-account` runs actual OIDC
signature/claim checks against a synthetic issuer response. For distributed Redis
invariants, start the isolated container with
`docker run --detach --rm --name inf39-session-test redis:7-alpine`, run
`node scripts/check-account-redis.mjs`, then stop that owned container. This covers
lease ownership, stale refresh, TTL and callback/logout races against real Redis.
It does not replace a real Upstash/Shopify login, token refresh, logout and
customer-isolation test before activation.

Rollback: disable `SHOPIFY_CUSTOMER_SESSION_ENABLED` and redeploy the reviewed
branch. The previous hosted handoff remains available; no customer data migration
is needed. Redis session records expire automatically. Leave Payfast in Test mode.

The provider logout redirect uses Shopify's standard `id_token_hint` query
parameter only on the verified Shopify logout endpoint. Do not log redirect
headers or full authentication URLs. Access/refresh tokens never enter URLs.
Run `corepack pnpm test:customer` for isolated fixture-browser session journeys;
CI runs that suite and real Redis invariants as well as the existing quality gate.
