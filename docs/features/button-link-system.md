# Buttons & Links

Status: Delivered and synchronized

## Approved visual source

- Desktop frame `108:146`: https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=108-146
- Mobile frame `108:212`: https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=108-212
- Button component set `99:177`
- TextLink component set `99:206`
- Human approval recorded 2026-08-03.
- Merged in pull request #16 as `f99b6de` on 2026-08-03.
- Post-merge Figma/runtime synchronization audited on 2026-08-03.

## User outcome

Customers can distinguish actions from destinations, understand their relative emphasis, and operate every control by touch or keyboard without losing the restrained luxury character of the storefront.

## Acceptance criteria

1. Button exposes Primary, Secondary, and Quiet roles plus default, large, and 44px square icon sizes.
2. Button colors come from semantic action tokens with approved Ivory and Midnight mappings. Quiet buttons have no persistent border.
3. Button renders native button semantics by default and supports a real child anchor for destinations through `asChild`.
4. Loading preserves the button's width and label footprint, shows a monochrome vector spinner, sets `aria-busy`, and prevents repeat activation. Disabled buttons are non-interactive and retain a legible label.
5. Every Button has a minimum 44px target, visible mode-aware keyboard focus, reduced-motion behavior, and reflows rather than clips long labels. Icon-only usage requires an accessible name.
6. TextLink exposes Inline, Standalone, and Inverse roles. Inline links remain underlined in prose; Standalone links have a 44px target and may carry a decorative trailing monochrome vector icon.
7. TextLink always renders a real anchor with a destination and has a visible mode-aware focus treatment. It deliberately has no disabled API or fake disabled-link state.
8. AnnouncementBar preserves its approved appearance while consuming the shared TextLink focus and interaction contract. The holding-page contact destination uses the approved Button API.
9. Storybook documents component roles, sizes, modes, loading, disabled, focus, long content, responsive behavior, and anchor semantics. Vitest covers semantics and unavailable/loading behavior.

## Out of scope

- Inputs, product cards, navigation, cart, checkout, and commerce state.
- New page composition or changes to holding-page content.
- Direct production deployment.

## Compatibility

The previous Button variant names `default`, `outline`, and `ghost`, plus size `lg`, remain internal compatibility aliases during migration. New code must use `primary`, `secondary`, `quiet`, and `large`. Removing aliases is a follow-up after downstream migration.

## Sync matrix

| Layer               | Source                                                                                               | Status |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------ |
| Figma               | Approved desktop `108:146`, mobile `108:212`, Button `99:177`, TextLink `99:206`, semantic variables | Synced |
| Repository guidance | `DESIGN.md` Buttons & Links contract                                                                 | Synced |
| Runtime tokens      | Semantic action/link variables in `src/app/globals.css`                                              | Synced |
| Components          | `Button`, `TextLink`, AnnouncementBar and holding-page migrations                                    | Synced |
| Storybook           | `Components/Button`, `Components/TextLink`, existing integration stories                             | Synced |

The Figma semantic collection uses scoped Ivory/Midnight variables with web code syntax matching `globals.css`. Button and TextLink masters consume those variables. TextLink documents Default, Hover, Active, and Focus only; unavailable destinations are omitted or rendered as explanatory text rather than disabled links.
