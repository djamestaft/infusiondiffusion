# Dialog, drawer, and feedback-state system

Status: approved and implemented on 3 August 2026.

Figma Review sources:

- [Dialog desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-3)
- [Drawer desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-20)
- [AlertDialog and feedback states](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-33)
- [Dialog mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-66)
- [Drawer mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-83)

## Summary

Create reusable interruption and feedback primitives so customers can complete
focused storefront tasks, confirm consequential actions, and understand system
outcomes without losing context. This slice establishes a modal `Dialog`, a
responsive side `Drawer`, a destructive `AlertDialog`, and a static inline
`FeedbackAlert` for informational, success, warning, and error messages.

The visitor mode is Operate. The system should feel composed and unmistakably
Infusion Diffusion, but clarity, focus management, and recovery take precedence
over decorative expression.

## Decisions

- `Dialog` supports a title, optional description, content, close control, and
  an action area. It is for focused but reversible tasks.
- `Drawer` enters from the inline end: right in the current left-to-right
  locale. It supports the same content hierarchy as Dialog and is intended for
  cart, filters, and other context-preserving tasks. It is not the existing
  full-height mobile navigation implementation.
- `AlertDialog` is reserved for consequential confirmation. Its title states
  the consequence, its body explains impact, and its least-destructive action
  receives initial focus.
- `FeedbackAlert` is a non-interactive inline region with `info`, `success`,
  `warning`, and `error` variants. Every variant uses written text plus a
  monochrome vector icon; meaning never depends on colour alone.
- Transient toast notifications, banners, form-field errors, loading overlays,
  and Shopify-specific cart behavior are out of scope.
- Components support Ivory and Midnight modes and compose the approved Button
  primitive rather than introducing duplicate actions.
- Default motion is a restrained opacity transition for the overlay plus a
  short scale or translation transition for the surface. Reduced-motion mode
  removes spatial movement and keeps an immediate state change.
- No analytics event is emitted by the primitives. Consuming journeys own
  event names and business context.

## Content and layout contract

- Typical titles are 2–7 words; descriptions are one or two short sentences.
  Review states also prove a two-line title and approximately 300 characters of
  body copy without clipping or action overlap.
- Desktop Dialog is centered and deliberately narrower than editorial content.
  Mobile Dialog keeps viewport margins and may scroll internally when content
  exceeds the available height.
- Desktop Drawer is a right-side panel sized for task content, never a disguised
  full page. At narrow mobile widths it occupies the viewport while preserving
  safe-area insets and a visible close control.
- Dialog and Drawer actions align to the inline end on wider screens and stack
  with full-width 44px-minimum targets on narrow screens. AlertDialog presents
  cancel before the destructive confirmation in reading and tab order.
- FeedbackAlert uses a compact icon/content composition, a visible heading when
  supplied, and body copy that can wrap without horizontal overflow. It is not
  a decorative pill.

## Acceptance criteria

1. Opening Dialog, Drawer, or AlertDialog moves focus inside, contains keyboard
   focus, prevents background interaction and scrolling, and restores focus to
   the opener after dismissal.
2. Dialog and Drawer close through their visible close control and Escape.
   AlertDialog has no ambiguous close icon, treats Escape as cancellation, and
   does not dismiss through outside interaction; Cancel remains the explicit
   visible exit.
3. Every overlay has an accessible name. Descriptions are associated when
   present, and close/icon-only controls have accessible names and 44px minimum
   targets.
4. AlertDialog initially focuses Cancel, uses a visibly destructive confirmation
   action, and remains understandable without colour. Loading or disabled
   actions preserve stable layout and suppress repeat activation through the
   existing Button contract.
5. FeedbackAlert exposes ordinary informational content without a live region
   by default. Consumers may opt into `status` for newly completed outcomes or
   `alert` for urgent errors; the primitive never announces content twice.
6. Ivory and Midnight variants meet WCAG AA for text, icons, borders, overlay
   separation, and focus indicators. Focus remains visible at 200% zoom.
7. Long titles, long body copy, stacked actions, viewport-height content, and a
   320px-wide viewport do not clip controls, create horizontal scrolling, or
   hide the close/cancel path.
8. Storybook documents default, long-content, keyboard focus, open/closed,
   loading/disabled actions, each feedback tone, Midnight, reduced-motion, and
   desktop/mobile compositions where applicable.
9. Vitest covers semantics, focus entry/containment/return, Escape and outside
   dismissal, scroll locking, AlertDialog cancellation, feedback roles, and
   accessible naming. Playwright covers an integrated open/act/close journey.
10. The full local quality gate and desktop/mobile Storybook inspection pass
    before Preview. A human approves exact Figma Review frames before runtime
    implementation is treated as final.

## Ownership and failure behavior

- Next.js owns component behavior and presentation.
- Storybook owns isolated visual and interaction contracts.
- Figma owns the approved visual contract and semantic variable definitions.
- Shopify and Sanity do not own primitive state or copy in this slice; future
  consuming journeys pass normalized commerce or editorial content.

If optional descriptions or secondary actions are absent, layout collapses
without empty gaps. If content exceeds the viewport, the title and exit path
remain reachable while the content region scrolls. If JavaScript fails before
an overlay opens, its trigger must not imply that a task completed.

## Verification evidence required

- Exact approved Figma desktop, mobile, and state frame links.
- Targeted Vitest interaction and accessibility suites.
- Storybook browser tests, axe checks, and production build.
- Formatting, lint, strict type checking, and Next.js production build.
- Desktop and mobile screenshots covering Ivory, Midnight, long content,
  keyboard focus, and reduced motion.
- Integrated Playwright evidence for focus restoration and scroll locking.

## Approval record

- Product owner approved the primitive scope and deferral of toast notifications
  on 3 August 2026.
- Product owner approved the desktop, mobile, drawer, confirmation, and feedback
  Figma Review frames on 3 August 2026. The frames were promoted to Approved.

## Synchronization status

| Layer                   | Status |
| ----------------------- | ------ |
| Figma                   | Synced |
| Feature brief           | Synced |
| `DESIGN.md`             | Synced |
| Runtime semantic tokens | Synced |
| Components and tests    | Synced |
| Storybook               | Synced |
