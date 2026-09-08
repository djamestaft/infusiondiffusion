# Infusion Diffusion Roadmap

Last updated: 8 September 2026

## Current user deferrals — 8 September 2026

Devon deferred the Sanity SEO description update, final photography, and
outstanding product/service facts until later. These items remain open in
INF-28/31; they are not prerequisites for the next shopping-journey design
milestone. This decision supersedes the final-content prerequisites below.

INF-32 is now In Progress: shape and review Home, Shop, product,
existing cart and shared footer using existing imagery and verified content.
Omit unavailable facts and unsupported claims. Record provisional imagery and
content omissions outside customer frames; do not invent replacement facts.
Final photography and factual enrichment return through INF-28/31 later.
The [shopping-journey brief](../features/inf-32-shopping-journey.md) records
the reviewed implementation baseline, scope, observable acceptance criteria
and required design/state evidence. Shawnee owns delivery; Devon approves
the revised design. Repository and Figma exploration do not approve release.
The replacement Fragrance Guide remains deferred to Devon's new format. Sanity publication
is paused, including credential remediation for the deferred SEO description.

INF-32 no longer has a blocking dependency on completion of INF-31. Devon's
approval of exact revised Figma frames still gates downstream implementation;
merge and release verification gates remain. Final-asset acceptance remains
open and must not be reported as complete from this interim design review.

## INF-32 review correction — 8 September 2026

Restore the existing Home Fragrance Guide, 200 ml / Made to linger, and
Made meaningful by the details sections in their original order. Content
deferrals do not authorize removing those sections. Correct Home hero image
letterboxing so the existing imagery fills its frames at every width.

Devon also directed combining Gallery and About. Remove Gallery from the
responsive header and keep About; INF-27/35 must shape and implement the
combined editorial destination. Preserve the existing Gallery route and
footer link until that transition is defined. INF-37 now represents later
refinement of the combined About/Gallery experience, not a separate Gallery
redesign. Existing design, source publication and merge gates still apply.

## Goal and existing systems

Evolve the recognizable Infusion Diffusion brand into a cohesive premium
shopping experience. The first milestone covers Home, Shop, product detail,
the existing cart and Shopify checkout handoff, plus essential brand and
service pages, with Gallery and About planned as one editorial destination.
Further refinement of that combined experience follows.

Shopify ecommerce, catalogue, variants, prices, inventory, cart and hosted
checkout are already integrated. Sanity already owns CMS/editorial content.
Preserve these integrations; improve presentation, content readiness and
verification. No new commerce backend, CMS migration, customer account
integration or custom checkout is in scope.

The user approved brand evolution, an asset workstream and the complete
shopping journey first. Retain the logo and Marcellus/Manrope by default;
revisit composition, imagery and dark/light balance through explicit Figma
approval. Use Charlotte Rhys as a product-clarity reference and Cape Island
as an editorial-imagery reference, without copying their catalogue breadth.

## Governance and visual authority

This document is the strategic source of truth; Plane project INF is the
execution ledger. Before starting delivery, safely refresh protected main,
read this roadmap and retrieve the ticket. Every active item must name its
owner, dependencies, acceptance evidence and human gate. Use actual Plane
dependency relationships as well as readable descriptions.

The sole visual authority is Figma file `jIMvwSBkilg7eplo3IiHPa`,
`30 — Redesign / Approved` (`2004:14`). Exploration and retired files do
not authorize implementation. Existing approvals remain historical evidence;
INF-32 owns revised journey approval. Exact frames populated with real content
must be accepted before new implementation is treated as final.

Next.js owns presentation, Shopify owns commerce truth, Sanity owns editorial
content, and Storybook owns reusable UI state contracts. Do not invent product
or service claims. Source publication, expenditure, design acceptance, merge
and production promotion retain their named human gates.

## Verified delivery baseline

- Home PR #60 was human-merged at `e6ea435`; main and live health reported
  `b4feec3` during the 7 September assessment. INF-24 remains Done.
- INF-25 baseline verification and INF-22 Devon review are Done. The merged
  7 September evidence distinguishes resolved findings from remaining visual
  and missing-media work transferred to INF-32/33/34; transfer is not correction.
- INF-26 Shop/product design approval is complete. Shop frames:
  `2209:24`–`2209:27`; product detail: `2209:28`–`2209:31`; states:
  `2209:32`. Approved layouts still require final content acceptance.
- INF-29 Shop/product implementation was human-merged through
  [PR #62](https://github.com/djamestaft/infusiondiffusion/pull/62) at
  `30a7003`. Devon approved the Shop and product layouts at desktop, tablet and
  mobile widths; post-merge GitHub quality, including Chromium E2E, passed.
  Vercel reported a successful deployment, while deployment protection prevents
  unauthenticated live-route smoke evidence.
- Review PR #62 before commissioning overlapping changes. Its documentation
  changes must preserve this newer roadmap when integrated; do not restore
  the earlier Home-first sequence during conflict resolution.
- INF-21/23 and completed INF-6–20 remain historical approvals/delivery
  records, not blanket proof of the revised journey's readiness.

## Delivery tickets and dependencies

Shawnee owns delivery preparation unless otherwise stated. Devon owns factual,
design and merge decisions. Independent verification is required for release.

| Item   | Outcome                                                                                | Depends on                   |
| ------ | -------------------------------------------------------------------------------------- | ---------------------------- |
| INF-25 | Resolve or explicitly transfer each Home baseline finding with evidence                | INF-24                       |
| INF-22 | Devon reviews Home baseline acceptance and outstanding deviations                      | INF-25                       |
| INF-29 | Review and finish existing Shop/product delivery without overlapping rework            | INF-23, INF-26               |
| INF-28 | Devon approves launch product/service facts, naming and metadata                       | Ready alongside asset audit  |
| INF-30 | Audit launch assets, provenance, rights, image roles and missing shots                 | Approved and merged          |
| INF-31 | Complete approved launch assets/content and source-specific previews                   | INF-30, INF-28               |
| INF-32 | Approve responsive Home/Shop/product/cart/footer using available verified content      | INF-31 final assets deferred |
| INF-33 | Correct remaining catalogue visibility and purchase hierarchy defects                  | INF-29, INF-32               |
| INF-34 | Implement revised Home, shared shell/footer, product presentation and existing cart UI | INF-32, INF-33               |
| INF-27 | Approve essential Fragrance Guide, combined About/Gallery and Contact templates        | INF-32, INF-21, INF-23       |
| INF-35 | Implement essential editorial/service pages and product-linked guidance                | INF-27, INF-31, INF-34       |
| INF-36 | Independently verify, obtain human merge and record post-merge smoke evidence          | INF-34, INF-35               |
| INF-37 | Refine combined About/Gallery after the shopping milestone; preserve existing URLs     | INF-36                       |

INF-30's audit and owner approval are merged through PRs #66/#67; the required
quality check passed on `d79b673`, and its Plane status is reconciled to Done.
Final asset acquisition, source manifests, expenditure and publication retain
their downstream gates.

The outstanding INF-28 factual decisions are deferred as recorded above. The
[launch content decision sheet](../features/inf-28-launch-content-decisions.md)
preserves the 2 September naming/claims/contact/metadata approvals, identifies
unapplied source corrections, and records unresolved title convention, scent notes,
care, service, mailbox and metadata choices against a fresh source snapshot.
On 7 September Devon confirmed the current launch is the six existing 200 ml
reed diffusers only. Candles and room sprays must not be advertised as launch
products. INF-28 U2 is Accepted; U1's range is Accepted while the title suffix
and Shopify product-type field remain unresolved. INF-31 owns the corresponding
source wording preview and later approved publication. Devon subsequently
authorized Home and metadata wording implementation. The Fragrance Guide is
deferred to Devon's new format; image replacement and missing information will
be added later. Those deferrals permit this wording delivery without treating
the final launch-content or revised-design gates as complete.
INF-28 remains Todo for outstanding decisions. On 7 September the user deferred
Santuaire Serein’s specific fragrance notes and authorized continued preparation.
INF-31 may progress approved naming and asset-source inventory while those notes
remain unlisted; it is In Progress for preparation only. Its completion and
publication still require the remaining applicable factual and asset approvals.
The proposed short Santuaire replacement description is not an accepted change.
See the [preparation package](../features/inf-31-launch-content-preparation.md).
INF-32 must review related INF-29 evidence, but does not require the older
implementation to merge before revised design can proceed.
Dependent implementation remains in Backlog until approval contracts exist.
One delivery branch is the default; multiple writing agents require separately
approved topology and isolated Treehouse worktrees.

INF-1, INF-2 and INF-5 are Cancelled as superseded planning/discovery items,
not falsely completed or deleted. Their history remains accessible. INF-3/4
stockist work stays in its separate backlog. No completed design ticket is
reopened merely to erase a previous direction.

## Acceptance and release

- Every launch product has approved, accurate primary imagery, consistent
  scale/crops and concise scent differentiators; facts and rights are recorded.
  Figma customer frames contain no placeholder merchandise or technical notes.
- Shop displays the complete catalogue at 1440, 768, 390 and 320 widths.
  Homepage selection is independent from full-catalogue output. INF-33 records
  fixes already delivered by INF-29 and avoids duplicating them.
- Product identity, price, availability, options and purchase controls precede
  expanded storytelling; duplicated description summaries are removed.
- Shared footer and purchase reassurance expose approved delivery, returns,
  contact and policy information. Fragrance guidance links to products.
  Preserve URLs; approved handle changes require redirects.
- Existing Shopify add/update/remove cart, persistence, unavailable items,
  recovery and checkout handoff pass regression checks. No paid order or
  direct production deployment is implied by verification authority.
- Figma, DESIGN.md, semantic tokens, components and Storybook agree, with any
  intentional divergence explicitly approved. Check loading/error/empty,
  long-content/missing-media, keyboard/focus, 44px targets, AA contrast,
  reduced motion, constrained connections and image performance.
- Required local and GitHub checks pass on the reviewed commit. Attach exact
  preview, screenshots, independent review, residual risk and rollback target.
  A Done label, deployment or green CI alone is not visual approval.
- Devon approves merge; verify Home, Shop, product, cart, support and health
  after release before INF-36 is complete. Sanity publishing remains a separate
  human editorial decision.

Historical handoff details remain in `docs/planning/redesign-context.md`;
this roadmap governs current order and scope.
