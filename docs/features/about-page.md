# About page

## Approved authority and correction

About is governed by desktop Figma `316:99` (1440×3394), mobile `316:151` (390×3632), and corrected implementation handoff `316:198`. Earlier `316:196` handoff references are superseded. The page is fully light: Sage introduction/development/principles (`#EEF0E7`), canonical Bone origin/collaborator/CTA (`#F5F1E8`), Ivory Navigation with About current.

## Content and layout

The fixed ordered roles are origin, development, collaborator, principles. Fallback title is “The story behind the atmosphere.” and fallback lead is “A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in.” Exact role copy, CTA and SEO fallbacks live in `fallbackAboutPage`; the CTA is the existing primary large anchor to `/fragrance-guide`.

Desktop uses a 1280px, 12-column composition with 80px margins: each media/copy column is 560px and the inter-column space is 160px. Mobile uses 20px margins. Each chapter keeps H2 → body → media source order; desktop alternation is CSS-only. Default rhythm is 420px introduction, 640px chapters and 310px CTA on desktop, but content never has a fixed height.

## Portrait FIT contract

```
1440: outer slot 560 × 420 (4:3) → centered artwork 315 × 420 (3:4)
390:  outer slot 350 × 262 (4:3) → centered artwork 196.5 × 262 (3:4)
320:  outer slot 280 × 210 (4:3) → centered artwork 157.5 × 210 (3:4)
```

The outer slot is transparent. The artwork wrapper is full-height, centered and 3:4; its image uses `object-contain`. It must never cover, stretch or crop. Missing/ineligible media removes only its slot and gap, centering desktop copy at 760px. Hotspots are central-70% authoring safety evidence; invalid values normalize to the center and cannot enable cropping.

## Sanity, accessibility and states

The existing `editorialPage` gains About-only stable roles and optional portrait media. An attached asset requires factual alt, owner/source, storefront-rights confirmation, territory, duration/expiry, release status and licence reference. Human editors retain rights and publication approval. Runtime accepts only URL, factual alt and confirmed rights; missing/partial/unknown/duplicate values preserve the four-role fallback order and text-first layout. Public and draft perspectives remain separate; unavailable reads return safe fallback with bounded logs.

There is one H1, four chapter H2s and a CTA H2. Native links, visible focus, 44px CTA target, no motion, factual alternatives, logical source order and natural long-content expansion are required. At 320px/200% zoom the 20px margins, slot/artwork ratio and CTA must remain without overflow.

## Synchronization and gates

| Layer                             | Status                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| Figma `316:198` / captured packet | approved authority                                                     |
| `DESIGN.md` / sidecar             | synchronized FIT, type and Bone mapping                                |
| runtime                           | `--bone-50` / `bg-bone-50`, `AboutTemplate`                            |
| Storybook                         | text-first, mobile, portrait, one/alternating portrait and long states |
| Sanity                            | additive roles/media contract and generated types                      |
| Preview / publish / merge         | human gates pending                                                    |

Shopify remains limited to the existing `readCart()` navigation count. No final image, content publication, merge, production deploy or rollback is part of this delivery. If content is wrong, a human restores/unpublishes Sanity content and the text-first fallback remains; application rollback must be explicitly authorized.
