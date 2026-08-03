# Pi multi-writer isolation validation

**Validation batch:** first concurrent Pi writing batch

**Validated base:** `infusion-diffusion/main` at `2e1fab3082a94186d29e47a9ca0fbff97b856336`

**Validation status:** launch isolation is evidenced for both writers; final-delivery evidence for writer B remains pending.

## Ownership and launch evidence

| Writer | Treehouse lease / worktree | Branch | `cwd` | Permitted write scope | Evidence status |
| --- | --- | --- | --- | --- | --- |
| `pi-isolation-evidence` (writer A) | worktree `5` held by `pi-isolation-evidence` — `/Users/devontaft/Documents/Projects/Client/infusion-diffusion/worktrees/.treehouse/infusion-diffusion-2348e6/5/infusion-diffusion` | `agent/pi-isolation-evidence` | the worktree `5` path above | `docs/operations/pi-multi-writer-isolation.md` only | Current branch, `cwd`, and Git worktree registration independently confirmed during validation. |
| `shopify-audit-preflight` (writer B) | worktree `6` held by `shopify-audit-preflight` — `/Users/devontaft/Documents/Projects/Client/infusion-diffusion/worktrees/.treehouse/infusion-diffusion-2348e6/6/infusion-diffusion` | `agent/shopify-audit-preflight` | the worktree `6` path above | `docs/planning/shopify-store-audit.md` only | Lease holder and scope are coordinator launch evidence; current branch, `cwd`, and distinct Git worktree registration independently confirmed during validation. |

The two worktree paths, branch names, and permitted file paths are distinct. The scopes do not overlap, so the writers can produce independently mergeable pull requests without writing the same file.

## Commands and observed results

```text
git fetch infusion-diffusion main
# succeeded; infusion-diffusion/main = 2e1fab3082a94186d29e47a9ca0fbff97b856336

git worktree list --porcelain
# registered worktree 5 on refs/heads/agent/pi-isolation-evidence
# registered worktree 6 on refs/heads/agent/shopify-audit-preflight

git rev-parse --show-toplevel; git branch --show-current
# writer A: worktree 5 path; agent/pi-isolation-evidence

git -C <writer-B-worktree> rev-parse --show-toplevel; git -C <writer-B-worktree> branch --show-current
# writer B: worktree 6 path; agent/shopify-audit-preflight

git status --short --branch
# writer A started clean on agent/pi-isolation-evidence

git remote -v; gh auth status --active; gh repo view --json nameWithOwner,url
# remote infusion-diffusion resolved to djamestaft/infusiondiffusion;
# authenticated GitHub access and repository access succeeded
```

`treehouse status` reported no worktrees in its pool while Git still registered both allocated worktrees. This record therefore treats the worktree numbers and holders as coordinator launch evidence, and the checked Git registrations as the durable local isolation evidence.

## Final evidence still required

Writer B must provide its final commit SHA and pull-request URL, plus final `git status --short` and `git diff --name-only` evidence showing that only `docs/planning/shopify-store-audit.md` changed. Those facts must not be inferred from the launch assignment or from this writer's record.

Writer A's corresponding final commit, push, pull-request URL, and final one-path diff evidence are recorded with this pull request after this document is committed.
