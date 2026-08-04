# Shopify catalogue boundary

Status: Implemented and independently approved on 4 August 2026; pull-request CI and human merge pending.

## Outcome

Give the Next.js storefront a typed, server-only way to read Shopify products and collections without exposing credentials or leaking Shopify GraphQL response shapes into UI components.

## Decisions

- Use the existing store at `infusiondiffusion.myshopify.com`; the audit evidence supports keeping and cleaning it rather than creating another store.
- Pin the Storefront API to stable version `2026-07` and review the version quarterly.
- Use the Headless channel private Storefront token only in server contexts. No Shopify credential may use a `NEXT_PUBLIC_*` name.
- Shopify remains authoritative for product identity, variants, pricing, currency, and availability.
- Exact inventory quantity remains optional. The existing Headless permission does not expose it, and ordinary catalogue availability does not require broadening that permission.
- Catalogue operations are deliberately bounded for the audited six-product store: callers may request 1–250 products, while detailed product media, memberships, and variants use fixed first-page limits. Pagination must be added before catalogue size or variant counts approach those limits; the boundary must not be represented as an unbounded export API.

## Acceptance criteria

1. Server-only configuration validates the store domain, private token, and pinned API version without logging secret values.
2. A single Storefront GraphQL transport sends authenticated requests, handles HTTP and GraphQL failures, and accepts buyer IP forwarding for buyer-initiated server requests.
3. Product-list, product-by-handle, and collection-by-handle operations return normalized application types rather than raw Shopify nodes or edges.
4. Normalization preserves Shopify GIDs, handles, titles, descriptions, SEO, images, money/currency, selected options, availability, and collection membership while safely handling missing optional values.
5. Missing configuration, malformed Shopify data, request failures, GraphQL errors, and missing product/collection results have explicit failure behavior and do not expose credentials.
6. Unit and contract tests cover regular catalogue data, missing optional fields, unavailable variants, malformed responses, HTTP failures, GraphQL failures, and missing resources without a live credential.
7. `.env.example`, architecture guidance, and roadmap status use the exact server-only variable names and record the remaining operational blockers.

## Out of scope

- Shopify Admin API, catalogue edits, collection cleanup, inventory adjustments, webhooks, customers, cart persistence, checkout, routes, Sanity references, and production deployment configuration.
- Payment, tax, shipping, fulfilment, app, billing, and domain approval. These remain required before checkout work.

## Required evidence

- Focused Vitest coverage plus full lint, typecheck, test, Storybook, and production builds.
- A credential-free contract fixture proving normalization.
- An independent read-only review and a green pull-request quality gate before human merge.
