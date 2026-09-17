# INF-39 account content layout

## Release status — 17 September 2026

PR #91 (layout/session), #94 (black header) and #96 (gold avatar) are merged.
Devon confirms main-site sign-in and initials persisting across refresh and
navigation, plus earlier profile/own-order visibility. The delivery notes below
record earlier verification stages; pending merge/activation wording there is
historical. Real-provider renewal/logout/isolation acceptance remains INF-39/40.

## Post-merge header follow-up

Devon requested a black account header after PR #91 merged. AccountEntry now
selects the existing midnight Navigation theme for every session/hosted state.
This supersedes the original ivory-header exception below and matches the Figma
frames. Shared Navigation, Footer, account content and authentication are unchanged.

Full local check passes: 373 unit/integration tests, 332 Storybook tests,
formatting, lint, types and both builds. Storybook browser checks at
1440/768/390/320 confirm the midnight background, zero overflow/page errors
and zero axe violations. Visual captures:
[desktop](../evidence/inf-39-account-layout/midnight-1440.png) and
[mobile](../evidence/inf-39-account-layout/midnight-320.png).

## Original content delivery

Devon approved implementation on 17 September 2026 and chose delivery in PR #91.
The scope is the account content only. Shared header/footer styling, commerce
behavior, authentication handlers and environment flags are unchanged by this
refinement. Main `ee838ff` was merged into the existing account branch first.

## Design contract

[Figma account handoff](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2741-37):
`2742:39/91/137/179` at 1440/768/390/320. The user's scope explicitly preserves
the current ivory navigation even though the Figma frames show midnight.

`AccountEntry` serves `/account` and `Commerce/AccountEntry` stories. It reuses
ContentHeader, Heading, Button, FeedbackAlert and TextLink. Details and orders
form two equal columns from 768px; below that they stack. The content starts
64px below the desktop header and 40px below smaller headers, replacing vertical
centering. Profile data, hosted orders, sign-out POST, retry and loading logic
retain their existing contracts. Long content grows naturally.

## Evidence

- `pnpm check`: formatting, lint, types, 373 unit/integration tests, 332 Storybook
  tests, Storybook build and Next production build passed.
- Targeted account Storybook checks: 24 passed, including the new tablet story
  and accessible details/orders regions.
- `pnpm exec playwright test --config playwright.customer.config.ts`: seven
  passed, including four responsive axe checks, mocked refresh/navigation,
  cross-tab sign-out/customer isolation, provider retry and private HTML.
- Impeccable layout detection: no findings. Independent scoped code/visual
  review: no blockers. Reviewer noted lighter semantic dividers and the existing
  shared metallic button treatment compared with the static Figma fills.
- Long/missing details and all session states checked at 320px without overflow;
  keyboard Tab moves from Sign out to View your orders in content order.
- [Geometry and console evidence](../evidence/inf-39-account-layout/geometry.json):
  Storybook and integrated route at all four widths, no horizontal overflow or
  page errors. Synthetic Amara Jacobs data only.
- Account screenshot crops: [1440](../evidence/inf-39-account-layout/account-1440.png),
  [768](../evidence/inf-39-account-layout/account-768.png),
  [390](../evidence/inf-39-account-layout/account-390.png),
  [320](../evidence/inf-39-account-layout/account-320.png). Matching Storybook
  captures are stored beside them. Actual fonts were loaded before capture.

The crops deliberately focus on the changed account area. Desktop section
bounds are x128/x752, y292, width560; mobile bounds are x20, widths350/280,
with orders at y569. These match the Figma section placement. Existing Heading
tracking and metallic Button treatment remain the shared runtime primitives;
Figma uses a solid gold fallback. Fine font rendering can differ by platform.

## Synchronization

| Layer                    | Status                                               |
| ------------------------ | ---------------------------------------------------- |
| Figma account content    | Synced to the approved layout                        |
| Figma navigation         | Intentional divergence: user excludes header changes |
| DESIGN.md and sidecar    | Synced to this scoped approval                       |
| CSS tokens/shared shell  | Reused unchanged                                     |
| AccountEntry/Storybook   | Synced; responsive and session states retained       |
| Runtime account behavior | Existing PR #91 authentication retained              |

CI and preview evidence for the final head are recorded on PR #91 and Plane.
Real Shopify sign-in, displayed identity, persistence and own-order access were
user-confirmed on the earlier preview; browser fixtures do not replace real
provider acceptance. Human merge and production activation remain separate.
