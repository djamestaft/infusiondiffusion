# Account entry local verification

Captured from deterministic `SHOPIFY_E2E_FIXTURES=1` and
`SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true` local Playwright runs. The screenshots
contain only the inert `accounts.example.test` destination and no customer data.

- `account-1440.png`, `account-390.png`, `account-320.png`: hosted-handoff desktop and narrow layouts.
- The Account suite passed 43 Chromium/mobile checks, with one duplicate keyboard check skipped because the Chromium project already exercises the same 320px CSS viewport. Its non-production Storybook iframe fixtures prove 1440/390/320 responsive disabled, configuration-missing, not-provisioned, provider-error, and long-content states; natural-height containment and no horizontal overflow; Tab-driven Home → Account → Cart → Menu → hosted-action order with visible focus; effective 200% CSS-viewport reflow; and loading reduced-motion pulse removal. The production Next.js build emits no `e2e-account` route.
- Targeted Vitest passed 19 tests. Full Vitest passed 194 tests and Storybook browser tests passed 204 tests. Lint, typecheck, Storybook build, Next build, `pnpm check`, and the Figma handoff gate all exited 0; see `account-command-record.md` for the command-level record.
- The local build reports the expected missing Shopify catalogue configuration fallback; account fixture coverage is independent of it.

## Pull request

- PR: https://github.com/djamestaft/infusiondiffusion/pull/47
- Authenticated Preview release review completed for exact commit `f7b5129a6390a91261859c2304bebae04ba0370d`.
- The PR body records the implementation plan, approved Figma authority, Shopify-only security boundary, local green evidence, remaining Preview gate, and the human-authorized rollback flag.

## Authenticated Preview result

- `quality`, Vercel, Vercel Preview Comments, and `just pr-gate 47` passed for the reviewed commit.
- The authenticated release review observed `/api/health` at `f7b5129`, the safe unavailable `/account` state at desktop and 347×605, no local account controls or customer/order content, no hosted handoff action, no exposed destination, no observed clipping/overflow, and no displayed console error.
- The review did not authenticate to Shopify, follow a hosted handoff, inspect a live destination, or alter the server-only flag.

Only two Preview checks remain pending: the sanctioned sanitized flag-state observation (valid HTTPS versus null, without retaining a URL) and Preview keyboard/axe checks. The first rollback recommendation remains setting the server-only flag to `false` and redeploying.
