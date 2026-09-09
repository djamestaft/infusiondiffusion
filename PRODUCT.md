# Infusion Diffusion product context

## Purpose

Infusion Diffusion is a South African luxury home-fragrance brand. The current launch range is the six existing 200 ml reed diffusers; candles and room sprays are outside this launch, as confirmed by Devon on 7 September 2026. The storefront should make scent feel like a considered part of an interior while keeping product choice, care, delivery, and purchase paths direct and trustworthy.

## Audience

- South African customers seeking elevated fragrance for lived-in rooms.
- Design-conscious buyers who value refined vessels, atmosphere, and gift-worthy presentation.
- Gift buyers who need clear scent, format, size, care, and delivery guidance.
- Returning customers who value quick reordering and dependable fulfillment.
- The brand owner, who needs editorial control without developer assistance.

## Experience principles

1. Make the product and fragrance format understandable before making it poetic.
2. Use sensory storytelling with concrete scent notes, room context, size, care, safety, and longevity information.
3. Keep purchase paths obvious and low-friction.
4. Earn luxury through material detail, proportion, typography, photography, and service clarity.
5. Earn trust through legibility, transparent policies, stock accuracy, and predictable checkout.
6. Design for mobile and constrained South African connections first.

## Initial market

- Locale: English (`en-ZA`)
- Currency: ZAR
- Timezone: `Africa/Johannesburg`
- Checkout: Shopify-hosted checkout
- Public frontend: Next.js on Vercel

## Current milestone

Devon approved the current 24 responsive Home, Shop, Product, Cart, combined
About and Fragrance Guide Variation 02 layouts on 8 September 2026.
The dated approval in `DESIGN.md` now governs downstream implementation.
Contact and verified Guide matching remain open; the separate card-by-card
trial remains exploratory. Final photography, missing facts/care copy and
Sanity SEO remain deferred.

Devon owns implementation through INF-33/34/35. Reuse existing Shopify and
Sanity integrations, build and verify reusable components in Storybook before
page integration, and compare against exact Approved Figma frames. Shawnee
owns design/content preparation and coordinates independent release verification.
See `docs/planning/roadmap.md` for dependencies and `docs/design-implementation.md`
for the atomic delivery contract. Later Gallery refinement follows the shopping
release; preserve existing public URLs meanwhile.
