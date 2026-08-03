# Input and focus system

Status: Approved and implemented; awaiting pull-request review and merge approval.

## Summary

Create the first production form-control slice for the storefront: single-line text and email inputs, textarea, and their shared label, optional/required indicator, supporting text, and validation message. The system must make customer details and editorial form content easy to enter and correct in both Ivory and Midnight contexts without implying that checkout or customer accounts are in scope.

## Decisions

- This slice includes text input, email input, textarea, and shared field anatomy.
- Select, checkbox, radio, search, quantity, password, file, date, and commerce-specific controls are deferred.
- Native `input` and `textarea` semantics remain authoritative; reusable field composition supplies visible labels, descriptions, and errors.
- Figma, `DESIGN.md`, semantic CSS variables, code components, and Storybook use matching Input, Textarea, and Field names once approved.
- No analytics are required for low-level primitives. Feature-level forms may add analytics later without changing these contracts.

## Acceptance criteria

1. Input and Textarea support default, hover, focus-visible, filled, disabled, read-only, and invalid states in Ivory and Midnight modes; Textarea also demonstrates multiline overflow and user resizing behavior.
2. Field renders a persistent visible label and can associate supporting text or one validation message with its control. Required status is exposed semantically; an optional marker is explanatory rather than decorative.
3. Invalid controls use `aria-invalid` and an associated error message. Error is never communicated by color alone, and supporting text is replaced or clearly superseded when an error is present.
4. Every editable control has a minimum 44px target, a mode-aware focus indicator, readable placeholder and disabled treatment, and WCAG AA text contrast. Keyboard focus is not obscured or removed.
5. Long labels, long values, long validation messages, autofill, and narrow mobile widths reflow without clipping or horizontal page overflow. Desktop and mobile contracts use the approved grid margins.
6. Native input behavior is preserved: email retains the appropriate input type and mobile keyboard hint, read-only remains focusable, disabled is not focusable, and browser validation is not substituted with visual-only state.
7. Storybook documents all applicable states, both modes, long content, and mobile behavior. Vitest covers semantics and associations; Storybook interaction tests cover keyboard focus and invalid messaging.
8. Implementation does not expose secrets, introduce commerce state, or add a page-level form. Reverting the delivery commit is the code rollback; no content or data migration is required.
9. The Figma frames must be explicitly marked Approved and linked here before implementation is treated as final. A Vercel Preview and integrated Playwright journey are deferred until a real page consumes the primitives.

## Affected systems

- Figma: canonical component sets and semantic variables for Field, Input, and Textarea.
- `DESIGN.md` and `.impeccable/design.json`: approved durable behavior and visual rules.
- Runtime: semantic form tokens and shadcn-aligned primitives under `src/components/ui`.
- Storybook and Vitest: component contracts, interaction behavior, accessibility, and content extremes.

## Out of scope

- Submission, server actions, persistence, analytics events, authentication, newsletter enrollment, cart, checkout, and Sanity schema changes.
- Select, checkbox, radio, combobox, search, quantity, password, file, and date controls.

## Approval record

- Scope approved by the product owner on 3 August 2026.
- Figma desktop Approved frame: [Inputs / Desktop / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=118-18).
- Figma mobile Approved frame: [Inputs / Mobile / Approved](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=118-19).
- Canonical component sets: Input `119:224`, Textarea `119:297`, Field `119:340`.
- Human visual approval recorded on 3 August 2026; both review frames are marked Approved.

## Delivery evidence

| Surface             | Evidence                                                                                                                                       | Status  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Figma               | Approved desktop `118:18`, mobile `118:19`, Input `119:224`, Textarea `119:297`, Field `119:340`, and scoped Ivory/Midnight semantic variables | Synced  |
| Repository guidance | `DESIGN.md`, roadmap, and `.impeccable/design.json`                                                                                            | Synced  |
| Runtime             | Semantic field tokens plus native `Input`, `Textarea`, and composed `Field` primitives                                                         | Synced  |
| Storybook           | All applicable states, both modes, long content, narrow widths, focus, resizing, and invalid association                                       | Passing |
| Verification        | Formatting, lint, types, 32 Vitest tests, 50 Storybook tests, Storybook build, and Next production build                                       | Passing |

No page-level form consumes these primitives yet, so Preview and integrated Playwright coverage remain intentionally deferred under acceptance criterion 9.
