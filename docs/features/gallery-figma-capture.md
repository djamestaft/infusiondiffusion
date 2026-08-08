# Gallery Figma implementation capture

## Provenance

- Captured on 2026-08-07 through the authenticated official Figma connector available to Codex.
- Canonical file: `Infusion Diffusion Designs WEB` (`GYiQd7QSAwCSaGtt0alKG2`).
- Canonical page: [Feature / Gallery, node 357:2](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-2&p=f&m=dev).
- Approval: the product owner approved the direction in the engineering thread; every captured state is explicitly named `Approved` in Figma metadata.
- Capture contents: official connector metadata for page `357:2` and an official rendered screenshot of every state listed below.
- Photography remains a deliberately labelled provisional placeholder. Figma approval does not grant publication rights; Sanity must omit media without `storefrontRightsConfirmed` and factual alt text.

## Exact approved frames

| State             |                                                                                                            Node | Natural dimensions | Screenshot                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------: | -----------------: | ---------------------------------------------- |
| Populated desktop |     [`357:3`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-3) |          1440×2380 | `evidence/gallery-figma/populated-desktop.png` |
| Populated mobile  |   [`357:34`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-34) |           390×2920 | `evidence/gallery-figma/populated-mobile.png`  |
| Viewer desktop    |   [`357:64`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-64) |          1440×1040 | `evidence/gallery-figma/viewer-desktop.png`    |
| Viewer mobile     |   [`357:76`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-76) |            390×844 | `evidence/gallery-figma/viewer-mobile.png`     |
| Empty desktop     |   [`357:88`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-88) |           1440×900 | `evidence/gallery-figma/empty-desktop.png`     |
| Empty mobile      | [`357:100`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-100) |            390×844 | `evidence/gallery-figma/empty-mobile.png`      |
| Loading desktop   | [`357:111`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-111) |          1440×1000 | `evidence/gallery-figma/loading-desktop.png`   |
| Loading mobile    | [`357:131`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-131) |           390×1000 | `evidence/gallery-figma/loading-mobile.png`    |

## Layout and hierarchy

- Experience mode: photography becomes the primary artifact immediately after the compact page introduction.
- Desktop uses the approved 1440 canvas, 80px outer margins, a 1280px content field, and two 600px media columns separated by 80px. Alternating media heights are 760px and 460px while authored DOM order remains 1, 2, 3, 4.
- Mobile uses a 390px canvas, 20px margins, a 350px content field, and one authored-order column. Media alternates between 438px and 270px heights.
- Navigation is 104px desktop and 80px mobile. The desktop Gallery current rule is 62×2 at x=817/y=70. Mobile retains the menu control and defers current-page exposure to the drawer implementation.
- Desktop page heading begins at x=80/y=184 in a 900px measure; introduction begins at y=288 in a 720px measure. Mobile heading begins at x=20/y=132 in a 350px measure; introduction begins at y=248.
- Captions follow each image rather than overlaying it. Item titles use the approved Marcellus title voice; supporting text uses Manrope.
- Fixed Figma heights are reference geometry, not runtime constraints. Natural content height, 320px support, 200% zoom, long copy, and localization wrapping take precedence without changing reading order.

## Viewer contract

- Desktop: dark contained overlay, image region x=80/y=80 at 920×720, title/caption below, written position at x=80/y=964, and Previous/Next controls at the lower right.
- Mobile: 20px margins, contained image at x=20/y=96 at 350×470, title/caption below, and position plus Previous/Next controls at the bottom.
- Close has an explicit 44px-high bordered target in both frames. Previous and Next are 48px-high bordered controls.
- Runtime composes the existing Radix/shadcn Dialog semantics: focus containment and restoration, Escape, background interaction lock, accessible title/description, and keyboard-operable controls.
- Viewer imagery uses `object-contain`. One item omits Previous/Next. At boundaries, controls are disabled or omitted honestly; written `Image N of M` remains available.
- Image failure and long captions must never remove Close, position, or navigation access.

## Empty and loading states

- Empty state headline: “The gallery is being composed”. It includes honest explanatory copy and an `EXPLORE THE COLLECTION` destination; it must never substitute Storybook fixtures for missing production content.
- Loading state headline: “Gathering the gallery”. Desktop shows six three-column media placeholders; mobile shows three stacked placeholders.
- Loading is labelled with `aria-busy`; reduced motion renders static placeholders. Empty/unavailable copy is ordinary non-live content.

## Semantic mapping

The frames use the existing approved Perfumer's Cabinet values already recorded in `DESIGN.md`, not a new token family:

- Content canvas: Mineral Sage Base `#EEF0E7`.
- Loading/elevated fields: Sage Elevated `#E3E7DA` and Sage Quiet `#DDE2D4`.
- Primary text and viewer: Deep Ink `#11110F`.
- Supporting text: Graphite `#3C3B35`.
- Accessible light-surface accent: Antique Gold Accessible `#735716`.
- Dark-surface accent/focus: Antique Gold `#C5A447`.
- Provisional media fields: Smoked Olive, Resin, Soft Ink, and Graphite.
- Typography: Marcellus for display/title and Manrope for navigation, body, labels, captions, and controls.
- Corners remain disciplined at 4px; interactive targets are at least 44×44px.

## Responsive and accessibility decisions

- CSS must not reorder authored items. Reading, keyboard, and visual order remain aligned.
- The desktop asymmetry collapses to one column below the established storefront breakpoint; at 320px the 20px outer margins and flexible media width remain.
- Thumbnail buttons receive title-derived accessible names and visible semantic focus treatment.
- No autoplay, infinite animation, or drag-only behavior. Nonessential transitions are removed under `prefers-reduced-motion`.
- Responsive `next/image` sizing, stable aspect boxes, first-meaningful-image priority, lazy loading below it, and authored Sanity hotspot/crop apply to thumbnails.
- Cropping must not hide caps, flames, spray triggers, reed tips, or other recognition-critical product detail.

## Intentional runtime divergences

- Production Navigation must preserve the repository's complete destination and cart contract even where the illustrative Figma text layer is abbreviated.
- Runtime content height is fluid for zoom, copy extremes, safe areas, and errors; fixed frame heights are not CSS heights.
- Empty/loading/error behavior and focus management use semantic HTML and existing primitives even when a static frame cannot express those behaviors.
- Figma photography is provisional. Only rights-confirmed Sanity media may populate the production route.

## Synchronization matrix

| Layer                        | Status                   | Note                                                                  |
| ---------------------------- | ------------------------ | --------------------------------------------------------------------- |
| Figma page and eight frames  | `synced`                 | Exact Approved nodes and official screenshots captured.               |
| Repository capture           | `synced`                 | This document plus eight PNG renders.                                 |
| `DESIGN.md` Gallery contract | `pending implementation` | Update in the SDLC documentation boundary.                            |
| Runtime CSS tokens           | `intentional reuse`      | No new token family required.                                         |
| Components and templates     | `pending implementation` | Must consume this capture and existing primitives.                    |
| Storybook                    | `pending implementation` | Must cover populated, viewer, empty, loading, extremes, and failures. |
