# Architecture

## Ownership boundaries

| Concern                                                               | System of record |
| --------------------------------------------------------------------- | ---------------- |
| Public UI, routes, SEO rendering, cart presentation                   | Next.js          |
| Editorial copy, campaigns, guides, landing-page composition           | Sanity           |
| Products, variants, price, stock, discounts, carts, customers, orders | Shopify          |
| Deployment, previews, runtime logs                                    | Vercel           |
| Component contracts and visual states                                 | Storybook        |
| Approved visual source                                                | Figma            |

The website and Studio use separate App Router branches so Sanity live content never wraps Studio. Published pages use the Content Lake through `next-sanity`; draft mode enables Visual Editing. The app remains buildable with fallback holding-page content before a Sanity project is connected.

## Commerce phase boundary

The Storefront API is wrapped under a server-only `src/lib/shopify` boundary pinned to an explicit stable API version. UI code receives normalized application types rather than raw GraphQL response objects. The Headless private Storefront token remains server-only, never uses a `NEXT_PUBLIC_*` name, and uses minimum required scopes. Admin API access is reserved for separately justified authenticated server integrations and webhooks.

Sanity documents may store Shopify product GIDs for editorial relationships. They must never copy mutable price, inventory, discount, or order state.

Cart state will use Shopify cart IDs stored in secure, same-site cookies. The final cart action redirects to Shopify's `checkoutUrl`. Shopify Admin remains the only operational interface for fulfillment, refunds, cancellations, and inventory adjustments.

## Reusable template

After the first real storefront slice is stable, extract generic code and agent assets into a separate tagged GitHub template. Infusion Diffusion remains an ordinary consumer, not the template source. A bootstrap skill will collect project variables, support an offline dry run, and ask before provisioning external resources.
