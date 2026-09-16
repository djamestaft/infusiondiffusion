# Infusion Diffusion Roadmap

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
Preview callback registration now succeeds after Devon corrected and saved the
URL. Callback diagnostics then identified `invalid_client` during token exchange.
A controlled live probe reproduced it with the OAuth library's form-escaped
Basic credentials; literal Base64 `client_id:client_secret` reached the expected
`invalid_grant` response for a deliberately invalid authorization code. The saved
credentials are accepted. The Shopify-specific client-authentication adapter now
preserves literal punctuation and includes `client_id` in both code and refresh
grant bodies, matching Shopify's documented contract. Regression tests cover
punctuated credentials on both grants while retaining signature/claim checks.
Callback logs contain only fixed stage/error classifications, never credentials,
authorization codes, claims or customer details. Real storefront persistence is
still failing after the corrected Preview: fresh user callbacks now report
`OAUTH_INVALID_RESPONSE`, replacing `invalid_client`. The real callback on
`8720e0f` identifies `jwt.sub.type.number`: Shopify sends a numeric subject while
the library requires a string. A pinned, narrowly scoped oauth4webapi patch now
normalizes positive safe-integer subjects only for validated Shopify issuers.
It changes parsed claims, never the signed token; original signature, issuer,
audience, nonce, state, PKCE, expiry and refresh identity checks remain enforced.
Numeric login/refresh regression fixtures reproduce the old failure and pass
with the patch, including forged tokens and invalid claims being rejected.
Diagnostic head `8720e0f` passed full CI. The compatibility fix requires its own
CI/review/Preview gate, followed by real login and persistence acceptance.
Main customer sessions remain unchanged.
The editable [Figma account-state handoff](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2741-37)
is synchronized on Exploration. Human visual/release acceptance remains pending. INF-39 stays In Progress, owned by Devon; INF-40 remains downstream.
SEO/domain work remains INF-41/42. Payfast remains in Test mode.

## Persistent storefront identity requested — 16 September 2026

Devon confirms that hosted Shopify login shows his own order. PR #90 is merged
as `ca41848`; Account is enabled on the remote test site, with green main CI and
public sign-in/return/guest-checkout smoke evidence recorded in Plane and the PR.
The hosted order-history visibility check is now user-confirmed.

Devon additionally requests persistent signed-in state, basic profile information
and initials when returning to the storefront. The current link-only handoff
cannot provide that identity. INF-39 remains In Progress with Devon; its next
slice is a Customer Account API connection and secure first-party session, as
specified in the [prepared design](../superpowers/specs/2026-09-16-persistent-customer-account.md)
and [implementation plan](../superpowers/plans/2026-09-16-persistent-customer-account.md).
Client configuration and a managed-session-storage provisioning path are still
needed; no new authentication runtime or signed-in UI is enabled yet. Keep the
working hosted path available. INF-40 covers combined acceptance; INF-41/42 remain
final SEO and domain switchover. Earlier unconfirmed order-history notes below are
historical for the now-confirmed visibility check only.

## Approved footer refinement — 16 September 2026

Devon approved the Figma footer refinement and authorized implementation/push.
INF-43 is In Progress, owned by Devon, as a follow-up to completed INF-34.
Approved section `2730:37` preserves the four responsive frame IDs. The
[delivery record](../features/inf-43-footer.md) owns acceptance and visual evidence.
This changes the shared footer only; launch dependencies remain unchanged.
Implementation review, green current-head CI and human merge remain required.

## Customer account restoration — 16 September 2026

Devon started INF-39, now In Progress with Devon as owner. Discovery found the
Vercel account gate absent and the existing handoff incorrectly treating a null
vanity-domain URL as unavailable. Shopify's default hosted sign-in is reachable.
The [account delivery record](../features/inf-39-customer-accounts.md) covers the
bounded fix, shared Account visibility on all customer pages, existing design
reuse, tests and activation/rollback. Local implementation and visual/code reviews are verified; remote release
evidence is tracked in the delivery PR and Plane. Authenticated purchase-history
acceptance remains pending. INF-40 still requires this work; final SEO and domain
switchover remain INF-41/42. Payment testing stays in Payfast Test mode.

Last updated: 16 September 2026

## Payfast sandbox succeeds — 16 September 2026

Payfast is installed and Active in Shopify with Test mode on. Devon confirms
merchant verification and access to both dashboards. On protected-main `f1e2d88`,
an isolated local headless storefront completed a real Payfast sandbox journey:
product → cart → Shopify checkout → Payfast virtual wallet → Shopify confirmation
8F06IMM5U / order #1002, R554.25. Devon's responding Admin screenshot shows
Paid / Unfulfilled. The test order must remain unfulfilled.

A second checkout's initial processing error recovered on retry; sandbox
cancellation then returned to a usable checkout. A temporary cart error recovered
on refresh. Both causes remain unresolved for E2E follow-up. Fourteen existing
cart/action/session tests passed. See the detailed
[Payfast evidence and remaining acceptance](../features/inf-38-payfast.md).

INF-38 remains In Progress, owned by Devon. Transaction-reference reconciliation,
test marker/duplicate checks, broader failure flows, business tax/shipping and
commercial readiness remain open. INF-40 consumes this evidence; INF-42 must
verify that checkout's Continue shopping link returns to the headless storefront.
No source-code change or deployed checkout-flag change was needed for this test.
Live activation and real-money testing retain the existing human gates.
This entry supersedes earlier unconfirmed connection/testing statements below.

Devon subsequently authorized moving this work onto `main` and enabling remote
checkout **using Payfast's test system**. Prepare the reviewed release and set the
deployed checkout environment flag, retaining Payfast Test mode. This limited
sandbox authorization supersedes the earlier local-only test scope; live payments
remain gated. All 284 unit/integration tests passed during release preparation.

## Payfast selected; client account created — 16 September 2026

Devon confirms the client has created a Payfast account. INF-38 now delivers
Payfast through the existing Shopify-hosted checkout; it remains In Progress,
owned by Devon. Merchant verification, dashboard access, Shopify app connection,
commercial terms and test/live state are still unconfirmed. Account creation
does not establish approval or payment readiness.

The [Payfast delivery record](../features/inf-38-payfast.md) owns the next steps.
INF-38/40/42 and the Plane project summary are reconciled to Payfast, with
existing dependencies and human gates retained. Confirm verification and access,
connect the supported app, then verify supported sandbox flows before proposing
live enablement. No production checkout flag or provider setting has changed.

This decision supersedes the Peach provider references and replacement-selection
pending statements below. The earlier audit, tests and Peach rejection are
historical evidence. Protected main was refreshed to `f1e2d88`; the local delivery
branch retains the earlier roadmap work and includes that current main.

## Payment-provider blocker — 15 September 2026

Peach declined the client's application because it has paused early-stage
merchant onboarding while rebuilding its process. Devon supplied the response;
it gives no committed reopening date beyond the coming months. The client has
no Peach merchant account. INF-38 remains In Progress in Plane, with an external
blocker; its sandbox setup cannot proceed. This supersedes the next-action wording
in the earlier readiness notes below.

Recommend evaluating Payfast Aggregation next: its official Shopify integration
and company/sole-trader registration are available in the published documentation.
Yoco also documents Shopify support. See the
[provider decision record](../features/inf-38-peach-payments.md#external-blocker-and-replacement-decision).
Devon/client selection, merchant approval, current fees and applicable test flows
must be confirmed before adopting a replacement. No provider switch is approved
by this blocker report alone.

INF-40 still requires an operational, tested payment provider through INF-38.
INF-39 and independent SEO/domain preparation can continue; final launch gates
remain. After provider selection, reconcile provider-specific task wording across
INF-38/40/42 and the launch sequence; preserve the Shopify-hosted checkout.

## Peach Payments started — 15 September 2026

Devon authorized INF-38 execution; it is now In Progress. The
[readiness record](../features/inf-38-peach-payments.md) confirms the supported
Shopify payment extension, current read-only ZAR/store-domain evidence, local
checkout gate and 14 passing baseline cart tests. Merchant status and dashboard
access remain unconfirmed; provider configuration and hosted payment tests are
not complete. Continue with sandbox connection after that information is supplied.
The initial Todo states in the launch-plan snapshot below are historical for
INF-38; other task states and launch gates remain unchanged.

## Launch completion — 15 September 2026

Devon requested the remaining launch work: Peach Payments, restoration of the
customer account icon and Shopify account functionality, complete end-to-end
verification, then final SEO checks and domain switchover. This section governs
the current sequence and supersedes older account exclusions and indefinite
checkout/SEO deferrals below. This update plans the work; it does not claim
payment activation, account provisioning or launch verification is complete.

Protected `main` was safely fast-forwarded to `ffe19c1` before this refresh.
Plane was checked: INF-33/34 are Done; INF-35 is In Progress (Devon), INF-36
is Backlog (Shawnee), INF-28 is Todo (Devon), and INF-31 is In Progress
(Shawnee). Preserve existing factual, asset and publication decisions; the
remaining content is not automatically accepted by this launch plan.

### Devon's delivery tasks

All five new Plane tasks are assigned to Devon and start in Todo. Dependencies
are recorded as actual Plane blocking relationships as well as in this roadmap.

| Item   | Deliverable                                                         | Completion depends on                               |
| ------ | ------------------------------------------------------------------- | --------------------------------------------------- |
| INF-38 | Integrate Payfast with Shopify-hosted checkout                      | Merchant verification, access and test connection   |
| INF-39 | Restore the customer account icon and Shopify account functionality | Shopify account/domain and environment discovery    |
| INF-40 | Verify the complete storefront, payment and account journey         | INF-38, INF-39                                      |
| INF-41 | Complete final SEO and launch discoverability checks                | INF-40, INF-31 (retains INF-28 approval dependency) |
| INF-42 | Switch the production domain and verify launch                      | INF-40, INF-41, INF-36                              |

Payments and accounts can be prepared independently. Complete their combined
E2E evidence before final SEO acceptance, then switch the domain after independent
release review. SEO audit and DNS planning can start earlier; their completion
gates remain in this order. No target dates are assumed.

### Acceptance and evidence

- **INF-38 — payments:** Confirm the existing store's supported Payfast integration,
  merchant readiness, methods, fees and test/live setup against current official
  documentation. Preserve cart → Shopify `checkoutUrl`; Shopify owns orders,
  totals and payment state. Prove success, decline, cancel, pending/retry and
  applicable authentication flows, correct ZAR/shipping/tax/discount totals,
  matching provider/order references and no duplicate charges/orders. Record
  refund/cancellation checks, sanitized evidence and activation/rollback steps.
- **INF-39 — accounts:** Reuse the existing Account utility icon, `/account`
  route and server-side hosted handoff. `accountHref` controls icon visibility;
  `.env.example` defaults `SHOPIFY_ACCOUNT_HANDOFF_ENABLED` to `false`. Actual
  deployed flags and Shopify provisioning still need inspection. Verify new and
  returning customer sign-in, sign-out, own-order history/detail, return to store,
  guest checkout and unavailable/error recovery. Shape/review navigation states,
  then update Storybook before integration; capture visual comparisons at
  1440/768/390/320, keyboard/focus and 44px targets. Preserve Shopify customer
  ownership and document any account-domain prerequisite for cutover.
- **INF-40 — E2E:** Test all six launch products and primary/support routes,
  product availability, cart mutations/persistence, guest and signed-in checkout,
  Payfast test payment, Shopify order confirmation and account order history.
  Exercise stock/network/provider failures and retries on mobile and desktop.
  Attach a named commit/preview, expected/actual matrix, sanitized transaction
  references, traces and defect retests. Distinguish mocked automation from real
  hosted-provider test evidence. Hand results to Shawnee for INF-36 review.
- **INF-41 — SEO:** Check every public route's approved titles/descriptions,
  headings, alt text, sharing previews, canonical URLs, robots/sitemap behavior,
  accurate product structured data, private/preview indexing exclusions,
  redirects, broken links and mobile performance. Confirm the apex/www choice,
  remove preview/localhost references, and prepare Search Console verification
  and sitemap submission. INF-28/31 retain factual/source approval and publication.
  Final acceptance requires approved launch content; post-cutover checks pass to
  INF-42.
- **INF-42 — domain:** Confirm hostname and DNS ownership; record current records,
  TTL, Vercel/Shopify/account configuration, mail dependencies and rollback target.
  Prepare a concrete cutover plan before Devon authorizes execution. Preserve
  mail/unrelated records; verify DNS, HTTPS, canonical redirects, configured
  callbacks/return links, public-route health, cart/payment/account smoke tests,
  indexing and sitemap submission. Record the observation window, errors,
  deployed commit and post-cutover results.

### Independent review and remaining gates

INF-36 remains Shawnee's independent release review, now also blocked by INF-40;
its INF-34/35 dependencies remain. It accepts the deployed release candidate,
required checks, visual/accessibility evidence, residual risks, human merge and
post-merge smoke results before custom-domain cutover. INF-42 owns the final
domain and post-cutover evidence; do not add a reciprocal INF-42 blocker to
INF-36. Devon's E2E execution does not replace independent acceptance.

INF-35 stays open for remaining editorial/service work; Contact and the initial
notes/character Guide matcher are delivered. INF-28/31 remain the factual,
asset/content and source-publication gates. INF-37 About/Gallery refinement and
INF-3/4 stockist work remain outside this launch sequence.

Devon approves commercial terms, live payment/account enablement, real-money
tests and the reviewed domain cutover. Required checks, independent review,
human merge, production and editorial-publication gates remain. Use supported
Shopify-hosted services; no custom checkout, identity backend or CMS migration.
Credentials and customer data must not appear in public configuration or evidence.

## Delivery history

The dated entries below retain prior decisions and evidence. Where scope or
sequence differs, the 15 September launch plan above takes precedence.

## Navigation spacing refinement — 12 September 2026

PR #83 is human-merged at `9df487d`; its pending merge statements below are
historical. Devon requested more header breathing room after reviewing the
merged design. Bounded refinement in PR #84 on `agent/navigation-spacing`: 86px desktop,
78px mobile/tablet after another 3px per side, existing logo size, shared hero/menu
offset and unchanged scroll threshold. Devon also requested six-second editorial
autoplay with accessible pause controls, increased laptop arrow clearance and a
soft moving-edge fade. Mobile and wide desktop gutters remain. Verify Storybook and integrated responsive keyboard/scroll
states before preview and human merge. INF-35 remains In Progress (Devon),
INF-36 Backlog (Shawnee); content, checkout and publication deferrals remain.

## Consolidated delivery — 12 September 2026

Devon requested one delivery PR: #83 combines the approved carousel/navigation,
interim Contact defaults from #82 and current design governance from #71.
The August redesign #51 is superseded by the September approved deliveries;
its retired automation, alternative styling and static product-image overrides
are not restored. See [consolidation record](../features/pr-83-consolidation.md).
INF-33/34 are Done; Contact and notes/character Guide matching are delivered.
INF-35 remains In Progress (Devon), INF-36 Backlog (Shawnee), with INF-28/31
facts, final assets, care/policies, SEO and source-publication deferrals intact.
Use [the implementation contract](../design-implementation.md) for component
mapping and Storybook-first verification. Preview review and human merge remain
required; consolidation does not enable checkout or publish source content.

## Carousel/navigation refinement — 12 September 2026

Devon authorized implementing the reviewed carousel and floating-navigation design
in one Treehouse worktree, with generated background comparison assets and
Storybook review. See [the bounded contract](../features/carousel-navigation.md).
Branch `agent/carousel-navigation`; coordinator is sole writer. Extend existing
components and additive Sanity fields, retaining shared-copy fallback, cart/account
contracts and all Home sections. Local review is the immediate delivery; final
source publication, release verification and human merge remain separate gates.
Plane INF-35 was rechecked: In Progress, owner Devon; INF-36 stays downstream and
INF-28/31 factual/content deferrals remain. This refinement does not mark those
broader tickets complete.

## Interim editorial support content — 12 September 2026

Devon keeps the approved About, Contact and Guide layouts and authorizes
replaceable default support copy while final policies/care instructions are
being gathered. Dione’s address is confirmed. The [delivery brief](../features/inf-35-editorial-defaults.md)
records Contact enquiry defaults, fallback/error mailbox alignment, source
replacement and verification. One delivery branch, `agent/editorial-defaults`;
coordinator sole writer. INF-27/35 remain In Progress; final policy/care facts
remain INF-28/31 follow-up and INF-36 stays Backlog. Human preview/merge and
source-publication gates remain. About, Contact and initial Guide matching
were already merged through PRs #74–76; they are not pending implementation.
PR #81 is also merged at `a163bb4`; Plane records green main CI and production
smoke evidence, superseding the pending navigation-correction notes below.

## Post-merge navigation focus correction - 9 September 2026

Devon approved and merged PR #80 at `0a24c0c`; production health and smoke checks
passed. This supersedes its pending preview/merge statements below. Main CI
34382271092 passed with one resize-focus retry; production reproduction confirmed
a browser blur-before-resize race. The [follow-up contract](../features/cart-count-accessibility.md#post-merge-resize-race)
restores the already-approved focus behavior on `agent/navigation-resize-focus`.
Coordinator remains sole writer in the retained worktree. INF-36 stays Backlog
(owner Shawnee); INF-35 and checkout/content deferrals remain unchanged.
The correction needs its own green CI, preview review and human merge.

## Cart count and accessibility preparation - 9 September 2026

PR #79 is merged and live at `3afc3e5`; post-merge main CI 34374822016 passed.
This supersedes its pending merge/verification statements below. Devon approved
continuing with [cart-count and navigation accessibility](../features/cart-count-accessibility.md).
PR #80 implements that contract; targeted units and browser checks passed.
Full exact-commit CI and preview evidence are tracked on the PR.
One delivery branch, `agent/cart-count-accessibility`, coordinator as sole writer.
INF-36 remains Backlog, owned by Shawnee, with full release dependencies blocked.
INF-35 remains In Progress; checkout and INF-28/31 content deferrals remain.
Current-change preview acceptance and human merge are still required.

## Storefront recovery preparation - 9 September 2026

Devon merged mobile PR #78 at `c7b6016` and authorized continuing technical
readiness. Continue the [recovery contract](../features/storefront-recovery.md):
honest cart-read failure and retry, expired-session handling, failed image
fallbacks and verification of quantity retry/unavailable products.
Use one delivery branch, `agent/storefront-recovery`, with the coordinator as
sole writer. Existing approved layouts, checkout gate and source deferrals stay.

INF-36 remains blocked for full release (owner Shawnee); this is advance
technical preparation. INF-35 remains In Progress and INF-28/31 deferrals remain.
Current-change preview acceptance and human merge remain gates.

## Mobile performance preparation - 9 September 2026

PR #77 is approved, merged and live at `8f5fd98`; production cart focus
verification and post-merge main CI 34367492443 passed. This supersedes its
pending verification and merge statements below.

Devon authorized mobile performance work while checkout/content remain deferred.
The [mobile performance record](../features/mobile-performance.md) defines the
bounded acceptance and measured first-image scheduling improvement for About.
One delivery branch is `agent/mobile-performance`, with the coordinator as sole
writer. Preserve all approved image geometry and existing source content.

This advances INF-36 performance preparation (owner Shawnee) without completing
its blocked release scope. INF-35 stays In Progress; INF-28/31 deferrals remain.
Preview acceptance and human merge remain gates for the mobile change.

## Storefront readiness review - 9 September 2026

Devon merged Guide matching PR #76 at `dbe8296`; post-merge main CI passed
and production health reports that commit. Suggested fragrances appear above
preferences as requested. This supersedes the pending matching delivery below.

Continue INF-35 with a bounded storefront review, keeping existing photography,
product/service facts, care, SEO and source-publication deferrals. The
[readiness record](../features/inf-35-readiness-review.md) records responsive,
accessibility, catalogue, Guide and cart evidence. It identifies and addresses
cart focus restoration when a refresh outlasts the confirmation drawer.
Checkout remains disabled and its external handoff is not verified.

INF-35 remains In Progress, owned by Devon; INF-27 remains In Progress, owned
by Shawnee, and INF-28/31 deferrals stay open. INF-36 remains downstream and
is not completed by this bounded review. One delivery branch is
`agent/inf35-readiness-review`; the coordinator is the sole repository writer
and the content/commerce engineer provides read-only review. Current-change
verification, preview review and human merge remain delivery gates.

## Fragrance matching delivery - 9 September 2026

Contact is complete and live: Devon merged PR #75 at `3e768c7`.
Post-merge main CI and production Home/Contact/Shop/Cart/health checks passed.
This supersedes pending Contact delivery and merge statements below.

Devon authorized starting the remaining INF-35 matching work. The
[matching review](../features/inf-35-fragrance-matching.md) records a read-only
source audit, proposed associations/scoring, example results and acceptance
criteria. The current proposal uses note/character choices only; using room,
mood, comparative presence and time requires further owner-approved mappings.
Devon approved this narrower first version and exact rules. INF-35 now implements
source-explained matches, current Shopify product links, ties and recovery states.
Figma and Storybook are synchronized; PR #76 is merged and live with green main CI.
Further dimensions and Sanity source publication retain their separate gates.

INF-35 remains In Progress, owned by Devon. INF-27 remains In Progress, owned
by Shawnee; INF-34 is Done. INF-31 content/source deferrals remain open.
INF-36 remains downstream. One delivery branch is
`agent/inf35-fragrance-matching`; the coordinator writes repository files and
the content/commerce engineer performs read-only source review.

## Contact implementation - 9 September 2026

Devon authorized continuing Contact under INF-27 after approving PR #74 on
desktop, tablet and mobile and human-merging it at `d6c2018`.
About, Guide preferences and shared button corrections are live. Production
Home, About, Guide, Cart and health smoke checks passed; the health version
matched the merge. Post-merge main CI passed on `d6c2018`.
Guide recommendations remain unavailable pending matching.

Devon approved Contact at 1440/768/390/320 and authorized implementation.
INF-27 remains In Progress for Guide matching; Contact visual approval is complete.
PR #75 implements Contact under INF-35 using the existing direct-email
behavior, published mailbox and approved copy. Preserve the shared shell,
semantic tokens and fonts. Devon requested Shop's placeholder hero image with
centered hero text, a centered email section and Home's gold invitation surface
for full-width writing guidance. No contact form, new service facts or source
publication is authorized. See the [Contact brief](../features/inf-27-contact.md).

INF-35's bounded delivery in [PR #74](https://github.com/djamestaft/infusiondiffusion/pull/74)
is merged. The full ticket remains In Progress for Contact, matching and
remaining editorial/service scope. INF-36 remains downstream of that scope;
final photography, facts, care, SEO and source publication retain their deferrals.
Seven Contact Chromium checks, template units, Storybook checks and independent
visual/source review passed. Final CI and human merge remain gates. One delivery branch is
`agent/inf27-contact-design`; the designer edits Figma only.

## INF-33 implementation — 9 September 2026

INF-33 is Done: Devon authorized merge and PR #72 landed at 9615957.
PR #62 already exposes the complete Shop catalogue. The current delivery
corrects the remaining hero/grid/card presentation and purchase hierarchy;
see [acceptance and comparison record](../features/inf-33-approved-shop-product.md).
Independent review, current-head GitHub quality and PR gate passed. The Vercel
preview was Ready, with authenticated route verification limited by SSO.
INF-34 is Done: Devon merged PR #73 at `33a826c`, including the shared
header/footer, Home and Cart. See the
[delivery contract](../features/inf-34-approved-home-shell-cart.md).
Plane records successful post-merge Home, Cart and health smoke checks.
Content/photography/care/SEO deferrals remain unchanged.

## Current approval and next delivery — 8 September 2026

Devon approved all 24 current main-Exploration customer layouts: Home, Shop,
Product, Cart, combined About and Fragrance Guide Variation 02 at four widths.
Promote these exact frames and their separate supporting contracts to Approved;
the [dated handoff](../features/2026-09-08-design-approval.md) is the current
page-level authority and supersedes the pending visual-approval statements
in the earlier chronological notes below.

INF-32's shopping-journey visual approval is complete. INF-27's combined About
and Guide layouts are approved; Contact has no frame in this set and remains
open. The separate card-by-card guide experiment is retained as exploration.
The approved Guide is Variation 02, not an approval of a working matching
engine or its unverified product mappings.

Next delivery is INF-33/34 implementation against these approved frames,
preserving existing commerce and editorial boundaries. Complete Contact and
remaining Guide content/matching decisions under INF-27 before INF-35's full
editorial release. Final photography, product/service facts, care guidance,
Sanity SEO and source publication remain deferred through INF-28/31.
Human merge and release verification gates remain unchanged.

## Current user deferrals — 8 September 2026

Devon deferred the Sanity SEO description update, final photography, and
outstanding product/service facts until later. These items remain open in
INF-28/31; they are not prerequisites for the next shopping-journey design
milestone. This decision supersedes the final-content prerequisites below.

INF-32 is now In Progress: shape and review Home, Shop, product,
existing cart and shared footer using existing imagery and verified content.
Omit unavailable facts and unsupported claims. Record provisional imagery and
content omissions outside customer frames; do not invent replacement facts.
Final photography and factual enrichment return through INF-28/31 later.
The [shopping-journey brief](../features/inf-32-shopping-journey.md) records
the reviewed implementation baseline, scope, observable acceptance criteria
and required design/state evidence. Shawnee owns delivery; Devon approves
the revised design. Repository and Figma exploration do not approve release.
Devon has now authorized a card-by-card Fragrance Guide exploration under
INF-27: one question per screen, answer selection and explicit Next.
Use the existing separate Figma page `2153:3`
(`eploration-fragrance guide system`) and preserve its earlier concepts.
This exploration may proceed before whole-journey approval; INF-32 remains
the dependency for final editorial approval and downstream implementation.
Question copy and product matching remain provisional. See the
[guide exploration brief](../features/inf-27-fragrance-guide-system.md).
Sanity publication is paused, including the deferred SEO description.

INF-32 no longer has a blocking dependency on completion of INF-31. Devon's
approval of exact revised Figma frames still gates downstream implementation;
merge and release verification gates remain. Final-asset acceptance remains
open and must not be reported as complete from this interim design review.

## INF-32 review correction — 8 September 2026

Restore the existing Home Fragrance Guide, 200 ml / Made to linger, and
Made meaningful by the details sections in their original order. Content
deferrals do not authorize removing those sections. Correct Home hero image
letterboxing so the existing imagery fills its frames at every width.

Devon also directed combining Gallery and About. Remove Gallery from the
responsive header and keep About; INF-27/35 must shape and implement the
combined editorial destination. Gallery is also removed from the shared footer
under Devon's follow-up correction. Preserve the existing Gallery route until
that transition is defined. INF-37 now represents later
refinement of the combined About/Gallery experience, not a separate Gallery
redesign. Existing design, source publication and merge gates still apply.

Devon selected the approved Shop product-card format for Home as well.
Reuse its square FILL media, elevated content panel, typography, spacing
and commerce states across both surfaces. This explicit choice supersedes
the earlier flat Home-card restoration. Keep Home's 3/4/3/3 selection across
1440/768/390/320 widths and all six Shop products; the card format is shared,
while each page retains its own selection and grid.

## Goal and existing systems

Evolve the recognizable Infusion Diffusion brand into a cohesive premium
shopping experience. The first milestone covers Home, Shop, product detail,
the existing cart and Shopify checkout handoff, plus essential brand and
service pages, with Gallery and About planned as one editorial destination.
Further refinement of that combined experience follows.

Shopify ecommerce, catalogue, variants, prices, inventory, cart and hosted
checkout are already integrated. Sanity already owns CMS/editorial content.
Preserve these integrations; improve presentation, content readiness and
verification. The 15 September launch plan adds Peach Payments and restoration
of the existing Shopify account handoff. No new commerce backend, CMS migration,
custom identity backend or custom checkout is in scope.

The user approved brand evolution, an asset workstream and the complete
shopping journey first. Retain the logo and Marcellus/Manrope by default;
revisit composition, imagery and dark/light balance through explicit Figma
approval. Use Charlotte Rhys as a product-clarity reference and Cape Island
as an editorial-imagery reference, without copying their catalogue breadth.

## Governance and visual authority

This document is the strategic source of truth; Plane project INF is the
execution ledger. Before starting delivery, safely refresh protected main,
read this roadmap and retrieve the ticket. Every active item must name its
owner, dependencies, acceptance evidence and human gate. Use actual Plane
dependency relationships as well as readable descriptions.

The sole visual authority is Figma file `jIMvwSBkilg7eplo3IiHPa`,
`30 — Redesign / Approved` (`2004:14`). Exploration and retired files do
not authorize implementation. Existing approvals remain historical evidence;
INF-32 owns revised journey approval. Exact frames populated with real content
must be accepted before new implementation is treated as final.

Next.js owns presentation, Shopify owns commerce truth, Sanity owns editorial
content, and Storybook owns reusable UI state contracts. Do not invent product
or service claims. Source publication, expenditure, design acceptance, merge
and production promotion retain their named human gates.

## Verified delivery baseline

- Home PR #60 was human-merged at `e6ea435`; main and live health reported
  `b4feec3` during the 7 September assessment. INF-24 remains Done.
- INF-25 baseline verification and INF-22 Devon review are Done. The merged
  7 September evidence distinguishes resolved findings from remaining visual
  and missing-media work transferred to INF-32/33/34; transfer is not correction.
- INF-26 Shop/product design approval is complete. Shop frames:
  `2209:24`–`2209:27`; product detail: `2209:28`–`2209:31`; states:
  `2209:32`. Approved layouts still require final content acceptance.
- INF-29 Shop/product implementation was human-merged through
  [PR #62](https://github.com/djamestaft/infusiondiffusion/pull/62) at
  `30a7003`. Devon approved the Shop and product layouts at desktop, tablet and
  mobile widths; post-merge GitHub quality, including Chromium E2E, passed.
  Vercel reported a successful deployment, while deployment protection prevents
  unauthenticated live-route smoke evidence.
- Review PR #62 before commissioning overlapping changes. Its documentation
  changes must preserve this newer roadmap when integrated; do not restore
  the earlier Home-first sequence during conflict resolution.
- INF-21/23 and completed INF-6–20 remain historical approvals/delivery
  records, not blanket proof of the revised journey's readiness.

## Delivery tickets and dependencies

Shawnee owns delivery preparation unless otherwise stated. Devon owns factual,
design and merge decisions. Independent verification is required for release.

| Item   | Outcome                                                                                | Depends on                   |
| ------ | -------------------------------------------------------------------------------------- | ---------------------------- |
| INF-25 | Resolve or explicitly transfer each Home baseline finding with evidence                | INF-24                       |
| INF-22 | Devon reviews Home baseline acceptance and outstanding deviations                      | INF-25                       |
| INF-29 | Review and finish existing Shop/product delivery without overlapping rework            | INF-23, INF-26               |
| INF-28 | Devon approves launch product/service facts, naming and metadata                       | Ready alongside asset audit  |
| INF-30 | Audit launch assets, provenance, rights, image roles and missing shots                 | Approved and merged          |
| INF-31 | Complete approved launch assets/content and source-specific previews                   | INF-30, INF-28               |
| INF-32 | Approve responsive Home/Shop/product/cart/footer using available verified content      | INF-31 final assets deferred |
| INF-33 | Correct remaining catalogue visibility and purchase hierarchy defects                  | INF-29, INF-32               |
| INF-34 | Implement revised Home, shared shell/footer, product presentation and existing cart UI | INF-32, INF-33               |
| INF-27 | Approve essential Fragrance Guide, combined About/Gallery and Contact templates        | INF-32, INF-21, INF-23       |
| INF-35 | Implement essential editorial/service pages and product-linked guidance                | INF-27, INF-31, INF-34       |
| INF-36 | Independently verify, obtain human merge and record post-merge smoke evidence          | INF-34, INF-35, INF-40       |
| INF-37 | Refine combined About/Gallery after the shopping milestone; preserve existing URLs     | INF-36                       |

INF-30's audit and owner approval are merged through PRs #66/#67; the required
quality check passed on `d79b673`, and its Plane status is reconciled to Done.
Final asset acquisition, source manifests, expenditure and publication retain
their downstream gates.

The outstanding INF-28 factual decisions are deferred as recorded above. The
[launch content decision sheet](../features/inf-28-launch-content-decisions.md)
preserves the 2 September naming/claims/contact/metadata approvals, identifies
unapplied source corrections, and records unresolved title convention, scent notes,
care, service, mailbox and metadata choices against a fresh source snapshot.
On 7 September Devon confirmed the current launch is the six existing 200 ml
reed diffusers only. Candles and room sprays must not be advertised as launch
products. INF-28 U2 is Accepted; U1's range is Accepted while the title suffix
and Shopify product-type field remain unresolved. INF-31 owns the corresponding
source wording preview and later approved publication. Devon subsequently
authorized Home and metadata wording implementation. The Fragrance Guide is
deferred to Devon's new format; image replacement and missing information will
be added later. Those deferrals permit this wording delivery without treating
the final launch-content or revised-design gates as complete.
INF-28 remains Todo for outstanding decisions. On 7 September the user deferred
Santuaire Serein’s specific fragrance notes and authorized continued preparation.
INF-31 may progress approved naming and asset-source inventory while those notes
remain unlisted; it is In Progress for preparation only. Its completion and
publication still require the remaining applicable factual and asset approvals.
The proposed short Santuaire replacement description is not an accepted change.
See the [preparation package](../features/inf-31-launch-content-preparation.md).
INF-32 must review related INF-29 evidence, but does not require the older
implementation to merge before revised design can proceed.
Dependent implementation remains in Backlog until approval contracts exist.
One delivery branch is the default; multiple writing agents require separately
approved topology and isolated Treehouse worktrees.

INF-1, INF-2 and INF-5 are Cancelled as superseded planning/discovery items,
not falsely completed or deleted. Their history remains accessible. INF-3/4
stockist work stays in its separate backlog. No completed design ticket is
reopened merely to erase a previous direction.

## Acceptance and release

- Every launch product has approved, accurate primary imagery, consistent
  scale/crops and concise scent differentiators; facts and rights are recorded.
  Figma customer frames contain no placeholder merchandise or technical notes.
- Shop displays the complete catalogue at 1440, 768, 390 and 320 widths.
  Homepage selection is independent from full-catalogue output. INF-33 records
  fixes already delivered by INF-29 and avoids duplicating them.
- Product identity, price, availability, options and purchase controls precede
  expanded storytelling; duplicated description summaries are removed.
- Shared footer and purchase reassurance expose approved delivery, returns,
  contact and policy information. Fragrance guidance links to products.
  Preserve URLs; approved handle changes require redirects.
- Existing Shopify add/update/remove cart, persistence, unavailable items,
  recovery and checkout handoff pass regression checks. No paid order or
  direct production deployment is implied by verification authority.
- Figma, DESIGN.md, semantic tokens, components and Storybook agree, with any
  intentional divergence explicitly approved. Check loading/error/empty,
  long-content/missing-media, keyboard/focus, 44px targets, AA contrast,
  reduced motion, constrained connections and image performance.
- Required local and GitHub checks pass on the reviewed commit. Attach exact
  preview, screenshots, independent review, residual risk and rollback target.
  A Done label, deployment or green CI alone is not visual approval.
- Devon approves merge; verify Home, Shop, product, cart, support and health
  after release before INF-36 is complete. Sanity publishing remains a separate
  human editorial decision.

Historical handoff details remain in `docs/planning/redesign-context.md`;
this roadmap governs current order and scope.
