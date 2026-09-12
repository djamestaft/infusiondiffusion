# PR #83 consolidated storefront delivery

Devon requested one PR on 12 September 2026. The sole delivery branch remains
`agent/carousel-navigation` in its existing Treehouse lease. No production
merge, source publication, checkout enablement or new factual claims are included.

## Source PR disposition

- #83: retain approved editorial carousel, shared generated backgrounds, compact
  floating navigation, horizontal motion, viewport sizing and accessible controls.
- #82: merge Contact enquiry defaults and confirmed fallback mailbox, stories,
  tests, responsive evidence and source replacement instructions. Sanity-authored
  sections still take precedence; defaults are not delivery/returns/care policies.
- #71: merge component inventory, Storybook-first governance and historical
  authority notices. Resolve documentation against the newer September deliveries,
  not the former upcoming INF-33/34 sequence. Preserve the current Impeccable
  sidecar, current Product milestone, dated decisions and content deferrals.
- #51: superseded. Compared its changed-file inventory and representative runtime
  changes against the September baseline. Its page compositions, product cards,
  footer, media/error/loading states and verification are replaced by approved
  deliveries #62 and #72–81. Its static product-media map and August generated
  image set would replace current source-owned imagery; its alternative styling
  is not the current approved direction. Retired ADW changes and old specs/logs
  are historical, not active dependencies. No unique current requirement was
  identified for transplantation. Keep the closed PR and branch as evidence.

## Repairs and acceptance

The account keyboard test now follows the approved visible mobile order: home,
account, cart, hamburger, page action. Focus visibility remains asserted for each.
Solid navigation on other routes retains its pre-existing gold bottom border;
floating Home navigation retains the 64px header and inside gold rule after
scroll. Catalogue regression coverage retains its gold assertion. #82 includes
Contact pointer/keyboard activation coverage and fallback-content checks.

Run the consolidated local quality gate and Chromium suite, then required CI
against the pushed commit. Review Home, Shop, Account and Contact integration,
including responsive keyboard behavior and the existing source/fallback contract.
Current carousel Figma capture and intentional Contact copy divergence remain in
[the carousel contract](carousel-navigation.md) and
[the Contact contract](inf-35-editorial-defaults.md). No new design is introduced.

INF-35 remains In Progress (Devon); INF-36 remains Backlog (Shawnee). INF-28/31
facts, final imagery, care/policies, SEO and publication deferrals remain open.
Independent review, authenticated preview acceptance and human merge remain gates.

## Consolidated verification

Local `pnpm check` passed: formatting, lint, types, 276 unit tests, 305 Storybook
checks, Storybook build and Next production build. All 93 Chromium tests passed
without retries using isolated CI fixtures and Storybook on ports 3018/6017.
An initial local attempt lacked the CI fixture flag and was stopped; the completed
run uses the same catalogue fixture gate as CI, with no production Sanity reads.
Final lint/types passed after adding the test route's missing Suspense boundary;
fixture query access now follows Next.js Cache Components requirements. Impeccable
navigation detection returned no findings. Home, Shop, Contact and Account desktop
and mobile captures were reviewed locally. GitHub CI/preview evidence belongs to
the current PR head; old source-PR checks do not substitute for the consolidated gate.
