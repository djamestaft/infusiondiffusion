# Approved design to code

The visual authority is [30 — Redesign / Approved](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2004-14)
in file `jIMvwSBkilg7eplo3IiHPa`. The [8 September approval](features/2026-09-08-design-approval.md)
lists the exact 24 customer frames in `2484:736` and supporting references in
`2484:737`. PR #70 merged that handoff as `b11ad6f`. Earlier pages and retired
files are historical evidence. Layer names containing “Exploration” do not
override the recorded promotion of these exact IDs to Approved.

## Delivery ownership and order

Devon owns INF-35 implementation; INF-33/34 are delivered. Shawnee owns
content preparation and coordinates independent verification under INF-36.
Contact and the notes/character Guide matcher are delivered; final service
content and source decisions remain deferred under INF-28/31/35.
PR #83 consolidates carousel/navigation, interim Contact defaults and this
contract. Use one delivery branch, preserve current approvals and require
independent review, preview acceptance and human merge.

## Atomic implementation sequence

Atomic design describes composition and reuse; existing directories and public
component APIs do not need renaming merely to match the terminology.

| Layer       | Existing starting point                                                              | Required work before composition                                                                                        |
| ----------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Foundations | `src/app/globals.css`; `Foundation/Runtime tokens` stories                           | Confirm semantic roles, typography, spacing, surfaces and focus against retained foundations and current page contracts |
| Atoms       | `src/components/ui`: Button, TextLink, Input, PriceDisplay, CommerceStatus           | Verify applicable default, hover, focus, disabled and content extremes in Storybook                                     |
| Molecules   | Field, ProductCard, CartLine and purchase controls                                   | Compose verified primitives; verify content, loading, unavailable, missing-media and error states                       |
| Organisms   | Navigation, footer, HeroCarousel, product grids, cart summary/drawer, gallery viewer | Reuse shared components across pages; check keyboard behavior, responsive composition and real image-fit rules          |
| Templates   | `src/components/templates/storefront-templates.tsx`; `Templates/Storefront`          | Assemble approved page order and geometry using verified components and deterministic, clearly identified fixture data  |
| Pages       | `src/app/(website)` and existing Shopify/Sanity boundaries                           | Integrate source-owned data, verify async/failure behavior and complete customer journeys                               |

Inventory and reuse before adding a component. Extract a shared unit where the
approved design establishes a reusable responsibility; avoid duplicate page-only
versions or abstractions with no use. The existing TemplateShell composes navigation and page content; reuse
the approved shared footer and its existing INF-34 story coverage. Home and Shop share the approved ProductCard treatment
while retaining different product selections and grid arrangements.

## Per-component acceptance record

Maintain this record in the delivery brief or PR for each changed reusable unit:

| Component/source path              | Approved node and consuming page | Story title and states    | Action: reuse/change/add | Comparison evidence and status                         |
| ---------------------------------- | -------------------------------- | ------------------------- | ------------------------ | ------------------------------------------------------ |
| Fill during the delivery inventory | Exact Figma URL/ID               | Existing or added stories | Explain the actual delta | Screenshot links, tested widths, remaining differences |

Capture dimensions, layout, variables, typography, spacing, assets/crops and
responsive behavior from Figma or the approved structured capture before coding.
The approval table is an authority index, not a replacement for component-level
capture. A complete existing capture can be reused; missing details must be read
from Figma rather than guessed. Do not redesign already approved compositions.

Implement and review changed components in Storybook first, then compose pages.
Stories must render the real source component, import the runtime tokens and
exercise meaningful applicable states: default, hover/focus, selected/disabled,
loading/error/empty, long content, missing media and reduced motion. Interaction
tests should exercise actual user behavior, including keyboard access.

Compare both component and consuming page screenshots with the exact approved
frames at 1440, 768, 390 and 320px where supplied. Match fonts, line wrapping,
spacing, alignment, image crop/fit, section order and interaction hierarchy.
Verify fluid behavior between those widths and content growth; do not force text
into fixed heights that clip real content. The product card's approved panel
geometry must tolerate content extremes.

Use semantic tokens and existing primitives. Preserve approved copy and imagery
roles; technical annotations and design-only care placeholders are not live copy.
Shopify supplies commerce facts and Sanity supplies editorial content. Static
Guide examples do not establish recommendation logic or factual matching.

## Completion evidence

- Record targeted unit/interaction checks, Storybook tests/build and integrated
  Playwright evidence. Run the repository's required local and GitHub gates.
- Check keyboard/focus, 44px targets, AA contrast, reduced motion, no horizontal
  overflow and loading/failure recovery. Verify existing cart/checkout behavior.
- Attach side-by-side or overlay comparison evidence for changed components and
  pages. Screenshot capture or green CI alone does not establish visual fidelity.
  A reviewer must record observed differences and their disposition.
- Finish with a matrix for Figma, DESIGN.md, semantic tokens, components and
  Storybook: `synced`, `pending`, or `intentional divergence` with the reason.
  An intentional visual divergence needs human approval; implementation pending
  is never relabelled synced because the design has been approved.
- Independent review and human merge remain required. Publication, production
  promotion and unresolved content decisions retain their separate gates.

## Consolidation evidence — 9 September 2026

Main was refreshed to `b11ad6f`. Figma MCP metadata returned the approved
customer section `2484:736` and its authored frame tree, consistent with the
merged handoff. This is structural authority verification, not a fresh visual
or runtime audit. Existing primitives, template composition, Storybook viewport
configuration and CI were inspected. This paragraph is historical evidence. INF-33/34 and Contact/initial Guide
matching were subsequently delivered. Current refinements are tracked in
PR #83 and its component contracts.
