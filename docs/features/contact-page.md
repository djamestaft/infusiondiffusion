# Contact page

Status: implemented on the delivery branch; Storybook comparison, Preview, editorial publishing, merge, and production remain human gates.

## Approved authority

Figma `Feature / Contact` in `GYiQd7QSAwCSaGtt0alKG2`: [desktop default](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=329-58), [mobile default](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=329-100), loading `329:135`/`329:165`, error `329:188`/`329:225`, fallback `329:255`/`329:297`, long content `329:332`/`329:374`, and cart `329:409`/`329:451`. The implementation handoff is `adws/adw_data/sessions/751e6bd2/context_handoff/figma_handoff.md`.

## Shipped contract

- `/contact` is direct email only: it visibly exposes `hello@infusiondiffusion.co.za` (or a safely validated global setting) and uses real `mailto:` anchors.
- No form, editable contact field, submit action, message persistence, provider, CRM, or delivery claim is rendered.
- Sanity `editorialPage` slug `contact` owns eyebrow, title, introduction, optional ordered sections, and SEO. Versioned code owns fallback copy, unavailable/error wording, and safe email construction.
- The normal unavailable message is static `FeedbackAlert` information; unexpected errors use one alert and a native retry button. Loading uses `aria-busy` and does not invent a cart count.
- Contact is the sole current navigation destination. The intentional runtime correction supersedes the captured Shop-current instance. Natural heights, semantic FeedbackAlert contrast, and wrapping supersede clipped/stale capture artifacts.
- At 1440px, the 1280px desktop grid starts at the approved 80px inset. The contact H2 spans the grid; address and static alert occupy the leading six columns while the intrinsic primary mail action is placed 64px into the seventh track (the captured ~800px cross-grid position). This is the approved `329:58` composition, not an intentional divergence.

## Synchronization matrix

| Layer                                                     | Status                  |
| --------------------------------------------------------- | ----------------------- |
| Approved Figma nodes                                      | synced (handoff above)  |
| DESIGN.md and sidecar                                     | synced in this branch   |
| Runtime semantic tokens                                   | reused; no token change |
| Contact template and Storybook states                     | implemented; plays pass |
| Approved 390px default and 320px small Storybook states   | implemented             |
| Route and Sanity fallback boundary                        | implemented             |
| Local desktop/mobile/small captures                       | captured in `evidence/` |
| Storybook visual comparison / Preview / editorial publish | pending human review    |
