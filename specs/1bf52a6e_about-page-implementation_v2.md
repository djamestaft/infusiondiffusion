# Implement the approved Sanity-managed About page — execution plan

## Authority and readiness

Implement `/about` from the captured, approved Figma implementation packet. The builder does not need to reconstruct or recapture the design:

- Desktop authority: Figma `316:99`, 1440×3394.
- Mobile authority: Figma `316:151`, 390×3632.
- Handoff authority: Figma `316:196`.
- Exact MCP-derived handoff: `adws/adw_data/sessions/1bf52a6e/context_handoff/figma_handoff.md`.
- Structured capture: `adws/adw_data/sessions/1bf52a6e/context_handoff/figma/about-approved-316-structured.json`.
- Reference screenshots:
  - `adws/adw_data/sessions/1bf52a6e/context_handoff/figma/about-approved-desktop-316-99.png`
  - `adws/adw_data/sessions/1bf52a6e/context_handoff/figma/about-approved-mobile-316-151.png`
- Product/implementation decisions: `specs/1bf52a6e_about-page-brief.md` and `specs/1bf52a6e_about-page-implementation.md`, with this plan and the captured handoff taking precedence where the earlier plan lacked exact values.

The packet records the frames as **Approved — Implementation Authority**, so the human design-before-implementation gate is open for this exact direction. Do not use superseded `311:*` image-free or `313:*` Midnight alternatives.

Roadmap freshness was rechecked before planning. The configured remote `infusion-diffusion` was fetched with pruning; local and remote protected `main` both remain at `3c90594b44e306523aaec81420a491d61b8c1972`; the current `agent/about-page-brief` branch is clean and ahead at `819ae4c4ccfe16955de65ef1cdd3a971f27bfbb0`, containing the committed Figma packet and prior specs. `docs/planning/roadmap.md` was reread after the fetch and still names the Sanity-managed About page as immediate next action 3.

## User outcome

A visitor who follows About from desktop or mobile navigation can read a clear, factual four-chapter brand story, understand how the collection was refined, see the approved collaborator credit, and continue to the Fragrance Guide. The brand owner can later manage chapter text and independently optional, rights-cleared images in Sanity, preview drafts, and publish without a code deployment. The page remains complete and intentional when no images or Sanity document exist.

## Approved content and visual contract

### Exact fallback copy

Use this captured copy verbatim as the version-controlled fallback. Do not invent biography, chronology, sourcing, sustainability, manufacturing, award, or commerce claims.

- H1: **The story behind the atmosphere.**
- Lead: **A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in.**
- Origin (`origin`):
  - H2: **Born from fragrance**
  - Body: **Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling.**
- Development (`development`):
  - H2: **From more than 130 oils to six fragrances**
  - Body: **More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances. The result is a focused cabinet of atmosphere: clear enough to choose with confidence, expressive enough to change the feeling of a room.**
- Collaborator (`collaborator`):
  - H2: **Guidance and encouragement**
  - Body: **The collection was created with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts.**
- Principles (`principles`):
  - H2: **Composed for lived-in rooms**
  - Body: **Infusion Diffusion treats scent as a considered part of an interior. Each fragrance is presented with clarity, restraint and a belief that luxury is earned through material detail, proportion and trust.**
- CTA heading: **Find the fragrance for your room.**
- CTA copy: **Explore the Fragrance Guide for scent notes, room context and a clear path through the collection.**
- CTA label: **EXPLORE THE FRAGRANCE GUIDE**
- CTA destination: `/fragrance-guide`.
- Fallback SEO title: **About Infusion Diffusion | Infusion Diffusion**.
- Fallback SEO description: **Discover the Infusion Diffusion story, from more than 130 fragrance oils to six fragrances composed for lived-in rooms.**

Do not render Figma’s `ROLE A–D` annotations. They describe asset intent only.

### Surfaces and topology

The whole page is Ivory/light. It contains no `.dark`, Midnight surface, black section, gradient, decorative shadow, or arbitrary divider.

- Navigation: existing Ivory Navigation, 104px desktop/80px mobile, with **About current** and Shop non-current.
- Introduction: Mineral Sage, canonical `color/background/base` / `color/sage/50` / `#EEF0E7`.
- Origin: Bone, canonical `color/bone/50` / `#F5F1E8`.
- Development: Sage.
- Collaborator: Bone.
- Principles: Sage.
- CTA: Bone.

The captured handoff explicitly says Bone has no general editorial semantic alias and binds canonical `color/bone/50` directly. Mirror that canonical token in Tailwind/runtime (for example, a `--color-bone-50` theme token and `bg-bone-50` utility) rather than inventing an About semantic alias, hardcoding `bg-[#F5F1E8]`, or reusing feedback/control/elevated tokens. Reuse existing `bg-content-surface` for Sage. Document this approved direct canonical-token mapping as intentional, not a design-system exception hidden in code.

### Grid, typography, and layout

- Desktop: 12 columns, 80px margins, 24px gutters, max content width 1280px.
- Mobile: four columns, 20px margins, 16px gutters.
- Introduction: desktop 420px reference rhythm; mobile 340px. Runtime content may expand and must not use fixed heights.
- Each chapter: desktop reference rhythm 640px, with 560×420 (4:3) media; mobile reference rhythm 740px, with 350×262 media at 390px. Runtime content expands naturally.
- CTA: desktop reference rhythm 310px; mobile 252px; no fixed height.
- Desktop alternation:
  - Origin: copy left, image right.
  - Development: image left, copy right.
  - Collaborator: copy left, image right.
  - Principles: image left, copy right.
- Every chapter’s DOM/mobile order is H2 → body → image. Desktop alternation is CSS layout/order only.
- Typography:
  - H1: Marcellus 56/115% desktop, 40/115% mobile.
  - Lead: Manrope 20/150% desktop, 17/150% mobile.
  - Chapter H2: Marcellus 34/120% desktop, 26/120% mobile.
  - Chapter body: Manrope 18/165% desktop, 16/165% mobile.
  - CTA H2: Marcellus 40/120% desktop, 30/120% mobile.
  - CTA copy: Manrope 20/150% desktop, 17/150% mobile.
  - Primary text `#191916`; secondary text `#3C3B35`, through existing semantic text tokens.
- CTA uses the existing Button rendered as an anchor: Ivory, Primary, Default, Large, 269×48 reference size, 44px minimum target and existing 2px gold focus treatment.

### Image roles and fallback

All four images are optional and independently omitted. No final images are added in this task.

- Role A / Origin: rights-cleared origin portrait or truthful working moment.
- Role B / Development: blotters, measured vessels, or working notes.
- Role C / Collaborator: rights-cleared collaboration/shared process; never imply Jacqui is pictured unless confirmed.
- Role D / Principles: fragrance within a lived-in interior; atmosphere, not Shopify merchandising.
- Display is 4:3 with the key face, hands, or action inside the central 70% crop-safe area. Use Sanity hotspot/focal data.
- Before an editor can publish an image, record source/owner, storefront usage rights, territory, expiry or perpetual status, release status where applicable, approved focal crop, and concise factual alt.
- Missing or invalid media removes that media and its gap only. On desktop, center the chapter copy at max 760px; on mobile retain H2/body order and natural height. Never render an empty/broken placeholder, another chapter’s image, a Figma screenshot crop, or a Shopify product image.
- Avoid spa shorthand, false laboratory cues, unverified people/places, and any alt text that asserts identity not visible/confirmed.

## Scope

### In scope

- New `/about` App Router route, metadata, Suspense state, current navigation and existing live cart quantity.
- Additive extension of the existing Sanity `editorialPage` schema/query/generated types for stable About roles and optional rights-controlled chapter images.
- A reusable `AboutTemplate` composed from existing primitives.
- Canonical Bone runtime token mapping, `DESIGN.md`/Impeccable sidecar synchronization, Storybook states, Vitest, Playwright/axe, feature docs, roadmap reconciliation, independent review, Preview-ready evidence and implementation commits.

### Out of scope

- Creating, buying, licensing, uploading or publishing final photography.
- Creating/publishing/scheduling/deleting the Sanity `about` document.
- Shopify product/catalogue/cart/checkout changes. Reading the existing cart summary for Navigation is allowed; no catalogue request or copied commerce value is allowed.
- Feature analytics, consent work, rich portable text, galleries, video, forms, embedded products, a general page builder, new motion, Midnight surfaces, merging, production deployment or rollback execution.

## System ownership

| Concern                                                                                          | Owner/boundary                                                                                        |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Route, rendering, metadata, responsive composition, accessibility, fallbacks, current Navigation | **Next.js**. About may call only existing `readCart()` from Shopify-facing code.                      |
| Chapter text/order/roles, SEO, optional image/alt/focal/licensing record                         | **Sanity**. Add to existing `editorialPage`; do not create a separate commerce or page-builder model. |
| Products, product imagery, variants, price, inventory, discount, customer, cart, checkout, order | **Shopify**. No value except current cart summary is consumed; nothing is copied into About/Sanity.   |
| Approved visual contract                                                                         | **Captured Figma packet** and then synchronized `DESIGN.md`. Packet files are read-only evidence.     |
| Reusable component states                                                                        | **Storybook**. Test-only image fixtures are not production content or rights claims.                  |
| Preview/deployment identity/logs/health                                                          | **Vercel**. Preview evidence does not authorize merge or production.                                  |
| Image rights and editorial publication                                                           | **Human product owner/editor**. Schema records evidence; agents cannot certify rights or publish.     |

## Implementation steps

### 1. Load required guidance and protect authority

- Read the captured packet and screenshots before edits. Do not make live Figma edits; the packet is sufficient implementation authority.
- In the implementation session, run Impeccable context once for the target, load the approved-direction guidance, and load `reference/craft-floor.md` immediately before UI edits.
- Record `316:99`, `316:151`, `316:196`, packet paths, exact copy, measurements, canonical variables and superseded frames in `docs/features/about-page.md` and `DESIGN.md`.
- Treat `context_handoff/figma_handoff.md`, structured JSON and screenshots as read-only. Do not commit duplicated image crops or derive runtime assets from them.

### 2. Extend Sanity additively

Modify `src/sanity/schemaTypes/editorial-page.ts` without changing existing Fragrance Guide requirements:

- Add optional `role` to an editorial section with stable values `origin`, `development`, `collaborator`, `principles` and human labels matching Roles A–D.
- For an `editorialPage` whose slug is `about`, validation requires exactly four sections, one unique instance of every role, in the approved order. For other editorial pages, role remains optional and existing 0–10 behavior remains compatible.
- Add optional chapter `image` with `options: { hotspot: true }` and authoring description for the role, 4:3 display, central 70% crop-safe area and prohibited implications.
- Add image fields sufficient to record the handoff’s publication evidence: factual `alt`; `sourceOwner`; `storefrontRightsConfirmed`; `territory`; either expiry date or perpetual status; model/property `releaseStatus` (`not-applicable`, `on-file`, or a similarly explicit controlled value); and a concise `licenceReference`/notes field. If an asset exists, require alt, owner/source, positive storefront-rights confirmation, territory, expiry/perpetual choice, release status and licence reference. This is authoring evidence, not legal approval.
- Keep top-level `heroImage` unchanged for Fragrance Guide; About does not use it as a fifth image.

Update `src/sanity/lib/queries.ts`:

- Project section `_key`, role, heading/body, image URL, alt, rights-confirmation eligibility and hotspot/crop coordinates required by the server normalizer.
- Do not project owner, licence reference or release notes beyond the server unless runtime eligibility genuinely requires a value. Never expose secrets; these fields are editorial records, not public copy.

Update `src/sanity/lib/editorial-pages.ts`:

- Preserve `EditorialPage`/Fragrance Guide behavior.
- Add typed `AboutChapterRole`, normalized image/focal type, `AboutPage`, exact `fallbackAboutPage`, `getAboutPage` and `getAboutPageMetadata`.
- Normalize by stable role, never mutable heading/index. Return exactly the approved role order. For each role, merge blank/missing heading/body from that role’s fallback and omit only that role’s invalid/ineligible image.
- Unknown/duplicate roles are ignored deterministically after selecting at most one valid item per approved role. Missing roles fall back. Studio should block them; runtime must still be safe.
- Validate media eligibility server-side: asset URL, trimmed factual alt and positive rights confirmation are mandatory; invalid focal data defaults to center. Do not let expiry/release metadata become public UI.
- Missing document, unconfigured Sanity or read failure returns the exact four-chapter fallback and fallback metadata. Draft perspective may show draft text/media only in authenticated draft mode; public metadata/content remains published.

Then run `corepack pnpm sanity:schema` and `corepack pnpm sanity:typegen`; commit generated `src/sanity/extract.json` and `src/sanity/generated.ts`, never hand-edit them.

### 3. Add canonical runtime design contract

- Update `DESIGN.md` with the About authority links, exact Sage/Bone topology, typography, grid, chapter alternation, source order, text-first fallback, image roles, Current=About, CTA and no-Midnight rule.
- Reconcile `.impeccable/design.json`: canonical Light Bone already exists as `bone-light` / `#F5F1E8`; update only the narrative/component metadata needed to describe About and keep the sidecar synchronized. Do not duplicate the colour primitive or rewrite unrelated entries.
- In `src/app/globals.css`, expose the canonical Figma Bone primitive to Tailwind as `--color-bone-50: #f5f1e8` (or the repository-equivalent direct canonical mapping). Use `bg-bone-50`. Do not create `--about-*`/`--editorial-alternate-*`, use raw arbitrary colour classes, or reuse `content-surface-elevated`.
- Extend `src/app/design-tokens.test.ts` to assert the canonical Bone mapping, Sage mapping and absence of a dark About surface/raw one-off class in the template.

### 4. Build `AboutTemplate`

Add `AboutTemplate` beside existing templates in `src/components/templates/storefront-templates.tsx`:

- Props contain title, lead, exactly four normalized chapters, CTA copy/destination, current href and cart count.
- Reuse `Navigation`, existing heading/lead primitives and `Button asChild` with a real Next/link anchor (or the project’s approved anchor composition). Do not duplicate low-level controls.
- Render one `<article>`, exactly one H1, four `<section>` landmarks with one H2 each, semantic paragraphs preserving approved line breaks, and a CTA section with semantic heading.
- Apply section backgrounds Sage/Bone/Sage/Bone and CTA Bone through canonical classes.
- Use max 1280px containers and the captured desktop/mobile grids. Reproduce the desktop alternation while keeping each chapter DOM order H2/body/image. CSS responsive placement may move the image visually on desktop but must not alter focus/reading order.
- Render valid media in a 4:3 container with responsive `sizes`, object-cover and hotspot-derived object position. Do not render the Role A–D labels.
- If media is absent, remove the media/gap and center desktop copy at max 760px. Do not preserve a two-column blank.
- Use natural min/padding rhythm, not fixed 420/640/740/310px heights; long text expands the owner section.
- CTA is `/fragrance-guide`, label exactly `EXPLORE THE FRAGRANCE GUIDE`, Primary/Large Ivory Button anchor, reference width 269×48, responsive without overflow.
- Pass `currentHref="/about"` to existing Navigation. The resulting current underline/`aria-current` must move from Shop to About without modifying or duplicating Navigation unless a test exposes a genuine existing contract gap.
- Add no ScrollReveal or other motion; honor existing reduced-motion behavior.

### 5. Add the route and metadata

Create `src/app/(website)/about/page.tsx` following the proven Fragrance Guide draft/published pattern:

- `generateMetadata()` uses `getDynamicFetchOptions()` and `getAboutPageMetadata()`; return title, description and `openGraph` with `en_ZA` and the approved editorial type.
- Content fetches `getAboutPage(options)` and `readCart()` in parallel.
- Do not import `getCachedHomepageProducts`, `toProductCard` or any Shopify catalogue helper.
- Render `AboutTemplate` with About current and the real cart total.
- Suspense fallback is a fully light base surface with `aria-busy="true"`, no false headings or focusable content.

### 6. Storybook and automated coverage

Update Storybook contracts:

- Add `AboutApprovedDesktop` and `AboutApprovedMobile` stories matching the screenshots.
- Add all-images-missing/text-first, partial images (one and alternating), long/max content, partial Sanity and unavailable fallback stories.
- Add `CurrentAbout` in `src/components/navigation.stories.tsx`, covering desktop and mobile closed/open where practical.
- Since final photography is out of scope, use a deterministic, unmistakably test-only 4:3 fixture (for example, a local/data SVG declared in story/test code) to prove geometry. Do not use Shopify product fixture images, the Figma screenshot itself, or add a public production asset.
- Story play assertions verify four role headings, current About, CTA href, computed section RGB sequence Bone/Sage/Bone/Sage after Sage intro, Bone CTA, 4:3 geometry where images exist, no role labels, no `.dark`, and image-free copy max behavior.

Update Vitest:

- `src/sanity/lib/editorial-pages.test.ts`: exact fallback, stable order, field-level text fallback, missing role, unknown/duplicate roles, eligible/ineligible image, focal default, missing/unavailable data, metadata and Fragrance Guide regression.
- `src/components/templates/storefront-templates.test.tsx`: one H1/four H2s, chapter/CTA semantics, source order, surface classes, desktop alternation classes, text-first collapse, 4:3/focal style, CTA anchor and current About/cart state.
- `src/components/navigation.test.tsx`: explicit About-current and Shop-not-current assertion if template coverage cannot protect it alone.
- `src/app/design-tokens.test.ts`: canonical Bone/Sage runtime mapping and no misuse.

Create `tests/e2e/about.spec.ts`:

- Validate exact fallback headings/copy/CTA, About current on desktop/mobile, one H1/four chapter H2s, live/empty cart semantics, metadata and no Shopify catalogue dependency.
- Assert computed backgrounds: intro Sage `rgb(238, 240, 231)`, chapters Bone/Sage/Bone/Sage, CTA Bone `rgb(245, 241, 232)`.
- Assert mobile DOM order H2 → body → image and desktop visual alternation using bounding boxes without assuming fixed section heights.
- Validate all-images-missing runtime fallback and, through Storybook/component tests or a deterministic fixture route only if already supported, 4:3/focal media behavior. Do not introduce production test routes solely for imagery.
- At 320px, assert 20px page margins where applicable, no horizontal overflow, naturally wrapped CTA, source order and 4:3 media.
- Run axe WCAG 2 A/AA and 2.1 A/AA; collect console errors and failed relevant requests.
- Preserve `tests/e2e/fragrance-guide.spec.ts` as a regression check.

### 7. Documentation, review, and commits

Create `docs/features/about-page.md` containing:

- exact authority links/packet paths and approval status;
- user outcome, exact copy, four role/image authoring table, rights checklist and text-first fallback;
- responsive topology/typography, Current=About and CTA;
- Sanity/Next.js/Shopify/Storybook ownership;
- draft/published/missing/partial/unavailable behavior;
- accessibility/content extremes, verification evidence, known no-final-photo state and rollback;
- synchronization matrix for Figma packet, `DESIGN.md`, `.impeccable/design.json`, runtime tokens, schema/generated types, component and Storybook.

Update `docs/features/sanity-editorial-pages.md` to distinguish About’s four stable chapter/image roles from Fragrance Guide’s single optional hero while documenting shared schema and fallback behavior.

After the implementation and evidence exist, reconcile `docs/planning/roadmap.md`:

- mark About runtime/schema/Storybook implementation complete only when green local evidence and commits exist;
- leave Preview review incomplete until an actual Vercel URL is verified;
- leave Sanity content creation/publication and final photography as human gates;
- replace immediate action 3 with the truthful next action (Preview review and human editorial creation/publication), not a false launch claim.

The one storefront engineer creates reviewable commits on the current task branch; committing is in scope, merging is not. Recommended boundaries:

1. `Add Sanity About editorial contract` — schema/query/application normalization/tests/generated types.
2. `Build approved About page experience` — canonical token, AboutTemplate, route, stories and UI tests.
3. `Document and verify About page delivery` — E2E/docs/roadmap evidence and fixes from independent review.

Combine commits only if necessary to keep every commit buildable; do not split work across writers. After quality-review fixes, commit them (amend only when safe and not already shared), and hand off with `git status --short` clean except explicitly preserved unrelated operator files.

## Exact file ownership

### Add

- `src/app/(website)/about/page.tsx`
- `tests/e2e/about.spec.ts`
- `docs/features/about-page.md`

### Modify

- `DESIGN.md`
- `.impeccable/design.json` (only synchronized About metadata/narrative; canonical Bone already exists)
- `src/app/globals.css`
- `src/app/design-tokens.test.ts`
- `src/components/templates/storefront-templates.tsx`
- `src/components/templates/storefront-templates.stories.tsx`
- `src/components/templates/storefront-templates.test.tsx`
- `src/components/navigation.stories.tsx`
- `src/components/navigation.test.tsx` only if focused current-state coverage is needed
- `src/sanity/schemaTypes/editorial-page.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/lib/editorial-pages.ts`
- `src/sanity/lib/editorial-pages.test.ts`
- `src/sanity/extract.json` (generated)
- `src/sanity/generated.ts` (generated)
- `docs/features/sanity-editorial-pages.md`
- `docs/planning/roadmap.md` only to reflect delivered evidence

### Preserve unchanged/read-only

- `adws/adw_data/sessions/1bf52a6e/context_handoff/figma_handoff.md`
- `adws/adw_data/sessions/1bf52a6e/context_handoff/figma/**`
- approved Figma frames (no Figma edits)
- `src/components/navigation.tsx` unless a genuine current-state defect is proven
- `src/app/(website)/fragrance-guide/page.tsx` and Fragrance Guide behavior
- `src/lib/shopify/**`
- `public/**` (no final/test photography asset)
- existing unrelated user/operator changes

## State matrix

| State                                | Observable behavior                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Published                            | Public uses published title/lead/four roles/eligible images/SEO, fixed approved role order, current About and live cart count. |
| Draft                                | Authenticated draft/Visual Editing shows draft text and eligible draft media; ordinary sessions remain published.              |
| No Sanity document/unconfigured      | HTTP 200 with exact versioned title, lead, four fallback chapters, no images, CTA and fallback metadata.                       |
| Partial text                         | Blank title/lead/role heading/body falls back only for that field/role; valid authored values remain.                          |
| Missing role                         | Exact fallback text for that role; the other three remain authored; four chapters always render.                               |
| Duplicate/unknown/out-of-order role  | Studio blocks publication; runtime selects one known role each, ignores extras and outputs canonical order.                    |
| Missing/incomplete/unconfirmed image | Only that image and media gap disappear; max-760px centered desktop text; no substitute.                                       |
| Invalid/missing hotspot              | Eligible image uses safe center positioning.                                                                                   |
| Sanity read unavailable              | Bounded server diagnostic with no secret; exact fallback content/metadata renders.                                             |
| Long content                         | No clamp/fixed height; owning section expands and following sections move naturally.                                           |
| Cart failure                         | Preserve existing cart boundary’s safe behavior; About content remains independent and no quantity is invented.                |

## Accessibility and content extremes

- Exactly one H1; exactly four ordered chapter H2s plus a semantically correct CTA heading; no heading-level skips introduced by the template.
- Mobile and accessibility source order is H2, body, image in every chapter. CSS order never changes screen-reader order.
- All functionality is keyboard reachable; CTA is a real anchor; current About uses `aria-current="page"`; visible focus and existing mobile menu containment/Escape/focus restoration remain intact; interactive targets are at least 44×44.
- Images have factual alt and are omitted when invalid. Colour/image never carries required meaning.
- Verify WCAG AA contrast on Sage and Bone, focus, link/button states; axe must report no WCAG 2 A/AA or 2.1 A/AA violations.
- Verify 320px and 200% text zoom, 20px mobile margins, no overflow/clipping/overlap, no fixed-height truncation, and CTA wrapping.
- Long-content fixtures: 100-character H1, 320-character lead, each 90-character H2, bodies near 1200 characters with paragraph breaks, long Jacqui attribution, all four eligible fixture images, one image, alternating images and no images. Do not use meaningless repeated characters as the only evidence.
- No required/new motion; reduced-motion users receive the same content/order.

## Acceptance criteria

1. `/about` renders exact approved fallback copy, one H1, four chapters in Origin/Development/Collaborator/Principles order, the exact Fragrance Guide CTA, current About Navigation and existing real cart presentation.
2. Desktop and mobile visually match the captured authority within documented browser/font rendering tolerances: dimensions/rhythm, typography, 1280px/12-column desktop layout, 20px/four-column mobile layout, and alternating desktop placement.
3. Surfaces are introduction Sage, chapters Bone/Sage/Bone/Sage, CTA Bone, using canonical runtime tokens. There is no Midnight/dark surface, raw one-off colour, invented About semantic alias, elevated/feedback token misuse, gradient or unapproved shadow.
4. Mobile/DOM chapter order is H2 → body → image. Desktop alternation is layout-only. Runtime uses no fixed chapter heights or content clamps.
5. Each valid chapter image is 4:3, uses hotspot/focal placement and factual alt, and is backed by required rights records. Missing/ineligible images independently collapse to centered max-760px text-first layout without placeholders or substitutions.
6. No Role A–D label, final/test photo asset, Figma screenshot crop, Shopify product image, or invented person/place appears in runtime.
7. The additive Sanity contract enforces four unique ordered roles for About, records image authoring/rights evidence, preserves Fragrance Guide, regenerates types, and supports published/draft/missing/partial/unavailable states deterministically.
8. Metadata uses Sanity published/draft perspective correctly, exact fallbacks, `en_ZA`, and approved editorial Open Graph semantics; public mode never leaks drafts.
9. About imports no Shopify catalogue helper and writes no Shopify-owned data to Sanity. Only existing cart summary truth appears in global Navigation.
10. Storybook covers approved desktop/mobile, Current=About, all/partial/no-image, long/max-content and unavailable/partial-content states with play assertions and screenshot evidence.
11. Vitest covers tokens, Sanity role/image/fallback contracts, template semantics/layout/fallback, CTA/current navigation and Fragrance Guide regressions.
12. Playwright on desktop/mobile covers exact content, surfaces, layout alternation/source order, 320px resilience, metadata, current navigation/CTA, overflow, console/network, axe and `/api/health`; Fragrance Guide regression remains green.
13. `DESIGN.md`, sidecar, canonical runtime token, schema/generated types, `AboutTemplate`, Storybook, feature docs and roadmap are synchronized, with intentional no-final-photo state explicit.
14. Full deterministic local gate is green, Impeccable detector has no blocking findings, independent `quality_reviewer` findings are fixed or explicitly human-accepted, and implementation/documentation are committed on the task branch.
15. Preview-ready evidence identifies the tested commit and exact local/Storybook artifacts. Before merge, an actual Vercel Preview tied to that commit must pass independent browser verification; no agent merges, publishes, deploys production or rolls back.

## Deterministic verification commands

Run targeted checks during development, then all gates. Judge every command by exit status.

```bash
corepack pnpm sanity:schema
corepack pnpm sanity:typegen
corepack pnpm test -- src/app/design-tokens.test.ts src/sanity/lib/editorial-pages.test.ts src/components/templates/storefront-templates.test.tsx src/components/navigation.test.tsx
node .agents/skills/impeccable/scripts/detect.mjs DESIGN.md src/app/globals.css src/components/templates/storefront-templates.tsx src/components/templates/storefront-templates.stories.tsx
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:stories
corepack pnpm build-storybook
corepack pnpm build
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile
corepack pnpm check
git diff --check
```

Review generated/ownership evidence:

```bash
git diff -- src/sanity/extract.json src/sanity/generated.ts
git diff -- DESIGN.md .impeccable/design.json src/app/globals.css
git diff -- src/lib/shopify public
git status --short
git log --oneline --decorate -8
```

Expected: intentional generated/design diffs before commit; empty Shopify/public diff; final implementation handoff has feature commits and no uncommitted implementation files. Re-run schema/type generation after the final schema/query change.

## Visual, review, and Preview evidence

### Storybook/local evidence

- Record story IDs and screenshots for approved desktop/mobile, no-image, partial-image and long-content states.
- Compare at 1440×3394 and 390×3632 against captured PNGs. Use structured JSON/handoff for exact values; do not pixel-copy Role labels or provisional imagery.
- Inspect 320px and 200% zoom, computed colours, 4:3 geometry, source order, text-first max width, CTA/current/focus and absence of `.dark`.
- Product designer provides a read-only comparison report. Human approval is needed for any intentional deviation.
- Quality reviewer independently maps all criteria to evidence, checks generated/schema/rights/Shopify boundaries, accessibility, console output, roadmap wording and commit cleanliness. Fix findings and commit before handoff.

### Preview-ready and Vercel evidence

The implementation handoff must identify the final commit SHA, story IDs/screenshots, full command results and untested external states. If a Vercel Preview URL is generated by a PR, the browser release debugger records URL, deployment ID, commit SHA and timestamp, then runs:

```bash
curl --fail --silent --show-error "$PREVIEW_URL/api/health"
PLAYWRIGHT_BASE_URL="$PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile
```

Retain Preview desktop/mobile/320 screenshots, public published/fallback and authenticated draft evidence, metadata, current About/CTA/cart, console/network/health, missing/unavailable Sanity fallback and proof of no Shopify catalogue/final image use. If no Preview exists in this implementation workflow, state that accurately: local evidence may be “Preview-ready,” but the merge gate remains closed until an exact Vercel Preview is independently verified.

## Specialist routing and skills

### Execution contract

- **Implementation owner:** `storefront_engineer` — sole writer and commit author for runtime, Storybook, additive Sanity contract, tests and docs on one task branch/PR.
- **Advisory specialists:** `product_designer` for read-only captured-Figma comparison; `browser_release_debugger` for read-only Preview/runtime evidence.
- **Review owner:** `quality_reviewer` — independent substantive review; cannot be replaced by the implementation owner.

### Applicable skills

- **`feature-brief`:** prior specs plus this exact packet define approved outcome, boundaries, states and evidence; no unresolved product choices remain for code-only/text-first delivery.
- **`impeccable`:** required for exact responsive UI, hierarchy, typography, accessibility, long content and bounded visual comparison. Use context once and craft-floor before UI edits.
- **`design-to-storybook`:** mandatory for captured Figma → `DESIGN.md`/sidecar → canonical token → component → Storybook synchronization and final matrix.
- **`sanity-content-change`:** mandatory for additive schema, GROQ, generated/application types, draft/published, image rights authoring, fallbacks and Fragrance Guide regression.
- **`quality-gate`:** mandatory for criterion-to-evidence mapping, full commands, independent diff/security/generated-file review and roadmap reconciliation.
- **`release-debug`:** mandatory when verifying Vercel Preview or diagnosing runtime/draft/Sanity failures; it does not authorize production/rollback.
- **`shopify-storefront-change`:** not triggered. Stop and obtain new scope if any Shopify change appears necessary.
- **`parallel-agent-worktrees`:** not triggered; one writer/branch/PR is explicit. Apply only if a human approves a different topology.

## Human gates

| Gate                         | Required evidence                                                                                                                      | Human decision                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Design before implementation | Already opened by Approved implementation-authority packet.                                                                            | Reapproval only if packet cannot be followed or a deviation/design change is proposed.                  |
| Image rights/content         | Schema record, factual alt/focal, source/owner, territory/expiry, releases and actual draft Preview. No final images are included now. | Human editor/product owner certifies rights/claims and chooses whether/when to add and publish content. |
| Independent review           | Green local evidence, captured comparison, acceptance matrix, clean committed diff.                                                    | Quality reviewer reports findings; human accepts only explicitly unresolved deviations.                 |
| Merge                        | Green CI, exact Vercel Preview, independent review and reviewable commits.                                                             | Human approves/merges. Agents never merge.                                                              |
| Sanity publication           | Valid `about` document, final copy/SEO and rights-cleared image evidence where used, draft/public comparison.                          | Human publishes/schedules/unpublishes. Code/commit is not publication approval.                         |
| Production                   | Protected `main`, successful deployment, health/smoke/log evidence.                                                                    | Human authorizes production when not automatic from approved merge. No direct agent deploy.             |
| Rollback                     | Confirmed impact, failing deployment/content revision and named last-known-good target.                                                | Human authorizes Vercel rollback or Sanity revision restore/unpublish. Agents only recommend/verify.    |

## Rollback strategy

- Prefer human-authorized Sanity revision restore or unpublish when code is healthy; `/about` returns exact version-controlled text-first fallback.
- Schema changes are additive. Old code ignores role/image metadata; Fragrance Guide retains existing top-level hero/section text. No destructive migration is allowed.
- For application failure, identify SHA/deployment and recommend a named last-known-good Vercel deployment. Note that pre-feature rollback restores the existing dangling `/about` navigation 404; a content rollback or forward fix is less disruptive when the route itself is healthy.
- Revert route/template/canonical token/schema/generated contract coherently; do not leave a raw-colour patch, partial schema, stale generated types or false roadmap completion.
- Never execute publication, destructive content recovery, merge, production deployment or rollback automatically.

## Residual risks

- Final imagery and its legal/identity evidence remain external human work. The shipped page may intentionally be text-first in all four chapters.
- Rights metadata records assertions but is not legal proof; human publication review remains accountable.
- Conditional About validation broadens a shared schema and could regress Fragrance Guide if role/image rules leak; generated types and regression tests are required.
- Sanity hotspot-to-CSS object positioning can differ from crop expectations; Storybook/Preview media fixtures must verify central-70% behavior without becoming production assets.
- Homepage and About founder copy remain independently editable and can drift; this delivery documents but does not solve governance.
- The approved screenshot contains provisional product-like imagery and Role labels that must not be mistaken for runtime assets/content.
- Browser font rendering may produce small screenshot differences; measure topology/typography and document tolerances rather than forcing inaccessible fixed heights.
- Protected Preview/draft credentials may prevent complete remote checks; missing evidence keeps merge closed.
- Pre-feature Vercel rollback reintroduces the known `/about` 404.

## Completion handoff

Report final commit SHAs, changed files, commands with exit status, Storybook IDs/screenshots, product-designer comparison, quality-review result/fixes, Figma deviations, Preview URL/deployment/SHA or explicit Preview-ready status, unpublished/no-final-photo state, roadmap status, untested external states and residual risks. Stop before merge, Sanity publication, production deployment or rollback.
