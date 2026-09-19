# Fragrance Guide consultation implementation plan

> **For agentic workers:** Use superpowers:executing-plans inline. Root is the
> sole repository writer; product design and final code review are separate
> read-only repository lanes. Intermediate approval is delegated by Devon.

**Goal:** Deliver a beautiful, accessible five-question consultation and honest
photographic recommendations on the existing Vercel preview branch.

**Architecture:** Preserve the pure matcher and server catalog boundary. Compose
native answer rows, step navigation, a decorative atmosphere and result entries
inside the existing TemplateShell. React owns progression; animation decorates
the current state and never decides when inputs can work.

**Tech Stack:** Existing Next.js/React, semantic Tailwind tokens, GSAP, shared
motion lifecycle/damping, Storybook, Vitest and Playwright. No new dependency.

**Spec:** `docs/features/fragrance-guide-motion-brief.md`; the product designer's
exact Figma capture is consumed before styling the new components.

## Global constraints

- Keep all five question titles and choice sets from the current guide.
- Notes allow one or two families; other questions allow one answer each.
- Preserve the approved notes/character matcher, ordering, ties and explanations.
- No merge, production deployment or source publication.
- One repository writer on `agent/storefront-motion-delivery`, PR109.
- All targets are at least 44px, focus is visible, contrast is AA.
- GSAP never controls whether a question can be answered; reduced-motion,
  constrained-data and import-failure paths remain usable.

## Review focus

1. Repeated Continue/Back during a tween must not skip unanswered questions.
2. Editing notes after results must invalidate the old list without losing other
   answers; non-note edits must leave recommendation ranking unchanged.
3. A failed/absent image must preserve recommendation text, link and availability.
4. Keyboard focus must enter the current question/results and never remain in
   removed content; compact/zoomed layouts must keep every control reachable.
5. Motion cleanup must remove all owned work during rapid changes, reduced-motion
   toggles and route navigation; desktop dimensions must not gate basic usability.

## Task 1 — Capture design and make optional photos available

Files: `docs/features/fragrance-guide-motion-brief.md`, design handoff/evidence,
`src/lib/fragrance-guide/{catalog,matching}.ts` and their tests.

Interface: `GuideProduct.image?: { src: string; alt: string }`; the matcher returns
the same image for that product without changing any ranking fields.

- [x] Consume exact Figma nodes, tokens, measurements and state inventory; record
      selected direction and critique under delegated preview approval.
- [x] Add failing catalog tests for image mapping, alt fallback and no-image shape.
      Assert the normalized result, not the mocked fetch call:
  ```ts
  expect(await getGuideProducts()).toEqual([
    {
      id,
      title,
      handle,
      availableForSale: false,
      image: { src: url, alt: `${title} product image` },
    },
  ]);
  ```
- [x] Run targeted Vitest and observe missing-image assertion failure.
- [x] Add optional public image mapping from existing featuredImage only:
  ```ts
  ...(featuredImage ? { image: {
    src: featuredImage.url,
    alt: featuredImage.altText || `${title} product image`,
  } } : {})
  ```
- [x] Compare matches with/without images, stripping only image for equality;
      run catalog/matching tests and retain the original allowlist/failure checks.

## Task 2 — Native consultation controls and progression

Files: `src/components/templates/fragrance-guide.tsx`, adjacent guide control/data
modules and new `fragrance-guide.test.tsx`; component/template stories.

Interfaces: preserve FragranceGuideProps and GuideAnswers compatibility; add an
explicit initial-started story state. Choice rows take a controlled selected flag,
native radio/checkbox attributes and an onChange callback. Step state is React
state; answers persist independently from the currently rendered question.

- [x] Add failing rendered-flow tests for Begin, one current question, validation,
      selection with explicit progression, two-note maximum, Back, revisiting completed
      steps and repeated actions. For example:
  ```ts
  await user.click(screen.getByRole("button", { name: /begin/i }));
  expect(screen.getAllByRole("group")).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: /continue/i }));
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("radio", { name: "Living room" })).toHaveFocus();
  ```
- [x] Run the tests before implementing; the current all-question guide lacks Begin.
- [x] Build native ruled choice rows and five-step navigation in Storybook against
      the Figma capture; then compose the template. Keep controls active during motion.
- [x] Preserve answers with functional updates; validate the active question before
      progression and all answers before results. Focus after state changes, never a
      fixed animation timeout. Restore focus to the first relevant input after errors.
- [x] Run targeted units and control/template Storybook interactions.

## Task 3 — Results and recoverable editing

Files: guide result component/stories, template controller and rendered-flow tests.

Interface: results consume `GuideMatch[]`, complete GuideAnswers, original product
source state and an edit-question callback. Render Shopify image only when supplied.

- [x] Test complete submission and callback data; edit a non-note answer and prove
      product links/order remain identical; edit notes and prove the old list disappears.
- [x] Test one/two/three results, source-null versus empty, sold-out and long titles.
      Test failed image by dispatching its error and asserting the same product link,
      reason and unavailable text remain.
- [x] Build source-explained results above an editable preference summary. Use
      existing EditorialImage/MediaFallback and Button primitives; source images keep
      fixed geometry and load independently of animation.
- [x] Update Storybook result and validation journeys to the intentional guided
      progression, retaining their existing matching and recovery assertions.

## Task 4 — Motion and responsive integration

Files: guide motion composition, template, relevant motion tests and stories,
`tests/e2e/fragrance-guide.spec.ts`, navigation accessibility journey.

Interface: reuse MotionBoundary/MotionControl and scoped useMotionEffect; LERP
is decorative only. React state remains visible without successful motion import.

- [x] Add coverage for rapid state changes and reduced-motion/import-failure
      usability; keep the hero's existing pause/resume/cleanup regressions unchanged.
- [x] Implement short GSAP heading/decorative transitions and bounded atmospheric
      movement against the Figma motion contract. Use scoped cleanup/revert; do not
      animate the hit area of a live answer or conceal HTML pending setup.
- [x] Verify changed stories before integrating the live route. Preserve page data
      loading, metadata and shared shell. Update navigation test to Begin before choices.
- [x] Run guide browser journeys at 1440/768/390/320, keyboard/reduced motion and
      1280×720. Include axe, target geometry, overflow, results and product navigation.
- [x] Capture desktop/phone in one visual inspection batch, fix material findings
      together, then one confirmation pass. Record intentional Figma divergences.

## Task 5 — Evidence and preview delivery

Files: DESIGN.md, .impeccable/design.json, surface brief, roadmap and evidence.

- [x] Synchronize Figma contract, documentation, semantic roles and Storybook.
- [x] Run `pnpm check`, relevant Playwright journeys and Impeccable detector.
- [x] Obtain final independent visual and code review of the guide change; resolve
      material findings with regression evidence and record any residual limits.
- [ ] Commit scoped changes and push existing PR109. Wait for exact-head CI and
      Vercel READY; run `pnpm pr:gate 109` on that head.
- [ ] Verify the complete deployed guide flow in Chromium/WebKit/Firefox, inspect
      real mobile/desktop screenshots and motion recording, and smoke Home/About.
- [ ] Record commit/full URL/tests/visual evidence in PR and Plane, notify Herdr
      pane 2, then hand off for Devon's final review. No merge or production action.

## Execution ledger

19 September: fresh main remains67de810. Prior hover delivery cdc47e9 is verified,
with exact-head CI and PR gate green. INF-58 owns only the newly authorized guide
scope. Root implements inline; designer owns Figma plus read-only visual review;
commerce reviewer accepted the minimal optional-image mapping. All five tasks
remain subject to their stated evidence before completion.

19 September implementation ledger: tasks1–4 complete. Independent review accepted the corrected focus scope, reset and lifecycle behavior. Visual confirmation accepted mobile first-paint motion and separate summary actions. Targeted journeys12/12 and guide stories30/30 pass. Final immutable deployment evidence will be attached to PR109 and INF-58; production and human final approval stay open.
