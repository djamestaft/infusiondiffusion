# About page

Approved authority: Figma desktop `316:99`, mobile `316:151`, corrected implementation handoff `316:198`. `/about` presents the four fixed Sanity roles origin, development, collaborator and principles, then the Fragrance Guide CTA. It is text-first by default; no final photography is shipped.

## Media and authoring

Each role may carry one rights-cleared portrait. The responsive outer slot is 4:3; centered visible artwork is 3:4 and uses FIT/contain, not crop-to-fill. Editors must provide factual alt text, source/owner, storefront-rights confirmation, territory, duration, releases and licence reference for an asset. A human must verify rights and publish content. Missing or ineligible artwork removes only that slot.

## Synchronization

Figma `316:198` → `DESIGN.md` → `--bone-50`/`bg-bone-50` → `AboutTemplate` → `Templates/Storefront` About stories. Sage uses `bg-content-surface`. About uses no Shopify catalogue data; only the existing cart count is read. Public/draft Sanity perspectives preserve the fixed fallback order; unavailable content returns the exact text fallback.

## Evidence and gates

Targeted schema/type generation and Vitest are local evidence. Preview, publication, merge and production remain human gates. Verify 320px/200% zoom, no crop/overflow, current navigation, CTA focus, and factual image alternatives before merge.
