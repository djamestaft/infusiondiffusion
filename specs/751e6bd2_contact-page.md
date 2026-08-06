# Contact page implementation plan

## Objective and delivery contract

Deliver `/contact` as the next customer-facing Next.js route in the established “Perfumer’s Cabinet” storefront. The page must let a visitor find a trustworthy contact path, retain the live storefront navigation/cart context, and remain useful when Sanity or another dependency is unavailable.

The safe launch contract is **direct email only**: show the approved public email address as visible text and a `mailto:` destination, and explain that the online form is unavailable. Do not render editable form fields, a submit button, a Server Action/API route, a success claim, or any client/server message persistence. The application therefore never receives contact PII. A human product owner must ratify this interpretation, the monitored mailbox, exact fallback copy, and the privacy wording before design approval; otherwise implementation is blocked. A real form is a later feature requiring an approved provider, retention/privacy/consent decision, abuse controls, and a new acceptance contract.

Roadmap freshness was checked before planning: the clean `main` checkout was fetched from `infusion-diffusion`, fast-forward checked, and matched `infusion-diffusion/main` at `bbcf65640f311f6b526e0ded62d80ddb89748136`; `docs/planning/roadmap.md` was then reread. The implementation owner must recheck branch safety before beginning.

## Specialist routing and topology

- **Implementation owner — `storefront_engineer` (only repository writer):** own the single `agent/contact-page` delivery branch and one pull request; implement Next.js, the existing Sanity read boundary, Storybook, tests, and repository documentation. Do not start a second writing agent.
- **Advisory specialist — `product_designer` (read-only repository advisor):** shape the route, responsive hierarchy, contact/unavailable behavior, and state set; capture the implementation-ready Figma evidence. An authorized human designer/product owner must approve the exact Figma frames. The advisor cannot grant approval.
- **Advisory specialist — `browser_release_debugger` (read-only):** independently verify the Vercel Preview, `/api/health`, browser console/network evidence, responsive screenshots, and the persisted cart path.
- **Independent review owner — `quality_reviewer`:** review the final diff, acceptance mapping, accessibility, content/commerce boundaries, tests, screenshots, and residual risk. The implementation owner cannot self-approve.
- Default topology is one branch and one PR. `parallel-agent-worktrees` does not trigger because there is one writer; if coordination moves implementation off the primary checkout or adds another writer, stop and apply that skill with explicit engineer approval first.

## Applicable skills

1. **`feature-brief`** — this is a new customer route with unresolved content/action/state decisions; use it to lock outcomes, state behavior, source ownership, and failure behavior before design.
2. **`impeccable` (`shape`, established-world/new-surface flow)** — Contact needs new page-level information hierarchy and responsive/error/unavailable states, while inheriting the approved visual world. Run the context script once for the contact target; do not invent a replacement visual identity.
3. **`design-to-storybook`** — final UI is blocked on exact approved desktop/mobile Figma nodes, must use semantic tokens and existing primitives, and must be represented in Storybook before route integration.
4. **`sanity-content-change`** — Contact reads editorial copy in published/draft perspectives and requires deterministic fallback/cache/preview behavior. Reuse the existing `editorialPage` query and `siteSettings.contactEmail`; no schema, GROQ, extracted-schema, or generated-type change is planned.
5. **`quality-gate`** — map every criterion to unit, Storybook, browser, visual, or manual evidence and run the complete local/CI gates.
6. **`release-debug`** — required for authenticated Vercel Preview, health, console/network/runtime evidence, incident attribution, and rollback recommendations.
7. **Not triggered:** `shopify-storefront-change`. Shopify is only read through the unchanged `readCart()` presentation boundary; no catalogue, cart mutation, customer, checkout, or webhook behavior changes.

## Human decisions and gates before code

1. **Product/content decision (blocker):** approve the public monitored mailbox (proposed existing fallback `hello@infusiondiffusion.co.za`), the direct-email-only contract, exact fallback/SEO/unavailable/error copy, whether `siteSettings.callToActionLabel` is appropriate for the email action, and that no phone/address/hours/SLA claim is shown without verified source material.
2. **Design gate (blocker):** on Figma page `Feature / Contact`, provide exact node links marked `Approved` for at least `Contact / Desktop / Default`, `Contact / Mobile / Default`, loading, unexpected error, Sanity fallback, form unavailable, and long-content behavior. The handoff must record 1440px and 390px layouts, 320px reflow intent, hierarchy, semantic variables, type, spacing, focus, wrapping, state copy, and any intentional divergence. Human approval is required before UI implementation is treated as ready.
3. **Storybook review gate:** compare approved Figma and Storybook at desktop/mobile, record the sync matrix, and obtain human confirmation that the responsive and unavailable-state implementation matches the approved interaction contract.
4. **Editorial publish gate:** an editor may preview a draft `editorialPage` with slug `contact`, but only a human editor may publish, unpublish, schedule, or replace it. Shipping fallback code must not depend on publication.
5. **Merge gate:** green required GitHub checks, independent quality review, and a reviewable Vercel Preview are necessary; a human approves and merges.
6. **Production gate:** protected `main` and successful deployment/health smoke evidence are required. Do not directly deploy or promote production without explicit authorization where promotion is manual.
7. **Rollback gate:** agents may recommend a target and recovery steps, but only a human may authorize Vercel rollback or destructive Sanity recovery.

## Acceptance criteria

1. Approved Figma node URLs and a complete responsive/state handoff are recorded in `docs/features/contact-page.md`; the design, repository guidance, runtime, and Storybook sync matrix has no unexplained drift.
2. `GET /contact` returns HTTP 200 and renders one H1, approved introduction/support content, a visible approved email address, and a real `mailto:` anchor. Metadata uses approved Contact SEO with `en_ZA` Open Graph values.
3. The normal route marks Contact—not Shop/About/Fragrance Guide—as `aria-current="page"`; mobile menu behavior remains unchanged. `readCart()` supplies the current quantity, including the existing accessible singular/plural/99+ label behavior, without changing Shopify code.
4. No application form is falsely offered: there are no editable contact fields or submit action while the provider/privacy decision is unresolved. The page clearly says online submission is unavailable, offers the direct email alternative, and does not collect, persist, transmit, log, or claim to send message data.
5. Sanity owns Contact eyebrow/title/introduction/optional ordered sections/SEO through the existing `editorialPage` document with slug `contact`; `siteSettings.contactEmail` (and an approved action label if used) owns the global contact destination. Next.js owns composition, operational state copy, metadata, safe URL construction, and versioned fallbacks.
6. Unconfigured Sanity, missing document, null/blank fields, invalid/incomplete sections, or a failed Sanity read still produce a complete approved text-first page and metadata. Valid partial editorial values are retained according to the existing fallback merger. Draft and published perspectives remain separate and Visual Editing continues to work.
7. A perceivable loading state uses `aria-busy` and approved non-jumping layout; an unexpected route error gives a concise non-PII explanation, direct-email recovery, and keyboard-operable retry; the routine Sanity-unavailable case degrades to the normal fallback rather than an error page. Loading/error shells must not invent a cart quantity they have not read.
8. At 1440px, 390px, 320px, and 200% zoom, content follows logical source order, the email and long tokens wrap, no text/control/image clips, and `scrollWidth <= clientWidth`. Content expands naturally for a 100-character title, 320-character introduction, up to ten 90-character section headings/1200-character bodies, a long valid email, empty optional sections, and unbroken strings.
9. Accessibility includes semantic landmarks, one H1 followed by ordered H2s where sections exist, descriptive contact action text, 44×44 minimum interactive targets, visible focus, native link/button semantics, WCAG AA contrast, no colour-only meaning, no unnecessary live region, reduced-motion-safe behavior, and keyboard/mobile-menu operation. Axe reports no WCAG 2.0/2.1 A/AA violations.
10. Storybook covers Contact default desktop, mobile, 320/small-width or equivalent, maximum content, partial/fallback content, loading, unexpected error/retry, form unavailable, and nonzero cart state. Story play checks assert current navigation, mail destination, absence of a form, state semantics, and wrapping/layout contracts.
11. Deterministic Vitest covers Contact fallback merging/metadata, route data composition, template semantics, nonzero cart presentation, safe email fallback, no-form behavior, and loading/error recovery. Playwright covers desktop/mobile/small fallback rendering, metadata, current navigation, empty cart, keyboard focus, overflow, axe, console errors, direct-email href, and `/api/health`.
12. Full local gates and GitHub’s required `quality` check pass. A protected Vercel Preview is verified against the exact commit SHA, with deployment ID/URL/timestamp, screenshots, health, console/network, Sanity draft/fallback, and a cart-persistence journey recorded.
13. Documentation truth is synchronized only after evidence exists: feature/design/Sanity docs describe the shipped contract, and the roadmap marks Contact complete only after implementation evidence while keeping Preview review/editorial publish/production items pending until humans complete them.

## System ownership boundaries

- **Next.js:** `/contact`, metadata, loading/error UI, safe fallback composition, direct-email link rendering, current navigation, and cart presentation.
- **Sanity:** editorial Contact copy and SEO plus the existing global contact email/action label. It must not own operational success/error claims or commerce truth. No publish by an agent.
- **Shopify:** unchanged source of cart truth only. Do not duplicate cart/customer/order data in Sanity and do not touch checkout/account code.
- **Storybook:** reusable Contact template and all meaningful visual/state contracts.
- **Figma/DESIGN:** approved visual/responsive authority. Missing exact approved nodes blocks implementation; screenshots are comparison evidence, not authority.
- **Vercel:** Preview/deployment/health/runtime state.
- **External messaging/CRM:** intentionally absent. No credentials, endpoint, provider SDK, CRM, webhook, spam tooling, or consent storage is introduced.

## Exact repository file ownership

The `storefront_engineer` is the only repository writer for all files below.

### Create

- `src/app/(website)/contact/page.tsx` — metadata; published/draft-aware Contact and site-settings reads; existing cart read; Contact template composition.
- `src/app/(website)/contact/loading.tsx` — approved accessible loading shell.
- `src/app/(website)/contact/error.tsx` — client error boundary with retry and fallback direct-email recovery; do not expose error details.
- `src/app/(website)/contact/page.test.tsx` — route/metadata/loading/error composition tests with deterministic mocks.
- `tests/e2e/contact.spec.ts` — 1440/390/320 fallback journey, accessibility, current nav/cart, metadata, link, overflow, console, and health assertions.
- `docs/features/contact-page.md` — approved Figma links/handoff, exact content/state contract, ownership, acceptance mapping, and final sync matrix.
- `docs/features/evidence/contact-1440.png`, `docs/features/evidence/contact-390.png`, `docs/features/evidence/contact-320.png` — clean route or Storybook-canvas captures labeled with source and commit.
- `docs/features/evidence/contact-page-preview-verification.md` — Preview URL/deployment/SHA/time, health, console/network, draft/fallback/cart evidence, command exit statuses, intentional deviations, and outstanding human gates.

### Modify

- `src/sanity/lib/editorial-pages.ts` — add `fallbackContactPage`, `getContactPage`, and `getContactPageMetadata` by reusing the existing `EDITORIAL_PAGE_QUERY`/fallback merger; trim/validate the consumed email at the route boundary and fall back to the approved existing address rather than emitting an unsafe/blank `mailto:`.
- `src/sanity/lib/editorial-pages.test.ts` — complete/partial/blank/unavailable Contact fallback and metadata cases.
- `src/components/templates/storefront-templates.tsx` — add the approved `ContactTemplate` and reusable loading/error state compositions using existing `Navigation`, `ContentHeader`/heading primitives, `Button` or `TextLink`, and `FeedbackAlert`; no duplicate low-level control.
- `src/components/templates/storefront-templates.stories.tsx` — Contact state/responsive/content-extreme stories and play assertions.
- `src/components/templates/storefront-templates.test.tsx` — Contact hierarchy, mailto, no-form, current navigation, cart count, unavailable/loading/error behavior.
- `src/components/navigation.stories.tsx` — add Contact-current desktop and mobile-open stories; runtime `navigation.tsx` already contains `/contact` and should not change unless approved evidence finds a defect.
- `DESIGN.md` — record exact approved Contact nodes and durable route rules without changing the established world.
- `.impeccable/design.json` — synchronize the DESIGN sidecar if DESIGN narrative/extensions change; do not add unapproved tokens.
- `docs/features/sanity-editorial-pages.md` — remove the stale statement that Contact/About runtime is out of scope and document Contact’s reuse of the editorial model and global email boundary.
- `docs/planning/roadmap.md` — after evidence, add the Contact route status and immediate human Preview/editorial actions; do not pre-check publish/merge/production work.

### Explicitly do not change

- `src/sanity/schemaTypes/*`, `src/sanity/lib/queries.ts`, `src/sanity/extract.json`, and `src/sanity/generated.ts`: the existing editorial and site-settings contracts are sufficient. A design request for new contact fields requires a plan amendment and the full schema/query/typegen workflow.
- `src/app/globals.css`: use existing semantic modes/tokens. A new token is blocked until it is approved in Figma/DESIGN.
- `src/lib/shopify/**`, cart actions, account/checkout routes, webhooks, environment files, or lockfiles.
- Do not create a Contact Server Action, route handler, provider client, CRM adapter, analytics event, CAPTCHA, or message database.

## Implementation sequence

1. **Reconfirm safety and decisions:** verify clean base/current remote, create the single delivery branch, and record product-owner answers for mailbox, direct-email-only behavior, exact copy, and privacy wording.
2. **Shape and approve design:** run `node .agents/skills/impeccable/scripts/context.mjs --target "src/app/(website)/contact/page.tsx"` once; use `shape` in the established visual world; capture exact Figma nodes and state details in the feature doc. Stop at the human design gate.
3. **Storybook first:** implement Contact default/unavailable/loading/error/long-content responsive contracts with existing primitives. Compare 1440/390 captures to approved Figma in one bounded desktop/mobile inspection, batch fixes, and do at most one confirmation round.
4. **Sanity-safe data boundary:** add Contact fallback/fetch helpers without changing GROQ/schema; consume the existing validated global email with an application fallback; test null, blank, partial, draft/published, and read-failure paths. Never log content/PII or expose a token.
5. **Route integration:** compose Contact, site settings, and `readCart()` concurrently; add metadata/loading/error; preserve the current navigation and mobile behavior. Do not implement message submission.
6. **Tests and documentation:** add targeted unit/Storybook/E2E coverage, run Impeccable detection/audit and the full quality gate, then update feature/design/Sanity/roadmap docs from actual evidence.
7. **Independent review and Preview:** quality reviewer checks the exact diff and evidence. Push the single PR, wait for required CI via `just pr-gate`, then have the browser release debugger verify Preview and capture evidence. Stop for human Storybook/design confirmation, merge, and editorial publish decisions.

## Deterministic verification

Judge every command by exit status. Preserve command/commit/environment details in the verification document.

```bash
# Targeted unit/integration tests
corepack pnpm exec vitest run --config vitest.config.ts \
  'src/app/(website)/contact/page.test.tsx' \
  src/sanity/lib/editorial-pages.test.ts \
  src/components/templates/storefront-templates.test.tsx

# Storybook contracts and static build
corepack pnpm test:stories
corepack pnpm build-storybook

# Design detector (once after the bounded visual fix pass)
node .agents/skills/impeccable/scripts/detect.mjs --json

# Contact journey at CI’s browser target; test itself sets 1440/390/320 viewports
corepack pnpm exec playwright install chromium
SHOPIFY_E2E_FIXTURES=1 corepack pnpm exec playwright test tests/e2e/contact.spec.ts --project=chromium

# Complete local gates and all browser journeys
corepack pnpm check
SHOPIFY_E2E_FIXTURES=1 corepack pnpm test:e2e

# Prove the planned no-schema/no-generated-file boundary remained clean
git diff --exit-code -- src/sanity/schemaTypes src/sanity/lib/queries.ts src/sanity/extract.json src/sanity/generated.ts src/lib/shopify

# After opening/updating the PR; pending/missing/skipped/failed is a red gate
just pr-gate <PR_NUMBER>

# Against the authenticated Preview URL
PLAYWRIGHT_BASE_URL='<VERCEL_PREVIEW_URL>' corepack pnpm exec playwright test tests/e2e/contact.spec.ts --project=chromium
```

Manual/visual evidence must additionally cover: keyboard-only route and mobile drawer, focus visibility, 200% zoom at 320px, reduced motion, direct email with no mail-client invocation in tests, a nonzero cart added through the existing storefront then retained on `/contact`, Sanity draft versus published content, fallback with Sanity unavailable, error retry, no unexpected browser console/network failures, and authenticated `/api/health` success.

## Preview, release, and rollback evidence

- Record Preview URL, deployment ID, exact commit SHA, timestamp, environment, CI run, `/contact` response/metadata, `/api/health`, screenshots at 1440/390/320, console/network output, axe result, and the existing add-to-cart → `/contact` quantity persistence path.
- Confirm no message request, PII payload, provider request, CRM call, or secret appears in the network log or client bundle.
- Preview a draft `contact` document separately from published mode. The human editor decides whether/when to publish; unpublishing must return the code fallback without a deployment.
- Preferred content rollback is human unpublish/correction because the route remains useful from fallback. Code recovery is a human-authorized revert or Vercel restore to a named SHA/deployment after impact is established.
- Important rollback caveat: the pre-feature storefront already exposes a Contact navigation link while `/contact` is absent. A simple Vercel rollback to that deployment knowingly restores a broken destination. For a route-specific production incident, prefer a forward fix or pair withdrawal with an approved change that hides the link; document this tradeoff before requesting rollback.

## Residual risks

- No approved Contact Figma frames, exact copy, or mailbox/consent decision exists in repository evidence yet; these are hard blockers, not builder assumptions.
- `mailto:` depends on a configured external mail client, exposes a public address to scraping, and cannot provide in-page delivery confirmation. Product-owner acceptance and a monitored mailbox are required.
- This slice intentionally has no in-page form, submission loading/success state, provider availability, abuse protection, retention policy, or CRM integration. Those remain future work.
- The generic `editorialPage` model supports title/introduction/sections/SEO only. Phone, hours, location, subjects, routing, or structured policies require separately approved schema work.
- The error shell cannot truthfully show a cart quantity before it is read; it must not present a fabricated count.
- Protected Preview, GitHub CI, Sanity draft review, editorial publication, merge, and production smoke evidence cannot exist until the branch/PR and human gates occur.
- Account features and checkout changes remain untouched even though shared navigation may expose existing destinations.
- Rolling back to the current pre-Contact deployment reintroduces the existing `/contact` 404 risk described above.
