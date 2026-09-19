# Motion performance comparison

Candidate: `3ba4c8e`, baseline: `67de810`. Five cold-cache Chromium runs per route.

| Comparison                     | Median LCP baseline → candidate | LCP change | +10% guardrail | CLS baseline → candidate | Transferred JS change | Candidate scroll p95 range |
| ------------------------------ | ------------------------------- | ---------- | -------------- | ------------------------ | --------------------- | -------------------------- |
| /                              | 1604 → 1984ms                   | 23.7%      | EXCEEDED       | 0.00085314 → 0.00085314  | +3,480 bytes (1.37%)  | 17.6–17.6ms                |
| /about                         | 2520 → 2244ms                   | -11.0%     | within         | 0.00117399 → 0.00117399  | +18,724 bytes (6.28%) | 17.5–17.6ms                |
| Home with interception control | 1700 → 1984ms                   | 16.7%      | EXCEEDED       | 0.00085314 → 0.00085314  | +3,480 bytes (1.37%)  | 17.6–17.6ms                |

All candidate runs returned HTTP 200 and recorded zero browser errors, failed requests or HTTP errors. CLS was unchanged. Frame cadence stayed below the proposed 50ms p95 ceiling.

- Synthetic Chromium lab run, not physical iPhone or field data.
- Five fresh-context runs per route, serial on one machine; origin cache and real network remain variable.
- LCP/CLS reflect initial navigation through 10 seconds after load; scroll measured separately.
- Transferred JS bytes use Resource Timing transferSize; CDP encodedDataLength also captured, including blocked/cancelled request outcomes.
- Scroll frame durations from requestAnimationFrame are a proxy, not physical-device FPS acceptance.
- Candidate uses exact-origin preview access request interception. Original production baseline used no interception; controlled Home baseline uses the same interception with no access headers.
- Candidate measures commit 3ba4c8e only. Later focus/scroll-restoration or failed-setup cleanup fixes are not represented.
- Different origins can have different asset/cache behavior despite identical device, network and CPU profiles.
- Original candidate capture lacks per-resource timing detail; main-document timing and LCP observations do not isolate image download from render delay.

## Diagnostic observations

- Same hero asset/variant and identical encoded payload on baseline and candidate.
- Candidate diagnostic run LCP1744ms; hero responseEnd1735.5ms, render-delay8.5ms. This one run does not replace the failed five-run median.
- Production control requests three collection image assets; candidate requests six, introducing image competition near hero completion. This is an observed loading difference, not proven causality for original LCP regression.
- Candidate also loads Vercel preview feedback.js; production does not. Cross-origin Resource Timing transferSize is zero, so reported JS transfer does not include its unknown transferred size.
- Main-document median responseEnd does not explain the original difference. Long-task total is not higher on candidate Home.
- Original five-run candidate did not retain resource timing detail; cannot retroactively isolate its image download versus rendering contribution.

## Toolbar isolation (separate diagnostic)

Same candidate3ba4c8e, aborting only vercel.live. Five Home LCP runs: 1956, 1648, 1700, 1912, 1736ms. Median **1736ms**, **2.1%** above the interception-matched1700ms baseline (**8.2%** above original1604ms). CLS and JS unchanged. All six collection images still loaded. One expected blocked-request/console error per run, no unexpected failures.

Within +10% for this separate diagnostic; original unmodified-preview five-run result remains failed. Supports preview instrumentation as a contributor but does not establish exclusive causality because runs were serial and variable.
