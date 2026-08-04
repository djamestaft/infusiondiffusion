# Live catalogue routes

Status: Implemented and independently approved on 4 August 2026; pull-request CI and human merge pending.

## Design synchronization

| Layer                           | Status                 | Evidence                                                                                               |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Approved Figma templates        | Synced                 | Collection and Product detail Approved frames recorded in `docs/features/responsive-page-templates.md` |
| `DESIGN.md` and semantic tokens | Synced                 | No foundation or token change                                                                          |
| Components and Storybook        | Synced                 | Existing templates/primitives reused; `ProductDetailBrowseOnly` records the meaningful route state     |
| Runtime routes                  | Synced                 | `/shop` and `/products/[handle]` compose normalized Shopify data                                       |
| Purchase-ready PDP              | Intentional divergence | Add-to-bag is withheld until a real cart action can replace a false control                            |

## Outcome

Customers can browse the Shopify-backed catalogue at `/shop` and open a product at `/products/[handle]` with Shopify-owned price and availability. Reads revalidate after five minutes and expire after fifteen minutes until webhook invalidation exists; the routes remain browse-only and this cache policy must not be reused for purchasing.

## Acceptance criteria

1. `/shop` renders normalized Shopify products through the approved Collection template and ProductCard primitive.
2. `/products/[handle]` renders Shopify title, description, price, availability, imagery, SEO, and meaningful variant information through the approved Product Detail template.
3. Unknown handles return the Next.js not-found experience; Shopify/configuration failures show a recoverable route error without exposing credentials.
4. Missing image alt text, product type, SEO, or optional details degrade honestly without invented commerce facts.
5. No nonfunctional purchase control is rendered. This is an intentional divergence from the approved purchase-ready Figma frame until cart implementation.
6. Shopify CDN images are explicitly allowlisted. Catalogue reads use cache tags suitable for later webhook invalidation.
7. Unit tests cover the Shopify-to-UI adapter; Playwright covers desktop/mobile browse navigation, headings, live price/status text, 404, console errors, and WCAG AA checks.

CI browser journeys use deterministic normalized catalogue fixtures only in a `CI=true`, `NODE_ENV=development` server. Live Shopify contract verification remains a separate read-only local/Preview check, so production credentials are not copied into GitHub Actions and required tests do not depend on external store availability.

## Out of scope

Home replacement, filters/sorting, Admin cleanup, cart, checkout, customer accounts, inventory quantity, Sanity product relationships, and production domain work.
