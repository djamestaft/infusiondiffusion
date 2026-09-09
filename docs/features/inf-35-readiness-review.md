# INF-35 storefront readiness review

9 September 2026. Continue the approved storefront with existing content
deferrals. INF-35 remains In Progress (Devon); this is not completion of the
downstream INF-36 release journey. PR #76 is merged at `dbe8296`, deployed,
and post-merge main CI run 34361271753 passed.

## Acceptance and implementation

The existing cart keyboard contract requires returning focus to Add to cart
when its confirmation closes. Production reproduced a race: the drawer opens
while the product refresh keeps Add to cart disabled; closing at that point
leaves focus on BODY even after the button becomes enabled.

- Restore focus through the drawer close lifecycle.
- During a pending refresh, focus the purchase control group with the existing
  semantic focus outline. Return to the enabled button when refresh completes.
- Preserve any deliberate focus movement made while waiting.
- Keep the purchase group focused if refreshed availability disables the button.
- Preserve cart actions, layout, tokens and existing drawer dismissal paths.

This restores the approved behavior without changing visual direction. Figma
geometry and tokens remain unchanged; Storybook adds ordinary close and
newly unavailable opener states. Playwright holds the actual RSC refresh to
cover Escape, Continue shopping and deliberate focus movement on desktop/mobile.
The coordinator is the sole repository writer; independent content/commerce
review is read-only and its focus-movement/unavailability findings are addressed.

## Production baseline evidence

Captured against `dbe8296`, before this fix:

- Home, Shop, Bois De Santal product, About, Guide and Contact returned 200
  at 1440/768/390/320: 24 page checks, no horizontal overflow, no detected
  axe WCAG 2 A/AA or 2.1 A/AA violations.
- All six Shop product links resolved to current production product pages.
  Rendered descriptions matched the saved INF-28 source snapshot after
  whitespace normalization; no new direct Shopify export was obtained.
- Amber/vanilla matched Ambre, Blanc and Noir with supported reasons.
  Spa-like calm matched Santuaire; current product links resolved.
- Contact email links use the published mailbox. This does not establish
  mailbox monitoring or response times.
- Cart add, increase and reload, decrease, remove and reload passed.
  Cart at the same four widths had no overflow or detected axe violations.
  Quantity persistence checks awaited completed updates before reloading.
- Checkout is visibly disabled. No checkout handoff, payment or order tested.

Machine-readable results: [pages](evidence/inf35-readiness-pages.json),
[cart](evidence/inf35-readiness-cart.json), and
[focus reproduction](evidence/inf35-readiness-focus-before.json).
Automated accessibility checks do not constitute a complete accessibility audit.

## Remaining gates

Care/setup/safety guidance, delivery and returns details, final photography,
source naming/facts and SEO/source publication remain deferred under INF-28/31.
Home service labels do not establish detailed service policies. Existing source
wellness prose and absent Santuaire notes remain source-review items.
Do not invent facts or infer approval to publish from this review.

Current fix validation and exact-commit CI evidence are recorded in its PR.
Human preview acceptance and merge remain gates; no direct production deployment.
