# Home vertical slice

Status: Review ready in INF-19

## User outcome

South African customers can understand the fragrance offer and move from the
Home route into the live catalogue through the approved responsive composition,
with truthful editorial and commerce content at every supported viewport.

## Audience and success

- New and returning fragrance customers, including gift buyers.
- Success means the existing Home route remains clear, accessible, resilient,
  and connected to its owned Sanity and Shopify sources at 1440px, 768px,
  390px, and 320px.

## Scope

- Reconcile the merged Home route with approved Figma nodes `2070:2`, `2072:2`,
  `2073:2`, `2073:70`, and state contract `2073:3389`.
- Preserve the approved section order, navigation state, actions, product-card
  behavior, editorial imagery, and responsive composition.
- Verify route-level Sanity editorial copy, Shopify catalogue facts, cart and
  account navigation, metadata, missing catalogue/media behavior, long content,
  keyboard behavior, reduced motion, accessibility, and console health.
- Add durable test and screenshot evidence where the current suite is missing
  an acceptance criterion.

## Out of scope

- New visual direction or generated replacement copy.
- The deferred diffuser-reed background primitive.
- Sanity schemas or documents, Shopify queries or mutations, checkout, and
  production deployment.
- Other storefront templates.

## Ownership boundaries

- Sanity remains authoritative for Home editorial content and SEO settings.
- Shopify remains authoritative for products, images, prices, availability,
  cart quantity, and the provisioned account destination.
- Next.js owns route composition, metadata rendering, and graceful fallbacks.
- Storybook owns the reusable Home template and component state contracts.

## Acceptance criteria

1. Home renders the approved section order and semantic landmarks without
   horizontal overflow at 1440px, 768px, 390px, and 320px.
2. Sanity-provided Home and SEO values render without replacement copy; Shopify
   names, formats, prices, availability, ordering, links, and media pass through
   the existing server-only boundary.
3. Cart quantity and provisioned Account navigation remain available without
   exposing unavailable account entry.
4. Empty catalogue and missing-media states retain a meaningful Home journey;
   long editorial and product content reflows without destructive truncation.
5. Keyboard focus is visible and ordered, the navigation drawer and carousel
   remain operable, and reduced motion removes nonessential animation without
   hiding state.
6. WCAG A/AA axe checks, console checks, route health, metadata, Storybook,
   units, builds, and responsive screenshot comparison pass before review.
7. No Sanity schema/data, Shopify API contract, secret, or production setting is
   changed. A human reviews the preview and explicitly approves the merge.

## Analytics and failure behavior

- No new analytics event is required; existing links and routes retain their
  semantics.
- Sanity fallback content and Shopify empty/media fallbacks remain visible when
  their source is unavailable. Account entry remains omitted unless provisioned.

## Evidence and rollback

- Evidence: focused Vitest, Storybook tests/build, Next build, Playwright at all
  four approved widths, axe, keyboard/reduced-motion/long-content/console checks,
  screenshots, Impeccable detector, CI, and Vercel Preview review.
- Rollback: revert the INF-19 delivery commit. No content or commerce data
  migration is involved.

## Verification record

- The integrated Shopify fixture state passed Playwright at 1440px, 768px,
  390px, and 320px with no horizontal overflow and at least 44px primary
  actions. Captures are stored in `docs/features/evidence/home-*.png`.
- Home long-content and empty-catalogue Storybook states reflow at 320px.
- The full Home browser journey covers axe WCAG A/AA, keyboard carousel
  operation, reduced motion, console errors, health, and responsive geometry.
- Integration review corrected duplicate root metadata templating; the Sanity
  SEO title now renders once through an absolute route title.
