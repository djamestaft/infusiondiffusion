# Cart and hosted checkout

Status: Product brief and all four Figma frames approved on 4 August 2026; gated implementation complete pending human merge and live Preview contract verification.

## Design review

- Cart page: [Desktop review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=229-2) and [Mobile review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=230-1492)
- Added-to-bag drawer: [Desktop review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=231-118) and [Mobile review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=231-1571)
- Reusable Figma source: `CartLine` component set `227:102`, with Desktop/Mobile and Available/Updating/Unavailable variants.

| Layer                           | Status   | Evidence                                                                                                                    |
| ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| Figma feature direction         | Approved | Four exact approved frames above; product approval recorded 4 August 2026                                                   |
| `DESIGN.md` foundations         | Synced   | Existing Perfumer's Cabinet direction, typography, layout, measured-gold, and one-depth-signal rules reused without changes |
| Figma semantic variables        | Synced   | Existing color, spacing, radius, navigation, action, overlay, status, and feedback collections reused                       |
| Runtime tokens                  | Synced   | No token change proposed                                                                                                    |
| Runtime components / Storybook  | Synced   | Cart line, summary, page, and drawer states implemented and accessibility-tested                                            |
| Shopify cart and route behavior | Gated    | Server operations, HttpOnly cookie, product add, persistent cart, and disabled hosted-checkout path implemented             |

## Outcome and audience

South African customers can add an available Shopify variant, review and change a persistent cart, and—only after operational readiness is explicitly enabled—continue to Shopify-hosted checkout. The experience prioritizes clear product identity, current ZAR totals, keyboard access, and recoverable failure states on mobile and constrained connections.

## Product decisions

- Use Shopify Cart as the only cart and price authority; pin Storefront API `2026-07`.
- Store only the opaque Shopify cart ID in a secure, HTTP-only, same-site cookie. Do not expose the private Storefront token or create a parallel cart database.
- Use a cart drawer for immediate add confirmation and a canonical `/cart` page for review, recovery, refresh, and direct navigation. The existing navigation cart destination remains `/cart`.
- Render only meaningful Shopify variants. The current `Default Title` products receive one direct Add to bag action rather than a false selector.
- Shopify-hosted checkout is the only payment path. A server-only `SHOPIFY_CHECKOUT_ENABLED` launch gate defaults off; when off, customers can exercise the cart but cannot follow `checkoutUrl`.
- Do not collect a shipping address, payment details, discount codes, or tax declarations in Next.js. Shopify checkout owns those steps.
- No analytics event is added until an approved analytics/consent system exists.

## Scope

### In scope

- Normalized cart, line, merchandise, cost, warning, and user-error types under `src/lib/shopify`.
- Storefront operations for cart read/create, line add, line update, and line remove.
- Server actions that validate opaque IDs and quantities, recover from missing/expired carts, refresh route data, and return safe UI errors.
- Persistent cart cookie, cart count in navigation, Add to bag on the product route, confirmation drawer, and responsive `/cart` page.
- Empty, loading, updating, unavailable, price-changed, stale/expired, API-failure, and checkout-disabled states.
- Storybook contracts for the reusable cart line, summary, drawer, and page compositions.

### Out of scope

- Live payment-provider activation, custom payment UI, customer accounts, discount entry, gift cards, delivery selection, order history, subscriptions, international markets, webhook invalidation, analytics, and Admin catalogue cleanup.

## Observable acceptance criteria

1. An available product variant can be added from its product page. The action has pending feedback, rejects repeat submission while pending, and announces success or a safe error.
2. Adding an item creates or updates Shopify Cart, stores only its opaque ID in a secure HTTP-only same-site cookie, refreshes the cart count, and opens a keyboard-accessible confirmation drawer.
3. `/cart` renders Shopify-returned titles, variant labels, images, quantities, availability, line totals, discounts when returned, subtotal, and currency without recomputing commerce values in UI code.
4. Customers can increment, decrement, and remove lines. Controls meet the 44px target, retain visible focus, have accessible names, and expose pending state without layout shift.
5. Empty, sold-out, quantity-adjusted, price-changed, expired-cart, configuration, network, and Shopify user-error states provide truthful recovery. A missing or expired cart becomes an empty cart without a fatal page error.
6. The checkout action is absent or explicitly unavailable unless the server-side launch gate is enabled. When enabled, it redirects only to the current Shopify-returned HTTPS `checkoutUrl`; arbitrary return URLs are rejected.
7. The drawer traps focus, closes on Escape and its visible control, locks background interaction, restores opener focus, and respects reduced motion. `/cart` remains the non-modal fallback.
8. Layout works at 320px width, desktop, zoomed text, long titles, large quantities, missing images, and a realistically long cart without horizontal overflow.
9. Unit tests cover GraphQL normalization, cookie/ID validation, warnings and user errors, stale-cart recovery, and checkout gating. Storybook interaction/accessibility tests cover reusable states. Playwright covers add, persistence, update, remove, disabled checkout, keyboard flow, console errors, axe, and desktop/mobile layouts with deterministic CI fixtures.
10. Live read-only or test-mode Shopify verification proves the pinned contract separately from deterministic CI. Real transaction testing remains blocked until the Admin readiness record is complete.

## Affected systems

| System    | Responsibility                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------- |
| Shopify   | Variant availability, cart, prices, discounts, checkout URL, final tax/shipping/payment/order truth |
| Next.js   | Server-only boundary, secure cart-ID cookie, actions, cart UI, launch gate, safe redirect           |
| Storybook | Cart component and composition contracts                                                            |
| Figma     | Approved desktop/mobile cart drawer and cart page frames using existing semantic variables          |
| Sanity    | No role in cart or mutable commerce state                                                           |
| Vercel    | Server-only checkout gate and existing Shopify credentials per environment                          |

## Approval and rollback

Product approval is required for this brief and the checkout-disabled customer copy. Exact Approved Figma frame links are required before UI implementation. Human merge remains required. Rollback disables `SHOPIFY_CHECKOUT_ENABLED` first, then reverts the delivery commit if cart behavior itself is faulty; disabling checkout must not destroy Shopify carts or catalogue access.

## Operational gates before live checkout

- Business and VAT position confirmed; Shopify's current 15% manual-tax configuration explicitly approved or corrected.
- Primary South African payment provider contracted, configured, fee-reviewed, and tested.
- Shipping conditions saved and test-quoted; fulfilment owner and procedure confirmed.
- Plan/billing owner, installed apps, policies, domains, and pre-cleanup export recorded.
- A Shopify test-mode order proves inventory decrement, notification, fulfilment, cancellation/refund, and order reconciliation before the launch gate is enabled.
