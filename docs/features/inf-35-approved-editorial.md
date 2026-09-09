# INF-35 approved editorial delivery

Owner: Devon. Delivery branch: `agent/inf35-approved-editorial`.
Base: protected main `33a826c`, after merged INF-33/34.

## Acceptance

- Implement combined About from approved Figma `2426:516/614/708/796`,
  with the complete Born copy, development, principles, confidence section,
  four image-only campaign figures and five captioned market figures.
- Preserve Sanity content and rights filtering, Home's first visible hero image,
  scoped gallery viewing, Escape/Close and focus restoration. Keep /gallery.
- Build Guide Variation 02 from `2172:2`, `2457:601/749/897`: five vertical
  questions, single-choice groups, at most two note families, responsive controls,
  shortlist presentation and the existing gold closing invitation.
- Verify components and templates in Storybook before route integration.
  Cover empty/missing media, long content, keyboard and responsive behavior at
  1440/768/390/320; compare against the exact approved Figma frames.

Visual authority is the [dated approval](2026-09-08-design-approval.md), with
About contract `2427:596` and Guide contract `2458:676`. The existing
navigation, footer, Button, semantic tokens and GalleryViewer are reused.
The earlier AboutTemplate remains historical story evidence; CombinedAboutTemplate
is the current approved composition.

The audience is a customer learning the brand story or considering a fragrance.
About uses a reading-led sequence with integrated campaign imagery and a
complete market gallery. Guide remains a preference-led interface; static
ranking examples do not authorize a matching engine.

## Boundaries and gates

Contact design, verified Guide matching, final photography/facts/care/SEO and
source publication remain open or deferred. Sanity publication is paused.
No new commerce integration or unverified recommendation mapping is permitted.
Devon approved About and authorized Guide preview integration on 9 September.
Guide now supplies preference controls, validation and a summary on its route.
Recommendations are explicitly unavailable, with a collection link instead.
This is an intentional user-approved divergence from Figma's sample shortlist.
No arbitrary-answer rankings are implemented. About uses the existing source fetches without publishing content.
Independent review, required GitHub quality, preview and human merge remain
release gates. INF-35 is not complete from this bounded preparation alone.

## Verification

Initial 14 Storybook checks passed. About fallback passed Chromium at
1440/768/390/320, including axe, metadata, current-page navigation and content.
The first cold route run timed out; the warm rerun passed all four.
The full unit run encountered seven worker-start timeouts; the bounded-worker
rerun passed all 226 tests across 40 files. All 267 Storybook checks across
27 files passed. Formatting, lint, typecheck and the Next production build
passed. Storybook production build passed on retry after an external Google
Fonts download failure. The initial formatting gate rejected Windows checkout
CRLF; local normalization to LF produced no unrelated Git content changes.
The targeted Impeccable detector returned no findings.

Delivery is [draft PR #74](https://github.com/djamestaft/infusiondiffusion/pull/74).
GitHub quality and the corresponding PR gate must pass for the final commit.
Vercel deployed implementation commit `a0086e4` successfully. Browser requests
to preview /about and /api/health both redirected to Vercel login, so
authenticated preview route and health verification remain pending.

## Component mapping

| Component                    | Figma source                                                | Stories and consuming route                                  | Change                                                                                   |
| ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| CombinedAboutTemplate        | 2426:516/614/708/796; 2427:596                              | Templates/Combined About; /about                             | Approved chapter/market composition, missing-media and long-content states               |
| GalleryViewer                | About campaign and market figures; existing viewer contract | Combined About/Gallery Keyboard and existing Gallery stories | Optional About presentation; scoped viewer and focus restoration reused                  |
| FragranceGuideTemplate       | 2172:2; 2457:601/749/897; 2458:676                          | Templates/Fragrance Guide Variation 02; /fragrance-guide     | Five questions, two-note validation, Back and callback; sample shortlist only in stories |
| TemplateShell, Button, fonts | Shared approved foundation/header/footer                    | All new templates; existing stories                          | Shell reused; app font definitions also loaded by Storybook                              |

Published Sanity has no About document and no authored Born story in its current
site settings: existing approved fallback copy supplies those values. The new
confidence paragraph is the approved Figma fallback, not a Sanity publication.
Gallery and hero imagery come from live source-owned fields. Story fixtures
record the rights-confirmed public gallery snapshot from 9 September.
The hero image follows Home's current first visible slide; this provisional
source can differ from the historical image frozen in Figma.

| Layer                                            | Status                                                     |
| ------------------------------------------------ | ---------------------------------------------------------- |
| Figma                                            | Approved exact frames; no design mutation                  |
| DESIGN.md                                        | Current bounded implementation recorded                    |
| Semantic CSS                                     | Guide roles mapped to captured values; retained foundation |
| Components                                       | About and Guide integrated; matching remains unavailable   |
| Storybook                                        | Responsive/state stories and production build passed       |
| Source publication / Guide release / human merge | Pending named gates                                        |

## Visual comparison

The final batched inspection uses the shared app fonts. All eight About/Guide
captures at 1440/768/390/320 had zero horizontal overflow, missing images or
page errors. [Geometry evidence](evidence/inf35-geometry.json) records each
rendered image box. Compared chapter order, column proportions, campaign 3:4,
market 16:9/4:3, Table crop, responsive hero spacing and stacked Guide controls.
The implementation preserves natural text growth rather than fixed clipping
heights. The Storybook font omission, native green progress bar and incorrect
unselected answer surface were corrected in the batched follow-up.

- [About desktop](evidence/inf35-about-1440.png)
- [About mobile](evidence/inf35-about-390.png)
- [Guide desktop](evidence/inf35-guide-1440.png)
- [Guide small mobile](evidence/inf35-guide-320.png)

The live hero follows its current source, as noted above. Guide inputs and
focus/progress now work locally; Back preserves answers and Continue validates
all five preferences. No ranking is computed from those answers. The three
ranked examples exist only in explicitly documented Storybook fixtures.
Devon approved About on 9 September. Independent review and Guide visual acceptance remain pending.

## Guide route follow-up ? 9 September 2026

User authorized integrating Variation 02 into the preview with working preferences
and recommendations pending. Four Chromium viewport flows passed, including
keyboard, two-note rejection, Back persistence, summary, no rankings, overflow
and axe. Desktop/mobile route captures show all images loaded. Metadata remains
Sanity-owned; no content publication or product matching was introduced.

## About image sizing refinement

Devon requested slightly smaller first-four images so each fits on screen.
The campaign figures now center within their columns, retain the 3:4 frame,
and cap width at calc(75svh - 96px), limiting height to the viewport minus 128px.
Devon found the initial 70% height cap too small and requested near-full-height
images while scrolling; that intermediate cap and the 480px width cap are superseded. Contain fitting
preserves the full image. This user-directed refinement supersedes the initial
Figma full-column sizing; Figma frame synchronization remains pending.

Button rendering correction: primary link labels must match the product Add to
Cart foreground. Keep the decorative gold material behind all content within
the isolated button stacking context, including plain-text anchor labels.
Components/Button/Primary Link Parity records native/link visual parity.
