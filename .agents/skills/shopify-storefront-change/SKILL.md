---
name: shopify-storefront-change
description: Build headless Shopify catalog, cart, customer, checkout, and webhook features without leaking commerce concerns into UI.
---

# Shopify storefront change

1. Read the commerce boundary in `docs/architecture.md` and confirm the Shopify API version from current official documentation.
2. Keep Storefront and Admin clients separate. Admin credentials are server-only and every webhook is signature-verified before processing.
3. Normalize GraphQL responses inside `src/lib/shopify`; components must not consume raw Shopify nodes or edges.
4. Treat Shopify as authoritative for products, variants, price, availability, discounts, carts, customers, orders, and fulfillment.
5. Handle unavailable variants, stale carts, price changes, market/currency context, API errors, rate limits, and checkout URL expiry.
6. Add unit tests for normalization, integration tests for GraphQL contracts, and Playwright coverage for the customer journey.
7. Never create a parallel order/inventory database or custom payment collection flow.
