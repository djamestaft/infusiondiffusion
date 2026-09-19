# Website imagery refinement — 18 September 2026

> **Released 19 September 2026:** PR106 is human-merged at `5f489a8`, main CI
> passed, and the approved Shopify/Sanity imagery is published and verified.
> The final carousel has three slides: six-family mosaic, gifting and Noir.
> Earlier six-slide and pending-publication notes below describe preparation.
> See [release closeout](website-imagery-release-2026-09-19.md) for final evidence
> and the remaining parent INF-31 scope.

Devon's follow-up replaces placeholder photography across Shop, Home, About,
Fragrance Guide and Contact using the new website asset library. It supersedes
the earlier approval of portrait contain fitting on square product cards.

## Acceptance

- Six true square diffuser photographs fill product cards edge to edge. Outpaint
  backgrounds; retain bottle identity, readable labels, complete black reeds,
  gold seals and long tassels. Preserve the portrait originals and old Shopify media.
- Compose desktop and phone hero photographs separately for Shop, Home statement,
  About, Guide and Contact. Keep headings as accessible HTML over quiet areas.
  Artistry uses a central, complete product composition suitable for both sizes.
- Refresh About campaign figures with products, gifting and collection imagery.
  Preserve documentary market images and source-owned copy.
- Keep desktop layouts, typography, semantic tokens, navigation and announcement.
  Phone authored heroes gain enough height and upper copy space to protect products.
  No new purchasable formats or implied bundles; Shopify owns commerce truth.
- Sanity owns optional editorial desktop/mobile media. Missing mobile artwork
  falls back to desktop. A single picture selects the source without downloading
  two hidden images. Failed photographs retain readable content.
- Place candidates in the website asset area of Figma, preserving Approved and
  previous delivery pages. Verify actual desktop/phone crops and text legibility.
- Shopify changes are additive with fresh snapshots and independent readback.
  Editorial drafts remain unpublished until review and the existing human merge gate.

## Delivery sequence

1. Generate and inspect six square outpaints and responsive editorial candidates.
2. Save sources/prompts locally and organize Figma candidates by website placement.
3. Add square Shopify media, verify product/variant facts and full-bleed card framing.
4. Build the responsive media contract and Storybook states before page integration.
5. Upload editorial assets and revision-guard drafts; preserve unrelated content.
6. Verify unit contracts, Storybook, build, desktop/phone pages and PR preview.

The design and content/commerce reviewers mapped ten editorial placements:
Shop hero; Home statement and Artistry; About hero plus four campaign figures;
Guide hero; Contact hero. The Shop banner is particularly shallow: its artwork
must retain the whole subject in the central crop. Gallery rights/provenance
validation remains in force. No new analytics are needed for an image replacement.

Source delivery: `output/photoshoot-2026-09-18/website-refresh-v1`.
Implementation remains on `agent/master-media-refresh`, PR106, Treehouse lease 19.

## Selected compositions and review

Figma candidates: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2835-2
Square masters: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2832-2

Selected assets are recorded in `website-imagery.fixture.json` for Storybook.
Phone About/Contact use the v3 portraits; earlier candidates remain in the local
delivery. Refined Figma rows are Contact `2842:2`, About `2842:5`, statement
`2842:8`; initial rows retain earlier candidates for comparison. At 320px the
first phone candidates placed copy over reeds, so the final compositions extend
quiet wall above a lower still life. About is 600px minimum, Contact 520px,
statement 600px and Shop 220px. Tablet About anchors left and statement right.

The About reader was missing the cache boundary required by the installed
next-sanity Cache Components implementation; its catch silently selected the
fallback. `getAboutPage` now uses the same cache boundary as other readers.
Actual draft browser readback verifies the new About source is selected.

## Source state and gates

All six square Shopify media are READY, featured and inherited by variants.
Admin before/after variant records match; originals remain attached. Independent
Admin/Storefront readbacks and source mapping are in `website-refresh-v1`.
The original six-slide draft remains intact. Added editorial drafts are
`drafts.website-imagery-{shop,about,contact,fragrance-guide}`; homepage images
live on `drafts.siteSettings`. Four campaign figures and their captions change
on `drafts.gallery`; market photographs stay unchanged. Published revisions
remain unchanged. No source credentials or product state enter client fixtures.

The earlier six-slide approval does not publish the expanded imagery. Review
these new compositions, merge PR106 through a human, then publish the relevant
Sanity drafts. No agent production deployment or merge is authorized.
For recovery, retain the before snapshots and reorder media using fresh state;
never delete old media or overwrite subsequent content edits. Do not run a
recovery mutation without the existing human recovery authorization.

## Verification

Browser evidence lives in the worktree's `output/media-refresh`; source evidence
lives in the root `output/photoshoot-2026-09-18/website-refresh-v1`.
Final commands and exact-head hosted evidence are recorded in PR106.
INF-31 remains In Progress: imagery does not close outstanding source facts,
INF-28 approvals, or launch publication gates.

Local verification passed: 410 unit/integration tests, 377 Storybook tests,
formatting, lint, typecheck, Storybook build and Next production build. Existing
About/Contact/Guide browser regression checks pass (32 across both projects).
The About test now asserts the five required named story headings instead of
assuming the optional CMS market gallery is absent.

All five draft routes were inspected at 1440/768/430/390/320px: selected sources
loaded, no horizontal overflow, no axe violations. All six shop/PDP/Open Graph
images match square Shopify masters. A temporary cart and hosted checkout showed
the new Ambre image; no order or personal data was submitted. Independent
read-only design and content-boundary reviews found no blockers.

Nonblocking composition limits: at tablet widths and in the narrow Shop banner,
some readable copy overlays imagery; the statement gift bag intentionally extends
past the right edge at 320px. Full diffuser silhouettes remain visible. These
candidates still require the human design/publication review described above.

Hosted visual review additionally exposed stega-encoded `galleryGroup` enum values
in Sanity draft responses: equality checks filtered out all campaign and market
figures. The normalizer now calls `stegaClean` on this logic-only field while
preserving visual-editing metadata on visible copy. A synthetic encoded-string
regression failed before the fix and passes afterward; unknown categories and
rights-unconfirmed images remain rejected. Hosted acceptance explicitly checks
all four campaign images and the five preserved market photographs, not just the
hero or zero accessibility violations.
