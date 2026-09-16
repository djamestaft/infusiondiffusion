# Persistent customer identity on the storefront

## User outcome and current evidence

Devon signed in through the deployed account handoff and confirmed that his own
Shopify order appears. He now requests persistent signed-in state on returning
to the Infusion Diffusion storefront, with basic account information and initials.
This extends INF-39; the existing hosted order-history path has user confirmation.

Main `ca41848` implements a hosted account link, not a first-party customer session.
Shopify's hosted cookie does not authenticate the separate Vercel origin. The
navigation provider currently carries only `/account`; no identity is available.
Neither local nor Vercel configuration contains Customer Account API client
credentials or a durable session store. Shopify discovery endpoints respond and
identify this store's OAuth issuer and Customer Account API version 2026-07.
These public responses do not establish a registered client or permission grant.

## Proposed architecture

Keep Shopify as the identity and commerce authority. Add its Customer Account API
OAuth authorization-code flow to Next.js, using a Headless storefront confidential
client, a maintained OIDC library (`openid-client` v6), state, nonce and PKCE.
Resolve authentication/API endpoints through the configured shop's official
well-known discovery documents; validate metadata and pin API version 2026-07.
Do not reuse the Storefront private token or Shopify CLI theme session as customer
authorization. Verify issuer, audience, signature, expiry and nonce before accepting
identity. No passwords, custom identity database or replicated orders.

Use a random opaque first-party session cookie (`__Host-`, Secure, HttpOnly,
SameSite=Lax, Path=/) backed by managed Redis with TTL. Store only encrypted
short-lived token/session data. Configure an absolute session lifetime, bounded
by the provider's grant validity; propose 7 days initially. Refresh expired access
tokens server-side with atomic refresh coordination and versioned writes across
Vercel instances. Logout deletes the session; an in-flight refresh must not restore
it. Expired/revoked grants clear identity and offer sign-in; provider outages are
recoverable errors, not invented successful logins or expired-session claims.

Redis is a proposed additional managed service: account/plan availability and any
cost must be confirmed before provisioning. No new service has been created.
Encrypted-cookie-only sessions were considered, but whole token-bundle size,
parallel refresh overwrites and lack of central revocation make them a weaker fit.
Process-memory storage is unsuitable for multiple Vercel instances.

### Routes and data boundaries

- `/account/login`: create an expiring one-use OAuth transaction and safe local
  return path, then redirect to Shopify. An existing Shopify session may avoid
  another email-code prompt, but must still complete this application's callback.
- `/account/callback`: consume validated state/nonce/PKCE, exchange code, validate
  identity, rotate the local session identifier, redirect to the saved local path.
- `/account`: private, request-dependent basic profile summary and hosted orders
  link; signed-out users see Sign in. Preserve existing hosted handoff while the
  new integration is not configured/enabled.
- `POST /account/logout`: same-origin/CSRF-protected local invalidation, then
  Shopify's discovered logout endpoint and registered post-logout destination.
- Profile reads use the Customer Account API, separate from Storefront/Admin
  clients. Query only id, firstName, lastName and emailAddress.emailAddress.
- Client components receive normalized name/email/initials and session status,
  never access/refresh/ID tokens or opaque session IDs. Personal responses and
  upstream profile requests are private/no-store, outside shared Next/CDN caches.
- Revalidate visible identity on return/focus and after logout in another tab.
  Test back/forward cache and multiple tabs; do not display another customer's
  prior profile while resolving state. Do not automatically bounce every anonymous
  shopper to Shopify to check for an unrelated hosted session.

A hosted-only sign-in on another origin cannot silently establish local identity
without an OAuth round-trip. Use the storefront Sign in entry for the connected
session. Hosted-account logout/global logout synchronization must be tested; do
not claim it invalidates an independent local grant without evidence.

## UI contract

The designer reviewed the current navigation and account composition. Reuse the
44px Account target before the bag, existing focus/hover roles and 86px desktop /
78px tablet-phone header. Verified identity replaces UserRound with up to two
centred Manrope initials (12px semibold); no avatar disc, new colour or dropdown.
Use Unicode grapheme segmentation. A mononym gives one initial; absent name keeps
the glyph. Never derive initials from email. Accessible name is Account, signed
in as [name], or Account, signed in when no name is available.

Keep the existing light `/account` page and Your account H1. Signed-in state adds:

- View your purchases and manage your account.
- Semantic Name and Email rows, naturally wrapping with bidirectional isolation.
  Missing values read Not provided.
- Primary View your orders link to the verified hosted destination, same tab.
- Secondary Sign out button with pending state and duplicate-submit protection.

Actions stack below 640px, wrap in a row above, preserve centred labels and minimum
44px targets. Signed-out, resolving and expired states show the generic glyph.
Retain truthful loading, expired, error/retry and sign-out confirmation states.
Orders and profile editing remain hosted in Shopify.

References: Figma refinement nodes 2664:2 (desktop), 2674:22 (mobile), 2675:27
(menu), and Approved foundation 2039:571 in jIMvwSBkilg7eplo3IiHPa. Initials and the
profile summary are new requested functional states, absent from those frames.
Storybook/Figma synchronization and visual acceptance are pending; no new tokens
or typography system are proposed.

## Configuration needed before real authentication

1. Shopify Admin → Sales channels → Headless → existing storefront → Customer
   Account API settings: confirm/enable API and client type. Obtain this client's
   ID/secret through secret management. Never post the secret in chat.
2. Register exact HTTPS callback and logout addresses. Proposed test-site values:
   `https://infusion-diffusion.vercel.app/account/callback` and
   `https://infusion-diffusion.vercel.app/`. These routes are proposed, not deployed.
   Register a stable HTTPS preview callback separately; localhost HTTP is unsupported.
3. Confirm least required customer-read permissions. No profile mutation or
   direct storefront order retrieval is needed in this slice.
4. Configure managed Redis and an encryption key server-side, with separate
   environment namespaces/credentials, bounded TTL and atomic refresh support.
5. Add the final domain's callback/logout addresses before INF-42 cutover; retain
   the test addresses until rollback is no longer needed. No DNS changes now.

## Acceptance and verification

- Login from storefront establishes verified identity; page navigation, refresh,
  returning from Shopify orders and browser restart within lifetime retain it.
- Basic fields match the authenticated Shopify customer. Names/initials support
  missing names, mononyms, diacritics, non-Latin scripts and long emails.
- Fresh sign-in, existing Shopify SSO, access-token refresh, expiry/revocation,
  provider outage, logout/re-entry and cross-tab behaviour have real evidence.
- Invalid/replayed/expired callbacks, state/nonce mismatch, forged tokens and
  off-origin return URLs fail safely. Refresh races and refresh-after-logout do
  not resurrect a session or overwrite newer tokens.
- Two customers never share identity through HTML, RSC, CDN cache or a shared
  browser's back button. Logout clears all local identity; hosted logout behaviour
  is documented truthfully.
- Existing orders and guest Payfast Test checkout keep working; no real payment,
  fulfilment, identity migration or domain switch is part of this task.
- Storybook, Vitest and browser checks cover 1440/768/390/320, floating/scrolled
  headers, menu focus, errors, long content and reduced motion. Independent review,
  exact-head CI, controlled preview and human release approval remain required.

## Status and references

Design/technical preparation only. No new OAuth runtime, initials UI or session
storage has been implemented or enabled. Existing hosted account access remains
live. Awaiting client-configuration status and session-storage provisioning path.

- [Shopify setup](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started)
- [Customer Account authentication](https://shopify.dev/docs/api/customer/latest)
- [Customer profile schema](https://shopify.dev/docs/api/customer/2026-07/objects/Customer)
- [OIDC library](https://github.com/panva/openid-client)
- [Managed Redis on Vercel](https://vercel.com/docs/redis)
