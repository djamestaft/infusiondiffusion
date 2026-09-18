# Master media refresh implementation plan

**Goal:** Use the six approved diffuser masters in Shopify and add three lifestyle/family campaigns to the homepage.
**Architecture:** Shopify remains the media authority for product cards, product pages, cart and Open Graph. Sanity owns ordered editorial slides. Existing product IDs, handles, variants, pricing and stock remain unchanged. Work on `agent/master-media-refresh` in Treehouse lease 19; implementation is sequential in this workspace.
**Spec:** User's 18 September request and Figma website pages 2813:2 / 2806:2 / 2809:2, file jIMvwSBkilg7eplo3IiHPa. Existing carousel frames 2650:2 / 2674:22. INF-31 imagery scope resumed; Shawnee preparation owner, Devon implementation and editorial decision owner; INF-28 factual approval remains open.

## Acceptance and constraints

- Keep all six 1122×1402 diffuser masters intact, including black reeds and long tassels. Preserve square product-card geometry and typography; change image fit to contain as an explicit photographic framing refinement for review.
- Preserve existing three published homepage campaigns. Append reading corner, Noir family and Blanc family, with neutral diffuser-range copy and internal actions. Family photography does not create purchasable room mists or bundles.
- Support up to six valid slides in schema, normalization, both carousel presentations and homepage template. Preserve translation, timing, accessible controls, reduced-motion and failure states.
- Snapshot Sanity published/draft separately and Shopify original media/order/variant bindings. Upload additively; preserve old media; revision guard Sanity changes. Sanity publication and Git merge remain human gates.
- No credentials or evidence containing credentials in Git. No production deployment. Review exact rendered desktop/mobile framing and copy.

## 1. Carousel and card contracts

- [x] Extend settings test to accept six complete slides, reject incomplete entries and truncate seventh.
- [x] Add manual next/wrap tests for six slides in plain/editorial presentations and HomeTemplate. Run targeted Vitest and confirm current three-slide truncation fails.
- [x] Replace five cap sites from three to six: `src/sanity/schemaTypes/site-settings.ts`, `src/sanity/lib/settings.ts`, both presentations in `src/components/hero-carousel.tsx`, `src/components/templates/storefront-templates.tsx`.
- [x] Preserve card square geometry; change `src/components/ui/product-card.tsx` image fit to `object-contain`. Verify computed style and full portrait in browser Storybook, not a unit test that repeats a class string.
- [x] Add six-slide Storybook states and an approved portrait-master product-card story with real public asset URLs. Regenerate Sanity schema/types.
- [x] Update DESIGN.md and carousel feature contract; identify fit refinement as intentional divergence pending visual sign-off.

## 2. Source content

- [x] Snapshot current Sanity published settings (no existing draft) and Storefront catalog. Six exact product titles map to local masters; retain legacy product handles.
- [x] Upload three approved editorial assets using authenticated Sanity CLI. Create draft from latest published document, preserve all existing fields and append unique keyed slides with revision guard. Verify only heroSlides changed.
- [x] Through authenticated Shopify Admin, snapshot original media/order/variant bindings, add each master, await ready, make featured and update applicable variant image. Read back product/variant images; preserve original commerce facts.
- [x] Admin session was reused after product-edit reauthorization. Contingency: if Admin session cannot be reused, prepare exact mapping and do not claim a Shopify update. Continue independent draft and code verification.

## 3. Review and delivery

- [x] Run targeted then all unit tests, lint, typecheck, Storybook tests/build and Next build. Inspect Storybook first, then real draft homepage at 1440/768/390/320; cycle 4→5→6→1, inspect full images, keyboard, console, axe and short screens.
- [x] Verify six product masters in cards/PDP and variant/cart, and Storefront Open Graph after actual Shopify update. Catalog cache revalidates after 300s/expires after 900s; Sanity endpoint cannot clear Shopify tags. Do not add a new webhook for this task.
- [x] Commit, push and open draft PR with preview evidence and residual limitations. Reconcile INF-31 roadmap wording without closing unrelated factual/provenance requirements.
- [x] Provide concrete review links before requesting the remaining named human publication/merge decisions.

## Delivery evidence

- PR: https://github.com/djamestaft/infusiondiffusion/pull/106
- Local read-only draft: http://localhost:3021
- Local production build: http://localhost:3020
- Local verification: 399 unit/integration tests, 364 Storybook tests, lint/typecheck, formatting, Storybook build and Next build passed.
- Draft homepage: 1440/768/390/320, all six campaigns and wraparound, no overflow or axe violations; black scrolled header verified.
- All six shop cards, PDP images and Open Graph URLs verified against final Storefront data; PDP axe checks returned no violations.
- One real cart drawer/page and Shopify checkout thumbnail verified against the Ambre master; no customer details, payment or order submitted.
- Independent read-only visual and content/commerce reviews found no blockers. Original media and commerce fields retained; published Sanity settings unchanged.
- Hosted preview/CI status is recorded on the PR. Devon approved slides and card framing on 18 September 2026; publication is authorized after human merge of PR106.
