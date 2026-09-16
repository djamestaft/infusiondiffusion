# INF-38 — Peach Payments readiness

Superseded for delivery on 16 September 2026: the client has created a Payfast
account. Continue from [the Payfast record](inf-38-payfast.md). Retain this file
as the historical Peach audit and onboarding-blocker evidence.

Date: 15 September 2026. Owner: Devon. Status: In Progress in Plane; Peach
onboarding is externally blocked. No payment extension has been installed or
activated by this work. No payment has been attempted.

## External blocker and replacement decision

Devon confirmed the client has no Peach merchant account and supplied Peach's
application response: early-stage merchant onboarding is paused during a rebuild.
The response offers only a possible return in the coming months, without a firm
date. This supersedes the pending-account-status and sandbox-next-step notes below;
those remain a historical technical preparation record, not an executable launch
plan while onboarding is unavailable.

Proposed next application: **Payfast Aggregation**, subject to Devon/client
selection, merchant verification and acceptance of current commercial terms.

- [Official Shopify integration](https://payfast.io/integration/plugins/shopify/)
- [Registration](https://registration.payfast.io/)
- [Sole-trader and company signup guidance](https://support.payfast.help/portal/en/kb/articles/sign-up-with-payfast-20-9-2022)
- [Current published fees](https://payfast.io/fees/)
- [Shopify support and testing guidance](https://support.payfast.help/portal/en/kb/integration/shopping-carts/shopify)

The official registration flow lists Company and Sole Trader accounts; this is
evidence of an application route, not approval or an onboarding-time guarantee
for Infusion Diffusion. Check the client's eligibility and complete verification
before relying on it for launch. Keep the account under the client's legal entity.
Review provider fees together with the actual Shopify plan's third-party fees.

[Yoco for Shopify](https://support.yoco.help/en/articles/164960-yoco-for-shopify)
is an alternative, with documented cards, Apple Pay and Google Pay support. Its
Shopify guide asks for a payment of at least R2 to check setup; do not assume
Peach's sandbox procedure applies or run a paid verification without authorization.

No replacement provider has been selected, installed or activated. On selection,
revise INF-38's provider scope and INF-40/42's provider-specific acceptance wording
together. Existing cart and Shopify hosted checkout remain the integration boundary.
INF-40 remains blocked on payment delivery; independent INF-39 account work can
continue. Do not treat the old Peach setup checklist as the current next action.

## Integration decision

Use Peach's supported Shopify payment extension. The existing storefront sends
the customer to Shopify's `cart.checkoutUrl`; the provider is configured in
Shopify and Peach. No Peach SDK, payment form, credentials or payment-status
database is required in this Next.js application for that integration.

Current official references:

- [Peach Shopify installation](https://developer.peachpayments.com/docs/shopify)
- [Peach sandbox](https://developer.peachpayments.com/docs/dashboard-sandbox)
- [Provider test scenarios](https://developer.peachpayments.com/docs/reference-test-and-go-live)
- [Shopify Cart and checkoutUrl, 2026-07](https://shopify.dev/docs/api/storefront/2026-07/objects/Cart)

## Confirmed baseline

Read-only Storefront query on 15 September returned HTTP 200 and served API
version `2026-07`:

| Field                       | Observed value                    |
| --------------------------- | --------------------------------- |
| Store                       | `infusiondiffusion.myshopify.com` |
| Primary Shopify domain      | `infusiondiffusion.myshopify.com` |
| Shop/presentment currencies | ZAR / ZAR only                    |
| Accepted card brands        | Empty array                       |

An empty accepted-card list does not establish which payment apps are installed
or their readiness. Provider state, billing, merchant activation, tax and shipping
require authenticated Shopify/Peach evidence.

The existing `checkoutAction` reads the latest cart and redirects to its HTTPS
checkout URL only when `SHOPIFY_CHECKOUT_ENABLED` is exactly `true`. The local
environment does not set this flag, so local checkout is disabled. Production
and Preview flags have not been inspected. The action currently restricts the
destination to `SHOPIFY_STORE_DOMAIN`; verify the actual generated checkout host
before enablement and again during the later domain cutover.

The [August store audit](../planning/shopify-store-audit.md) recorded no active
provider, unresolved tax treatment and unconfirmed shipping-rate conditions.
Those are historical findings requiring a fresh owner/Admin check, not verified
current settings. Do not reuse the historical fee figure as a current quote.

## Setup sequence

1. Confirm whether the merchant account exists, dashboard access is available,
   and the Shopify connection has been provisioned. Confirm current merchant
   terms, settlement details, enabled methods and Shopify transaction fees with
   the owner before live activation.
2. Inspect Shopify Settings → Payments before changing anything. If the store
   already accepts live payments, use a separate sandbox Shopify store; changing
   the live store to test mode interrupts real payments.
3. In the Peach sandbox Dashboard, use Connect → Shopify → Connect store and
   enter the confirmed `.myshopify.com` store name. If Shopify is absent from
   Connect, the owner must have Peach support enable it for the account.
4. Complete Shopify's app installation with Test mode on, then Activate. Confirm
   the test connection in both dashboards. Keep account credentials in the
   provider's setup flow; do not paste them into chat, git or frontend variables.
5. Prepare a controlled local/Preview storefront connected to the chosen test
   store. Once the provider is confirmed in test mode and test order details are
   ready, set the server-only checkout flag for that test environment. Both the
   storefront flag and provider test mode must be checked independently.
6. Run the matrix below using the provider's documented test instruments. Keep
   customer/order references in redacted evidence and ensure test orders cannot
   trigger real fulfilment. Record actual checkout hostname and return behavior.
7. Review results and unresolved shipping/tax/policy facts before proposing live
   enablement. Source publication, human merge and production gates still apply.

The extension performs the Shopify/provider payment integration. Do not add a
custom Next.js payment webhook unless a specific application requirement is
identified; any additional webhook must have authenticated, verified handling.

## Payment acceptance matrix

Every row is **not run** until the test connection is available. Record timestamp,
environment, commit, method, expected/actual outcome and sanitized references.

| Scenario                   | Required observation                                                               |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Successful card payment    | Correct ZAR total and a matching successful Peach transaction/Shopify order        |
| Authentication challenge   | Successful and failed/cancelled challenge outcomes match the chosen simulator      |
| Decline/cancel/retry       | No false paid state; customer can recover without a duplicate successful charge    |
| Pending/interrupted return | Verify eventual provider/order state; a return page alone is not payment proof     |
| Double submit/refresh/back | At most one successful payment for the intended order                              |
| Shipping/tax/discount      | Checkout and final order match the owner-approved configuration                    |
| Stock changes/cart expiry  | Current stock/cart validation prevents invalid purchases and permits recovery      |
| Confirmation               | Test recipient receives expected confirmation; references/totals agree             |
| Refund/cancellation        | Owner verifies supported full/partial refund state and cancellation/stock behavior |
| Additional enabled methods | Test each launch method using its supported simulator; record limitations          |

Unsupported sandbox scenarios remain explicitly unverified, with a provider
support or later authorized live-test plan. No real card or paid order is implied
by this preparation. INF-40 owns the combined customer-account journey; INF-36
owns independent release acceptance.

## Verification and rollback

- Existing cart, session and action tests: **14 passed across 3 files** using
  `corepack pnpm exec vitest run --config vitest.config.ts src/lib/shopify/cart.test.ts src/lib/shopify/cart-session.test.ts src/lib/shopify/cart-actions.test.ts`.
- This is local baseline evidence; it does not test Peach, the hosted checkout
  redirect in a browser, or payment/order reconciliation.
- No runtime code, provider settings, deployment configuration or source content
  changed during readiness preparation.
- For test setup rollback, restore the test environment's previous checkout flag
  and provider connection/settings. For live incidents, Devon authorizes the
  recorded recovery plan; disabling the storefront flag alone does not cancel
  existing hosted checkout sessions or stop other Shopify sales channels.

## Immediate dependency

Confirm Peach merchant status and access to Peach Dashboard plus Shopify
Settings → Payments. The available connection here is Storefront API read access;
it cannot install or configure Shopify payment providers. Once the owner supplies
that setup status, continue with the applicable sandbox installation step above.
