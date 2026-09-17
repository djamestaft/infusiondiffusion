# INF-39 account avatar

## Approval and acceptance

Devon approved the gold outlined default and filled current-account recommendation
on 17 September 2026 and requested implementation. The exact
[Figma board 2764:488](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa?node-id=2764-488)
and component set 2764:487 are promoted to Approved, page 2004:14.
Direction B remains comparison material; the recommended state system is selected.

- Preserve the existing 44px Account target and header geometry.
- Show a 32px gold outline with 12px Manrope Semibold verified initials.
- Use a lighter ring and 12% gold tint on hover, plus a distinct circular keyboard
  focus ring. Fill gold with dark initials when pressed or on `/account`.
- Keep the generic icon for guests and unresolved/error sessions; a verified
  customer without initials receives the same circle around the existing icon.
- Preserve accessible customer labels, bidirectional text isolation, sign-in,
  orders, sign-out and privacy handling. No authentication or payment code changes. Preview configuration correction is recorded below.

## Reuse and token mapping

| Component      | Figma                                        | Runtime / stories                                      | Decision                                                 |
| -------------- | -------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Account avatar | 2764:487; default 2763:487; current 2763:499 | `navigation.tsx`, Components/Navigation Avatar stories | Refine existing UtilityLink; no duplicate link primitive |
| Header context | 2764:583 / 2764:610                          | Navigation, AccountEntry                               | Preserve header layout; AccountEntry passes currentHref  |

Colours reuse navigation-accent, navigation-focus, navigation-text,
navigation-divider and action-primary-foreground. The local
account-avatar-highlight role selects the existing dark gold for ivory and pale
gold for midnight. No primitive colour changes. Default/pressed outline is 1.5px;
current-page outline is 2px. Keyboard outline is 2px inset in the 44px target.
Gold-500 against midnight and dark initials against gold both measure 7.36:1.
Porcelain initials against midnight measure 16.89:1. The ivory outline is 5.88:1.
Forced colours use system Highlight/HighlightText for the filled state.

## Verification and visual disposition

- Full `pnpm check`: formatting, lint, types, 374 units/integrations, 343 Storybook
  checks, Storybook build and Next build pass.
- After the final current-page border adjustment, 54 relevant Navigation and
  AccountEntry Storybook checks pass, including axe.
- `pnpm test:customer`: all seven fixture journeys pass, including identity
  clearing, return/refresh/logout and four-width axe checks.
- Browser inspection at 1440/768/390/320 confirms 44px target, 32px circle,
  12px/600 loaded Manrope, no overflow or page errors. Integrated account checks
  verify aria-current, destination and axe at all four widths.
- Keyboard Tab confirms `:focus-visible` and a visible 2px outer ring; reduced
  motion has zero transition duration. Forced-colour rendering inspected.
- Impeccable static detection on changed navigation/CSS and diff whitespace pass.
- Independent read-only review found no actionable code defects. Initial focus
  capture used pointer modality; replaced with verified keyboard evidence below.

Compared runtime desktop/mobile headers with Figma 2764:583 / 2764:610 and the
current/focus variants. Circle, colours, centering and target dimensions match.
The examples use synthetic AJ rather than the Figma DT text property. Existing
logo/link/menu geometry is preserved; these surrounding elements are not rebuilt.
The approved glyphless CSS circle uses no new asset; UserRound remains Lucide's
existing 18px/1.5 stroke glyph. No visual defect remains in the inspected states.

[Desktop header](evidence/account-avatar/header-1440.png) ·
[320px header](evidence/account-avatar/header-320.png) ·
[Keyboard focus](evidence/account-avatar/focus-keyboard.png) ·
[Forced colours](evidence/account-avatar/forced-colors.png) ·
[Integrated account](evidence/account-avatar/account-320.png)

## Synchronization and release

| Layer                          | Status                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Figma                          | Synced: approved exact board/component IDs retained                                                              |
| DESIGN.md / Impeccable sidecar | Synced: approved avatar contract recorded                                                                        |
| CSS roles                      | Synced: existing semantic palette and local highlight alias                                                      |
| Navigation / AccountEntry      | Synced: circle states and current account marker                                                                 |
| Storybook                      | Synced: theme, default/current, hover/focus, guest, missing initials, Unicode, mobile/drawer and floating states |

PR #96 was human-merged on 17 September 2026 as `dcbcdc9`. Required CI
35191651331 and the PR gate passed for `67f4d5c`; independent review found no
remaining findings. The first Preview lacked Account because settings were
scoped to the previous branch. Eight branch-only Preview settings were corrected
from saved local configuration, and deployment `dpl_HSaYSssnf6iMiGi2A2rHycujqcJo`
passed guest sign-in and four-width fixture-avatar checks on the registered
Preview hostname. That correction did not change Production settings.

Devon subsequently confirmed sign-in and persistent initials after refresh and
navigation on the main test site. The visual/fixture checks alone do not prove
real token renewal or customer isolation. INF-39 retains
its real-provider renewal/logout/isolation acceptance; INF-40 retains combined
journey verification. Payfast remains in Test mode.
