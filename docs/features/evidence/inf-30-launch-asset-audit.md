# INF-30 launch asset audit and photography brief

Status: Ready for owner review

Audit date: 7 September 2026

Catalogue observed: <https://infusion-diffusion.vercel.app/shop>

Audited production version: `200f745`

## Decision summary

The six launch products are present in Shopify and each has one 480 x 640
featured image. Those six images are visually the same brochure composites as
the repository's provisional Storybook fixtures; Shopify's copies differ only
by negligible export/compression changes. They are sufficient as temporary
catalogue media, but they are not an approved launch photography set.

The repository does not contain a licence, model/property release, photographer
credit, generation record, or written transfer of commercial usage rights for
the six brochure composites. Their creation method and rights therefore remain
**unverified**. Do not describe them as owned photography or approved generated
imagery until Devon supplies the source record.

The available owner-supplied WhatsApp images document real products and an
event display. They establish a useful product reference, but they do not form
a consistent six-SKU ecommerce set. Only Bois De Santal and Blanc De Blanc have
isolated bottle photographs, and only Santuaire Serein has a short series of
isolated close views. Those bottle photographs omit the reeds. The remaining
event images contain mixed products, people, signage, clutter, strong glare, or
uncontrolled crops.

Recommendation: commission one controlled six-SKU studio session for the
primary and detail set, then a separate room-led lifestyle session. Preserve
the current Shopify images until approved replacements have passed INF-31
preview and editorial approval.

## Per-SKU asset matrix

All current Shopify images are 480 x 640 PNGs and have generic generated alt
text in the storefront. `Rights` means the repository evidence available to
this audit, not a legal conclusion.

| SKU / current Shopify title | Current handle                 | Shopify featured image | Current classification                                                                           | Owner-supplied source available                                                                 | Launch gaps                                                                                                      | Rights     | Acquisition estimate                                                                                             |
| --------------------------- | ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Ambre Egyptian              | `home-decor-example-product-4` | `ambre-egyptian.png`   | Provisional brochure composite; generation method unverified                                     | Appears in event/group photographs only                                                         | Primary packshot, label/detail view, complete diffuser with reeds, room-led lifestyle                            | Unverified | Studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session                             |
| Blanc De Blanc              | `home-decor-example-product-1` | `blanc-de-blanc.png`   | Provisional brochure composite; generation method unverified                                     | Isolated bottle image `WhatsApp Image 2026-08-08 at 18.11.02 (1).jpeg`; event/group photographs | Consistent primary with reeds, detail view, clean crop, room-led lifestyle                                       | Unverified | Studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session                             |
| Bois De Santal              | `bois-de-santal-200ml`         | `bois-de-santal.png`   | Provisional brochure composite; generation method unverified                                     | Isolated bottle image `WhatsApp Image 2026-08-08 at 18.11.02.jpeg`; event/group photographs     | Consistent primary with reeds, detail view, clean crop, room-led lifestyle                                       | Unverified | Studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session                             |
| Ete Mystique                | `ete-mystique-200ml`           | `ete-mystique.png`     | Provisional brochure composite; generation method unverified                                     | Appears in event/group photographs only                                                         | Primary packshot, label/detail view, complete diffuser with reeds, room-led lifestyle                            | Unverified | Studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session                             |
| Noir De La Noit             | `home-decor-example-product-2` | `noir-de-la-noit.png`  | Provisional brochure composite; generation method unverified; image label uses “Noir De La Nuit” | Appears in event/group photographs only                                                         | Canonical naming decision, primary packshot, label/detail view, complete diffuser with reeds, room-led lifestyle | Unverified | Naming gate in INF-28, then studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session |
| Santuaire Serein            | `home-decor-example-product-3` | `santuaire-serein.png` | Provisional brochure composite; generation method unverified                                     | Four isolated close views `(6)`-`(9)` plus event/group photographs                              | Consistent primary with reeds, controlled reflections, detail view, room-led lifestyle                           | Unverified | Studio set: 20-30 min capture plus shared retouch; lifestyle: shared one-day session                             |

## Source and provenance inventory

### Shopify-owned runtime media

The live Storefront output supplies one featured image per product from
`cdn.shopify.com/s/files/1/0992/3723/2926/files/`. Each asset is 480 x 640.
Shopify remains the runtime owner for product media; approved replacements must
be uploaded there rather than duplicated into Sanity.

The current Shopify exports and the repository fixtures have the same
dimensions and near-identical pixels. Five sampled pairs have a mean absolute
RGB difference below 0.35 levels on a 0-255 scale; Santuaire Serein is 1.23.
This supports a shared visual source while avoiding a false byte-identical
claim. Shopify file metadata alone does not prove authorship or rights.

### Provisional brochure fixtures

`public/images/products/fixtures/` contains the six 480 x 640 images introduced
as provisional Storybook content. The recorded source is the owner's brochure
Figma file `1T7m9MfQoAHFiSVmSKVeVt`, with Hero Image nodes:

- Santuaire Serein `74:75`
- Ambre Egyptian `81:22`
- Blanc De Blanc `83:21`
- Ete Mystique `92:28`
- Noir de la Nuit `94:21`
- Bois de Santal `96:28`

The historical brief explicitly says these fixtures are provisional and not a
second commerce source of truth. Approval to use them in the product-card
design does not establish commercial image rights or launch approval.

### Owner-supplied documentary photographs

`images-for-gallery/` contains 15 WhatsApp JPEGs supplied to the repository:

- two wide/vertical event-overview photographs;
- two isolated bottle photographs: Bois De Santal and Blanc De Blanc;
- four isolated Santuaire Serein close views;
- three brochure-layout exports using current composite imagery; and
- four event/group/product-display photographs.

The photos are credible documentary references for the physical bottle,
packaging, label, tassel, cap and event presentation. Commercial web rights,
photographer identity, people consent, capture dates, and original files remain
unrecorded. Files containing identifiable people must not be published without
confirmed consent.

### Derived and generated review assets

The same folder explicitly labels four backgrounds as `generated-backgrounds`
and contains derived review composites/cutouts. These are review material, not
launch product media. No generated or derived review asset should enter Shopify
or an approved Figma customer frame without a source manifest, rights decision,
and Devon's explicit approval.

## Photography contract

### Primary packshot — required for every SKU

- One product, one front-facing label, complete diffuser with the approved reed
  count and arrangement.
- Same camera height, focal length, bottle scale, horizon and neutral surface
  across all six products.
- Capture at a native 4:5 or larger portrait composition with safe crop room for
  the storefront's square cards and product-detail media.
- Keep the full reed tips, bottle base, tassel and label clear of crop zones.
- Control specular glare while retaining believable black glass and gold-metal
  texture; labels and scent names must remain legible.
- Minimum final master: 2400 px on the short edge, lossless or maximum-quality
  source retained; export responsive web derivatives from the master.
- No baked-in marketing text, decorative smoke, invented ingredients, or
  product-shape alteration.

### Detail set — required for every SKU

- Straight label/name view.
- Cap, tassel and seal/material view.
- Packaging view, if the box supplied at launch is final.
- One scale/context view only after the actual packaged dimensions are
  confirmed.

### Lifestyle set — required at range level

- At least three approved room contexts across the range, with a named SKU in
  each frame and sufficient negative space for responsive editorial crops.
- Prioritize believable South African interiors and natural material detail.
- Avoid generic luxury props that imply unverified ingredients or benefits.
- Record location/property permission and any visible-person release.
- Lifestyle media supplements, and never replaces, the consistent primary set.

## Ownership, timing and gates

| Work                                                                                         | Responsible                                     | Estimate after products are ready                       | Human gate                                               |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Confirm asset authorship, licences, releases and permission to reuse current media           | Devon, supported by Shawnee                     | 0.5 day                                                 | Devon confirms the written source record                 |
| Prepare all six finished products, reeds and final packaging; approve canonical labels/names | Devon                                           | 1-2 days preparation; naming decision remains in INF-28 | Devon approves factual product identity                  |
| Capture six-SKU primary and detail set                                                       | Photographer / studio TBD; Shawnee coordinates  | One studio day                                          | Quote and expenditure require Devon approval             |
| Retouch, colour-match, crop and export                                                       | Photographer / retoucher TBD                    | 2-3 working days                                        | Devon approves masters before upload                     |
| Capture range-level lifestyle set                                                            | Photographer / stylist TBD; Shawnee coordinates | One shoot day plus 2-3 working days post-production     | Concept, location and expenditure require Devon approval |
| Upload accepted product media                                                                | Shopify operator under INF-31                   | 0.5 day plus preview verification                       | Separate Shopify mutation approval                       |
| Place accepted editorial media                                                               | Sanity editor under INF-31                      | 0.5 day plus source preview                             | Separate Sanity publication approval                     |

No monetary estimate is recorded because no supplier quote, location, styling
scope or licensing terms were supplied. INF-30 authorizes requesting quotes,
not accepting them or spending funds.

## Required source manifest for INF-31

For every accepted asset, record:

- stable asset ID and SKU(s);
- original filename and checksum;
- creator/photographer and creation date;
- whether it is photography, generated, composited or retouched;
- source files and transformation history;
- owner/licensor, territory, channels, duration and restrictions;
- model/property releases where applicable;
- approved role: primary, detail, packaging or lifestyle;
- crop/focal-point guidance and factual alt text; and
- Shopify or Sanity destination plus approver and approval date.

## Acceptance recommendation

Accept this audit as the INF-30 evidence baseline with three explicit open
gates:

1. Devon confirms or rejects commercial rights for the current brochure and
   WhatsApp assets.
2. Devon approves the photography contract and any quote before expenditure.
3. INF-28 resolves canonical product naming before labels, filenames, alt text,
   handles or new photography are treated as final.

Until those gates close, current media may remain live as a reversible holding
state, but must not be represented as final launch photography.
