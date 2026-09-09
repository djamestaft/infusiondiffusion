# INF-34: approved Home, shared shell and Cart

## Acceptance and authority

Devon authorized merging PR #72 and continuing implementation on 9 September.
Main was refreshed to 9615957. INF-33 is complete; INF-34 is In Progress on one
delivery branch, agent/inf34-approved-home-shell-cart.

Figma file jIMvwSBkilg7eplo3IiHPa, Approved page 2004:14, section 2484:736:
Home 2349:2/104/207/301; Cart 2360:238/280/316/352. Supporting section 2484:737
contains shared footer 2358:82, responsive variants 2356:62 and
2357:67/81/95, and CartLine 2362:310. A read-only designer capture supplied
the exact component values and responsive copy before implementation.

Preserve all approved Home sections, shared Shop-format cards, Shopify cart
behavior and editor-supplied Sanity content. Remove Gallery from navigation,
retain its route pending the combined About implementation, and keep final
photography, factual enrichment, care content and SEO publication deferred.

## Component inventory

| Component/source                        | Approved nodes                            | Storybook                                                                                  | Delivery                                                                                                                            |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Navigation; storefront-destinations.ts  | Home headers 2349:3/105/208/302           | Components/Navigation, menu and keyboard states                                            | Shared four destinations, title-case desktop links, thin gold divider, MENU before Cart                                             |
| Footer; footer.tsx                      | 2358:82 and responsive variants           | Components/Footer at four widths                                                           | One reusable footer for templates, Cart and account; frame-centered desktop links, evenly spaced tablet links, centered mobile logo |
| HeroCarousel                            | Home hero media within 2349:2/104/207/301 | Components/HeroCarousel, PlainEmpty and failure/motion states                              | 5:4 cover frame for plain media and its failure fallback; retain keyboard and pause controls                                        |
| HomeContent; templates/home-content.tsx | Home 2349:2/104/207/301                   | Templates/Storefront Home widths, long content, missing/empty data, editor-hidden sections | Approved section order, measurements and shared product cards                                                                       |
| CartLine; cart/cart-line.tsx            | 2362:310                                  | Commerce/Cart line, updating, unavailable and interaction states                           | Contained 88×118 media, title/format/price order, square 44px quantity targets                                                      |
| CartSummary; cart/cart-summary.tsx      | 2408:516/517/518/519                      | Commerce/Cart gated/enabled states                                                         | Heading 16px above quiet panel, 24px panel padding, 20px gaps, truthful checkout gate                                               |
| CartPage/CartShell                      | 2360:238/280/316/352                      | Commerce/Cart page and errors                                                              | Responsive columns/stack, dynamic count and shared footer; preserve optimistic recovery                                             |

## Responsive contracts

Home gutters are 64/40/24/20 at 1440/768/390/320. Its collection retains
3/4/3/3 visible cards; Shop independently renders the full catalogue.
The sequence is hero, collection, room guidance, bespoke image, 200 ml / Made
to linger, Artistry, service reassurance, gold collection invitation, footer.

The hero media remains 5:4 with 56px desktop text separation and 24px in stacked
layouts. Existing carousel controls are a functional addition to Figma's static
image proofs: multiple slides add a control row instead of compressing media.
Existing scroll-reveal behavior and reduced-motion support remain.

Footer heights are 274/210/282/282. Desktop/tablet use a 104px main row,
24px copyright gap and 18px copyright line. Padding is 64/32/24/24.
Desktop navigation is centered to the full frame. At narrower desktop widths
the navigation group contracts to maintain 32px clearance from the logo.
Tablet keeps a 156px logo and at least 32px clearance. Mobile links form two
left-aligned columns below a centered 220px logo.

Cart gutters are 64/32/24/24. Desktop content uses flexible lines, 64px gap
and a 360px summary; smaller layouts stack with 32px separation.
Text and long product names grow naturally. Empty/pending/error/unavailable and
enabled/disabled checkout states remain governed by existing commerce logic.

## Content and tokens

Approved fallback room-guidance and longevity copy is synchronized in the
template and Sanity fallback boundary. Existing editor-supplied content is
preserved. Compact approved longevity and invitation copy is used only when
the supplied copy matches the approved default; custom editorial copy is
never silently truncated. No schema, query, source publication or SEO change.

New semantic roles map retained values: content-surface-quiet → sage-100
(#DDE2D4), collection-invitation-surface → gold-300 (#DDC77F), and
cart-checkout-disabled-surface → approved #E8E2D5 (Figma 99:16).
Other primitives, typography families, action treatments and cart state remain.

## Review and verification

Independent code review found two edge cases: plain hero failure geometry and
footer centering near 1024px. Both were corrected and covered by regression
checks. A bounded visual review identified mobile footer alignment, checkout
fill, quantity radii and Home type/spacing corrections; these are implemented.

Local page/footer/Cart captures and measured boxes are in
test-results/inf34-visual. Capture waits for fonts and scrolls to decode images
without changing DOM attributes before hydration. Fixture product order,
images and copy remain test evidence, not final commerce or photography approval.
The Home hero/control-row exception above is explicit. Natural content growth
can exceed static proof heights.

Unit and Storybook checks cover navigation, card selection, plain fallback,
content extremes, cart controls and recovery. Browser checks cover
1440/1024/768/390/320, equal footer spacing, logo clearance, no overflow,
the complete catalogue and real fixture cart actions. The final PR handoff
records command results, screenshots, current-head GitHub quality and preview
verification limits.

| Synchronization layer    | Status                                        |
| ------------------------ | --------------------------------------------- |
| Approved Figma           | Synced authority, unchanged                   |
| DESIGN.md                | Synced to this delivery contract              |
| Semantic tokens          | Synced retained quiet/gold/disabled values    |
| Components and templates | Implemented for INF-34 review                 |
| Storybook                | Updated shared shell, Home and Cart contracts |
| Live editorial content   | Preserved; final publication deferred         |

Human preview review and merge gate release. About/Guide implementation remains
INF-35; Contact and verified Guide matching decisions remain open. This delivery
does not mark those surfaces complete.
