# Account entry

## Approved scope and authority

- **Approved source:** [Figma Account Review `337:321`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=337-321), approved by the implementation request and validated plan.
- **Visual comparison:** local fixture captures at 1440, 390, and 320 are recorded in `docs/features/evidence/`. The bounded implementation comparison preserves the approved Ivory Navigation, single-column ContentHeader-led layout, native primary action/recovery links, FeedbackAlert treatment, natural-height responsive layout, and no Account-current treatment. No tokens, primitives, assets, or Navigation implementation changed.
- **Intentional divergence:** Navigation has no approved Account-current variant. The Account H1 supplies page identity; this is recorded in `DESIGN.md` and is not a new Navigation contract.

## Shopify contract and security boundary

[Storefront API 2026-07 `Shop.customerAccountUrl`](https://shopify.dev/docs/api/storefront/2026-07/objects/Shop#field-Shop.fields.customerAccountUrl) is a nullable `String`, present only when the shop has a customer-account vanity domain. The server-only `src/lib/shopify/account-entry.ts` performs the sole new operation: `shop { customerAccountUrl }` through the existing 2026-07 transport.

`SHOPIFY_ACCOUNT_HANDOFF_ENABLED` must be exactly `true`; absent, empty, false-like, or any other value makes no Shopify account request. A provider destination is accepted only when `URL` parsing proves absolute HTTPS, a hostname, and no username/password. Validation returns the original Shopify string without constructing, rewriting, or reserializing its path/query. Invalid non-null data and non-configuration provider failures fail closed to the error boundary. `SHOPIFY_E2E_FIXTURES=1` supplies only an inert HTTPS fixture and still requires the explicit handoff flag.

## Approved state and copy mapping

| Normalized/runtime state             | Presentation                                          | Approved factual copy/action                                                                                                                                          | Announcement           |
| ------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `available`                          | ContentHeader + primary Button anchor                 | “Your account”; “Continue securely to Shopify to access your account.”; “Continue to your account”                                                                    | none                   |
| `loading`                            | stable skeleton plus semantic “Your account” H1       | no submission or account claim                                                                                                                                        | `main[aria-busy=true]` |
| `disabled` / `configuration-missing` | static info FeedbackAlert + `/shop` TextLink          | “Account access is not currently available”; “Account access is not currently available. You can continue browsing the collection while this service is unavailable.” | none                   |
| `not-provisioned`                    | static info FeedbackAlert + `/shop` TextLink          | “Account destination is not available”; does not claim that a customer lacks an account                                                                               | none                   |
| provider failure                     | error FeedbackAlert + native retry + `/shop` TextLink | “We could not reach account access”; “Nothing was submitted. Please try again or continue browsing the collection.”                                                   | `alert`                |
| long content                         | same available composition with safe wrapping         | fixture-only explanatory content; natural height wins                                                                                                                 | none                   |

The implementation has no form, email/password input, customer cookie/session, legacy token, Customer Account API/OIDC, customer/order data, order history, quick reorder, Admin API, analytics, or payment behavior.

## Synchronization matrix

| Layer                              | Status | Evidence                                                                                                                                      |
| ---------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Figma `337:321`                    | synced | approved node/desktop-mobile state authority recorded above                                                                                   |
| `DESIGN.md`                        | synced | Account entry section records source, primitive/token reuse, and Navigation divergence                                                        |
| Runtime semantic tokens/primitives | synced | AccountEntry composes Navigation, ContentHeader, Button, TextLink, FeedbackAlert; no globals/primitives changed                               |
| Storybook                          | synced | `Commerce/AccountEntry` covers hosted desktop/390, loading, disabled, missing configuration, null, error, long 320, cart, and focus contracts |
| Shopify boundary                   | synced | server-only normalized query/validation contract and Vitest coverage                                                                          |
| Local evidence                     | synced | sanitized 1440/390/320 fixture screenshots and command record                                                                                 |

## Provisioning and release gates

A null destination is a valid external-provisioning state until a Shopify owner enables/configures customer accounts and the vanity domain. A Preview reviewer must check only present-valid-HTTPS versus null, without retaining a live URL or authenticating. Exact-commit Preview, GitHub `quality`/`just pr-gate`, independent review, human merge, and Production enablement remain closed gates. The first human-authorized rollback is setting `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false`, redeploying, and confirming the unavailable state.
