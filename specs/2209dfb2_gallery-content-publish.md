# Gallery campaign and market content plan

## Objective and delivery shape

Extend the in-progress, approved `/gallery` work without replacing it: publish four approved full-scene campaign images from `images-for-gallery/gallery-final-candidates/` and five retained documentary market/event photographs from the root of `images-for-gallery/`, then render the documentary set as a separately headed **In the Market** grid below the existing polished campaign grid.

Use one delivery branch and one pull request. `content_commerce_engineer` is the only implementation writer because the critical path is the Sanity schema/query/generated-type/content-publication boundary; that owner also makes the bounded Gallery UI/Storybook updates in sequence. `product_designer` is a read-only advisor for the new section hierarchy, mixed-aspect responsive grid, and Figma/Storybook review. `browser_release_debugger` is a read-only advisor for the configured Sanity/Vercel runtime and published-perspective verification. `quality_reviewer` independently reviews the completed implementation. Do not create a second writing agent or split this into concurrent branches.

The current checkout is already the primary worktree on `agent/gallery-page` and contains substantial uncommitted Gallery implementation and evidence plus untracked source imagery. Two other Treehouse worktrees are leased to unrelated `account-entry` and `dev-servers` tasks. Continue only in this checkout, preserve every existing modification and untracked file, and apply `.agents/skills/parallel-agent-worktrees/SKILL.md` for collision awareness. Do not reset, clean, stash, rebase, switch branches, return worktrees, or overwrite the earlier Gallery evidence. If another writer claims any file listed below, stop and resolve ownership with the engineer rather than merging edits implicitly.

## Blocking human decisions and gates before implementation

The four campaign assets are user-approved, but the new market section is not yet represented in the approved Gallery Figma frames. Repository writing for this extension is blocked until the following are confirmed:

1. **Design gate:** a human product/design owner approves an addendum to the existing Gallery direction for desktop and mobile populated states, including the **In the Market** H2, spacing between grids, mixed-aspect behavior, item heading hierarchy, each grid's viewer scope, 1440/390/320 layouts, and campaign-only/market-only/missing-content behavior. The product designer must record exact Approved Figma frame links/node IDs in `docs/features/gallery-figma-capture.md`. Current operations policy forbids an agent from attempting Figma MCP access, so a human/product designer must supply this capture; do not infer final responsive geometry.
2. **Asset-selection gate:** the content owner confirms that the five files listed below are exactly the “retained market/event photographs.” This list is inferred from visual inspection and the prompt's exclusion of brochure pages; if it is not exact, update the manifest before upload and do not substitute another root image silently.
3. **Editorial/legal gate:** a human owner approves the final title, caption, factual alt text, order, source/owner, territory, rights duration/expiry, release status, and licence reference for every asset. The market photographs include recognizable people and one framed contact-details sign, so model/property release and privacy suitability must be decided explicitly. User approval of visual selection is not by itself evidence of publication rights.
4. **Existing-document gate:** an authorized editor inspects the configured Sanity dataset and confirms whether exactly one `editorialPage` with slug `gallery` already exists, whether it has a draft/published version, and whether publication would include unrelated draft edits. Publishing is document-wide; do not overwrite scalar copy, section keys, or unrelated existing sections without an approved before/after diff.

Missing any approval is a blocker. The implementation agent cannot grant design, rights, editorial-publish, merge, production, or rollback approval.

## Source and content manifest

### Included campaign sources, authored order

| Order | Source | Proposed title | Factual alt text | Proposed visible caption |
| ---: | --- | --- | --- | --- |
| 1 | `images-for-gallery/gallery-final-candidates/blanc-de-blanc-travertine.png` | Blanc De Blanc — Travertine Light | Blanc De Blanc reed diffuser with black reeds on a travertine plinth in warm sunlight. | Blanc De Blanc composed against warm travertine and shifting light. |
| 2 | `images-for-gallery/gallery-final-candidates/bois-de-santal-emerald.png` | Bois De Santal — Emerald Study | Bois De Santal reed diffuser with black reeds on a green marble plinth against emerald panelling. | Bois De Santal set against emerald panelling and green marble. |
| 3 | `images-for-gallery/gallery-final-candidates/santuaire-serein-botanical.png` | Santuaire Serein — Botanical Light | Santuaire Serein reed diffuser with black reeds on pale stone among green leaves beside a sunlit window. | Santuaire Serein framed by soft daylight, pale stone and botanical greens. |
| 4 | `images-for-gallery/gallery-final-candidates/santuaire-serein-library.png` | Santuaire Serein — Library Study | Santuaire Serein reed diffuser with black reeds on a polished wooden desk beside leather-bound books and green curtains. | Santuaire Serein in a warm library setting of polished wood, books and deep green fabric. |

### Candidate retained market/event sources, authored order

| Order | Source | Proposed title | Factual alt text | Proposed visible caption |
| ---: | --- | --- | --- | --- |
| 1 | `images-for-gallery/WhatsApp Image 2026-08-08 at 18.07.20.jpeg` | At the Indoor Market | Wide view of an Infusion Diffusion market stall with gold-covered tables, product boxes and visitors inside a hall. | The Infusion Diffusion stand among neighbouring makers at an indoor market. |
| 2 | `images-for-gallery/WhatsApp Image 2026-08-08 at 18.11.01.jpeg` | The Market Table | Infusion Diffusion display table with boxed reed diffusers, white vessels and red flowers, with a person behind the stall. | A market display bringing together boxed diffusers, display vessels and floral detail. |
| 3 | `images-for-gallery/WhatsApp Image 2026-08-08 at 18.11.02 (10).jpeg` | Blanc De Blanc at Market | Blanc De Blanc reed diffuser and kraft box on a wood slice beside a framed product card and flowers. | Blanc De Blanc presented with its packaging and fragrance story at the market table. |
| 4 | `images-for-gallery/WhatsApp Image 2026-08-08 at 18.11.02 (11).jpeg` | The Collection on Display | Several Infusion Diffusion reed diffusers and kraft boxes arranged on a patterned market table beside a framed brand sign. | A selection of Infusion Diffusion fragrances arranged for market visitors. |
| 5 | `images-for-gallery/WhatsApp Image 2026-08-08 at 18.11.02 (12).jpeg` | A Table of Fragrance | Infusion Diffusion reed diffusers and kraft boxes displayed on round wood slices with flowers and branded notebooks. | The collection displayed across natural wood stands with flowers and brand materials. |

These words are a factual, non-identifying baseline, not publish authority. The human editorial/legal gate must confirm product spelling, visible claims, people/privacy, event context, and every rights field. Do not add an event name, venue, date, person's identity, or “behind the scenes” claim without source evidence.

Explicitly exclude the root bottle studies (the unnumbered `18.11.02`, `(1)`, and `(6)`–`(9)` files), brochure pages `(2)`–`(5)`, `.DS_Store`, `derived-review/`, `figma-cutouts/`, `generated-backgrounds/`, and every rejected/non-final composite. Do not delete, rename, optimize, stage, serve, or upload those excluded user files. The source directory remains an input, not a public Next.js asset directory; Sanity's asset CDN owns published delivery.

## Acceptance criteria

1. The configured published Sanity perspective contains exactly one `editorialPage` with slug `gallery`; its approved page title/introduction/SEO content is preserved, and it contains the four approved campaign entries plus the five approved market entries in the manifest order, each with a stable `_key`, explicit `galleryGroup`, nonblank heading/body, Sanity image asset, factual alt text, and complete rights fields with `storefrontRightsConfirmed === true`.
2. A new additive `galleryGroup` section field supports only `campaign` and `market`, is clearly labelled in Studio, and is validated for Gallery sections without changing About's canonical role/order behavior. Existing legacy Gallery sections without the field continue to normalize as campaign items until an editor classifies them; unknown values are omitted rather than leaking into a grid.
3. A dedicated explicit Gallery GROQ projection includes group, image URL, alt, rights confirmation, hotspot/crop, and asset dimensions. Extracted schema and TypeGen output are regenerated from source; application normalization uses the generated query-result type rather than introducing another divergent raw response type.
4. `/gallery` keeps its existing H1, introduction, metadata, navigation/cart behavior, approved campaign-grid cadence, viewer behavior, empty/unavailable/loading states, semantic tokens, and unrelated Gallery work. Shopify gains no query, data copy, or behavior.
5. With both groups present, the campaign grid appears first and remains visually polished as approved. A semantic H2 with exact text **In the Market** introduces a separate documentary grid below it. The closing line follows all rendered grids. Each group preserves authored DOM/keyboard order and opens a viewer scoped to that group, so campaign position reads `Image N of 4` and market position reads `Image N of 5` rather than crossing the section boundary.
6. The approved market grid preserves each photograph's intrinsic aspect ratio using projected dimensions and stable responsive image geometry; it does not crop people, products, reeds, packaging, signage, or display context merely to force campaign cadence. It is one column at 390/320 and uses the human-approved desktop grid at 1440. There is no horizontal overflow at 200% zoom.
7. Heading levels remain coherent: one page H1; campaign item titles are H2s when the campaign has no visible section heading; **In the Market** is an H2 and its item titles are H3s. Grid sections have useful accessible labels without duplicating visible headings.
8. Every thumbnail remains a keyboard-operable real button with a factual accessible name and visible focus. Dialog focus containment, Close-first focus, Escape, exact-trigger restoration, written local position, honest disabled boundaries, 44×44 targets, image-failure fallback, and one-item navigation omission continue to work independently in either grid.
9. Missing content is deliberate: one valid group renders by itself; a missing market group omits its H2 and grid; a market-only state still shows the **In the Market** H2; invalid individual items are omitted without reordering valid siblings; no valid items uses the existing honest empty state; a bounded read failure uses the unavailable state. No Storybook fixture or excluded source asset appears in production.
10. Responsive `next/image` delivery uses Sanity CDN URLs, accurate `sizes`, width/height or equivalent stable aspect data, first-campaign-image priority only, and lazy loading for later campaign and all market images. Market WhatsApp compression and campaign source resolution are reviewed at 1×/2× rather than hidden by upscaling claims.
11. Storybook covers mixed populated content at desktop/390/320, campaign-only, market-only, group-level empty behavior, mixed intrinsic ratios, ten-item maximum, long/unbroken captions, malformed legacy caption, image failure, two independent viewers, first/middle/last boundaries, keyboard close/focus restoration, and reduced motion. Existing primitives are composed; no duplicate Dialog, Button, heading, token, or raw color is introduced.
12. Unit/contract tests cover group normalization, authored order, legacy/unknown grouping, rights and required-field omission, projected dimensions, total maximum of ten, group-level template semantics, viewer heading levels/local counts, and all prior Gallery behavior. Playwright covers fallback locally and the nine-item published journey on the exact Preview, including 1440/390/320, 200% zoom, keyboard flow, axe WCAG 2 A/AA and 2.1 A/AA, console/network errors, metadata, and `/api/health`.
13. An authorized human editor previews the complete draft and explicitly publishes it. A read-only post-publish query and the Vercel Preview prove four eligible campaign items and five eligible market items in the published perspective. No Sanity write token, read token, preview secret, revalidation secret, OAuth material, contact detail extracted from an image, or other credential appears in client JavaScript, committed files, screenshots, logs, commands, or evidence.
14. The final diff preserves all pre-existing modified/untracked Gallery work and unrelated user changes. Only the exact implementation/evidence files below change; excluded assets, Shopify files, dependencies, lockfiles, global tokens, and unrelated routes remain untouched.

## System ownership boundaries

- **Sanity:** owns page copy, group/order, captions, alt text, image assets/hotspots, dimensions, complete rights metadata, draft/published state, and editorial publication. The target configured dataset must be recorded in evidence; project documentation identifies `j222nd1i.production`, but the operator must verify the actual Preview dataset before publishing.
- **Next.js:** owns `/gallery`, metadata rendering, normalization into safe application types, group-level fallback behavior, responsive layout, image delivery hints, viewer interaction, and existing cart-count composition.
- **Storybook:** owns reusable `GalleryViewer` and integrated Gallery template contracts and meaningful states. Test fixtures remain clearly labelled and never populate Sanity.
- **Figma / `DESIGN.md`:** own the approved visual direction. Existing Approved Gallery frames remain authoritative for the campaign grid/viewer; a human-approved addendum is required for **In the Market**.
- **Shopify:** remains the source of commerce truth. This change does not touch catalogue, price, inventory, cart, checkout, customer, order, or webhook contracts; the existing cart count is merely preserved.
- **Vercel:** owns Preview build/runtime identity and `/api/health`. Production deployment is out of scope.
- **Human editor/legal owner:** owns rights confirmation, privacy/release suitability, final editorial copy, draft review, and the publish decision. Repository agents do not receive Sanity write credentials and do not publish.

## Applicable project skills

1. **`feature-brief`** — turns the content/UI request into observable group behavior, source ranges, failure states, ownership, approvals, tests, Preview evidence, and rollback.
2. **`impeccable` (`shape`, then bounded audit/polish)** — triggers because the new section changes an Experience-mode interface, responsive hierarchy, mixed-aspect layout, content extremes, and accessibility. Use one batched desktop/mobile inspection and at most one confirmation pass.
3. **`design-to-storybook`** — triggers for the Approved Figma addendum, semantic-token/primitives mapping, Storybook state changes, responsive screenshot comparison, and final Figma/`DESIGN.md`/sidecar/component/Storybook sync matrix.
4. **`sanity-content-change`** — triggers for the additive schema field, dedicated GROQ, generated schema/types, Studio preview, application normalization, draft/published checks, cache behavior, and secret boundary.
5. **`release-debug`** — triggers for the configured Vercel Preview, published Sanity perspective, browser/network/health evidence, cache propagation diagnosis, and rollback recommendation boundary.
6. **`quality-gate`** — required for acceptance-to-evidence mapping, schema/content checks, full repository gates, secret/unrelated-diff review, and residual-risk reporting.
7. **`parallel-agent-worktrees`** — applies because unrelated leased worktrees already exist and the current dirty checkout is the established delivery branch. Use it only to preserve isolation and detect collisions; do not allocate another writer/worktree.

`shopify-storefront-change` does not trigger because no commerce contract changes.

## Exact file and external-content ownership

Only `content_commerce_engineer` may write the following on `agent/gallery-page` after the gates above:

### Sanity schema/query/type boundary

- `src/sanity/schemaTypes/editorial-page.ts` — add `galleryGroup` options and Gallery-specific validation/Studio preview labelling while preserving About validation and the existing complete image-rights requirement.
- `src/sanity/lib/queries.ts` — add a dedicated explicit Gallery projection including group and image dimensions; leave other editorial projections behaviorally unchanged.
- `src/sanity/extract.json` — regenerate with `sanity:schema`; never hand-edit.
- `src/sanity/generated.ts` — regenerate with `sanity:typegen`; never hand-edit.
- `src/sanity/lib/editorial-pages.ts` — consume the generated Gallery query-result type, normalize campaign and market arrays, preserve legacy campaign behavior, omit unknown/invalid items, retain a ten-item total bound, dimensions, and existing fallbacks.
- `src/sanity/lib/editorial-pages.test.ts` — extend normalization tests for all group, dimensions, order, rights, maximum, and missing-content cases without deleting existing Contact/About/Gallery assertions.

### Gallery UI and route contract

- `src/components/gallery-viewer.tsx` — add the approved layout/heading-level variant and dimension-aware market rendering while preserving the existing Dialog/viewer API behavior and local viewer scope.
- `src/components/gallery-viewer.test.tsx` — extend component semantics, intrinsic-ratio, local-count, focus, failure, and boundary tests.
- `src/components/gallery-viewer.stories.tsx` — add mixed-ratio market and dual-section-relevant component states/play tests.
- `src/components/templates/storefront-templates.tsx` — split campaign and market composition, add the semantic **In the Market** section, and implement group-level absence behavior while leaving all non-Gallery templates untouched.
- `src/components/templates/storefront-templates.test.tsx` — add two-grid hierarchy/order, campaign-only, market-only, closing-line, and empty/unavailable regressions.
- `src/components/templates/storefront-templates.stories.tsx` — replace Gallery-only fixtures with clearly test-only split-group stories at approved widths and content extremes; preserve all unrelated template stories.
- `tests/e2e/gallery.spec.ts` — preserve fallback tests and add an explicit `GALLERY_E2E_MODE=published` path that fails unless the exact published nine-item contract is visible.

No route change is expected in `src/app/(website)/gallery/page.tsx`: its existing metadata, Suspense, cart read, and `<GalleryTemplate {...page}>` composition should accept the revised normalized props. If the approved implementation requires route changes, stop and update this ownership list before editing rather than making an incidental change.

### Design/content/evidence records

- `docs/features/gallery-page.md` — add the approved group/content contract, exact source-to-copy manifest, rights/publish checklist, intentional divergences, and final synchronization matrix.
- `docs/features/gallery-figma-capture.md` — append the human-supplied Approved market-section desktop/mobile nodes and comparison notes; do not alter the provenance of existing approved frames.
- `DESIGN.md` — add only the durable approved **In the Market** route extension and exact frame references.
- `.impeccable/design.json` — synchronize the Gallery narrative/component contract with `DESIGN.md` per the Impeccable workflow; preserve unrelated component data.
- `docs/features/evidence/gallery-content-local-1440.png` — new, generated after approval.
- `docs/features/evidence/gallery-content-local-390.png` — new, generated after approval.
- `docs/features/evidence/gallery-content-local-320.png` — new, generated after approval.
- `docs/features/evidence/gallery-content-preview-verification.md` — new sanitized record of Preview/runtime/publish evidence.

The authorized human editor, not the implementation agent, owns the external Sanity `editorialPage` document and nine asset uploads. Before editing, record the existing document ID, published/draft revision IDs, section keys/order, and a private JSON export or Sanity History recovery point. If no document exists, create exactly one through Studio; if duplicates exist, stop for human resolution. Reuse stable section keys and patch only approved fields. Do not commit Sanity tokens or a write-token import script.

Do not write to `images-for-gallery/**`, `src/app/globals.css`, `src/components/navigation*`, `src/lib/shopify/**`, dependencies, lockfiles, deployment configuration, cache-invalidation functions, or unrelated routes/tests. A need to touch them is scope drift requiring an updated plan and ownership review.

## Implementation and publication sequence

1. **Protect the current work:** capture `git status --short`, `git diff --name-only`, and `treehouse status`; identify the existing Gallery diff as the baseline. Coordinate with leased worktree owners if their branches touch template/generated files. Never use a destructive cleanup command.
2. **Shape and approve:** product designer supplies the decision-complete Figma addendum and critiques hierarchy, mixed aspect ratios, source/visual order, caption measure, zoom, focus, loading, and campaign-only/market-only states. Human design approval opens implementation.
3. **Confirm content:** human owner confirms the five retained market filenames and the table's copy/order. The authorized editor supplies complete rights/release records and confirms the exact target project/dataset and existing `gallery` document state.
4. **Sanity contract first:** add the additive group field and dedicated query, regenerate extracted schema/types, use generated results in normalization, and add contract tests. Preserve a ten-item total (the requested nine plus one spare) and all About behavior.
5. **Storybook-first UI:** implement approved campaign/market variants and dual-grid template stories. Obtain human responsive Storybook review before treating route integration as final.
6. **Integrate and harden:** update Gallery components/templates/tests and published-mode E2E behavior. Keep campaign visual geometry and viewer mechanics unchanged except where the approved group contract requires a parameter.
7. **Bounded visual verification:** run one combined 1440/390/320 local/Storybook pass, fix findings in one batch, and run at most one confirmation pass. Record differences against both the existing Gallery frames and approved addendum.
8. **Draft authoring:** through authenticated Studio, the human editor uploads only the nine included sources, updates or creates the single Gallery document with approved stable keys/groups/copy/rights, and previews the full draft. The implementation agent receives no write token.
9. **Independent review and CI:** quality reviewer checks every criterion, generated-file provenance, accessibility, secret/client bundle boundary, excluded asset list, current dirty-work preservation, and source/document diff. Push only after targeted and full gates pass; then require the GitHub `quality` check via `just pr-gate`.
10. **Preview and publish:** browser release debugger verifies the draft on the exact Vercel Preview. The authorized human editor then explicitly approves and publishes the complete Gallery document. Re-run read-only schema/document/count checks and the Preview test in published perspective; record cache timing rather than claiming success from draft mode.
11. **Stop at gates:** hand off the reviewable PR and published-content evidence. Human merge is separate. Because production deployment is out of scope, do not merge if merge automatically promotes production unless a human separately authorizes that production consequence. Never run a direct production deployment.

## Deterministic verification

Run from the repository root using the pinned Node release and judge every command only by exit status:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm exec sanity schemas validate --level error
corepack pnpm sanity:schema
corepack pnpm sanity:typegen
corepack pnpm exec vitest run --config vitest.config.ts src/sanity/lib/editorial-pages.test.ts src/components/gallery-viewer.test.tsx src/components/templates/storefront-templates.test.tsx
corepack pnpm test:stories
node .agents/skills/impeccable/scripts/detect.mjs --json
corepack pnpm exec playwright install chromium
corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium
corepack pnpm check
corepack pnpm test:e2e
git diff --check
```

After the authorized editor has published to the documented configured dataset, run the read-only content checks (the operator must confirm `j222nd1i.production` is still the intended target before using these exact overrides):

```bash
corepack pnpm exec sanity documents validate --project-id j222nd1i --dataset production --level error --yes
corepack pnpm exec sanity documents query '{"documents": count(*[_type == "editorialPage" && slug.current == "gallery" && !(_id in path("drafts.**"))]), "campaign": count(*[_type == "editorialPage" && slug.current == "gallery" && !(_id in path("drafts.**"))][0].sections[galleryGroup == "campaign" && defined(heading) && defined(body) && defined(image.asset) && defined(image.alt) && image.storefrontRightsConfirmed == true]), "market": count(*[_type == "editorialPage" && slug.current == "gallery" && !(_id in path("drafts.**"))][0].sections[galleryGroup == "market" && defined(heading) && defined(body) && defined(image.asset) && defined(image.alt) && image.storefrontRightsConfirmed == true])}' --project-id j222nd1i --dataset production --api-version 2026-07-01
```

The second command must return `documents: 1`, `campaign: 4`, and `market: 5`; any other result is a failed publish gate. Semantic caption/alt accuracy and rights cannot be reduced to counts and require the approved manifest plus human inspection.

After pushing the pull request and obtaining the exact Preview URL:

```bash
just pr-gate <PR_NUMBER>
curl --fail --silent --show-error "$VERCEL_PREVIEW_URL/api/health"
curl --fail --silent --show-error --output /dev/null "$VERCEL_PREVIEW_URL/gallery"
GALLERY_E2E_MODE=published PLAYWRIGHT_BASE_URL="$VERCEL_PREVIEW_URL" corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium
```

Pending, missing, skipped, cancelled, timed-out, or failed required checks are red gates. Manual browser review supplements rather than replaces these commands: keyboard-only navigation, Close/Escape/focus restoration in both viewers, 200% zoom, reduced motion, slow image loading, one failed image, source-order reading, alt/caption comparison, no horizontal overflow, and no console/network error.

## Preview, publication, and security evidence

`docs/features/evidence/gallery-content-preview-verification.md` must identify the commit SHA, PR, Vercel deployment ID/URL, browser, viewport, configured Sanity project/dataset, draft versus published perspective, Gallery document ID and before/after revision IDs, publication timestamp, and the human editorial approval record. Do not include credentials or private recovery exports.

Capture full-page 1440×1000, 390×844, and 320×844 screenshots with both grids; a viewer opened from each grid; Storybook design comparison; axe result; console and failed-network summary; `/api/health`; published count result; and whether cache/live-content propagation was immediate or delayed. Confirm all nine image requests use Sanity CDN delivery and that no excluded source path, `data:` test fixture, local `images-for-gallery` URL, token, or secret appears in HTML, client bundles, requests, screenshots, or committed evidence.

If published content does not appear, the browser release debugger follows `release-debug`: compare the Content Lake published `_updatedAt`/revision, actual Preview dataset/perspective, SanityLive/cache behavior, network response, and Vercel logs. Do not call the protected revalidation route directly, redeploy the Sync Tag function, or expose its secret. Production cache/function changes are not part of this task.

## Human approvals and release boundaries

- **Implementation:** human design approval of the exact Figma addendum and responsive/missing-content states is required before code changes for this extension.
- **Content/legal:** human confirmation of the five retained files, all final words/order, rights, releases, privacy, and source records is required before the content can be considered publishable.
- **Editorial publish:** an authorized human editor reviews the whole Gallery document diff in Preview and explicitly publishes or schedules it. Agents do not publish.
- **Merge:** a human approves and merges only after green required checks, independent quality review, published-perspective Preview evidence, and preservation of unrelated work. Agents do not merge their own delivery work.
- **Production:** direct production deployment is out of scope. If merge automatically promotes production, that consequence needs separate human authorization before merge.
- **Rollback:** an agent may collect impact and recommend the named code/content recovery target; only a human may authorize a revert merge, Vercel rollback, Sanity revision restore, correction, or unpublish.

## Rollback and recovery

The code/schema change is additive and has no destructive migration. The code recovery target is the last known-good Gallery commit/deployment before this extension; revert the single delivery PR if approved. Older code safely ignores `galleryGroup` and projected dimensions.

Before content editing, the human editor records the current published/draft revision and a private export/History recovery point. If only the new content is wrong, restore the prior Gallery revision or correct/unpublish the document as explicitly authorized; do not delete uploaded assets because they may be referenced elsewhere. If no prior document existed, unpublishing returns the route to its existing honest empty state. Record impact, URL, revision/deployment ID, timestamp, failing evidence, and recovery target before any rollback decision. Never perform production rollback or destructive content recovery without human authorization.

## Residual risks

- The five market/event filenames are inferred rather than explicitly named in the prompt; asset-selection approval remains a blocker.
- The current Approved Gallery frames do not include **In the Market**, and agent Figma access is prohibited pending provider approval. A human-supplied approved addendum is required.
- Market photos show recognizable people and a sign containing contact details. Publication may require model/property releases, redaction/crop, or exclusion; the repository cannot decide that legal/privacy question.
- Publishing one Sanity document can unintentionally publish unrelated draft edits. A whole-document before/after review and recovery revision are mandatory.
- Nine requested sections fit the existing maximum of ten, leaving only one spare. Any eligible pre-existing section or future expansion can breach the schema/runtime bound and requires a separate content-model decision rather than silent deletion.
- The four campaign PNGs are 1086×1448 and the market JPEGs are WhatsApp-compressed. Sanity transformations reduce transfer cost but cannot restore detail; high-DPI viewer softness and documentary compression remain possible.
- The campaign files appear composited/generated even though they are approved selections. Rights provenance, truthful product depiction, label spelling, and generated-background permissions still require human confirmation.
- Existing uncommitted Gallery work and concurrent unrelated branches can create integration conflicts in templates or generated files. Isolation prevents data loss but does not remove rebase/review risk.
- Preview and published evidence depend on the actual Vercel/Sanity dataset configuration and external service availability. Draft success is not proof of published success, and published Sanity content will not make the route available in production until separately authorized code deployment occurs.
