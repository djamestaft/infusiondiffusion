# Gallery local comparison evidence

Captured from the test-only `Components/GalleryViewer / Populated` Storybook fixture after the Gallery Storybook build:

- `gallery-local-1440.png`: 1440×1000 desktop comparison viewport.
- `gallery-local-390.png`: 390×844 mobile comparison viewport.
- `gallery-local-320.png`: 320×844 constrained mobile viewport.

The fixture uses labelled test-only SVG media and authored captions; it does not represent publishable gallery photography. It verifies the approved authored-order tall/short cadence, borderless caption layout, responsive margins, and natural overflow behavior without inserting provisional media into the production route. The approved Figma comparison source remains `docs/features/gallery-figma-capture.md` nodes `357:3` and `357:34`.

Viewer, empty, unavailable, loading, image-failure, first/middle boundary, long-content, and reduced-motion contracts are covered by the `Components/GalleryViewer` and `Templates/Storefront` Storybook states plus automated tests. Vercel Preview comparison remains a separate PR gate.
