# INF-35 interim editorial support content

Prepared 12 September 2026. Owner: Devon. Branch: `agent/editorial-defaults`.
Base: protected main `a163bb4`. Coordinator is the sole writer; content/commerce
and design specialists reviewed the proposed content and composition read-only.

## Decision and outcome

Devon confirmed that the approved About, Contact and Guide layouts stay, that
replaceable default content may fill missing editorial content, and that
`dione.smith@infusiondiffusion.co.za` is the correct customer-support mailbox.
The prior `hello@` fallback was not confirmed; all runtime fallback/error paths
now use the confirmed address. A valid future Sanity mailbox remains authoritative.

Mode: Read. Customers seeking delivery, returns/damage or diffuser-care help can
see what to include in an email. Keep the existing Before you write guidance,
then Delivery enquiries, Returns or damaged items, and Diffuser care in the
existing Contact gold content rail. Exact default copy is centralized in
`src/lib/contact-content.ts` and shared by runtime fallbacks and Storybook.
These are interim enquiry instructions, not merchant policy terms or product
safety instructions. No delivery fees/times, returns eligibility, refunds,
response times or care intervals are invented.

The existing Contact destination in the header/footer provides access. About,
Guide matching, commerce, checkout enablement, imagery and URLs are unchanged.
No new analytics, form, schema, query, backend or source publication is included.

## Observable acceptance

- Default Contact includes all four support sections and the approved email;
  the visible address and email action agree. No web submission is implied.
- Missing/invalid settings and unexpected Contact errors use that same mailbox.
  Valid source-owned mailbox changes continue to work.
- Authored Sanity sections replace the whole fallback array, including in draft
  preview. Missing documents, invalid sections and fetch failures retain defaults.
- Preserve one H1, peer H2s, keyboard focus and touch targets. Existing composition,
  tokens and fonts remain; content grows naturally at 1440/768/390/320.
- Existing loading, error, missing-image and long-content stories remain valid.
  Verify responsive route rendering, email targets, overflow and axe checks.

## Replacement and outstanding work

Edit Sanity `editorialPage` with slug `contact`, using its ordered `sections`
(`heading` / `body`). Any valid authored section array replaces all defaults;
include every desired section when authoring. Preview and human publication
remain separate gates. `siteSettings.contactEmail` owns future mailbox changes.
No Sanity document has been written by this delivery.

Final merchant delivery/returns policies and product care/safety instructions
remain open under INF-28/31; their source-owned destinations and purchase
reassurance remain INF-35 follow-up. Default enquiry copy does not complete those
acceptance criteria. Photography, SEO, fuller Guide matching dimensions and
source-publication deferrals remain. INF-27/35 stay In Progress pending closeout;
INF-36 remains Backlog for full release.

## Design synchronization

Contact authority: approved Figma `2529:2/19/37/55`, contract `2532:102` in file
`jIMvwSBkilg7eplo3IiHPa`. The prior captured composition is reused; this user's
12 September authorization adds interim text in its existing repeatable rail.
Figma's historical one-section copy is an intentional content divergence.
DESIGN.md records it; CSS/tokens/layout are unchanged; runtime and Storybook
share the same new content. No claim of updated Figma screenshots is made.

## Verification and rollback

Local verification passed: formatting, lint, typecheck, all 271 units, 62
storefront template Storybook checks, Storybook production build and Next
production build. Impeccable detection reported no findings in the changed
runtime surfaces. The initial Storybook test attempt failed downloading Google
Fonts; the unchanged rerun passed with the actual fonts.

Seven Chromium Contact checks passed against the isolated fallback production
server on port 3106 (no Sanity configuration): 1440/768/390/320, axe/no overflow,
email targets, keyboard navigation, reduced motion/page-scale simulation, and
failed hero recovery. The first run passed six checks but the menu-open check
timed out; the complete unchanged rerun passed all seven. Do not describe that
initial run as green or this page-scale simulation as physical-browser zoom.

Captured [desktop](evidence/editorial-defaults-contact-1440.png),
[tablet](evidence/editorial-defaults-contact-768.png),
[mobile](evidence/editorial-defaults-contact-390.png) and
[small mobile](evidence/editorial-defaults-contact-320.png). Parent inspected
desktop/mobile composition and confirmed the retained rail and readable copy.
Independent content/code review found no implementation blockers.

Two read-only requests to the configured published Sanity dataset timed out.
Current published Contact coverage is therefore unverified: an authored section
array may override these defaults. Existing unit coverage verifies authored
content precedence, draft options and fetch-failure fallback. No CMS publication
or end-to-end Studio/cache-invalidation verification was performed; no schema,
query or cache behavior changed. GitHub CI/preview and human merge remain gates.
Reverting the delivery restores the previous defaults without a data migration.
Published editorial content is not changed by this rollback.
