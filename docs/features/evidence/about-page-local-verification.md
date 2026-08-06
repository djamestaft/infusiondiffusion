# About page local verification

Clean portrait-fixture captures were made from the Storybook canvas, not the Sanity fallback route or manager UI:

| Story ID                                       | Capture                   | Pixel dimensions |
| ---------------------------------------------- | ------------------------- | ---------------- |
| `templates-storefront--about-with-portraits`   | `about-portrait-1440.png` | 1440×3394        |
| `templates-storefront--about-portraits-mobile` | `about-portrait-390.png`  | 390×3632         |

The artwork is an inline 480×640 test-only SVG fixture. It cannot ship through the route and does not assert image rights. FIT geometry is exercised by the `AboutWithPortraits` and `AboutPortraitsMobile` Storybook play contracts; source uses a 4:3 transparent slot, centered full-height 3:4 wrapper and `object-contain`.

Raw, exit-status command transcripts are retained under `logs/`: schema extraction, type generation, Impeccable detection, and About plus Fragrance Guide Playwright. These local captures are implementation evidence only. Exact protected Vercel Preview comparison, rights review, Sanity publication, merge and production remain human gates.
