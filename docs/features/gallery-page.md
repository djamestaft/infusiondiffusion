# Gallery page

Approved source: [Feature / Gallery `357:2`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-2&p=f&m=dev). The approved desktop/mobile populated, viewer, empty, and loading captures are recorded in [gallery-figma-capture.md](./gallery-figma-capture.md): nodes `357:3`, `357:34`, `357:64`, `357:76`, `357:88`, `357:100`, `357:111`, and `357:131`.

## Runtime contract

- `/gallery` is an Experience-mode, Sanity-owned editorial route. It uses `editorialPage` slug `gallery`, does not query Shopify for gallery media, and retains the existing cart quantity in Navigation.
- A rendered item requires `_key`, heading, image URL, factual alt, and `storefrontRightsConfirmed`. The authored section order is preserved and limited to ten items.
- `sections[].body` is the required authored caption for this release. A malformed legacy item with every other required field receives the visible, non-live fallback: “Additional details are unavailable for this image.” This resilience fallback is not publishable content.
- Thumbnails use the approved alternating tall/short cadence in source order. Viewer media is contained; thumbnails use authored hotspot placement. The first thumbnail is prioritized and later media lazy-loads.
- The viewer is a full-viewport Dialog composition with Close-focused opening, Escape, focus restoration, written position, and honest non-wrapping Previous/Next boundaries. One item has no navigation controls.
- No eligible items renders the approved text-first empty shell. A failed bounded read changes the wording to unavailable. Loading is labelled with `aria-busy` and has no required motion.
- `galleryGroup` is additive and accepts only `campaign` or `market`. A legacy missing value normalizes to Campaign; an unknown value is omitted. The dedicated Gallery GROQ projection includes group, rights confirmation, hotspot/crop, and asset dimensions, and normalization remains bounded to ten valid items across both groups.
- Campaign and market render as separate, authored-order grids and independent viewer scopes. At the approved 1440px desktop width, Campaign uses independent stacks with Blanc De Blanc followed by Botanical at left with a 64px same-column gap, and Emerald followed by Library at right with a 32px same-column gap; every caption begins 16px below its image. It collapses to one authored-order column on mobile. Campaign titles are H2s. The exact H2 `In the Market` introduces market H3s. Either group renders alone; the closing line follows whichever valid grids render.
- Market uses the approved 16:9, 3:4, 4:3, 4:3, 4:3 slot sequence. Desktop uses three fluid columns with the first item spanning two columns from 1024px until the fixed approved composition fits at 1408px; mobile is one column. Only the first campaign thumbnail is eager/priority; all other media is lazy.

## Published content manifest

Campaign order follows the approved content capture and supersedes the earlier planning order that placed Botanical before Library.

| Group         | Order | Source                                                    | Heading                            | Factual alt                                                                                                                | Visible caption                                                                           |
| ------------- | ----: | --------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Campaign      |     1 | `gallery-final-candidates/blanc-de-blanc-travertine.png`  | Blanc De Blanc — Travertine Light  | Blanc De Blanc reed diffuser with black reeds on a travertine plinth in warm sunlight.                                     | Blanc De Blanc composed against warm travertine and shifting light.                       |
| Campaign      |     2 | `gallery-final-candidates/bois-de-santal-emerald.png`     | Bois De Santal — Emerald Study     | Bois De Santal reed diffuser with black reeds on a green marble plinth against emerald panelling.                          | Bois De Santal set against emerald panelling and green marble.                            |
| Campaign      |     3 | `gallery-final-candidates/santuaire-serein-library.png`   | Santuaire Serein — Library Study   | Santuaire Serein reed diffuser with black reeds on a polished wooden desk beside leather-bound books and green curtains.   | Santuaire Serein in a warm library setting of polished wood, books and deep green fabric. |
| Campaign      |     4 | `gallery-final-candidates/santuaire-serein-botanical.png` | Santuaire Serein — Botanical Light | Santuaire Serein reed diffuser with black reeds on pale stone among green leaves beside a sunlit window.                   | Santuaire Serein framed by soft daylight, pale stone and botanical greens.                |
| In the Market |     1 | `WhatsApp Image 2026-08-08 at 18.07.20.jpeg`              | At the Indoor Market               | Wide view of an Infusion Diffusion market stall with gold-covered tables, product boxes and visitors inside a hall.        | The Infusion Diffusion stand among neighbouring makers at an indoor market.               |
| In the Market |     2 | `WhatsApp Image 2026-08-08 at 18.11.01.jpeg`              | The Market Table                   | Infusion Diffusion display table with boxed reed diffusers, white vessels and red flowers, with a person behind the stall. | A market display bringing together boxed diffusers, display vessels and floral detail.    |
| In the Market |     3 | `WhatsApp Image 2026-08-08 at 18.11.02 (10).jpeg`         | Blanc De Blanc at Market           | Blanc De Blanc reed diffuser and kraft box on a wood slice beside a framed product card and flowers.                       | Blanc De Blanc presented with its packaging and fragrance story at the market table.      |
| In the Market |     4 | `WhatsApp Image 2026-08-08 at 18.11.02 (11).jpeg`         | The Collection on Display          | Several Infusion Diffusion reed diffusers and kraft boxes arranged on a patterned market table beside a framed brand sign. | A selection of Infusion Diffusion fragrances arranged for market visitors.                |
| In the Market |     5 | `WhatsApp Image 2026-08-08 at 18.11.02 (12).jpeg`         | A Table of Fragrance               | Infusion Diffusion reed diffusers and kraft boxes displayed on round wood slices with flowers and branded notebooks.       | The collection displayed across natural wood stands with flowers and brand materials.     |

All nine images record Infusion Diffusion as owner/source, Worldwide territory, Perpetual duration, `Not applicable — client-owned asset` as the licence reference, and `storefrontRightsConfirmed: true`. Campaign release status is Not applicable; market images record model and property releases. Telephone numbers or email addresses visible in photography are not transcribed into alt text or captions.

## Intentional divergences

Runtime keeps the full five-destination Navigation plus account/cart, corrects the captured empty-frame text collision with natural flow, makes dialog boundary buttons genuinely disabled, and permits natural page/dialog height for zoom, long captions, and safe areas.

## Synchronization matrix

| Layer                                                        | Status                                                         |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| Approved Figma frames/capture                                | synced                                                         |
| `DESIGN.md` route contract                                   | synced                                                         |
| `.impeccable/design.json` Gallery sidecar                    | synced                                                         |
| Runtime CSS tokens                                           | intentional reuse; no new Gallery token                        |
| `GalleryViewer`, template, route                             | synced                                                         |
| Storybook                                                    | synced; fixtures are test-only                                 |
| Local fixture comparison evidence                            | synced; see `evidence/gallery-content-preview-verification.md` |
| Sanity publication, final media rights and authored captions | synced; `gallery` published in `j222nd1i.production`           |
| Storybook visual review / merge / preview                    | local implementation synced; merge/Preview remain human gates  |
