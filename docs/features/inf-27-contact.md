# INF-27 / INF-35 Contact delivery

Prepared 9 September 2026 from protected main `d6c2018`, after human-merged
PR #74. Devon approved the revised Contact frames and authorized implementation on 9 September. Design owner: Shawnee; visual
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
  The approved Contact frames are in section `2484:736`, with contract `2532:102` in `2484:737`; original node IDs are preserved.
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
   If the placeholder hero image is unavailable, retain a solid dark surface
   and readable hero text.
6. Reuse actual design-system components and record source/target node IDs,
   composition decisions, screenshot comparison and known limitations outside
   customer frames.
7. Devon approves exact finished Contact frames before runtime implementation.
   That later delivery updates Storybook, retains Sanity metadata ownership,
   tests mailto targets and keyboard/accessibility/responsive behavior, and
   passes the required PR gate before human merge.

## Verification and rollback

The approved Contact layout is implemented in PR #75, preserving existing
Sanity data/metadata and direct-email behavior. Local Chromium checks passed
at 1440/768/390/320 with axe, plus keyboard navigation, 200% zoom/reduced motion
and a blocked hero-image request. The first desktop/tablet run timed out during
cold compilation; the warmed rerun passed all seven checks. Twenty template
unit tests and ten targeted Contact Storybook checks passed. Lint, typecheck
and Impeccable detection passed. Production builds and final CI are recorded
in the PR before handoff. No message was sent or source content published.
The existing live page remains until human merge; reverting this PR restores
the prior layout without a data migration.

## Design handoff

The approved Contact layout uses the approved midnight header/footer. Devon requested
a centered hero heading and introduction over the same placeholder image used
by Shop: /images/homepage-bespoke-diffuser-blurb.png, with the existing collection
hero scrim for readable text. The main email section is centered, including its
heading, address, gold action and helper. The bottom Before you write section
uses Home's invitation surface (collection-invitation-surface / gold-300), and
its text spans the full content rail within the responsive gutters. No new
marketing sections or factual copy are introduced.

| Width | Approved frame                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| 1440  | [Desktop](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-2)       |
| 768   | [Tablet](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-19)       |
| 390   | [Mobile](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-37)       |
| 320   | [Small mobile](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2529-55) |

The approved heading “Contact us by email.” consolidates the current “Email us”
and information-alert heading. The helper retains the mail-application and
message-storage explanation, omitting the redundant sentence “Email is the
intended contact route.” This is approved display-copy consolidation, not a
Sanity publication or a change to the contact channel.

| Layer               | Status                                                       |
| ------------------- | ------------------------------------------------------------ |
| Figma               | Approved exact frames, promoted with IDs preserved           |
| DESIGN.md / brief   | Approved composition and source boundaries recorded          |
| Semantic tokens     | Existing approved roles reused; no new runtime values        |
| Runtime / Storybook | Approved layout, responsive and fallback stories implemented |
| Source content      | Read-only inspection; no publication                         |

The [off-frame handoff](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2532-102)
records source copy, design decisions, behavior and state requirements.
The designer inspected all four responsive screenshots and top-level bounds;
the coordinator independently inspected desktop and mobile compositions.
The email address link has a minimum 44px target, with natural height growth
specified for long addresses. The existing Shop photograph is a user-requested
placeholder, not final Contact imagery. No new tokens or source mutations are
introduced.

Final revised frames measure 1440×1167, 768×994, 390×1220 and 320×1295. All four email
targets are 44px high; primary actions are 48px high. Nested overflow and
font-mismatch checks returned no findings. Final captures:
[desktop](evidence/inf27-contact-1440.png) and
[mobile](evidence/inf27-contact-390.png).

The hero reuses Shop image nodes `2349:405/544`, image hash
`caf5cbcb8c998c1d7137be59874787e1178c997e`, with centered cover and the 54% ink
scrim. The gold section matches Home invitation `2349:89`, using existing
`#DDC77F` / gold-300. The bottom text spans 1312/688/342/280px content rails.
The designer checked all revised frames; the coordinator re-inspected the
desktop/mobile captures. Centered alignment, unchanged copy, existing fonts
and no nested horizontal overflow were confirmed.

## Runtime comparison and review

The designer independently compared all four rendered screenshots and reviewed
the changed Contact components. No material design/accessibility blockers were
found. Minor browser/Figma text-wrap and pixel-height differences are accepted
rendering differences, without clipping. Browser interaction/axe checks were
run by the coordinator, not independently rerun by the designer.

Runtime captures: [desktop](evidence/inf27-contact-runtime-1440.png) and
[mobile](evidence/inf27-contact-runtime-390.png). All four viewport captures
loaded the hero image and had zero horizontal overflow.

Component mapping: ContactTemplate consumes approved frames 2529:2/19/37/55
on /contact; ContactHeroMedia removes failed decorative media while preserving
the solid dark hero. ContactLoadingTemplate and ContactErrorTemplate reuse the
midnight shell and existing recovery semantics. Templates/Storefront contains
Contact published/fallback, tablet, mobile/small, long content, missing hero,
loading and error stories.
