# INF-33: approved Shop and product reconciliation

## Acceptance and baseline

Devon owns implementation. This delivery starts from main b11ad6f, which
includes PR #62. That baseline already maps the entire Shopify catalogue into
Shop without slicing; Home has its own selection. Preserve that behavior.
Remaining changes are the approved Shop hero/grid geometry, removal of the
count/filter placeholder row, shared card type treatment, and purchase-first
product hierarchy.

Authority: Figma file jIMvwSBkilg7eplo3IiHPa, Approved section 2484:736.
Shop frames: 2349:395/471/540/609. Product: 2349:678/725/765/805.
The designer captured exact values read-only on 9 September.
No content publication, final photography, matching logic or production changes.

## Component inventory

| Component and source                            | Approved node                              | Storybook contract                                                                                     | Action                                                                                                |
| ----------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| ProductCard, src/components/ui/product-card.tsx | 2349:413/483/552/621                       | Components/ProductCard; responsive widths, long content, missing image, loading, sale, stock and focus | Reuse square cover media and growing panel; correct type and plain status                             |
| ProductPurchase and cart/add-to-cart.tsx        | purchase region within 2349:688            | Components/Cart interaction states; Templates/Storefront product states                                | Preserve action, pending/error and drawer; full-width 48px CTA                                        |
| CollectionTemplate                              | 2349:395/471/540/609                       | Templates/Storefront Collection, Empty, Loading, LongTitleAndMissingMedia                              | Center approved hero; remove count/filter placeholders; preserve all cards                            |
| ProductDetailTemplate                           | 2349:678/725/765/805                       | Templates/Storefront ProductDetail variants plus DeferredCare and WithCare                             | Contain media; identity, price, status, format/options, purchase, description; separate authored care |
| Runtime tokens, src/app/globals.css             | surface/elevated 2039:20; overlay 2349:406 | Foundation/Runtime tokens; consuming component stories                                                 | Card surface uses porcelain-0; named collection-hero-scrim preserves #191916 at 54%                   |

## Measured contract

Shop gutters are 64px at desktop/tablet, 24px at 390, 20px at 320.
The grid has 3/2/1/1 columns, 24/20/24/20px gaps and all six products.
Cards use square cover media, a minimum 160px panel, 12/16/16 padding,
8px row gaps, 20px display titles, 12px metadata/status and 15px prices.
Line height is 145%; content can grow.

Shop hero uses the existing homepage-bespoke-diffuser-blurb image centered
with cover. Title is 64px at desktop/tablet and 42px on mobile; subtitle
18/16px; 24px gap; vertical padding 36px desktop, 28px elsewhere.

Product uses 16px purchase-column gaps and a 48px full-width action.
The product heading uses 56px desktop / 38px smaller type with 115% line height.
Media is contained: square desktop, 400px tablet, 280px mobile.
Desktop equal columns are fluid 624px at 1440: 128px total gutters and
64px gap. This normalizes the captured wrapper's 8px trailing discrepancy;
the designer confirmed this preserves the approved geometry.

Product metadata remains after the complete description. It is not care
guidance. Authored care has a separate optional contract; no empty section or
design-only placeholder is published. Real variant selection, unavailable,
loading, error and cart behavior remain functional.

## Comparison and verification record

Local artifacts: test-results/inf33-visual (page/card screenshots and measured
boxes at 1440/768/390/320). Figma references include Shop desktop, compact
Product and compact ProductCard. Fixture imagery is existing provisional
imagery; fixture pricing, order and descriptions are not commerce approval.

Observed comparison: Shop hero/grid/card geometry follows the captured
measurements; Product uses contained media and the approved purchase order.
The existing header still differs and the global footer is absent: both belong
to INF-34. Full-page fidelity is therefore pending INF-34, not signed off here.
The care placeholder is omitted under the explicit content deferral.

Independent code review found no actionable defects. Browser tests exercise
six visible products at every width, centered hero, no overflow and description
after purchase. Existing cart tests cover add, persistence, update, remove and
focus restoration. Storybook covers state and content extremes. Final command
results and PR checks are recorded in the delivery handoff.

## Synchronization

| Layer                   | Status                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| Approved Figma          | Synced authority; no design edits                                          |
| DESIGN.md               | Synced to this bounded component contract                                  |
| Semantic tokens         | Synced card surface and hero scrim                                         |
| Shop/Product components | Synced for INF-33 scope; shared shell pending INF-34                       |
| Storybook               | Updated card/purchase/care contracts; broader page fidelity pending INF-34 |

Human preview review and merge remain required. INF-33 stays In Progress until
accepted; INF-34 follows with shared navigation/footer, Home and Cart.
