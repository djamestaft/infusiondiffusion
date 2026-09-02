# Content and metadata corrections

Status: In progress; product-owner decisions recorded and repository-owned
corrections implemented. External Shopify changes remain an Admin handoff.

## Outcome

Customers receive canonical product names, accurate factual claims, truthful
contact/account states, and one consistent brand suffix in search and sharing
metadata. Corrections stay in their owning system rather than being patched in
presentation components.

## Ownership and scope

| Finding                                                                    | Owner                    | Delivery rule                                                                           |
| -------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| Product spelling, accents, capitalization, handles, descriptions, and SEO  | Shopify                  | Export first; mutate only after owner approval; preserve redirects for changed handles. |
| Founder story, sourcing and collection-development claims, contact wording | Sanity                   | Preview drafts before publishing; do not invent or silently strengthen claims.          |
| Metadata title composition                                                 | Next.js                  | Normalize an authored or Shopify title to exactly one trailing brand suffix.            |
| Account state hierarchy                                                    | Next.js                  | Remove repeated state presentation without implying that accounts are provisioned.      |
| Fixtures                                                                   | Tests and Storybook only | Never publish fixture copy or treat it as commerce/editorial truth.                     |

## Confirmed implementation

- `storefrontTitle` trims repeated trailing brand suffixes and returns exactly
  one suffix for page titles, while preserving the standalone brand homepage
  title.
- Shop, cart, account, Fragrance Guide, and product-detail metadata opt out of
  inherited title templating by returning an absolute normalized title.
- Shopify Storefront API remains pinned to supported version `2026-07`; product
  titles continue to pass through the normalized server-side Shopify boundary.

## Approval-gated correction inventory

Product-owner approval was recorded on 2 September 2026:

1. Canonical Shopify titles are `Noir de la Nuit`, `Ambre Egyptian`,
   `Bois de Santal`, `Été Mystique`, `Blanc de Blanc`, and
   `Santuaire Serein`.
2. Retain the claims about more than 130 oils, international sourcing, six
   fragrances, the Jacqui Kirchmann collaboration, 200 ml size, and
   approximately 8–12 months of longevity under the stated conditions.
3. Replace `Online form unavailable` with `Contact us by email` and present
   email as the intended contact route.
4. Retain `Your account` as the H1 and remove duplicated unavailable-state
   wording from the alert body.
5. Defer shared Sanity founder fields until About template work; retain the
   approved page-owned copy in the meantime.

## Shopify Admin handoff

No Shopify Admin mutation is part of this repository change. Before updating
the catalogue, export all six products and record the date and record count.
Then update the approved titles in Shopify, preserve redirects for any handle
changes, and verify descriptions, Headless publication, product count, prices,
and availability after the change. Do not copy the corrected titles into
Sanity or a Next.js override.

## Acceptance criteria

1. Every correction names Shopify, Sanity, or Next.js as its system of record.
2. Rendered document and Open Graph titles contain no repeated trailing
   `Infusion Diffusion` suffix at any route.
3. Product data is not rewritten or duplicated in Next.js or Sanity.
4. Factual and editorial changes have recorded product-owner approval and are
   previewed before publishing; no production content is mutated by this pull
   request.
5. Contact and account states remain semantic, keyboard-readable, truthful,
   and free from repeated headings or false outage implications.
6. Unit tests cover title normalization, including already-branded and repeated
   suffix inputs. Route tests retain robots and metadata contracts.
7. Preview evidence checks metadata, desktop/mobile contact and account states,
   console errors, keyboard flow, and axe before merge.

## Failure and rollback

Reverting the Next.js commit restores the previous metadata behavior without
touching Shopify or Sanity. Any later Shopify mutation requires a dated export
and redirects before editing; any later Sanity correction remains a draft until
human publication approval and can be reverted through document history.
