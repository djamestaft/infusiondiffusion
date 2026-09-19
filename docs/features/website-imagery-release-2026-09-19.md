# Website imagery release — 19 September 2026

The approved product and editorial imagery is live. Devon approved publication,
human-merged [PR106](https://github.com/djamestaft/infusiondiffusion/pull/106)
and accepted the public result. Plane INF-48 records this completed subset of
INF-31; outstanding product facts and commercial launch gates remain separate.

## Published result

- Six square Shopify diffuser masters fill product-card frames. Original media
  remain attached; variant, price and inventory facts were preserved.
- Responsive hero artwork covers Shop, About, Fragrance Guide and Contact;
  Home statement and Artistry artwork are replaced, plus four About campaign
  figures. Five documentary market photographs remain intact.
- Three Home campaigns: six fragrance families, gifting and Noir De La Nuit.
  The collection mosaic uses six original paired diffuser/room-mist portraits
  arranged in Figma with staggered rectangles. It creates no new purchasable
  formats or bundles. Earlier carousel/image outputs are retained.
- Six Sanity documents published together with draft/published revision guards:
  `siteSettings`, `gallery`, `website-imagery-shop`, `website-imagery-about`,
  `website-imagery-contact`, `website-imagery-fragrance-guide`.

[Editable mosaic](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2875-2),
[responsive hero candidates](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2835-2).

## Release evidence

Merge: `5f489a8d1f4a5c39c52e32a2a1be5f46e80412e1`, 19 September at 04:58:51 UTC.
[Main CI run](https://github.com/djamestaft/infusiondiffusion/actions/runs/35422713556)
passed. Production deployment: `dpl_7LPDtrMKRr12ydZrjXs9KUtXK9b1`.

Sanity publication readback matched all six approved documents exactly and
consumed their drafts. All 24 referenced assets resolved. About schema validation
required its four existing fallback chapters to be saved verbatim before
publication; visible wording was preserved. Schema validation has no errors;
Gallery provenance notices remain nonblocking warnings.

Public browser verification at `https://infusion-diffusion.vercel.app` passed:

- Ten route/viewport combinations across Home, Shop, About, Guide and Contact
  at 1440px and 390px, checking actual responsive image sources.
- All three carousel images, titles and CTA destinations at both sizes, including
  wrapping after the third slide; desktop/phone screenshots visually inspected.
- All six square product cards, four About campaign and five market photographs.
- Health 200, no browser runtime errors, no axe violations or horizontal overflow.
- No production error-log entries in the observed five-minute query window.

Public `https://www.infusiondiffusion.co.za/api/health` independently confirmed
`ok` / `5f489a8` during reconciliation. Full browser results above are from the
Vercel production hostname; they do not replace INF-42's account/payment checks
on the custom domain.

The first request immediately after publication briefly returned the preceding
cached carousel. Sanity's invalidation function then revalidated 20 cache tags
at 07:06 SAST; a fresh public browser run verified the new images and text.
A code deployment and Sanity publication are separate release steps: confirm
both source readback and public-page content before calling editorial work live.

## Durable evidence and recovery

Local sources, prior outputs and snapshots remain under
`output/photoshoot-2026-09-18`. The publication pack is
`publication-2026-09-19/{snapshot.json,actions.json,publish-result.json,published-after.json,verification.json}`.
Carousel evidence is `carousel-edit-2026-09-19/production-evidence`.
The retained delivery worktree has `output/media-refresh/production-final`.
These ignored artifacts contain source records and must not be deleted during
worktree cleanup. Recovery must use fresh revisions and preserve later edits;
no rollback is authorized by this completion record.

INF-48 is Done. INF-31 is Todo for deferred factual/care/metadata inputs from
INF-28, with Shawnee's ownership and downstream INF-44/41 dependencies retained.
INF-40/41/36/42 full verification and launch gates, INF-44 remaining care/service
acceptance and INF-47 physical-device verification are not marked passed by this
release. Payfast and the announcement remain in Test/soft-launch mode.
