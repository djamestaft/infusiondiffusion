# Homepage hero carousel

## Outcome and scope

The homepage keeps one stable server-rendered H1, introduction, and `/shop` action while editors may provide an ordered two- or three-image editorial campaign carousel. The audience is mobile-first South African shoppers on potentially constrained connections.

Sanity owns slide order, image crop/hotspot, alternative text, optional caption, and visibility. Shopify continues to own every product, price, inventory, discount, cart, customer, and order value. Carousel-specific campaign photography is not included and must be supplied and published by an editor.

Out of scope: commerce fields, per-slide headings or CTAs, video, infinite autoplay, final campaign photography, analytics, and Sanity publication.

## Approved visual sources

- [Homepage desktop `296:100`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-100)
- [Homepage mobile `296:174`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-174)
- [Desktop first slide `296:239`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-239)
- [Desktop active progress `296:262`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-262)
- [Mobile first slide `296:286`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-286)
- [Mobile active progress `296:309`](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-309)

## Acceptance criteria

1. The H1, introduction, and `/shop` CTA are stable server-rendered content and never rotate with media.
2. Two or three valid visible Sanity slides enable the carousel; one slide is static; incomplete/empty editorial data retains the existing Shopify-image hero fallback.
3. Media is always 4:5. Empty or failed media keeps the same box and does not cause layout shift. Slide caption/position text is never visible over or beside the media; identity and count remain available to assistive technology.
4. The first slide is the sole eager/priority image. Later slides load lazily; without JavaScript, the first image remains visible.
5. Pagination uses 44×44 targets. The active dot displays a three-second progress ring that resets on every slide. In an ordinary session, autoplay begins on load and continuously loops across valid slides every 3,000ms with the existing 500ms opacity crossfade.
6. A separate pause/play control is present. Hover does not pause autoplay. Focus within, page hiding, offscreen positioning, explicit Pause, and manual pagination pause/stop autoplay. Reduced motion and Save-Data disable it.
7. Assistive technology receives announcements only for manual slide selection. Controls use native buttons, visible focus, and explicit names.
8. Four independent continuous L-shaped corner brackets sit fully outside the media, using semantic Navigation-divider Antique Gold `#C5A447` at 55% opacity and a 1px stroke without shadow, glow, or gradient. Mobile uses 8px offsets, 40px arms, and 12px reserved clearance; desktop from `lg` uses 12px offsets, 56px arms, and 20px reserved clearance. Every bracket curve and the image use the same numeric 8px radius at both breakpoints. Brackets are absolute and non-layout, while the wrapper reserves clearance so they never overlay photo pixels. Pagination and pause/play form one centered group 20px below the mobile bracket envelope and 24px below it on desktop. Navigation's independent full-width canonical-gold bottom divider remains unchanged.
9. Storybook includes desktop/mobile, one/two/three slides, progress, paused, reduced-motion, Save-Data, loading, long-content, empty, and image-failure states.
10. Vitest covers behavior and normalization. Playwright covers the integrated H1/CTA, navigation divider, keyboard controls, 320px overflow, reduced motion, console errors, and axe.

## Authoring and failure behavior

In Studio, open Site settings → Homepage → Hero carousel slides. Add two or three images in order, write meaningful alt text, adjust crop/hotspot, optionally add a short caption, and keep Visible enabled. Never place mutable commerce facts in captions. Preview desktop and mobile before publishing.

Fewer than two valid visible slides restores the pre-carousel static Shopify hero. Reverting the code leaves additive Sanity fields harmless.

## Human gates

The product owner/editor must supply and publish final campaign photography. Protected `main` merge remains an explicit human action.

The product owner approved the corner-bracket direction and continuous three-second cadence in code on 6 August 2026. The six HeroCarousel Figma states listed above still show the superseded internal-register treatment and lack the continuous-motion annotations; they must be synchronized before final visual sign-off. Until then, code, `DESIGN.md`, runtime semantic tokens, and Storybook are synchronized while Figma is explicitly pending.

The product owner subsequently approved the exact 220×64 outlined export of `LogoTextLockup` from Figma staging node `302:100`, traced to main component `162:96` and instance child `I296:101;169:2`. Runtime uses the transparent SVG geometry as a semantic-color mask inside the existing accessible home link, preserving Ivory and Midnight Navigation accents. This replaces only browser-rendered lettering geometry; Navigation's full-width semantic gold divider remains independent and unchanged.

Automated browser coverage uses `/e2e-carousel`, a deterministic route that returns not found unless `SHOPIFY_E2E_FIXTURES=1`. It renders the production component and labelled local images without requiring Sanity publication.
