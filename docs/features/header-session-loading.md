# Header weight and stable account identity

Devon requested header navigation weight 600 and an account loading state on
17 September 2026. Scope: Navigation, AccountNavigationProvider and account
pending-state presentation. This follows the completed INF-39 account work;
remaining real-provider acceptance belongs to INF-40, owned by Devon. No roadmap sequence,
production configuration, domain or payment change is included.

## Behavior

- Desktop and mobile header labels use Manrope Semibold (600), retaining their
  current color, casing, sizes and underline. Footer typography is unchanged.
- Header route and commerce links use Next Link without speculative prefetch.
  The website layout retains the verified display profile across navigation.
- Unknown identity uses a neutral circular loader in the existing Account target.
  The link remains keyboard accessible and exposes its busy state. Reduced
  motion stops rotation. Confirmed guests/errors retain the UserRound icon.
- Focus checks preserve the visible verified identity until a result arrives.
  Overlapping browser events share one request. Errors/expiry clear identity;
  pagehide, hidden tabs and cross-tab sign-out invalidate outstanding responses.
- Native sign-out POST remains intact. Its pending header uses the loader while
  the submitting form remains mounted. No tokens or profile data enter browser
  storage; private/no-store profile responses and server sessions are unchanged.

## Evidence and limits

Before the fix, a browser regression demonstrated that Shop navigation discarded
an in-memory marker. Unit reproduction showed three requests for overlapping
initial/pageshow/focus events and identity disappearing during focus checks.
Those regressions pass after the change. Browser fixtures cover native logout,
other-tab clearing, account switching, error/retry, slow initial/hard reload and
unchanged Account target geometry. Fixture tests do not replace real Shopify
renewal or two-customer acceptance.

Storybook visual checks at 1440/768/390/320 verify loading and signed-in states,
44px targets, no overflow, no page errors and no WCAG A/AA axe violations.
Desktop and mobile labels compute to 600. Reduced-motion loading is static;
forced-colors focus remains visible. Independent code review found no blockers.

[Desktop loader with keyboard focus](../evidence/header-session-loading/loading-desktop.png)
and [320px open menu](../evidence/header-session-loading/menu-mobile.png) show
unchanged shell geometry and the requested typography. Compared with Figma
2764:488, the loader replaces the unresolved neutral user icon; signed-in gold
outline/fill, initials and focus treatment are preserved.

| Layer                            | Disposition                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| Figma 2764:488 / 2764:487        | Intentional user-requested divergence: 600 labels and distinct loader; frame sync pending. |
| DESIGN.md and Impeccable sidecar | Synced to requested refinement.                                                            |
| Semantic tokens                  | Reused unchanged.                                                                          |
| Navigation and AccountEntry      | Synced, including pending sign-out.                                                        |
| Storybook                        | Loading ivory/midnight, mobile/open menu and existing avatar states.                       |
