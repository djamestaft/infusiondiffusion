---
name: orchestrate-pi-team
description: Coordinate Infusion Diffusion work through the project Pi specialist team. Use when Pi should delegate research, design, implementation, review, testing, or release work; when two or more agents may collaborate; or before any Pi worker writes repository files.
---

# Orchestrate the Pi team

For first-time setup, run `nvm use`, then
`.agents/skills/orchestrate-pi-team/scripts/install-pi-runtime.sh`. Authenticate
interactively with `/login openai-codex`; never copy the resulting auth file into
the repository. Review and update the pinned runtime and package audit before
changing versions.

1. Read `AGENTS.md`, the requested feature brief, and the relevant product,
   design, architecture, or operations context. Turn ambiguous work into explicit
   acceptance criteria before delegation.
2. Delegate substantial research, design, review, tests, and multi-file work.
   Answer trivial or already-known questions directly. Use the role map below and
   pass only skills that apply to the worker's bounded task.
3. Keep communication coordinator-mediated. After delegation, call
   `wait_for_agents`; answer every relay immediately with `agent_message`, then
   wait again. Use steering for changed requirements and broadcasts only for
   information every active worker needs. Never poll workers or treat streaming
   text as a result.
4. Call `agent_result` once for each terminal worker. Check its evidence against
   the acceptance criteria before synthesizing or starting dependent work. A
   missing final result, failed check, or unresolved relay is not success.

## Route roles

- `explorer`: fast repository mapping; no writes.
- `docs_researcher`: current primary-source documentation through scoped MCP;
  no writes.
- `product_designer`: feature shaping, Figma evidence, Impeccable, responsive
  states, and accessibility; no application-code writes.
- `storefront_engineer`: approved Next.js, component, Storybook, and test work.
- `content_commerce_engineer`: Sanity schemas/content flows and server-side
  Shopify boundaries.
- `quality_reviewer`: fresh independent review after implementation; no writes.
- `browser_release_debugger`: browser, Preview, deployment, and incident evidence;
  no production mutation.

Use `feature-brief` before design or implementation, `design-to-storybook` and
`impeccable` for UI, `sanity-content-change` or `shopify-storefront-change` for
their ownership boundaries, `quality-gate` before handoff, and `release-debug`
for Preview or runtime diagnosis.

## Isolate writers

Before delegating to either writing role:

1. Read and follow `parallel-agent-worktrees`.
2. Split work only when tasks are independently mergeable with non-overlapping
   ownership. Keep migrations, generated files, lockfiles, and shared component
   boundaries sequential unless one worker owns the whole boundary.
3. From the primary repository, verify GitHub and SSH access, fetch the real
   remote `main`, lease a Treehouse worktree, and create an
   `agent/<task-slug>` branch from `<remote>/main`.
4. Delegate with the leased worktree as `cwd`, `pathScopeRoots: ["."]`, and
   `pathScopeAllowWrite: true`. Never start a writer in the primary checkout or
   reuse a writer in a different worktree.
5. Require the worker to run targeted checks, commit, push, and open a pull
   request. Integrate only through green CI, relevant Preview evidence,
   independent review, and human merge.

Treat Pi path scope as a prompt and launch guard, not an OS sandbox. Do not pass
production credentials to workers. Stop for human approval at design, merge,
production, editorial publish, and rollback gates.

## Handoff

Report worker-to-task ownership, worktree and branch for every writer, relay or
steering decisions, verification commands and results, open pull requests,
residual risks, and the next human approval required. Record recurring failures
in `docs/agent-evals.md` or the nearest relevant skill.
