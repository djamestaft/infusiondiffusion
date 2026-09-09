# INF-35 fragrance matching review

Status: Devon approved the exact rules and narrower first version on 9 September
2026: "Yes that is fine for now, we can adjust later." Implementation and verification
are in progress. Devon owns INF-35; Shawnee owns the
related INF-27 design/content contract. The coordinator is the sole repository
writer on `agent/inf35-fragrance-matching`; the content/commerce engineer audits
sources read-only.

## Outcome and scope

Help a customer compare the six launch reed diffusers using their preferences,
with a short, specific explanation and a working product link for each result.
Retain the approved Variation 02 questions and responsive composition unless
Devon approves a concrete revision. Do not treat illustrative Storybook rankings
as a product recommendation rule.

This increment implements the accepted mapping, scoring, tie behavior and
notes/character-only scope. The proposed rules below are now accepted, including
the three-result limit and unavailable-product handling. Final photography,
care/service facts and source publication
retain their existing deferrals. No new analytics, customer profile, stored
answers, AI-generated recommendation service or commerce backend is proposed.

## Baseline before matching implementation

`src/components/templates/fragrance-guide.tsx` defines five choice groups:
room, feeling, up to two note families, presence and time. All five currently
require answers; Continue displays a preference summary. Changing an answer
invalidates the reviewed state. Radio/checkbox semantics and first-missing-input
focus already exist. The separate card-by-card experiment's No preference option
is not part of this approved form.

The route `src/app/(website)/fragrance-guide/page.tsx` reads cart quantity and
Sanity metadata but supplies no product candidates. The optional shortlist prop
is a static design fixture, visible even before submission; it must not become
the runtime scoring contract. Its guessed product handles must not be reused.

## Proposed behavior for owner review

### Accepted first version: note and character matching

Devon accepted the source-backed first version based on question three only.
Room, feeling, presence and time would remain in the preference summary but would
not affect ranking until their mappings are approved. This is an accepted scope
choice: the introduction/result explanation
must say that suggestions use selected notes/character, rather than claiming all
five answers determine the shortlist. Further associations can be approved later
for a full five-dimension engine.

Approved primary associations receive 2 points per selected choice; secondary
associations receive 1. Sum the one or two selected choices, with no duplicate
points. Return only products scoring above zero, ordered by score descending,
then stable numeric GID ascending. Equal scores receive equal ranking under these rules;
the tie order is presentation only. Limit to three and say "Suggested fragrances"
rather than "Three fragrances ranked against the atmosphere you described."
The primary/secondary distinction below is an editorial proposal for approval,
not a measured finding of note dominance. Group labels mean either part of the
group can supply evidence (amber does not imply vanilla; musk does not imply incense).

| Fragrance        | Primary (2 points)            | Secondary (1 point)                                           |
| ---------------- | ----------------------------- | ------------------------------------------------------------- |
| Ambre Egyptian   | Amber & vanilla               | Citrus & fresh; Soft florals; Spice & woods; Incense & musk   |
| Blanc de Blanc   | Spice & woods                 | Citrus & fresh; Soft florals; Amber & vanilla; Incense & musk |
| Bois de Santal   | Spice & woods                 | Soft florals; Amber & vanilla                                 |
| Été Mystique     | Soft florals; Incense & musk  | Citrus & fresh; Amber & vanilla; Spice & woods                |
| Noir de la Nuit  | Citrus & fresh; Spice & woods | Soft florals; Amber & vanilla                                 |
| Santuaire Serein | Spa-like calm                 | None; named notes remain deferred                             |

"Spa-like calm" is a character/setting choice supported by Santuaire's supplied
description, not a named fragrance note. Keep that distinction in the explanation.
Other products do not gain this tag merely because their copy says calm.

Review examples, assuming all candidates can resolve to published products:

- Amber & vanilla: Ambre scores 2; Blanc, Noir, Bois and Été score 1. The three-card
  limit displays Ambre then Blanc and Noir by tie order; the latter two are not
  claimed to outperform the omitted tied products.
- Spice & woods: Blanc, Bois and Noir each score 2; all three are equal-score
  suggestions. Their display order is Blanc, Noir, Bois by numeric GID.
- Spa-like calm alone: Santuaire is the only suggestion; no filler cards.
- Soft florals plus Incense & musk: Été scores 4; Blanc and Ambre score 2 each;
  Bois and Noir score 1. Suggested order is Été, Blanc, Ambre.

Devon accepted this matrix, notes/character-only first version, explicit wording,
tie treatment, three-result limit and sold-out handling. The room, mood,
comparative presence and time associations remain future decisions.

### Shared implementation contract

1. Use a small deterministic, versioned editorial mapping keyed by Shopify GID.
   Resolve current product title, handle and availability through the existing
   server-only Shopify boundary. Sanity owns eventual editorial mappings and
   explanations; it must not duplicate prices or stock. Source publication is
   a separate gate, so the implementation brief must specify how an approved
   version is previewed without publishing new Sanity content.
2. Only approved product/answer associations contribute to ranking. An unknown
   association is unknown, not a negative match. Do not infer intensity from
   words such as lingering or infer room suitability from the product name.
3. Return up to three supported matches after valid submission. Never add
   unrelated products just to fill three cards. Explain the actual associations
   that contributed, without percentages or claims of a perfect match.
4. Equal scores receive equal ranking under these rules; a stable GID order may determine display
   order but must not be described as stronger suitability. No random rankings.
5. Missing/deleted products cannot produce links. Show current unavailable status
   for a published sold-out match, without presenting it as purchasable. A failed
   product/configuration fetch retains the preference summary and collection link,
   with a truthful unavailable state and no stale fabricated shortlist.
6. Changing an answer clears the old result until resubmission. Preserve answers
   for edits. Announce the new result state and provide a sensible keyboard focus
   destination. Handle zero, one, two and three results without fixed-count copy.

## Acceptance and verification required after approval

- Every association records source evidence and owner approval; Santuaire's
  deferred notes remain absent. Runtime values use stable identifiers rather
  than translated or display-label strings as rule keys.
- Unit checks exercise all 21 valid note combinations, equal-score stability,
  order independence for two note selections, invalid input, missing mappings,
  and explanation contributions. Golden examples come from Devon's accepted
  combinations, not the scoring implementation itself.
- Integration checks cover GID resolution, current handles, missing products,
  sold-out products, unavailable source/configuration and no commerce duplication.
- Storybook covers initial, invalid, result counts, tied results, long names,
  unavailable products and source failure. Designer reviews result-state changes
  against Approved frames 2172:2, 2457:601/749/897 and contract 2458:676 before
  implementation is treated as final.
- Playwright verifies real submission/edit/product-link journeys, keyboard and
  axe, reduced motion, zoom and no overflow at 1440/768/390/320. Preserve cart and
  metadata behavior. No paid order is included.
- Required local checks, exact-commit GitHub quality/PR gate, independent review,
  preview acceptance and human merge precede release. Reverting the integration
  restores the existing preference-summary/unavailable-recommendations behavior;
  no live source write needs reversal for this preparation.

## Dependencies and delivered baseline

Fresh protected main is `3e768c7`. PR #75 is human-merged and Contact is live;
post-merge main CI and production smoke checks passed. About and the preference
Guide are live from PR #74. INF-34 is Done. INF-27 and INF-31 remain actual Plane
dependencies of INF-35; matching approval and deferred source facts respectively
remain open. Their open state permits this preparation, not an unsupported full
release. INF-36 remains downstream.

## Source audit and limitations

Content/commerce engineer completed a read-only review on 9 September. The
[7 September source snapshot](evidence/inf-28-launch-content-sources.json) holds
the supplied descriptions and exact GIDs. The [INF-28 decision sheet](inf-28-launch-content-decisions.md)
and [INF-31 preparation](inf-31-launch-content-preparation.md) retain the factual
deferrals. Fresh production checks at 12:08 UTC returned 200 for all six product
routes and matched those descriptions after HTML/whitespace normalization. This
is rendered production evidence, not a fresh direct Shopify API export.
The public Sanity published Guide query returned no document; no published
mapping source was found. No external source writes were made.

| Fragrance        | Shopify product GID suffix | Observed handle              | Evidence supporting draft primary                                             |
| ---------------- | -------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| Ambre Egyptian   | 10067255558430             | home-decor-example-product-4 | Amber sweetness, vanilla and tonka                                            |
| Blanc de Blanc   | 10067255394590             | home-decor-example-product-1 | Pink/black pepper and sandalwood; primary priority needs editorial acceptance |
| Bois de Santal   | 10067989987614             | bois-de-santal-200ml         | Cardamom and repeated sandalwood emphasis                                     |
| Été Mystique     | 10068135641374             | ete-mystique-200ml           | Jasmine/tuberose/iris; explicit incense and musk                              |
| Noir de la Nuit  | 10067255460126             | home-decor-example-product-2 | Orange zest/bergamot/eucalyptus; saffron/clove and woods                      |
| Santuaire Serein | 10067255492894             | home-decor-example-product-3 | Supplied spa/bathroom/treatment-space positioning only                        |

Full IDs have prefix `gid://shopify/Product/`. Observed handles are evidence, not
constants to duplicate in the engine. Source refresh and current resolution remain
required for implementation. Existing Storybook slugs differ from these routes.

No supplied source maps the five current room choices across the range. Santuaire's
bathroom/treatment spaces are not among those choices. Mood prose offers candidates
but no approved answer matrix. Comparative diffusion strength/coverage has no
evidence. Ambre and Été evoke evenings, but this does not establish a complete time
matrix. Do not repurpose Blanc's wearable-perfume wording as home-fragrance proof.
The engine must not turn prose, images or product names into missing factual claims.

Verification for this preparation: source/route audit, current code and stories,
actual Plane dependencies, manual score examples, formatting and diff checks.
Implementation evidence is recorded below; the initial preparation itself made
no runtime change. Further content and source publication remain separate.

Independent read-only content review confirmed the draft associations and score examples.
Its corrections are incorporated: numeric-GID tie ordering, and equal editorial
ranking rather than a claim of equal sensory suitability.

## Implementation and verification

`src/lib/fragrance-guide/matching.ts` contains the exact accepted editorial
snapshot `2026-09-09-notes-v1`, with stable note IDs, GIDs, weights and evidence
phrases. It contains no price, stock, title or handle copies. This repository
snapshot is the explicit interim delivery mechanism while Sanity publication is
paused. Sanity remains the intended editable editorial owner; no schema or
published document was changed. New mappings require owner approval and a reviewed
version change rather than inference from mutable product prose.

`catalog.ts` resolves the six GIDs from the existing normalized cached Shopify
catalogue and sends only IDs, titles, handles and availability to the client.
It preserves the existing five-minute revalidation policy and safe source-failure
fallback. Existing Storefront API version 2026-07 was confirmed against official
Shopify documentation through Context7; no API query or integration changed.
Fixtures use the real product GIDs to exercise the join, with test-only variants
and commerce behavior still confined to the development/CI fixture gate.

The Guide route reads products alongside cart state. Results render only after
submission, edit invalidates the previous results, and the summary heading
receives focus. Clear introduction/result wording names the limited ranking inputs.
Only matched associations appear in reasons; ties indicate equal editorial ranking,
and sold-out products display Currently unavailable. Result counts may be 1-3;
zero candidates and failed sources keep the summary and collection recovery link.

The designer synchronized Approved frames 2172:2, 2457:601/749/897 and contract
2458:676, retaining existing tokens and geometry. The inherited desktop result-rail
overflow is normalized by the existing fluid grid. No new tokens or primitives.

Independent content/commerce source-code review found no runtime/security blockers.
Its wording correction and explicit state assertions were incorporated. The
reviewer did not independently execute tests. Final independent desktop/mobile
visual review also passed after correcting the smaller-screen gap and capture
artifacts. No remaining visual blockers were found.

Local verification: all 256 unit tests passed, including 30 matching/catalogue
tests; all 12 Guide Storybook checks passed. Five Chromium journeys passed across
1440/768/390/320, including actual product navigation, axe, editing/invalidation,
summary-only room changes and a keyboard flow at simulated 200% page scale with
reduced motion. Under simultaneous local build load the browser rerun timed out;
the bounded single-worker rerun passed. The scale test uses keyboard input because
CDP page scaling does not preserve Playwright pointer hit coordinates. Initial
source-fixture and server-only test harness setup failures were corrected.
Typecheck and formatting passed; Impeccable detection returned no findings.
Final build, lint and exact-commit CI evidence is recorded in the delivery PR.

All four screenshot captures awaited font and image decoding and showed no
horizontal overflow. Full-page captures start at page top. Focused result crops
hide the sticky navigation and development portal only during capture; runtime
navigation remains unchanged. Summary-heading scroll clearance was checked.

- [Desktop runtime](evidence/inf35-matching-runtime-1440.png)
- [Small-mobile runtime](evidence/inf35-matching-runtime-320.png)

Preview acceptance and human merge remain gates.

| Layer                  | Status                                                         |
| ---------------------- | -------------------------------------------------------------- |
| Figma                  | Synced to approved notes/character behavior and result states  |
| DESIGN.md / sidecar    | Synced to accepted rules and current implementation            |
| Semantic tokens        | Unchanged, existing Guide roles reused                         |
| Components / Storybook | Matching, result counts, ties and recovery implemented         |
| Sanity publication     | Intentionally deferred; approved versioned repository snapshot |
