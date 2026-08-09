# Infusion Diffusion storefront redesign — agent handoff

## Mission

Redesign and upgrade the Infusion Diffusion storefront so it materially outperforms Cape Island in brand distinction, editorial storytelling, product discovery, trust, and purchase confidence while remaining unmistakably Infusion Diffusion.

The work must use the approved project system: Impeccable for design critique and interface quality, TypeUI MCP for typography exploration and validation, the official Figma MCP for exact design context, and the bounded Pi-supervised Codex Figma evidence path when Pi cannot access the connector directly. Next.js owns the customer experience, Sanity owns editorial content, and Shopify remains the only commerce source of truth.

This document is the execution brief. It authorizes research and concept development, not edits to approved Figma frames, publishing, merging, or production deployment.

## Read before starting

Read these sources in full:

- `AGENTS.md`
- `PRODUCT.md`
- `DESIGN.md`
- `docs/architecture.md`
- `docs/operations.md`
- `docs/planning/roadmap.md`
- `specs/273609bc_figma-codex-supervision.md`
- `.agents/skills/feature-brief/SKILL.md`
- `.agents/skills/impeccable/SKILL.md`
- `.agents/skills/design-to-storybook/SKILL.md`
- `.agents/skills/quality-gate/SKILL.md`
- `.agents/skills/release-debug/SKILL.md`
- `.agents/skills/parallel-agent-worktrees/SKILL.md`
- `.agents/skills/sssf/SKILL.md`

Use SSSF first. Work on a freshly fetched, Treehouse-leased task branch. Codex coordinates; factory roles own their declared phases. Humans retain approval of design direction, exact Figma targets, merge, publish, production, and rollback.

## Capability preflight

Before design work begins, record evidence that:

1. The official Figma MCP is connected and can identify the canonical Infusion Diffusion file.
2. TypeUI is installed, enabled, authenticated, and callable. Its hosted MCP endpoint is `https://mcp.typeui.sh/mcp`; never persist OAuth material in the repository or SSSF trace.
3. Impeccable is available and its instructions have been read.
4. The relevant SSSF roster, ADW chain, exact phase owners, and human gates are named.
5. The checkout is clean, based on current remote `main`, and isolated in a Treehouse worktree.

If TypeUI or Figma requires interactive authentication, stop and ask the human to complete it. Agents must not copy tokens, print authorization URLs or codes into tracked artifacts, or invent connector evidence.

The bounded Codex worker is a fallback evidence collector only. Pi scopes one exact approved target; deterministic SSSF code launches the read-only worker; the same Pi session validates the typed result. It is not authority to browse broad files, edit Figma, authenticate, invoke arbitrary Codex processes, implement UI, merge, publish, or deploy.

## Competitive research

Audit Cape Island's public storefront at `https://capeisland.co.za/` on desktop and mobile. Capture only public, necessary evidence and date it. Evaluate:

- global navigation, merchandising hierarchy, search, collection and product discovery;
- homepage narrative, campaign rhythm, editorial depth, trust signals, and conversion paths;
- product cards, product-detail storytelling, scent communication, variants, gifting, and cross-sell;
- typography, color, imagery, spacing, motion, loading, responsive behavior, and accessibility;
- footer, contact, about, stockist/market, policy, delivery, and support surfaces;
- performance, SEO structure, analytics opportunities, and obvious friction.

Separate facts from inference. Do not copy Cape Island's layouts, language, imagery, trade dress, or interactions. Produce a concise benchmark matrix with `Cape Island observation`, `Infusion Diffusion opportunity`, `proposed response`, and `evidence/assumption` columns.

Success means stronger product comprehension, greater brand memorability, clearer purchase paths, richer editorial usefulness, and a calmer premium experience—not simply more decoration.

## Three design territories

The product designer must create three genuinely distinct territories before implementation. Each territory needs a name, one-sentence thesis, mood, typography direction, palette/material logic, image direction, layout behavior, motion language, product-card treatment, and representative homepage/product/gallery/about moments.

All three must honor the brand's restrained luxury, black-and-gold product language, South African context, and scent-led storytelling. They must differ in composition and emotional register, not merely color.

Recommended starting territories:

1. **Scent Atelier** — luminous, tactile editorial minimalism; generous cream space, precise serif hierarchy, close material studies, and quiet cinematic reveals.
2. **Nocturne Rooms** — immersive dark-to-light room narratives; deep botanical tones, architectural framing, controlled gold detail, and atmospheric transitions.
3. **Modern Apothecary** — refined collection intelligence; modular scent taxonomy, ingredient-led storytelling, confident typography, and high-clarity shopping tools.

Use Impeccable to critique hierarchy, distinctiveness, cognitive load, accessibility, responsive integrity, and anti-patterns. Use TypeUI to test real font pairings, optical sizes, weights, line lengths, fallback behavior, loading cost, and licensing. Do not choose or ship fonts from screenshots alone.

Present the territories side by side with tradeoffs and a recommendation. Stop for explicit human selection or a directed hybrid. No approved Figma frame or storefront code may change before that decision.

## Experience architecture

After territory approval, define the sitemap and primary journeys for discovery, product understanding, purchase, brand trust, market discovery, and support. At minimum cover:

- global header, navigation, search, account/cart entry, announcement system, and footer;
- home;
- shop/collections and product cards;
- product detail;
- gallery, with composed product imagery and market imagery in clearly distinct but related grids;
- fragrance guide;
- about;
- contact;
- cart and checkout handoff;
- loading, empty, error, unavailable, and offline-adjacent states;
- policy, delivery, returns, privacy, terms, and accessibility links.

The fragrance guide must become a useful selection tool, not a decorative brochure. It should explain families, notes, intensity, room/mood fit, and product relationships in plain language. About must tell a credible, specific brand story. Contact must set expectations, expose relevant channels, and provide robust validation and success/error states. The footer must complete navigation, trust, legal, support, market/social, and newsletter needs without becoming a link dump.

## Design-system contract

Translate the selected territory into semantic tokens and reusable contracts before page implementation:

- typography roles and responsive scale;
- surface, text, border, accent, feedback, and focus tokens;
- spacing, radius, shadow, container, and grid tokens;
- image ratios and art-direction rules;
- motion durations, easing, sequencing, and reduced-motion behavior;
- primitives for buttons, links, fields, cards, badges, accordions, dialogs, drawers, skeletons, and feedback;
- shell components for header, navigation, footer, page intro, editorial modules, and commerce modules.

Use existing shadcn-based primitives and semantic tokens. Do not introduce raw one-off colors or duplicate controls. Keep Figma variables, `DESIGN.md`, runtime tokens, and Storybook contracts synchronized; document every intentional divergence.

## Figma workflow and approval gates

1. Identify the canonical Figma file and exact candidate page/section nodes through the official connector.
2. Work in a clearly named concept area or new page; never overwrite approved source frames during exploration.
3. Present three territory boards and representative desktop/mobile moments.
4. Obtain explicit human territory approval.
5. Record approval for each exact file key and node ID before bounded capture or downstream implementation.
6. Capture dimensions/layout, semantic variables, typography, spacing/assets, responsive states, accessibility/interaction states, content extremes, and intentional divergences.
7. If Pi lacks Figma access, use only the merged `adw_figma_capture` approval/capture flow. Missing authentication, wrong nodes, absent approval labels, incomplete evidence, or provenance mismatch is blocking.
8. Obtain explicit approval of the refined page designs before Storybook or storefront implementation.

Static Figma cannot prove every runtime state. Mark absent information as unresolved; never invent hover, keyboard, loading, error, localization, or commerce behavior.

## Motion and loading

Motion should extend across the experience, not stop at the homepage. Define restrained page-entry, section-reveal, image, card, navigation, drawer, cart, and feedback behavior. Motion must communicate hierarchy and state, remain performant, and fully respect `prefers-reduced-motion`.

Replace left-aligned loading text with layout-faithful skeletons for every meaningful page family. Skeletons must preserve expected geometry, avoid layout shift, remain non-interactive and non-announcing, and not masquerade as loaded content. Include slow, empty, error, and retry states.

Fix hover states that make product cards visually disappear into their container. Every hover/focus state must preserve boundaries, content contrast, price/product legibility, and keyboard-visible focus.

## Responsive, accessibility, and content extremes

Design and verify at 320 px, 390 px, tablet, standard desktop, and wide desktop, plus natural-height and 200% zoom behavior. Cover:

- semantic landmarks and heading order;
- complete keyboard operation and visible focus;
- WCAG AA text and control contrast;
- touch target sizing and non-hover equivalents;
- reduced motion and animation cancellation;
- useful image alternative text and decorative-image handling;
- screen-reader behavior for menus, dialogs, forms, cart feedback, skeletons, and validation;
- long names, long prices, sale states, unavailable products, missing imagery, zero/many products, long/localized copy, empty editorial sections, and failed data sources.

Do not bake essential labels into generated imagery. Product labels and claims must remain accurate. Confirm rights and provenance for all imagery and fonts.

## Content and platform boundaries

- Shopify owns products, variants, prices, inventory, carts, discounts, customers, orders, and fulfillment.
- Sanity owns editorial narratives, gallery groupings, fragrance education, market stories, page copy, and SEO fields. It may reference Shopify IDs but must not duplicate commerce truth.
- Next.js composes the customer experience and consumes gated contracts.
- Secrets stay server-only and never use `NEXT_PUBLIC_*`.

Define required Sanity fields, image metadata, editorial fallbacks, and Shopify references before implementation. Identify content that the client must still supply rather than hiding gaps with generic copy.

## Phased delivery

### Phase 1 — research and direction

Deliver the dated competitive audit, opportunity matrix, three territories, recommendation, and unresolved questions. Human gate: select a territory or directed hybrid.

### Phase 2 — approved Figma system

Create the selected semantic system, global shell, key page templates, responsive states, motion specification, and content extremes in concept frames. Human gate: approve exact file/node targets.

### Phase 3 — Storybook contract

Implement tokens, primitives, shell components, page modules, and meaningful states in Storybook using the design-to-Storybook skill. Verify accessibility, keyboard behavior, responsive constraints, and reduced motion. Human gate: approve component contracts and named divergences.

### Phase 4 — storefront integration

Implement approved pages and states in Next.js. Route Sanity and Shopify work to their specialist boundaries. Add Vitest coverage for units/integrations and Playwright for async Server Components and user journeys.

### Phase 5 — preview and release readiness

Run the proportional quality gate, verify a Vercel preview, complete content/asset/SEO/analytics checks, collect independent review, and open a PR. Stop for human merge. Production deployment remains a separate explicit authorization.

## Required artifacts

- dated Cape Island audit and opportunity matrix;
- three territory boards with tradeoffs and recommendation;
- approved direction record;
- sitemap and priority journey map;
- typography and semantic-token proposal with TypeUI evidence;
- exact Figma target inventory and approval references;
- responsive page designs and interaction/motion specification;
- Storybook stories for reusable components and meaningful states;
- implementation notes and intentional-divergence log;
- test, accessibility, performance, preview, and release evidence;
- content/asset request list and pre-go-live checklist.

## Verification and release evidence

At each implementation handoff, report exact commands and exit status. The expected local gates are:

```text
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm check
corepack pnpm exec playwright install chromium
corepack pnpm test:e2e
```

Use Storybook and browser evidence for responsive, keyboard, focus, reduced-motion, loading, error, empty, and content-extreme states. Verify performance budgets and image behavior on representative mobile hardware/network conditions. A green local suite is not production approval.

## Pre-go-live checklist

Before calling the redesign ready, explicitly mark each item complete, blocked, or owned by a named person:

- final copy, product claims, scent notes, pricing, inventory, and policy content approved;
- product, gallery, market, about, and social imagery delivered, licensed, optimized, and supplied with alt text/crop intent;
- font licensing, hosting, fallbacks, and performance approved;
- Sanity schemas/content populated and production cache behavior verified;
- Shopify catalog, variants, inventory, discounts, cart, checkout, taxes, shipping, email, and order flows verified;
- contact destinations, form delivery, spam protection, privacy consent, and response expectations verified;
- SEO metadata, canonical URLs, structured data, redirects, sitemap, robots, social images, and analytics consent verified;
- responsive, keyboard, focus, contrast, reduced-motion, zoom, screen-reader, and content-extreme checks passed;
- loading skeletons, empty/error/retry states, and card hover/focus behavior passed;
- browser/device matrix and performance budgets passed;
- legal, privacy, terms, delivery, returns, accessibility, and contact details approved;
- production domains, environment variables, monitoring, incident owner, backup/rollback plan, and launch communications ready;
- protected branch green, independent review complete, Vercel preview approved, and human merge authorization recorded;
- explicit production deployment authorization recorded separately.

## Definition of done

The redesign is done only when the selected direction is human-approved, Figma evidence is exact and provenance-gated, design tokens and Storybook contracts are synchronized, approved storefront behavior is implemented, required tests and preview checks pass, content and commerce owners have supplied production truth, the pre-go-live checklist has no unnamed blocker, and a human has approved merge. Production remains out of scope until separately authorized.
