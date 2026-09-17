# INF-42 soft-launch announcement

Devon requests the existing announcement above navigation before the www-domain
cutover. Exact content: **Payments are in test mode. We’re launching shortly.**
This is a static editorial notice, not a live provider-status detector. Keep
Payfast in Test mode and remove/update this notice as part of a later approved
live-payment release.

## Contract and ownership

- Reuse `AnnouncementBar`, existing semantic tokens and typography unchanged.
- Shared website layout loads existing Sanity announcement fields and supplies
  them to all Navigation consumers, including Home, Shop, Cart and Account.
  Studio is outside this provider. No new schema, commerce state or credentials.
- Enabled, nonblank notices render above navigation. Blank/disabled notices
  reserve no space; CMS outage uses the current soft-launch fallback.
- Header grows naturally with wrapping. Home uses a sticky stack with only the
  navigation row overlapping the hero’s existing clearance. Solid routes retain
  their border within the original 78/86px navigation row.
- No dismiss, animation, link or alert/live-region. Mobile menu contains the
  notice within its modal while hiding the underlying copy; Escape/focus stay.
- Sanity publication changes only the approved announcement fields; preserve
  unrelated source content and drafts. Disable the announcement for editorial
  rollback, or revert this PR for runtime rollback.

## Design synchronization

| Layer                  | Status                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| Figma 2764:488         | Intentional user-authorized divergence: existing frame has no notice; geometry and states retained |
| DESIGN.md / Impeccable | Updated scoped contract                                                                            |
| Semantic tokens        | Existing values reused unchanged                                                                   |
| Components             | Existing AnnouncementBar composed through Navigation and context                                   |
| Storybook              | SoftLaunch, floating, mobile-menu and long-content states added                                    |

Read-only product-design critique approved this bounded approach. Named service
aside and existing contrast preserved; no launch date or charge guarantee added.

## Verification and release

Targeted component/layout tests cover source propagation, hidden/blank states,
modal notice and focus return. Browser cases cover four widths, Home/Shop/Cart/
Account, scroll persistence, natural height and overflow. Existing carousel tests
now assert the preserved navigation row rather than the expanded whole header.
Full local gate, responsive screenshots, independent review and exact-head CI
results are recorded below before handoff. Human preview acceptance and merge
remain required; INF-42 cutover follows that prerequisite.

### Recorded evidence

- Full local `pnpm check`: formatting, lint, types, 385 unit/integration tests,
  353 Storybook checks, Storybook build and Next production build passed.
- Read-only code review: no blocking findings. Design review inspected Figma
  2764:488; requested addition is the documented intentional divergence.
- Published Sanity `siteSettings` announcement is enabled with the exact message
  and no link. Revision `Oy6nkUxX6j13NFg4mkYjN7`; guarded patch touched only
  announcement fields, preserving other content. Previous copy was “Ecommerce
  store coming soon”. Source-field rollback snapshot is in the coordinator’s
  `output/domain-cutover/announcement-before.json`.
- Initial targeted browser run: 16 carousel/focus cases passed; four announcement
  cases stopped on Shop because the local fixture server lacked CI=true, which
  is required by the existing catalogue fixture guard. Corrected server rerun
  follows; this was not a production catalogue failure.

- Final targeted browser evidence: all four announcement scenarios passed across
  Home, Shop, Cart and Account at 1440/768/390/320; the 16 adjacent carousel and
  focus scenarios passed. Account checks wait for its completed hosted-entry
  link because the existing loading shell has an sr-only heading with the same
  text. Independent diagnosis verified five immediate menu activations after
  the semantic busy-state boundary, with no sleeps or runtime changes.
- [Browser report](../evidence/inf-42/browser.json): sixteen page/width checks
  and three menu checks show no horizontal overflow, page errors or header/menu
  axe violations. Screenshots in that directory show the actual existing fonts
  and fixture content; they do not establish real-payment acceptance.
- Impeccable detection and diff whitespace checks passed for changed components.
