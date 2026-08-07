# Implementation plan: approved `/account` entry

## Outcome and authority

Implement the first customer-facing `/account` route on the existing `agent/account-entry` branch. An unauthenticated returning customer reaches the first-party route from Navigation and either receives a truthful Shopify-hosted account handoff or a truthful recovery state. The route never becomes a local login or authenticated account area.

The implementation authority is the user-approved Figma review board in canonical file `GYiQd7QSAwCSaGtt0alKG2`, node [`337:321`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=337-321), together with the validated Account plan previously stored in this handoff. The prompt records human approval, so design shaping is complete and implementation may begin. Before the first UI write, confirm that node `337:321` still identifies the approved Account desktop/mobile/state board; if its status, copy, or contents have changed, stop rather than infer a replacement. Do not use the currently human-gated Pi/Figma MCP route or attempt Figma authentication.

Context7-first Next.js evidence is supplied in the request: Next.js 16 supports `import "server-only"`, server-only `process.env` access in Server Components, and `loading.tsx` route fallbacks. Context7 did not precisely surface Shopify’s field. A fresh read of Shopify’s official Storefront API 2026-07 `Shop` reference confirms `customerAccountUrl` is nullable `String` and is “only present if shop has a customer account vanity domain.” Official Shopify 2026-07 policy is authoritative. Therefore:

- query only `shop { customerAccountUrl }` through the existing server-only Storefront transport;
- never construct an account URL from the shop domain;
- expose the link only when `SHOPIFY_ACCOUNT_HANDOFF_ENABLED` is exactly `true` and the returned value is an absolute HTTPS URL;
- treat a null field as an account-destination-not-provisioned state;
- defer Customer Account API/OIDC, customer sessions, orders, and quick reorder.

## Specialist routing and topology

- **Implementation owner — `storefront_engineer` (sole writer):** owns all repository implementation, tests, documentation, evidence, and the requested commit on `agent/account-entry`.
- **Advisory specialist — `browser_release_debugger` (read-only):** independently verifies local/Preview runtime behavior, `/api/health`, screenshots, browser console/network evidence, and rollback readiness.
- **Independent review owner — `quality_reviewer`:** reviews every acceptance criterion, security boundary, visual evidence, test result, and unrelated diff before handoff.
- **No product-designer advisor is needed:** direction, responsive states, copy, and primitive reuse are already approved at Figma node `337:321`; any new design decision is a blocker and must return to a human design gate.
- Keep one writer, one branch, and one pull request. Do not create another worktree or implementation agent implicitly.

## Applicable project skills

- `.agents/skills/feature-brief/SKILL.md`: retain the validated state, ownership, content, analytics, accessibility, and failure criteria during implementation.
- `.agents/skills/impeccable/SKILL.md`: apply the approved established-world Operate composition, then perform bounded desktop/mobile comparison and one batched correction pass; do not run a new concept or visual-world exercise.
- `.agents/skills/design-to-storybook/SKILL.md`: build the reusable Account composition in Storybook, compare it to node `337:321`, and synchronize Figma authority, `DESIGN.md`, runtime, stories, and evidence without changing tokens.
- `.agents/skills/shopify-storefront-change/SKILL.md`: keep the GraphQL query and normalization under `src/lib/shopify`, preserve Shopify customer truth, and test provider/configuration failures.
- `.agents/skills/quality-gate/SKILL.md`: map each criterion to Vitest, Storybook, Playwright, inspection, or Preview evidence and treat every skipped/failed required check as a failed gate.
- `.agents/skills/release-debug/SKILL.md`: verify the Vercel Preview and document the off-switch/last-known-good rollback recommendation.
- Sanity and parallel-writer skills do not trigger: there is no Sanity work and only one writer.

## System ownership boundaries

| System                 | Owns                                                                                                                | Explicitly does not own                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Next.js                | `/account` route shell, runtime gating, normalized-state rendering, metadata, loading/error recovery, accessibility | Authentication, customer identity, customer sessions, orders, account creation, or fabricated provider URLs |
| Shopify Storefront API | Nullable hosted account destination and account provisioning truth                                                  | First-party page composition                                                                                |
| Shopify hosted account | Authentication and any customer/order presentation after handoff                                                    | A first-party authenticated session                                                                         |
| Storybook              | Reusable Account composition and deterministic visual/state contracts                                               | Live provider calls or credentials                                                                          |
| Figma / `DESIGN.md`    | Approved visual and content direction at `337:321`; documented Account composition                                  | Runtime commerce behavior                                                                                   |
| Vercel                 | Preview/deployment state and server-only environment configuration                                                  | Enabling Shopify customer accounts                                                                          |
| Sanity                 | No role                                                                                                             | Customer/account/order data or operational Account copy in this slice                                       |

No local login form, email/password field, credential persistence, customer cookie/token, Customer Account API/OIDC flow, legacy customer access token, Admin API request, order history, quick reorder, or payment work may be introduced.

## Approved visual and component contract

Implement node `337:321` exactly for hosted handoff, loading, missing-configuration/disabled, null destination, provider error, long content, desktop, and mobile. Reuse:

- existing Ivory `Navigation`, with its default `accountHref="/account"`;
- `ContentHeader`/`Heading`/`Lead`/`Eyebrow` for semantic hierarchy;
- primary `Button` with `asChild` and a real same-tab anchor only in the hosted state;
- standalone/inline `TextLink` for real first-party recovery destinations;
- static `FeedbackAlert` (`announcement="none"`) for disabled, missing configuration, and null destination; dynamic provider error uses the exact approved announcement behavior;
- existing semantic surface, text, action, link, feedback, spacing, and focus tokens.

Do not change `src/app/globals.css` or any low-level primitive. Do not add `Input` or `Field`. Do not add an Account-current visual or `aria-current` behavior to Navigation: the approved Navigation component has no Account-current variant, and the prompt explicitly limits this task to documenting that existing gap as an intentional divergence. The Account H1 supplies page identity. If Figma comparison appears to require a current utility treatment or a new token, stop for human design approval.

Use the exact approved Figma copy. Preserve its factual distinctions:

- hosted state explains that account access continues to Shopify and offers one primary handoff;
- disabled/missing configuration says account access is not currently available and offers only real recovery links;
- null destination does not claim the customer lacks an account;
- provider error says nothing was submitted and offers retry/recovery;
- no state promises account creation, successful sign-in, orders, saved details, quick reorder, or support response time.

## Exact file ownership and implementation sequence

### 1. Preserve authority and documentation

- **Create `docs/features/account-entry.md`:** shipped contract, official Shopify schema evidence/URL, node `337:321`, state/copy mapping, security decisions, external provisioning, intentional Navigation-current divergence, test/Preview evidence, approval status, and final synchronization matrix.
- **Update `DESIGN.md`:** add the approved Account route section and exact Figma link; state that existing semantic tokens/primitives are reused and Navigation intentionally has no Account-current variant.
- **Do not change `.impeccable/design.json` unless the repository’s documented synchronization command deterministically changes it because of the `DESIGN.md` update.** If changed, review it as generated evidence; do not invent sidecar values.
- **Create local evidence files** `docs/features/evidence/account-1440.png`, `account-390.png`, `account-320.png`, and `account-page-local-verification.md` from the implemented route/stories. Do not include customer data, credentials, or a full live account URL in the evidence note.

### 2. Add the server-only Shopify boundary

- **Create `src/lib/shopify/account-entry.ts`:** include `import "server-only"`; evaluate `SHOPIFY_ACCOUNT_HANDOFF_ENABLED` in a function and regard only the exact string `"true"` as enabled; return `disabled` without calling Shopify when off. When enabled, call `storefrontRequest` with the 2026-07 query, validate the response with Zod, and return a discriminated normalized result (`available`, `configuration-missing`, or `not-provisioned`). Catch only `ShopifyStorefrontError` with code `CONFIGURATION` as the controlled missing-configuration result; allow HTTP, GraphQL, version, network, and malformed-response errors to reach the route error boundary.
- Parse the returned string with `URL`; require `https:`, non-empty hostname, and no embedded username/password. Accept a Shopify-provided vanity/custom hostname; do not hard-code `myshopify.com`, append paths, accept caller input, or rewrite query parameters. Invalid non-null provider data is an `INVALID_RESPONSE` provider error, not a disabled state.
- Keep deterministic account fixture data server-only under `SHOPIFY_E2E_FIXTURES=1`. The fixture must pass the same URL validator as production and must not weaken the explicit handoff flag.
- **Create `src/lib/shopify/account-entry.test.ts`:** query shape, flag exactness (`true` only), no-request-when-disabled, configured URL, null, empty/malformed/relative/HTTP/userinfo destinations, missing configuration, HTTP/GraphQL/served-version/invalid-response propagation, fixture validation, and secret-safe failure output.
- **Update `.env.example`:** add `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false` next to other server-only Shopify gates; add no `NEXT_PUBLIC_*` customer/account variable.
- **Update `docs/operations.md`:** document the off-by-default flag, required Storefront/account-vanity provisioning, Preview checks, Production human gate, and disabling the flag as the first rollback action. Make clear that the flag exposes a returned URL; it does not enable Shopify customer accounts.

### 3. Implement Storybook-first UI composition

- **Create `src/components/account/account-entry.tsx`:** presentational Account shell/templates for hosted, unavailable (disabled/missing configuration), not provisioned, loading, provider error, and long-content-friendly rendering. Props receive only normalized status, validated destination, approved copy overrides for stories, and optional cart count—never raw GraphQL or errors. Render Navigation and one semantic `<main>`/H1. Hosted uses `Button asChild` with a same-tab anchor and no `target`; unavailable states omit rather than disable the anchor.
- **Create `src/components/account/account-entry.stories.tsx`:** `Commerce/AccountEntry` stories for desktop/mobile hosted, loading, disabled/missing configuration, null destination, provider error, long content, 320px, focus-visible, and cart-count composition. Stories use inert HTTPS fixture URLs and make no network request.
- **Create `src/components/account/account-entry.test.tsx`:** one-H1 semantics, exact state copy, valid anchor only for hosted, omitted form/textboxes/password/order content, recovery links, alert announcement policy, loading `aria-busy`, no new-window behavior, cart count, and long-content wrapping classes/structure.

### 4. Integrate the asynchronous App Router route

- **Create `src/app/(website)/account/page.tsx`:** static metadata with an accurate title/description and `robots: { index: false, follow: false }`; call `connection()` before runtime environment/provider work to avoid build-time account resolution; fetch normalized account status and `readCart()` concurrently where safe; render the approved Account composition. Do not consume `searchParams` or accept return URL, email, customer ID, status, or destination from the browser.
- Use a local `Suspense` boundary matching `loading.tsx` so async Server Component behavior is deterministic both on direct navigation and client transitions.
- **Create `src/app/(website)/account/loading.tsx`:** approved loading composition with `aria-busy`, stable layout, and `motion-reduce:animate-none`.
- **Create `src/app/(website)/account/error.tsx`:** client error boundary that renders the approved provider-error composition, exposes native retry via `reset`, and never renders the error message/digest or claims a submission occurred.
- **Create `src/app/(website)/account/page.test.tsx`:** metadata, runtime boundary call, disabled/no-query result, missing configuration, available/null mapping, cart count, and thrown provider failure behavior.
- **Do not modify `src/components/navigation.tsx`, its tests/stories, or global tokens.** Existing Navigation tests already assert Account links to `/account`; document the lack of an Account-current variant instead.

### 5. Add proportional browser coverage

- **Create `tests/e2e/account.spec.ts`:** verify Navigation Account → `/account`, noindex metadata, one H1, the deterministic hosted fixture link without authenticating, unavailable/null/error visual contracts through deterministic non-production fixtures or Storybook states, keyboard order/focus, axe WCAG A/AA, reduced motion, 1440/390/320 layouts, 200% zoom, long content, horizontal overflow, `/api/health`, and unexpected console errors.
- **Update `playwright.config.ts` only if needed** to run the account fixture with both `SHOPIFY_E2E_FIXTURES=1` and explicit `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=true`. Do not add a browser-controlled fixture switch or a production-visible test route. If integrated unavailable/error states cannot be selected safely in one server run, cover their route mapping in Vitest and their visual/interaction contracts in Storybook browser tests rather than adding query-parameter state injection.
- Preserve all existing catalogue/cart fixture behavior.

### 6. Review, commit, and hand off

- Run bounded Figma comparison at 1440 and 390 together, fix material differences in one batch, then confirm once. Record any intentional divergence; the known Navigation-current gap must remain documentation-only.
- Have `quality_reviewer` independently map every criterion to evidence and reject raw GraphQL leakage, unsafe URLs, secret exposure, local auth/customer/order state, design drift, or unrelated changes.
- Ensure `git diff` contains only owned files plus the two immutable plan specs; preserve the earlier `specs/9507c91e_account-entry.md` record and this implementation-plan copy.
- Commit implementation and documentation on `agent/account-entry` after all local required checks pass. Suggested implementation commit subject: `Implement Shopify account entry`.
- Do not merge, deploy Production, enable Shopify accounts, publish Sanity content, or execute rollback.

## Observable acceptance criteria

1. Desktop and mobile Navigation Account links resolve to first-party `/account`; no Navigation component behavior or approved design-system contract changes.
2. `/account` is a dynamic server-rendered App Router route with exactly one H1, accurate metadata, noindex/nofollow robots metadata, existing Navigation, and current cart count when available.
3. When `SHOPIFY_ACCOUNT_HANDOFF_ENABLED` is absent, empty, `false`, `1`, `TRUE`, or any value other than exact `true`, the boundary makes no Shopify account query and renders the approved unavailable state with no handoff anchor.
4. When the flag is `true`, the only new provider operation is Storefront API 2026-07 `shop.customerAccountUrl`, executed in a `server-only` module through `storefrontRequest` and normalized before reaching UI.
5. A non-null destination appears only after it parses as an absolute HTTPS URL with a hostname and no embedded credentials. The real primary action is a same-tab anchor using the Shopify-returned value; no URL is constructed from domain, search params, or customer input.
6. Missing Storefront configuration maps to the approved missing-configuration/unavailable state without exposing env names or secrets. A null provider field maps to the distinct approved not-provisioned state and does not claim the customer has no account.
7. Invalid non-null destinations and HTTP, network, GraphQL, served-version, and malformed-response failures fail closed through the approved provider-error boundary. The error says nothing was submitted, announces appropriately, offers retry/recovery, and reveals no upstream response, stack, digest, token, or full logged URL.
8. Loading preserves the approved layout, uses `aria-busy`, does not move focus, and disables decorative pulse under reduced motion.
9. Hosted, loading, unavailable, null destination, provider error, long-content, desktop, mobile, 320px, focus, and cart-count states are deterministic in `Commerce/AccountEntry` Storybook stories and make no live Shopify call.
10. No form, Input, Field, textbox, password, local session/cookie, legacy customer token, Customer Account API/OIDC, customer/order model, order history, quick reorder, Admin API, analytics event, payment work, or speculative capability copy exists in the diff.
11. Keyboard order follows DOM order; all actions use native anchor/button semantics, visible focus, and at least 44×44 targets. Static unavailable feedback is not a live region; dynamic error behavior matches the approved frame. Colour is never the only state cue.
12. At 1440×1000, 390×844, 320×844, 200% zoom, reduced motion, and long/unbroken fixture copy, every state has natural height, readable measure, safe wrapping, no clipping, no sticky-Navigation overlap, and no horizontal page overflow.
13. Figma node `337:321`, `DESIGN.md`, runtime composition, Storybook, and `docs/features/account-entry.md` are synchronized. No token/primitive change is made; the lack of an Account-current Navigation variant is recorded as the approved intentional divergence.
14. Targeted Vitest proves URL/flag/provider normalization and route/component semantics. Storybook browser tests prove visual states/accessibility. Playwright proves the async `/account` journey, hosted link presence without following a login, keyboard/axe/console/health/responsive behavior with deterministic fixtures.
15. Local evidence records passing commands by exit status and captures account screenshots at 1440, 390, and 320 without secrets or customer data. The final branch commit contains implementation and documentation and leaves no unrelated working-tree changes.
16. A Vercel Preview on the exact reviewed commit passes `/api/health`, `/account` smoke, mobile/desktop visual review, console/network inspection, and a sanitized present/absent account-destination check. No reviewer authenticates or creates customer/order data.
17. `quality_reviewer` independently accepts every criterion before handoff. Human merge and Production enablement remain closed gates.

## Deterministic verification commands

Run from repository root and judge each command only by exit status:

```bash
corepack pnpm exec vitest run --config vitest.config.ts src/lib/shopify/account-entry.test.ts src/components/account/account-entry.test.tsx 'src/app/(website)/account/page.test.tsx'
node .agents/skills/impeccable/scripts/detect.mjs --json src/components/account 'src/app/(website)/account'
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build
corepack pnpm exec playwright install chromium
SAVE_ACCOUNT_EVIDENCE=1 corepack pnpm exec playwright test tests/e2e/account.spec.ts --project=chromium --project=mobile
corepack pnpm check
python3 -m unittest adws.tests.test_figma_handoff_gate
```

Then inspect:

```bash
git diff --check
git status --short
git diff -- . ':(exclude)specs/9507c91e_account-entry.md'
```

After pushing the implementation commit and opening the pull request, run `just pr-gate <PR-number>`. Pending, missing, skipped, cancelled, timed-out, or failed GitHub `quality` checks remain red; local evidence is not a substitute.

## Preview, provisioning, and rollback evidence

- **Local/CI:** fixtures prove the valid hosted state without a real account; unit/Storybook coverage proves disabled, missing configuration, null, malformed URL, and provider error.
- **Preview:** record URL, deployment ID, commit SHA, timestamp, server-only flag state, `/api/health`, screenshots, keyboard/axe results, and console/network findings. If a human supplies least-privilege Preview Storefront configuration, record only whether the 2026-07 field is present and valid HTTPS; do not persist tokens, response bodies, OAuth URLs, or identity data. Follow the link only far enough to verify the public hosted page and expected HTTPS host; do not sign in.
- **External provisioning:** a null field remains a valid not-provisioned state until a human Shopify owner enables/configures customer accounts and the required vanity domain. The implementation task cannot perform that work.
- **Rollback:** the first recommendation is a human-authorized Vercel environment change to set `SHOPIFY_ACCOUNT_HANDOFF_ENABLED=false`, followed by redeployment and verification that `/account` shows the truthful unavailable state while catalogue/cart remain healthy. If the shell itself is broken, recommend the named last-known-good Vercel deployment or reviewed revert. Agents do not execute Production rollback.

## Human gates

- **Implementation:** satisfied by this request’s explicit approval of Figma node `337:321`; if the node is no longer the approved authority, implementation blocks and returns to human design review.
- **Design changes:** any new token, primitive, Account-current Navigation state, copy change, or state not represented at `337:321` requires fresh human design approval before coding it.
- **Merge:** requires green required checks, independent `quality_reviewer` acceptance, and reviewable Preview evidence; only a human merges.
- **Editorial publish:** not applicable because Sanity is untouched; agents must not publish content.
- **Production:** out of scope. Enabling the Production handoff flag or promoting a deployment requires explicit human authorization after Shopify provisioning and health evidence.
- **Rollback:** requires human authorization, confirmed impact, and a named last-known-good target.

## Residual risks

- Current local Storefront configuration was previously found incomplete, so live `customerAccountUrl` availability is not proven; Preview/Production may correctly remain unavailable pending human provisioning.
- Shopify documents the field as dependent on a customer-account vanity domain. A store can have customer-account settings yet still return null; do not reinterpret null as “no customer account.”
- Shopify can change hosted account behavior or documentation within the version lifecycle. Recheck official 2026-07 docs immediately before coding and stop on a schema/policy mismatch.
- Custom vanity domains prevent a narrow hostname allowlist; security relies on server-only Shopify provenance plus strict HTTPS/URL-credential validation. Preview must inspect the resulting host.
- The hosted surface may differ visually and behaviorally from the storefront, and the first-party app cannot observe authenticated success without later OIDC work.
- The approved design intentionally lacks an Account-current Navigation variant, reducing global current-location indication; the page H1 mitigates this, and changing it is out of scope.
- Visual fidelity depends on the continued availability of approved node `337:321`; no agent should invent missing frame details if access or evidence becomes unavailable.
