# INF-58 — Scent consultation design contract

19 September 2026. Designer: motion_design. User delegated intermediate design approval; parent accepted this direction for preview. This is implementation-ready design approval, not a claim of deployed runtime verification. No repository files were edited by the designer.

## Shape and decision

Three approaches were considered: (1) a refined simultaneous questionnaire, which remains efficient but gives every choice equal visual weight; (2) an immersive full-screen scent journey, which adds atmosphere but would make text, short laptops and rapid navigation harder; (3) the selected editorial consultation, one spacious question at a time with an atmospheric desktop companion and source-explained results. Select (3): the existing Marcellus/Manrope typography, ink/sage/gold palette and actual photography establish the premium character; motion clarifies progression rather than delaying it.

Intentional divergence from historical Approved guide frames: simultaneous chips become a dedicated introduction and five sequential ruled-choice panels; the review becomes a photographic editorial list and editable preference summary. Questions, options, matching truth, availability behavior, product routes, existing invitation and shared storefront shell remain intact. No new brand palette, icon family, invented scent facts or rating percentage.

## Figma evidence

File: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa
Exploratory page: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2876-963
The existing Approved page 2004:14 is untouched. Historical guide authority remains 2172:2 (1440), 2457:601 (768), 2457:749 (390), 2457:897 (320). New INF-58 frames below capture the authorized redesign; do not relabel them historical Approved.

| Frame                                        | Node                                | Size      |
| -------------------------------------------- | ----------------------------------- | --------- |
| Intro                                        | 2878:2                              | 1440×900  |
| Room selected                                | 2880:9                              | 1440×900  |
| Intro compact laptop                         | 2887:188                            | 1280×720  |
| Room compact laptop                          | 2883:50                             | 1280×720  |
| Intro mobile                                 | 2881:26                             | 390×900   |
| Room mobile, step navigation                 | 2881:55                             | 390×900   |
| Room narrow mobile                           | 2883:118                            | 320×900   |
| Feeling                                      | 2884:84                             | 1440×900  |
| Notes, two selected                          | 2884:156                            | 1440×900  |
| Presence                                     | 2884:255                            | 1440×900  |
| Time, See suggestions                        | 2884:321                            | 1440×900  |
| Results, actual amber + woods order          | 2885:136                            | 1440×1200 |
| Results mobile                               | 2886:143                            | 390×2200  |
| Unavailable catalog                          | 2886:215                            | 390×1300  |
| Empty matches                                | 2886:267                            | 390×1300  |
| Notes limit feedback                         | 2886:5377                           | 390×1100  |
| Missing answer feedback                      | 2886:5446                           | 390×900   |
| Choice default / selected / focus / disabled | 2877:5 / 2877:9 / 2877:13 / 2877:17 | 600×58    |

Node URLs use `?node-id=2887-188` etc. Actual screenshot artifacts are beside this file: intro-desktop.png, intro-laptop.png, intro-mobile.png, question-desktop.png, question-laptop.png, question-mobile.png, question-320.png, results-desktop.png, results-mobile.png, notes-limit.png, unavailable-mobile.png. They were opened and visually inspected, not merely generated. Some earlier screenshots precede tiny later corrections (mobile count rail on Notes and natural line wrap at 320); live Figma nodes are authoritative.

## Composition and responsive contract

Use the existing live Navigation, announcement, footer and metallic Button. The Figma shell is contextual and not a new header implementation. Some cloned headers show sample DT account state. Do not adopt that sample state or omit live bag/menu controls.

Intro: dark ink surface, large left editorial heading, honest matching explanation, Begin the guide action, then brief five-question reassurance. Authored guide photograph on right, full 2:1 source, no overlay text and no crop that removes bottles. At 1440: 64px gutters, 64px column gap, 560px copy, 688×344 photograph, title56/64, body17/27, action240×52. Five quiet numbered topic labels below align with page gutters. At 1280×720: 40px gutters, 48px gap, copy480px, image672×336, title48/56, body16/26, compact stage510px beneath existing130px shell, sequence80px. These are proof dimensions; runtime should use natural min-height, never fixed-height clipping. At 390:24px gutters, title38/46, body15/24, image342×171, full-width52px action. At320 use20px gutters, title34/42 and natural scrolling.

Question desktop: ink atmospheric companion left, sage decision area right. At1440 the split is552/888; companion64px left/40px right, question64px gutters,48px top/40px bottom,20px vertical gaps. Companion contains a two-line56/64 display phrase, full448×224 source photo,96/112 decorative active-topic word, small topic sequence. Active question44/52, helper15/22, answer labels24/32. Full-row radio choices58px minimum, bottom rule,20px control at right. Gold selected row with ink type/control; there is no card shadow or radius. Continue200×52 opposite Back.

Compact laptop: at viewport heights <=800px and width>=1024, use question36/44,52px minimum rows,12px vertical gaps,24px top/bottom; companion44/52 heading,72/84 word,20px gaps. At1280 split448/832,40px panel gutters,368×184 companion image. The captured complete Room action ends around y600 at1280×720. Notes adds one row; all rows remain available and stage may grow naturally. Never reduce below48px choice target or clip long text to force a viewport fit. At1024 let the split approximate35/65 and reduce side gutters to32; if real content becomes crowded, stack question-only instead of making controls tiny. No sticky/pinned quiz stage and no wheel/touch interception.

Below1024: hide the desktop companion on question screens; show active question, hint, choices and actions in one normal-flow column. At390:24px gutters,32/40 question,22/30 answers,56px rows. At320:20px gutters,30/38 question,20/28 answers,56px rows. Use natural wrapping without authored hard linebreaks. Count plus five progress segments occupies a row of five >=44×44 button targets; segments are merely2px visual strokes inside those targets. Topic names are accessible labels. Completed steps are revisitable; unanswered future steps cannot bypass validation. Back remains visibly available; Continue is explicit and never automatic on selection.

Results: light sage, title56/64 desktop38/46 mobile. Explain the notes-only basis before products. Desktop1440:64px gutters,864px result list +64px gap +384px quiet-surface preference summary. Each result is a complete product link with168px square source photograph,24px gap,32/40 name,15/24 source reasons,13/20 tie note, bottom rule. Use natural row height; Figma206px is sample content only. Mobile: normal-flow list,112px source photograph above28/36 name and15/24 reasons; all content wraps. Summary follows results, not before. Each saved preference has a44px edit control, returning to its populated question. Use labels with meaningful accessible names, such as Edit room. Keep the existing collection invitation and footer after flow content, outside these cropped composition boards.

## Five questions and state behavior

Preserve exact source `guideQuestions` question/option labels and hints. Question1 Room (5choices), Question2 Feeling (5), Question3 Notes (6, max2, native checkboxes), Question4 Presence (3), Question5 Time (4). Do not derive matching from Room/Feeling/Presence/Time. Existing `matchFragrances` remains the authority.

Begin reveals Room and focuses its heading. Each single-choice panel is a fieldset with native radios and a programmatic legend; the visible question is the active page H1. Notes uses native checkboxes, visibly square. Input updates immediately. Continue advances only when the current answer is valid. Continue without an answer keeps the panel and shows a concise inline error (Choose an answer before continuing), focusing the first eligible choice. On the final step the action reads See suggestions. Back and completed-step navigation preserve all selections. Editing from results marks the review stale and requires deliberate See suggestions again; do not leave old matches beside changed preferences.

On a third note attempt preserve the two current selections and show exact existing limit message: Choose up to two note families. Deselect one to choose another. Do not disable every unselected row silently; attempted action receives understandable feedback. Error clears when notes become valid or the relevant selection changes. Error is text and announced politely, not only color.

Rapid Back/Continue/step inputs are semantic operations first. No timed button disabling, animation lock, exit-complete wait or animation-dependent state. Cancel the previous tween and animate the current panel only. Never expose old and new focusable panels simultaneously. Focus the new heading after navigation, while radio/checkbox selection retains focus on the control. Use scroll-margin for sticky shared Navigation, prevent unnecessary jumps on input, and allow natural scroll to newly focused headings when necessary.

Results must preserve current deterministic product order, source reasons, tied notice and unavailable notice. Example frame is Amber & vanilla + Spice & woods: Blanc de Blanc, Noir de la Nuit, Ambre Egyptian, matching current ID tie order. Each shares its rank; no invented top-pick label. Optional `image?: {src,alt}` maps existing Shopify featuredImage. No extra commerce query or scent metadata. Gracefully omit missing/broken images and remove the empty picture column; text and link remain complete. Unavailable products remain linked and marked Currently unavailable. Empty match and unavailable catalog states preserve the full editable summary and collection link, use existing source messages, and do not show fabricated suggestions or skeletons forever.

## Motion contract

GSAP step entrance: new semantic panel is immediately present and usable; animate x from +16px for forward / -16px for back to0, opacity0.72→1, duration320ms, power2.out. Do not fade outgoing controls to zero while keeping focus there. Cancel/rebase previous step tween on rapid input. Progress segment fill settles over240ms power2.out. Selection feedback120ms surface/control color only; native checked state changes immediately. Results entrance once: y12→0, opacity0.8→1, duration320ms power2.out. Avoid row-by-row delays that defer reading.

LERP only on the decorative oversized sidebar topic word: maximum±8px X/±4px Y, damping160ms, fine pointer only. Keep active heading, options, controls and actual product photograph stable. Bounds derive from stable layout, never transformed overflow. Pause existing pose on pointer leave; preserve pose across nav crossings and reentry; reset only on reduced-motion/eligibility cleanup, without scale or background pop. Reuse the proven lifecycle utility if appropriate. Do not introduce a new hero hover engine or scale the guide photograph. Intro can remain static photography; the requested atmosphere comes from layout and visible step motion, not product distortion.

Reduced motion: no translations, easing, pointer tracking or delayed entrance; content fully visible. Touch/coarse pointer: no LERP. Hidden tab/unmount: no continuing rAF or retained listeners. GSAP unavailable or error: ordinary usable form with content visible. No smooth-scroll hijacking, pinning, spring overshoot, typewriter copy or cursor replacement.

## Tokens, craft and accessibility

Reuse Approved semantic collection2039:17 modes2039:1 Sage/Light and2039:2 Ink/Dark. Roles used: surface/canvas18, surface/quiet19, text/primary21, text/secondary22, action/primary24, action/foreground25, action/focus26, border/subtle27, status/error29. Existing Marcellus and Manrope. No palette changes. If implementation adds spacing/motion aliases, document them under guide-specific component/motion tokens while mapping to existing semantic roles; do not add raw one-off hex colors.

Craft-floor review: hierarchy is editorial and choice-first; no stacked rounded cards; serif choice labels remain legible; breathing room responds to available height; photographs retain complete bottles. Sidebar decorative word is aria-hidden; active question carries meaning independently. Native controls, visible focus ring3px offset3–4px, WCAG AA text/selected/disabled contrast, 44px targets. Disabled future progress is visibly distinct and not tabbable; completed progress has accessible step label/current state. Do not disable Continue merely because animation runs.

Content extremes: long translated question/title/option and two-line choices expand rows; long product title/reasons grow rows;320px/200% text/400% zoom reflows without horizontal scroll; large focus rings are not clipped; result link remains meaningful without image; null catalog, empty catalog, unavailable product, one/two/three matches and tied ranks all preserve summary and exit path. The Figma boards depict samples, not fixed CSS heights.

## Storybook and acceptance evidence to implement

ChoiceRow native radio/checkbox: default, selected, focus-visible, disabled, long label. Guide: Intro; each of five questions; notes two selected; third-note feedback; missing answer; Back/step revisit; results with images; missing image; tied results; unavailable product; empty; unavailable catalog; narrow320; compact1280×720; reduced motion. Keep root-owned current flow tests and browser review proportional. Visual approval requires actual screenshot comparison at1440/1280×720/390/320, plus keyboard completion/back/edit and rapid navigation proof; Figma approval alone does not establish runtime correctness.

Remaining runtime questions are implementation verification, not open design choices. Parent owns preview publication and final human review. No additional design approval request is needed under the user's delegation.

## Superseding refinement

19 September 2026 — INF-58 fragrance consultation (delegated preview approval). Figma exploration page 2876:963, introduction 2878:2, question 2880:9, compact 2883:50, mobile 2881:55, narrow 2883:118, results 2885:136 / 2886:143, refinement 2889:195. Intentionally supersedes simultaneous Guide Variation 02; Approved page remains untouched. One native question at a time; ruled answer rows, completed-step navigation, photographic introduction, fixed desktop photograph and decorative topic word. Results show existing Shopify photographs, source reasons and editable preferences. Reset guide returns to the introduction and clears every answer/result/error. Reset occupies its own utility row. Programmatically focused headings have no outline; interactive controls retain visible keyboard focus. Heading/topic transition ±32px over500ms power2.out; answer text y10px over420ms with35ms stagger, hit areas stationary. Text opacity .8→1 preserves contrast throughout. Results y20px over500ms, opacity .85→1. Decorative LERP bounded±8px/±4px, damping160ms; focus anywhere in guide resets it. Reduced motion is immediate. Mobile uses prepaint CSS eligibility, no desktop GSAP import; no late entrance flash. Semantic colors and shared shell unchanged. Source matcher remains notes/character only; other answers are transparently summary-only.
