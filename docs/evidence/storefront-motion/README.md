# Home and About motion preview evidence

Date: 19 September 2026. Authority: Devon's explicit delegation of intermediate
G1–G3 decisions, one final Vercel preview review. Production remains unmerged.

## Design and implementation decisions

Figma `jIMvwSBkilg7eplo3IiHPa`, Approved `2004:14`: Home
2349:2/104/207/301 and About 2426:516/614/708/796. Independent design
capture inspected the exact desktop frames; screenshots are in
`/tmp/inf-motion-{home,about}-authority.png`. Dated imagery/carousel amendments
remain authoritative. The motion composition is an intentional candidate
divergence, self-approved for preview under Devon's delegation.

Storybook studies: `motion-fragrance-journey--cinematic`, `--restrained`,
`--hero-study`, `--long-names`, `--missing-images`, `--empty`, `--single`,
`--mobile`, `--small`; templates `templates-combined-about--motion-chapters`
and `templates-storefront--home-motion`. Published campaign imagery is a
read-only 19 September snapshot for motion stories; live routes retain existing
Sanity/Shopify fetching and commerce truth.

Selected: native scroll, desktop measured collection pin, direct linear scrub,
80px decorative name region above opaque product cards, ±32px name drift,
700ms visible 16px hero entrance and decorative-backdrop-only pointer damping
(maximum 6×4px, 120ms time constant, 64ms delta cap, 0.1px cutoff). The existing
three-slide carousel owns its own transforms and 600ms transitions. About uses
local sticky square photographs, ±12px travel, vertically centered copy and
natural text growth. Shared values live in `src/lib/motion/tokens.ts`.

Independent critique corrected illegible name fragments by reserving 80px above
cards, corrected top-aligned About copy, and replaced an ineffective added radial
wash with motion of the existing decorative backdrop. Collection cards now use
`clamp(300px, min(36vw, 100svh - 612px), 440px)` so the complete stage fits below
the measured navigation/announcement. A final content-fit check rejects pinning
for genuinely short or extreme-copy layouts. Mobile/touch/reduced-motion/save-data
never acquire GSAP. Keyboard focus on a later clipped card switches to static.

## Baseline lab profile

Production `67de810`; Chromium151.0.7922.34; five cold runs per route. Viewport
390×844, touch, DPR1, CPU4×,150ms latency,1.6Mbps down,750kbps up; cache disabled.
Initial load plus10seconds; then5second full-page scroll. This measures synthetic
frame cadence, not physical-device/field CWV.

| Route | Median LCP (range) | CLS        | JS transferred | Scroll p95  |
| ----- | ------------------ | ---------- | -------------- | ----------- |
| Home  | 1604ms (1584–1676) | 0.00085314 | 253551bytes    | 17.5–17.6ms |
| About | 2520ms (2332–2572) | 0.00117399 | 298190bytes    | 18.2–18.5ms |

Baseline raw evidence and scripts: `/tmp/inf-motion-baseline/`; full lazy-loaded
screenshots in `production-visuals/`. Candidate metrics and deployed evidence are
added by the coordinating review before final handoff. Proposed budget: no
motion-induced CLS, <=10% median LCP regression and p95 frame interval<=50ms.

## Verification ledger

- Observed initial red: missing damping/runtime modules; then8 behavior tests pass.
- Scoped import cancellation, exactly-once cleanup, failure fallback and live
  preference listeners covered in Vitest. Damping compared at30/60/120Hz.
  -21 targeted motion/About browser Storybook tests pass after independent critique.
- Integrated desktop pin/reversal, keyboard product/skip focus, live reduced
  preference/short resize,10route remounts and gallery focus restoration pass.
- Full source gate, fixture-browser regression, candidate performance, exact-head
  CI and deployed preview checks remain in progress at this implementation snapshot.
- Full gate excludes unrelated untracked generated `output/` in formatting/lint;
  the directory and its contents are preserved without edits.

## Synchronization and residual acceptance

| Layer                               | State                                                            |
| ----------------------------------- | ---------------------------------------------------------------- |
| Figma static frames                 | Intentional divergence: motion candidate, exact frames preserved |
| DESIGN.md / .impeccable/design.json | Selected contract documented                                     |
| Semantic motion values / runtime    | Shared typed contract and semantic ink                           |
| Components / Storybook              | Opt-in stories; existing static contracts preserved              |
| Live Home/About                     | Preview opt-in, existing content/commerce boundaries retained    |

Physical iPhone acceptance (INF-47), final user preview review, human merge and
production smoke remain open. No source content was published. Existing route
streaming behavior without JavaScript is under investigation; do not claim that
full route no-JS acceptance has passed until the final browser record confirms it.
