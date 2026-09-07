# Infusion Diffusion Roadmap

Last updated: 7 September 2026

## Goal and existing systems

Evolve the recognizable Infusion Diffusion brand into a cohesive premium
shopping experience. The first milestone covers Home, Shop, product detail,
the existing cart and Shopify checkout handoff, plus essential brand and
service pages. Gallery refinement follows.

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
- INF-25 owns baseline verification and unresolved deviations. Its 3 September
  report includes visual differences and environment-specific test failures.
  INF-22 is Devon's review, not a future authorization for the completed merge.
- INF-26 Shop/product design approval is complete. Shop frames:
  `2209:24`–`2209:27`; product detail: `2209:28`–`2209:31`; states:
  `2209:32`. Approved layouts still require final content acceptance.
- INF-29 implementation is in open
  [PR #62](https://github.com/djamestaft/infusiondiffusion/pull/62) at
  `f5fad67`. GitHub quality passed, and Devon approved the Shop and product
  layouts at desktop, tablet and mobile widths. Human merge and post-merge
  verification remain outstanding.
- Review PR #62 before commissioning overlapping changes. Its documentation
  changes must preserve this newer roadmap when integrated; do not restore
  the earlier Home-first sequence during conflict resolution.
- INF-21/23 and completed INF-6–20 remain historical approvals/delivery
  records, not blanket proof of the revised journey's readiness.

## Delivery tickets and dependencies

Shawnee owns delivery preparation unless otherwise stated. Devon owns factual,
design and merge decisions. Independent verification is required for release.

| Item   | Outcome                                                                                | Depends on                  |
| ------ | -------------------------------------------------------------------------------------- | --------------------------- |
| INF-25 | Resolve or explicitly transfer each Home baseline finding with evidence                | INF-24                      |
| INF-22 | Devon reviews Home baseline acceptance and outstanding deviations                      | INF-25                      |
| INF-29 | Review and finish existing Shop/product delivery without overlapping rework            | INF-23, INF-26              |
| INF-28 | Devon approves launch product/service facts, naming and metadata                       | Ready alongside asset audit |
| INF-30 | Audit launch assets, provenance, rights, image roles and missing shots                 | Ready now                   |
| INF-31 | Complete approved launch assets/content and source-specific previews                   | INF-30, INF-28              |
| INF-32 | Approve real-content responsive Home/Shop/product/cart/footer journey                  | INF-31                      |
| INF-33 | Correct remaining catalogue visibility and purchase hierarchy defects                  | INF-29, INF-32              |
| INF-34 | Implement revised Home, shared shell/footer, product presentation and existing cart UI | INF-32, INF-33              |
| INF-27 | Approve essential Fragrance Guide, About and Contact templates                         | INF-32, INF-21, INF-23      |
| INF-35 | Implement essential editorial/service pages and product-linked guidance                | INF-27, INF-31, INF-34      |
| INF-36 | Independently verify, obtain human merge and record post-merge smoke evidence          | INF-34, INF-35              |
| INF-37 | Refine Gallery after the shopping milestone; preserve working Gallery meanwhile        | INF-36                      |

Immediate actions are INF-29 human merge, INF-25/22 evidence reconciliation,
INF-30 asset audit and INF-28 factual decisions. These can progress together.
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
