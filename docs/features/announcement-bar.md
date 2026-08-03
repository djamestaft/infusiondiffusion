# Announcement bar

## Outcome

Give every storefront visitor one concise, editor-controlled notice before they reach the page navigation. The first published use is message-only; the component retains an optional link for a future genuine destination.

## Approved design

- [Desktop frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=93-6)
- [Mobile frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=93-12)
- Figma component: `AnnouncementBar`
- Code component: `AnnouncementBar`
- Storybook: `Components/AnnouncementBar`

## Acceptance criteria

1. When the Sanity announcement is enabled and has a non-empty message, it appears above the holding-page navigation.
2. When it is disabled, missing, or blank, no announcement container or empty space renders.
3. Editors can supply a message up to 100 characters and may optionally pair a link label with an HTTP(S), root-relative, email, or telephone destination.
4. The first published announcement is message-only and non-dismissible. Rotation, scheduling, personalization, persistence, Shopify state, and analytics are out of scope.
5. Desktop content remains a 44px-high centered strip. Mobile content may wrap and grows without clipping.
6. Optional links are keyboard accessible, show a visible focus treatment, and provide a minimum 44px target. Approved foreground/background pairs meet WCAG AA.
7. Storybook documents message-only, linked, long-content, and hidden states. Vitest covers rendering and failure behavior; Playwright and axe cover the integrated page at desktop and mobile sizes.
8. Disabling the Sanity field is the content rollback. Reverting the feature pull request is the code rollback.

## Ownership

- Sanity owns enabled state, message, and optional link content.
- Next.js owns rendering and URL safety.
- Figma owns the approved visual contract.
- Storybook owns the reusable component states.
