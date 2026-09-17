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

## Delivery status — 17 September 2026

PR #91 is merged (`d4b751f`), followed by the black account header in #94 and
gold account avatar in #96 (`dcbcdc9` on main). Shopify client configuration and
free Upstash provisioning are complete. Preview and Production are configured
separately; main has its own encryption key and origin-derived namespace.
Devon confirms real main-site sign-in and persistent initials after refresh and
navigation. Basic profile and own-order visibility were confirmed earlier.

Checked items below reference the recorded implementation/verification evidence
in PR #91 and the account delivery records, not a new test run in this planning
update. Preserve the remaining real-provider checks: token renewal after expiry,
browser restart, logout/re-entry and two-customer isolation. INF-39 is Done for
delivered implementation; these unchecked acceptance steps now belong explicitly
to INF-40 with the combined journey. Final-domain
origin/callback/logout changes stay in INF-42. Payfast remains in Test mode.

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

- [x] Confirm Headless client settings and a server-only secret-management path.
- [x] Confirm the managed Redis integration, plan/cost, environment isolation and
      stable HTTPS preview hostname before provisioning or changing external state.
- [x] Retrieve current official OIDC/Redis package APIs with Context7, then pin
      suitable dependencies. Do not implement JWT verification by hand.
- [x] Test missing/invalid configuration, trusted discovery URL validation and API
      version pinning before implementation; retain disabled hosted fallback.
- [x] Test session cookie attributes, identifier rotation, TTL/absolute lifetime,
      encrypted token storage, expired/missing sessions and safe deletion.
- [x] Test atomic refresh coordination, version mismatch and logout racing refresh.
      A production store failure must not fall back to process memory.
- [x] Implement the server-only boundary and run targeted Vitest/security review.

## 2. Shopify authorization and profile

**Files:** `src/lib/shopify/customer-account/oauth.ts`, `client.ts`, `profile.ts`;
`src/app/(website)/account/{login,callback,logout}/route.ts` and tests.

- [x] Write failing cases for one-use state, nonce, PKCE, callback expiry/replay,
      issuer/audience/signature/expiry and safe same-origin return paths.
- [x] Implement login and callback with the provider library, explicit client
      authentication and validated discovery metadata. Replace session on login.
- [x] Test profile normalization for nullable names/email and provider failures.
      Query only id, firstName, lastName, emailAddress.emailAddress.
- [x] Implement no-store profile reads; never return tokens or raw provider data.
- [x] Test refresh success/revocation/outage separately; implement bounded refresh
      with the session store's atomic guard. Keep service error distinct from expiry.
- [x] Implement same-origin/CSRF-protected POST logout, delete the local session,
      and continue through Shopify logout with the registered destination.
- [x] Run meaningful unit/integration coverage, including two distinct customer
      identities and cross-instance refresh/logout races.

## 3. Signed-in presentation in Storybook

**Files:** `src/components/account/account-navigation.tsx`, `account-entry.tsx`,
`src/components/navigation.tsx`, relevant stories/tests and a shared normalized
profile/Unicode-initials contract.

- [x] Build the verified initials state and summary in Storybook before route use.
- [x] Test grapheme-safe names, mononyms, absent names and long/bidirectional text;
      absent name retains the icon. Do not derive initials from email.
- [x] Cover signed-out, resolving, signed-in, expired, provider error/retry,
      signing-out and signed-out confirmation states using synthetic fixtures.
- [x] Add labelled Name/Email rows, hosted View your orders and Sign out, using
      the subsequently approved two-column/stacked account layout. No profile editing or order cards.
- [x] Compare 1440/768/390/320 floating/scrolled/menu/account states with current
      approved references. Synchronize the new functional states with Figma and
      the brief; get independent visual review before live integration.

## 4. Request-safe integration

**Files:** `src/app/(website)/layout.tsx`, account page/error/loading routes,
account navigation provider and a private profile refresh handler if needed.

- [x] Connect only normalized session/profile state; do not make public browsing
      depend on a working account provider. Preserve layout caching boundaries.
- [x] Refresh identity on return/focus and login/logout; invalidate it across tabs
      without broadcasting credentials or retaining an old customer's PII.
- [x] Ensure sign-in returns to the intended safe local page and orders remain
      Shopify-hosted. Do not redirect every anonymous page load to Shopify.
- [x] Verify private/no-store profile responses, absence of personal data in shared
      HTML, fixture logout/customer-switch/outage paths and preserved guest checkout.
- [ ] Complete explicit back/forward-cache and deployed cache-isolation acceptance
      as part of the combined browser matrix; do not infer it from fixture tests.

## 5. Controlled activation and acceptance

- [x] Register the exact preview/test callback and logout URLs in the same client.
      Configure server-only credentials/session store; never copy secrets to chat.
- [x] Run formatting, lint, types, unit/integration, Storybook/build and browser
      gates. Get independent review, open the delivery PR and pass exact-head CI.
- [x] Verify real sign-in, profile, existing order visibility and persistence after
      page refresh/navigation; main-site acceptance supplied by Devon on 17 September.
- [ ] Verify real token renewal after expiry, browser restart, logout/re-entry,
      return from hosted orders and two-customer isolation. A page refresh alone
      does not establish OAuth token renewal.
- [x] Have Devon verify actual basic profile and existing order with his own inbox.
- [x] Record any hosted-account logout limitation; do not promise global logout
      synchronization without provider evidence.
- [x] After human release approval, enable the prepared integration and smoke-test
      main. Rollback returns to hosted account handoff and stops local identity use.
- [x] Reconcile INF-39/40 and roadmap evidence; add final-domain callback/logout
      changes to INF-42 before cutover. Keep Payfast in Test mode.
