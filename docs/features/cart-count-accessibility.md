# Cart count and navigation accessibility

## Scope and acceptance

Devon authorized this continuation after merging PR #79. This is advance
INF-36 technical preparation (owner Shawnee, Backlog), while INF-35 remains
In Progress. Checkout and content/source publication remain deferred.

- An unavailable cart read displays a dash in the existing header/menu count
  slot with accessible name "Cart, item count unavailable". Cart stays linked.
  Confirmed zero and positive quantities preserve their existing presentation.
- All storefront routes/templates and CartShell preserve unknown as null.
  No Shopify requests, mutations, cookie ownership or checkout changes.
- Mobile home links have at least 44px tap height; logo artwork stays unchanged.
- Menus scroll within short viewports, keep keyboard focus contained, and close
  on desktop resize, releasing body scroll and restoring visible focus only
  when focus was in the closing menu or on its hidden opener.
- Review shopping journey reflow, touch targets, keyboard and reduced motion.

## Diagnosis and approved design

The cart reader already distinguishes unavailable, but route props and CartShell
reduced it to totalQuantity=0. A pure contract helper now preserves that state.
The designer approved the dash and explicit accessible name without extra alert
or warning colour; the commerce reviewer approved the nullable UI contract.

At 390px and 320px, mobile home link boxes measured 124x36px. At 844x390,
the menu had 492px content, a 390px viewport and visible overflow with the body
locked: its Cart link ended at y=452, outside the usable panel. Resizing an open
menu to desktop retained the hidden dialog and body scroll lock.
The designer approved target expansion without resizing the artwork, contained
scrolling, and focus restoration to the main Home link on desktop close.
No Figma geometry, semantic token or brand changes; Storybook states remain
synchronized with the runtime contract. Coordinator is the sole code writer.

## Verification

Twenty-four targeted unit/integration tests passed, including unavailable route
props, visible markers and accessible names, CartShell updates/recovery, and
resize cleanup. The first unit run had a worker startup timeout; the bounded
rerun completed with all 24 passing.

Five Chromium journeys passed: landscape scrolling and keyboard wrap/Escape,
mobile-to-desktop focus/scroll cleanup, return to mobile, and 320 CSS-pixel
Shop/product/Guide/cart reflow, 44px targets and axe WCAG A/AA checks. Guide
keyboard selection retains its visible 3px outline. Reduced motion was enabled.
The width simulates reflow at 200% of a 640px viewport; native browser zoom and
physical screen-reader/device testing remain unverified. Initial browser checks
hit cold compilation and included the development toolbar; the target audit now
scopes storefront landmarks, and all five checks passed on rerun.

Independent read-only review confirmed route/helper/CartShell propagation and
resize/scroll behavior. Review caught an unreachable menu-marker branch and
shell encoding of the dash; both were corrected and visible-marker assertions
now prevent recurrence. No remaining code-review blockers.

Full CI, build and preview evidence is recorded on the delivery PR. Preview
acceptance and human merge remain release gates.

A production build with a synthetic cart cookie and no Shopify configuration
passed unknown-count checks at 320/390/768/1440 with zero axe violations and
page errors. The cookie remained intact; after clearing only the test cookie,
the plain retry returned a confirmed empty cart and zero navigation count.
No upstream outage or real customer cart was induced. The designer reviewed
[the unavailable state](evidence/cart-count-unavailable-390.png) and the mobile
menu, approving the state and a small spacing correction beside its count.
The final menu state is included in Storybook.

## Post-merge resize race

Devon approved the preview and merged PR #80 at `0a24c0c`. Production health
and mobile/desktop smoke checks passed. Main CI 34382271092 succeeded with
84 browser tests passing immediately and the resize-focus test passing on retry.
A production reproduction failed 3 of 20 transitions: CSS hides the menu and
blurs its focused link to body before the resize event is delivered.

The follow-up preserves the last focusin target while the menu is open. Only
when current focus has fallen to body does desktop cleanup use that target;
explicit focus outside the menu remains untouched. Remove the focus listener
alongside the existing keyboard/resize listeners. Acceptance: deterministic
blur-before-resize regression, repeated browser transitions, normal Escape and
outside-focus preservation. No visual or commerce changes.
