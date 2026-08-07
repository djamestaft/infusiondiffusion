# Plan: Correct Pi/Figma Catalog integration status

## Objective

Finish and correct the pending Pi/Figma MCP work from ADW `d99fc09f` without claiming capabilities that Figma currently blocks. Pi remains the repository’s hard-required client for its Figma MCP path, while Pi orchestration remains retired. Repository guidance and status must distinguish three separate facts:

1. the pinned `pi-mcp-adapter` is activated project-locally;
2. Pi’s Figma MCP Catalog registration has been submitted but is not approved;
3. Figma’s current Dynamic Client Registration (DCR) policy rejected the attempted registration with HTTP 403, so browser OAuth, tool enumeration, and a live read-only call are post-approval verification only and are not evidence for this delivery.

Record only those facts. Do not invent a submission date, confirmation/reference number, approval promise, response body, account identity, or client credential. Preserve `.pi/mcp.json`, the already merged Contact work, and all unrelated changes.

## Current evidence and prerequisite checkout gate

- ADW `d99fc09f` established that `.pi/settings.json` activates `pi-mcp-adapter@2.20.1`, the adapter command surface loads, and the focused static tests pass. Its independent review approved 6/8 criteria but withheld approval because live Figma enumeration and a read-only call had not occurred.
- The new operator-provided evidence supersedes the old assumption that browser OAuth is merely the next step: Figma’s DCR path returned HTTP 403 for Pi, and a Figma MCP Catalog registration for Pi was submitted. Catalog approval is still pending.
- `.pi/mcp.json` is tracked at baseline commit `5e202cb` with `https://mcp.figma.com/mcp`, lazy lifecycle, and host discovery off. It must remain byte-for-byte unchanged from that baseline.
- Pending ADW `d99fc09f` implementation is currently present as changes to `.gitignore`, `docs/operations.md`, `.pi/settings.json`, and `adws/tests/test_pi_mcp_config.py`; `specs/d99fc09f_pi-figma-mcp.md` and `.pi/mcp.json` are in `5e202cb`.
- Remote fetch from configured remote `infusion-diffusion` succeeded. At planning time local `main` was two commits behind `infusion-diffusion/main`; the current `agent/contact-page` branch and remote `main` were 1/1 divergent because Contact was merged upstream while `5e202cb` remained local. The fetched remote roadmap was reread and matched the working copy, but the protected local branch was not fast-forwarded because the checkout contains pending work.

**Implementation blocker:** before editing roadmap/status files, safely preserve the pending Pi changes, prove local `main` is an ancestor of `infusion-diffusion/main`, fast-forward the local `main` ref without switching or disturbing the dirty checkout, and base the single delivery branch on fetched `infusion-diffusion/main`. Do not clean, reset, force-return, or discard the current checkout. Follow the worktree routing below so Contact history remains intact.

## Specialist routing

- **Implementation owner — `builder` (sole writer):** carries the existing Pi changes into one fresh delivery branch, corrects the specification, operations/status guidance, roadmap, and focused regression test, and records deterministic evidence.
- **Read-only advisor — `browser_release_debugger`:** checks that the documented diagnosis matches the observed upstream DCR 403 boundary, that activation is not confused with live Figma support, and that no live auth/provider call is attempted. It does not edit files, submit forms, approve OAuth, or handle credentials.
- **Independent review owner — `reviewer`:** reviews this small configuration/documentation/test correction, the three-phase status, secret hygiene, preserved endpoint, checkout scope, and recorded command evidence.
- Exactly one writing owner, one delivery branch, and one pull request are authorized. No concurrent writer is implied.

## Applicable project skills

- **`.agents/skills/release-debug/SKILL.md`:** applies because the task corrects an external-provider runtime diagnosis. Preserve the observed failure mode, assign it to Figma’s DCR policy rather than local adapter activation, and avoid speculative or repeated live requests.
- **`.agents/skills/quality-gate/SKILL.md`:** applies to acceptance-criterion mapping, focused static coverage, diff/secret review, roadmap reconciliation, and evidence-based handoff.
- **`.agents/skills/parallel-agent-worktrees/SKILL.md`:** applies because pending Pi work is on the primary coordination checkout’s Contact branch while Contact has since merged upstream. Use one Treehouse-leased implementation worktree from fetched `infusion-diffusion/main`, transfer only the known Pi/plan commits, and keep one writer/PR. This is isolation, not concurrent implementation.
- `feature-brief`, `impeccable`, and `design-to-storybook` do not trigger: no interface, responsive state, interaction, reusable component, Storybook contract, or Figma design content changes.
- Sanity and Shopify skills do not trigger because editorial and commerce systems are untouched. SSSF workflow-management changes are not requested.

## System ownership boundaries

- **Pi** is the required client for this repository’s Figma MCP route and owns project trust, package loading, extension commands, and local session behavior. Its retired orchestration role is a separate status and must not be used to describe the required client as optional.
- **`pi-mcp-adapter`** owns MCP configuration loading and OAuth/DCR behavior. The repository pins and activates it but does not claim that activation bypasses provider policy.
- **Figma** owns `https://mcp.figma.com/mcp`, DCR policy, Catalog review/approval, OAuth authorization, scopes, tool availability, and design data. A 403 from its registration policy is an upstream gate, not evidence of successful OAuth or live MCP support.
- **The repository** owns the adapter activation declaration, exact hosted endpoint/lifecycle policy, version alignment, secret-hygiene tests, operating guidance, and truthful roadmap status.
- **OS credential storage** owns any future OAuth token after approval. No OAuth URL/code, token, client ID/secret, registration payload/response, account identity, or MCP result belongs in tracked files, logs, screenshots, or handoffs.
- **Next.js, Sanity, Shopify, Storybook, approved Figma content, and Vercel** remain unchanged and retain their documented ownership.

## Delivery topology and preservation sequence

1. Re-capture `git status --short --branch`, the exact pending file list, `git remote -v`, and the commit relationship among `5e202cb`, local `main`, and `infusion-diffusion/main`.
2. Preserve the current related changes in a non-destructive checkpoint that includes only the known Pi implementation and this session’s plan spec. Do not include ignored Pi caches/sessions or alter Contact files.
3. Verify local `main` is strictly fast-forwardable, then advance its ref to fetched `infusion-diffusion/main` without switching the dirty checkout. A non-ancestor result is a blocker for the engineer; do not force it.
4. Lease one Treehouse worktree and create `agent/pi-figma-catalog-status` from `infusion-diffusion/main`. Transfer only commit `5e202cb` and the scoped checkpoint, resolving the already-merged Contact ancestry without replaying or editing Contact work.
5. Perform all remaining writes in that leased worktree. Do not let another agent write there. Return the worktree only after work is pushed/safely retained and human-authorized integration is complete.

## Exact file ownership

### Builder writes

1. **`.pi/settings.json`** — retain the pending project-local activation for exactly `npm:pi-mcp-adapter@2.20.1`, with bundled skills disabled and the extension enabled. Add no model settings, auth fields, environment values, global paths, Catalog metadata, or credentials.
2. **`.gitignore`** — retain the pending clarification that Pi caches, sessions, OAuth artifacts, and local credentials are ignored. Preserve every existing ignore pattern; add a pattern only if deterministic inspection finds a real Pi auth artifact path not already covered.
3. **`adws/tests/test_pi_mcp_config.py`** — strengthen the focused dependency-free regression coverage so it proves:
   - the adapter package source is the only Pi adapter activation and uses an exact version equal to the exact `package.json` devDependency pin;
   - `.pi/mcp.json` contains only the expected hosted `figma` URL and lazy lifecycle, with host discovery off;
   - tracked Pi settings contain no auth, OAuth, client ID/client secret, bearer token, credential, password, or other inline secret-bearing configuration;
   - the tests validate static activation/configuration only and make no network, DCR, OAuth, tool-enumeration, or live-support assertion.
4. **`docs/operations.md`** — replace “optional Pi” and immediate-OAuth/live-smoke guidance with a required-client runbook that clearly separates:
   - **activation verified:** adapter package/command surface may be checked locally without contacting Figma;
   - **Catalog approval pending:** record that registration was submitted, the advertised DCR path returned HTTP 403 under observed upstream policy, and no date/reference/approval is claimed;
   - **post-approval only:** after an explicit Figma approval is independently confirmed, a human may authorize browser OAuth and then perform sanitized tool enumeration plus one bounded read-only call in a new task.
   Include troubleshooting that treats 403 as an external approval blocker, forbids repeated DCR workarounds or credentials, and says not to run `/mcp-auth figma` or claim live support before approval.
5. **`docs/planning/roadmap.md`** — reconcile Agentic system / Agent tooling status and immediate next actions. Mark project-local adapter activation and Catalog submission as complete facts; add Catalog approval and post-approval OAuth/live verification as incomplete, externally blocked work. Preserve the existing general Figma MCP status for already-supported clients and do not imply Pi has live access. State Pi is the required repository client for this route despite retired orchestration.
6. **`specs/d99fc09f_pi-figma-mcp.md`** — amend the pending ADW specification so its objective, evidence, sequence, acceptance criteria, verification, approval gates, and residual risks use the same three phases. Preserve its ADW provenance, but remove or explicitly supersede claims that browser OAuth/tool enumeration/live lookup are currently attainable or required for this correction. Record the sanitized HTTP 403 DCR result and submitted/pending Catalog status without dates, form fields, identifiers, or secrets.

### Planner record carried unchanged

- **`specs/07799513_pi-figma-catalog.md`** is this plan’s repository copy. Carry it into the delivery branch unchanged; the builder must not rewrite it as implementation documentation.

### Protected / inspect-only

- **`.pi/mcp.json`** — do not edit, normalize, reorder, or re-save it. Prove it is identical to `5e202cb:.pi/mcp.json` and still points to `https://mcp.figma.com/mcp` with lazy lifecycle and host discovery off.
- **`package.json` and `pnpm-lock.yaml`** — inspect-only. The existing exact `pi-mcp-adapter` `2.20.1` pin and lock entry remain authoritative; a dependency change requires separate approval.
- **Contact files and history** — preserve. Do not alter `/contact`, Contact schema/query/tests/stories/docs, or replay Contact implementation as a new diff; Contact is already merged in fetched `main`.
- All Next.js/UI, Storybook, Sanity, Shopify, Figma design content, Vercel, credential, and external form surfaces are out of bounds.

## Implementation sequence

1. Complete the checkout/worktree preservation gate above and confirm the delivery branch diff starts from fetched `infusion-diffusion/main` with no Contact delta.
2. Read the pending `d99fc09f` specification and review/handoff evidence once more. Treat its 6/8 result as historical evidence, not a requirement to force a live connection.
3. Update the old specification and operations runbook first so the state model is decision-complete before changing roadmap wording.
4. Reconcile the roadmap with the same complete/pending states. Do not mark Catalog approval, OAuth, tool enumeration, or live Pi/Figma support complete.
5. Retain minimal activation and ignore configuration, then strengthen the focused static test without adding network behavior.
6. Run targeted and fast project checks, inspect the complete diff and ignored artifacts, then hand evidence to the read-only runtime advisor and independent reviewer.
7. Push one delivery branch/PR. Do not submit another Catalog form, start OAuth, call Figma, deploy, publish, merge, or roll back.

## Observable acceptance criteria

1. Repository guidance calls Pi a **required Figma MCP client** while separately retaining that Pi orchestration is retired; no targeted file describes the client integration as optional.
2. `.pi/settings.json` statically activates the exact adapter version pinned in `package.json`, and a fresh local Pi command-surface check can prove adapter loading without contacting Figma.
3. `docs/operations.md`, `docs/planning/roadmap.md`, and `specs/d99fc09f_pi-figma-mcp.md` consistently distinguish adapter activation complete, Catalog registration submitted/approval pending, and OAuth/live verification deferred until after confirmed approval.
4. The observed upstream failure is documented only as Figma DCR returning HTTP 403 under current policy. It is not mislabeled as an OAuth denial, local package failure, successful registration, or permanent promise about future policy; no secret, payload, response body, identity, date, or confirmation detail is recorded.
5. Catalog submission is recorded as complete, but approval, OAuth, non-empty tool enumeration, and a live read-only call remain explicitly incomplete. No additional form submission or provider call occurs.
6. Focused tests pass and protect exact endpoint, lazy lifecycle, host-discovery-off, exact adapter version alignment, and absence of tracked OAuth/client/secret configuration, without performing network calls or asserting live Figma support.
7. `.pi/mcp.json` is byte-for-byte identical to the `5e202cb` baseline. No OAuth client ID/secret or other credential is added anywhere.
8. The final branch is based on fetched `infusion-diffusion/main`; Contact and every unrelated file have no delivery-branch diff.
9. All deterministic checks and the required GitHub quality gate pass by exit status, and the independent reviewer approves every criterion with no blockers.

## Deterministic verification

Run from the leased delivery worktree. Judge every command by exit status.

```bash
corepack pnpm install --frozen-lockfile
python3 -m unittest adws.tests.test_pi_mcp_config
corepack pnpm exec prettier --check \
  .pi/settings.json \
  .pi/mcp.json \
  adws/tests/test_pi_mcp_config.py \
  docs/operations.md \
  docs/planning/roadmap.md \
  specs/d99fc09f_pi-figma-mcp.md \
  specs/07799513_pi-figma-catalog.md
git diff --check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

Prove activation only, without connecting to Figma:

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

Prove endpoint and scope preservation:

```bash
git diff --exit-code 5e202cb -- .pi/mcp.json
test "$(git merge-base infusion-diffusion/main HEAD)" = "$(git rev-parse infusion-diffusion/main)"
git diff --name-only infusion-diffusion/main...HEAD
git status --short
git check-ignore .pi/npm .pi/mcp-cache.json .pi/agent/auth.json .pi/oauth/example
```

The owner and reviewer must inspect the final name-only/diff output and verify that only the planned Pi/config/docs/test/spec files differ and no ignored artifact is staged. Do **not** run `/mcp tools`, `/mcp-auth figma`, direct HTTP probes, Catalog submission, or any live Figma tool in this task.

After pushing the pull request, run the repository gate and require exit 0:

```bash
just pr-gate <PR-number>
```

Pending, missing, skipped, cancelled, timed-out, or failed GitHub checks are blockers. Record command exit statuses and sanitized version/status facts only; never retain raw auth/provider output.

## Accessibility and content-extreme coverage

- No customer-facing UI or reusable component changes, so semantic HTML, keyboard, focus, contrast, motion, responsive viewport, zoom, axe, Storybook, and Playwright UI checks are not applicable.
- The future Figma OAuth page is provider-owned and is not opened in this task. After Catalog approval, a human must complete it directly; agents must not reproduce, automate, or claim its accessibility behavior.
- Operational content extremes are bounded: documentation must remain truthful when approval takes an unknown amount of time, when no confirmation identifier exists, when the 403 response contains a large or sensitive body, and when Figma’s tool catalog later changes. Store only the coarse status code/state; omit raw bodies, URLs, schemas, identities, and payloads.

## Preview, release, and rollback evidence

- Vercel Preview, `/api/health`, Storybook preview, production smoke tests, Figma publishing, and Sanity publishing are not relevant because no application runtime, UI, content, or deployment changes.
- Release evidence is the fresh-main branch relationship, byte-identical `.pi/mcp.json`, static activation command surface, focused test, fast project checks, green GitHub quality gate, sanitized diff, read-only runtime diagnosis, and independent review.
- There is no production rollback action. If a merged wording/test correction is later disproved, prefer a reviewed forward fix based on new provider evidence. Any Git revert requires human authorization and must preserve the required Pi client declaration, `.pi/mcp.json`, credentials hygiene, and Contact work; a blanket revert that restores false live-support claims or removes Pi is not an acceptable rollback.

## Human approval gates

- **Implementation:** this request authorizes the scoped non-UI correction after the checkout freshness/preservation blocker is cleared. No design approval is required. Any dependency update, static OAuth client configuration, additional external form, or broader topology requires a new human decision.
- **Project trust:** a human must approve Pi project trust on a new machine before the project extension executes. The documented non-network verification may use the already reviewed checkout trust; an agent cannot grant trust generally.
- **Figma Catalog:** Figma/provider approval is pending and external. Neither an agent nor repository change may declare or simulate it. Lack of approval blocks OAuth/live verification, not this truthful status correction.
- **OAuth/live verification:** after independently confirmed Catalog approval, a human must explicitly authorize browser OAuth and a separate bounded live verification task. It is not authorized here.
- **Merge:** green required checks plus independent approval are mandatory; only a human may approve and merge the pull request.
- **Publish/production:** no Sanity publish, Figma mutation/publish, Preview promotion, deployment, or production action is authorized.
- **Rollback:** only a human may authorize a Git revert or operational rollback. No Vercel rollback applies.

## Residual risks

- Figma controls Catalog review timing, outcome, DCR policy, OAuth scopes, and tool availability; submission does not guarantee approval or future compatibility.
- HTTP 403 is strong evidence of the current upstream policy boundary but does not reveal approval criteria and may change. The repository should record the observed result without hard-coding speculative response details.
- Catalog approval may not by itself make Pi compatible; a later adapter/Pi version, approved callback contract, or separately authorized client configuration may be required. That is future scoped work, not a reason to add credentials now.
- Static tests can prove activation/configuration hygiene only. They deliberately cannot prove Figma reachability, OAuth success, tool enumeration, or a live lookup.
- Pi host installation/trust and OS credential-store behavior remain machine-specific even though the adapter version is pinned.
- The current dirty/diverged checkout can mix Pi and Contact history if the preservation/worktree gate is skipped. Fresh-remote branch evidence and a no-Contact diff are therefore release requirements.
- The repository’s existing general Figma MCP connection may work through another approved client; reviewers must not treat that as evidence that the required Pi client is approved or live.
