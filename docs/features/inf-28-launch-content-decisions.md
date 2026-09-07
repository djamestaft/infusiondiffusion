# INF-28 launch content decision sheet

Prepared: 7 September 2026. Status: awaiting Devon's outstanding factual decisions.
Owner: Devon. Preparation: Shawnee / Codex. Downstream delivery: INF-31.

This sheet carries forward recorded approvals and separates them from missing
facts. It does not authorize Shopify edits, Sanity publication, purchases or
deployment. Existing content remains unchanged while decisions are pending.

## Evidence and acceptance

- Fresh base: protected `main` at `ada8fa8`; production health reported the same
  version on 7 September at 13:39 UTC.
- Read-only Shopify and published Sanity capture: 13:35 UTC, recorded in
  [the source snapshot](evidence/inf-28-launch-content-sources.json). Six products,
  one default variant each, no further catalogue page. Product GIDs identify
  records; actual SKU fields are null. No prices, stock or cart state are copied.
- Live Home, Shop, all six product routes, Contact, About, Fragrance Guide and
  Account returned HTTP 200. HTML content and titles were inspected; this is not
  a browser accessibility or interaction verdict. Streamed loading markup is
  not evidence of duplicate visible headings.
- Prior approval: [content and metadata corrections](content-metadata-corrections.md),
  recorded 2 September. No INF-28 comments superseded that record at capture.
- [INF-30 asset audit](evidence/inf-30-launch-asset-audit.md): owner-approved;
  PR #67 human-merged, required `quality` successful on `d79b673`.

Acceptance for this preparation: every launch product is identified; proposed
decisions cite observed content and exact owning fields; accepted, rejected and
unresolved decisions remain distinguishable; publication gates and remaining
source gaps are explicit. Completion of the sheet is not completion of INF-28.

## Recorded decisions carried forward

These are accepted in the 2 September record, not newly inferred approvals.

| ID  | Accepted decision                                                                                                                                                   | Owning source / observed delivery                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Canonical names: Ambre Egyptian; Blanc de Blanc; Bois de Santal; Été Mystique; Noir de la Nuit; Santuaire Serein.                                                   | Shopify product `title` and name references in its description/SEO. Live spelling/case corrections remain outstanding; exact size suffix is U1 below.                                                                                                                                                                         |
| A2  | Retain more than 130 oils, international sourcing, six fragrances, and guidance/encouragement from Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts. | Sanity `siteSettings.homepage.founderStory`; `editorialPage[slug.current == "about"].sections[role == "development" or "collaborator"].body`. Current About uses repository fallback because no matching published document was returned. Do not strengthen these into ingredient, origin-country or certification claims.    |
| A3  | Retain 200 ml and approximately 8–12 months under the stated conditions.                                                                                            | Sanity `siteSettings.homepage.longevityIntroduction` and `longevityConditions`; fallback in `src/sanity/types.ts`. Conditions: room temperature, airflow and reed-turning frequency affect diffusion. Home also contains fixed 200 ml / 8–12 month text in `storefront-templates.tsx`; synchronize any later approved change. |
| A4  | Contact is intentionally by email; use “Contact us by email.”                                                                                                       | Next.js `ContactTemplate`; Sanity `editorialPage[slug.current == "contact"]` page copy. Live Contact contains the approved wording. Mailbox identity is U7.                                                                                                                                                                   |
| A5  | Retain “Your account” as the H1; avoid repeated unavailable-state wording.                                                                                          | Next.js account/template presentation. Live HTML reports account access unavailable; this does not authorize account provisioning.                                                                                                                                                                                            |
| A6  | Exactly one trailing brand suffix in metadata.                                                                                                                      | Next.js `src/lib/metadata-title.ts` and route metadata. All inspected titles have a single suffix or the standalone Home brand title. Product SEO source fields are all null.                                                                                                                                                 |
| A7  | Defer shared founder fields until About work; preserve approved page-owned copy meanwhile.                                                                          | Sanity editorial ownership; existing fallback in `src/sanity/lib/editorial-pages.ts`. No schema consolidation in INF-28.                                                                                                                                                                                                      |

Rejected decisions: none recorded. Unresolved rows below must not be labelled
accepted until Devon supplies a decision; lack of a reply is not approval.

## Six-product naming and scent inventory

All observed titles end in ` - 200ml`. The canonical column carries A1; it is
not a proposal to overwrite Shopify from a display component. The notes below
are extracted from existing Shopify descriptions, not independently validated
ingredients or newly approved marketing copy.

| Product GID suffix / current handle               | Current title stem → accepted canonical name | Existing scent evidence and missing decision                                                                                                                                                                                                                          |
| ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `10067255558430` / `home-decor-example-product-4` | Ambre Egyptian → Ambre Egyptian              | Description spells “Ambré Egyptian.” Opening: mandarin, fruity notes; heart: muguet, jasmine; base: vanilla, tonka, sandalwood, amber sweetness and musk. Apply accepted unaccented name consistently.                                                                |
| `10067255394590` / `home-decor-example-product-1` | Blanc De Blanc → Blanc de Blanc              | Opening: bergamot, pink/black pepper, chamomile, clary sage, rosemary; heart: leather, orris, mimosa, freesia, almond; base: tonka bean, amber, sandalwood, white musk, vanilla. “Effortlessly Worn” and accessory language need a room-fragrance editorial decision. |
| `10067989987614` / `bois-de-santal-200ml`         | Bois De Santal → Bois de Santal              | Opening: cardamom, rose, sandalwood; heart: myrtle, jasmine; base: sandalwood, amber, vanilla. Description has joined heading/body text and “confidence and quiet confidence.”                                                                                        |
| `10068135641374` / `ete-mystique-200ml`           | Ete Mystique → Été Mystique                  | Opening: fig, bergamot, neroli, blackcurrant; heart: jasmine, tuberose, iris, cinnamon; base: amber, incense, musk, cedarwood, patchouli. Restore accepted accents in name references.                                                                                |
| `10067255460126` / `home-decor-example-product-2` | Noir De La Noit → Noir de la Nuit            | Description already says “Noir De La Nuit.” Opening: orange zest, bergamot, eucalyptus; heart: raspberry, saffron, neroli, clove bud; base: sandalwood, cedar, patchouli, amber.                                                                                      |
| `10067255492894` / `home-decor-example-product-3` | Santuaire Serein → Santuaire Serein          | Spa/bathroom/treatment-space positioning and soft finish, but no named scent notes. “Restorative” and wellness language are present, not newly substantiated claims. Do not infer notes from flowers or props in generated imagery.                                   |

## Outstanding decision matrix

Every row currently has status **Unresolved**. “Recommendation” is preparation
for Devon's decision, not permission to change a live source.

| ID  | Current evidence                                                                                                                                                                                               | Decision / recommendation for Devon                                                                                                                                                                                                                                                             | Exact owner and destination                                                                                                                                                                                                                                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U1  | Six titles have ` - 200ml`; `productType` is empty and all variants expose only `Title: Default Title`. Home calls them reed diffusers. A1/A3 already approve names and size.                                  | Confirm these six 200 ml reed diffusers are the launch range. Recommend `<canonical name> - 200ml` as Shopify title to preserve the current size convention; confirm `Reed diffuser` as product type.                                                                                           | Shopify `Product.title`, `productType`; existing `variants[].selectedOptions` remains untouched unless a separately approved option change is required.                                                                                                                                                                                           |
| U2  | Home and Fragrance Guide mention candles and room sprays; the observed catalogue contains only these six products.                                                                                             | Recommend diffuser-only launch messaging. Confirm whether sprays/candles are actually launch products before advertising them. Exact replacement copy belongs in INF-31 preview.                                                                                                                | Sanity `siteSettings.introduction`, `seoDescription`, `homepage.heroIntroduction`; `editorialPage[slug.current == "fragrance-guide"].sections[].body`; matching repository fallbacks in `src/sanity/types.ts`, `editorial-pages.ts`, template defaults; internal `PRODUCT.md` purpose if approved scope changes.                                  |
| U3  | Five descriptions list explicit notes; Santuaire Serein does not.                                                                                                                                              | Confirm the five existing note lists; supply Santuaire Serein's authoritative notes. Select 2–3 differentiating notes per product for a short summary in INF-31. Do not add a scent from imagery or another product.                                                                            | Shopify product description (Storefront read field `description`; editable Admin description body), optionally `seo.description`. No new metafield is assumed. Sanity guide may link the product GID, not become the product-description owner.                                                                                                   |
| U4  | Blanc has wearable-perfume wording; Bois repeats words; Santuaire has wellness/“restorative” language without explicit note evidence.                                                                          | Approve removal or exact replacement of those phrases while preserving the approved facts. Recommend room-fragrance wording without health outcomes. Existing copy is preserved until the specific replacement is accepted.                                                                     | The three identified Shopify product description bodies. INF-31 supplies before/after source previews; this sheet supplies no new benefit claims.                                                                                                                                                                                                 |
| U5  | Home says “Every fragrance lists its notes plainly” and promises clear care advice. Guide gives generic room advice; product “Care guidance” currently lists size/vendor rather than instructions.             | Supply approved reed count/setup/turning/placement and product safety instructions from the actual product documentation, plus any supported room-specific recommendations. Confirm A3 conditions remain applicable. No invented turning interval, room coverage or pet-safety claim.           | Shopify product description for product-specific instructions; Sanity guide `sections[].heading/body`, Home `guidanceIntroduction`, `guidanceSupportingText`, `serviceIntroduction`, `longevityConditions`. Rendered care label is Next.js `ProductDetailTemplate`.                                                                               |
| U6  | Inspected Home/Shop/product/support HTML contains no delivery, returns or policy destinations; Home says “Transparent delivery expectations.” Checkout/Admin policies were not audited.                        | Supply the actual approved delivery regions, charges/free-delivery conditions, dispatch/transit estimates, returns/damage process and destination URLs. If these already exist in Shopify, provide the exact policy sources. Do not infer “free shipping,” a delivery time or a returns window. | Shopify merchant delivery/refund policy records and operational shipping settings remain authoritative. Sanity owns concise editorial summaries; the current schemas have no dedicated policy/link fields, so INF-31 must map accepted source URLs and propose fields before implementation. Next.js shared footer integration follows INF-32/34. |
| U7  | Published Sanity and live Contact use `dione.smith@infusiondiffusion.co.za`; fallback is `hello@infusiondiffusion.co.za`.                                                                                      | Confirm the monitored launch mailbox and whether the fallback mailbox works. Recommend retaining the observed mailbox until a replacement is accepted. Confirm any public contact hours; no response-time promise is currently justified.                                                       | Sanity `siteSettings.contactEmail`; Next.js `safeContactEmail` fallback in Contact route and `fallbackSiteSettings.contactEmail`. Contact body remains in `editorialPage` with slug `contact`.                                                                                                                                                    |
| U8  | Sanity `siteSettings.brandName` is “Infusion Diffusions”; SEO and accepted brand direction say “Infusion Diffusion.” Shopify `vendor` is “InfusionDiffusion” and renders as Made by.                           | Recommend singular “Infusion Diffusion” for the Sanity brand name and spaced vendor display source. Confirm the merchant/producer attribution before changing `vendor`.                                                                                                                         | Sanity `siteSettings.brandName`; Shopify `Product.vendor`. Next.js metadata brand constant already uses the singular spaced name.                                                                                                                                                                                                                 |
| U9  | All six Shopify `seo.title` and `seo.description` are null; product route falls back to title and the first 160 description characters. Four handles are placeholder-style; two are established scent handles. | Recommend keeping all current handles for this launch correction. If a handle change is desired, name each old/new pair and require a redirect. Approve source-derived short SEO descriptions during INF-31, after U3/U4. A6 suffix normalization is already delivered.                         | Shopify `handle`, `seo.title`, `seo.description`; Next.js product `generateMetadata` remains a consumer. Verify redirects before any approved URL change.                                                                                                                                                                                         |

## Published content versus fallbacks

The queried published Sanity source returned `siteSettings` only for the requested
types/slugs. Its `homepage` contains hero slides but none of the requested prose
fields. No published About, Contact or Fragrance Guide document was returned.
Those routes currently receive their repository fallback copy; the live HTML
matched the inspected fallbacks. This observation is limited to the configured
project/dataset recorded in the snapshot, not every dataset or draft.

INF-31 must preview proposed Sanity documents and preserve the approved fallback
behavior. Do not describe fallback copy as already authored or published in
Sanity. New fields, documents, approved copy replacements and source publication
need a concrete handoff in that ticket.

## Devon's response and INF-31 handoff

Record a response per U-row as `Accepted`, `Rejected`, or `Unresolved`, with exact
chosen values/copy, supporting source where needed, approver and date. Partial
decisions are useful; carry unresolved facts forward explicitly. A1–A7 do not
need approval again unless Devon changes them or a conflicting record emerges.

INF-31 can prepare accepted material once its dependency gates close. Its source
preview must include the six product GIDs, before/after titles and descriptions,
approved notes and care guidance, policy URLs, mailbox, metadata, asset manifest
and any explicit redirect pairs. Export Shopify records before approved edits;
retain Sanity draft previews before human publication. INF-32 must use accepted
real content before the revised journey is final.

No runtime, schema, asset or live content change belongs to this decision-sheet
delivery. Rollback of this documentation means reverting its commit; no source
recovery is needed. Remaining risk: unknown factual inputs and final asset gaps
still block complete launch-content acceptance.
