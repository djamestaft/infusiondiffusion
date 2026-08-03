# Product card system

Status: Approved, implemented, and locally verified on 3 August 2026; pull request pending.

## Summary

Create the storefront's reusable browse card for home-fragrance products. A customer should be able to recognize the product, understand its fragrance character and format, see its price and availability, and follow one clear path to product detail without the card becoming a miniature product page.

The first design fixtures come from the owner's brochure file. They are provisional content, not a second commerce source of truth. When Shopify is connected, normalized Shopify data will replace the fixtures without replacing the ProductCard contract.

## Decisions

- ProductCard is browse-only in this phase. The whole card links to product detail; quick-add, variant selection, cart state, and checkout are deferred.
- Information hierarchy is product image, product name, format, one restrained scent-note line, price, and availability only when it materially changes purchase expectations.
- Brochure `Hero Image` nodes supply the provisional imagery. The six current fixtures are Santuaire Serein, Ambre Egyptian, Blanc de Blanc, Ete Mystique, Noir de la Nuit, and Bois de Santal.
- Brochure content supplies provisional 200ml diffuser format and R420 retail pricing. These values must be visibly identified as fixture data in Storybook and must not enter Sanity or runtime commerce storage.
- The scent line is a concise factual note summary derived from brochure copy, not the full tagline or paragraphs.
- Product name and image link as one card destination. The image carries useful alternative text; decorative overlays remain hidden from assistive technology.
- Availability supports available and sold-out presentation. Available is normally implicit; sold out is explicit in text and never communicated by image treatment alone.
- Analytics are deferred to the collection surface that consumes ProductCard. The primitive does not emit analytics itself.

## Acceptance criteria

1. ProductCard renders a 3:4 product image, product name, format, one concise scent-note line, localized ZAR price, and an optional explicit sold-out state using provisional brochure fixtures.
2. The card has one unambiguous product-detail destination with a useful accessible name. It does not nest interactive controls, implement quick-add, or imply that cart behavior exists.
3. Hover and focus-visible states clarify clickability without obscuring the product, cropping recognition-critical bottle or reed details, or relying on motion. Keyboard focus is visible in Ivory and Midnight contexts.
4. Product names, scent notes, prices, and sold-out status remain readable at mobile widths, with long content avoiding overlap, clipping, or horizontal overflow. Product names and scent notes clamp visually to two lines with an ellipsis while their complete values remain available to assistive technology and on product detail. Price retains a stable row inside the card. A collection row can compose two cards at the 360px reference viewport without violating its 20px margins and 16px gutter.
5. The image preserves its 3:4 presentation and uses responsive loading primitives. A missing or failed optional image does not erase the product name, price, destination, or sold-out status.
6. Sold-out treatment is exposed as text and does not disable the product-detail link. The customer can still open the detail page for information or future availability.
7. Storybook documents default, hover/focus, sold out, long content, missing image, Ivory, Midnight, two-card mobile, and multi-card desktop compositions. Vitest covers semantics, destination, price formatting, alternative text, and status behavior; Storybook interaction tests cover keyboard focus and responsive bounds.
8. Figma defines the canonical ProductCard component and desktop/mobile collection examples using semantic variables and exact brochure asset references. The approved frame links and component ID are recorded here before implementation is treated as final.
9. Shopify remains the future source of truth for title, handle, media, format/variant, price, and availability. Sanity does not duplicate these values. No Shopify credentials, API client, schema, product route, or live catalogue query is introduced in this phase.
10. Reverting the delivery commit removes the component and fixtures without data migration. Integrated Preview and Playwright product journeys are deferred until a real catalogue page consumes ProductCard.

## Affected systems

- Figma: ProductCard component, semantic card variables if required, and responsive collection examples in the canonical design file.
- Brochure Figma file: read-only provisional source for six Hero Image assets and fragrance content.
- `DESIGN.md` and `.impeccable/design.json`: approved durable product-card rules after visual approval.
- Runtime: a presentational ProductCard primitive and local fixture boundary; no Shopify client or commerce persistence.
- Storybook and Vitest: component states, content extremes, accessibility, and responsive composition.
- Roadmap: synchronize the completed input-system summary and record ProductCard as the active Phase 4 slice.

## Out of scope

- Quick-add, variant selection, quantity, wishlist, compare, cart, checkout, inventory polling, discounts, sale pricing, ratings, reviews, personalization, analytics events, collection filtering, and product-detail pages.
- Creating or editing Shopify or Sanity product records.
- Treating brochure prices, availability, imagery, or copy as final production catalogue truth.

## Provisional source record

- Brochure source: [Bois de Santal Hero Image](https://www.figma.com/design/1T7m9MfQoAHFiSVmSKVeVt/Untitled?node-id=96-28).
- Hero Image nodes: Santuaire Serein `74:75`, Ambre Egyptian `81:22`, Blanc de Blanc `83:21`, Ete Mystique `92:28`, Noir de la Nuit `94:21`, and Bois de Santal `96:28`.
- All six brochure frames use 480×640 portrait imagery. The brochure price list identifies each as a 200ml product with an optional R420 retail price.

## Approval record

- Product owner approved concise scent information and use of provisional brochure content on 3 August 2026.
- Product owner confirmed the complete interaction and content brief on 3 August 2026.
- Figma desktop Approved frame: [Product Cards / Desktop / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=134-2).
- Figma mobile Approved frame: [Product Cards / Mobile / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=134-188).
- Canonical ProductCard component set: `133:255` with 24 Size, Theme, State, and Availability variants plus editable content and image visibility properties.
- Product owner approved the corrected desktop and mobile Figma frames on 3 August 2026. Both frames are named Approved.
- Product owner requested a more legible image radius and a visible long-title clamp example on 3 August 2026. ProductCard now uses 4px top media/card corners with square lower media corners, and the labeled Figma guide demonstrates the two-line clamp at desktop and mobile sizes.

## Synchronization status

| Layer               | Source                                                                                          | Status                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Figma               | Approved desktop/mobile frames, ProductCard `133:255`, and `Product Cards / Semantic` variables | Synced                                                                                           |
| Repository guidance | `DESIGN.md`, this brief, and the Phase 4 roadmap                                                | Synced                                                                                           |
| Runtime tokens      | ProductCard semantic variables in `src/app/globals.css`                                         | Synced                                                                                           |
| Component           | `ProductCard` and isolated brochure fixtures                                                    | Synced                                                                                           |
| Storybook           | `Components/ProductCard` states and responsive compositions                                     | Synced                                                                                           |
| Figma Code Connect  | ProductCard `133:255` → React source                                                            | Pending: current Figma account requires a Dev or Full seat on an Organization or Enterprise plan |
