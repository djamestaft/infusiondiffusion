# INF-58 follow-up — Reset guide, stronger transitions, heading focus

User-requested refinement, 19 September 2026. This supersedes the initial handoff only for reset, entrance motion and programmatic heading focus. All brand/content/matching/responsive/accessibility constraints otherwise remain.

Figma annotation: https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2889-195

Reset guide is now present on all ten question/state frames and all four result/empty/unavailable summaries. The action clears answers, inline errors and reviewed results, returns to the introduction and focuses its heading. It is immediate, with no confirmation dialog or animation-dependent disabling. Keep native keyboard focus on this button.

Updated after runtime review: progression row keeps Back and Continue (final step See my suggestions). Reset guide sits on a separate44px utility row below, preserving breathing room at320px. This implementation refinement is accepted and synchronized to all Figma question frames. In result summaries, place Reset on its own row after the collection link, with clear separation. Earlier followup-question screenshots show the preceding three-control-row study; live Figma nodes and runtime evidence supersede that arrangement.

Accepted expressive entrance: heading directional32px→0 and opacity0.8→1 over500ms, power2.out; answer-label text Y10px→0 and opacity0.8→1 over420ms with35ms stagger; native choice rows and click targets stay stationary and immediately available. The decorative topic word receives a directional32px entrance over500ms; results title/images enter Y20px→0 and opacity0.85→1 over500ms. Mobile follows the same bounded motion language. Reduced motion is instant and fully visible. Existing pointer LERP lifecycle remains independently bounded. Rapid input cancels/rebases previous tweens without gating semantic state or input.

Step, intro and result headings retain programmatic focus and tabindex=-1 for accessible orientation, but never show a visible outline. Do not remove focus-visible styles from native choices, buttons, progress controls, product links or any keyboard-operable control. Figma heading frames intentionally show no ring.

Updated proof frames: compact laptop question2883:50, narrow320 question2883:118, results1440 frame2885:136. Exact frame IDs remain stable. Inspected screenshots:

- followup-question-laptop.png: complete content and all three actions fit1280×720.
- followup-question-320.png: all choices and three separate actions fit320px without collisions.
- followup-results-desktop.png: Reset guide sits after Explore the collection within preference summary.

Bounded runtime review completed at1440×900,1280×720,390×844 and320×844. Evidence: /tmp/fragrance-guide-runtime-review/report.json, screenshots and laptop/mobile videos. No horizontal overflow at question/notes/results; complete source bottles, readable native choice glyphs and appropriate natural scrolling. Reset from results then Begin produced zero checked inputs at all four widths. Programmatic heading outline:none; keyboard Back retained a solid3px ring. Stronger entrance is clearly visible in captured frames.

Two consolidated material corrections sent to root: results-summary collection link and Reset currently touch on one line (use separate44px rows or flex-wrap gap12); mobile first paints new question at final position/opacity1 then one frame later jumps to x32/opacity0.45 when effect enables light motion. Use prepaint/CSS-first eligibility to remove the final→start→final flash while retaining reduced-motion behavior. Confirm only these after correction.

## Confirmation after corrections

Both findings are resolved in the bounded confirmation. At390 and320, the first sampled new Feeling frame already has x32 and opacity0.8 (answer opacity0.8), followed by continuous entrance toward the settled pose; there is no sampled final→start flash. At1440 and390, collection and Reset are separate44px rows with16px clear vertical gap. Screenshots were opened and visually inspected. Evidence: /tmp/fragrance-guide-runtime-review/confirmation.json and confirmed-390/320-transition.png, confirmed-1440/390-summary.png. Final Figma motion annotation2889:195 is synchronized to heading/answer0.8 and result0.85 entrance opacity. No outstanding material designer findings in this review.
