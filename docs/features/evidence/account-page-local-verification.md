# Account entry local verification

Captured from deterministic `SHOPIFY_E2E_FIXTURES=1` and `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true` local Playwright runs on the implementation branch. The screenshots contain only the inert `accounts.example.test` destination and no customer data.

- `account-1440.png`, `account-390.png`, `account-320.png`: hosted-handoff desktop and narrow layouts.
- Passed: targeted Vitest; full Vitest (183 tests); Storybook browser tests (203 tests); lint; typecheck; Storybook build; Next build; Playwright Account Chromium and mobile (six checks, including axe, health, no form, metadata and overflow).
- Local build reports the expected missing local Shopify catalogue configuration fallback; account fixture coverage is independent of it.

Preview remains pending: a human must verify the exact PR deployment with its server-only flag and sanctioned Storefront configuration, record only whether the returned field is valid HTTPS or null, and not authenticate. First rollback recommendation remains setting the server-only flag to `false` and redeploying.
