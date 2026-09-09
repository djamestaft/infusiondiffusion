# INF-32 implementation and live baseline review

Date: 8 September 2026. Source baseline: `9c79a85`.
Read-only browser target: <https://infusion-diffusion.vercel.app/>.

Chromium loaded Home, Shop, Bois de Santal product and empty Cart at 1440
and 390 widths, with reduced motion enabled. All eight page loads returned
HTTP 200; none had horizontal overflow or uncaught page errors. No cart was
mutated and no checkout or paid order was attempted.

Shop exposed all six product links at both widths. Home exposed four. No
page had a footer landmark. Direct screenshot inspection of Home and Shop
desktop and product mobile confirmed:

- Home's fourth featured card sits alone on a second desktop row.
- Shop exposes the complete range, but its introduction and filter placeholder
  describe implementation concerns.
- Mobile product imagery is followed by title, price, stock and the entire
  long description before Add to cart.
- The product section labelled Care guidance contains only Size and Made by.
- The current footer is absent.

The Figma proposal should resolve these hierarchy and content-presentation
issues using available source content. This review is a design baseline,
not release approval, a complete accessibility audit, a content-fact approval
or a cart regression pass.

Local captures and observations are retained under ignored
`test-results/inf32-baseline/` in the delivery worktree. Product prices,
availability and image URLs observed there are dated design-reference evidence;
runtime commerce remains owned by Shopify.
