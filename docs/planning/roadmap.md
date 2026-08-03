# Infusion Diffusion Roadmap

Last updated: 3 August 2026

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

The repository is a working local and remote foundation. Protected `main` runs green CI, the fallback holding page is live on Vercel at `https://infusion-diffusion.vercel.app`, and pull request #1 proved the Preview delivery loop end to end.

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

### Content foundation — scaffolded, credentials pending

- [x] Sanity Studio embedded at `/studio`
- [x] Initial `siteSettings` schema created
- [x] Sanity client, GROQ query, live content, draft mode, and Visual Editing foundations added
- [x] Fallback content supports local and preview builds without Sanity
- [x] Sanity schema extraction and type-generation commands added
- [ ] Sanity project and datasets created
- [ ] Local, Preview, and Production credentials configured
- [ ] CORS and Studio host configuration completed
- [ ] Initial site settings document populated
- [ ] Content publishing and preview flow verified end to end

### Design system — scaffolded

- [x] Provisional brand direction documented in `DESIGN.md`
- [x] Semantic color, typography, spacing, focus, and motion foundations added
- [x] Storybook configured for component development
- [x] Accessibility and interaction testing enabled in Storybook
- [x] Impeccable installed as a repository-scoped design skill with hooks
- [ ] Figma MCP connected and limited to the required Infusion Diffusion files
- [ ] Brand assets, typography licences, photography rules, and final palette approved
- [ ] Core component inventory designed in Figma and represented in Storybook
- [ ] Responsive page templates approved before storefront implementation

### Quality and delivery — CI operational, preview deployment pending

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
- [ ] Production deployment and smoke test completed

### Agentic system — initial scaffold complete

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
- [ ] Add Figma MCP usage rules and a design handoff workflow after connection
- [ ] Exercise the full prompt-to-preview workflow on a small real feature
- [ ] Record failure modes, improve skills, and add regression evaluations
- [ ] Define human approval points for design, merge, production, and rollback
- [ ] Extract the proven generic system into a separate project template

### Commerce — architecture chosen, implementation pending

- [x] Shopify selected as the commerce system of record
- [x] Headless boundary documented: Shopify handles commerce while Next.js owns all customer-facing UI
- [x] Sanity/Shopify ownership rules documented to avoid duplicated price or inventory state
- [x] Hosted Shopify checkout selected for the initial release
- [ ] Audit the existing Shopify store, catalogue, theme-independent data, apps, domains, and billing
- [ ] Decide whether to clean the existing store or create a fresh store without discarding useful product/order data
- [ ] Confirm South African payment gateway, currency, tax, shipping, fulfilment, and Shopify fee requirements
- [ ] Create least-privilege Storefront API credentials
- [ ] Design normalized product, variant, collection, cart, and money types
- [ ] Implement server-side Shopify client and GraphQL operations
- [ ] Build collection, product detail, cart, and checkout journeys
- [ ] Add webhook handling and cache invalidation where required
- [ ] Verify real inventory, discount, checkout, order, and fulfilment flows

## Credentials and external services checklist

Secrets must be placed in `.env.local` for local development and in the correct Vercel environment. They must never be committed or exposed through `NEXT_PUBLIC_*` unless they are explicitly safe browser configuration.

### GitHub

- [x] Create the repository under the intended owner or organisation
- [x] Add the remote and push the initial commit
- [x] Protect `main`; require pull requests and successful CI checks
- [ ] Configure collaborators and least-privilege access
- [ ] Enable Dependabot or an equivalent dependency-update process

### Sanity

- [ ] Create the project
- [ ] Create `production` and, if useful, a separate preview/development dataset
- [ ] Set the project ID and dataset variables locally and in Vercel
- [ ] Create a least-privilege token for authenticated preview access only if needed
- [ ] Add localhost, Vercel Preview, and production origins to CORS
- [ ] Deploy or configure the Studio host if an external Studio URL is desired

### Vercel

- [x] Import the GitHub repository
- [ ] Confirm the Node version matches `.nvmrc`
- [ ] Configure Preview and Production environment variables separately
- [x] Configure `NEXT_PUBLIC_SITE_URL` for `https://infusion-diffusion.vercel.app`
- [x] Deploy the fallback holding page to the Vercel production URL
- [x] Deploy a preview and verify `/`, `/studio`, and `/api/health`
- [ ] Add the final custom production domain and validate DNS
- [ ] Enable deployment protection and runtime/log access for the appropriate team

### Figma

- [ ] Confirm the canonical design file and team ownership
- [ ] Connect Figma MCP
- [ ] Grant access only to the required files
- [ ] Document page/frame naming and component-to-code mapping conventions
- [ ] Test one approved component handoff through Storybook

### Shopify

- [ ] Secure owner access to the existing store
- [ ] Export or otherwise safeguard current products, customers, orders, domains, and configuration before restructuring
- [ ] Complete the keep-versus-new-store audit
- [ ] Configure markets, currency, taxes, shipping, payments, policies, and notifications
- [ ] Create the Storefront API integration and minimum required scopes
- [ ] Keep Admin API credentials server-only and add them only when a defined integration needs them
- [ ] Configure webhook secrets separately for Preview and Production where applicable

### Agent tooling

- [ ] Install Superpowers through the Codex plugin marketplace
- [ ] Run `$impeccable init` when ready to replace the provisional context with its richer schema
- [ ] Verify repository agents can read the project context and invoke their assigned skills
- [x] Configure Treehouse to isolate concurrent writing agents in repository-local worktrees
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

1. Provision Sanity and configure credentials/CORS.
2. Populate site settings and prove published plus draft content flows.
3. Expand schemas only for an agreed first page slice.
4. Verify Visual Editing, cache behavior, and generated types.

Exit criteria: an editor can publish a controlled content change and see it correctly on Preview and Production without a code change.

### Phase 3 — validate the agentic workflow

1. Choose a small real feature, such as the announcement bar or newsletter form.
2. Turn the prompt into decision-complete acceptance criteria.
3. Move through product design, Figma/Storybook, implementation, tests, independent review, and preview verification.
4. Capture unclear instructions, missed edge cases, excessive context, and false-success claims.
5. Update the relevant context file, skill, or evaluation instead of relying on conversational memory.

Exit criteria: a fresh agent can complete the workflow from repository context, while stopping at the documented human approval points.

### Phase 4 — establish the production design system

1. Finalize brand strategy and approve tokens.
2. Build Storybook coverage for navigation, buttons, inputs, cards, price display, badges, dialogs/drawers, feedback states, and content primitives.
3. Validate keyboard behavior, contrast, responsive extremes, reduced motion, and long content.
4. Map approved Figma components to repository primitives.

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

1. Confirm the Vercel project uses Node 22 and document the Preview/Production variable sets as services are connected.
2. Create the Sanity project and configure local, Preview, and Production credentials plus CORS.
3. Select the first small feature that will exercise the full brief-to-design-to-Storybook-to-Preview agent workflow.
4. Audit the existing Shopify store before creating or deleting commerce data.

## Roadmap maintenance

Update this file whenever a phase changes state, a service is connected, an architectural decision changes, or a new blocker is discovered. Each completed item should be backed by repository evidence, a successful service check, or a documented human decision. Detailed implementation procedures belong in the relevant skill or operations guide; this roadmap should remain the project-level source of status and sequence.
