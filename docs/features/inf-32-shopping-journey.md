# INF-32 shopping journey design brief

Status: visual design approved by Devon on 8 September 2026.
Date: 8 September 2026. Delivery owner: Shawnee. Design decision: Devon.
Code baseline: `9c79a85`; review includes merged PR #62 (`30a7003`).

The [dated approval handoff](2026-09-08-design-approval.md) records the exact
approved frames and supersedes earlier pending-approval and layout notes
below. Runtime implementation and final deferred content remain open.

## User outcome and scope

Help South African home-fragrance shoppers compare the six existing 200 ml
reed diffusers, understand a selected product, add it to the existing cart,
and continue to Shopify checkout when enabled. Retain the recognizable logo,
Marcellus/Manrope and semantic brand system while improving hierarchy and
continuity from Home through the shared footer.

Design Home, Shop, product detail, existing cart/drawer, and shared navigation
and footer at 1440, 768, 390 and 320 widths. Devon authorized this work after
deferring final photography, outstanding product/service facts and Sanity SEO.
Use existing imagery and verified content; omit unavailable facts. Record
provisional imagery and content omissions outside customer frames.

## Review correction — 8 September 2026

Devon rejected removal of the Home Fragrance Guide, 200 ml / Made to linger,
and Made meaningful by the details sections. Restore all three in their
existing responsive order. Deferring new facts or the replacement guide
does not authorize removing existing sections. Preserve existing source copy;
any factual concern stays in the deferred decision record until its specific
replacement is approved.

Home hero images must fill their frames, with intentional crops and readable
product subjects at every width. Do not use portrait FIT letterboxing for the
hero. Check the Shop header image as well; existing product imagery remains
provisional and no replacement photography is commissioned.

Gallery and About will be combined. Remove Gallery from desktop and mobile
header navigation across the journey, retaining About as the destination.
Plan the combined editorial page through INF-27/35. Devon also authorized
removing Gallery from the shared footer; reflow the four remaining destinations.
Preserve the existing Gallery URL until its content/route transition is
explicitly defined. This revision does not implement the combined page.

Devon explicitly selected the approved Shop product-card format for Home too.
Use Shop cards `2210:40`, `2210:104`, `2210:164`, `2210:224`
(1440/768/390/320) as the shared visual authority: square FILL media, elevated
160px content panel, 12px top and 16px side/bottom padding, Marcellus 20px
title, Manrope 12px format/status and 15px price. This supersedes the previous
flat Home-card restoration; the change is now an explicit user decision.

Preserve Home's independent selection and grid: three cards at desktop/mobile
and four in the tablet 2×2 grid. Shop retains all six products. Preserve current
product data and imagery when reusing the card; resize to the host grid without
changing the shared image, content or commerce-state format. Do not substitute
the generic component specimen board for the page-specific Shop approval.

The new Fragrance Guide, photography acquisition, invented fragrance notes,
service promises, Shopify source edits, Sanity publication, new backend,
customer accounts, custom checkout and Gallery refinement are out of scope.
Keep existing route destinations. No analytics integration is needed for this
design milestone; preserve existing instrumentation during later delivery.

## Verified baseline and design response

| Observed source behavior                                                                                      | Design acceptance                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home slices four products into a shared three-column desktop grid.                                            | Define Home selection separately from Shop, with deliberate rows at each width and a visible route to all six. No catalogue items are hidden from Shop to fix Home.      |
| Shop already renders every returned product; PR #62 delivered its layouts.                                    | Preserve the complete six-product catalogue. Improve comparison and presentation without rebuilding delivered commerce.                                                  |
| Shop describes Shopify ownership and advertises filters that do not exist.                                    | Use shopper-facing range wording; show only working controls.                                                                                                            |
| Product identity, price and status precede a full description, but purchase controls follow that description. | Group identity, format, price, status, meaningful options and purchase action before expanded description. Show each description once.                                   |
| Variant labels expose Shopify implementation language.                                                        | Use a clear option label only when meaningful choices exist; omit a selector for a sole default variant.                                                                 |
| TemplateShell and website layout have no shared footer.                                                       | Define one responsive footer using existing valid destinations, brand identity and verified contact/service content only. Omit unknown policy destinations and promises. |
| Navigation says Cart while cart headings say bag; cart copy implies items are held.                           | Use consistent Cart naming, neutral quantity copy and no claim that adding an item reserves stock.                                                                       |
| Home guidance and reassurance contain claims awaiting factual review.                                         | Preserve existing Home sections and source copy as requested; retain concerns in INF-28/31 and do not invent new claims or redesign the deferred guide.                  |

Sources: `src/components/templates/storefront-templates.tsx`,
`src/components/product-purchase.tsx`, `src/components/navigation.tsx`,
`src/components/cart/cart-page.tsx`, `src/components/cart/cart-summary.tsx`,
Shop/product routes, and
[INF-25 baseline evidence](evidence/inf-25-home-baseline-verification.md).
The [fresh live baseline review](evidence/inf-32-baseline-review.md) corroborates
the catalogue, footer and purchase-hierarchy findings at desktop and mobile.
It is not a full journey regression or accessibility release verdict.

## Responsive and state contract

- Make primary browsing and purchase actions obvious at every width. Preserve
  reading order and avoid horizontal overflow with the longest current title,
  enlarged text and future long-content examples.
- Show all six Shop items; retain the approved product-card image ratio and crop.
  A missing image retains readable identity, price and stable geometry.
- Specify loading, empty, failed-load/retry, missing media, sold out,
  unavailable option and successful add-to-cart states. Unavailable products
  remain inspectable but cannot be purchased.
- Cart covers empty, populated, updating, failed update with restored confirmed
  selection, unavailable items, removal, checkout disabled and checkout handoff.
  Drawer behavior includes labelled controls, focus entry/return, Escape,
  keyboard containment and a path to the full Cart.
- Prices, availability, variants, quantities, discounts and checkout state
  remain Shopify-owned normalized data. Design examples must identify their
  dated source outside customer frames; they are not live price/stock evidence.
- Preserve semantic headings, visible focus, 44px targets, AA contrast,
  keyboard access, status/error announcements and reduced-motion behavior.
  No information may depend on animation or hover alone.

## Approval and later delivery evidence

Exploration belongs in Figma file `jIMvwSBkilg7eplo3IiHPa`,
`20 — Redesign / Exploration` (`2004:8`). Existing Approved frames remain
unchanged. Devon must accept exact revised frames and intentional differences
before they become implementation authority on Approved (`2004:14`).

The design handoff must include exact frame links, widths, layout and
component/state contracts, semantic roles, assets, responsive rules and a
visual critique. Final photography and factual enrichment remain deferred
in INF-28/31; interim design approval does not complete those deliverables.

After design approval, INF-33 reconciles remaining defects against PR #62;
INF-34 implements approved changes through existing primitives and Storybook.
Require relevant unit/Storybook checks, responsive browser and accessibility
evidence, and regressions for existing cart persistence and checkout handoff.
Human merge and post-merge release verification remain separate gates.
No production rollback is needed for this design-only work; retain approved
frames and the current runtime as the unchanged baseline.

## Historical synchronization at design start

This table predates approval. Current synchronization is recorded in
[DESIGN.md](../../DESIGN.md); runtime revisions remain pending implementation.

| Layer               | Status                                                          |
| ------------------- | --------------------------------------------------------------- |
| Figma               | Exploration in progress; current approved frames retained.      |
| DESIGN.md           | Existing approved authority; revised contract pending approval. |
| Semantic CSS tokens | No changes; revised mapping pending approved design.            |
| Components          | Current runtime preserved; approved revision pending INF-34.    |
| Storybook           | Existing stories retained; revised states pending approval.     |
