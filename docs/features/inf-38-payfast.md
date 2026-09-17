# INF-38 — Payfast through Shopify checkout

## Status disposition — 17 September 2026

INF-38 is Done for the delivered Payfast sandbox integration, user-confirmed
merchant verification and published headless return routing. This is not a
live-payment readiness claim. Unfinished payment verification from the records
below transfers explicitly to INF-40: references, duplicates/test markers,
failure/pending/retry/authentication, notifications/refund-cancellation, totals
and retesting transient failures. Commercial terms/methods/fees/settlement and
live activation gates transfer to INF-42. Keep Payfast Test mode and test orders
unfulfilled; real-money tests require approval. The dated records below retain
the evidence and original criteria; their In Progress status is historical.

Date: 16 September 2026. Owner: Devon. State: In Progress.

## Current evidence — sandbox payment verified

Devon installed and activated Payfast in Shopify with **Test mode on**, confirmed
by the supplied dashboard screenshots. Devon subsequently confirmed that the
merchant is verified and that both dashboards are accessible; this is owner
confirmation, not an independent merchant-account audit.

On 16 September 2026, Chromium exercised the real headless storefront at
`http://localhost:3016`, isolated at protected-main commit `f1e2d88`, with
`SHOPIFY_CHECKOUT_ENABLED=true` in that test process only and fixtures disabled.
No runtime source change was needed. Persistent/deployed flags were not changed;
the root local checkout flag remains disabled and deployed values are unverified.

| Check                     | Observed result                                                                                                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product → cart → checkout | Blanc De Blanc added through the storefront; existing server action redirected to Shopify HTTPS checkout.                                                                                                                                                  |
| Payment handoff           | Shopify reached `sandbox.payfast.co.za`; sandbox banner verified before completing payment using the virtual wallet.                                                                                                                                       |
| Amount                    | R395 product + R59.25 tax + R100 Standard shipping = R554.25 ZAR, matching Shopify and Payfast. Correct business tax/shipping policy still requires owner confirmation.                                                                                    |
| Successful payment        | Payfast reported success and returned to Shopify confirmation **8F06IMM5U**, customer **TEST DO NOT FULFIL**. Refresh opened order **#1002**, with the same amount and item.                                                                               |
| Admin reconciliation      | In response to the #1002 check, Devon supplied a screenshot showing **Paid / Unfulfilled**. The crop does not show order identity, test label or provider transaction reference; those were not independently inspected. Leave the test order unfulfilled. |
| Error and retry           | A second checkout initially returned “There was an issue processing your payment.” Retrying reached the sandbox. Cause is unresolved; no storefront fix is claimed.                                                                                        |
| Cancellation              | Sandbox Cancel transaction → Cancel payment returned to Shopify checkout with the same R554.25 total and enabled Pay now button, without a success confirmation.                                                                                           |
| Cart recovery             | The first return-to-cart attempt showed the temporary-unavailable state; refresh recovered a one-item cart. Cause is unresolved. After cancellation, the test cart line was removed and the storefront showed an empty bag.                                |
| Continue shopping         | Confirmation link targeted `https://infusiondiffusion.myshopify.com`; verify the intended headless return destination with INF-42 domain configuration.                                                                                                    |
| Regression baseline       | 14 existing cart/action/session tests passed across 3 files on the isolated main checkout.                                                                                                                                                                 |

Only one sandbox payment was completed. No real money or card information was
used. No live payment/provider setting was changed by the agent. Synthetic test
contact/address data was used. Local screenshots are retained outside Git at
`/tmp/inf38-payment-test-pjFlul`; they are temporary evidence, not a durable shared
artifact. The initial success screenshot caught a visual transition; the text
and refreshed order observations plus Devon's Admin screenshot provide the
reported confirmation evidence. Checkout/session URLs and credentials are omitted.

## Remote sandbox testing authorization

After the local payment and cancellation checks, Devon explicitly requested this
work on `main` so checkout can be tested remotely using the test system. This
authorizes the reviewed main release and the deployed storefront checkout flag
for sandbox testing while **Payfast Test mode stays on**. It does not authorize
live payments. The checkout implementation already exists on protected main;
merging this documentation alone does not enable its environment flag.

All 284 unit/integration tests passed across 47 files before release preparation.
The temporary browser/server were stopped, the verification worktree was returned
clean to Treehouse, and the original local development server was preserved.
Remote deployment/flag state and browser evidence must be recorded after release.

## Remaining acceptance

- Independently match Shopify/Payfast transaction references, confirm the test
  marker and review cancellation/abandoned-checkout state and duplicate counts.
- Resolve/retest the transient checkout and cart errors before full E2E sign-off.
- Verify supported decline/pending/discount flows and notifications. Virtual-wallet
  success does not test card authentication, 3-D Secure, settlement or real refunds.
- Confirm current fees, enabled methods, tax/shipping/policies and merchant readiness
  with the owner before live enablement. Devon's merchant-verification confirmation
  supersedes the earlier pending status, but does not authorize live transactions.
- INF-40 retains combined mobile/desktop and signed-in/guest journey testing;
  INF-42 retains final-domain and checkout return-link checks. INF-38 stays
  In Progress with Devon. Live enablement and real-money tests require the existing
  explicit human decision.

## Historical setup and inspection

The following inspection preceded activation and is superseded by the successful
sandbox evidence above. Peach's onboarding rejection remains historical in
[the earlier provider record](inf-38-peach-payments.md).

### Hosted checkout inspection — 16 September 2026

A fresh Storefront API cart with one available product reached Shopify checkout
in Chromium with HTTP 200. The generated HTTPS destination was
`infusiondiffusion.myshopify.com`, accepted by the existing handoff's host check.
The checkout displayed **“This store can’t accept payments right now.”** No
Payfast payment option was available in that inspected checkout state. Provider
installation, activation and merchant verification require dashboard inspection;
the message alone does not distinguish those causes.

The inspected R395 product showed R59.25 estimated tax and R454.25 total before
shipping. The owner must confirm the intended tax configuration; this observation
does not resolve the historical tax-readiness question. No contact/address data
was entered and no order/payment was submitted. The cart line was removed after
inspection; Shopify confirmed zero remaining quantity and no cleanup errors.

The local checkout flag remains unset/disabled. This inspection used the generated
hosted URL directly and is not proof that the deployed storefront button is enabled
or that a Payfast payment works. No runtime code change is indicated by the current
hosted-checkout evidence.

### Dashboard setup

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
