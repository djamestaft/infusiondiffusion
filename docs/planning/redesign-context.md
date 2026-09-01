# Redesign context handoff

Last updated: 1 September 2026

This file records the current redesign state so work can continue without
reconstructing decisions from conversation history. Figma remains the visual
source of truth; Shopify remains commerce truth; Sanity remains editorial
truth.

## Current delivery state

- Repository branch: `agent/design-pattern-sync`
- Branch worktree:
  `C:\Users\User\Documents\work-projects\infusiondiffusion-design-pattern-sync`
- Documentation commit before this handoff: `e609343`
- Remote branch: `origin/agent/design-pattern-sync`
- No pull request exists yet. Pull-request entry point:
  <https://github.com/djamestaft/infusiondiffusion/pull/new/agent/design-pattern-sync>
- The primary checkout remains on `main`. Its unrelated modified
  `.env.example` and untracked `package-lock.json` were not copied, edited, or
  committed.
- The required `treehouse` executable was unavailable. A native isolated Git
  worktree was used as the safe equivalent and was based on `origin/main`.

## Figma source and organization

Redesign file:
<https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2039-32&m=dev>

The file is organized as:

- `00 — Archive / Legacy`: historical evidence only
- `10 — Redesign / Brief & References`: constraints and reference material
- `20 — Redesign / Exploration`: provisional work, never implementation truth
- `30 — Redesign / Approved`: the only implementation source

Exploration material remains non-authoritative and is intentionally not cited by
node ID in this implementation handoff. The approved page is `2004:14`.

## Approved Figma evidence

The following 15 frames are approved and carry the final background treatment:

- `2039:32` — Implementation handoff
- `2039:69` — Foundation direction
- `2039:106` — Color roles
- `2039:211` — Typography
- `2039:253` — Layout, material, and interaction
- `2039:346` — Foundation responsive proof, 768px
- `2039:376` — Foundation responsive proof, 390px
- `2039:406` — Foundation responsive proof, 320px
- `2039:436` — Component contract index
- `2039:480` — Actions and forms
- `2039:571` — Navigation and overlays
- `2039:644` — Commerce and product cards
- `2039:710` — Feedback, content, and organisms
- `2039:759` — Component responsive proof, 390px
- `2039:797` — Component responsive proof, 320px

Representative desktop and 320px screenshots were visually inspected after
the background pattern was applied.

## Approved design decisions

### Typography and materials

- Marcellus remains the display and editorial heading family.
- Manrope remains the interface, body, label, and control family.
- The approved material direction is retained.

### Core colors

- Page background: `#EEF0E7`
- Primary ink (`ink/900`): `#191916`
- `ink/950` remains a primitive but has no approved usage.
- Default action gold: `#C5A447`
- Hover action gold: `#DDC77F`
- Focus outline gold: `#A9842D`

### Buttons

- Default and hover colors remain in the order above; an experimental swap was
  explicitly undone.
- The metallic overlay remains subtle at the approved 60% treatment.
- All button labels are centered.
- Focus uses the lighter antique-gold outline and must remain keyboard-visible.

### Background pattern

- Motif: disciplined curved diffuser reeds with restrained concentric diffusion
  arcs, derived from the product world rather than a generic grid.
- Color: `#A9842D`.
- Opacity: `5.5%`.
- Every individual reed tapers continuously from approximately `3px` at its
  base to the original `1px` at its tip.
- Desktop cadence is `42px`; tablet and mobile proofs use proportionally tighter
  spacing while preserving the curve and taper.
- The motif is a background-only layer and must never impair content, control,
  status, or focus visibility.
- It is present on all 15 approved foundation, component, and responsive
  frames. Archive and reference pages were not changed.

## Repository documentation state

`DESIGN.md` was replaced on this branch with the approved source URLs, frame
IDs, visual direction, semantic color values, typography, material rules,
background specification, interaction requirements, responsive contract, and
sync matrix.

Current synchronization matrix:

| Layer | State |
| --- | --- |
| Approved Figma frames | Synced |
| `DESIGN.md` | Synced |
| Runtime semantic CSS tokens | Pending |
| Reusable components | Pending |
| Storybook contracts | Pending |
| Customer-facing templates | Pending |

No `.impeccable/design.json` sidecar existed on the branch when `DESIGN.md` was
updated. Do not invent one manually; generate it through the project-approved
Impeccable document workflow when that tool is available.

## Existing-content preservation rule

The original live site is:
<https://infusion-diffusion.vercel.app/>

Existing pages must reuse their current content. Content may be rearranged for
the redesigned hierarchy, but it must not be replaced with generated marketing
copy. Generate draft content only for a genuinely new route or section after
confirming that the original site has no equivalent. New drafts require human
approval.

Current live routes are:

- `/`
- `/shop`
- `/products/[handle]`
- `/fragrance-guide`
- `/about`
- `/gallery`
- `/contact`
- `/cart`
- `/account`

Because every currently planned route already exists, none currently qualifies
for newly generated marketing content.

### Content ownership

- Sanity owns Home, About, Gallery, Contact, Fragrance Guide, and global
  editorial settings.
- Shopify owns product names, descriptions, images, formats, prices, variants,
  inventory, availability, cart, checkout, customer, and order truth.
- Storybook and Figma fixtures are validation material, not publishable copy.
- Never invent scent notes, care or safety guidance, longevity, delivery
  promises, founder facts, testimonials, product benefits, prices, or stock.

### Content audit findings

Resolve these without broadly rewriting the site:

1. Confirm the canonical Shopify name for `Noir De La Noit`; its description
   uses `Noir De La Nuit`.
2. Confirm canonical accents and capitalization for `Ambre/Ambré Egyptian`,
   `Bois De/de Santal`, `Ete/Été Mystique`, and `Blanc De/de Blanc`.
3. Human-verify the claims about more than 130 oils, international sourcing,
   six fragrances, the Jacqui Kirchmann collaboration, 200ml size, and 8–12
   month longevity before final publication.
4. Remove duplicate brand suffixes in rendered metadata such as
   `Shop home fragrance | Infusion Diffusion | Infusion Diffusion` without
   changing the original page title.
5. Keep the Home founder story as an approved excerpt and About as the complete
   source, ideally backed by shared Sanity fields to prevent drift.
6. Review the Contact label `Online form unavailable`; direct email is the
   intended contact method, so the current label may falsely imply an outage.
7. Remove the repeated `Your account` heading/state presentation structurally,
   without introducing promotional copy.
8. Gallery photography and captions already exist. Preserve them and retain the
   existing rights-confirmation gate.

## Work-item context

Plane was checked on 1 September 2026. INF-14 through INF-20 are assigned to
Shawnee and remain in Backlog. INF-14 is the Home-first rollout parent; INF-15
is the first actionable child and covers review and human-approved merge of
this documentation handoff. INF-16 through INF-19 then sequence approved Home
design, runtime foundations, Storybook contracts, and Home integration. INF-20
is an independent content and metadata follow-up that does not block the design
system or Home implementation.

## Immediate next actions

1. Finish INF-15 review, open a pull request for `agent/design-pattern-sync`,
   pass required checks, and obtain human approval before merge.
2. After merge, re-check Plane and begin INF-16 from fresh remote and roadmap
   state.
3. Create a delivery branch from the then-current `origin/main`.
4. Implement the background once as a reusable semantic primitive rather than
   duplicating SVG/CSS on every page.
5. Map approved colors, typography, button states, and background material into
   semantic runtime tokens.
6. Implement and approve Storybook proofs at desktop, 768px, 390px, and 320px
   before integrating storefront templates.
7. Build a page-by-page content migration matrix from the live site and
   published Sanity/Shopify sources. Preserve existing copy and record only
   confirmed corrections.
8. Run the proportional quality gate: lint, typecheck, relevant Vitest and
   Storybook tests, desktop/mobile Playwright, keyboard flow, axe, console
   errors, visual comparison, and performance review.

## Human approval gates

- A human reviews and merges repository pull requests.
- A human approves factual content corrections and any copy for genuinely new
  pages.
- A human approves final Figma-to-Storybook comparison evidence.
- Production deployment remains out of scope without explicit authorization.
