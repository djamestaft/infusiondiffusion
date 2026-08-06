# Infusion Diffusion Roadmap

Last updated: 5 August 2026

## Purpose

This document records the current state of the storefront and the work required to move from a local foundation to a production headless-commerce system. It covers project setup, service credentials, deployment, the agentic delivery system, and the first commerce milestones.

The intended ownership model is:

| Concern                                                      | Owner                        |
| ------------------------------------------------------------ | ---------------------------- |
| Storefront, routes, SEO, and customer experience             | Next.js on Vercel            |
| Editorial pages, campaigns, guides, and brand content        | Sanity                       |
| Products, variants, pricing, inventory, checkout, and orders | Shopify                      |
| Component states and visual contracts                        | Storybook                    |
| Approved design source                                       | Figma                        |
| Delivery rules, repeatable workflows, and quality gates      | Repository agents and skills |

## Current state

The repository has a proven agentic delivery baseline. Protected `main` runs green CI, and the pull-request, Preview, Production, Studio, draft, publish, and cache-invalidation paths have been proved end to end. The approved responsive templates compose the completed primitive inventory in Storybook; the public Home route combines the approved composition with Sanity editorial ownership and live Shopify catalogue truth, and the Fragrance Guide now proves a reusable Sanity-managed editorial-page model. The existing Shopify store has completed a read-only Storefront catalogue audit with a keep-and-clean decision; the normalized catalogue boundary also feeds live Collection and Product detail routes plus a persistent cart. A Shopify test-gateway order has proved checkout handoff, South African shipping and tax calculation, approved, declined, and gateway-failure payment states, order and notification creation, inventory decrement and restock, fulfilment, full refund, and archival. A real payment provider, business and tax registration, production content and assets, policies, domain, and final launch checks remain blockers to live purchasing; discount verification is deferred by product-owner decision.

### Application foundation — complete

- [x] Next.js App Router, React, and strict TypeScript configured
- [x] Node and pnpm versions declared for repeatable development and CI
- [x] Tailwind CSS and semantic design tokens configured
- [x] shadcn/ui conventions and an initial button primitive added
- [x] Responsive, accessible holding page implemented
- [x] Public website and embedded Sanity Studio separated into route branches
- [x] Health endpoint available at `/api/health`
- [x] Environment variables documented in `.env.example`
- [x] Production Next.js build verified locally

### Content foundation — connected and verified

- [x] Sanity Studio embedded at `/studio`
- [x] Initial `siteSettings` schema created
- [x] Sanity client, GROQ query, live content, draft mode, and Visual Editing foundations added
- [x] Fallback content supports local and preview builds without Sanity
- [x] Sanity schema extraction and type-generation commands added
- [x] Sanity project and production dataset created
- [x] Local, Preview, and Production credentials configured
- [x] CORS and embedded Studio host configuration completed
- [x] Initial site settings document populated
- [x] Draft, published, Preview, Production, and cache-invalidation flows verified end to end
- [x] Add a reusable Sanity editorial-page schema and connect the Fragrance Guide route with safe fallbacks
- [x] Expand the homepage with independently managed founder, service, longevity, and collection-invitation content
- [x] Add the approved Sanity-managed homepage media-carousel contract, runtime fallback, Storybook states, and automated coverage; final campaign photography and Sanity publication remain human content gates

### Design system — approved foundation, runtime migration in progress

- [x] Approved Figma brand foundation documented in `DESIGN.md`
- [x] Semantic color, typography, spacing, focus, and motion foundations added
- [x] Storybook configured for component development
- [x] Accessibility and interaction testing enabled in Storybook
- [x] Impeccable installed as a repository-scoped design skill with hooks
- [x] Figma MCP connected and agent workflow scoped to the canonical Infusion Diffusion file
- [x] Canonical Style Guide, palette, typography system, layout, and photography rules approved
- [x] Button and TextLink approved in Figma, implemented in Storybook/runtime, and synchronized through semantic variables
- [x] Input, Textarea, and Field approved in Figma, implemented in Storybook/runtime, and synchronized through semantic variables
- [x] ProductCard approved in Figma, implemented in Storybook/runtime with provisional brochure fixtures, and synchronized through semantic variables
- [x] Navigation and LogoTextLockup approved in Figma, implemented in Storybook/runtime, and synchronized through semantic variables
- [x] PriceDisplay and CommerceStatus approved in Figma, implemented in Storybook/runtime and ProductCard compositions, and synchronized through semantic variables
- [x] Dialog, Drawer, AlertDialog, and FeedbackAlert approved in Figma, implemented in Storybook/runtime, and synchronized through semantic variables
- [x] Badge, Eyebrow, Heading, Lead, and ContentHeader approved in Figma, implemented in Storybook/runtime, and synchronized through semantic variables
- [x] Confirm the editable LogoTextLockup as the production storefront mark
- [ ] Obtain the ornamental vector logo master and licence record only if future approved use requires it — deferred, not a release blocker
- [x] Core component inventory designed in Figma and represented in Storybook
- [x] Responsive Home, Collection, Product detail, and Editorial templates approved in Figma and implemented as reusable Storybook compositions

### Quality and delivery — CI, Preview, and Production operational

- [x] ESLint, Prettier, and strict type checking configured
- [x] Vitest unit and integration testing configured
- [x] Storybook browser tests configured
- [x] Playwright desktop/mobile E2E tests configured
- [x] axe accessibility checks configured
- [x] Storybook and Next.js production builds included in the quality gate
- [x] GitHub Actions workflow created
- [x] Current local formatting, lint, type, test, accessibility, and build checks pass
- [x] GitHub repository created and initial code pushed
- [x] Protected `main` branch and required CI checks enabled
- [x] Initial Vercel production holding page deployed
- [x] Vercel Preview deployment verified from a pull request
- [x] Production deployment and smoke test completed

### Agentic system — baseline validated

- [x] Persistent repository rules captured in `AGENTS.md`
- [x] Product, design, architecture, and operations context files created
- [x] Product designer agent defined
- [x] Storefront engineer agent defined
- [x] Content and commerce engineer agent defined
- [x] Quality reviewer agent defined
- [x] Browser release/debugging agent defined
- [x] Reusable skills created for feature briefs, design-to-Storybook, Sanity changes, Shopify changes, quality gates, and release debugging
- [x] Agent evaluation scenarios started in `docs/agent-evals.md`
- [x] Treehouse configured for repository-local, isolated concurrent agent worktrees
- [ ] Run Impeccable initialization to enrich its project-context schema
- [ ] Install Superpowers from the Codex plugin marketplace
- [x] Add Figma MCP usage rules and a design handoff workflow after connection
- [x] Exercise the full prompt-to-production workflow with the announcement bar
- [x] Record first-loop failure modes, improve guidance, and add regression evaluations
- [x] Define human approval points for design, merge, production, editorial publishing, and rollback
- [x] Trial Pi orchestration with Codex-backed specialist roles and scoped MCP
- [x] Retire Pi after operator testing exposed insufficient worker visibility and autonomous multi-PR behavior
- [x] Deliver the button/link system through visible Codex coordination and record interventions, review findings, and synchronization corrections
- [ ] Extract the proven generic system into a separate project template

### Commerce — catalogue and gated cart implemented; launch operations pending

- [x] Shopify selected as the commerce system of record
- [x] Headless boundary documented: Shopify handles commerce while Next.js owns all customer-facing UI
- [x] Sanity/Shopify ownership rules documented to avoid duplicated price or inventory state
- [x] Hosted Shopify checkout selected for the initial release
- [x] Audit the Storefront-visible existing catalogue; Admin-only apps, domains, billing, payment, tax, shipping, and fulfilment evidence remains required before checkout
- [x] Retain and clean the existing store; no evidence justifies a duplicate store or catalogue migration
- [ ] Confirm the real South African payment provider and Shopify fee requirements; ZAR, domestic shipping, test tax calculation, fulfilment, and refund behavior are verified
- [x] Create a Headless storefront and configure the server-only Storefront API credential for local, Vercel Preview, and Vercel Production environments
- [x] Implement the normalized server-only product and collection catalogue boundary
- [x] Connect browse-only Collection and Product detail routes to live Shopify catalogue truth
- [x] Replace the holding homepage with the approved Home template, Sanity editorial fields, and live Shopify catalogue truth
- [x] Design normalized product, variant, collection, cart, and money types
- [x] Implement server-side Shopify catalogue and cart GraphQL operations
- [x] Build collection, product detail, persistent cart, and checkout-gated journeys
- [ ] Add webhook handling and cache invalidation where required
- [ ] Verify discounts and repeat the checkout lifecycle with the real payment provider; inventory, test checkout, order, notification, fulfilment, restock, and refund flows are verified

## Credentials and external services checklist

Secrets must be placed in `.env.local` for local development and in the correct Vercel environment. They must never be committed or exposed through `NEXT_PUBLIC_*` unless they are explicitly safe browser configuration.

### GitHub

- [x] Create the repository under the intended owner or organisation
- [x] Add the remote and push the initial commit
- [x] Protect `main`; require pull requests and successful CI checks
- [ ] Configure collaborators and least-privilege access
- [ ] Enable Dependabot or an equivalent dependency-update process

### Sanity

- [x] Create the project
- [x] Create the `production` dataset; defer a separate development dataset until a feature requires isolation
- [x] Set the project ID and dataset variables locally and in Vercel
- [x] Create a least-privilege Viewer token for authenticated preview access
- [x] Add localhost, Vercel Preview, and production origins to CORS
- [x] Verify the embedded Studio at `/studio`; no external Studio host is currently required

### Vercel

- [x] Import the GitHub repository
- [x] Confirm the Node version matches `.nvmrc`
- [x] Configure Preview and Production environment variables separately
- [x] Configure `NEXT_PUBLIC_SITE_URL` for `https://infusion-diffusion.vercel.app`
- [x] Deploy the fallback holding page to the Vercel production URL
- [x] Deploy a preview and verify `/`, `/studio`, and `/api/health`
- [ ] Add the final custom production domain and validate DNS
- [ ] Enable deployment protection and runtime/log access for the appropriate team

### Figma

- [x] Confirm the canonical design file and approved Style Guide frame
- [x] Connect and authenticate Figma MCP
- [x] Scope agent work to the canonical Infusion Diffusion file and exact node links
- [x] Document page/frame naming and component-to-code mapping conventions
- [x] Test one approved component handoff through Storybook
- [x] Synchronize Button/TextLink Figma masters, semantic variables, repository guidance, runtime tokens, and Storybook contracts
- [x] Synchronize Input/Textarea/Field Figma masters, semantic variables, repository guidance, runtime tokens, and Storybook contracts
- [x] Synchronize ProductCard and Navigation Figma masters, semantic variables, repository guidance, runtime tokens, and Storybook contracts

### Shopify

- [x] Secure owner access to the existing store
- [ ] Export or otherwise safeguard current products, customers, orders, domains, and configuration before restructuring
- [x] Complete the keep-versus-new-store catalogue audit and choose to retain the existing store
- [ ] Finish payments, tax registration, policies, and notification branding; the South Africa market, ZAR checkout, domestic shipping, test tax calculation, and transactional notifications are verified
- [x] Create the Headless Storefront API integration with minimum catalogue scopes; exact inventory quantity remains deliberately disabled
- [ ] Keep Admin API credentials server-only and add them only when a defined integration needs them
- [ ] Configure webhook secrets separately for Preview and Production where applicable

### Agent tooling

- [ ] Install Superpowers through the Codex plugin marketplace
- [ ] Run `$impeccable init` when ready to replace the provisional context with its richer schema
- [x] Verify repository agents can read the project context and invoke their assigned skills
- [x] Configure Treehouse to isolate concurrent writing agents in repository-local worktrees
- [x] Evaluate and reject Pi as the repository orchestrator
- [x] Validate the visible Codex coordination rules on the button/link feature
- [ ] Document any account-specific MCP setup without committing tokens

## Delivery sequence

### Phase 1 — establish the remote delivery loop

1. [x] Create the GitHub repository and push the initial foundation.
2. [x] Protect `main` with the existing CI workflow.
3. [x] Connect Vercel and deploy the fallback holding page.
4. [x] Open a non-`main` pull request and obtain a green Vercel Preview deployment.
5. [x] Verify `/`, `/studio`, and `/api/health` on Preview and confirm Preview/Production environment separation.

Exit criteria: a pull request produces a green CI run and a reviewable Vercel Preview; production still requires explicit human approval.

### Phase 2 — connect editorial content

1. [x] Provision Sanity and configure credentials/CORS.
2. [x] Populate site settings and prove published plus draft content flows.
3. [x] Expand schemas only for the agreed holding-page slice.
4. [x] Verify Visual Editing, cache behavior, and generated types.

Exit criteria: an editor can publish a controlled content change and see it correctly on Preview and Production without a code change.

### Phase 3 — validate the agentic workflow

1. [x] Choose the announcement bar as the first small real feature.
2. [x] Turn the prompt into decision-complete acceptance criteria.
3. [x] Move through product design, approved Figma frames, Storybook approval, implementation, tests, independent review, Preview, merge, Production, and Sanity publishing.
4. [x] Capture environment, content-rollout, URL-safety, hidden-layout, integrated-test, and protected-Preview failure modes.
5. [x] Update repository context, skills, tests, and regression evaluations instead of relying on conversational memory.

Exit criteria met: the announcement bar was delivered from repository context and stopped for human design approval, merge, and editorial publishing. The reusable approval gates and first-loop regressions are documented in `docs/operations.md` and `docs/agent-evals.md`.

### Phase 4 — establish the production design system

1. [x] Finalize brand strategy and approve foundation tokens.
2. [x] Build Storybook coverage for navigation, buttons, inputs, cards, price display, badges, dialogs/drawers, feedback states, and content primitives.
3. [x] Validate keyboard behavior, contrast, responsive extremes, reduced motion, and long content across the full component inventory.
4. [x] Map approved Figma components to repository primitives.

Exit criteria: storefront pages can be composed from approved, tested primitives rather than page-specific UI.

### Phase 5 — connect headless Shopify

1. Audit and prepare the Shopify backend.
2. Implement the normalized server-side commerce boundary.
3. Deliver catalogue browsing and product detail pages.
4. Add cart persistence and redirect to Shopify hosted checkout.
5. Verify stock, pricing, discounts, checkout, order creation, fulfilment, refunds, and error states.

Exit criteria: a customer can discover an in-stock product, add the correct variant, complete payment through Shopify checkout, and produce an operable Shopify order.

### Phase 6 — launch readiness

1. Complete content, policies, metadata, structured data, analytics, consent, redirects, and domain work.
2. Run accessibility, performance, SEO, security, and multi-device acceptance checks.
3. Exercise incident response and rollback procedures.
4. Approve production launch and monitor orders, errors, performance, and customer support signals.

Exit criteria: business, design, engineering, and operations checks are signed off, with a known-good rollback path.

### Phase 7 — make the system reusable

1. Review what proved generic after at least one complete storefront feature and one production release.
2. Separate Infusion Diffusion-specific context from reusable architecture, agents, skills, tests, and scaffolding.
3. Create a tagged GitHub template and a bootstrap skill that gathers project-specific variables.
4. Test the template by creating a second project from an empty directory.

Exit criteria: a new brand can be scaffolded without inheriting Infusion Diffusion content, credentials, assumptions, or identifiers.

## Immediate next actions

1. Register the business, resolve the South African tax position, and select and configure the real payment provider before enabling hosted checkout.
2. Review the integrated Fragrance Guide on protected Vercel Preview, then create and publish its `fragrance-guide` editorial document in Sanity.
3. Shape and implement a Sanity-managed About page that develops the approved founder story without duplicating commerce data.
4. Verify policies, notification branding, apps, billing, and the final domain; discounts are explicitly deferred, and the proven order lifecycle must be repeated with the real payment provider.
5. Export and validate a preservation copy before a separately approved Shopify catalogue cleanup.

## Roadmap maintenance

Update this file whenever a phase changes state, a service is connected, an architectural decision changes, or a new blocker is discovered. Each completed item should be backed by repository evidence, a successful service check, or a documented human decision. Detailed implementation procedures belong in the relevant skill or operations guide; this roadmap should remain the project-level source of status and sequence.
