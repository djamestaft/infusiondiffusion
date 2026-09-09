# INF-27 Contact design

Prepared 9 September 2026 from protected main `d6c2018`, after human-merged
PR #74. User authorized continuing Contact. Design owner: Shawnee; visual
approval: Devon. Parent coordinates repository evidence on
`agent/inf27-contact-design`; the designer edits Figma only.

## Outcome and boundaries

A customer with a fragrance, care, delivery or product-choice question can
identify the existing contact address and open their mail application.
This is a service page within the approved storefront visual system.
The primary action is direct email; a visible, selectable address also works
for visitors who use webmail. There is no web submission or success state.

Preserve the existing source content and contact behavior. No new mailbox,
phone, physical address, opening hours, response-time promise, policy terms,
contact form, new backend, analytics events or source publication is included.
Current mailbox verification and final service facts remain INF-28 decisions;
their deferral does not authorize changing the observed public address.

## Existing source and authority

- Sanity `siteSettings.contactEmail` supplies the mailbox. Production currently
  exposes `dione.smith@infusiondiffusion.co.za` in both email links.
- The existing route validates the address and retains its existing
  `hello@infusiondiffusion.co.za` fallback. This does not establish that the
  fallback mailbox is monitored.
- Sanity editorial Contact data supplies title, introduction and sections,
  with repository fallback in `src/sanity/lib/editorial-pages.ts`.
- Existing title: “Let’s talk fragrance.”
- Existing introduction: “Questions about scent, care, delivery, or choosing
  a room fragrance? Email us directly and we’ll help you find the clearest
  next step.”
- Preserve “Before you write” and its current product-name / sensitive-details
  guidance. “Contact us by email” is a recorded approval in INF-28 A4.
- Exact responsive design authority is Figma
  `jIMvwSBkilg7eplo3IiHPa`, current Approved page `2004:14`.
  New Contact frames belong on Exploration `2004:8` until Devon approves them.
- Reuse the approved shared header/footer, Marcellus/Manrope, semantic colors
  and corrected gold primary button material. Mark Contact current.

## Observable acceptance

1. At 1440/768/390/320, show one H1, readable introduction, clear email action,
   visible selectable address, quiet mail-application guidance and existing
   support copy in a coherent reading order.
2. Both email links target the same source-owned mailbox. Do not simulate a
   sent-message state or claim that the website receives a submission.
3. Preserve email readability at 320px and with unusually long addresses;
   no clipped text or horizontal overflow. Keep touch targets at least 44px.
4. Define semantic heading order, keyboard focus, contrast and reduced-motion
   requirements. No new motion is required.
5. Show or specify loading, page failure, content extremes and missing/invalid
   contact-data handling, preserving the current route's safe fallback boundary.
6. Reuse actual design-system components and record source/target node IDs,
   composition decisions, screenshot comparison and known limitations outside
   customer frames.
7. Devon approves exact finished Contact frames before runtime implementation.
   That later delivery updates Storybook, retains Sanity metadata ownership,
   tests mailto targets and keyboard/accessibility/responsive behavior, and
   passes the required PR gate before human merge.

## Verification and rollback

This delivery prepares design and repository evidence only. Figma bounds,
text/image visibility and desktop/mobile screenshots must be inspected.
Those checks do not establish runtime accessibility. Existing Contact remains
live throughout review. No runtime rollback, content publication, spending,
customer communication or production deployment is part of this preparation.

## Design handoff

Contact exploration uses the approved midnight header/footer and a compact,
text-led introduction. The email address and gold action form the primary
contact block; existing writing guidance follows. Photography and additional
marketing sections are unnecessary for this direct service task.

| Width | Exploration frame                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| 1440  | [Desktop](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-2)       |
| 768   | [Tablet](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-19)       |
| 390   | [Mobile](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-37)       |
| 320   | [Small mobile](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-55) |

The proposed heading “Contact us by email.” consolidates the current “Email us”
and information-alert heading. The helper retains the mail-application and
message-storage explanation, omitting the redundant sentence “Email is the
intended contact route.” This is proposed display-copy consolidation, not a
Sanity publication or a change to the contact channel.

| Layer               | Status                                                     |
| ------------------- | ---------------------------------------------------------- |
| Figma               | Contact exploration; awaiting Devon's exact-frame approval |
| DESIGN.md / brief   | Proposed composition and source boundaries recorded        |
| Semantic tokens     | Existing approved roles reused; no new runtime values      |
| Runtime / Storybook | Existing Contact retained until visual approval            |
| Source content      | Read-only inspection; no publication                       |

The [off-frame handoff](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2532-102)
records source copy, design decisions, behavior and state requirements.
The designer inspected all four responsive screenshots and top-level bounds;
the coordinator independently inspected desktop and mobile compositions.
The email address link has a minimum 44px target, with natural height growth
specified for long addresses. No photography, new tokens or source mutations
were introduced.

Final frames measure 1440×1129, 768×994, 390×1220 and 320×1295. All four email
targets are 44px high; primary actions are 48px high. Nested overflow and
font-mismatch checks returned no findings. Final captures:
[desktop](evidence/inf27-contact-1440.png) and
[mobile](evidence/inf27-contact-390.png).

Changed-document formatting and diff checks pass. These are design/documentation
checks, not runtime accessibility evidence. Keyboard behavior, contrast under
browser rendering, loading/error behavior and mail handling still require
verification during implementation after Devon's approval.
