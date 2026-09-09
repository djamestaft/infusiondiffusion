# Storefront recovery preparation

9 September 2026. Continue INF-36 technical preparation after Devon merged
mobile PR #78 at `c7b6016`. Checkout and content/source work remain deferred.
Production health reports that merge; post-merge main CI 34370190919 passed.
Shawnee owns INF-36; Devon retains preview/merge approval. The coordinator is
the sole writer on `agent/storefront-recovery`; commerce and design review are
read-only. This does not complete INF-36's blocked release scope.

## User outcome and acceptance

Customers can distinguish a temporarily unavailable cart from a confirmed empty
cart, retry loading their saved selection, and continue shopping when an image
cannot load.

- A failed Shopify cart read displays an unavailable heading, the existing
  generic error and a keyboard-accessible Try again link that fully reloads
  /cart. It must not claim the bag is empty or expose subtotal/checkout.
- Failed reads preserve the existing HttpOnly cookie and never reveal upstream
  details. A confirmed null/expired cart is empty; page reads do not mutate cookies.
  The existing add action replaces a confirmed expired cart. A failed lookup
  must not silently replace a cart.
- Product and cart image failures use Image unavailable in the existing reserved
  media frame, without a broken image or duplicated alt announcement. Missing
  source images keep their existing absence treatment. A changed source can load.
- Quantity failure restores the last confirmed quantity; retry remains possible.
  Sold-out products remain clearly unavailable, with disabled purchase controls.
- Check desktop/mobile layout, focus, error announcements and existing commerce
  paths. No new analytics, content facts, image assets or checkout changes.

## Diagnosis and design decision

readCart previously returned an empty-shaped cart plus a message on upstream
failure. CartPage's early empty return hid that message. The reader also tried
to delete an expired cookie during Server Component rendering, which Next.js
does not permit. Model unavailable explicitly and preserve cookies during reads;
the existing server action owns replacement.

CartLine and the product template reserve image geometry but lack error
fallbacks. Reuse MediaFallback with the existing frame and typography; source
changes reset failure tracking without retrying a failing URL continuously.

The designer approved the recovery direction in read-only review: reuse the
approved empty-cart hierarchy and tokens, announce the error once, and use a
plain anchor for a fresh read. The commerce reviewer confirmed the distinction
between failed, missing and empty carts. No new Figma geometry or token change.
Figma/DESIGN/tokens remain aligned; runtime and Storybook recovery contracts are
updated together. No source publication.

## Verification and limits

Use targeted session/action units, Storybook for unavailable/empty/recovered
media, and browser simulations for image failures and failed quantity retry.
Never induce an upstream outage or alter real product availability.
Exact-commit CI and preview results are recorded in the PR. Human merge remains
the release gate; the prior merged commit is the rollback reference.

At PR #79 delivery, navigation rendered a zero count for unavailable reads;
this was outside PR #79 and is addressed by the subsequent
[cart-count accessibility work](cart-count-accessibility.md).
Independent read-only code review found no correctness/security blockers.
The complete failed-read/recovered-read behavior is covered across session units
and Storybook; a real upstream outage/recovery is not induced in production.

Fifteen targeted unit tests, 77 targeted Storybook checks and three browser
recovery journeys passed. The first Storybook browser startup timed out; the
bounded retry passed. The cart image fixture was enriched with the existing local
image to exercise request failures rather than missing-source behavior.
Unavailable-cart checks at 320/390/768/1440 found no overflow or axe violations
and confirmed keyboard focus on the plain /cart retry link.
[Small-mobile recovery state](evidence/cart-unavailable-320.png).
