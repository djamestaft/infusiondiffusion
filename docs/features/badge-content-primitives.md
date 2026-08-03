# Badge and Content Primitives

Status: Implemented and verified locally

## Summary

Create a small editorial foundation for future storefront sections. `Badge`
identifies concise, non-commerce product or campaign metadata. `Eyebrow`,
`Heading`, and `Lead` provide semantic typography primitives, while
`ContentHeader` composes them with an optional existing action primitive into a
repeatable section introduction.

The visitor mode is Read. Customers should be able to scan a section's subject,
understand its main message, and find an optional next step without decorative
elements competing with product meaning.

## Audience and outcome

- Design-conscious and gift-shopping customers use these patterns while
  scanning collections, product stories, care guidance, and campaign content.
- The primary outcome is a clear, consistent editorial hierarchy that remains
  understandable before sensory language becomes poetic.
- The brand owner benefits indirectly: future Sanity-authored content can enter
  stable presentation contracts without duplicating page-specific typography.

## Decisions

- `Badge` is static metadata, not a control. Initial roles are `neutral` for
  ordinary classification and `accent` for restrained editorial emphasis.
- Typical Badge content is one to three words, such as `New`, `Limited`, or
  `Gift edit`. It never represents Shopify price, inventory, discount, or
  fulfilment state; `CommerceStatus` retains that ownership.
- Badge is compact and disciplined rather than a gratuitous pill. It uses the
  approved label voice, written meaning, and Ivory/Midnight semantic colors.
- `Eyebrow` is optional short context above a heading. It uses the approved
  label voice and does not replace a semantic heading.
- `Heading` separates document semantics from visual size: consumers choose the
  correct HTML heading level and one of the approved display, headline, or title
  treatments. It does not infer page hierarchy.
- `Lead` is an introductory paragraph with greater emphasis than ordinary body
  copy. It remains Manrope and factual enough to clarify the heading.
- `ContentHeader` composes optional Badge or Eyebrow context, one required
  Heading, optional Lead, and an optional existing Button or standalone
  TextLink supplied as content. It owns spacing and alignment, not destination
  logic or analytics.
- Components support Ivory and Midnight modes. They use semantic variables and
  existing typography foundations rather than raw colors or a third typeface.
- The primitives emit no analytics. Consuming sections and journeys own event
  names, destinations, and business context.

## In scope

- `Badge`, `Eyebrow`, `Heading`, `Lead`, and `ContentHeader` in Figma, code, and
  Storybook.
- Default, alternate mode, alignment, responsive, and long-content states where
  applicable.
- Semantic CSS variables needed for the two Badge roles and content hierarchy.
- A composition story proving the primitives with existing Button and TextLink.

## Out of scope

- A general-purpose rich-text or Sanity Portable Text renderer.
- Blockquotes, captions, tables, dividers, arbitrary prose styling, and article
  navigation.
- Product availability, discounts, prices, or promotional claims derived from
  Shopify.
- Interactive, dismissible, selectable, or linked badges.
- Page templates, collection pages, product pages, analytics events, or Sanity
  schema changes.

## Content and responsive contract

- Badge and Eyebrow prove one-word, typical three-word, and intentionally long
  fixture content without clipping. Long metadata wraps as text rather than
  shrinking below the approved label size; consumers should prefer concise copy.
- Heading proves a short single line and a two-line content extreme. Display is
  limited to two short lines by authoring guidance, not destructive truncation.
- Lead proves approximately 80 to 240 characters and maintains a readable
  measure. Content is never ellipsized.
- ContentHeader supports start alignment everywhere and centered alignment for
  intentional campaign or editorial contexts. Reading order remains unchanged.
- Desktop may place an optional action adjacent to the text block when space and
  hierarchy allow. Narrow layouts stack the action after the copy with a clear
  44px minimum target supplied by the existing action primitive.
- At 320px width and 200% zoom, content wraps without horizontal scrolling,
  overlap, clipped text, or a displaced action.

## Acceptance criteria

1. Badge renders concise static metadata with `neutral` and `accent` roles in
   Ivory and Midnight. Its meaning is present in text and it is not focusable or
   announced as a status region.
2. Badge cannot be mistaken in API or documentation for Shopify-owned stock,
   price, discount, or fulfilment state; commerce examples use
   `CommerceStatus` instead.
3. Eyebrow and Lead use appropriate native text semantics. Heading requires an
   explicit semantic level and exposes only the approved display, headline, and
   title visual treatments.
4. ContentHeader renders exactly one Heading and preserves the semantic order of
   context, heading, lead, and optional action in every alignment and viewport.
5. Consumers can omit Badge, Eyebrow, Lead, or action without empty wrappers or
   spacing gaps. The required Heading remains independently usable.
6. Ivory and Midnight variants meet WCAG AA for text and meaningful graphical
   details. No information depends on color, capitalization, or position alone.
7. Long Badge metadata, a two-line Heading, 240-character Lead, translated-like
   expansion, 320px width, and 200% zoom produce no clipping or horizontal page
   scroll.
8. Storybook documents each primitive independently plus ContentHeader default,
   centered, with Badge, with Eyebrow, with Button, with TextLink, Midnight,
   mobile, and long-content compositions.
9. Vitest covers element semantics, explicit heading levels, role variants,
   optional-region collapse, content order, class extension, and ref forwarding
   where the component API supports it. Storybook browser tests and axe checks
   pass for representative compositions.
10. The full local quality gate and bounded desktop/mobile visual comparison
    pass before Preview. A human approves exact Figma Review frames before
    runtime implementation is treated as final.

## Affected systems and ownership

| Layer       | Responsibility                                                            |
| ----------- | ------------------------------------------------------------------------- |
| Figma       | Approved component forms, responsive compositions, and semantic variables |
| `DESIGN.md` | Durable usage rules and exact approved frame links                        |
| Next.js     | Semantic component APIs and presentation                                  |
| Storybook   | Isolated states and composition contracts                                 |
| Shopify     | Unchanged; continues to own commerce truth                                |
| Sanity      | Unchanged; future consumers may supply editorial copy                     |

## Failure and rollback behavior

- Missing optional content collapses cleanly; these presentational primitives do
  not fetch, load, or fail independently.
- Unusually long text wraps and remains available rather than being silently
  truncated.
- Incorrect heading hierarchy is prevented by requiring the consumer to choose
  a semantic level and is covered by stories and tests.
- The change is additive and can be rolled back by reverting the component,
  token, story, documentation, and test commit together. No persisted content or
  commerce data requires migration.

## Verification evidence required

- Exact Figma Review frames:
  - [Desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-3)
  - [Mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-35)
  - [Component masters](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-61)
- Desktop and mobile Storybook screenshots for Ivory, Midnight, centered, and
  long-content compositions.
- Targeted Vitest and Storybook browser-test results with axe evidence.
- Formatting, lint, strict type checking, Storybook production build, and Next.js
  production build.
- A synchronization matrix covering Figma, `DESIGN.md`, semantic CSS variables,
  components, and Storybook.

## Approval record

- Product owner approved the focused component inventory and deferred full rich
  text, Portable Text, blockquotes, tables, and commerce-specific states on
  3 August 2026.
- Product owner approved the exact desktop `196:3`, mobile `196:35`, and
  component `196:61` Figma Review frames on 3 August 2026. The frames were
  promoted to Approved.

## Synchronization status

| Layer                   | Status | Reason                                                    |
| ----------------------- | ------ | --------------------------------------------------------- |
| Figma                   | Synced | Exact approved frames and component masters recorded      |
| Feature brief           | Synced | Product scope and observable contract recorded            |
| `DESIGN.md`             | Synced | Approved contracts and exact Figma links recorded         |
| Runtime semantic tokens | Synced | Badge and content roles map to approved modes             |
| Components and tests    | Synced | Semantic contracts and focused tests pass                 |
| Storybook               | Synced | Required states, browser tests, and production build pass |
