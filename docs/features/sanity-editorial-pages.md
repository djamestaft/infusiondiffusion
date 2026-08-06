# Sanity editorial pages

Status: Fragrance Guide and Contact runtime integrations implemented; Preview review and editorial publishing remain human gates.

## User outcome

Customers can open the Fragrance Guide from the homepage or primary navigation and receive practical, readable help choosing a home fragrance. The brand owner can update that guide in Sanity without a code change.

## Ownership

- Sanity owns the eyebrow, title, introduction, optional editorial image and alt text, ordered content sections, and SEO.
- Next.js owns the route, responsive composition, metadata rendering, fallbacks, and accessibility.
- Shopify remains the source of product and commerce truth. A live Shopify product image may temporarily fill the optional hero position when no Sanity editorial image exists; it is never copied into Sanity.
- Storybook owns the reusable EditorialTemplate contract and its responsive, missing-image, and long-content states.

## Acceptance criteria

1. `/fragrance-guide` uses the approved Editorial Ivory template and marks Fragrance Guide as the current navigation destination.
2. The route renders editor-managed content from an `editorialPage` document with slug `fragrance-guide` in published and draft perspectives.
3. Missing, partial, or unavailable Sanity content degrades to complete approved guide copy.
4. The optional hero image requires alternative text. Without an editorial image, the route may use a live Shopify image and remains meaningful if neither source is available.
5. The live cart quantity remains present in global navigation.
6. The page has one H1, ordered H2 sections, readable paragraph measures, no horizontal overflow at 320px, keyboard-operable navigation, visible focus, and WCAG AA contrast.
7. Metadata uses Sanity SEO fields with approved fallbacks.
8. Storybook covers desktop, mobile, Midnight navigation, missing imagery, and long editor-managed content.
9. Vitest covers fallback merging and template composition; Playwright covers desktop/mobile rendering, current navigation, overflow, console errors, and axe.

## Out of scope

- Publishing or replacing final editorial photography
- About runtime route
- Contact-specific structured fields such as phone, hours, address, routing, or form submissions
- Rich portable-text blocks, embedded products, filtering, analytics, or motion
- Homepage content expansion, which is delivered through the separate `siteSettings.homepage` contract

## Rollback

The route can be removed without changing Sanity data. If the Sanity document is unpublished or the service is unavailable, the application continues to render the versioned fallback content.

## Contact page

`editorialPage` slug `contact` reuses the generic title, introduction, ordered sections, and SEO fields. `siteSettings.contactEmail` supplies the contact destination only after route-level trimming and validation; a blank or invalid value falls back to the approved public mailbox. Contact remains direct-email-only and does not add schema fields for a form, phone, hours, address, or message retention.

## About portrait chapters

`editorialPage` slug `about` additionally uses the fixed `origin`, `development`, `collaborator`, and `principles` roles. Its optional per-section artwork is a rights-controlled 3:4 portrait rendered FIT inside a 4:3 About layout slot. This additive contract does not alter Fragrance Guide hero/section behavior.
