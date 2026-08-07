# Plan: Finalize pending Pi Figma MCP Catalog integration

## Objective

Finish the transferred Pi activation work on the existing isolated `agent/pi-figma-catalog` delivery branch without contacting Figma again. Repository guidance, roadmap status, the transferred activation specification, and focused tests must consistently state:

1. Pi is the hard-required client for this repository’s Figma MCP route, although Pi orchestration remains retired;
2. project-local `pi-mcp-adapter` activation is complete;
3. the Pi Figma MCP Catalog registration was submitted and approval is pending, with no promised response timeline;
4. the observed Dynamic Client Registration attempt returned HTTP 403 before browser OAuth; and
5. browser OAuth, tool enumeration, and one bounded read-only lookup are separate post-approval gates and are not evidence for this delivery.

Do not authenticate, resubmit, add credentials, modify Figma content, change application UI, deploy, or disturb unrelated merged work.

## Checkout and transferred-work evidence

- The configured remote is `infusion-diffusion`. `git fetch infusion-diffusion main` completed successfully during planning.
- The checkout was clean, local `main` was safely fast-forwarded to fetched `infusion-diffusion/main`, and both now resolve to `4d38aec1c6fd0c2f2a33ccc19d629d155f1cf57d`.
- `agent/pi-figma-catalog` is based directly on that remote commit and is two transferred commits ahead at planning time (`85c0e50`, `78fa3d3`). The branch contains no uncommitted files.
- `docs/planning/roadmap.md` was reread after the fetch and fast-forward. It does not yet record Pi adapter activation, Catalog submission/pending approval, or post-approval gates.
- The transferred diff currently contains only `.gitignore`, `.pi/mcp.json`, `.pi/settings.json`, `adws/tests/test_pi_mcp_config.py`, `docs/operations.md`, and the two existing Pi specs. Contact and other merged application work are inherited from remote `main`, not replayed as branch changes.
- The hosted `.pi/mcp.json` is the transferred endpoint change. Its blob is `6d4983f9394341227ebbca2c46f4965343198c96`, equal to `85c0e50:.pi/mcp.json`. Preserve that file byte-for-byte.

If the remote advances before handoff, fetch it, integrate the latest `infusion-diffusion/main` without rewriting unrelated work, reread the roadmap, and rerun all checks. A conflict in an owned file is a blocker for deliberate resolution; never force-reset or discard transferred commits.

## Specialist routing

- **Implementation owner — `builder` (sole writer):** updates the scoped specification, operations guidance, roadmap, and focused regression test; runs checks; commits; pushes one branch; and prepares one pull request.
- **Read-only advisor — `browser_release_debugger`:** verifies that the documented runtime boundary accurately places the observed HTTP 403 at DCR before browser OAuth and that no live provider/authentication request was used as delivery evidence. It must not edit, authenticate, submit a form, handle credentials, or call Figma tools.
- **Independent review owner — `quality_reviewer`:** independently maps the final diff and evidence to every criterion, checks secret hygiene and preserved scope, and must report no blocker before PR handoff.
- Exactly one writing owner, one existing delivery branch, and one pull request are authorized. Do not allocate another writing worktree.

## Applicable project skills

- **`.agents/skills/release-debug/SKILL.md`:** applies because the work records an external-provider runtime diagnosis. Keep the known 403 at the Figma DCR boundary, distinguish it from local activation and browser OAuth, and do not repeat the provider request.
- **`.agents/skills/quality-gate/SKILL.md`:** applies for acceptance-to-evidence mapping, focused regression coverage, roadmap reconciliation, secret/diff inspection, deterministic checks, and residual-risk reporting.
- **`.agents/skills/parallel-agent-worktrees/SKILL.md`:** applies because implementation is already in a non-primary isolated checkout. Continue in this single Treehouse-managed branch/worktree; do not create concurrent writers or another PR topology.
- `feature-brief`, `impeccable`, and `design-to-storybook` do not trigger because no UI, interaction, responsive state, reusable component, Storybook contract, or Figma design content changes.
- Sanity and Shopify skills do not trigger because editorial and commerce systems are untouched. SSSF workflow configuration is also out of scope.

## System ownership boundaries

- **Pi** is the repository-required client for this Figma MCP path and owns project trust, package loading, extension commands, and local session behavior. Its retired orchestration role is a separate decision.
- **`pi-mcp-adapter`** owns MCP configuration loading and its DCR/OAuth behavior. Repository activation does not override provider policy or prove a live connection.
- **Figma** owns `https://mcp.figma.com/mcp`, DCR policy, Catalog review and approval, browser OAuth, scopes, tool availability, design data, and any approval timing. Submission is not approval.
- **The repository** owns the exact project activation declaration, hosted endpoint/lifecycle/discovery policy, version pin alignment, static secret-hygiene tests, operations guidance, and truthful status documentation.
- **OS credential storage** will own any future OAuth credential after human approval. OAuth URLs/codes, tokens, client IDs/secrets, registration payloads/responses, account identities, and MCP result payloads must not enter tracked files, retained logs, screenshots, or handoffs.
- **Next.js, Storybook, Sanity, Shopify, approved Figma content, and Vercel** remain unchanged under their existing ownership.

## Exact file ownership

### Builder writes

1. **`docs/operations.md`**
   - Replace the current “optional Pi” and immediate live-smoke instructions with a required-client runbook.
   - Keep retired Pi orchestration distinct from required Pi Figma MCP usage.
   - Separate status into activation complete, Catalog registration submitted/approval pending, observed DCR HTTP 403 before browser OAuth, and post-approval verification.
   - Permit only non-network activation checks now. Explicitly prohibit `/mcp-auth figma`, tool enumeration, read-only lookup, DCR retries/workarounds, another Catalog submission, credentials, and live-support claims until approval is independently confirmed.
   - Document sanitized evidence and future human gates without inventing a submission date, reference number, response body, approval promise, or timeline.

2. **`docs/planning/roadmap.md`**
   - Reconcile Agentic system, Figma/Agent tooling checklist, and immediate-next-action wording with the same four statuses.
   - Mark adapter activation and Catalog submission complete; leave Catalog approval and post-approval OAuth/tool enumeration/one bounded read-only lookup incomplete and externally blocked.
   - Preserve broad evidence that Figma MCP has worked through already-supported clients, but do not let that statement imply Pi is approved or live.
   - State that Pi is required for this repository route while orchestration remains retired.

3. **`specs/d99fc09f_pi-figma-mcp.md`**
   - Preserve its provenance as the original activation plan, but add a prominent current-status supersession and make its actionable acceptance, verification, release, gate, and risk sections safe.
   - Remove or explicitly supersede instructions that make browser OAuth, tool enumeration, or a live lookup current delivery requirements.
   - Record only the sanitized observed DCR HTTP 403 and submitted/pending Catalog state. Do not include raw requests/responses, account data, identifiers, credentials, dates, or timelines.

4. **`adws/tests/test_pi_mcp_config.py`**
   - Strengthen dependency-free static regression coverage so there is exactly one `pi-mcp-adapter` activation, its source uses an exact semantic version equal to the exact `package.json` devDependency pin, bundled skills remain disabled, and the extension is not disabled.
   - Assert the full tracked MCP shape contains only host discovery `off` and the single lazy `figma` server at exactly `https://mcp.figma.com/mcp`.
   - Reject unexpected tracked auth/OAuth/header/client-ID/client-secret/bearer/token/password/credential configuration and obvious secret-bearing string values.
   - Keep every test offline. Test names and assertions must claim static activation/configuration hygiene only, never Figma approval, reachability, OAuth success, tool availability, or live support.

### Retain and inspect, but do not edit

- **`.pi/mcp.json`** — protected transferred endpoint. Do not normalize, reorder, or resave it; its blob must remain `6d4983f9394341227ebbca2c46f4965343198c96` and equal `85c0e50:.pi/mcp.json`.
- **`.pi/settings.json`** — activation is already complete at `npm:pi-mcp-adapter@2.20.1` with `skills: []`; inspect through tests, but add no settings, auth, environment values, Catalog metadata, or credentials.
- **`.gitignore`** — the transferred rules already ignore Pi caches, sessions, OAuth artifacts, and local credentials. Verify the rules; do not broaden them without a separately evidenced missing artifact.
- **`package.json` and `pnpm-lock.yaml`** — the exact `2.20.1` dependency and lock entry are authoritative and inspect-only. No dependency update is authorized.
- **`specs/07799513_pi-figma-catalog.md`** — preserve as the earlier planning record; do not rewrite stale historical topology in place.
- **`specs/76046103_pi-figma-catalog.md`** — preserve this session’s plan copy unchanged after it is added.
- All application, UI, Storybook, Sanity, Shopify, Vercel, external form, credential, and Figma-content files are protected.

## Implementation sequence

1. Reconfirm clean status, current remote, branch ancestry, the transferred file list, and the protected `.pi/mcp.json` blob before editing. Stop if unrelated changes are present.
2. Update the transferred activation specification and operations runbook first so the status model and prohibited actions are unambiguous.
3. Reconcile roadmap checkboxes and immediate actions to that same status model; do not mark any post-approval gate complete.
4. Strengthen only the focused offline test. Leave activation settings, endpoint, dependency files, and ignore rules untouched.
5. Run focused, static activation, project, formatting, scope, and secret checks by exit status. Do not run any command that connects the lazy Figma server.
6. Obtain read-only runtime-boundary advice, then independent `quality_reviewer` approval against all criteria. Resolve findings only within owned files and rerun affected checks.
7. Commit coherent scoped changes, push `agent/pi-figma-catalog`, prepare one pull request, and run the required PR gate. Stop for human merge; do not deploy or authenticate.

## Observable acceptance criteria

1. Targeted repository guidance identifies Pi as the hard-required client for the repository’s Figma MCP route while separately stating that Pi orchestration is retired; it does not describe this client path as optional.
2. `.pi/settings.json` remains the sole project activation of exact `pi-mcp-adapter@2.20.1`, aligned with the exact package pin, and non-network checks prove its command surface loads.
3. Operations, roadmap/status, and the amended activation spec consistently distinguish activation complete, Catalog submission complete with approval pending, observed DCR HTTP 403 before browser OAuth, and post-approval live gates.
4. No text claims Catalog approval, a Figma response timeline, successful OAuth, successful tool enumeration, a read-only lookup, or current live Pi/Figma support.
5. No browser OAuth, DCR retry, provider probe, tool enumeration, lookup, additional form submission, or Figma mutation occurs in this delivery.
6. Focused tests pass and protect endpoint, lifecycle, host discovery, exact version alignment, one activation, and tracked secret hygiene using offline assertions only.
7. `.pi/mcp.json` remains byte-for-byte identical to its transferred `85c0e50` version; no OAuth credentials, IDs, secrets, provider payloads, or account data are added anywhere.
8. The final delivery diff is limited to the transferred Pi files, this plan record, and the four planned finalization files; Contact and all unrelated merged application work have no branch delta beyond `infusion-diffusion/main`.
9. Focused and proportional project checks, required GitHub quality checks, read-only runtime-boundary advice, and independent quality review pass. Commit, push, and PR preparation remain on one scoped branch/PR; no merge or deployment occurs.

## Deterministic verification

Run from the repository root and judge every command by exit status, not output wording.

### Focused offline and formatting checks

```bash
set -euo pipefail
corepack pnpm install --frozen-lockfile
python3 -m unittest adws.tests.test_pi_mcp_config
corepack pnpm exec prettier --check \
  .pi/settings.json \
  .pi/mcp.json \
  docs/operations.md \
  docs/planning/roadmap.md \
  specs/d99fc09f_pi-figma-mcp.md \
  specs/07799513_pi-figma-catalog.md \
  specs/76046103_pi-figma-catalog.md
git diff --check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

### Static adapter activation only

Run only in a checkout whose Pi project trust has already been reviewed by a human. These commands must not enumerate servers or invoke authentication.

```bash
set -euo pipefail
pi_list_output="$(pi list --approve)"
PI_LIST_OUTPUT="$pi_list_output" node -e '
  if (!process.env.PI_LIST_OUTPUT.includes("pi-mcp-adapter@2.20.1")) process.exit(1)
'

rpc_output="$(mktemp)"
trap 'rm -f "$rpc_output"' EXIT
printf '%s\n' '{"id":"commands","type":"get_commands"}' \
  | pi --mode rpc --no-session --approve --tools mcp,mcpScript > "$rpc_output"
RPC_OUTPUT="$rpc_output" node --input-type=module -e '
  import fs from "node:fs";
  const rows = fs.readFileSync(process.env.RPC_OUTPUT, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
  const response = rows.find((row) => row.id === "commands" && row.success === true);
  const names = response?.data?.commands?.map((command) => command.name) ?? [];
  if (!names.includes("mcp") || !names.includes("mcp-auth")) process.exit(1);
'
```

Do **not** run `/mcp tools`, `/mcp-auth figma`, direct HTTP requests to the endpoint, Catalog submission, or any Figma tool.

### Endpoint, hygiene, ancestry, and exact-scope checks

```bash
set -euo pipefail
test "$(git hash-object .pi/mcp.json)" = "6d4983f9394341227ebbca2c46f4965343198c96"
git diff --exit-code 85c0e50 -- .pi/mcp.json
git check-ignore .pi/npm .pi/mcp-cache.json .pi/agent/auth.json .pi/oauth/example
if git grep -nEI '(client[_ -]?(id|secret)|bearer[[:space:]]+[A-Za-z0-9._~+/-]+|access[_ -]?token|refresh[_ -]?token)' -- \
  .pi/mcp.json .pi/settings.json; then
  exit 1
fi
git fetch infusion-diffusion main
git merge-base --is-ancestor infusion-diffusion/main HEAD
```

The grep checks only tracked Pi JSON; the focused parser test and final diff inspection remain authoritative. Never print ignored credential files.

Verify the complete branch file allowlist after integrating the latest remote main:

```bash
set -euo pipefail
expected="$(mktemp)"
actual="$(mktemp)"
trap 'rm -f "$expected" "$actual"' EXIT
cat > "$expected" <<'EOF'
.gitignore
.pi/mcp.json
.pi/settings.json
adws/tests/test_pi_mcp_config.py
docs/operations.md
docs/planning/roadmap.md
specs/07799513_pi-figma-catalog.md
specs/76046103_pi-figma-catalog.md
specs/d99fc09f_pi-figma-mcp.md
EOF
git diff --name-only infusion-diffusion/main...HEAD | sort > "$actual"
diff -u "$expected" "$actual"
git status --short
```

Before handoff, the owner and reviewer inspect `git diff infusion-diffusion/main...HEAD` for unrelated changes, generated artifacts, provider payloads, credentials, and unsupported live claims.

After push and PR creation, require exit 0:

```bash
just pr-gate <PR-number>
```

Pending, missing, skipped, cancelled, timed-out, or failed required checks are blockers. Record only command exit statuses, adapter version, endpoint policy, coarse 403 location, Catalog pending state, and review outcome.

## Accessibility and content-extreme coverage

- No customer-facing UI or reusable component changes occur, so semantic HTML, keyboard, focus, contrast, motion, responsive viewport, zoom, axe, Storybook, and Playwright UI checks are not applicable.
- The provider-owned OAuth UI must not be opened in this task. After approval, a human must complete it directly; agents cannot assess, automate, or approve its accessibility behavior.
- Operational content must remain accurate for an unknown or indefinite approval period, no confirmation/reference identifier, approval or denial, later DCR-policy changes, an absent/renamed `whoami` tool, and a large or sensitive 403 response body. Store only coarse states; never copy raw responses, schemas, identities, URLs, or payloads.
- Required-client wording must not imply Pi is part of the customer storefront runtime, and broad historical “Figma MCP connected” status must not be treated as proof that Pi is live.

## Preview, release, and rollback evidence

- Vercel Preview, `/api/health`, Storybook preview, browser screenshots, production smoke tests, Sanity publish, and Figma publish are not relevant because no application runtime, UI, editorial content, deployment configuration, or design content changes.
- Release evidence is the fresh-main ancestry, protected endpoint blob, exact static activation/version checks, focused test, proportional project checks, scope/secret diff review, green GitHub gate, read-only runtime-boundary advice, and independent quality review.
- No production rollback applies. If merged guidance is later disproved by provider evidence, prefer a reviewed forward correction. Any Git revert requires human approval and must preserve the hosted `.pi/mcp.json`, unrelated application work, secret hygiene, and truthful required-client/pending-support status; never use a blanket revert that restores unsafe immediate-auth instructions.

## Human approval gates

- **Implementation:** this prompt authorizes the scoped non-UI finalization on the existing branch. No design approval is required. Dependency, endpoint, credential, additional form, provider retry, UI, deployment, or multi-writer changes require a new human decision.
- **Pi project trust:** a human must review and approve project trust before the extension executes on a new machine. An agent must not use a flag to bypass that decision.
- **Figma Catalog:** approval is provider-owned and pending. Neither an agent nor repository text can grant or simulate it.
- **OAuth and live verification:** only after independently confirmed Catalog approval may a human explicitly authorize a separate task for browser OAuth, sanitized tool enumeration, and exactly one bounded read-only lookup.
- **Design/editorial publish:** no design review or Sanity/Figma publish is requested or authorized.
- **Merge:** green required checks and independent approval are mandatory; only a human may approve and merge the pull request.
- **Production:** no deployment or production promotion is authorized.
- **Rollback:** only a human may authorize a Git or operational rollback; no Vercel rollback is relevant here.

## Residual risks

- Figma controls Catalog review timing/outcome, DCR policy, OAuth scopes, and tool availability; submission provides no approval guarantee or response timeline.
- The observed HTTP 403 identifies the present pre-OAuth boundary but does not prove its permanence or reveal approval criteria.
- Catalog approval may still expose Pi/adapter compatibility, callback, scope, seat, browser, or OS credential-store issues. These remain untested until a separately approved post-approval task.
- Static tests can prove repository activation and hygiene only; they intentionally cannot prove reachability, OAuth, enumeration, or a live lookup.
- Pi installation, project trust, and credential-store behavior remain machine-specific even with an exact adapter pin.
- Broad historical Figma MCP success through another client can be mistaken for Pi support unless reviewers preserve the explicit distinction.
- A future remote-main change may conflict with roadmap or operations text; integrate it deliberately and rerun the full scoped review rather than overwriting unrelated status.
