# Home component contracts

Status: Review ready in INF-18

## User outcome

Customers can navigate, understand product and availability facts, and follow Home purchase paths through reusable controls that remain clear at desktop, 390px, and 320px.

## Scope

- Shared navigation, Button and TextLink contracts used by Home.
- Shared content primitives used by Home section headers.
- ProductCard, PriceDisplay, CommerceStatus, and media-fallback states.
- Storybook and targeted tests for applicable interaction, loading, unavailable, image-error, empty, long-content, and reduced-motion behavior.

## Acceptance criteria

1. Components cite approved Figma nodes `2039:480`, `2039:571`, `2039:644`, `2039:710`, `2039:759`, and `2039:797` as their visual contract.
2. Primary actions use semantic Gold action tokens with the approved subtle metallic material; controls retain 44px targets and 3px focus treatment.
3. Desktop navigation centers destinations between logo and commerce utilities. The active route uses text plus an underline, Cart persists, and Account appears only when a provisioned destination is supplied.
4. Mobile navigation is a labelled modal with explicit close, trapped focus, Escape support, focus restoration, and no motion-dependent task.
5. Product cards preserve complete product names and commerce facts, expose unavailable recovery, retain stable loading geometry, and provide an accessible fallback when media is missing or fails.
6. Responsive stories at 390px and 320px have no horizontal overflow. Long content reflows without destructive truncation.
7. Shopify remains authoritative for product, price, inventory, discount, and cart facts; Sanity data and schemas are unchanged.

## Out of scope

- The deferred background primitive.
- Page-template redesign or new editorial content.
- Shopify or Sanity data changes, cart mutations, checkout behavior, and production deployment.

## Evidence required

- Focused Vitest coverage and Storybook interaction/a11y evidence.
- Lint, typecheck, full unit suite, Storybook build/tests, and Next build.
- Desktop, 390px, and 320px browser inspection with keyboard and overflow checks.
- Impeccable detector and a final Figma/runtime/Storybook sync matrix.

## Rollback

The work is isolated to shared component presentation and stories on the INF-18 branch. Reverting the delivery commit restores the prior contracts without changing commerce or editorial data.
