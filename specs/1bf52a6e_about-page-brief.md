# Sanity-managed About page — decision-complete feature brief plan

**Planning status:** Brief shaped from current repository evidence; **blocked on the product-owner decisions listed below**. This document deliberately stops before design or implementation.

**Requested outcome:** Fill the existing `/about` navigation destination with a Sanity-managed editorial page that develops the approved founder story, reuses the proven Editorial page model, and does not duplicate Shopify commerce truth.

## 1. Baseline and planning evidence

- Roadmap freshness was verified before planning: the configured remote `infusion-diffusion` was fetched with pruning, its default protected branch is `infusion-diffusion/main`, and local `main`, remote `main`, and the current `agent/about-page-brief` HEAD all resolved to commit `3c90594b44e306523aaec81420a491d61b8c1972`. The checkout was clean before this plan was written. `docs/planning/roadmap.md` was reread after that verification.
- The roadmap names the About page as immediate next action 3, after the reusable Fragrance Guide editorial model was implemented.
- `src/components/navigation.tsx` already exposes an `About` link to `/about`; the missing route currently leaves a dead navigation destination.
- `/fragrance-guide` proves the intended route, metadata, draft/published perspective, fallback, cart-count, and EditorialTemplate integration pattern.
- The reusable `editorialPage` schema already supports a slug, eyebrow, required title and introduction, optional hero image with required alt text when present, up to ten ordered heading/body sections, and SEO title/description.
- The generic GROQ query and `EditorialTemplate` already cover the fields needed for an About page. No schema, GROQ, generated-type, semantic-token, primitive, or Shopify catalogue change is presently justified.
- Approved founder-story facts already recorded in `docs/features/homepage-content-expansion.md` are: more than 130 fragrance oils were explored before refinement to six room fragrances; Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts, may be publicly named and credited; and the concise homepage story frames the brand as growing from an enduring fascination with fragrance and the way scent changes a room. These facts are a source, not permission to invent further biography or claims.
- The approved responsive Editorial template is the current visual authority. This brief does not approve a final About composition or make any Figma change.

## 2. User outcome, audience, and experience mode

### Primary user outcome

A visitor following `About` from desktop or mobile navigation can understand why Infusion Diffusion exists, how its first six-fragrance collection was developed, and which people or principles shaped it. The story should build credible brand trust without obscuring factual meaning or turning into product marketing copy.

### Audience

- First-time South African customers deciding whether the young brand is credible and relevant to their homes.
- Design-conscious and gift buyers who value provenance, material consideration, and a clear point of view.
- Returning customers seeking deeper brand context.
- The brand owner, who must be able to revise and publish the story through Sanity without a code deployment.

### Experience mode and proof of success

- Read-first, with a secondary trust/persuasion role: comprehension precedes action.
- A successful visit exposes one clear H1, a concise introduction, and an ordered founder-story narrative at `/about`; the current About navigation item is identified; the page remains complete without an image; and editorial changes can be previewed before a human publishes them.
- Product-specific truth must come from approved founder facts and supplied evidence. Generic luxury language, invented chronology, unsupported sustainability/craft claims, or fabricated founder biography do not count as success.

## 3. Scope and explicit exclusions

### In scope for the eventual feature

- A public Next.js `/about` route using the existing `EditorialTemplate` and existing global navigation/cart presentation.
- One Sanity `editorialPage` document with canonical slug `about`.
- Sanity ownership of About eyebrow, title, introduction, optional editorial/founder image and alt text, ordered narrative sections, SEO title, and SEO description.
- Version-controlled, product-owner-approved About fallback content for missing, incomplete, unconfigured, or temporarily unavailable Sanity content.
- Draft and published rendering through the existing draft-mode, Visual Editing, live-content, metadata, and cache-invalidation foundations.
- About-specific Storybook evidence using the existing EditorialTemplate contract, targeted Vitest coverage, Playwright desktop/mobile coverage, and Vercel Preview evidence after implementation.
- Documentation/roadmap reconciliation once implementation and evidence land.

### Out of scope for this planning task

- Figma edits, final visual direction, or responsive design approval.
- Runtime route, component, Storybook, test, schema, query, generated-type, or content changes.
- Creating or publishing the Sanity `about` document.
- Any Shopify product, price, inventory, discount, cart, customer, checkout, order, or webhook change.
- Analytics/consent platform implementation.
- Merge, deployment, production promotion, editorial publishing, or rollback execution.

### Feature anti-goals

- Do not create a bespoke page builder, new low-level UI primitive, second editorial schema, or About-only visual system.
- Do not copy Shopify product titles, descriptions, imagery, prices, inventory, discounts, availability, or fulfilment data into Sanity or fallback copy.
- Do not use a Shopify catalogue image as an automatic About hero fallback. Unlike the Fragrance Guide’s provisional product image, an About/founder image has a distinct editorial meaning; absent Sanity imagery must produce an intentional image-free layout.
- Do not expand the concise homepage founder block into a second independently invented story. The About page may develop it, while the homepage remains a short invitation.
- Do not add commerce CTAs, embedded products, forms, galleries, quotes, timelines, video, motion, or extra content block types unless a product-owner decision creates a separate approved scope.

## 4. System ownership boundaries

| Concern                                                                                                                                                  | Owner and boundary                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route, server rendering, metadata mapping, fallback selection, semantic hierarchy, responsive rendering, current navigation state, and cart presentation | **Next.js.** The route may read the existing normalized cart summary for global navigation; it must not fetch Shopify catalogue data merely to decorate About. |
| Founder narrative, editorial image/alt, ordered sections, and SEO copy                                                                                   | **Sanity.** Use one `editorialPage` document with slug `about`; no commerce fields belong in it.                                                               |
| Products, variants, images used as product truth, prices, inventory, discounts, carts, customers, checkout, orders, and fulfilment                       | **Shopify.** Existing cart count remains live global commerce truth and is not duplicated into Sanity. No other Shopify concern is part of About.              |
| Reusable EditorialTemplate states and visual contract                                                                                                    | **Storybook.** About-specific fixtures prove the existing contract; Storybook content is test data, not production editorial truth.                            |
| Approved visual direction and responsive composition                                                                                                     | **Figma/DESIGN.** Reuse of the approved Editorial template still requires a human to approve the About mapping and responsive states before implementation.    |
| Preview, deployment identity, health, and runtime evidence                                                                                               | **Vercel.** Preview verification does not authorize production.                                                                                                |
| Editorial publish/unpublish                                                                                                                              | **Human Sanity editor/product owner.** Agents may prepare or preview but may not publish.                                                                      |

## 5. Content contract, ranges, and states

### Proposed use of the existing editorial model

- Canonical slug: `about`.
- Eyebrow: optional in schema, normalized to an approved fallback when blank; 0–40 characters.
- Title/H1: required in Studio; 1–100 characters.
- Introduction/lead: required in Studio; 1–320 characters.
- Hero/founder image: optional; when an asset exists, meaningful alt text is required. No empty image frame and no product-image fallback.
- Sections: 0–10 ordered entries; each complete entry has a 1–90 character H2 and 1–1200 character plain-text body. Paragraph line breaks remain meaningful. Invalid/incomplete entries are excluded by the existing normalization contract.
- SEO title: optional, up to 70 characters; SEO description: optional, up to 160 characters. Both use approved versioned fallbacks when blank.
- Locale: English (`en-ZA`); Open Graph remains an article-style editorial page unless the product owner decides otherwise.

### Required state behavior

| State                                  | Observable behavior                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Published                              | Public `/about` renders the published `about` document, approved metadata, image only when complete, current About navigation state, and live cart count.                                                                                                                                                           |
| Draft                                  | An authenticated draft-mode/Visual Editing session renders the draft perspective and draft metadata without exposing drafts to ordinary public sessions. Draft-only content is not a publication action.                                                                                                            |
| Missing document / Sanity unconfigured | The route and metadata render complete approved version-controlled About fallback content; `/about` does not 404.                                                                                                                                                                                                   |
| Partial scalar fields                  | Blank or whitespace-only eyebrow/title/introduction/SEO values fall back field-by-field using the proven normalizer.                                                                                                                                                                                                |
| Partial sections                       | Complete authored sections render in their authored order. Incomplete sections are ignored. If no complete section remains, the complete approved fallback section set renders. The implementation must not splice fallback sections into a non-empty authored list because that could silently mix two narratives. |
| Incomplete image                       | Missing asset URL or blank alt text causes the image to be omitted; layout remains complete and no Shopify image substitutes for it.                                                                                                                                                                                |
| Sanity read unavailable                | The server records a bounded diagnostic without leaking tokens; content and metadata fall back. The response remains a usable About page.                                                                                                                                                                           |
| Loading/streaming                      | Existing route-level Suspense behavior may be reused, but the final page must not expose a false empty state or broken heading hierarchy. Any busy state must be non-interactive and must not trap focus.                                                                                                           |
| Cart unavailable                       | About editorial content must not depend on catalogue/cart success. Preserve the existing cart boundary’s safe empty behavior; do not invent a cart quantity.                                                                                                                                                        |
| Duplicate or ambiguous documents       | Operationally require one `editorialPage` with slug `about`. The existing query selects the first match; duplicate-document handling is a residual risk unless separately addressed.                                                                                                                                |

## 6. Responsive, accessibility, and content-extreme requirements

- Reuse the approved Editorial light-canvas composition and semantic tokens unless later design approval names a supported existing navigation mode. Do not infer a new brand treatment from the homepage founder band.
- Preserve a logical mobile-first reading order: navigation, H1 context/title/lead, optional image, then ordered H2 sections.
- Verify desktop and representative mobile widths, including 320 CSS px, and 200% text zoom. There must be no horizontal page overflow, clipped navigation labels, overlapping content, or loss of section order.
- Maintain a readable editorial measure (target 65–75 characters), sufficient spacing between long sections, and layouts that remain coherent with no image, one short section, and the ten-section maximum.
- Exercise realistic extremes: 40-character eyebrow; 100-character title; 320-character introduction; ten sections with 90-character headings and bodies approaching 1200 characters; multiple paragraphs; names such as “Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts”; no image; and a valid wide image with descriptive alt text. Do not use meaningless repeated characters as the only long-content evidence.
- Render exactly one H1 and ordered H2 headings. The article remains understandable when images fail or are absent, and no meaning may depend on colour or image alone.
- Preserve keyboard-operable desktop/mobile navigation, visible focus, mobile menu focus containment/Escape/focus restoration, 44×44 CSS pixel targets, WCAG AA contrast, and reduced-motion behavior inherited from existing navigation/template primitives.
- Image alt text describes meaningful visible content, not the founder story or marketing keywords. Decorative imagery should be omitted rather than given misleading alt text under the current schema.
- Axe checks must return no WCAG 2 A/AA or 2.1 A/AA violations; browser console must contain no errors; metadata must remain meaningful in every fallback state.

## 7. Analytics decision

**Default decision for this slice:** add no About-specific analytics event. The route will participate only in whatever ordinary pageview measurement is later approved as part of the roadmap’s global analytics and consent work. The existing EditorialTemplate has no analytics ownership, and this page has no confirmed conversion action to instrument. If the product owner requests CTA or engagement events, stop and produce a separate analytics/consent decision before implementation rather than embedding an unconsented one-off tracker.

## 8. Observable acceptance criteria for future implementation

1. Visiting `/about` from either desktop navigation or the mobile navigation dialog returns a usable page rather than a 404, and the visible About link has `aria-current="page"`.
2. `/about` renders one semantic article with exactly one H1, an introduction, and the approved ordered H2 founder-story sections using the existing EditorialTemplate; the global cart label reflects existing Shopify cart truth without introducing a catalogue dependency.
3. A published `editorialPage` document with slug `about` controls eyebrow, title, introduction, optional image/alt, complete ordered sections, SEO title, and SEO description. An authenticated draft-mode session can preview draft values while an ordinary session continues to see only published values.
4. Missing, whitespace-only, incomplete, unconfigured, and failed Sanity responses produce the state behavior in section 5, including complete approved fallback copy and metadata. A partial authored section list is never silently mixed with fallback sections.
5. An incomplete editorial image is omitted without a blank region, broken image, or product-image substitution; a complete image uses its editor-provided alt text and responsive image behavior.
6. Neither the Sanity document nor repository fallback introduces Shopify-owned product, image-as-product-truth, price, inventory, discount, availability, cart, customer, checkout, order, or fulfilment values.
7. At 320 px, representative mobile and desktop viewports, and 200% text zoom, all required content remains in logical order with no horizontal overflow. Long approved-range content and the image-free state remain readable.
8. Keyboard flow, visible focus, mobile menu behavior, minimum target sizes, reduced motion, semantic heading order, image alternatives, WCAG AA colour contrast, and axe checks satisfy section 6.
9. Metadata uses About Sanity SEO values with approved fallback title/description in published, draft, missing, partial, and unavailable states; no draft content leaks into public metadata.
10. Storybook records About desktop, mobile, image-free, complete-image, long/max-content, and the approved navigation treatment using the existing EditorialTemplate. Any changed reusable state is reviewed against the approved Figma Editorial frames before runtime implementation is accepted.
11. Vitest proves About fallback normalization, complete-versus-incomplete sections/images, route/template composition, current navigation state, and absence of a Shopify catalogue requirement. Playwright proves desktop/mobile navigation, H1/H2 structure, content, image/no-image behavior, 320 px overflow, console cleanliness, axe, metadata, and `/api/health`.
12. A Vercel Preview tied to the reviewed commit records its URL, deployment ID, commit SHA, published and authenticated-draft evidence, desktop/mobile screenshots, current navigation, metadata, console/network results, and health response. A human must approve that evidence before merge.
13. No schema, GROQ projection, extracted schema, generated type, navigation-destination, token, or primitive change is made unless implementation discovers a documented contract gap and returns through the relevant design/Sanity approval path.
14. The feature remains stopped until every blocker in section 14 is answered and the brief/design gates in section 12 are approved.

## 9. Exact file ownership and anticipated change set

### Files owned by this planning task only

- `adws/adw_data/sessions/1bf52a6e/context_handoff/plan.md` — canonical builder handoff.
- `specs/1bf52a6e_about-page-brief.md` — byte-for-byte repository copy and durable requested-feature record.

No product, design, runtime, Storybook, Sanity, test, roadmap, content, or deployment file is to be edited in this task.

### Expected files in a separately approved implementation task

| File                                                        | Expected ownership/change                                                                                                                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(website)/about/page.tsx` (new)                    | Next.js route, metadata, published/draft options, EditorialTemplate composition, live cart summary, and Suspense/fallback behavior. It should not call Shopify catalogue helpers.     |
| `src/sanity/lib/editorial-pages.ts`                         | Add About fallback data and route-specific content/metadata accessors while retaining the generic query/normalizer. Final fallback prose requires product-owner approval before code. |
| `src/sanity/lib/editorial-pages.test.ts`                    | Add About normalization and missing/partial/unavailable content tests, including no-image behavior.                                                                                   |
| `src/components/templates/storefront-templates.stories.tsx` | Add or adapt About-specific EditorialTemplate states: desktop, mobile, image-free, image-present, long/max content, and approved navigation treatment.                                |
| `src/components/templates/storefront-templates.test.tsx`    | Prove About current navigation, hierarchy, content, and optional image composition if not fully covered by route tests.                                                               |
| `src/components/navigation.test.tsx`                        | Add a focused About destination/current-state assertion only if route/template coverage does not adequately protect the existing destination.                                         |
| `tests/e2e/about.spec.ts` (new)                             | Desktop/mobile journey, current navigation, headings, content extremes/320 px, axe, console, metadata, image state, and health evidence.                                              |
| `docs/features/about-page.md`                               | Optional implementation record if the team wants a feature document separate from this immutable brief; do not duplicate unresolved decisions.                                        |
| `docs/planning/roadmap.md`                                  | Update only after accepted implementation/publish evidence changes roadmap state; do not mark content published before the human publish gate.                                        |

### Files expected to remain unchanged

- `src/sanity/schemaTypes/editorial-page.ts`, `src/sanity/lib/queries.ts`, `src/sanity/extract.json`, `src/sanity/generated.ts`, and `src/sanity/schemaTypes/index.ts`: the current generic model is sufficient. Any required change triggers `sanity-content-change` review and generated-artifact verification.
- `src/components/navigation.tsx`: `/about` already exists. Only change it if a human explicitly changes navigation scope or rollback behavior.
- `src/components/templates/storefront-templates.tsx`, `src/app/globals.css`, `DESIGN.md`, and Figma: no change is expected if the approved Editorial contract proves sufficient. A component or visual-contract change must return to design approval and synchronization.
- Shopify boundary files under `src/lib/shopify/**`: no change.

One implementation owner and one delivery branch/PR remain the default. Do not create parallel writers or worktrees without explicit engineer approval.

## 10. Applicable skills and specialist routing

### Skills

- **`feature-brief` — triggered now:** the request is specifically to turn a feature prompt into observable scope, ownership, states, evidence, and unresolved decisions before design or code.
- **`impeccable` (`shape`) — triggered now and at the design gate:** this is a new customer-facing surface with hierarchy, responsive, content-extreme, accessibility, and failure-state decisions. Planning uses shape only; do not load the craft floor or edit UI in this task.
- **`design-to-storybook` — required after brief approval:** the future route maps approved Editorial visual authority to responsive Storybook evidence. Pending is explicit: Figma/DESIGN are approved generically, but the About mapping and states lack human approval.
- **`sanity-content-change` — required for future implementation/review:** even though no schema or GROQ change is expected, the feature adds a Sanity-backed content accessor, draft/published behavior, metadata, fallback, and eventual editor document. If generated contracts change, follow the full extraction/typegen/cache path.
- **`quality-gate` — required after future implementation:** every acceptance criterion needs automated or inspection evidence, roadmap reconciliation, and residual-risk reporting.
- **`release-debug` — required for Vercel Preview verification and any runtime/fallback diagnosis:** capture environment/deployment identity, browser/network/console/health evidence, and keep production/rollback human-gated.
- **`shopify-storefront-change` — not triggered:** About does not alter commerce behavior. The existing cart count is consumed through the current boundary only.
- **`parallel-agent-worktrees` — not triggered:** the smallest topology is one writing owner, one delivery branch, and one PR. Apply it only if a human later approves multiple writers or a non-primary implementation checkout.

### Typed routing contract for this brief task

- **Implementation/writing owner:** `builder` — sole writer for this documentation-only brief task.
- **Read-only advisory specialists:** `product_designer` for later About hierarchy/responsive-state shaping and `browser_release_debugger` for later Preview evidence. Neither may approve design, production, or rollback.
- **Independent review owner:** `reviewer` for the current document-only task. A later substantive implementation must use `quality_reviewer`.

## 11. Work sequence and stop conditions

1. Preserve this document as the planning artifact and repository spec; verify both copies are identical. Do not edit runtime or content files.
2. Product owner answers every unresolved question in section 14 and explicitly approves the revised feature brief/content facts. If answers materially change scope, create a new versioned spec rather than overwriting this record.
3. Product designer maps the approved content to the existing Editorial template, explicitly defines mobile/desktop, no-image, image, and long-content states, and records whether existing approved Figma frames are sufficient. Human design approval is mandatory even when no Figma edit is needed.
4. Only after brief and design approval, open a separate implementation task with one writing owner. Route Sanity review through `sanity-content-change`; implement Storybook evidence before/in step with the route; do not introduce Shopify catalogue ownership.
5. Run targeted tests, generated-contract checks, the full local quality gate, Playwright, independent quality review, and Vercel Preview verification.
6. Stop for human merge approval. After merge/deployment, stop separately for human Sanity publish approval and any production authorization. Agents must not combine these gates.
7. If a failure requires rollback, gather impact and a named last-known-good deployment/content revision; stop for human rollback authorization.

**This planning task ends after step 1. It does not authorize design, implementation, content creation/publication, merge, deployment, or rollback.**

## 12. Deterministic verification and evidence plan

### Verify this planning artifact

```bash
test -f adws/adw_data/sessions/1bf52a6e/context_handoff/plan.md
test -f specs/1bf52a6e_about-page-brief.md
cmp adws/adw_data/sessions/1bf52a6e/context_handoff/plan.md specs/1bf52a6e_about-page-brief.md
corepack pnpm exec prettier --check adws/adw_data/sessions/1bf52a6e/context_handoff/plan.md specs/1bf52a6e_about-page-brief.md
git diff --check -- specs/1bf52a6e_about-page-brief.md
```

Judge each command by exit status. No application test is required for a Markdown-only plan.

### Required commands for a future implementation

```bash
corepack pnpm test -- src/sanity/lib/editorial-pages.test.ts src/components/templates/storefront-templates.test.tsx src/components/navigation.test.tsx
corepack pnpm sanity:schema
corepack pnpm sanity:typegen
git diff --exit-code -- src/sanity/extract.json src/sanity/generated.ts
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/about.spec.ts --project=chromium --project=mobile
corepack pnpm check
```

- The generated-file diff command is expected to pass because this plan expects no schema/query changes. If it fails due to an intentional contract change, review and commit the generated artifacts under `sanity-content-change`; do not erase the diff to force a pass.
- Storybook evidence must identify the exact story IDs and capture desktop/mobile, image/no-image, and max-content screenshots against the approved Editorial authority.
- Local/draft evidence must separately show published and authenticated draft perspectives; never expose preview tokens in screenshots, logs, commands committed to the repository, or browser-visible variables.

### Required Vercel Preview evidence

Record `PREVIEW_URL`, deployment ID, and commit SHA, then run the implementation’s browser contract against that exact deployment (using an authenticated protected-preview session where required):

```bash
curl --fail --silent --show-error "$PREVIEW_URL/api/health"
PLAYWRIGHT_BASE_URL="$PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/about.spec.ts --project=chromium --project=mobile
```

The browser release debugger must also retain:

- desktop and mobile screenshots, plus 320 px/200% zoom inspection;
- public published and authenticated draft-mode `/about` evidence;
- current desktop/mobile About navigation and live cart-label behavior;
- title, description, Open Graph text, and no draft leakage;
- console errors, failed network requests, and `/api/health` output;
- Sanity unavailable/missing fallback evidence from automated tests or a controlled non-production environment;
- a statement that no Shopify catalogue value was copied into Sanity and no new public/server secret exposure occurred.

Skipped or failed required checks keep the gate closed.

## 13. Human approval gates and rollback behavior

| Gate                        | Required evidence                                                                                                                                                                 | Human decision                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feature brief/content facts | This spec plus answers to section 14, approved fallback narrative, attribution/rights evidence, and analytics decision                                                            | Product owner approves scope, claims, fallback copy, and unresolved decisions. Missing approval blocks design and implementation.                           |
| Design                      | Approved brief; product-designer mapping to the existing Editorial authority; desktop/mobile, image/no-image, and long-content states; Storybook plan; any exact Figma links used | Product owner/design authority approves visual/responsive direction before implementation. Agents cannot treat generic template approval as About approval. |
| Merge                       | Green required checks, independent `quality_reviewer` review for implementation, generated-contract evidence, screenshots, and exact Vercel Preview                               | Human approves and merges. Agents do not self-merge.                                                                                                        |
| Editorial publish           | Valid `about` Studio document, rights-cleared image/alt where used, public-vs-draft comparison, metadata preview, and final copy review                                           | Human Sanity editor/product owner publishes, schedules, unpublishes, or leaves draft. Code merge is not publish approval.                                   |
| Production                  | Protected `main`, successful deployment, health result, `/about` smoke plan, metadata/navigation check, and logs                                                                  | Human authorizes production where it is not the automatic result of approved merge. No direct agent deployment.                                             |
| Rollback                    | Confirmed impact, deployment/content revision IDs, failing evidence, and named last-known-good target                                                                             | Human authorizes Vercel rollback or content revision/unpublish. Agents may recommend, not execute.                                                          |

### Failure and rollback strategy

- Preferred editorial rollback: use Sanity revision history to restore approved copy or unpublish the bad document, after human authorization. Unpublishing intentionally reveals the versioned About fallback rather than a 404.
- Preferred application rollback: restore the last-known-good Vercel deployment after human authorization and verify health, navigation, and metadata. Be explicit that the pre-feature deployment contains the already-existing `/about` navigation link but no route, so deployment rollback reintroduces that known 404; a content rollback that leaves the safe route/fallback live is therefore less disruptive when code is healthy.
- Schema rollback is not expected because no schema change is planned. If implementation broadens the model, it must define additive migration and rollback before editing.
- Never delete or destructively rewrite Sanity content as an automated rollback, never publish fallback copy through an agent, and never bypass protected `main`.

## 14. Unresolved product-owner questions (all are blockers)

1. **Founder identity and voice:** Who is the Infusion Diffusion founder, what name/pronouns/title may be published, and should the story be written in first-person founder voice or third-person brand voice? The repository currently names collaborator Jacqui Kirchmann but does not identify the Infusion Diffusion founder.
2. **Approved factual narrative:** Beyond the already approved “130+ oils,” six-fragrance refinement, and Jacqui Kirchmann credit, which origin, chronology, place, craft/process, material, sourcing, or business claims are evidenced and approved? Supply sources for anything the fallback must assert.
3. **Attribution wording:** What exact role did Jacqui Kirchmann play, what exact public credit is approved, and is the existing “guidance and encouragement” wording final for the longer About story?
4. **Page purpose and content sequence:** Is the required narrative limited to origin → development of six fragrances → collaborator credit → brand principles, or should it include another approved section? Confirm the ordered section headings and minimum complete fallback story.
5. **Relationship to homepage copy:** Should the concise homepage founder story remain independently editable, or must editors maintain a defined excerpt relationship to the About story? No automatic cross-document reference exists today, so the owner must accept or resolve drift risk.
6. **Founder/editorial image:** Is there a rights-cleared founder or process image for this page, who owns it, what crop/focal point is approved, and what factual alt text applies? If not, explicitly approve image-free launch; this brief rejects an automatic Shopify product-image substitute.
7. **Call to action:** Should About remain a pure editorial read, as the existing template supports, or is a closing destination such as Fragrance Guide/Shop required? A CTA changes success criteria, analytics, and potentially the approved template scope and cannot be invented by the implementer.
8. **SEO/share copy:** Approve the fallback SEO title and description, whether Open Graph type remains `article`, and whether an editorial share image is required. The implementer must not derive biography or claims from marketing keywords.
9. **Navigation treatment:** Explicitly approve the existing Ivory Editorial navigation treatment for About, or name an already-approved Midnight variant. This task does not choose or design a new treatment.
10. **Analytics:** Confirm the default of no feature-specific event and deferral to global analytics/consent. If a CTA is approved, define the business question and consent-compliant event before implementation.
11. **Publication readiness:** Who is the named human editor/publisher, and must the route merge with fallback content before the Sanity document is published, or must publication and code release be coordinated? Both flows are technically safe but operationally different.
12. **Rollback expectation:** Is falling back to the approved version-controlled story acceptable if the Sanity document is unpublished/unavailable? If the business instead requires About to disappear, a navigation/feature-switch design is additional scope.

## 15. Residual risks

- The repository contains only a concise approved founder story, not enough verified biography to author a full About narrative without product-owner input; invented detail is the highest current risk.
- About and homepage founder copy use separate content locations, so editorial drift is possible unless the product owner defines excerpt governance or accepts independent edits.
- The generic editorial query selects the first matching slug and the schema does not encode an About singleton; duplicate `about` documents could create ambiguity. Operationally enforce one document unless a separately approved schema change addresses it.
- Existing plain-text sections cannot express rich links, quotations, captions, timelines, or multiple images. Adding those would broaden schema/template/design scope and must not be smuggled into implementation.
- A deployment rollback to the pre-feature application restores the known dangling About navigation link/404. Content rollback to the safe fallback is preferable when possible.
- Final imagery, usage rights, precise attribution, SEO copy, analytics, and publication sequencing remain unresolved human decisions.
- Protected Preview or draft-mode credentials may limit automated evidence; skipped draft/Preview checks must be reported rather than represented as passed.
- The roadmap and `PRODUCT.md` current-milestone wording may need reconciliation after implementation, but changing them now would falsely imply delivery.

## 16. Synchronization status at this stop

| Layer                       | Status                                                       |
| --------------------------- | ------------------------------------------------------------ |
| Feature brief/spec          | Written, awaiting product-owner answers and approval         |
| Figma About direction       | Pending; no change made                                      |
| `DESIGN.md`                 | Existing Editorial authority only; no change made            |
| Runtime tokens/components   | Existing contracts only; no change made                      |
| Storybook About states      | Pending; no change made                                      |
| Next.js `/about` route      | Pending; no change made                                      |
| Sanity `about` document     | Pending; not created or published                            |
| Schema/GROQ/generated types | Existing generic contract appears sufficient; no change made |
| Shopify                     | Intentionally unchanged                                      |
| Preview/merge/production    | Not started; all human gates remain closed                   |
