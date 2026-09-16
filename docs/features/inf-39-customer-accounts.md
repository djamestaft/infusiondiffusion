# INF-39 — Restore Shopify customer accounts

## Outcome and scope

Devon requested restoration of the existing Account icon and purchase history on
16 September 2026. Reuse the current navigation and account handoff. Shopify owns
sign-in, customer profiles, orders, order details and logout. No customer/session
information is stored in Next.js or Sanity. Guest checkout remains available.

## Discovery and implementation

- Vercel had no `SHOPIFY_ACCOUNT_HANDOFF_ENABLED` variable; the default is disabled.
- Shopify Storefront API 2026-07 returned `customerAccountUrl: null`. This field is
  only populated for a customer-account vanity domain, not the default hosted URL.
- The store's `/account/login` redirects to `https://shopify.com/99237232926/account`.
  A fresh browser reached Shopify's branded email sign-in page successfully.
- Query `shop.id` with `customerAccountUrl`. Prefer the validated HTTPS vanity URL;
  otherwise validate the exact Shop GID and form Shopify's documented default URL.
  Never route account entry through the old theme's `/account`, avoiding a loop.
- The shared website layout provides only the local `/account` navigation link,
  controlled by the exact `true` server flag. All normal page headers and mobile
  menus inherit it. Explicit component overrides remain supported for stories.
  Shopify lookup happens on the account page, not Home or other browsing pages;
  account-provider failures retain the existing account error/retry UI.
- The published redirect theme remains configured for the canonical test site.
  Its custom Hydrogen account-integration option stays disabled.

## Design contract

Restore Account before the bag using the existing UserRound icon, semantic tokens,
44px controls, 86px desktop/78px tablet and phone headers. No composition changes. The existing primary CTA now centers its wrapped label
at 320px, matching DESIGN.md.
The existing account page retains its H1 and same-tab Continue action, loading,
unavailable and retry states. The legacy not-provisioned presentation remains
covered as a reusable recovery state; null vanity alone no longer selects it.

The designer inspected the explicitly approved 12 September navigation refinement
frames [desktop 2664:2](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2664-2),
[mobile 2674:22](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2674-22),
[menu 2675:27](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2675-27),
and Approved foundation `2039:571`. Current DESIGN.md supersedes historical
header heights. Figma, DESIGN.md, tokens and component composition are unchanged;
Storybook adds restored account tablet/mobile/menu and handoff width coverage.

## Acceptance and verification

- Icon on Home, Shop, Product, Cart, About, Contact, Guide and account; desktop and
  mobile menu, keyboard focus and 44px targets at 1440/768/390/320.
- Enabled account route offers the correct store's hosted destination; disabled
  flag hides shared entry and preserves truthful unavailable content.
- Default/vanity destinations, malformed IDs/URLs, exact flag gating, configuration
  and provider errors covered by unit tests. No customer data is queried.
- Real browser handoff reaches Shopify sign-in without looping through the theme.
- Authenticated acceptance requires an inbox-controlled customer: existing orders
  and detail, empty history for a new customer, logout/re-entry, account return to
  store and isolation between customer identities. Synthetic-email payment tests
  cannot prove another email's order history. Never fulfil sandbox orders.

Local verification: 289 unit tests, lint and type checks passed; 30 relevant
Storybook checks and the Storybook build passed (12 account stories rechecked
after the centered-label correction). All 29 account Playwright checks passed,
including shared entry on all normal pages and the product page. Impeccable's
changed-component scan found no issues. Real Shopify sign-in handoff passed;
account-page axe WCAG 2A/AA and overflow checks passed at all four widths.

The designer compared runtime floating/scrolled/menu/account screenshots against
the approved references, verified the 320px label correction and found no remaining
visual blockers. Independent code review found no blockers and independently ran
23 account/layout/navigation tests. Local screenshots are in ignored
`output/inf39-accounts-2026-09-16/`; preserve the evidence with the release record.
A local Sanity Live CORS warning is specific to the temporary port 3021 and does
not establish a deployed failure. The E2E server requires `CI=true` to enable its
existing catalogue fixtures; account interaction waits for content instead of a
replaceable loading shell.

Exact-commit CI and remote preview evidence are tracked in the delivery PR and
Plane INF-39. Authenticated history remains pending human sign-in; do not mark
INF-39 complete.

## Activation, rollback and cutover

Enable `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true` in the controlled Preview environment
and rebuild after the release gate passes. Production enablement and merge retain
the recorded human gate after reviewable preview evidence. Roll back by setting
the flag to `false` and rebuilding; Shopify customer/order data is unchanged.

The default hosted URL does not require DNS. INF-42 can separately configure an
account subdomain, verify it in Shopify, then retest sign-in, account return links,
checkout and logout after domain switchover. Existing email/DNS records remain.

## References

- [Shop API: customerAccountUrl](https://shopify.dev/docs/api/storefront/2026-07/objects/Shop)
- [Default and custom account domains](https://help.shopify.com/en/manual/customers/customer-accounts/customize-customer-accounts/connect-domain-customer-account)
- [Customer account sign-in and orders](https://help.shopify.com/en/manual/customers/customer-accounts)
