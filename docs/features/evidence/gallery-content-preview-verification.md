# Gallery content publication and verification

## Publication record

- Approval: the user, acting as the authorized Sanity editor, approved the complete nine-image document, rights/release record, review, and publication on 8 August 2026.
- Target: Sanity project `j222nd1i`, dataset `production`.
- Before state: zero published Gallery documents and zero Gallery drafts.
- Draft: `drafts.gallery`, revision `0VJUJXdi56FKks4KgqQwuQ`; schema/document validation passed before publication.
- Published document: `gallery`, revision `fWX29cmQ00AYAU8uJ10yRf`, updated `2026-08-08T17:58:55Z`.
- Published count query: `documents: 1`, `campaign: 4`, `market: 5`.
- Asset delivery: nine selected source files were uploaded to Sanity; the published projection returns dimensions for every asset. No excluded source was uploaded by the publication operation.
- Rights: all entries record Infusion Diffusion ownership, Worldwide territory, Perpetual duration, client-owned/no external licence, the applicable release status, and `storefrontRightsConfirmed: true`.
- Secret handling: publication used the existing authenticated Sanity CLI session. No token was printed, copied into a command, written to the repository, or exposed to the client.

## Local integrated evidence

- Code identity: implementation commit `f8f2359` (`Make Gallery market grid fluid`) on `agent/gallery-page`.
- Browser: Playwright Chromium via `@playwright/test` 1.62.1.
- Published perspective route: `http://127.0.0.1:3122/gallery` on the existing Treehouse-managed Next.js 16.2.12 development server, using Sanity project `j222nd1i`, dataset `production`, and the published perspective.
- Capture environment: macOS local Chromium at 1440×1000, 390×844, and 320×844. The `nextjs-portal` development toolbar host was removed from the capture DOM immediately before each screenshot; no storefront node, style, content, or request was changed. The resulting images contain no Next development indicator.
- Screenshots:
  - 1440×1000 viewport, full page: `gallery-content-local-1440.png`
  - 390×844 viewport, full page: `gallery-content-local-390.png`
  - 320×844 viewport, full page: `gallery-content-local-320.png`
- Assertions: four Campaign items and five In the Market items; at 1440 Campaign renders Blanc De Blanc then Botanical in the left stack with an exact 64px same-column gap, and Emerald then Library in the right stack with an exact 32px same-column gap; all Campaign image-to-caption gaps are 16px; 390/320 retain the published authored order in one column. The Market grid uses exact 832/416/400px fixed desktop tracks at 1440, fluid tracks without overflow at the 1280px intermediate regression width, 32px desktop gaps, 24px inset at 390, 16px inset at 320, and 16px mobile vertical gaps. Verification also covers the exact H1/H2/H3 hierarchy; two group-local viewers (`Image 1 of 4` and `Image 1 of 5`); trigger focus restoration; honest boundaries; CDN-backed media; metadata; `/api/health`; no horizontal overflow at 1440/1280/390/320 or 200% zoom; axe WCAG 2 A/AA and 2.1 A/AA returned zero violations.
- Responsive media review at 1440: selected Next image candidate widths were `640,640,640,640,1080,640,640,640,640` at 1× and `1200,1200,1200,1200,1920,1080,828,828,828` at 2×. This confirms responsive selection increases for high-density displays. Some generated 2× candidates exceed the uploaded source dimensions, so source softness on high-density displays remains an editorial asset limitation rather than a hidden implementation claim.
- Local console/network note: the reused port `3122` is not an allowed Sanity Live CORS origin. The E2E check filters only that known local live-events connection; server-rendered published content and all image requests succeeded. Preview must remain strict because its configured origin should not have this exception.
- Impeccable detector: no findings.

## Verification commands

- `corepack pnpm exec sanity schemas validate --level error`
- `corepack pnpm sanity:schema`
- `corepack pnpm sanity:typegen`
- `corepack pnpm exec sanity documents validate --project-id j222nd1i --dataset production --level error --yes`
- Read-only published count and ordered projection queries
- Targeted Gallery Vitest suite: 44 tests passed
- Full local gate: `corepack pnpm check` passed with 193 Vitest tests and 216 Storybook tests; Storybook and Next production builds succeeded.
- Storybook suite: 216 tests passed
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm check`
- `GALLERY_E2E_MODE=published PLAYWRIGHT_BASE_URL=http://127.0.0.1:3122 corepack pnpm exec playwright test tests/e2e/gallery.spec.ts --project=chromium`: 7 tests passed, including the 1280px fluid-grid regression
- Full repository Playwright against an isolated fixture-enabled local server: 54 tests passed; four existing mobile-project carousel tests were intentionally skipped by their project contract; zero failures.
- Read-only post-build Sanity projection: revision remained `fWX29cmQ00AYAU8uJ10yRf`; Campaign remained Travertine, Emerald, Library, Botanical; Market retained all five published entries in order; all nine rights confirmations remained true. No content was republished or reordered during closeout.
- `node .agents/skills/impeccable/scripts/detect.mjs --json`: no findings
- `git diff --check`
- Diff credential/private-key scan: no findings

## Pull request and Preview evidence

- Pull request: [#48](https://github.com/djamestaft/infusiondiffusion/pull/48), created from `agent/gallery-page` at evidence commit `0755bae3d9d181d7793bdded0092d79761612736`.
- Required gate: `just pr-gate 48` completed successfully as ADW `4e14e3e6`; GitHub `quality`, `Vercel`, and `Vercel Preview Comments` were green. The quality run was [Actions run 31276149871, job 93149877021](https://github.com/djamestaft/infusiondiffusion/actions/runs/31276149871/job/93149877021).
- Vercel deployment: Ready deployment `dpl_CpGTNSVErGEQHLEvG5BxzKVAR87g`; [deployment inspector](https://vercel.com/devon-james-tafts-projects/infusion-diffusion/CpGTNSVErGEQHLEvG5BxzKVAR87g); branch Preview URL `https://infusion-diffusion-git-agent-cbf9b6-devon-james-tafts-projects.vercel.app`.
- Preview access result: anonymous requests to both `/api/health` and `/gallery` returned HTTP 302 to Vercel SSO. This checkout has no Vercel CLI authentication session and the repository exposes no automation-bypass credential. Therefore strict published-mode Playwright, Preview axe/zoom/viewer/CDN checks, console/network capture, and cache-propagation timing could not be executed without bypassing deployment protection. The green Vercel deployment check proves build readiness, not storefront behavior, and is not represented as full Preview verification.
- Required human follow-up: provide an authorized Vercel Preview session or scoped protection-bypass credential, then run the documented health, Gallery, and published-mode commands against this exact deployment before merge review. Production deployment and merge remain out of scope.

An earlier repository-wide Playwright attempt used a reused, non-fixture development server and therefore produced unrelated commerce and local-origin failures. The final isolated fixture-enabled run supersedes that attempt and passed with the existing project-contract skips noted above; no out-of-scope test or environment configuration was changed to mask results.
