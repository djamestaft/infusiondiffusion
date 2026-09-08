# Page design approval — 8 September 2026

Devon: “We can approve all pages in exploration now.”

This approves the current customer pages on the main Exploration page in
[Infusion Diffusion Redesign](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2004-14).
The exact frames are promoted intact to Approved, retaining their IDs.
Earlier Approved foundations and historical frames remain as source history.

Approved customer section: `2484:736`; supporting references: `2484:737`.
All 32 moved objects retained dimensions and prototype reaction signatures.
Authored node IDs and copy were preserved; only three contract texts changed
to record approval. Instance hydration was normalized in descendant checks.
The designer inspected the approval overview and desktop/mobile samples.

## Approved frames

| Surface            | 1440       | 768        | 390        | 320        |
| ------------------ | ---------- | ---------- | ---------- | ---------- |
| Home               | `2349:2`   | `2349:104` | `2349:207` | `2349:301` |
| Shop               | `2349:395` | `2349:471` | `2349:540` | `2349:609` |
| Product            | `2349:678` | `2349:725` | `2349:765` | `2349:805` |
| Cart               | `2360:238` | `2360:280` | `2360:316` | `2360:352` |
| About              | `2426:516` | `2426:614` | `2426:708` | `2426:796` |
| Guide Variation 02 | `2172:2`   | `2457:601` | `2457:749` | `2457:897` |

Supporting authority: shared footer `2358:82`, CartLine `2362:310`,
journey state board `2365:522`, drawer proofs `2368:442/485`,
About contract `2427:596`, Guide contract `2458:676` and separate
focus/error references `2460:676`. Reference states stay outside customer
pages. Contact is not present in this set.

## Current page and component contracts

- Preserve the logo, Marcellus/Manrope and existing semantic tokens. Headers
  have a 1px inside gold divider and no Gallery link. About is the combined
  editorial destination; the existing Gallery URL is retained until its
  transition is explicitly defined.
- Home retains its full section sequence, including Fragrance Guide,
  200 ml and Made meaningful by the details. The Home and Shop cards share
  square FILL imagery and a 160px content panel, Marcellus 20px title,
  Manrope 12px format/status and 15px price. Home selection is 3/4/3/3;
  Shop has all six products at every width.
- Shop hero text is centered vertically; the separate catalogue count is
  removed. Product description follows Add to cart with 16px separation.
  Its lower section is Care guidance; final care copy is deferred.
- Cart Order summary sits outside its panel, 16px above and left-aligned.
  Preserve existing cart behavior, totals and truthful checkout state.
- Footer links are Shop, Fragrance Guide, About and Contact. Desktop uses
  15px type with equal visible text gaps in a 516px group centered against
  the full frame. Tablet uses 14px with equal visible gaps beside a 156px
  logo and 32px clearance. Mobile logos are centered above two link columns.
  Copyright is right-aligned.
- About retains the complete two-paragraph Born from fragrance copy from
  `2071:41` and responsive equivalents. The separate Guidance and
  encouragement chapter is removed. The first four campaign images have no
  titles or captions; the five market items retain theirs.
- About uses Home's visible-slide image as a hero placeholder, matching
  inverse text color, with centered heading/lead and a contrast overlay.
  Composed for lived-in rooms uses Botanical left and vertically centered
  text right on desktop; text is above imagery at smaller widths.
- Library occupies a separate section before In the Market: right image,
  vertically centered left copy on desktop; copy above image on tablet/mobile.
  Heading: “Find your fragrance with confidence.” The paragraph in the
  approved frames is accepted editorial copy. Section gaps are 64px on
  desktop/tablet and 40px on mobile. Market Table uses a native 4:3 crop
  retaining the tabletop/products; other market image roles are preserved.
- Guide Variation 02 retains its five-question vertical format and three
  shortlist references. It ends with Home's gold “Six fragrances. A roomful
  of possibility.” CTA and the global footer, not a duplicated product grid.
  Focus/error examples and implementation notes are separate references.
- Guide desktop/tablet Back–progress–Continue controls form one row. Mobile
  progress is above compact buttons: 120×44px at 390, 112×44px at 320,
  centered with 16px separation. Guide hero text/image gaps are 56px desktop
  and 24px tablet/mobile, matching Home.

Use the exact Figma contracts for dimensions, semantic bindings, image crops
and states. Do not infer working quiz logic from static question/shortlist
examples or publish snapshot prices/inventory as editorial truth.

## Evidence and remaining work

Per-change desktop/mobile screenshots and responsive geometry checks are
recorded in INF-32/27 and their Figma contracts. The tablet Botanical/Library
images were rebuilt after the user supplied evidence of client-only clipping;
fresh exports and clean ancestor bounds passed. There is no runtime regression
or assistive-technology claim for these Figma edits.

The approval permits downstream design implementation; it does not complete
that work. Shopify remains commerce truth, Sanity remains editorial truth.
Final photography, outstanding facts/care copy and Sanity SEO remain deferred.
Guide mapping/ranking, arbitrary-answer behavior and supporting states require
implementation decisions and validation. Contact remains to be shaped.

| Layer                                 | Status                                          |
| ------------------------------------- | ----------------------------------------------- |
| Figma current page designs            | Approved; exact frames promoted intact          |
| DESIGN.md and approval record         | Synchronized design authority                   |
| Existing foundation tokens            | Retained; no token change in this approval      |
| Runtime CSS/components                | Pending approved-design implementation          |
| Storybook                             | Pending revised component/state synchronization |
| Source publication, merge, production | Not authorized by visual approval               |

INF-32 visual approval is complete. INF-27 stays open for Contact and remaining
editorial/Guide decisions. Continue with INF-33/34 for the shopping journey and
INF-35 after its remaining dependencies. Before release, compare the actual
preview with these exact frames, verify accessibility and commerce journeys,
and obtain human merge. No direct production deployment is implied.
