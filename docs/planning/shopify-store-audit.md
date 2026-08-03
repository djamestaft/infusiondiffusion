# Shopify store audit preflight

**Status:** preflight only — no Shopify Admin, Storefront API, billing, or domain access was used.

**Evidence cut-off:** repository state based on `infusion-diffusion/main` at `2e1fab3082a94186d29e47a9ca0fbff97b856336`.

## Scope and method

This report distinguishes repository-visible planning and architecture from facts that
only a store owner or authorised Shopify Admin user can establish. It is **not** an
inventory, financial, tax, security, or store-configuration audit. No credentials were
created, read, copied, or exposed; no store data or configuration was changed.

The expected architecture is a headless Next.js storefront with Shopify as the
commerce system of record. The repository has no tracked Shopify app configuration,
`src/lib/shopify` implementation, Shopify environment-variable declaration, or
Shopify credential. Absence from this repository is evidence only that the integration
has not been committed here; it does not prove that an existing store, apps, data, or
credentials do not exist elsewhere.

## Evidence, confidence, and owner confirmation

| Area                                    | Repository-visible evidence / known fact                                                                                                                                                                                                                                                                                                                | Confidence                                                     | Owner or authorised Admin must confirm before work proceeds                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commerce ownership                      | `docs/architecture.md` and `AGENTS.md` assign products, variants, prices, stock, discounts, carts, customers, orders, and fulfilment to Shopify. Sanity may reference Shopify GIDs but must not duplicate mutable commerce state.                                                                                                                       | High                                                           | The actual store identity, owner, staff access, organisation, recovery contacts, and who may approve changes.                                                                                                                                                                                                                                                                                                                    |
| Storefront shape                        | `PRODUCT.md` identifies a South African luxury home-fragrance brand and names room diffusers, room sprays, and candles as the intended offering.                                                                                                                                                                                                        | High for product intent; none for live catalogue               | Whether these products, variants, prices, media, SKUs/barcodes, inventory, collections, SEO records, publications, and sales-channel availability exist in the current store; export totals and exceptions.                                                                                                                                                                                                                      |
| Headless checkout                       | `PRODUCT.md`, `docs/architecture.md`, and `docs/planning/roadmap.md` select a Shopify-hosted checkout. The architecture calls for server-side Storefront API access, normalized application types, secure same-site cart-ID cookies, and redirect to `checkoutUrl`.                                                                                     | High for intended architecture; none for live configuration    | Whether checkout, customer accounts, markets, checkout branding, policies, consent, email/SMS notifications, and test/live order flows are configured and acceptable.                                                                                                                                                                                                                                                            |
| Storefront vs Admin boundary            | The intended Storefront API is least-privilege and server-side; Admin API is reserved for authenticated server integrations and webhooks. Admin operations remain the interface for inventory adjustments, fulfilment, refunds, and cancellations (`docs/architecture.md`). `AGENTS.md` prohibits public or committed Admin tokens and webhook secrets. | High                                                           | Which Admin integrations, webhook topics, staff roles, API clients, and app scopes already exist; revoke/rotate only through an authorised change plan. Do not use a Storefront token to infer Admin state or expose an Admin token to the client.                                                                                                                                                                               |
| Existing integration                    | `README.md` calls Shopify commerce “next phase”; the roadmap leaves Storefront credentials, normalized types, client/GraphQL operations, webhooks, and real-flow verification unchecked. The tracked source has no Shopify client or Shopify environment schema.                                                                                        | High for repository state                                      | Whether an uncommitted, external, legacy, or production integration exists; its API version, token ownership, scopes, endpoints, rate-limit behaviour, cache strategy, and secret rotation record.                                                                                                                                                                                                                               |
| Catalogue and theme-independent data    | The roadmap explicitly requires an audit and preservation of current products, customers, orders, domains, and configuration before restructuring. No export or catalogue data is tracked in this repository.                                                                                                                                           | High that evidence is absent; none for store contents          | Product/variant/collection records; inventory locations and quantities; customers and order history; discounts/gift cards; files; redirects; metafields and definitions; metaobjects; navigation; policies; translations; and sales-channel publication. Identify data that is independent of the Online Store theme and its relationships before deleting or rebuilding anything.                                               |
| Theme and theme-coupled dependencies    | The public frontend is intended to be Next.js, not a Shopify theme (`docs/architecture.md`). No theme source or `shopify.theme.toml` is tracked.                                                                                                                                                                                                        | High for intended headless direction; none for installed theme | Active/published themes, unpublished backups, theme customizations, Liquid sections/templates, app blocks, theme settings, custom pixels/scripts, redirects, and any product or content data that depends on theme conventions. Preserve the active theme and export it before deciding whether to retire it.                                                                                                                    |
| Apps and custom integrations            | No installed-app list or app configuration is repository-visible.                                                                                                                                                                                                                                                                                       | None                                                           | All installed and previously installed apps, owners, billing, scopes, API keys, embedded app data, webhook endpoints, app blocks/pixels, subscriptions, and removal consequences. Include fulfilment, payment, tax, shipping, reviews, subscriptions, search, feeds, analytics, consent, and marketing apps.                                                                                                                     |
| Domains and email                       | The repository documents the current Vercel URL, `https://infusion-diffusion.vercel.app`; the final custom production domain remains unchecked in the roadmap. This is not evidence of Shopify domain configuration.                                                                                                                                    | High for repository/Vercel planning; none for Shopify domains  | Shopify-managed and third-party domains, registrar ownership, DNS access, SSL status, primary-domain redirects, email sender authentication, and records required by Shopify, Vercel, payment providers, analytics, and email. Do not transfer or repoint DNS without a rollback record and TTL-aware plan.                                                                                                                      |
| Billing, plan, and financial exposure   | Billing and plan details are not repository-visible.                                                                                                                                                                                                                                                                                                    | None                                                           | Store plan, billing owner, paid apps, payment-provider contracts, Shopify transaction fees, outstanding charges, renewal dates, tax invoices, currency-conversion costs, and financial approval authority. A new store can create duplicate plan/app costs or lose plan-specific capabilities.                                                                                                                                   |
| South African market baseline           | `PRODUCT.md` specifies English (`en-ZA`), ZAR, `Africa/Johannesburg`, and Shopify-hosted checkout as initial-market intent. The roadmap requires confirmation of South African gateway, currency, tax, shipping, fulfilment, and Shopify fee requirements.                                                                                              | High for intent; none for legal/provider configuration         | The selling entity, VAT registration/status and tax advice, taxable products and invoicing requirements, Shopify Markets/currency presentation and settlement, gateway eligibility/onboarding, supported payment methods, provider and Shopify fee schedule, FX/payout timing, and chargeback/refund handling. Obtain current provider, Shopify, and professional tax/legal advice rather than treating this document as advice. |
| Shipping and fulfilment                 | The product context prioritises dependable fulfilment and clear delivery, but no operational configuration is tracked.                                                                                                                                                                                                                                  | High for intent; none for operations                           | Stock-holding and fulfilment locations; carriers/couriers; service areas and exclusions; rate tables/free-shipping thresholds; delivery promises/cut-offs; package weights/dimensions; hazardous/goods restrictions where applicable; tracking; returns/exchanges; duties; and fulfilment-app contracts. Test each destination and rate scenario in a controlled checkout.                                                       |
| Preservation and recovery               | The roadmap requires export or safeguarding before restructuring; no backup record is present.                                                                                                                                                                                                                                                          | High that preservation is required; none that it has happened  | A dated, access-controlled preservation set; the export operator and location; restore/import constraints; and approval to change or delete data. At minimum capture exports and settings evidence before structural changes, then validate that exports open and contain expected counts.                                                                                                                                       |
| Keep existing store vs create new store | The roadmap records the decision as open.                                                                                                                                                                                                                                                                                                               | High                                                           | A written decision after the catalogue, data, app, domain, billing, market, and preservation review. Do not equate “new storefront” with “new store”: a headless frontend can use the existing store.                                                                                                                                                                                                                            |

## Safe owner-led audit sequence

1. **Establish authority without sharing secrets.** The owner identifies the exact store
   URL/organisation, primary owner, two recovery-capable contacts, intended approvers,
   and a least-privilege Admin collaborator for the audit. Record access roles and
   offboarding/rotation owners outside this repository.
2. **Make the store read-only for discovery.** Capture the Shopify plan, billing owner,
   staff/users, sales channels, markets, locations, apps, domains, notifications,
   policies, payments, taxes, shipping, fulfilment, and recent error/abuse indicators.
   Do not uninstall apps, change domains, publish themes, alter checkout, or rotate
   credentials during discovery.
3. **Create and validate a preservation set.** Before deletion, migration, or
   restructuring, export products, customers, orders, inventory, discounts/gift cards
   where exportable, and reports; download theme backups; capture configuration and app
   inventories; and retain DNS/registrar and billing evidence. Store exports securely
   with date, operator, source, record counts, access owner, retention period, and a
   tested restore/import approach. Treat customer/order exports as restricted personal
   data.
4. **Map dependencies.** For each product/collection and installed app, identify its
   theme-independent Shopify data, theme/Liquid dependency, sales-channel dependence,
   webhook/API dependency, billing owner, and rollback impact. Identify API tokens and
   webhooks by owner and scope only—never copy secret values into tickets, chat, or git.
5. **Complete the South African operating decision.** Have the business owner and
   appropriate tax/legal/payment advisers confirm the legal entity, ZAR and market
   presentation, VAT/tax treatment, gateway eligibility and approval, settlement and
   fee economics, shipping/fulfilment promise, returns/refunds, and customer support
   ownership. Document sources and effective dates because provider, Shopify, and legal
   rules can change.
6. **Choose keep or new store using evidence.** Prefer retaining the existing store if
   its verified data, domains, market/payment setup, and operational history are sound
   and can support the headless storefront. Consider a new store only when approved
   blockers cannot be remediated, with a migration, reconciliation, communication,
   cost, DNS, app, and rollback plan. Neither option is approved by this preflight.
7. **Only then design the integration.** Create a server-only, least-privilege
   Storefront integration after the owner approves the store decision. Add an Admin
   client only for a defined server integration; signature-verify every webhook; keep
   credentials server-only; normalize Shopify GraphQL data under `src/lib/shopify`;
   and test unavailable variants, stale carts, price changes, market/currency context,
   API errors, rate limits, and checkout URL expiry.

## Decision record required before implementation

The owner should approve a short, dated record containing:

- the chosen store and primary domain, ownership/recovery contacts, and access model;
- a preservation-set location, export counts, restore confidence, and deletion freeze;
- keep-versus-new-store rationale, cost comparison, migration/reconciliation plan, and
  named rollback point;
- a current South African gateway/payment-method decision, ZAR/Markets configuration,
  tax/VAT sign-off, fee/settlement assumptions, and provider evidence;
- shipping zones, rates, carriers, fulfilment locations, service promises, returns, and
  operational owners;
- approved apps and integrations, their scopes/billing, and removal/continuity plan;
- domain/DNS/email ownership and a tested cutover/rollback procedure; and
- the minimum Storefront API scopes plus any separately justified Admin scopes and
  webhook topics.

## Exit criteria for this preflight

Do not begin catalogue migration, destructive cleanup, domain cutover, app removal,
checkout work, or credential provisioning until the owner has supplied the required
Admin-access evidence, the preservation set is validated, and the above decisions are
approved. The next repository change may then be a separately scoped implementation
brief; it must not treat this report's unknowns as confirmed facts.
