# Website master imagery — 18 September 2026

> **Released 19 September 2026:** PR106 is human-merged at `5f489a8`, main CI
> passed, and the approved Shopify/Sanity imagery is published and verified.
> The final carousel has three slides: six-family mosaic, gifting and Noir.
> Earlier six-slide and pending-publication notes below describe preparation.
> See [release closeout](website-imagery-release-2026-09-19.md) for final evidence
> and the remaining parent INF-31 scope.

Historical first-pass evidence. The subsequent gutter correction and expanded
responsive editorial imagery supersede the portrait-contain contract below.
See [current delivery](website-imagery-refresh.md). Square Shopify masters are
now active; portrait media remain attached for recovery and comparison.

The initial delivery used approved portrait masters with
black reeds and long gold tassels. The homepage draft adds a reading-corner
setting and Noir/Blanc diffuser–room-mist family portraits after the three
existing campaigns. No new products, bundle offers or availability claims
are introduced.

## Sources and mapping

Figma file `jIMvwSBkilg7eplo3IiHPa`: website collections `2813:2`, diffuser
masters `2806:2`, lifestyle/gifting `2809:2`. Source masters are in the existing
local delivery `output/photoshoot-2026-09-18/product-imagery-v2/masters`.

| Master           | Shopify product ID suffix | Existing handle              |
| ---------------- | ------------------------- | ---------------------------- |
| Blanc De Blanc   | 10067255394590            | home-decor-example-product-1 |
| Noir De La Nuit  | 10067255460126            | home-decor-example-product-2 |
| Santuaire Serein | 10067255492894            | home-decor-example-product-3 |
| Ambre Egyptian   | 10067255558430            | home-decor-example-product-4 |
| Bois De Santal   | 10067989987614            | bois-de-santal-200ml         |
| Ete Mystique     | 10068135641374            | ete-mystique-200ml           |

IDs use `gid://shopify/Product/`. Existing legacy handles are intentionally
preserved. All six masters are 1122×1402. Shopify CLI 4.8.0 and Admin API
2026-07 uploaded the images additively, waited for READY and reordered each
new image first. Final Admin and Storefront readbacks confirm all six featured
images and inherited variant images. Original media, product/variant IDs,
prices, taxable flags and inventory are unchanged. None of the variants had
an explicit media binding; no binding mutation was needed.

## Presentation and editorial state

ProductCard retains its square media geometry and uses contain fitting to
preserve the full portrait. Old production cover fitting can crop reeds until
this branch is merged. PDP already contains the full image. The six-slide
limit is synchronized across Studio, normalization, both carousel variants
and HomeTemplate. No tokens, motion timing, navigation or banner changes.

Sanity `drafts.siteSettings` contains six slides. Its first three slides are
identical to published content; all other settings are preserved. Published
`siteSettings` is unchanged. Editor publication must follow code integration
and review; publishing before the six-slide code is present would hide the
new additions behind the old three-slide limit.

The added slides are reading corner (`2809:6`), Noir family (`2815:5066`) and
Blanc family (`2815:8`). Copy links to the current diffuser range or fragrance
guide. Room mist imagery is editorial and does not imply checkout availability.

## Verification and recovery

Local evidence resides in `output/master-media-refresh-2026-09-18` in the
primary checkout; browser captures are in the delivery worktree's
`output/media-refresh`. Evidence contains public media and catalog fields,
not credentials. `shopify-admin-before.json`, `shopify-admin-after.json`,
`shopify-storefront-after.json`, `sanity-before.json` and
`sanity-final-readback.json` establish source state and preservation.

For Shopify recovery, use `shopify-rollback-variables.json` in the evidence
folder. For each product, call `productReorderMedia(id: productId, moves: moves)`
with the recorded original IDs and zero-based string positions. Poll the
returned job and independently verify featured media with Admin and Storefront.
Leave the newly uploaded files attached; no deletion is needed. Variants had
no explicit bindings before or after this delivery, so none need restoring.
Do not run rollback unless the named human approves recovery or explicitly
requests it.

Shopify catalog caches revalidate after 300 seconds and expire after 900;
a fresh page may briefly show a stale image while refresh runs. The Sanity
`/api/revalidate-tags` route prefixes `sanity:` and cannot clear Shopify tags.
No new webhook or secret was introduced. Verify the public Storefront API and
then refreshed page media before calling propagation complete.

For Sanity recovery, remove only the three new keys from the current draft
using a fresh revision guard; preserve any subsequent editor changes. The
published document has not changed. A future publication rollback must use a
fresh current revision and the recorded known-good content, not overwrite a
newer document blindly.

## Design synchronization

| Layer                          | State                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Figma source assets            | Synced; masters and family/lifestyle frames unchanged                          |
| Figma historical card capture  | Intentional divergence: portrait contain fit approved by Devon on 18 September |
| DESIGN.md / Impeccable context | Synced with six-slide and full-portrait contracts                              |
| Runtime semantic tokens        | Unchanged                                                                      |
| Components / Storybook         | Synced; six-slide and portrait-master states added                             |

Independent read-only design and content/commerce reviews found no code or
composition blockers. Local verification passed: 399 unit/integration and 364 Storybook tests, lint,
typecheck, formatting, Storybook build and Next build. The draft homepage was
inspected at 1440/768/390/320 with zero axe violations or overflow. All six
shop/PDP/Open Graph images match the final Storefront data. The new Ambre
image appears in a real cart and Shopify checkout; no personal details or
order were submitted. Further hosted evidence is recorded in
[PR106](https://github.com/djamestaft/infusiondiffusion/pull/106).
Devon approved the six-slide draft and full-image product-card framing on
18 September 2026. Editorial publication is authorized after human merge of
PR106; do not publish before that merge. Protected-branch merge remains human. INF-31's imagery scope is resumed; its remaining
factual/provenance requirements and INF-28 are not closed by this delivery.
