---
name: Infusion Diffusion
description: The Perfumer's Cabinet — a composed luxury home-fragrance identity.
colors:
  ink-deep: "#11110F"
  ink: "#191916"
  ink-soft: "#282823"
  graphite: "#3C3B35"
  bone: "#E8E2D5"
  bone-light: "#F5F1E8"
  porcelain: "#FCFAF5"
  antique-gold-deep: "#A9842D"
  antique-gold: "#C5A447"
  antique-gold-light: "#DDC77F"
  smoked-olive: "#45483A"
  resin: "#633F32"
  error: "#A64237"
  success: "#4E6A50"
typography:
  display:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: 1.111
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.167
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.286
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
  lg: "8px"
  full: "999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
---

# Design System: Infusion Diffusion

## Overview

**Creative North Star: "The Perfumer's Cabinet"**

Infusion Diffusion uses deep contrast, measured gold, tactile materials, and generous quiet to make home fragrance feel composed and intimate. The system is luxurious without becoming ornate, rustic, clinical, or generically wellness-coded. Product meaning remains clear before language becomes poetic.

The approved visual authority is the [Figma Style Guide](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=25-2). Its foundation sections are Cover `25:3`, Brand `26:2`, Color `27:2`, Typography `28:2`, Layout & Material `29:2`, and Photography `31:2`.

The Figma foundations are approved. Repository CSS tokens and components are not yet migrated and must not be treated as equal visual authority until their Figma-to-code sync is completed and verified.

### Figma organization and handoff

- `Style Guide` (`25:2`) is the canonical foundation page. Preserve its numbered
  foundation frames and do not place feature exploration inside them.
- Create feature work on a separate page named `Feature / <feature-name>`. Use
  top-level frames named `<feature-name> / Desktop / <state>` and
  `<feature-name> / Mobile / <state>`.
- Name reusable Figma components to match code and Storybook wherever practical:
  `AnnouncementBar` in Figma, `AnnouncementBar` in code, and
  `Components/AnnouncementBar` in Storybook.
- Mark frames `Exploration`, `Review`, or `Approved`. Only an exact frame link
  marked `Approved` may drive implementation. Record that link in the feature
  brief or pull request.
- Keep design-system components and variables in the canonical file. Feature
  pages should use instances and semantic variables rather than detached copies
  or raw replacement colors.

**Key Characteristics:**

- Composed hierarchy and decisive proportion.
- Black glass, warm metal, wax, vapor, flame, and shadow.
- Precise product language and restrained ornament.
- Luxury for lived-in rooms rather than decorative display alone.

## Colors

Midnight is the signature environment; Ivory provides editorial relief. Gold signals action and precious detail. Smoked Olive and Resin support atmospheric fields rather than arbitrary decoration.

### Primary

- **Antique Gold:** the principal action and precious-detail color.
- **Deep Ink:** the signature immersive surface and primary action in Ivory mode.

### Secondary

- **Smoked Olive:** a quiet atmospheric field for supporting surfaces.
- **Resin:** a warm material accent for editorial depth.

### Neutral

- **Porcelain and Bone:** editorial surfaces and text against Midnight.
- **Graphite and Soft Ink:** layered dark surfaces, subdued text, and borders.

**The Measured Gold Rule.** Gold is a material edge and action cue, not a universal outline or decorative wash.

**The Semantic Pair Rule.** Use the approved Figma foreground/background pairs. Body text must meet WCAG AA, and focus must remain visibly distinct.

## Typography

**Display Font:** Marcellus (with Georgia fallback)

**Body Font:** Manrope (with Arial fallback)

**Character:** Marcellus gives headings the ceremonial character of engraved packaging. Manrope keeps product detail, navigation, pricing, and commerce controls quiet and legible.

### Hierarchy

- **Display** (400, 72/80): campaign statements and first-view headings; maximum two short lines.
- **Headline** (400, 48/56): page titles and major section headings.
- **Title** (400, 28/36): product, fragrance, and editorial titles.
- **Body** (400, 16/26): default reading text with a target measure of 65–75 characters.
- **Label** (600, 12/16, 0.08em): compact metadata and controls; uppercase is allowed when short.

**The Two-Voice Rule.** Marcellus expresses; Manrope explains and operates. Do not introduce a third decorative type voice.

## Layout

Use a 4px base spacing scale. Desktop compositions use 12 columns with 80px margins and 24px gutters. Mobile compositions use four columns with 20px margins and 16px gutters. The content maximum is 1280px, and every interactive target is at least 44×44 CSS pixels.

Large editorial intervals create ceremony; compact spacing supports commerce controls. Preserve clear reading order, mobile-first behavior, keyboard access, visible focus, content extremes, and reduced-motion preferences.

## Elevation & Depth

Depth is restrained and ambient: Subtle uses a short soft lift, Raised supports floating product or navigation surfaces, and Floating is reserved for overlays requiring clear separation. Prefer tonal layering for ordinary sections.

**The One Depth Signal Rule.** Use a border or a shadow on a surface, not both.

## Shapes

Corners remain disciplined so glass vessels, wax, and product photography provide the softest forms. Use 2–4px radii for controls and ordinary surfaces, 8px only for larger contained regions, and full rounding only for genuinely circular geometry or compact pill controls.

Borders are hairline by default. Ornament must derive from the approved logo geometry rather than unrelated flourishes.

## Components

`AnnouncementBar` is the first approved Figma component and proves the component-to-code handoff. Its approved [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=93-6) and [mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=93-12) frames map to `AnnouncementBar` in code and `Components/AnnouncementBar` in Storybook.

`Button` and `TextLink` are approved in the Buttons & Links [desktop frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=108-146) and [mobile frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=108-212). Their canonical Figma component sets are Button `99:177` and TextLink `99:206`, mapping to `Components/Button` and `Components/TextLink` in Storybook.

Buttons use three roles: Primary for the decisive action, Secondary for a bordered alternative, and Quiet for a low-emphasis action without a persistent border. All roles support default, large, and square icon sizes in Ivory and Midnight modes. Controls keep a 44px minimum target, restrained 4px corners, uppercase Manrope labels, mode-aware focus outlines, and stable dimensions while loading. Loading buttons announce busy state and suppress repeat activation. Disabled styling reduces emphasis without erasing the label. Use real buttons for actions and `asChild` with a real anchor for destinations; icon-only controls require an accessible name. Icons are monochrome SVG line icons, never emoji or Unicode stand-ins.

Text links use real anchor semantics and remain underlined. Inline links live in prose; Standalone links have a 44px minimum target and may include a trailing monochrome vector icon; Inverse links retain contrast on Midnight surfaces. Links have no disabled state: if a destination is unavailable, render explanatory text or omit the link instead of faking a disabled anchor.

The action and link variables in `globals.css` are semantic, mode-aware mappings. Gold is reserved for action emphasis, link emphasis, and focus—not a default border on quiet or tertiary controls. The legacy Button names `default`, `outline`, `ghost`, and `lg` remain temporary aliases for migration safety and must not be used in new work.

Build the remaining components in this order: inputs and focus states, product card, navigation, then commerce-specific compositions. Component names must map to Storybook titles and code component names wherever practical.

Every reusable component must document default, hover/focus, disabled, loading, error/empty, long-content, and responsive states where applicable. Extend the existing shadcn-based primitives instead of creating duplicate low-level controls.

## Do's and Don'ts

### Do:

- **Do** let typography, product imagery, proportion, and material contrast carry the identity.
- **Do** keep scent format, notes, size, care, safety, price, stock, and delivery information concrete.
- **Do** preserve true product proportions and controlled gold highlights in photography.
- **Do** show diffusers, sprays, and candles as one coherent family.

### Don't:

- **Don't** use towels, stacked stones, scattered florals, or other familiar spa shorthand as the default photographic world.
- **Don't** introduce generic AI-design tells: purple gradients, glowing surfaces, gratuitous pills, nested card grids, or vague decorative copy.
- **Don't** crop caps, flames, spray triggers, or reed tips when the image's job is product recognition.
- **Don't** change Figma, `DESIGN.md`, runtime tokens, or Storybook in isolation; follow the synchronization workflow in `.agents/skills/design-to-storybook/SKILL.md`.
