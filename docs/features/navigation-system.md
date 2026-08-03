# Navigation system

Status: Visual design and reusable runtime implementation complete; awaiting pull-request review.

## Summary

Create the reusable global storefront navigation that helps customers reach products, fragrance guidance, brand information, and contact content without implying that unfinished commerce features already work. The navigation must carry the actual Infusion Diffusion logo and remain clear, compact, and keyboard-operable across mobile and desktop.

## Decisions

- Primary destinations are Shop, Fragrance Guide, About, and Contact. The component receives destinations as props; this phase does not create those routes or their content.
- Navigation uses the approved editable `LogoTextLockup`: Marcellus `INFUSION` with `DIFFUSION` beneath it between short rules. The original ornamental artwork remains preserved as a brand asset but is not the navigation default.
- Desktop uses a horizontal navigation beneath the optional AnnouncementBar. Mobile uses a menu button and a full-height modal drawer with the same link order.
- The mobile drawer has a visible close control, focus containment, Escape dismissal, scroll locking, and focus return to its opener. Reduced motion removes non-essential movement without removing state feedback.
- Account and cart are persistent commerce utilities on desktop and mobile. Each uses a 44px target and an accessible name; cart quantity is optional and must only render from real commerce state. Search remains deferred.
- Desktop navigation is 104px tall with 32px horizontal insets. Mobile navigation is 80px tall with 20px horizontal insets; utility controls group beside the menu control rather than reducing its target.
- Navigation exposes Ivory and Midnight modes. It does not own page-level sticky behavior, announcement content, analytics, authentication, or cart state.
- Active destination is optional and communicated by text treatment plus `aria-current="page"`, never color alone.
- Hover and current destinations use an explicit two-pixel underline with six pixels of separation from the label; keyboard focus remains a distinct full target outline.

## Acceptance criteria

1. Desktop navigation renders the actual Infusion Diffusion logo linked to home, followed by Shop, Fragrance Guide, About, and Contact destinations in that order, then 44px account and cart controls.
2. Mobile navigation renders the logo plus 44px account, cart, and menu controls. Activating the menu opens a full-height modal drawer containing the same destinations and an at-least-44px close control.
3. The drawer is named for assistive technology, traps focus while open, closes with Escape or the close control, restores focus to the opener, and prevents background scrolling.
4. Every destination is a real anchor with a useful accessible name. The current destination uses `aria-current="page"`; hover, active, and focus-visible states are legible in Ivory and Midnight modes.
5. Empty or malformed destination input fails safely: no blank anchors render, the logo home destination remains available, and the mobile menu control is omitted when no valid destinations exist.
6. Long labels, four destinations, 200% text zoom, and 320px through desktop widths do not cause clipping or horizontal page overflow. Desktop may move to the mobile pattern before labels collide.
7. The actual logo preserves its aspect ratio and useful accessible name. Its raster implementation is responsive and optimized; replacement with the future vector master does not require a component API change.
8. Storybook documents desktop Ivory/Midnight, active link, hover/focus, mobile closed/open, keyboard journey, long labels, and empty navigation. Vitest covers semantics, safe destinations, active state, open/close behavior, focus restoration, and Escape dismissal.
9. Figma defines canonical Navigation and MobileNavigation components, semantic variables, and Approved desktop/mobile review frames before runtime implementation begins.
10. This phase adds no Shopify client, speculative cart count, search UI, authentication flow, Sanity schema, analytics event, new public route, or page-level sticky behavior. Account and cart destinations remain injected navigation contracts until their journeys are built.

## Affected systems

- Figma: Navigation components, semantic variables, responsive frames, and exact canonical logo reference.
- `DESIGN.md` and `.impeccable/design.json`: durable rules after visual approval.
- Runtime: reusable global navigation and accessible mobile drawer primitives.
- Storybook and Vitest: responsive, interaction, accessibility, failure, and content-extreme states.
- Roadmap: record Navigation as the active Phase 4 slice.

## Out of scope

- Building Shop, Fragrance Guide, About, Contact, search, account, cart, checkout, or menu-content routes; this slice only exposes account and cart navigation entry points.
- Live cart counts, predictive search, authentication, mega-menu merchandising, localization switching, and page-level sticky/scroll behavior.
- Reconstructing or redrawing the logo. The approved raster-backed Figma source is used until the owner supplies the vector master and licence record.

## Provisional source record

- Canonical Figma Brand frame: `26:2`.
- Infusion Diffusion primary logo lockup: `26:7`, 580×378, now bound to the owner-provided transparent image fill.
- The logo source is approved visual artwork but not the outstanding vector master tracked in the roadmap.

## Approval record

- Product owner approved Shop, Fragrance Guide, About, and Contact as the provisional primary destinations on 3 August 2026.
- Product owner approved the full-height mobile drawer and deferral of search and live cart state on 3 August 2026.
- Product owner explicitly required the real Infusion Diffusion logo in navigation on 3 August 2026.
- Product owner requested a thicker selected-state underline with more label separation on 3 August 2026; hover and current states now use a 2px rule with a 6px gap.
- Product owner requested an editable, higher-contrast text-lockup exploration on 3 August 2026. The exploration uses approved Marcellus typography, stacks `DIFFUSION` beneath `INFUSION`, retains short rules on either side, and removes the ornamental border and corners.
- Product owner requested a slimmer navigation bar with a deliberate right inset on 3 August 2026. Desktop is now 104px tall with 32px horizontal insets; mobile is 80px tall with 20px insets while retaining 44px controls.
- Product owner confirmed that account and cart icons are required commerce utilities on 3 August 2026. Both now appear in desktop and mobile compositions with accessible target labels; the cart is shown without a speculative quantity.
- Account and cart controls use matching 44px targets and 1.5px strokes. Their glyphs are optically balanced rather than mechanically identical: the profile uses a narrower shoulder arc so it reads as a person at navigation size.
- Product owner approved the navigation designs and selected the editable text lockup as the preferred navigation logo on 3 August 2026.

## Figma review record

- Desktop Approved frame: [Navigation / Desktop / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-169).
- Mobile Approved frame: [Navigation / Mobile / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-215).
- Link-state Approved frame: [Navigation / States / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-193).
- Approved text logo: [Navigation / Logo / Approved — Text Lockup](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=162-121), backed by editable `LogoTextLockup` component set `162:120`.
- Canonical component sets: NavigationLink `157:101`, Navigation `157:124`, and MobileNavigation `157:167`.
- Semantic variable collection: `Navigation / Semantic` (`VariableCollectionId:157:78`) with Ivory and Midnight modes.
- Figma visual approval: approved by the product owner on 3 August 2026.

## Verification record

- Unit suite: 43 tests passed, including navigation semantics, malformed destinations, Escape dismissal, scroll locking, focus containment, and focus restoration.
- Storybook browser suite: 65 tests passed in Chromium with accessibility checks across Ivory, Midnight, mobile, long-label, and empty-destination states.
- Full local gate: formatting, lint, TypeScript, unit tests, Storybook browser tests, Storybook production build, and Next.js production build passed.
- Impeccable detection reported no findings for the navigation component, text lockup, or navigation tokens after approved logo sizes were added to the design system.
- The Storybook accessibility gate identified the original Ivory gold at 3.34:1 for small logo text. Runtime tokens and approved Figma sources now use accessible deep gold `#735716`; the rerun passed.
