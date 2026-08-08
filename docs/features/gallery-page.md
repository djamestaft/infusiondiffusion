# Gallery page

Approved source: [Feature / Gallery `357:2`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=357-2&p=f&m=dev). The approved desktop/mobile populated, viewer, empty, and loading captures are recorded in [gallery-figma-capture.md](./gallery-figma-capture.md): nodes `357:3`, `357:34`, `357:64`, `357:76`, `357:88`, `357:100`, `357:111`, and `357:131`.

## Runtime contract

- `/gallery` is an Experience-mode, Sanity-owned editorial route. It uses `editorialPage` slug `gallery`, does not query Shopify for gallery media, and retains the existing cart quantity in Navigation.
- A rendered item requires `_key`, heading, image URL, factual alt, and `storefrontRightsConfirmed`. The authored section order is preserved and limited to ten items.
- `sections[].body` is the required authored caption for this release. A malformed legacy item with every other required field receives the visible, non-live fallback: “Additional details are unavailable for this image.” This resilience fallback is not publishable content.
- Thumbnails use the approved alternating tall/short cadence in source order. Viewer media is contained; thumbnails use authored hotspot placement. The first thumbnail is prioritized and later media lazy-loads.
- The viewer is a full-viewport Dialog composition with Close-focused opening, Escape, focus restoration, written position, and honest non-wrapping Previous/Next boundaries. One item has no navigation controls.
- No eligible items renders the approved text-first empty shell. A failed bounded read changes the wording to unavailable. Loading is labelled with `aria-busy` and has no required motion.

## Intentional divergences

Runtime keeps the full five-destination Navigation plus account/cart, corrects the captured empty-frame text collision with natural flow, makes dialog boundary buttons genuinely disabled, and permits natural page/dialog height for zoom, long captions, and safe areas.

## Synchronization matrix

| Layer                                                        | Status                                               |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| Approved Figma frames/capture                                | synced                                               |
| `DESIGN.md` route contract                                   | synced                                               |
| `.impeccable/design.json` Gallery sidecar                    | synced                                               |
| Runtime CSS tokens                                           | intentional reuse; no new Gallery token              |
| `GalleryViewer`, template, route                             | synced                                               |
| Storybook                                                    | synced; fixtures are test-only                       |
| Local fixture comparison evidence                            | synced; see `evidence/gallery-local-verification.md` |
| Sanity publication, final media rights and authored captions | pending human editorial gate                         |
| Storybook visual review / merge / preview                    | pending human gates                                  |
