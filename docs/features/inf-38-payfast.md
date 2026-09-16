# INF-38 — Payfast through Shopify checkout

Date: 16 September 2026. Owner: Devon. State: In Progress.

## Current evidence

- Devon confirms the client has created a Payfast account.
- Payfast is the selected replacement for Peach, whose onboarding was paused.
- Merchant verification, account type, current fees, dashboard access and Shopify
  app connection are not yet verified. Do not infer live readiness from signup.
- Runtime integration remains the existing Next.js cart → Shopify `checkoutUrl`
  handoff. The payment app is configured in Shopify and Payfast; no custom
  payment form, order database or provider credentials in frontend code.
- [Earlier readiness evidence](inf-38-peach-payments.md) remains historical.
  No Payfast payment test has been run; no production configuration changed.

## Next steps

1. Confirm the client's Payfast verification status from its dashboard or
   verification email. If documents are pending, the client submits them through
   Account → Verification Documents. Use their legal entity and bank details;
   do not put credentials or verification documents in chat or git.
2. Confirm authorized access to Payfast and Shopify Settings → Payments. Check
   the current provider state before any installation or activation.
3. Follow the official Shopify connection: Payfast Settings → Integrations →
   integrate with Shopify, then install into `infusiondiffusion.myshopify.com`.
   Record installation separately from activation; the published guide's final
   Activate step enables the provider and must follow the applicable readiness
   and human gates. Inspect actual supported test-mode controls first.
4. Establish the supported Shopify sandbox setup and record its limitations.
   Generic API test instructions do not establish every Shopify plugin feature.
   Payfast's sandbox uses a virtual wallet and does not send provider confirmation
   emails, so it cannot prove actual card authentication or email delivery.
5. In a controlled environment, verify cart → hosted checkout → Payfast → Shopify
   order state, correct ZAR totals and saved shipping/tax settings, cancellation,
   retry, duplicate submission and order/payment reconciliation. Record unsupported
   decline/pending/method simulations explicitly rather than claiming coverage.
6. Attach environment/commit, sanitized references and test results. Resolve
   merchant approval, actual methods, commercial terms, shipping/tax/policy
   readiness and evidence before proposing live enablement. Real-money test or
   refund authority remains a separate named human decision.

## Completion and rollback

INF-38 is not complete until the configured provider and required payment evidence
meet its Plane acceptance criteria. INF-40 owns the combined guest/customer-account
journey; INF-36 owns independent release review; INF-42 owns final-domain checks.
Maintain checkout gating until readiness is established. Record previous provider
and environment settings before changes; restoring the storefront flag alone does
not cancel existing checkout sessions or disable other Shopify sales channels.

## Current official sources

- [Account verification](https://support.payfast.help/portal/en/kb/articles/verify-your-account-20-9-2022)
- [Shopify app installation and activation](https://support.payfast.help/portal/en/kb/articles/how-to-enable-payfast-as-a-payment-method-on-shopify)
- [Shopify integration overview](https://payfast.io/integration/plugins/shopify/)
- [Sandbox limitations](https://support.payfast.help/portal/en/kb/articles/what-is-the-difference-between-the-sandbox-and-the-live-payfast-system-20-9-2022)
- [Shopify support](https://support.payfast.help/portal/en/kb/integration/shopping-carts/shopify)
- [Published fees](https://payfast.io/fees/)

Context7's official Payfast developer index was also consulted for sandbox
behavior. Provider-specific Shopify support instructions govern app setup;
generic custom-API examples do not require adding a direct API integration here.
