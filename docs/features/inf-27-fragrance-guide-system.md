# INF-27 Fragrance Guide system exploration

## Selected design — 8 September 2026

Devon subsequently selected and approved the main-Exploration Variation 02
responsive pages: `2172:2`, `2457:601`, `2457:749`, `2457:897`.
See the [dated approval handoff](2026-09-08-design-approval.md).
The card-by-card experiment documented below remains on its separate
exploration page; it is not the selected implementation target.
Product matching remains a separate unresolved content/behavior decision.

Status: design exploration authorized and created on 8 September 2026;
interaction verification and owner review remain pending.
Owner: Shawnee. Design, question copy and product-matching approval: Devon.

## Outcome and scope

Help customers explore the six current 200 ml reed diffusers through one
question at a time. The user explicitly requested selectable answer cards
and a Next action on a separate Fragrance Guide exploration page.

Use [the existing Figma page](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2153-3),
named `eploration-fragrance guide system`. Preserve concepts `2152:2` and
`2172:2`; add the new flow beside them. Current Home approval and other
shopping-journey frames are outside this change.

New section: `2411:7`. Question-one idle/selected entry frames:

| Width | Idle        | Selected    |
| ----- | ----------- | ----------- |
| 1440  | `2411:10`   | `2411:41`   |
| 768   | `2411:343`  | `2411:374`  |
| 390   | `2411:676`  | `2411:707`  |
| 320   | `2411:1009` | `2411:1040` |

Final prototype connections, state coverage and screenshot evidence are
recorded in the section's Figma contract and INF-27 before review.

The current public route uses a Sanity-backed Editorial template and has no
questionnaire engine. Existing source concepts supply five draft preference
questions: room, feeling, note families, presence and time of day. Their
product mappings are explicitly provisional and must not become product facts.
Do not reuse legacy candle or room-spray options for this six-diffuser launch.

## Observable acceptance

- Each screen presents one question and its answer cards, with step progress.
- Selection is visible through a marker and border, not color alone.
  Selecting an answer does not advance automatically.
- Next remains unavailable until an answer is selected. Back returns to the
  previous question with answers retained.
- Note families allow up to two choices; No preference is exclusive.
  Other steps use single selection. Copy explains the selection rule.
- The final action leads to a result layout with a real catalogue reference
  and clear edit/restart paths. Final matching rules require owner approval.
  Do not invent match percentages, scent facts, safety or performance claims.
- Provide default, selected, keyboard-focus and selection-limit states.
  Document loading, unavailable results and recovery behavior for future code.
- Show responsive 1440, 768, 390 and 320 layouts with readable wrapping,
  at least 44px controls and no content overlap.
- Build a connected review prototype where supported; record exactly which
  paths are interactive and which remain state illustrations.
- Future implementation must use semantic radio/checkbox groups, labeled
  questions, keyboard controls, focus transfer to the next question,
  progress announcements and reduced-motion behavior.

## Boundaries and deferred decisions

This task changes Figma and the design brief only. Next.js will own future
interaction state; Sanity will own approved question/editorial content.
Any product references use Shopify IDs; prices, availability and commerce
remain Shopify truth. No schema, source publication, analytics integration,
new photography, runtime route or deployment is authorized by this trial.

Proposed analytics for later review are guide start, step completion,
completion and result click. No email collection or personal data is needed.
Answer persistence is session-local for the design contract; a durable saved
profile is outside scope. A future failed result fetch should retain answers
and offer retry plus a direct Shop route.

INF-27 may explore this format before INF-32 is fully approved under the
user's latest instruction. Its existing INF-32 dependency still governs final
editorial approval and INF-35 implementation. Final question wording,
recommendation rules and exact frame approval remain human decisions.

## Verification and synchronization

Inspect desktop/mobile screenshots, all-width bounds, selection and Next/Back
connections, completion and restart. A Figma prototype is not evidence of
runtime accessibility, real matching or live inventory.

Figma: exploration in progress. DESIGN.md, semantic CSS tokens, runtime
components and Storybook: pending exact design approval; no implementation
authority changes in this trial. Rollback is removal of the new exploration
section; prior concepts and the public route are preserved.
