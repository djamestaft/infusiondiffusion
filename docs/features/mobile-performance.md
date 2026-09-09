# Mobile performance preparation

9 September 2026. Devon authorized mobile loading, stability and constrained
connection work while checkout and content remain deferred. This advances the
performance portion of INF-36 without completing its blocked release scope.
Shawnee remains its owner; Devon approves preview and merge.

## Acceptance

- Measure the current six principal pages at 390x844, DPR 2, 4x CPU slowdown,
  150 ms latency and 200,000 bytes/second download (1.6 Mbps), fresh browser cache.
- Correct confirmed image scheduling delays while preserving source imagery,
  approved sizing/crops, typography, responsive geometry and commerce behavior.
- About's first campaign photograph starts eagerly with high fetch priority;
  remaining campaign and market photographs stay lazy.
- Preserve image failure recovery, gallery dialog keyboard behavior, and no
  horizontal overflow at desktop, tablet and mobile sizes.
- Record measurements as simulated lab evidence, not physical-device results,
  field Core Web Vitals or guaranteed customer load times.

## Diagnosis and measurements

Production baseline commit: `8f5fd98` (PR #77 merged, post-merge CI passed).
Measurements used Playwright Chromium 151.0.7922.34 on Windows on 9 September
2026, before implementation. Each run used a new browser context.
Home, Shop, product, About, Guide and Contact had zero observed layout shift.
Initial LCP values were 2356, 2388, 2180, 3768, 2496 and 2400 ms respectively.
Each initial route result is a single diagnostic sample, not a statistical score.

About's visible first photograph was its LCP element, yet its image used the
default lazy behavior. The About presentation of GalleryViewer did not consume
its existing prioritizeFirst contract, and the caller explicitly disabled it.

A controlled experiment alternated three baseline and three candidate loads of
the same captured production HTML, using identical production image/CSS/script
URLs and browser conditions. Only the first photograph's image attributes
changed to loading=eager and fetchPriority=high. The response was replayed through
Playwright, so server streaming/TTFB was held out of this experiment; this is a
browser scheduling comparison, not an end-to-end deployed speed claim.

| Measurement              | Baseline median | Candidate median |
| ------------------------ | --------------: | ---------------: |
| LCP                      |         3964 ms |          2232 ms |
| Photograph request start |         2311 ms |            86 ms |
| Photograph transfer      |    42,638 bytes |     42,638 bytes |
| Observed layout shift    |         0.00044 |          0.00044 |

The LCP improvement was approximately 44%, with no change in image bytes.
Evidence: [initial routes](evidence/mobile-baseline.json) and
[controlled comparison](evidence/mobile-about-comparison.json).
The lab pass did not measure field INP or use a physical Android/iOS device.

## Delivery contract

Apply eager/high scheduling only to the first prioritized About figure.
The existing gallery presentation and below-fold market opt-out remain intact.
Next Image loading and fetchPriority were checked against official Next.js
documentation through Context7; no dependency or image-quality change is needed.

Figma and DESIGN.md geometry/tokens remain synchronized with the approved About
frames: no visual divergence. Runtime scheduling and Storybook's AboutFirstImage
contract are updated together. Existing image-error and dialog behavior remain
covered by the gallery tests. Exact-commit checks and preview evidence belong in
the delivery PR. Human merge and source-publication gates remain unchanged.

Independent read-only code/evidence review found no blockers. Targeted gallery
and template units (27 tests) and GalleryViewer/Combined About Storybook checks
(21 stories) passed. The initial Storybook browser startup retried successfully.
