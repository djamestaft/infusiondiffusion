# INF-31 reed-diffuser launch wording preview

Prepared 7 September 2026. Devon confirmed the six existing 200 ml reed diffusers
are the current launch range. Candles and room sprays are excluded for now.
The range decision is accepted. Devon subsequently authorized Home and metadata
wording implementation, deferred the Fragrance Guide to a new format, and
deferred replacement images and missing information. Home/template defaults,
root metadata, site-settings fallbacks and the Home Storybook example are now
updated on the delivery branch. The guide and holding-page proposals below
remain unapplied. No Sanity publication has occurred.

## Proposed source values

| Source field / consuming fallback                                                                                           | Existing wording                                                                                                                                                                                                             | Prepared wording                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Sanity `siteSettings.introduction`; `src/sanity/types.ts`                                                                   | We are preparing a considered collection of room sprays, reed diffusers, and candles for layered, lived-in rooms.                                                                                                            | We are preparing a considered collection of reed diffusers for layered, lived-in rooms.                  |
| Sanity `siteSettings.seoDescription`; `src/sanity/types.ts`; root metadata `src/app/layout.tsx`                             | Discover room sprays, reed diffusers, and candles designed to bring considered fragrance into lived-in rooms.                                                                                                                | Discover reed diffusers designed to bring considered fragrance into lived-in rooms.                      |
| Sanity `siteSettings.homepage.heroIntroduction`; `src/sanity/types.ts`; `src/components/templates/storefront-templates.tsx` | Diffusers, room sprays and candles shaped by clear scent notes, considered materials and everyday ritual.                                                                                                                    | Reed diffusers shaped by considered materials and everyday ritual.                                       |
| Sanity Fragrance Guide section headed `Let the format set the rhythm`; fallback `src/sanity/lib/editorial-pages.ts`         | A diffuser creates a steady background, a candle marks out a shorter ritual, and a room spray offers an immediate change. Choose the format that fits how often you use the room and how present you want the scent to feel. | A reed diffuser creates a steady background.                                                             |
| Same guide section heading                                                                                                  | Let the format set the rhythm                                                                                                                                                                                                | A steady background                                                                                      |
| Fragrance Guide `seoDescription`; fallback `src/sanity/lib/editorial-pages.ts`                                              | Choose home fragrance by room, atmosphere, scent notes, and format with this practical Infusion Diffusion guide.                                                                                                             | Choose home fragrance by room, atmosphere, and scent notes with this practical Infusion Diffusion guide. |
| Holding-page format label `src/components/holding-page.tsx`                                                                 | Room sprays · Diffusers · Candles                                                                                                                                                                                            | Reed diffusers                                                                                           |

The hero removes the blanket scent-note promise while Santuaire's notes remain
deferred. The guide retains the existing diffuser statement and removes advice
to choose between formats that are outside this launch. No replacement care,
delivery, safety or scent claims are introduced.

## Storybook synchronization

When the source correction is implemented, update the holding-page story's
collection introduction, the Home story's collection introduction and the guide
story's format paragraph to the same reed-diffuser scope. Retain the historical
founder attribution to **Jacqui Candles – Scented Wax Melts** in all sources and
stories: it is an approved collaborator name, not an advertised launch product.

## Source handoff and verification

Read-only Sanity verification on 7 September still returned the old introduction
and SEO description on published `siteSettings`, revision
`zoys6rIPUNIFY1LepICbUN`. No hero introduction value was returned. The prepared
[conditional source patch](inf-31-home-source-patch.json) updates only introduction
and SEO description and rejects that revision if an editor has changed it.
It is review evidence, not an automatically executed migration. A Sanity editor
must preview and publish the corresponding values; no authenticated write
connection is available in this session. Until that happens, published Home SEO
continues to override the corrected repository fallback.

The current repository wording was inspected at base `c6a2be5`. The earlier
dated Sanity snapshot is evidence of published state at capture time only.
Refresh the live fields before editing and retain their before values; preserve
any intervening editor changes. The prior query returned no published Fragrance
Guide document, so do not describe its fallback as a published CMS document.
Prepare an actual Sanity draft and preview before human publication.

Apply the matching fallback, template, metadata and Storybook changes together
in the implementation delivery. Check Home, Guide and holding-page content,
metadata, and published/draft fallback behavior. A remaining occurrence of
Jacqui Candles is expected. Other unapproved note/care claims remain tracked in
INF-28 U3/U5 and are not resolved by this range decision.

Shopify product titles, product type, handles, descriptions, inventory and prices
are unchanged. The photography intake still covers the same six product GIDs.
This copy preview does not complete INF-31 or grant final design acceptance.
