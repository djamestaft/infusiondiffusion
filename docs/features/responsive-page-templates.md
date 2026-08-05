# Responsive page templates

Status: Figma approved by the product owner on 4 August 2026; reusable Storybook implementation complete on 4 August 2026; Home and Fragrance Guide runtime integrations implemented on 4 August 2026; remaining route integration continues in the launch-readiness phase.

## Summary

Define the responsive Home, Collection, Product detail, and Editorial templates that will compose the approved design-system primitives into meaningful storefront journeys. Product discovery is the primary path; concrete fragrance education supplies the understanding and trust that make that path useful.

## Audience and outcome

South African customers should be able to understand the brand, distinguish fragrance formats and scents, find relevant products, and reach a clear purchase path. Gift buyers and first-time fragrance shoppers need more guidance; returning customers need efficient product discovery and reordering cues.

## Decisions

- Design all four templates in one coordinated Figma phase so their rhythm, responsive rules, and shared compositions remain coherent.
- Home balances atmosphere and commerce. Its sequence is brand and product introduction, clear Shop action, curated products, fragrance education, format guidance, service reassurance, and a restrained final shopping action.
- Collection prioritizes scanning and product comparison while reserving honest boundaries for future Shopify sorting and filtering.
- Product detail makes format, scent notes, room suitability, size, longevity, care, safety, price, stock, variants, delivery context, and purchase action concrete before editorial storytelling expands the atmosphere.
- Editorial supports About, Fragrance Guide, care, and campaign content through a constrained long-form system rather than an unrestricted page builder.
- Existing product and lifestyle imagery in the canonical design file is provisional design material. The product owner will replace it later; it must not be represented as final production photography.
- All four templates provide approved Navigation treatments in both modes. Ivory uses the warmer Bone Light `#F5F1E8` surface and Antique Gold bottom divider represented by Figma instance `157:171`, visibly separated from the Porcelain `#FCFAF5` page canvas; Midnight uses the dark surface and corresponding divider represented by instance `157:182`. Mobile uses the matching closed Ivory or Midnight MobileNavigation variant. Borderless navigation is not part of the template contract.
- Template canvases and ordinary inner layout sections use semantic `color/background/base`, which resolves to approved Porcelain `#FCFAF5` in Ivory mode. Selected warm feature fields use `color/background/subtle`. This provides the requested eggshell warmth without turning the page cream or collapsing the distinction between the canvas, warmer navigation, cards, and selected content fields; inner sections must not mask the canvas with hardcoded white.

## Acceptance criteria

1. Figma contains named Approved desktop and mobile review frames for Home, Collection, Product detail, and Editorial in Ivory- and Midnight-navigation treatments, with exact node links recorded here before implementation.
2. Home presents an intelligible brand/product proposition and visible Shop action in the first viewport, then combines curated product discovery with factual fragrance and format guidance without repeating the same claim across sections.
3. Collection presents a semantic page heading, result context, and responsive ProductCard grid. The design shows realistic minimum, typical, and long-content cases and reserves sorting/filtering space without implying those controls work in this phase.
4. Product detail presents provisional product imagery alongside Shopify-owned price, availability, variant, and purchase contracts; scent notes, room use, size, longevity, care, safety, and delivery context remain readable and concrete. Sale, sold-out, low-stock, and unavailable-selection states are defined.
5. Editorial supports a readable 65–75 character text measure, meaningful heading hierarchy, images with captions or alternative-text intent, quotations or callouts only when content warrants them, and flexible short and long articles without arbitrary section decoration.
6. All templates reuse approved Navigation, Button, TextLink, ProductCard, PriceDisplay, CommerceStatus, Badge, Eyebrow, Heading, Lead, and ContentHeader contracts where applicable. Any missing reusable composition is named and justified before a new primitive is proposed.
7. Designs remain usable at 320px width and 200% text zoom, retain a logical mobile reading and action order, preserve 44px interactive targets and visible focus intent, and avoid horizontal overflow with long names, prices, scent descriptions, and editorial copy.
8. Missing optional content and missing imagery degrade without blank regions, broken hierarchy, or invented commerce facts. No essential meaning is carried only by image or colour.
9. Image roles and responsive crops protect product recognition, avoid cropping caps, flames, spray triggers, or reed tips, and identify performance-conscious loading priorities for constrained connections.
10. The handoff includes a shared section/template inventory, commerce-state coverage, content extremes, provisional asset register, and a synchronization matrix for Figma, `DESIGN.md`, runtime tokens, components, and Storybook.

## Ownership boundaries

- Figma owns approved template composition and responsive visual intent.
- Next.js will own routes, rendering, SEO, and customer-facing interactions after design approval.
- Sanity owns editorial copy and permitted page composition.
- Shopify owns products, variants, price, inventory, availability, cart, discounts, and checkout truth.
- Storybook owns any reusable section composition or meaningful state extracted during later implementation.

## Out of scope

- Production routes, Shopify clients, Sanity schema expansion, cart behavior, hosted checkout integration, live filtering or sorting, analytics wiring, and production asset replacement.
- Reconstructing the deferred ornamental logo or replacing the approved `LogoTextLockup`.
- Adding a new low-level primitive merely to reproduce a page-specific arrangement.

## Required evidence

- Sixteen approved responsive Figma frames covering desktop/mobile and Ivory/Midnight navigation, with their exact links.
- Desktop/mobile template critique against the approved brief and `DESIGN.md`.
- Product-detail commerce-state frame and Collection long-content frame.
- Shared composition inventory and provisional asset replacement list.
- Product-owner visual approval before runtime implementation.

## Figma approval record

- Figma page: `Feature / Responsive Page Templates` (`203:2`).
- Home — Ivory: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-3) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-86); Midnight: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-309) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-364).
- Collection — Ivory: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-137) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-229); Midnight: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-405) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-443).
- Product detail — Ivory: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-294) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-337); Midnight: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-472) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-511).
- Editorial — Ivory: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-373) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-408); Midnight: [Desktop Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-543) and [Mobile Review](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=207-578).
- All sixteen frames use the approved text logo, existing responsive Navigation, existing commerce and content primitives, semantic variables, Marcellus/Manrope typography, and the provisional ProductCard image fixture. No ornamental-logo artwork remains in the templates.
- The Midnight Navigation masters now bind account and cart glyph strokes to `navigation/text`; this corrects the hardcoded Ink strokes exposed by template review and restores contrast on the dark surface.
- Status: Approved. The product owner approved the complete Ivory/Midnight, desktop/mobile set on 4 August 2026.

## Approval record

- The product owner approved designing all four templates together on 3 August 2026.
- The product owner delegated the Home emphasis decision; the approved brief makes product discovery primary and fragrance education its supporting source of meaning and trust.
- The product owner approved using products already available in the design file as provisional imagery to be replaced later.
- The product owner selected the light Ivory Navigation with its gold bottom divider, represented by Figma instance `157:171`, for all four storefront templates on 3 August 2026.
- The product owner requested matching Midnight-navigation versions for all four responsive templates on 4 August 2026.
- The product owner approved a slightly eggshell page canvas on 4 August 2026; all sixteen template frames now bind to semantic `color/background/base` rather than a text-colour role.
- The product owner approved the complete responsive visual direction and authorized implementation on 4 August 2026.

## Runtime implementation record

- `Templates/Storefront` in Storybook represents Home, Collection, Product detail, and Editorial at desktop and mobile widths, with both Navigation modes and meaningful empty, sale, low-stock, sold-out, and unavailable-selection states.
- The templates compose the existing `Navigation`, `Button`, `TextLink`, `ProductCard`, `PriceDisplay`, `CommerceStatus`, `Eyebrow`, `Heading`, `Lead`, and `ContentHeader` primitives. No duplicate low-level control was introduced.
- The ordinary page canvas uses the existing semantic `content-surface` token (Porcelain `#FCFAF5`); the selected fragrance-guidance band uses the existing warmer quiet surface role (`#F5F1E8`). Navigation owns its Ivory or Midnight mode independently of the page canvas.
- The public Home route now composes the approved Home template with Sanity-owned editorial fields, complete editorial fallbacks, live normalized Shopify ProductCard data, a provisional live product hero image, and the current Shopify cart count.
- Home empty-catalogue and long-editorial-content states are represented in Storybook. Missing Shopify catalogue data cannot erase the editorial journey or produce a broken image region.
- The public Fragrance Guide route composes the approved Editorial template with a reusable Sanity `editorialPage` document, complete guide fallbacks, dynamic metadata, current navigation/cart state, and an optional provisional live Shopify image when no editorial image is published.
- Editorial missing-image and long-content states are represented in Storybook. Missing or partial Sanity content cannot erase the practical guide or its heading structure.
- Product photography remains provisional. About/Contact route integration, final content, analytics, and production asset replacement remain pending. The meaningful homepage expansion is approved in [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-616) and [mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-638) frames and is specified in `docs/features/homepage-content-expansion.md`.
