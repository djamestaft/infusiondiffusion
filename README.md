# Infusion Diffusion

Agent-ready headless commerce foundation for Infusion Diffusion.

## Stack

- Next.js App Router on Vercel
- Sanity Studio and Content Lake for editorial content
- Shopify Storefront API and hosted checkout for existing commerce
- Tailwind CSS and shadcn/ui primitives
- Storybook, Vitest, Playwright, axe, and Impeccable
- Codex project agents and repo-scoped skills

## Local setup

```bash
nvm use
corepack enable
corepack pnpm install
cp .env.example .env.local
corepack pnpm dev
```

The site deliberately renders safe fallback content before Sanity is connected. Visit `/studio` for connection guidance and `/api/health` for a deployment check.

## Useful commands

```bash
corepack pnpm storybook
corepack pnpm test
corepack pnpm test:stories
corepack pnpm test:e2e
corepack pnpm check
```

## Connect services

Follow `docs/operations.md` for GitHub, Sanity, Vercel, Figma, Superpowers, and Shopify operations. Do not place secrets in committed files.

## Agent workflow

The repository contains persistent rules in `AGENTS.md`, specialized agents in `.codex/agents`, and reusable procedures in `.agents/skills`. A feature moves through brief, design, implementation, independent review, preview verification, human merge, and production smoke testing.

## Approved design implementation

Start with [DESIGN.md](DESIGN.md) and the [24-frame approved handoff](docs/features/2026-09-08-design-approval.md).
The sole visual source is [30 — Redesign / Approved](https://www.figma.com/design/jIMvwSBkilg7eplo3IiHPa/Infusion-Diffusion-Redesign?node-id=2004-14).
Follow the [atomic, Storybook-first implementation contract](docs/design-implementation.md)
and [roadmap](docs/planning/roadmap.md). Devon owns INF-33/34/35 implementation;
Shawnee owns preparation and coordinates independent verification.
