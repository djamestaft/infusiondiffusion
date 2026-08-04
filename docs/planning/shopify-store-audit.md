# Shopify store audit

Status: Storefront catalogue audit complete on 4 August 2026; keep-and-clean decision recorded. Admin-only launch readiness remains blocked on owner confirmation.

## Evidence and decision

The existing store is `infusiondiffusion.myshopify.com`. A private Storefront API request against stable version `2026-07` verified the Headless connection and current published catalogue without changing Shopify state. Sidekick separately reported no orders or sales in the preceding 90 days.

Retain and clean the existing store. Six valid active products, their media, Shopify GIDs, prices, and inventory history already exist. The observed problems are correctable catalogue and configuration gaps; they do not justify duplicate billing, migration, reconciliation, or a new store.

## Confirmed Storefront API facts

- Shop currency and enabled presentment currency are ZAR.
- Six products are published to the Headless channel and available for sale.
- Blanc De Blanc and Noir De La Noit are R395; Ambre Egyptian, Bois De Santal, Ete Mystique, and Santuaire Serein are R430.
- Each product currently has one available `Default Title` variant and one featured image.
- Product types, image alternative text, custom SEO titles, custom SEO descriptions, and meaningful SKUs are absent.
- Four handles retain `home-decor-example-product-*` names.
- `Noir De La Noit` conflicts with `Noir De La Nuit` in its own description and requires owner-approved correction.
- Bois De Santal and Ete Mystique are not assigned to a collection.
- `Home Decor example products` contains four products and is legacy/demo structure; `Home page` contains one product.
- Privacy policy is present. Refund, shipping, and terms-of-service policies are absent from the Storefront API shop record.
- Exact inventory quantity is not exposed because `unauthenticated_read_product_inventory` is not enabled. `availableForSale` is available and sufficient for the first catalogue boundary.

## Approved preservation and cleanup sequence

Before any Shopify mutation, export products and retain a dated copy with record counts. Then make catalogue cleanup a separately approved Admin task: correct owner-approved titles and handles with redirects, add product type and image alt text, define the real collection structure, assign all products, add SEO fields where needed, and verify Headless publication after every change.

## Admin-only unknowns and launch blockers

The Storefront API cannot establish the Shopify plan and billing owner, paid apps, payment-provider readiness, South African VAT treatment, shipping profiles and rates, fulfilment locations, custom-domain/DNS ownership, theme dependencies, discounts/gift cards, or whether customer/order exports are safely retained. These require owner/Admin evidence before payment, checkout, domain cutover, app removal, or destructive cleanup.

No Admin credential is required for the catalogue boundary. Never place customer/order exports, credentials, billing evidence, or personal data in git.
