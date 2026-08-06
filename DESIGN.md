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
  sage-base: "#EEF0E7"
  sage-elevated: "#E3E7DA"
  sage-quiet: "#DDE2D4"
  antique-gold-deep: "#A9842D"
  antique-gold-accessible: "#735716"
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
  navigationLogoPrimaryMobile:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.28em"
  navigationLogoPrimaryDesktop:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.28em"
  navigationLogoSecondaryMobile:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.333
    letterSpacing: "0.24em"
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

The Figma foundations and responsive Home, Collection, Product detail, and Editorial templates are approved. AnnouncementBar, Button, TextLink, Input, Textarea, Field, ProductCard, Navigation, PriceDisplay, CommerceStatus, Dialog, Drawer, AlertDialog, FeedbackAlert, Badge, Eyebrow, Heading, Lead, and ContentHeader are synchronized with their approved Figma sources and composed by `Templates/Storefront` in Storybook; remaining provisional holding-page styles are not approved brand truth.

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

Midnight is the signature environment; Mineral Sage provides the approved light editorial environment. Gold signals action and precious detail. Smoked Olive and Resin support atmospheric fields rather than arbitrary decoration.

### Primary

- **Antique Gold:** the principal action and precious-detail color.
- **Deep Ink:** the signature immersive surface and primary action in Ivory mode.

### Secondary

- **Smoked Olive:** a quiet atmospheric field for supporting surfaces.
- **Resin:** a warm material accent for editorial depth.

### Neutral

- **Mineral Sage:** the light-mode canvas and sticky navigation use `#EEF0E7`; elevated surfaces use `#E3E7DA`, and quiet feature fields use `#DDE2D4`.
- **Porcelain and Bone:** inverse text against Midnight and retained warm neutral references.
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

The approved navigation `LogoTextLockup` is the current production storefront mark and is brand lettering rather than editorial hierarchy. Its canonical [220×64 outlined SVG export](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=302-100) comes from main component `162:96` and source instance `I296:101;169:2`. Runtime uses that transparent, path-outlined asset as a mask at its intrinsic 220:64 ratio so browser font metrics cannot alter its geometry while the semantic Navigation accent supplies Ivory `#735716` or Midnight `#C5A447`. It is decorative inside the existing accessible home link. The preserved ornamental artwork remains deferred reference material and must not be reconstructed without a separately approved master.

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

Buttons use Primary for the decisive action, Secondary for a bordered alternative, and Quiet for a low-emphasis action without a persistent border. Destructive is a restricted fourth role for explicit consequential confirmation such as AlertDialog; it must never replace Primary merely to attract attention. All roles support default, large, and square icon sizes in Ivory and Midnight modes. Controls keep a 44px minimum target, restrained 4px corners, uppercase Manrope labels, mode-aware focus outlines, and stable dimensions while loading. Loading buttons announce busy state and suppress repeat activation. Disabled styling reduces emphasis without erasing the label. Use real buttons for actions and `asChild` with a real anchor for destinations; icon-only controls require an accessible name. Icons are monochrome SVG line icons, never emoji or Unicode stand-ins.

Text links use real anchor semantics and remain underlined. Inline links live in prose; Standalone links have a 44px minimum target and may include a trailing monochrome vector icon; Inverse links retain contrast on Midnight surfaces. Links have no disabled state: if a destination is unavailable, render explanatory text or omit the link instead of faking a disabled anchor.

The action and link variables in `globals.css` map one-to-one to the Figma `Buttons & Links / Semantic` collection. Both use Ivory and Midnight modes, scoped color roles, and web code syntax. Gold is reserved for action emphasis, link emphasis, and focus—not a default border on quiet or tertiary controls. Ivory TextLink hover uses accessible deep gold `#735716`; every interactive state must pass WCAG AA on the actual Storybook canvas, not only its default state. TextLink exposes Default, Hover, Active, and Focus states and deliberately omits Disabled. The legacy Button names `default`, `outline`, `ghost`, and `lg` remain temporary aliases for migration safety and must not be used in new work.

`Input`, `Textarea`, and `Field` are approved in the Inputs [desktop frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=118-18) and [mobile frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=118-19). Their canonical Figma component sets are Input `119:224`, Textarea `119:297`, and Field `119:340`, mapping to the identically named Storybook titles and code primitives.

Text and email inputs plus textarea use native controls, a 44px minimum editable target, restrained 4px corners, and the `Inputs / Semantic` Ivory/Midnight variables. Focus uses a two-pixel gold outline with offset; invalid fields keep that focus treatment while using a mode-aware error border and explicit `Error:` message. Read-only controls remain focusable, disabled controls do not, and textarea remains vertically resizable. Field owns the persistent visible label and automatically associates its active description or error with the control. Required status is native and visible; optional status is written in the label. Supporting text is replaced when an error is present.

`ProductCard` is approved in the Product Cards [desktop frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=134-2) and [mobile frame](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=134-188). Its canonical Figma component set is ProductCard `133:255`, mapping to `Components/ProductCard` in Storybook and the `ProductCard` code primitive.

ProductCard is one browse-only product-detail link. It uses inset 3:4 media with 4px top corners and square lower image corners; keyboard focus follows the complete card's 4px corners. The hierarchy is format, a two-line Marcellus product name, a two-line factual scent-note summary, and a stable ZAR price row. Sold out is explicit text and does not disable navigation. Ivory and Midnight use the `Product Cards / Semantic` variables. Brochure imagery and copy are provisional Storybook fixtures only; Shopify will replace their values through the same component contract. The labeled Figma guide and Storybook LongContent story visibly prove the two-line title and scent-note clamps.

On Mineral Sage, ProductCard hover text uses accessible deep gold `#735716`; the brighter Antique Gold values remain material and focus accents rather than small text on the light surface.

`Navigation` is approved in the Navigation [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-169), [mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-215), and [state](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=157-193) frames. It uses the editable Marcellus `LogoTextLockup`, a sticky 104px desktop header with 32px insets, and a sticky 80px mobile header with 20px insets. Light navigation uses Sage Base `#EEF0E7`, continuous with the page canvas, with quiet Sage `#DDE2D4` for neutral edges, accessible deep gold `#735716` for small logo lettering and interaction accents, and an Antique Gold `#C5A447` bottom edge. Midnight uses Antique Gold accents over Deep Ink. Destinations use a 2px gold current or hover rule separated from the label; keyboard focus outlines the full target. Account, cart, menu, and close controls retain adjacent 44px targets on mobile without extra inter-control gaps. The mobile menu is a named full-height modal that contains focus, closes on Escape, locks background scrolling, and restores focus.

`PriceDisplay` and `CommerceStatus` are approved in the Price & Commerce Status [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=181-2) and [mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=181-119) frames. Their canonical component sets are PriceDisplay `178:34` and CommerceStatus `179:42`, mapping to `Components/PriceDisplay` and `Components/CommerceStatus` in Storybook.

PriceDisplay presents normalized Shopify money as Regular, Sale, or From in Compact and Standard sizes. Sale retains both sale and original-price language for assistive technology; a missing compare-at value degrades safely to the current price. Compact price and other small text use the mode's primary foreground where gold would miss WCAG AA; measured gold remains a supporting cue and is permitted for the 24px Standard sale value. ProductCard composes Compact PriceDisplay rather than formatting its own price row.

CommerceStatus presents In stock, Low stock, Sold out, or Pre-order as Inline text with a supporting marker or as a restrained Overlay rectangle. Written status is always present, colour never carries meaning alone, and the status is static information rather than an unsolicited live region. ProductCard keeps ordinary in-stock availability quiet and uses Overlay only when low stock, sold out, or pre-order materially changes purchase expectations. Shopify will own all price, compare-at, inventory, and availability truth; Storybook values remain provisional fixtures.

The responsive storefront templates are approved on the Figma `Feature / Responsive Page Templates` page: the expanded [Home desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-616) and [Home mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=255-638), [Collection light desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-137), [Product detail light desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-294), and [Editorial light desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=203-373), with matching mobile and Midnight-navigation Approved frames recorded in `docs/features/responsive-page-templates.md`. The expanded Home adds service reassurance, an immersive Midnight founder story, qualified longevity guidance, and a closing collection invitation without duplicating Shopify commerce truth. Ordinary light canvases use Sage Base through the semantic content surface rather than hardcoded white; selected feature bands use Sage Quiet. Navigation remains independently selectable as light or Midnight and always retains its semantic bottom divider.

`HeroCarousel` is represented in the [desktop homepage](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-100), [mobile homepage](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-174), [desktop first-slide](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-239), [desktop progress](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-262), [mobile first-slide](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-286), and [mobile progress](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=296-309) frames; those six states are pending synchronization with the product-owner-approved corner-bracket refinement and continuous-motion annotations before final visual sign-off. It isolates one to three 4:5 editorial images from the stable homepage H1, copy, and CTA. Four independent, continuous L-shaped brackets sit fully outside the image: the semantic Navigation divider Antique Gold `#C5A447` at 55% opacity and a 2px stroke, without shadow, glow, or gradient. Mobile uses an 8px offset, 40px arms, and 12px reserved clearance; desktop from `lg` uses a 12px offset, 56px arms, and 20px reserved clearance. Every bracket curve and the photograph use the same numeric 8px radius at both breakpoints; brackets must never overlay image pixels. Visible caption/position text is omitted; assistive technology retains slide identity and count. Pagination and pause/play controls form one centered group beneath the bracket envelope with a 20px mobile or 24px desktop gap and retain 44px targets. In an ordinary session, autoplay begins on load and continuously loops across valid slides every three seconds with a 500ms opacity crossfade and a progress ring that resets for each slide. Hover does not interrupt motion. Focus within, document hiding, offscreen positioning, explicit Pause, manual pagination, reduced motion, and Save-Data stop or disable autoplay as appropriate. `Components/HeroCarousel` in Storybook records its responsive, interaction, content-extreme, loading, empty, and failure contracts.

`Dialog`, `Drawer`, `AlertDialog`, and `FeedbackAlert` are approved in the Dialogs & Feedback [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-3), [drawer](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-20), [state](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-33), [mobile dialog](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-66), and [mobile drawer](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=188-83) frames. Their canonical Figma sources are Dialog `190:33`, Drawer `190:55`, AlertDialog `190:64`, and FeedbackAlert `190:113`, mapping to identically named Storybook titles and code primitives.

Dialog and Drawer preserve page context behind a mode-aware scrim, contain focus, lock background interaction, close through Escape and a visible 44px control, and restore focus. Drawer enters from the inline end and becomes viewport-width on narrow screens. AlertDialog omits an ambiguous close icon, focuses its least-destructive action first, treats Escape as cancellation, and does not dismiss through outside interaction. FeedbackAlert uses distinct, restrained tonal surfaces plus a hairline tone edge, written meaning, and monochrome vector icon for Info, Success, Warning, and Error; Ivory uses neutral, softened green, pale gold, and warm error fields while Midnight uses Bone, softened green, gold, and coral cues over correspondingly tinted dark surfaces. It is ordinary content by default and only becomes a live `status` or `alert` when the consuming journey explicitly requests that announcement. Transient toasts remain deferred until a real journey requires them.

`Badge`, `Eyebrow`, `Heading`, `Lead`, and `ContentHeader` are approved in the Badge & Content Primitives [desktop](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-3), [mobile](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-35), and [component](https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Infusion-Diffusion-Designs-WEB?node-id=196-61) frames. Their canonical Figma sources are Badge `196:66`, Eyebrow `196:68`, Heading `196:70`, Lead `196:72`, and ContentHeader `196:77`, mapping to `Components/Badge` and `Components/ContentPrimitives` in Storybook.

Badge is concise, static editorial metadata in Neutral or Accent roles. It is not interactive, does not announce itself as status, and must never duplicate Shopify-owned inventory, price, discount, or fulfilment meaning represented by CommerceStatus or other commerce compositions. It uses the approved label voice and disciplined 2px corners rather than a decorative pill.

Eyebrow provides optional short context without replacing a semantic heading. Heading requires consumers to choose the correct HTML heading level separately from its Display, Headline, or Title visual treatment. Lead is an emphasized Manrope introduction with a readable measure. ContentHeader composes one Heading with optional Badge or Eyebrow context, Lead, and an existing action primitive. It owns hierarchy, alignment, and responsive spacing—not analytics, destinations, page structure, or editorial data fetching.

Build the remaining components as commerce-specific compositions. Component names must map to Storybook titles and code component names wherever practical.

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
