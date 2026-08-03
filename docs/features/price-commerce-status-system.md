# Price display and commerce status system

Status: approved for implementation on 3 August 2026.

## Summary

Create reusable commerce-language primitives so customers can understand price
and availability consistently before live Shopify catalogue work begins.
Shopify will own every money and availability value; these components own only
localized presentation.

Approved Figma sources:

- [Desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=181-2)
- [Mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=181-119)
- Canonical `PriceDisplay` component set: `178:34`
- Canonical `CommerceStatus` component set: `179:42`

## Decisions

- `PriceDisplay` supports regular, sale, and starting-price language in compact
  and standard sizes.
- Sale presentation includes both current and compare-at values. Meaning must
  not depend on colour or strikethrough alone.
- `CommerceStatus` supports in stock, low stock, sold out, and pre-order in
  inline and overlay treatments.
- Product cards use compact price display. Availability overlays appear only
  for low-stock, sold-out, or pre-order states; an ordinary in-stock state stays
  quiet.
- Low-stock quantity is optional presentation input. The future Shopify
  boundary decides whether enough inventory detail exists to derive it.
- No Shopify client, credentials, schema, product route, cart, or checkout work
  is introduced by this slice.

## Acceptance criteria

1. Money values are formatted for `en-ZA`, normalize non-breaking spaces, and
   fail safely by returning the supplied amount when formatting is impossible.
2. Regular, sale, and from-price variants expose understandable text to
   assistive technology. Sale output identifies sale and original values.
3. Commerce status always includes written status text and never communicates
   meaning through colour alone.
4. Ivory and Midnight modes meet WCAG AA for small text. Compact sale and
   low-stock text use primary foreground where gold would not meet 4.5:1.
5. Components do not create interactive semantics, live regions, or disabled
   behavior for static commerce information.
6. ProductCard composes the new primitives without changing its single-link
   browse contract, focus behavior, image fallback, or sold-out navigation.
7. Storybook documents each primitive independently plus ProductCard regular,
   sale, low-stock, sold-out, pre-order, long-price, responsive, and Midnight
   compositions.
8. Vitest covers formatting, semantics, status labels, quantity handling, and
   ProductCard composition. Storybook checks keyboard focus and responsive
   bounds. The full local quality gate must remain green.

## Ownership and failure behavior

- Shopify: future price, compare-at price, currency, availability, inventory,
  and pre-order truth.
- Next.js: locale formatting and presentation through normalized props.
- Storybook: visual contract and content extremes using provisional fixtures.
- Sanity: no ownership of price or inventory.

Invalid money input renders the supplied amount rather than throwing. Missing
compare-at input degrades a requested sale presentation to the current price
without inventing a discount. Missing low-stock quantity uses “Low stock.”

## Verification evidence required

- Targeted component and ProductCard Vitest suites.
- Formatting, lint, and strict type checking.
- Storybook browser tests and production build.
- Next.js production build.
- Desktop and mobile Storybook inspection with axe, keyboard, overflow, and
  console checks.

## Synchronization status

| Layer                   | Status   |
| ----------------------- | -------- |
| Figma                   | Approved |
| Feature brief           | Synced   |
| `DESIGN.md`             | Synced   |
| Runtime semantic tokens | Synced   |
| Components and tests    | Synced   |
| Storybook               | Synced   |
