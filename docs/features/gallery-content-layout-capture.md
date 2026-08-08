# Gallery content layout capture

- Status: Approved by the user in-session
- Figma file: `GYiQd7QSAwCSaGtt0alKG2`
- Figma node: `376:2`
- Frame name: `Gallery / Approved content layout / Campaign + In the Market`
- Frame size: `1440 × 1540`
- Direct URL: https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=376-2
- Captured evidence: `docs/features/evidence/gallery-figma/approved-content-layout.png`
- Capture date: 2026-08-08
- Transport provenance: official Figma MCP (`use_figma` and `get_screenshot`)

## Content contract

1. `Campaign` is the primary grid and contains the four approved full-scene product images from `images-for-gallery/gallery-final-candidates/`.
2. `In the Market` is a distinct secondary grid and contains all five retained event/tabletop photographs from the source asset frame.
3. Removed brochure-page images and rejected pasted-on composite candidates are excluded.
4. The user explicitly authorized these supplied images for publication in the Gallery.

## Authority and conflict resolution

- Node `376:2` is an approved **content-direction board**, not literal storefront geometry.
- Existing approved Gallery nodes `357:3` and `357:34` remain authoritative for the campaign grid, shell, responsive cadence, captions, and viewer behavior.
- The market extension is specified by these exact frames:
  - Desktop 1440: node `377:2`, 1440 × 1120, evidence `docs/features/evidence/gallery-figma/market-desktop-1440.png`.
  - Mobile 390: node `377:9`, 390 × 1730, evidence `docs/features/evidence/gallery-figma/market-mobile-390.png`.
  - Mobile 320: node `377:16`, 320 × 1460, evidence `docs/features/evidence/gallery-figma/market-mobile-320.png`.
- Campaign order is final: Travertine, Emerald, Library, Botanical. This supersedes any earlier manifest that placed Botanical before Library.
- `Campaign`, `Four polished product stories`, and `Real-world pop-ups, displays, and customer-facing moments` in node `376:2` are design annotations, not runtime copy.
- Runtime adds only the visible H2 `In the Market`; the page H1 and campaign introduction remain governed by the existing approved Gallery frames.

## Display intent

- Campaign imagery appears first, with a more editorial portrait treatment.
- Market imagery follows under the visible heading `In the Market` and uses landscape cards where the source permits.
- Preserve meaningful crops at responsive sizes; do not stretch images.
- Captions and alt text remain editorial Sanity data rather than baked into raster images.

## Market layout measurements

- Desktop frame: 1440px wide, 64px side padding, 28px H2, media begins at y=128.
- Desktop first row: 832 × 468 wide stall image and 416 × 555 portrait display image, separated by 32px.
- Desktop second row: three 400 × 300 images separated by 32px; begins at y=716.
- Mobile 390: 24px side padding, 342px media width, 16px vertical gap, one authored item per row.
- Mobile 320: 16px side padding, 288px media width, 16px vertical gap, one authored item per row.
- Mobile media ratios in order: 16:9, 3:4, 4:3, 4:3, 4:3.
- Market desktop collapses directly to the single-column mobile order at the existing Gallery mobile breakpoint; DOM, visual, keyboard, and Sanity authored order remain identical.

## Media and interaction contract

- Never stretch media. Campaign uses its existing approved 3:4 crop behavior and Sanity hotspot/crop when authored.
- Market cards use the ratios above with `object-fit: cover`; protect the full product silhouette and reeds, stall/table context, and primary display signage. Sanity hotspot/crop is authoritative when present; otherwise center is the fallback.
- Reuse the existing semantic tokens, Marcellus/Manrope typography, 4px media corners, focus-visible treatment, reduced-motion behavior, and 44px targets from nodes `357:*`.
- Campaign and market viewers are group-local: `Image N of 4` and `Image N of 5`. Preserve Close-first focus, Escape, focus restoration, contained images, disabled boundaries, and single-item navigation omission.
- Alt text is factual and concise. Do not transcribe visible telephone numbers or email addresses, and do not invent event names, dates, venues, or identities.
- Missing-content behavior: render either valid section independently; omit an empty section; show the existing full-page Gallery empty state only when neither section has a valid item; preserve bounded read-failure handling.

## Publication authority recorded 8 August 2026

The authorized Sanity editor confirmed the exact four campaign and five retained market files represented by this capture and approved the manifest copy/order for publication. Infusion Diffusion owns/supplied all nine assets; worldwide storefront rights are ongoing with no expiry; no external licence applies because the assets are client-owned; and people, property, privacy, and visible signage are suitable and released for storefront publication. Every image is therefore authored with `sourceOwner: Infusion Diffusion`, `territory: Worldwide`, `rightsDuration: Perpetual`, `licenceReference: Not applicable — client-owned asset`, and `storefrontRightsConfirmed: true`. Campaign release status is not applicable; market release status records model and property releases.

The editor also confirmed that `j222nd1i.production` contained zero Gallery documents before authoring, approved creation of the sole `editorialPage` with slug `gallery`, and approved review and publication of that complete document. This authority does not approve a code merge or production deployment.
