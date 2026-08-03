---
name: parallel-agent-worktrees
description: Allocate and coordinate isolated Treehouse worktrees and Git branches for concurrent Infusion Diffusion coding agents. Use whenever two or more agents may write repository files in parallel, when starting an implementation task away from the primary checkout, or when returning and integrating an agent workspace.
---

# Parallel agent worktrees

## Allocate

1. Split work into independently mergeable tasks with explicit acceptance criteria and non-overlapping file ownership. Keep dependent or heavily overlapping work sequential.
2. Resolve the repository's real GitHub remote instead of assuming it is named `origin`. Confirm it with `git remote -v` and use that remote consistently for fetch, push, and tracking branches.
3. Before relying on automated GitHub delivery, verify `command -v gh`, `gh auth status --active`, and repository access with `gh repo view`. If Git operations use SSH, also verify `ssh-add -l`, `ssh -T git@github.com` (GitHub's successful handshake exits with status 1), and `git ls-remote <remote> HEAD`. Treehouse changes the working directory, not the parent process's shell environment; an unusable SSH agent or missing executable must be diagnosed as an environment issue rather than attributed to the worktree.
4. Remember that selecting SSH in `gh auth login` does not rewrite an existing HTTPS remote. Change a shared remote only when that matches the user's requested transport, then verify access from both the primary checkout and a leased worktree. Never print credentials or private key material while diagnosing authentication.
5. Run `treehouse get --lease --lease-holder "<agent-or-task>"` from the repository root. Capture the returned absolute path and start the writing agent in that directory.
6. Inside the leased worktree, create one task branch from the current remote `main`: run `git fetch <remote> main`, then `git switch -c agent/<task-slug> <remote>/main`. Never share a task branch or checkout between writing agents.
7. Run `corepack pnpm install --frozen-lockfile` when dependencies are not already warm. Configure ignored environment files separately; worktrees do not authorize copying or exposing secrets.
8. Assign unique development ports or isolated local resources when agents run servers concurrently.

## Work and integrate

1. Preserve unrelated changes and remain within the assigned files. Report an ownership overlap before editing the same surface as another agent.
2. Commit coherent changes on the task branch, push it, and open a pull request with `gh pr create`. If `gh` is unexpectedly unavailable, diagnose the shared shell/tool installation first and use an already-authorized GitHub connector or API fallback when available; do not hand routine PR creation back to the user solely because one CLI command is missing. Do not merge into or edit `main` from an agent worktree.
3. Rebase or merge the latest `<remote>/main` into the task branch before final verification when another task landed first. Resolve conflicts deliberately and rerun the proportional quality gate.
4. Require green CI, review, and any relevant Vercel Preview verification before human merge.

## Return safely

1. Confirm `git status --short` is clean and all required commits are pushed or intentionally retained.
2. After the pull request is merged or the work is safely preserved, run `treehouse return <absolute-worktree-path>` from the primary checkout.
3. Use `treehouse status` to audit active leases. Use `treehouse prune` as a dry run for stale merged worktrees; deletion requires explicit human authorization. Never use forced return or destructive cleanup to discard unlanded work.
