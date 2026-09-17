# INF-39 — Restore Shopify customer accounts

## Current acceptance — 17 September 2026

Account restoration #90, persistent sessions/account layout #91, black account
header #94 and gold avatar #96 are human-merged. Main is `dcbcdc9`. Production
session settings and free Redis storage are configured. Devon confirms sign-in
on the main site and initials remaining after refresh and navigation; profile
and own-order visibility were confirmed earlier. Those checks are accepted.

INF-39 is Done for the delivered implementation and user-confirmed persistence.
Unfinished real-provider renewal, restart, logout/re-entry, hosted-order return
and two-customer isolation acceptance are explicitly transferred to INF-40. The dated
implementation notes below preserve diagnostic history; their pending setup,
visual approval and merge statements are superseded by this release status.
See the [updated implementation checklist](../superpowers/plans/2026-09-16-persistent-customer-account.md).

## Persistent account implementation — 16 September 2026

PR #91 now implements Shopify Customer Account API confidential-client sign-in,
server-side encrypted Redis sessions, verified initials, a name/email summary,
hosted orders and sign-out. The feature remains disabled by default; main keeps
its working hosted handoff. Devon registered the main test-site callback/logout
URIs and approved an available free Upstash plan with no paid auto-upgrade.

Local evidence: 332 unit/integration tests, OIDC signature/claim validation,
real Redis atomicity/race checks, seven fixture-browser journeys, four-width
axe/overflow checks, lint/types and Next/Storybook builds pass. Independent auth
review has no remaining blocker. Visual review found no major issue; reserved
sign-out width and a Unicode/mononym story address its small follow-ups.
Fixture journeys exercise refresh, return, cross-tab logout and customer changes;
they do not prove real Shopify login or grant renewal.

The free Upstash database is now provisioned and connected to Preview only;
REST write/read-delete/Lua smoke passed. The client credentials and encrypted
session configuration are now installed as server-only branch Preview variables.
Remaining: register preview callback/logout URIs and complete real Shopify/
Upstash acceptance. CI and preview checks must use the current PR head.
The editable [Figma account-state handoff](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2741-37)
is synchronized on Exploration. Human visual/release acceptance remains pending. INF-39 stays In Progress, owned by Devon; INF-40 remains downstream.
SEO/domain work remains INF-41/42. Payfast remains in Test mode.

## Follow-up: persistent storefront identity

Devon confirms that signing in displays his Shopify order. The hosted account
restoration was merged as `ca41848` and enabled on the test site with green CI
and public-browser smoke checks. Hosted order visibility is now user-confirmed.

Devon requests initials and basic profile details to persist on returning to the
Next.js site. This requires a Customer Account API authorization/session
connection beyond the existing hosted link. See the
[prepared design](../superpowers/specs/2026-09-16-persistent-customer-account.md)
and [implementation plan](../superpowers/plans/2026-09-16-persistent-customer-account.md).
Client credentials and managed session storage are not configured. This follow-up
is preparation only; no new auth runtime or signed-in identity is deployed. Keep
INF-39 In Progress until that implementation and authenticated acceptance pass.

The earlier discovery and release-preparation record below is historical; exact
merge/deployment evidence is retained in PR #90 and Plane INF-39.

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

## Persistent account visual synchronization

- Figma: Exploration handoff `2741:37`, awaiting human visual review. Signed-in
  frames: 1440 `2742:39`, 768 `2742:91`, 390 `2742:137`, 320 `2742:179`.
- State frames: missing details `2744:147`, Unicode mononym `2744:202`, signing out
  `2744:255`, loading `2745:207`, expired `2745:250`, error `2745:296`, signed out
  `2745:350`.
- DESIGN.md, existing CSS tokens, AccountEntry/Navigation and Storybook states:
  synchronized with the functional extension. Approved shell frames unchanged.
- Intentional existing button treatment: Figma uses the approved solid-gold
  fallback; runtime retains the metallic enhancement. No new token is introduced.
- Four-width browser/Storybook screenshots and designer comparisons are retained
  under local `output/inf39-persistence-2026-09-16/`. Images use synthetic profiles.
