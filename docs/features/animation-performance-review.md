# Animation performance investigation — 12 September 2026

Scope: investigate reported laptop animation judder without changing the approved
motion. Counter alignment, 11px gold type and image borders are separate visual fixes.

## Controlled local observations

Headless Chromium, 1280 × 900, device scale factor 2, no CPU throttle. A production
build at 0735deeb and the development worktree used the same real Home content.
Each run waited for network idle and fonts, then scrolled at 500px/s for ten seconds.
Six sections had reveals. Disabling reveals was a temporary browser-only experiment.
These are single warm runs, not a statistically robust benchmark or a measurement
of the user's Mac GPU, Safari, cold image decoding, or Core Web Vitals.

| Environment | Reveals  | Main-thread task time | Style recalculation | Frames over 34ms |
| ----------- | -------- | --------------------- | ------------------- | ---------------- |
| Production  | Enabled  | 357ms                 | 115ms               | 0                |
| Production  | Disabled | 169ms                 | 3ms                 | 0                |
| Development | Enabled  | 331ms                 | 109ms               | 0                |
| Development | Disabled | 158ms                 | 3ms                 | 0                |

All four runs had no long tasks and approximately 17.6–17.7ms p95 frame intervals.
Development was not slower in this warmed comparison. Do not attribute the user's
report to development mode based on these results.

Six production carousel transitions with the edge mask enabled had no frame gaps
above 34ms and 125ms task time; removing the mask also had no such gaps and 150ms
task time. This test does not implicate the mask. It does not rule out GPU-specific
raster/compositing costs on the user's device.

## Findings and next candidates

1. **Section reveals are the clearest measured extra work.** In `src/app/globals.css`,
   whole-section opacity and clip-path transitions last 2.2–3.5 seconds, with child
   translations lasting 2.8–3.3 seconds and an additional 240ms delay in unveil.
   `HomeRevealFlow` applies these across large sections. Several animations can
   overlap while scrolling. The experiment roughly halves task time when these
   are disabled, but does not establish dropped frames. First optimization candidate:
   shorter, smaller content reveals, avoiding whole-section clipping where possible.
2. **Carousel movement itself uses transform, not animated layout dimensions.**
   Its 600ms motion and temporary edge mask showed no measurable frame problem here.
   Retain this behavior until a device trace provides contrary evidence.
3. **Cold image loading remains untested.** Only the first campaign is prioritized;
   other images load lazily. A slow first transition could involve fetch/decode.
   Also the desktop `sizes` hint caps at 600px while the wide layout can render about
   669px, which merits a separate responsive-image audit for sharpness and transfers.
   Do not preload every image without measuring bandwidth and decoding costs.
4. **Event handlers merit cleanup only if profiling supports it.** Navigation's
   passive scroll callback and carousel's document pointer listener call boolean
   state setters frequently. This alone does not prove a React render on every event.
   The reveal controller also alternates initial geometry reads and writes and
   creates one observer per section; these are bounded setup costs, not confirmed
   causes of sustained judder.

No performance behavior was changed. Next verification should capture a real
13-inch Mac trace during the reported interaction, including a cold first slide
change, before comparing a shorter reveal implementation against this baseline.
