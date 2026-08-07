# Account entry local verification

Captured from deterministic `SHOPIFY_E2E_FIXTURES=1` and
`SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true` local Playwright runs. The screenshots
contain only the inert `accounts.example.test` destination and no customer data.

- `account-1440.png`, `account-390.png`, `account-320.png`: hosted-handoff desktop and narrow layouts.
- The Account suite passed 43 Chromium/mobile checks, with one duplicate keyboard check skipped because the Chromium project already exercises the same 320px CSS viewport. Its non-production Storybook iframe fixtures prove 1440/390/320 responsive disabled, configuration-missing, not-provisioned, provider-error, and long-content states; natural-height containment and no horizontal overflow; Tab-driven Home → Account → Cart → Menu → hosted-action order with visible focus; effective 200% CSS-viewport reflow; and loading reduced-motion pulse removal. The production Next.js build emits no `e2e-account` route.
- Targeted Vitest passed 19 tests. Full Vitest passed 194 tests and Storybook browser tests passed 204 tests. Lint, typecheck, Storybook build, Next build, `pnpm check`, and the Figma handoff gate all exited 0; see `account-command-record.md` for the command-level record.
- The local build reports the expected missing Shopify catalogue configuration fallback; account fixture coverage is independent of it.

Preview verification remains a human gate and is intentionally out of scope for
this local correction. A future sanctioned Preview review must record only
whether the provider field is valid HTTPS or null, without authenticating or
recording a destination, token, customer, or order data. The first rollback
recommendation remains setting the server-only flag to `false` and redeploying.
