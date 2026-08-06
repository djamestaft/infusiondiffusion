# Implement the approved About page — corrected FIT portrait plan

## Authority and correction record

Implement `/about` from the approved Figma authority and captured packet:

- Desktop: [Figma `316:99`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-99), 1440×3394.
- Mobile: [Figma `316:151`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-151), 390×3632.
- Updated Approved handoff: [Figma `316:198`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=316-198).
- Captured authority: `adws/adw_data/sessions/1bf52a6e/context_handoff/figma_handoff.md`, structured data under `context_handoff/figma/`, and the approved desktop/mobile screenshots there.
- Prior product and execution records: `specs/1bf52a6e_about-page-brief.md`, `specs/1bf52a6e_about-page-implementation.md`, and `specs/1bf52a6e_about-page-implementation_v2.md`.

This plan is the immutable correction/successor to the earlier tracked implementation plans. Do not overwrite those records. Repository-facing design/docs must cite handoff `316:198`; stale `316:196` references in the earlier capture metadata describe the predecessor handoff and are superseded by this user-approved correction. The captured geometry validation remains authoritative: the approved visual frames did not change and require no new design approval.

### Material correction

Do not conflate the media layout slot with the visible artwork:

- Outer layout slot: **4:3**, 560×420 desktop and 350×262 mobile.
- Intrinsic/visible artwork: **3:4 portrait**, source 480×640, rendered with Figma `scaleMode=FIT`.
- Visible artwork: **315×420 desktop** and **196.5×262 mobile**, centered horizontally inside the wider slot.
- Runtime behavior: no crop-to-fill, no stretch, no `object-cover`; preserve the whole portrait with centered FIT/contain behavior.
- Authoring safety: keep any key face, hands, or action within the central 70% of the portrait artwork.

At 320px with 20px page margins, the responsive outer slot is 280×210 and its centered 3:4 artwork is 157.5×210. It must remain fully visible without horizontal overflow.

The supplied Approved frames open the implementation gate. Human approval is still required for any divergence, merge, actual image rights/publication, production, and rollback.

Roadmap freshness was verified before this plan: the configured `infusion-diffusion` remote was fetched with pruning; local and remote protected `main` remain at `3c90594b44e306523aaec81420a491d61b8c1972`; the clean current `agent/about-page-brief` branch is ahead at `141576f147564baeb6e6729afeeceafed5bfd78f`. `docs/planning/roadmap.md` was reread after the fetch and still names About as immediate next action 3.

## User outcome

A visitor following About from desktop or mobile navigation can read a factual four-chapter founder/brand story, understand how the six-fragrance collection was refined and who supported it, and continue to the Fragrance Guide. The brand owner can later manage chapter copy and independently optional, rights-cleared portrait artwork in Sanity. Missing images, a missing document, or an unavailable Sanity service must still produce a complete, intentional, text-first page.

## Approved content contract

Use this exact copy as version-controlled fallback and as the basis for Sanity preview testing. Do not invent founder identity, chronology, sourcing, sustainability, manufacturing, award, perfumer, or commerce claims.

- H1: **The story behind the atmosphere.**
- Lead: **A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in.**
- Origin (`origin`):
  - **Born from fragrance**
  - **Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling.**
- Development (`development`):
  - **From more than 130 oils to six fragrances**
  - **More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances. The result is a focused cabinet of atmosphere: clear enough to choose with confidence, expressive enough to change the feeling of a room.**
- Collaborator (`collaborator`):
  - **Guidance and encouragement**
  - **The collection was created with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts.**
- Principles (`principles`):
  - **Composed for lived-in rooms**
  - **Infusion Diffusion treats scent as a considered part of an interior. Each fragrance is presented with clarity, restraint and a belief that luxury is earned through material detail, proportion and trust.**
- CTA heading: **Find the fragrance for your room.**
- CTA copy: **Explore the Fragrance Guide for scent notes, room context and a clear path through the collection.**
- CTA: **EXPLORE THE FRAGRANCE GUIDE** → `/fragrance-guide`.
- Fallback SEO title: **About Infusion Diffusion | Infusion Diffusion**.
- Fallback SEO description: **Discover the Infusion Diffusion story, from more than 130 fragrance oils to six fragrances composed for lived-in rooms.**

Figma’s `ROLE A–D` labels are asset annotations and must never render.

## Visual and responsive contract

### Fully light surfaces

- Ivory Navigation; About is current and Shop is not current.
- Introduction: Mineral Sage `color/background/base` / `#EEF0E7`.
- Origin: Bone `color/bone/50` / `#F5F1E8`.
- Development: Sage.
- Collaborator: Bone.
- Principles: Sage.
- CTA: Bone.

No `.dark`, Midnight/black surface, gradient, unapproved shadow, ornamental divider, raw colour utility, or feedback/control/elevated token is allowed.

The approved Figma handoff binds canonical Bone directly because no general editorial semantic alias exists. Mirror the canonical primitive into Tailwind/runtime (for example `--color-bone-50: #f5f1e8` and `bg-bone-50`) rather than inventing an About/editorial semantic alias or using `bg-[#F5F1E8]`. Reuse `bg-content-surface` for Sage. Document this deliberate Figma-to-runtime canonical mapping.

### Layout and type

- Desktop: 12 columns, 80px margins, 24px gutters, max 1280px.
- Mobile: four columns, 20px margins, 16px gutters.
- Reference section rhythm: introduction 420/340px desktop/mobile; chapters 640/740px; CTA 310/252px. These are approved default-content measurements, not fixed CSS heights.
- Desktop alternation:
  - Origin copy left, slot/artwork right.
  - Development slot/artwork left, copy right.
  - Collaborator copy left, slot/artwork right.
  - Principles slot/artwork left, copy right.
- DOM and mobile order for every chapter: H2 → body → image slot/artwork. Desktop alternation is CSS layout only.
- H1: Marcellus 56/115% desktop, 40/115% mobile.
- Lead: Manrope 20/150% desktop, 17/150% mobile.
- Chapter H2: Marcellus 34/120% desktop, 26/120% mobile.
- Chapter body: Manrope 18/165% desktop, 16/165% mobile.
- CTA H2: Marcellus 40/120% desktop, 30/120% mobile.
- CTA copy: Manrope 20/150% desktop, 17/150% mobile.
- Existing semantic primary `#191916` and secondary `#3C3B35` text roles.
- CTA is existing Button as an anchor, Ivory/Primary/Default/Large, reference 269×48 and at least 44×44.

### Correct image behavior

Each chapter may have one portrait artwork record:

- Role A / Origin: rights-cleared origin portrait or truthful working moment.
- Role B / Development: blotters, measured vessels, or working notes.
- Role C / Collaborator: rights-cleared collaboration/shared process; never imply Jacqui is pictured unless verified.
- Role D / Principles: fragrance in a lived-in interior; atmosphere, not Shopify merchandising.

Implementation shape:

1. A responsive outer slot owns the 4:3 layout geometry.
2. Inside it, a centered wrapper owns the 3:4 visible artwork and takes the slot’s full height: 315×420 in a 560×420 desktop slot, 196.5×262 in a 350×262 mobile slot.
3. Render the Sanity image with `object-fit: contain`/equivalent FIT semantics inside that portrait wrapper. Never use `object-cover`, crop to fill the outer slot, stretch to 4:3, or set the image itself to `aspect-[4/3]`.
4. The outer slot has no visible placeholder/background/border unless explicitly present in the captured frame (none is approved). Side breathing room is intentional.
5. Sanity hotspot/focal information is authoring evidence for central-70% safety, not permission to crop the portrait. Default to centered positioning when focal data is absent/invalid.
6. Missing or ineligible media removes the entire slot and associated column gap. Center desktop copy at max 760px; mobile remains text-first with natural height. Never borrow another chapter image, use a Figma screenshot/provisional fill, or substitute Shopify imagery.

Before human publication, Sanity must record source/owner, storefront rights, territory, expiry or perpetual status, releases where applicable, approved focal point and factual alt. This implementation adds the authoring boundary but no final images/licences.

## Scope and exclusions

### In scope

- Correct the tracked execution record through this new versioned plan and update implementation docs to use handoff `316:198` and FIT geometry.
- New `/about` route, metadata, Suspense state, current Navigation and existing real cart count.
- Additive existing-`editorialPage` schema/query/generated/application types for stable About roles and optional rights-controlled portrait artwork.
- Dedicated `AboutTemplate`, canonical Bone runtime mapping, Storybook, Vitest, Playwright/axe, design/docs/roadmap synchronization, independent review, Preview-ready evidence and implementation commits.

### Out of scope

- Final photography creation, purchase, licensing, upload or publication.
- Sanity document creation/publication/scheduling/deletion.
- Shopify product/catalogue/cart/checkout changes; existing `readCart()` use for Navigation remains allowed.
- Feature analytics/consent, rich text/page builder, galleries/video/forms/products, new motion, Midnight, merge, production deploy or rollback execution.

## Ownership boundaries

| Concern                                                                                            | Owner/boundary                                                                                                       |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Route, metadata, responsive/FIT layout, current navigation, accessibility and fallback consumption | **Next.js**. About may call `readCart()` only; no catalogue helper.                                                  |
| Copy, four stable roles, optional image, alt/focal/rights records, SEO                             | **Sanity**, via additive existing `editorialPage`. No commerce truth.                                                |
| Products/product images, variants, price, inventory, discount, customer, cart, checkout/order      | **Shopify**. Only current cart summary appears in global Navigation; nothing is copied.                              |
| Visual authority                                                                                   | **Figma `316:99`, `316:151`, updated handoff `316:198` plus captured packet**. Context packet is read-only evidence. |
| Reusable states                                                                                    | **Storybook**. Test-only portrait fixtures cannot ship as content or imply rights.                                   |
| Preview/logs/health                                                                                | **Vercel**. Preview evidence does not authorize merge/production.                                                    |
| Image rights and publish                                                                           | **Human owner/editor**. Fields/checklists do not let an agent certify rights or publish.                             |

## Implementation plan

### 1. Apply guidance and synchronize authority

- Read this plan, the captured handoff, structured image geometry and screenshots before edits. The corrected FIT contract clears the prior product-designer blocker; do not follow the earlier v2 4:3-fill wording.
- Run Impeccable context once in the implementation session and load `reference/craft-floor.md` immediately before UI edits.
- Update `DESIGN.md` and `docs/features/about-page.md` to cite `316:198`, record slot-versus-artwork geometry, centered FIT/no-crop behavior, responsive 320 calculation, exact copy/surfaces/type/CTA/current state, and superseded handoff references.
- Keep `.impeccable/design.json` synchronized. Canonical Light Bone already exists; add only required About narrative/component metadata and do not duplicate the primitive.
- Do not edit Figma or context packet files. If a runtime deviation from the corrected contract becomes necessary, stop for human approval.

### 2. Extend Sanity additively

In `src/sanity/schemaTypes/editorial-page.ts`:

- Add stable optional section `role` values `origin`, `development`, `collaborator`, `principles`.
- For slug `about`, require exactly four unique roles in approved order; do not impose this on Fragrance Guide.
- Add optional chapter image with hotspot support and clear authoring guidance: artwork must be an approved portrait/rendition intended for centered 3:4 FIT inside a 4:3 slot; central 70% contains key content; no crop-to-fill; role-specific subject guidance.
- Add factual `alt`, `sourceOwner`, `storefrontRightsConfirmed`, `territory`, expiry-or-perpetual status, controlled release status, and `licenceReference`. When an asset exists, require complete rights/alt records. These fields record evidence but do not constitute human rights approval.
- Preserve top-level `heroImage` and ordinary editorial section compatibility for Fragrance Guide.

In `src/sanity/lib/queries.ts`:

- Project `_key`, role, heading/body and only runtime eligibility/rendering image values: URL, alt, rights confirmation and hotspot/crop/focal data.
- Do not send owner/licence/release notes to rendered UI unless a proven server eligibility need requires them.

In `src/sanity/lib/editorial-pages.ts`:

- Keep Fragrance Guide types/normalization unchanged.
- Add `AboutChapterRole`, normalized portrait media/focal type, `AboutPage`, exact `fallbackAboutPage`, `getAboutPage` and metadata accessor.
- Normalize by stable role into fixed order. Merge missing text per role; ignore unknown/duplicate extras deterministically; missing roles get fallback.
- Render media only with asset URL, trimmed factual alt and positive rights confirmation. The normalized contract describes portrait artwork, not a 4:3 image. Invalid focal data defaults to center; it never enables a crop-to-fill.
- Missing/unconfigured/failed Sanity returns exact four-chapter no-image fallback and fallback metadata. Authenticated draft uses drafts; public mode uses published values only.

Regenerate `src/sanity/extract.json` and `src/sanity/generated.ts` using project scripts; never edit them by hand.

### 3. Add runtime design mapping

- In `src/app/globals.css`, add the direct canonical Figma Bone mapping (`--color-bone-50: #f5f1e8` or repository-equivalent theme entry). Use `bg-bone-50`; no arbitrary value or invented alias.
- Extend `src/app/design-tokens.test.ts` to protect canonical Bone/Sage mappings and ensure About contains no dark/raw/elevated misuse.
- Record the intentional canonical mapping in `DESIGN.md` and the feature synchronization matrix.

### 4. Build `AboutTemplate`

Add `AboutTemplate` next to existing storefront templates:

- Compose existing Navigation, content primitives and Button anchor. Do not duplicate low-level components or alter Fragrance Guide’s `EditorialTemplate` contract.
- One `<article>`, one H1, four chapter `<section>` elements/H2s, semantic paragraphs, and semantic CTA section.
- Surfaces: intro Sage; Bone/Sage/Bone/Sage chapters; Bone CTA.
- Max 1280px/grid/padding/type follow capture. Use natural section height, no content clamp or fixed runtime height.
- Preserve H2/body/media DOM order. Apply desktop visual alternation via grid placement only.
- For eligible media:
  - outer slot uses 4:3 aspect and full approved column width;
  - inner centered wrapper uses full slot height and `aspect-ratio: 3/4`;
  - image uses FIT/contain and remains wholly visible;
  - no `object-cover`, no fill of outer 4:3 width, no stretch, no visible placeholder.
- At desktop reference size, tests must measure outer 560×420 and inner 315×420. At mobile reference, outer 350×262 and inner 196.5×262. Allow normal subpixel browser tolerance.
- Missing media removes slot/gap and centers text max 760px.
- CTA exact copy/link through existing Primary Large Button anchor.
- Pass `currentHref="/about"`; About gets `aria-current="page"`, Shop does not. Existing Navigation should not require source changes.
- Add no motion.

### 5. Add route and metadata

Create `src/app/(website)/about/page.tsx` using the Fragrance Guide server/draft pattern:

- Metadata from `getDynamicFetchOptions()` and `getAboutPageMetadata()`, with fallback title/description, `en_ZA` and approved editorial Open Graph type.
- Fetch `getAboutPage(options)` and `readCart()` in parallel.
- Do not import Shopify catalogue/product presentation helpers.
- Render `AboutTemplate` with About current and real cart total.
- Suspense fallback is light Sage, `aria-busy`, non-focusable and contains no false heading/content.

### 6. Storybook and tests

Storybook:

- Add approved desktop/mobile; all-images-present geometry; no-image text-first; one image; alternating partial images; long/max content; partial/unavailable Sanity.
- Add Navigation `CurrentAbout` desktop and mobile-open evidence.
- Use deterministic, test-only 480×640/3:4 SVG/data fixtures in story/test code. Do not use Shopify fixtures, Figma screenshots or `public/` assets.
- Assert outer and inner bounds, centered horizontal offsets, 3:4 inner ratio, `object-fit: contain`, no `object-cover`, exact surfaces, no Role labels/dark class, CTA/current state.

Vitest:

- `editorial-pages.test.ts`: exact fallback, fixed role order, partial/missing/duplicate/unknown roles, media eligibility, center focal default, unavailable/metadata, Fragrance Guide regression.
- `storefront-templates.test.tsx`: hierarchy, source order, surfaces, layout classes, outer 4:3/inner 3:4 contract, FIT class/style, missing-slot collapse, CTA/current/cart.
- `navigation.test.tsx`: About-current/Shop-default only if not already adequately protected.
- `design-tokens.test.ts`: Bone/Sage mapping and no raw/dark/elevated misuse.

Playwright `tests/e2e/about.spec.ts`:

- Exact fallback content, headings/CTA, About current desktop/mobile, metadata, cart semantics and no catalogue request.
- Computed surface sequence.
- Mobile DOM order and desktop visual alternation via bounding boxes without fixed heights.
- At 1440 reference, image fixture evidence (through Storybook or integrated fixture only if existing test infrastructure supports it) proves 560×420 slot, 315×420 centered artwork and contain. At 390, prove 350×262 and 196.5×262. Do not create a production test route just to inject images.
- At 320, prove 20px margins, 280×210 slot, centered 157.5×210 portrait, no scroll/crop and natural CTA wrapping.
- Axe, keyboard/focus/current state, console errors, relevant failed requests and `/api/health`.
- Run Fragrance Guide E2E regression.

### 7. Documentation, roadmap, review, commits

Create/update `docs/features/about-page.md` with exact authority, correction record, copy, surfaces/type/grid, role/rights authoring, 4:3 slot versus centered 3:4 FIT artwork diagrams/values, fallbacks, state matrix, accessibility, evidence, rollback and synchronization matrix.

Update `docs/features/sanity-editorial-pages.md` for shared schema versus About role/media differences.

Reconcile `docs/planning/roadmap.md` only after evidence:

- mark About runtime/schema/Storybook implemented only after green local gates and commits;
- leave actual Preview unchecked until an exact Vercel Preview is verified;
- leave final photography and Sanity document/publication as human gates;
- replace immediate action 3 with truthful Preview/editorial follow-up, not launch completion.

One storefront engineer owns all writes and commits on this task branch. Recommended buildable commits:

1. `Add Sanity About editorial contract`
2. `Build corrected About portrait experience`
3. `Document and verify About page delivery`

Fix independent review findings and commit them before handoff. Do not merge. Final implementation handoff should have a clean working tree except explicitly preserved unrelated operator files.

## Exact file ownership

### Add

- `src/app/(website)/about/page.tsx`
- `tests/e2e/about.spec.ts`
- `docs/features/about-page.md`

### Modify

- `DESIGN.md`
- `.impeccable/design.json` (minimal synchronized About metadata; do not duplicate Bone)
- `src/app/globals.css`
- `src/app/design-tokens.test.ts`
- `src/components/templates/storefront-templates.tsx`
- `src/components/templates/storefront-templates.stories.tsx`
- `src/components/templates/storefront-templates.test.tsx`
- `src/components/navigation.stories.tsx`
- `src/components/navigation.test.tsx` only if focused current-state coverage is necessary
- `src/sanity/schemaTypes/editorial-page.ts`
- `src/sanity/lib/queries.ts`
- `src/sanity/lib/editorial-pages.ts`
- `src/sanity/lib/editorial-pages.test.ts`
- `src/sanity/extract.json` (generated)
- `src/sanity/generated.ts` (generated)
- `docs/features/sanity-editorial-pages.md`
- `docs/planning/roadmap.md` only to match delivered evidence

### Read-only/preserve

- `specs/1bf52a6e_about-page-brief.md`
- `specs/1bf52a6e_about-page-implementation.md`
- `specs/1bf52a6e_about-page-implementation_v2.md`
- context packet/screenshots/structured capture
- Figma frames themselves
- `src/components/navigation.tsx` unless a proven current-state defect requires change
- Fragrance Guide route behavior
- `src/lib/shopify/**`
- `public/**`
- unrelated operator changes

## State matrix

| State                          | Required behavior                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Published                      | Published title/lead/four roles/eligible portraits/SEO in fixed order, About current, live cart count.  |
| Draft                          | Authenticated draft/Visual Editing uses draft values; public remains published.                         |
| No document/unconfigured       | HTTP 200 exact fallback, four text chapters, no slots/images, CTA and fallback metadata.                |
| Partial text/missing role      | Fallback only for missing field/role; valid authored values remain; fixed four-role order.              |
| Duplicate/unknown/out-of-order | Studio blocks valid publish; runtime selects one per known role, ignores extras and orders canonically. |
| Eligible image                 | 4:3 slot with centered full-height 3:4 artwork using contain/FIT; whole portrait visible.               |
| Missing/ineligible image       | Entire slot/gap removed; centered max-760px desktop text; no substitute.                                |
| Missing/invalid focal          | Center FIT; no crop/pan to fill.                                                                        |
| Sanity unavailable             | Bounded secret-free diagnostic; exact fallback content/metadata.                                        |
| Long content                   | Owning section expands; no clamp/fixed-height clipping.                                                 |
| Cart failure                   | Existing safe cart behavior; About remains independent; no invented quantity.                           |

## Accessibility and extremes

- Exactly one H1 and four ordered chapter H2s plus semantically correct CTA heading; no hierarchy skips introduced.
- H2/body/image source order for all viewports; desktop visual ordering does not change screen-reader order.
- CTA is a real anchor; About has `aria-current="page"`; visible focus, mobile menu focus trap/Escape/restore and 44px targets remain.
- Whole portrait visible with factual alt; no identity inference; image absence loses no meaning.
- WCAG AA on Sage/Bone and all interaction states; no colour-only meaning; axe zero violations for WCAG 2 A/AA and 2.1 A/AA.
- 320px/200% zoom: 20px margins, no overflow, clipping, crop, overlap or fixed-height loss; portrait remains 3:4 centered in 4:3 slot.
- Long fixtures: 100-char H1, 320-char lead, 90-char H2s, near-1200-char bodies with paragraphs, long collaborator text, all/one/alternating/no portraits. Avoid meaningless repeated characters as sole evidence.
- No new motion; reduced-motion behavior is unchanged.

## Acceptance criteria

1. `/about` renders exact verified fallback copy, one H1, four ordered chapters, exact Fragrance Guide CTA, About-current Navigation and existing cart truth.
2. Desktop/mobile match `316:99`, `316:151`, and corrected handoff `316:198` for topology, type, surfaces, alternation, responsive order and CTA, with documented browser/font tolerance only.
3. Intro Sage; chapters Bone/Sage/Bone/Sage; CTA Bone via canonical tokens. No Midnight, arbitrary colour, invented alias, elevated/control/feedback misuse, gradient or unapproved shadow.
4. Every eligible media layout uses a 4:3 outer slot and centered 3:4 full-height artwork with FIT/contain: 560×420 + 315×420 desktop; 350×262 + 196.5×262 mobile; responsive 280×210 + 157.5×210 at 320px.
5. No crop-to-fill, stretch, `object-cover`, 4:3 artwork, visible slot placeholder, Role labels, Figma/provisional/Shopify image, or public test asset appears.
6. Missing/ineligible images independently remove slot/gap and center text max 760px without changing other chapters.
7. Sanity additively enforces stable About roles and rights/alt/focal authoring, preserves Fragrance Guide, regenerates types and handles draft/published/missing/partial/unavailable deterministically.
8. Metadata uses correct perspective and exact fallbacks; public content never leaks drafts.
9. About uses no Shopify catalogue helper/data and changes no Shopify boundary; only existing cart summary is displayed.
10. Storybook covers approved desktop/mobile, FIT geometry, no/partial images, long/max and unavailable/partial states, CurrentAbout and automated interaction/style assertions.
11. Vitest covers canonical tokens, Sanity roles/media/fallbacks, template hierarchy/order/FIT/fallback/CTA/current state and Fragrance Guide regression.
12. Playwright covers exact content/surfaces/current nav/CTA, desktop alternation/mobile source order, corrected geometry where fixture infrastructure allows, 320px, metadata, accessibility, console/network and health; Fragrance Guide remains green.
13. DESIGN/sidecar/runtime/schema/generated/component/Storybook/docs/roadmap are synchronized and cite `316:198`; earlier plans remain immutable records.
14. Deterministic full local gates pass, Impeccable has no blocking finding, independent quality review is resolved/accepted, and feature changes are committed on the task branch.
15. Handoff is Preview-ready with final SHA/evidence. Actual Vercel Preview must be independently verified before human merge; no agent merges, publishes, deploys production or rolls back.

## Deterministic verification

Judge commands by exit status.

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

Review ownership/generated/commit evidence:

```bash
git diff -- src/sanity/extract.json src/sanity/generated.ts
git diff -- DESIGN.md .impeccable/design.json src/app/globals.css
git diff -- src/lib/shopify public
git status --short
git log --oneline --decorate -10
```

Expected before commit: intentional generated/design diffs and empty Shopify/public diff. Expected final handoff: feature commits present and no uncommitted implementation files. Regenerate schema/types after the last schema/query change.

## Visual, independent-review, and Preview evidence

### Local/Storybook

- Record story IDs/screenshots for approved desktop/mobile, all FIT portraits, no image, partial images and long content.
- Compare at 1440×3394 and 390×3632. Use structured/corrected geometry, not old 4:3-fill wording.
- Capture bounding-box evidence for outer slot, inner portrait and equal side breathing room; allow ≤1px/subpixel tolerance. Assert `object-fit: contain` and absence of `object-cover`.
- Inspect 320px, 200% zoom, colours, source order, text-first max width, focus/current state and no `.dark`.
- Product designer provides read-only comparison and explicitly closes the former aspect conflict against this plan.
- Quality reviewer independently checks all acceptance evidence, generated/schema/rights/Shopify boundaries, accessibility, console results, roadmap claims and commit cleanliness. Fix and commit findings.

### Preview

Handoff must identify final commit SHA, commands, story IDs/screenshots and untested external states. If a Vercel Preview exists, browser release debugger records URL/deployment/SHA/timestamp and runs:

```bash
curl --fail --silent --show-error "$PREVIEW_URL/api/health"
PLAYWRIGHT_BASE_URL="$PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/about.spec.ts tests/e2e/fragrance-guide.spec.ts --project=chromium --project=mobile
```

Retain desktop/mobile/320 screenshots, public published/fallback and authenticated draft evidence, metadata, About current/CTA/cart, FIT/no-crop geometry, console/network/health, unavailable Sanity fallback and proof of no Shopify catalogue/final image use. If no Preview is produced, report “Preview-ready” accurately; merge stays blocked until exact Preview verification.

## Specialist routing and skills

### Typed routing

- **Implementation owner:** `storefront_engineer` — only writer and commit author for UI, route, Storybook, additive Sanity boundary, tests/docs on one branch/PR.
- **Advisors:** `product_designer` read-only for corrected FIT comparison; `browser_release_debugger` read-only for Preview/runtime evidence.
- **Review owner:** `quality_reviewer` for independent substantive review.

### Skills

- **`feature-brief`:** exact prior brief/copy plus corrected handoff define outcome, states and exclusions; no remaining product decision blocks text-first implementation.
- **`impeccable`:** responsive hierarchy, precise FIT geometry, typography, accessibility, content extremes and bounded visual comparison.
- **`design-to-storybook`:** required for Figma/capture → DESIGN/sidecar → canonical token → component/Storybook synchronization and comparison matrix.
- **`sanity-content-change`:** required for additive schema/GROQ/generated/application types, rights authoring, draft/published/fallback and regression coverage.
- **`quality-gate`:** criterion/evidence mapping, full tests, independent diff/generated/security/roadmap/commit review.
- **`release-debug`:** actual Preview/runtime/draft/Sanity verification; no authority to deploy production/rollback.
- **`shopify-storefront-change`:** not triggered; stop for new scope if any Shopify modification seems necessary.
- **`parallel-agent-worktrees`:** not triggered; exactly one writer/branch/PR. Use only with explicit human-approved topology change.

## Human gates

| Gate                        | Evidence                                                                                                                   | Human action                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Design implementation       | Open: corrected packet/plan confirms Approved frames and FIT geometry; no new approval needed.                             | Reapprove only a proposed divergence.                                     |
| Actual image rights/content | Complete Sanity record, factual alt/focal, source/owner, territory/expiry/releases and draft Preview. No final images now. | Human verifies rights/identity/copy and publishes or leaves draft.        |
| Independent review          | Green local evidence, captured comparison, corrected geometry proof, clean committed diff.                                 | Quality reviewer reports; human accepts only explicit residual deviation. |
| Merge                       | Green CI, exact Vercel Preview, independent review, reviewable commits.                                                    | Human approves/merges; agent never merges.                                |
| Sanity publish              | Valid document/final copy/SEO/rights and draft/public comparison.                                                          | Human publishes/schedules/unpublishes.                                    |
| Production                  | Protected main, successful deployment, health/smoke/logs.                                                                  | Human authorizes when required; no direct agent deploy.                   |
| Rollback                    | Impact, failing SHA/deployment/content revision, named known-good target.                                                  | Human authorizes Vercel rollback or content restore/unpublish.            |

## Rollback

- Prefer human Sanity revision restore/unpublish when code is sound; exact text-first fallback remains available.
- Schema changes are additive; no destructive migration. Old code ignores new role/image metadata; Fragrance Guide retains current behavior.
- Application rollback requires named deployment/SHA and human authorization. Pre-feature rollback restores known dangling `/about` 404, so content rollback/forward fix is preferable when possible.
- Revert route/template/canonical token/schema/generated contracts coherently; never leave old 4:3-fill docs/tests, raw colour patch, stale generated types or false roadmap state.
- Do not execute merge, publication, production or rollback.

## Residual risks

- Final image rights, identity, 3:4 source rendition and legal records remain human/external; initial page may be entirely text-first.
- Rights fields record assertions, not legal proof.
- Shared schema conditional validation can regress Fragrance Guide if scoped incorrectly.
- FIT preserves the whole image, but supplied non-3:4 assets may letterbox further inside the portrait wrapper; authoring validation/publication review must require an approved 3:4 rendition.
- Sanity hotspot is safety metadata under FIT, not a crop tool; future maintainers could incorrectly switch to cover unless tests/docs protect it.
- Homepage/About independently editable copy can drift.
- Captured packet files still contain stale `316:196` metadata in places; this plan/user direction resolves repository authority to `316:198`, but builders must avoid copying stale references into durable docs.
- Protected Preview/draft access may block remote checks; missing evidence keeps merge closed.
- Browser subpixel sizing (196.5px/157.5px) requires tolerance rather than integer-forcing stretch.
- Pre-feature rollback reintroduces `/about` 404.

## Completion handoff

Report commit SHAs, changed files, command exit status, story IDs/screenshots, bounding-box FIT evidence, product-designer verdict, quality-review findings/fixes, deviations, Preview URL/deployment/SHA or accurate Preview-ready status, unpublished/no-final-photo state, roadmap status, untested external states and residual risks. Stop before merge, Sanity publication, production or rollback.
