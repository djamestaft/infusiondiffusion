# INF-58 — Fragrance Guide consultation

Devon requested a complete guide layout rethink on 19 September 2026, after
the PR109 hero correction. The five questions remain; the composition may
change completely. GSAP and LERP should make the experience beautiful and
coherent. Intermediate design approval is delegated; the final preview remains
for Devon's review. Continue on the existing delivery branch and PR, with one
repository writer. No merge, production deployment or source publication.

## Outcome and direction

A customer choosing fragrance for a room should feel personally guided through
five clear decisions, understand why the suggested fragrances appear, and reach
the appropriate product page. The visitor mode is Operate within the existing
luxury editorial identity: task clarity is mandatory, atmosphere supplies character.

The selected direction is a scent consultation: a photographic introduction,
one question at a time, spacious ruled answer rows, five-step wayfinding, a
persistent atmospheric panel on desktop, and a photographic result list above
editable preferences. A scrolling chapter treatment was rejected because it
makes revisiting answers cumbersome; a scent-wheel canvas was rejected because
it obscures native keyboard and multiple-selection behavior.

Retain Marcellus, Manrope, semantic midnight/ivory/gold tokens, current editorial
photography and shared navigation/footer. This intentionally replaces Approved
Guide Variation 02's simultaneous chip fieldsets. The product designer captures
new exploratory frames in the existing Figma file, leaving Approved untouched;
the implementation handoff records exact nodes and measured geometry before UI
implementation. This authorizes a route-specific redesign, not a site rebrand.

## Product and data truth

- Keep all five question titles and choice sets from the current guide.
- Notes allow one or two families; other questions allow one answer each.
- Preserve the approved notes/character matcher, ordering, ties and explanations.
  Room, feeling, presence and time remain preference-summary inputs. Say so.
- Shopify owns product titles, handles, availability and optional featured images.
  Normalize optional images from the existing cached catalog; no new query or
  copied Sanity commerce state. Never suppress a suggestion for missing imagery.
- Sanity remains the editorial-image source. No new care, service, fragrance,
  efficacy or personalisation claims. No synthetic prices or recommendations.
- Retain unavailable and no-match distinctions, useful preferences and Shop links.
- Existing onContinue callbacks receive a copy of the complete answers once per
  explicit result submission. No new analytics provider or collection of answers.

## Observable acceptance

1. The introduction explains the five-question task and exposes a clear Begin
   action plus a direct Shop path. It does not require scrolling through imagery
   to discover the primary action at ordinary laptop sizes.
2. Exactly one question's controls are active in the guided flow. Visible step
   information, Back and Continue make position and next action clear. Navigation
   retains answers; completed steps can be revisited. Invalid progression explains
   what is missing and focuses the relevant controls.
3. Native radio/checkbox behavior works with keyboard and touch. Selection never
   auto-advances. A third note is rejected with a recoverable message; deselecting
   one permits another. Rapid input does not skip steps or leave mixed content.
4. Results precede the complete editable preference summary. Product links and
   supplied explanations remain useful with one, two or three matches, long
   names, sold-out products, missing/failed images and unavailable catalog data.
5. GSAP provides a deliberate short transition between visible question content.
   LERP affects decorative imagery only. No pointer-following input targets,
   scroll hijack, mandatory animated wait or invisible default content.
6. Reduced motion, constrained data, explicit motion pause, keyboard focus,
   hidden/offscreen state, interruption and unmount leave the guide usable and
   stop owned background work. Reuse verified motion lifecycle contracts.
7. Desktop 1440, laptop 1280×720, tablet 768 and phones 390/320 remain readable,
   with no horizontal overflow or clipped answers. Long questions/choices grow
   naturally. All targets are at least 44px, focus is visible, contrast is AA.
8. Reusable controls/results and complete states are verified in Storybook before
   the live route consumes them. Capture Figma/runtime comparison, desktop/phone
   screenshots and motion evidence, then independent visual and code review.
9. Preserve Home/About hero, laptop collection and gallery corrections. The final
   deployed commit receives the original guide journey plus adjacent smoke,
   exact-head CI and an accessible full preview URL. Notify Herdr pane 2.

## Systems and rollback

Next.js owns the flow and rendering; the existing matcher remains pure. Sanity
and Shopify source configuration, cart, checkout, accounts and navigation stay
outside this change. Reverting the INF-58 commits restores Variation 02 without
a source migration. The broader no-JS streaming limitation remains separately
recorded; do not disguise it as a motion fallback pass.

## Delivery record

Plane INF-58 is In Progress, assigned to Devon. Fresh main is 67de810. Prior
motion implementation and hover correction are in PR109; the guide is an
explicit additional scope. Design capture, implementation, visual comparison,
automated gates and final deployed review must each have concrete evidence.

## Final user refinements and implementation contract

19 September 2026 — INF-58 fragrance consultation (delegated preview approval). Figma exploration page 2876:963, introduction 2878:2, question 2880:9, compact 2883:50, mobile 2881:55, narrow 2883:118, results 2885:136 / 2886:143, refinement 2889:195. Intentionally supersedes simultaneous Guide Variation 02; Approved page remains untouched. One native question at a time; ruled answer rows, completed-step navigation, photographic introduction, fixed desktop photograph and decorative topic word. Results show existing Shopify photographs, source reasons and editable preferences. Reset guide returns to the introduction and clears every answer/result/error. Reset occupies its own utility row. Programmatically focused headings have no outline; interactive controls retain visible keyboard focus. Heading/topic transition ±32px over500ms power2.out; answer text y10px over420ms with35ms stagger, hit areas stationary. Text opacity .8→1 preserves contrast throughout. Results y20px over500ms, opacity .85→1. Decorative LERP bounded±8px/±4px, damping160ms; focus anywhere in guide resets it. Reduced motion is immediate. Mobile uses prepaint CSS eligibility, no desktop GSAP import; no late entrance flash. Semantic colors and shared shell unchanged. Source matcher remains notes/character only; other answers are transparently summary-only.

## PR110 merge-gate correction

CI found the 32px entrance translation briefly expanding the 390px document.
The consultation boundary now clips horizontal overflow while preserving
vertical scrolling. Regression tests pause at the entrance start pose and sample
every frame at 390 and 320px. The existing full-route Account/mobile-menu check
also passes. Motion timing, guide content, matching and controls are unchanged.
