# Persistent Customer Account Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task-by-task. Keep one
> writing delivery branch; read-only specialist reviews may run alongside it.

**Goal:** Persist the Shopify-authenticated customer across storefront visits and
show verified initials plus a basic account summary.

**Architecture:** Shopify Customer Account API authorization-code authentication
with Next.js server routes and a maintained OIDC library. A secure opaque browser
cookie addresses a managed Redis session; profile/order truth stays in Shopify.

**Tech Stack:** Next.js 16, Shopify Customer Account API 2026-07, openid-client v6,
managed Redis with atomic updates, Vitest, Storybook, Playwright.

**Spec:** [Persistent customer identity](../specs/2026-09-16-persistent-customer-account.md).
Runtime implementation and local checks are now present in PR #91. Real Shopify/
Upstash setup, remote acceptance and release remain pending. The checklist below
is the original detailed acceptance plan; see the roadmap for current evidence.

## Global constraints

- Preserve the currently working hosted account/orders link and guest checkout.
- Shopify owns identity, customer profile, orders and payment truth.
- No tokens or secrets in client components, logs, URLs, localStorage or shared caches.
- No process-memory production session store. No fake authenticated identity.
- Personal responses are private/no-store; OAuth callbacks are HTTPS and registered.
- No real payment, fulfilment, DNS change or unapproved service provisioning.
- Existing 44px Account target, semantic tokens, fonts and header geometry remain.
- Human release approval and exact-head CI/preview evidence remain required.

## 1. Configuration and session boundary

**Files:** `src/lib/shopify/customer-account/config.ts`, `discovery.ts`,
`session.ts` and their tests; `.env.example`; `docs/operations.md`.

- [ ] Confirm Headless client settings and a server-only secret-management path.
- [ ] Confirm the managed Redis integration, plan/cost, environment isolation and
      stable HTTPS preview hostname before provisioning or changing external state.
- [ ] Retrieve current official OIDC/Redis package APIs with Context7, then pin
      suitable dependencies. Do not implement JWT verification by hand.
- [ ] Test missing/invalid configuration, trusted discovery URL validation and API
      version pinning before implementation; retain disabled hosted fallback.
- [ ] Test session cookie attributes, identifier rotation, TTL/absolute lifetime,
      encrypted token storage, expired/missing sessions and safe deletion.
- [ ] Test atomic refresh coordination, version mismatch and logout racing refresh.
      A production store failure must not fall back to process memory.
- [ ] Implement the server-only boundary and run targeted Vitest/security review.

## 2. Shopify authorization and profile

**Files:** `src/lib/shopify/customer-account/oauth.ts`, `client.ts`, `profile.ts`;
`src/app/(website)/account/{login,callback,logout}/route.ts` and tests.

- [ ] Write failing cases for one-use state, nonce, PKCE, callback expiry/replay,
      issuer/audience/signature/expiry and safe same-origin return paths.
- [ ] Implement login and callback with the provider library, explicit client
      authentication and validated discovery metadata. Replace session on login.
- [ ] Test profile normalization for nullable names/email and provider failures.
      Query only id, firstName, lastName, emailAddress.emailAddress.
- [ ] Implement no-store profile reads; never return tokens or raw provider data.
- [ ] Test refresh success/revocation/outage separately; implement bounded refresh
      with the session store's atomic guard. Keep service error distinct from expiry.
- [ ] Implement same-origin/CSRF-protected POST logout, delete the local session,
      and continue through Shopify logout with the registered destination.
- [ ] Run meaningful unit/integration coverage, including two distinct customer
      identities and cross-instance refresh/logout races.

## 3. Signed-in presentation in Storybook

**Files:** `src/components/account/account-navigation.tsx`, `account-entry.tsx`,
`src/components/navigation.tsx`, relevant stories/tests and a shared normalized
profile/Unicode-initials contract.

- [ ] Build the verified initials state and summary in Storybook before route use.
- [ ] Test grapheme-safe names, mononyms, absent names and long/bidirectional text;
      absent name retains the icon. Do not derive initials from email.
- [ ] Cover signed-out, resolving, signed-in, expired, provider error/retry,
      signing-out and signed-out confirmation states using synthetic fixtures.
- [ ] Add labelled Name/Email rows, hosted View your orders and Sign out, preserving
      the existing Account page composition. No profile editing or order cards.
- [ ] Compare 1440/768/390/320 floating/scrolled/menu/account states with current
      approved references. Synchronize the new functional states with Figma and
      the brief; get independent visual review before live integration.

## 4. Request-safe integration

**Files:** `src/app/(website)/layout.tsx`, account page/error/loading routes,
account navigation provider and a private profile refresh handler if needed.

- [ ] Connect only normalized session/profile state; do not make public browsing
      depend on a working account provider. Preserve layout caching boundaries.
- [ ] Refresh identity on return/focus and login/logout; invalidate it across tabs
      without broadcasting credentials or retaining an old customer's PII.
- [ ] Ensure sign-in returns to the intended safe local page and orders remain
      Shopify-hosted. Do not redirect every anonymous page load to Shopify.
- [ ] Test HTML/RSC/CDN isolation, back/forward cache, expired grants, provider
      outages, logout, a shared browser switching users and guest checkout.

## 5. Controlled activation and acceptance

- [ ] Register the exact preview/test callback and logout URLs in the same client.
      Configure server-only credentials/session store; never copy secrets to chat.
- [ ] Run formatting, lint, types, unit/integration, Storybook/build and browser
      gates. Get independent review, open the delivery PR and pass exact-head CI.
- [ ] Verify real login/Shopify SSO, refresh after token expiry, browser restart,
      returning from orders, logout/re-entry, and two-customer isolation in preview.
- [ ] Have Devon verify actual basic profile and existing order with his own inbox.
- [ ] Record any hosted-account logout limitation; do not promise global logout
      synchronization without provider evidence.
- [ ] After human release approval, enable the prepared integration and smoke-test
      main. Rollback returns to hosted account handoff and stops local identity use.
- [ ] Reconcile INF-39/40 and roadmap evidence; add final-domain callback/logout
      changes to INF-42 before cutover. Keep Payfast in Test mode.
