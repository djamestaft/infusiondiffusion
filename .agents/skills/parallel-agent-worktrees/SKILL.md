---
name: parallel-agent-worktrees
description: Allocate and coordinate isolated Treehouse worktrees and Git branches for concurrent Infusion Diffusion coding agents. Use whenever two or more agents may write repository files in parallel, when starting an implementation task away from the primary checkout, or when returning and integrating an agent workspace.
---

# Parallel agent worktrees

## Allocate

1. Split work into independently mergeable tasks with explicit acceptance criteria and non-overlapping file ownership. Keep dependent or heavily overlapping work sequential.
2. Run `treehouse get --lease --lease-holder "<agent-or-task>"` from the repository root. Capture the returned absolute path and start the writing agent in that directory.
3. Inside the leased worktree, create one task branch from current `origin/main`: run `git fetch origin main`, then `git switch -c agent/<task-slug> origin/main`. Never share a task branch or checkout between writing agents.
4. Run `corepack pnpm install --frozen-lockfile` when dependencies are not already warm. Configure ignored environment files separately; worktrees do not authorize copying or exposing secrets.
5. Assign unique development ports or isolated local resources when agents run servers concurrently.

## Work and integrate

1. Preserve unrelated changes and remain within the assigned files. Report an ownership overlap before editing the same surface as another agent.
2. Commit coherent changes on the task branch, push it, and open a pull request. Do not merge into or edit `main` from an agent worktree.
3. Rebase or merge the latest `origin/main` into the task branch before final verification when another task landed first. Resolve conflicts deliberately and rerun the proportional quality gate.
4. Require green CI, review, and any relevant Vercel Preview verification before human merge.

## Return safely

1. Confirm `git status --short` is clean and all required commits are pushed or intentionally retained.
2. After the pull request is merged or the work is safely preserved, run `treehouse return <absolute-worktree-path>` from the primary checkout.
3. Use `treehouse status` to audit active leases. Use `treehouse prune` as a dry run for stale merged worktrees; deletion requires explicit human authorization. Never use forced return or destructive cleanup to discard unlanded work.
