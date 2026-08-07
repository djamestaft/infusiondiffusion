# Plan: first `/account` customer entry

## Goal and current evidence

Create the first-party `/account` route that resolves Navigation’s existing default `accountHref="/account"` for an unauthenticated returning customer, then hands the customer to a Shopify-hosted account destination only when Shopify itself returns a usable destination. The route must remain a truthful entry shell, not an authenticated account area.

Repository and platform evidence establishes the following decision:

- `src/components/navigation.tsx` already routes the Account utility to `/account`; no `/account` route exists.
- The Storefront transport is server-only, normalizes failures, and is pinned to `2026-07` in `src/lib/shopify/client.ts` and `.env.example`.
- Shopify’s official Storefront API 2026-07 `Shop` reference defines nullable `shop.customerAccountUrl: String` and says it is present only when the shop has a customer-account vanity domain. Do not construct a URL from `SHOPIFY_STORE_DOMAIN` or assume `/account` on a Shopify domain.
- The current checkout has `.env.local`, but a sanitized presence check found the complete local Storefront configuration missing. Therefore no live `customerAccountUrl`, enabled account mode, Customer Account API client, OIDC redirect URI, customer scope, or authenticated customer/order capability is currently proven.
- The official Customer Account API 2026-07 reference uses OAuth 2.0/OIDC discovery and PKCE for public clients. That is a later authenticated integration, not a requirement for this hosted handoff.
- Context7 is required as the first API/library documentation source by the request, but no Context7 tool is exposed in this planning runtime. Before implementation, the owner must check the 2026-07 Storefront `Shop.customerAccountUrl` and Customer Account authentication entries in Context7 first, then reconcile them against the official Shopify 2026-07 pages, which remain authoritative. A contradiction or removal is a blocker requiring plan/design revision.

**Decision:** build a guarded hosted handoff using normalized `shop.customerAccountUrl`; do not build Customer Account API/OIDC now. Render the handoff only when the server-only launch gate is on and Shopify returns a valid HTTPS URL. Missing Storefront configuration, a disabled gate, or a null URL produces a truthful unavailable state with no link. Provider/contract failures produce a recoverable error state. Authenticated order history and quick reorder are explicitly deferred because current credentials and capabilities do not prove access.

## Specialist routing and execution topology

- **Implementation owner — `storefront_engineer` (only repository writer):** one delivery branch and one pull request; owns all files listed below after the design gate opens.
- **Read-only advisory specialist — `product_designer`:** shape the Operate-mode account entry in canonical Figma, define responsive/state frames, document exact node URLs and reuse, and present them for human approval. This advisor does not approve its own work.
- **Read-only advisory specialist — `browser_release_debugger`:** independently verify the Vercel Preview, handoff URL behavior, `/api/health`, console/network evidence, and rollback readiness.
- **Independent review owner — `quality_reviewer`:** map acceptance criteria to evidence and review accessibility, security, Shopify ownership, tests, and unrelated diff.
- Default to one branch/PR. `.agents/skills/parallel-agent-worktrees` is not triggered unless an engineer explicitly approves multiple writers or a non-primary implementation checkout later.

## Applicable project skills

- `.agents/skills/feature-brief/SKILL.md`: the work needs observable acceptance criteria, explicit states, ownership, content, analytics, and unresolved human decisions.
- `.agents/skills/impeccable/SKILL.md` (`shape`, established visual world, Operate mode): this is a new task-focused customer surface requiring hierarchy, interaction, responsive, failure, and content-extreme design. Do not run `craft` or invent a new visual world.
- `.agents/skills/design-to-storybook/SKILL.md`: Figma, `DESIGN.md`, runtime composition, and Storybook states must stay synchronized; exact Approved frame URLs gate implementation.
- `.agents/skills/shopify-storefront-change/SKILL.md`: the feature queries Storefront API and must normalize Shopify data at the server boundary while Shopify retains customer/order truth.
- `.agents/skills/release-debug/SKILL.md`: Preview and provider/runtime verification are required, with a human-only rollback gate.
- `.agents/skills/quality-gate/SKILL.md`: acceptance criteria require proportional unit, Storybook, browser, build, and security evidence.
- Sanity change routing is not triggered: this feature adds no schema, GROQ, generated type, preview-content, publish, or cache work.

## Human design gate and exact Figma placement

Use canonical file `GYiQd7QSAwCSaGtt0alKG2`. Create a separate page named exactly `Feature / Account`; do not add feature work to the `Style Guide` page. Create these exact top-level frame names and mark each frame `Review`:

1. `Account / Desktop / Hosted handoff`
2. `Account / Mobile / Hosted handoff`
3. `Account / Desktop / Loading`
4. `Account / Mobile / Loading`
5. `Account / Desktop / Missing configuration`
6. `Account / Mobile / Missing configuration`
7. `Account / Desktop / Account not provisioned`
8. `Account / Mobile / Account not provisioned`
9. `Account / Desktop / Provider error`
10. `Account / Mobile / Provider error`
11. `Account / Desktop / Long content`
12. `Account / Mobile / Long content`

Desktop review is at 1440px; mobile review is at 390px, with a separate implementation robustness check at 320px and 200% browser zoom. Annotate focus order, same-tab hosted navigation, external-provider disclosure, natural-height behavior, safe wrapping, and the difference between static notices and announced errors. Promote the exact accepted frames from `Review` to `Approved`, preserve their node IDs/URLs in `docs/features/account-entry.md` and `DESIGN.md`, and capture desktop/mobile exports for the implementation handoff. Missing exact Approved links is a blocker; the current Pi/Figma MCP provider approval state forbids agent MCP access or authentication workarounds, so use only a human-authorized Figma route.

Reuse these approved instances; add no primitive, raw colour, font, radius, ornament, image, or token unless the approved review proves an actual system gap:

- `Navigation` (component sets `157:124`/`157:167`) with `/account` as the current utility.
- `ContentHeader`, `Heading`, `Lead`, and optional `Eyebrow` (sources `196:77`, `196:70`, `196:72`, `196:68`) for the one-H1 hierarchy and explanation.
- `Button` primary (`99:177`) with `asChild` and a real same-tab HTTPS anchor for the Shopify destination.
- `TextLink` (`99:206`) for available internal recovery destinations such as `/shop` and `/contact`; never render a disabled link.
- `FeedbackAlert` (`190:113`): static `info`/`warning` with `announcement="none"` for unavailable provisioning; dynamic provider failure uses `error` with `announcement="alert"`.
- **Deliberately do not compose `Input` (`119:224`) or `Field` (`119:340`) in this slice.** A local email or password field would falsely imply that Next.js can authenticate or submit identity data. If a later approved Customer Account API/OIDC feature needs an email entry, it must reuse those primitives, collect no password, and receive a separate security/design brief.

## System ownership boundaries

| System | Owns in this feature | Must not own |
| --- | --- | --- |
| Next.js | `/account` route, metadata, server-side orchestration, launch gate, safe normalized-state presentation, accessibility, and first-party recovery links | Customer identity, sessions at Shopify, passwords, customer/order records, or a fabricated account URL |
| Shopify | Whether customer accounts/vanity domain exist, returned `customerAccountUrl`, hosted authentication, account creation/sign-in semantics, customer/order truth | First-party page layout or local UI state |
| Storybook | Reusable `AccountEntry` composition contract and all deterministic visual states | Live provider truth or authentication |
| Figma/DESIGN | Approved visual direction, responsive/state contract, and existing component/variable reuse | Runtime provider behavior |
| Vercel | Preview/deployment state and server-only environment values | Shopify configuration or customer truth |
| Sanity | No role in this slice | Account copy that implies mutable commerce/customer truth, customer records, or order data |

The short operational copy is versioned with the route because it explains a fixed service boundary. Publishing or changing Sanity content is out of scope.

## Exact repository file ownership

### Design/brief gate (before implementation)

- **Create `docs/features/account-entry.md`:** record this decision, approved copy, exact Approved Figma links/node IDs, API documentation check, external provisioning state, sync matrix, and approval record.
- **Update `DESIGN.md`:** add only the approved `/account` composition, frame links, responsive/state rules, and intentional non-use of Input/Field.
- **Update `.impeccable/design.json` only if required by the approved `DESIGN.md` synchronization workflow.** Do not hand-edit generated values or change global visual direction.

No runtime file may be changed until a human approves the exact frames and customer-facing copy.

### Shopify/server boundary

- **Create `src/lib/shopify/account-entry.ts`:** query only `shop { customerAccountUrl }` through `storefrontRequest`; validate the raw response with Zod; normalize to a discriminated state such as `available | disabled | configuration-missing | not-provisioned`; require absolute HTTPS, reject credentials/fragments/malformed strings, and never log or expose the Storefront token or provider error body. Include deterministic `SHOPIFY_E2E_FIXTURES=1` states without bypassing production validation.
- **Create `src/lib/shopify/account-entry.test.ts`:** cover URL present, null, malformed/non-HTTPS/userinfo URL, missing configuration, disabled launch gate, HTTP/GraphQL/version/invalid-response propagation, fixture behavior, and secret-safe errors.
- **Update `.env.example`:** add server-only `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false`; never add a `NEXT_PUBLIC_*` Shopify variable, client secret, Customer Account client ID, or redirect URI in this slice.
- **Update `docs/operations.md`:** document the off-by-default account handoff gate, required Preview/Production evidence, and disabling it as the first rollback action. Do not claim that the gate enables Shopify customer accounts.

### UI and route

- **Create `src/components/account/account-entry.tsx`:** reusable presentational composition for hosted, unavailable, not-provisioned, loading, provider-error, and long-content states; compose only approved primitives; accept normalized props rather than raw GraphQL; include Navigation with `currentHref="/account"` and live cart count where available.
- **Create `src/components/account/account-entry.stories.tsx`:** title `Commerce/AccountEntry`; include DesktopHostedHandoff, MobileHostedHandoff, Loading, MissingConfiguration, AccountNotProvisioned, ProviderError, LongContent, 320px, and focus-visible stories. Provider URLs are inert test fixtures and no story calls Shopify.
- **Create `src/components/account/account-entry.test.tsx`:** verify one H1, copy/state semantics, anchor versus omitted action, alert announcement policy, no form/textbox/password/order content, same-tab link behavior, and safe wrapping hooks.
- **Create `src/app/(website)/account/page.tsx`:** noindex metadata, concurrent normalized account-entry and cart reads, and server-rendered state selection. It must not accept an email, password, return URL, customer ID, or provider URL from search params.
- **Create `src/app/(website)/account/loading.tsx`:** approved reduced-motion-safe loading composition with `aria-busy="true"`; do not announce repeated skeleton details.
- **Create `src/app/(website)/account/error.tsx`:** client error boundary with safe provider-error copy and native retry; do not print error messages/digests or claim a submission occurred.
- **Create `src/app/(website)/account/page.test.tsx`:** verify metadata, normalized state mapping, cart count, missing-configuration handling, and provider failure isolation.
- **Update `src/components/navigation.tsx`:** keep default `accountHref="/account"`; give the Account utility `aria-current="page"` and its approved visible current treatment when `currentHref` matches. Do not replace the first-party route with a provider URL.
- **Update `src/components/navigation.test.tsx` and `src/components/navigation.stories.tsx`:** cover the resolved `/account` destination and account-current desktop/mobile state without regressing 44px targets or drawer behavior.
- **Create `tests/e2e/account.spec.ts`:** deterministic hosted/unavailable/error routes under fixtures; desktop/mobile/320/200%-zoom, keyboard, axe, console, overflow, metadata, and safe external-href assertions. Do not complete a real sign-in or create customer/order data.

`src/app/globals.css`, existing low-level primitive files/stories, Sanity files, Shopify cart/catalog types, and unrelated route templates are explicitly not owned. Any need to touch them must return to design/review as a scope change.

## Customer-facing content contract

Subject to human copy approval in Figma, use factual language with no unsupported service promise:

- Hosted state: context “Customer account”; H1 “Your account”; lead explaining that account access continues to Shopify; primary anchor “Continue to your account”; adjacent disclosure that the customer is leaving Infusion Diffusion for Shopify account services.
- Missing configuration or disabled gate: “Account access is not available on this website yet.” Offer only real internal links such as “Continue shopping” and “Contact us”; do not fake a disabled sign-in control.
- Shopify returned no account URL: explain that online account access has not been made available; do not say the customer has no account.
- Provider error: “We couldn’t connect to account services.” State “Nothing was submitted,” offer “Try again,” and retain a real internal recovery link.
- Do not promise order history, quick reorder, account creation, saved addresses, rewards, response times, or successful sign-in. Do not display the provider URL as prose.

## Observable acceptance criteria

1. Activating the desktop or mobile Navigation Account utility reaches first-party `/account`; the utility remains a 44×44 target, has accessible name “Account,” and is visibly/semantically current on the account page.
2. `/account` returns a public server-rendered shell with exactly one H1, useful title metadata, `robots: noindex, follow: false`, Ivory Navigation, and current cart count when cart reading succeeds.
3. The only provider query is server-side Storefront API `2026-07` `shop.customerAccountUrl`, normalized under `src/lib/shopify`; UI and Storybook never receive raw GraphQL nodes/errors or credentials.
4. With the server-only launch gate enabled and a valid Shopify-returned absolute HTTPS URL, a real primary anchor offers the hosted handoff in the same tab. The URL is not built from local input, query parameters, or the shop domain and contains no user-supplied return destination.
5. With the gate off or Storefront configuration missing, the route remains usable and shows the approved static unavailable state, omits the hosted anchor, and exposes no configuration names or secrets.
6. When Shopify returns `null`, empty, malformed, non-HTTPS, credential-bearing, or otherwise invalid account URL data, the page does not navigate. A null value maps to “Account not provisioned”; malformed unsafe data fails closed through the provider-error contract.
7. HTTP, GraphQL, served-version, timeout/network, and invalid-response failures show the approved recoverable error boundary, announce the dynamic failure once, preserve internal navigation, and expose neither upstream payloads nor stack/digest details. Retry performs the normal server read and suppresses repeat activation while the retry is pending where Next supplies that state.
8. During route loading, the page preserves a stable Navigation/main structure, uses `aria-busy`, does not move focus, and removes pulse motion under `prefers-reduced-motion`.
9. No form, Input, Field, textbox, password control, email persistence, local customer/session/order model, cookie, Customer Account token, Admin request, payment control, or authenticated claim is introduced.
10. The hosted destination owns authentication and customer/order truth. Returning to the storefront does not imply an authenticated first-party session. Order history and quick reorder remain absent and documented as deferred until a separate OIDC/client/scope/capability proof is approved.
11. All interactive elements are keyboard reachable in logical DOM order, have visible mode-aware focus, use native button/anchor semantics, and meet 44×44 targets. Error meaning is written, not colour-only; static notices are not live regions.
12. At 1440×1000, 390×844, 320×844, and 200% zoom, every state uses natural height, maintains readable measure, wraps long approved/fixture copy and unusually long localized words safely, has no horizontal page overflow, and does not obscure content under sticky Navigation. Reduced motion does not remove state feedback.
13. Storybook documents every approved state and mobile/desktop composition with no live Shopify dependency; stories pass interaction and accessibility checks and match the exact Approved Figma frames, with intentional deviations documented.
14. Unit tests cover normalization and security extremes; route/component tests cover state selection and semantics; Playwright covers Navigation→`/account`, hosted link presence without following authentication, unavailable/error recovery, keyboard flow, axe, console errors, health, responsive widths, zoom, and overflow with deterministic fixtures.
15. No custom analytics is added because the repository contains no approved analytics/consent system. No email, customer identifier, full provider URL, query string, or authentication result is logged. A future consented `account_handoff_started` event, if separately approved, may contain only non-PII route/state metadata.
16. Preview evidence includes the exact commit SHA/deployment ID, `/account` screenshots at desktop/mobile for hosted and unavailable states, `/api/health`, zero unexpected browser console errors, safe network/redirect inspection, and a sanitized proof that the served Shopify API version is `2026-07` and `customerAccountUrl` is present or absent. No customer signs in during automated verification.
17. Production remains off until a human verifies Shopify customer accounts and the vanity domain are provisioned, Vercel Production has least-privilege Storefront credentials plus an explicitly enabled handoff gate, and the approved hosted URL has been checked without recording secrets or customer data.

## External provisioning and deferred integration states

- **Gate off:** shell may ship, but no hosted action appears. This is the default and rollback state.
- **Storefront credentials absent/invalid:** show Missing configuration; provisioning is a Vercel/Shopify operator task, not an agent-created credential.
- **Credentials valid, `customerAccountUrl` null:** show Account not provisioned. A human Shopify administrator must decide whether to enable customer accounts and configure the required vanity domain; this task may not do so.
- **Valid URL:** Preview may verify the public hosted landing page only. Do not enter credentials, create an account, or inspect customer data.
- **On-site authenticated account, orders, or quick reorder requested later:** require separate Customer Account API/OIDC discovery, public-client registration, PKCE, exact redirect/logout URIs, token/session threat model, minimum customer/order scopes, current credential capability proof, new Figma states, and human security/product approval. Never use the Admin API or copy order truth locally for that journey.

## Deterministic verification

Run in this order and judge every command by exit status:

```bash
corepack pnpm exec vitest run --config vitest.config.ts src/lib/shopify/account-entry.test.ts src/components/account/account-entry.test.tsx 'src/app/(website)/account/page.test.tsx' src/components/navigation.test.tsx
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/account.spec.ts --project=chromium --project=mobile
node .agents/skills/impeccable/scripts/detect.mjs --json src/components/account src/app/'(website)'/account src/components/navigation.tsx
corepack pnpm check
```

The independent reviewer must also inspect the final diff for tokens/secrets, public Shopify env names, unsafe URLs, raw GraphQL leakage, accidental customer/order state, skipped tests, generated artifacts, and unrelated changes. After the PR push, run `just pr-gate <PR-number>` and require the GitHub `quality` check to pass; local checks do not replace missing/pending/failed CI. No roadmap update is expected unless implementation changes the current milestone; the reviewer must explicitly confirm that decision.

## Preview, release, and rollback evidence

1. On the green PR commit, the browser release debugger records Preview URL, deployment ID, commit SHA, timestamp, `/api/health`, screenshots at 1440 and 390 (plus 320 overflow evidence), keyboard/axe results, browser console/network findings, and the tested gate/provider state.
2. Verify both a deterministic hosted fixture and a deterministic disabled/not-provisioned state. If human-provisioned Preview credentials exist, make one bounded read-only query and verify only whether the hosted destination is present and HTTPS; do not preserve tokens, response payloads, OAuth URLs, or identities in artifacts.
3. Follow the hosted anchor only far enough to prove the public provider page and expected host load over HTTPS; do not authenticate. Redirect loops, unexpected hosts, provider errors, or a changed API contract block merge/release.
4. First rollback action is a human-authorized Vercel environment change setting `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false`, followed by redeployment/verification that `/account` shows the unavailable shell while catalogue/cart remain intact. Code rollback is a reviewed revert to the last-known-good deployment if the shell itself fails.
5. Only a human may approve design, merge the pull request, enable the Production gate/promote production when applicable, or execute rollback. This feature has no Sanity editorial publish gate because it publishes no Sanity content.

## Required human decisions and gates

- **Blocked before implementation:** product owner must approve the exact Figma frames, responsive states, external-handoff disclosure, unavailable/error copy, and deliberate omission of Input/Field and authenticated features.
- **Blocked before live capability verification:** Shopify owner must confirm account mode and vanity-domain provisioning and authorize use of least-privilege Preview credentials. Agents cannot enable accounts or create credentials.
- **Blocked before merge:** green required checks, independent `quality_reviewer` approval, reviewable Vercel Preview, and browser release evidence; a human merges.
- **Blocked before production enablement:** protected `main`, healthy deployment, correct Production env values, and explicit human authorization for the handoff gate.
- **Rollback:** requires human authorization with confirmed impact and named last-known-good target. Agents may recommend but not execute it.
- **Editorial publish:** not applicable; publishing content remains out of scope.

## Residual risks

- No current live Storefront credentials or returned account URL prove the store can support the hosted path; the first released state may intentionally be unavailable until a human provisions it.
- Official 2026-07 behavior ties `customerAccountUrl` to a vanity domain. Shopify account configuration or policy may change; Context7 and official docs must be rechecked immediately before implementation, and official docs win conflicts.
- A Shopify-hosted account experience may not match the storefront’s visual system and may expose different sign-in/account-creation behavior; the disclosure and same-tab return path need human review.
- The route cannot know or display authenticated state, order history, or reorder capability without later OIDC work; adding those informally would violate ownership and security boundaries.
- Figma MCP is not presently available through the project’s approved Pi route, so exact node URLs cannot be captured by an agent until provider/human gates open. Implementation must not substitute inferred visuals.
- Disabling the handoff preserves a truthful shell but temporarily removes online account access; support/communications implications remain a product-owner decision.
