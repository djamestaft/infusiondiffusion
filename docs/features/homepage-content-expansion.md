# Homepage content expansion

Status: Implemented and locally verified; pull-request review pending.

Approved Figma frames:

- [Desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-616)
- [Mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-638)

## User outcome

Customers should understand why the six-fragrance collection exists, how to choose a fragrance, and what to expect from a 200ml reed diffuser before entering checkout. The homepage should feel complete without becoming a catalogue repeated several times.

## Content sequence

1. Existing hero and live featured products
2. Room-led fragrance guidance
3. Service reassurance
4. Midnight founder story
5. Qualified longevity and care guidance
6. Closing invitation to explore the six fragrances

## Ownership

- Sanity owns section visibility, headings, body copy, calls to action, and the optional founder-story image and alternative text.
- Shopify owns products, product imagery, prices, inventory, and availability. Until an editorial founder image is supplied, the live featured Shopify image may fill that position without being copied into Sanity.
- Next.js owns responsive composition, semantic hierarchy, accessible fallbacks, and the route.
- Storybook owns the reusable template contract, long-content coverage, optional-section state, and responsive visual evidence.

## Approved factual claims

- More than 130 fragrance oils were explored before the collection was refined to six room fragrances.
- Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts, may be named and credited publicly.
- A 200ml reed diffuser may last approximately 8–12 months under normal use. The page must state that room temperature, airflow, placement, and reed rotation affect diffusion rate.

## Acceptance criteria

1. The approved desktop and mobile section sequence renders from the existing storefront primitives and semantic Ivory/Midnight tokens.
2. Editors can change or hide the service, founder, longevity, and closing sections independently.
3. Blank, partial, missing, or unavailable Sanity values retain complete approved fallback content. An incomplete editorial image is ignored.
4. The founder story preserves the approved attribution and the longevity claim remains qualified.
5. The founder section uses a real Sanity image when supplied, then a live Shopify image, then a meaningful image-free layout.
6. Shopify remains the only source of product, price, inventory, and availability data.
7. The page preserves one H1, ordered H2 headings, keyboard access, visible focus, WCAG AA contrast, reduced-motion behavior, readable measures, and no horizontal overflow at 320px.
8. Storybook covers desktop, mobile, Midnight navigation, long copy, hidden editorial sections, and missing catalogue imagery.
9. Vitest covers template composition and Sanity fallback normalization. Playwright covers live desktop/mobile rendering, claims, links, console errors, overflow, and axe.

## Rollback

Each new editorial section can be hidden in Sanity. Reverting the template and query leaves existing Sanity fields harmless and preserves the original hero, catalogue, and guidance journey.
