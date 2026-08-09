# Plan: Supervise bounded Codex Figma connector workers from SSSF/Pi

## Objective

Add a narrow, durable factory exception for Figma evidence capture: when a factory-managed Pi product-design phase cannot reach the required Figma connector, Pi may scope a request for one deterministic SSSF code phase to run the authenticated official Codex `figma` connector. The same Pi supervisor must then receive a typed, provenance-stamped result, validate it, and report `ready` or concrete blockers before any downstream implementation starts.

This does **not** restore general Pi orchestration. Pi may not start arbitrary Codex subprocesses, and the Codex worker receives no repository-writing, merge, publish, deployment, production, or rollback authority.

## Planning baseline and delivery topology

- `specs/` was listed before selecting `specs/273609bc_figma-codex-supervision.md`; that path was free.
- The checkout was clean during planning. `git fetch infusion-diffusion main` succeeded, local protected `main` was safely confirmed/fast-forwarded to `infusion-diffusion/main`, and both resolve to `784262dffcb22780110a0ca8fba3171ca9dd241c`.
- `docs/planning/roadmap.md` was reread after the fetch. Its statement that broad Pi orchestration is retired must remain true; the new connector fallback is a machine-bounded exception, not a reversal.
- The current checkout is `agent/storefront-polish` and contains unrelated plan commits. Before implementation, lease one Treehouse worktree and create one branch, `agent/figma-codex-supervision`, from the then-current `infusion-diffusion/main`. Use one writing owner and one pull request; do not implement on the current branch or create parallel writers.
- **Protected-path blocker:** the requested files include `AGENTS.md`, `.agents/`, `adws/adw_modules/`, `adws/adw_sssf_config/`, and `adws/adw_*.py`, all intentionally protected. Before the builder runs, a human factory maintainer must approve and supply a session-local, untracked SSSF config overlay granting `builder` writes to only the exact files listed below. Keep `defaults.protected_files` unchanged, do not commit the overlay, and leave the tracked builder permission at its normal least-privilege setting. Without that explicit grant, implementation must stop rather than bypass `permissions.py`.

## Specialist routing

- **Implementation owner — `builder` (sole writer):** implement the factory, prompt, documentation, and test changes in the single leased delivery worktree.
- **Read-only advisor — `browser_release_debugger`:** inspect the bounded runtime, timeout/kill behavior, official-connector preflight, sanitized failure evidence, and authorized live smoke. It must not edit, authenticate, deploy, or call a modifying Figma tool.
- **Independent review owner — `quality_reviewer`:** review the full diff and trace evidence against every acceptance criterion, especially process containment, credential hygiene, provenance, retry limits, protected paths, and human gates.
- No `product_designer` advisory role is needed for this non-UI factory implementation. The runtime `product_designer` Pi agent remains the supervisor being changed; it is not a second repository writer.

## Applicable project skills

- **`.agents/skills/sssf/SKILL.md`: required.** This changes an ADW, modules, config, prompts, typed envelopes, gates, permissions/process policy, tracing, and factory tests. Preserve the synced contract triad: Pydantic type, prompt Report example, and every `output_type=` call site.
- **`.agents/skills/release-debug/SKILL.md`: required.** The change adds an external-provider runtime path. Diagnose connector, authentication, timeout, and provider failures at the owning boundary; do not turn failures into OAuth workarounds or unsupported readiness claims.
- **`.agents/skills/quality-gate/SKILL.md`: required.** Add deterministic unit/integration evidence, inspect secrets and scope, reconcile roadmap wording, and distinguish an authorized connector smoke from Vercel release evidence.
- **`.agents/skills/parallel-agent-worktrees/SKILL.md`: required.** Implementation must start away from the current unrelated task branch in one leased worktree based on freshly fetched remote `main`.
- `feature-brief`, `impeccable`, and `design-to-storybook` do not trigger because no customer UI, interaction, responsive component, Figma design content, or Storybook contract is being designed or implemented. Sanity and Shopify skills do not trigger because content and commerce truth are untouched.

## Ownership and authority boundaries

- **SSSF deterministic Python code** owns process creation, fixed arguments, limits, retries, timeout/termination, environment sanitization, schema parsing, artifact hashing, trace rows, and acceptance gates. A model must not decide these controls.
- **Pi `product_designer` supervisor** owns request scoping from the planner's typed Figma targets and validates the returned evidence for design completeness. Pi does not directly spawn Codex and cannot grant human design approval.
- **Codex worker** performs only bounded, read-only calls through the configured official `figma` connector and returns the required JSON schema. It is an evidence collector, not a planner, implementer, reviewer, merger, publisher, or deployer.
- **Figma** owns canonical files, node data, approval labels, connector availability, OAuth/scopes, and provider errors. The worker may read exact approved nodes; it may not comment, edit, export broad files, publish, or change permissions.
- **OS/Codex credential storage** owns existing connector authentication. SSSF may check connector presence and use it, but must never run `codex mcp login`, copy auth state, print OAuth material, or persist tokens, headers, identities, raw registration/provider responses, or credential-bearing environment values.
- **Repository/session storage** owns only sanitized transformed evidence and provenance under the current `context_handoff/`. Raw Codex JSONL/MCP payloads stay in memory and are discarded after redaction and validation.
- Next.js, Storybook, Sanity, Shopify, and Vercel retain their documented application ownership and are unchanged. Humans retain design approval, merge, production, editorial/Figma publish, and rollback authority.

## Decision-complete runtime contract

### 1. Typed target and supervision request

Extend `PlanOutput` with a default-empty typed `figma_targets` list. Each target must carry the canonical file key/URL, 1–12 exact node IDs, expected approval state, and requested evidence categories. A Figma-dependent plan without exact targets cannot delegate and is blocking.

Replace the product-designer use of generic `SpecialistOutput` with a dedicated `FigmaSupervisorOutput`. Its stages are `complete`, `delegate_codex`, or `blocked`; it carries `ready`, findings/blockers, evidence paths, and at most one `CodexFigmaRequest`. Delegation is valid only when the reason is `pi_connector_unavailable`, the target exactly matches/subsets the planner's typed target, operations are from the read-only allowlist, and no credential/auth instruction appears.

### 2. Bounded worker invocation

Add one deterministic worker entry in SSSF config, not a general `coding_agent: codex` roster option. Configure:

- executable by bare name: `codex`;
- connector: exactly configured official `figma`, verified in memory with `codex mcp list --json`/`get --json` without persisting raw config;
- `codex exec --ephemeral --strict-config --sandbox read-only --json --output-schema <generated schema> --output-last-message <temporary file>`;
- isolated temporary cwd, no repository write grant, no approval/sandbox bypass flags, no `mcp login`, and all non-Figma MCP servers disabled for the invocation;
- allowlisted connector calls limited to exact-node metadata/context, variables/styles needed by the handoff, and bounded screenshots when available; reject shell, web search, Git, filesystem mutation, comments, exports of broad file data, and every modifying Figma tool;
- sanitized environment containing only process/runtime basics needed by Codex and OS credential-store access; explicitly omit Shopify, Sanity, Vercel, GitHub, deployment, webhook, and generic token/secret/key variables;
- maximum 12 nodes, 8 artifacts, 25 MiB total artifact bytes, 256 KiB final JSON, and path containment under `context_handoff/figma/<request_id>/`;
- 180 seconds per attempt, at most 2 attempts, 2-second bounded backoff, and a 370-second overall deadline. Retry once only for timeout/disconnect/rate-limit/provider-5xx classifications. Do not retry missing connector/auth, scope denial, wrong target, missing approval, schema mismatch, disallowed tool, redaction failure, or size/path violations;
- on timeout/cancellation/policy breach, terminate the worker process group, wait up to 5 seconds, then kill it; always close the process trace row.

### 3. Typed result and provenance stamp

`CodexFigmaOutput` is a code-produced envelope with `capture_status` (`complete`, `blocked`, `failed`), sanitized failure code/message, requested and observed file/node IDs, approval labels, allowlisted call stamps, evidence manifest, and `CodexWorkerProvenance` containing:

- ADW/phase/request IDs and supervising Pi agent/session ID;
- worker kind `codex`, CLI version, connector name and validated official endpoint identity;
- repository commit, schema version/hash, prompt hash, and target hash;
- start/end timestamps, duration, attempts, timeout policy, and termination outcome;
- each artifact's handoff-relative path, media type, byte count, and SHA-256;
- result hash chaining the request, sanitized call stamps, provenance, and artifact manifest.

Do not treat this as a secret-backed signature. It is an auditable provenance stamp over factory-observed facts; the reviewer must not describe it as cryptographic proof of Figma authorship.

### 4. Pi validation and downstream gate

In `adw_simple_sdlc.py`, retain direct/reused Pi evidence when complete. If the first product-designer phase returns `delegate_codex`, run the bounded worker as a `kind="code"` phase, then continue the **same Pi product-designer session** in a second agent phase with the typed worker result. Gates must independently confirm:

- request/observed file and node equality, required `Approved` metadata, read-only tool allowlist, and no untraced call;
- current-session handoff path containment, non-empty files, artifact byte limits, and recomputed hashes/result chain;
- required handoff sections for dimensions/layout, semantic variables, typography, spacing, assets, responsive states, interaction/accessibility states, content extremes, and intentional divergences; unavailable static-Figma facts must be reported as blockers, not invented;
- provenance references the current ADW/phase/supervisor and worker process rows ended cleanly;
- `ready=true` only when all requested evidence is complete and human design approval is recorded separately. Otherwise the ADW ends unaccepted with a sanitized blocker before the implementation owner runs.

Add `adw_figma_capture.py` as a capture/validation-only workflow for authorized smoke tests and pre-implementation evidence. It must use the same types/modules/gates as `adw_simple_sdlc.py`, end with `run.finish(accepted=...)`, never commit, and never invoke an implementation owner.

### 5. Prevent arbitrary nested Codex

Add a Pi process policy that reserves `codex` for the deterministic worker module. Pi agent subprocesses receive a session-local deny shim first on `PATH`; Pi tool events are inspected for direct/wrapped `codex` execution, and a detected attempt is terminated, traced as `nested_process_denied`, and fails the phase. Only `adw_modules/codex_worker.py`, running as a code phase outside the Pi agent environment, receives the normal operator resolution for bare `codex`.

Document that this is a factory guardrail under cooperative-agent assumptions, not an OS security boundary. Tests must cover direct command, path-qualified command, common shell wrappers, retry/correction turns, and the sanctioned module path. The global rule also forbids agents from hunting for an absolute Codex binary or using Python/Node/shell indirection to evade the guard.

## Exact file ownership

### Builder may write, after the exact protected-path grant

1. **`AGENTS.md`** — add the global bounded Codex-connector delegation rule; keep Codex coordination and human production authority unchanged.
2. **`.agents/skills/sssf/SKILL.md`** — add the hard rule and route to a new bounded-worker cookbook; state that arbitrary nested Codex is prohibited.
3. **`.agents/skills/sssf/cookbooks/codex-connector-worker.md`** (new) — operator/implementer procedure, request/result contract, retries/timeouts, failure classes, authorized smoke, and rollback.
4. **`.agents/skills/sssf/references/config.md`**, **`handoff.md`**, and **`observability.md`** — document worker config, typed provenance/result contract, sanitized events/table rows, and process lifecycle.
5. **`docs/operations.md`** — replace the blanket implication that Pi can never supervise work with the narrow factory exception; preserve pending Pi Catalog status, official Codex connector separation, secret rules, and all human gates.
6. **`docs/planning/roadmap.md`** — record the bounded fallback as a distinct agent-tooling capability without marking Pi Catalog approval/OAuth complete or undoing retirement of general Pi orchestration.
7. **`docs/agent-evals.md`** — add regression scenarios for connector fallback, unavailable/unauthenticated Codex, wrong-node/provenance rejection, timeout, and arbitrary nested Codex denial.
8. **`adws/adw_simple_sdlc.py`** — sequence Pi scope → optional code worker → same-Pi validation before build.
9. **`adws/adw_figma_capture.py`** (new) — capture/validation-only ADW with no commit/build authority.
10. **`adws/adw_modules/data_types.py`** — add typed targets, worker config/request/result/provenance/artifact/failure models, and `FigmaSupervisorOutput`.
11. **`adws/adw_modules/agents.py`** — load/validate the worker config and preserve the output-contract/session rules.
12. **`adws/adw_modules/codex_worker.py`** (new) — fixed subprocess, connector preflight, output-schema generation, in-memory JSONL filtering, redaction, retry/timeout/kill, hashing, and typed result.
13. **`adws/adw_modules/process_policy.py`** (new) and **`adws/adw_modules/agent_pi.py`** — deny/trace unsanctioned nested Codex from Pi while leaving the deterministic code phase functional.
14. **`adws/adw_modules/gates.py`** — bounded request, provenance, artifact/hash, exact-target, read-only-tool, and readiness gates; replace the current shallow Figma file-exists check for this flow.
15. **`adws/adw_modules/tracer.py`** — add additive `connector_workers` storage and sanitized `worker_start`, `worker_tool`, `worker_retry`, `worker_end`, and denial events; never store raw MCP args/results.
16. **`adws/adw_modules/quality.py`** — include the factory Python suite as a deterministic code check so normal SSSF quality phases cannot miss these regressions.
17. **`adws/adw_sssf_config/sssf.config.yaml`** — define the bounded Figma Codex worker and limits; keep `protected_files` intact and do not give any worker repo writes.
18. **`adws/adw_data/prompt_engineering/planner/system.md`** and **`user.md`** — require typed exact Figma targets when relevant and synchronize the `PlanOutput` Report example.
19. **`adws/adw_data/prompt_engineering/product_designer/system.md`** and **`user.md`** — make Pi the scope/validation supervisor, remove instructions to work around a missing connector, and synchronize `FigmaSupervisorOutput`.
20. **`adws/adw_data/prompt_engineering/figma_codex_worker/system.md`** and **`user.md`** (new) — connector-only identity/task, exact target, evidence requirements, forbidden tools/authority, and exact `CodexFigmaOutput` Report example.
21. **`adws/adw_data/prompt_engineering/storefront_engineer/system.md`** — consume only a gated, provenance-matched handoff and stop on missing human design approval.
22. **`adws/tests/test_codex_figma_worker.py`**, **`test_process_policy.py`**, and **`test_codex_worker_config.py`** (new), plus **`adws/tests/test_figma_handoff_gate.py`** — cover the behavior below with fake executables/connectors and temporary sessions.
23. **`Justfile`** — add a documented `figma-capture` recipe that invokes only `adw_figma_capture.py`; it is not an auth/login command.

### Inspect only

- `.pi/settings.json`, `.pi/mcp.json`, `package.json`, and `pnpm-lock.yaml`: preserve the separate pending Pi connector path and exact adapter pin.
- `.codex/config.toml` and user Codex configuration/credential stores: do not add project credentials, OAuth material, or connector copies.
- Application source, Storybook, Sanity, Shopify, Figma design content, and Vercel configuration: no changes.
- `specs/273609bc_figma-codex-supervision.md`: planner record; builder must not rewrite it.

## Implementation sequence

1. Obtain human approval for implementation, the single worktree/branch, the exact protected-file config overlay, and the proposed official-connector smoke target. Fetch remote `main`, lease the worktree, and branch from `infusion-diffusion/main`; stop on unrelated changes.
2. Add the typed models/config first. Synchronize planner, product-designer, and worker Report examples with every call site in the same edit.
3. Implement process policy and the deterministic Codex worker using fake executable fixtures before changing workflow sequencing. No live connector call is needed for this step.
4. Add tracing and gates, then integrate the optional fallback into `adw_simple_sdlc.py` and the capture-only ADW. Ensure every path calls `run.finish(accepted=...)` exactly once.
5. Update SSSF guidance, global coordination, operations, roadmap, and agent evals to the same narrow exception and human-authority model.
6. Run focused tests, static secret/scope inspection, the full local gate, and the ordinary Pi smoke ADW. Resolve all failures by exit status.
7. After explicit human authorization, run one read-only live smoke against the approved canonical file and one small approved node (recommended existing AnnouncementBar desktop node `93:6`). Capture only sanitized session evidence; do not authenticate, broaden nodes, or mutate Figma. The browser release debugger reviews the trace/failure boundary.
8. Obtain independent quality review, push one PR, run `just pr-gate <PR-number>`, and stop for human merge. Do not deploy or publish.

## Observable acceptance criteria

1. Global and SSSF guidance define the same narrow rule: Pi scopes and validates; deterministic SSSF code launches; Codex reads exact Figma nodes; humans retain design/merge/publish/production/rollback authority.
2. No Pi agent can successfully invoke bare or path-qualified Codex through normal factory tools; attempts are terminated, traced, and fail. The sanctioned worker module is the only repository code path that spawns `codex`.
3. The tracked worker config is least privilege, keeps protected paths unchanged, grants no repo writes, uses ephemeral/read-only Codex execution, disables non-Figma connectors, and contains no credentials or OAuth material.
4. Planner targets, Pi delegation, worker output, and Pi validation are concrete typed contracts. Their Pydantic models, prompt examples, and call sites are synchronized.
5. Every successful capture has current-session provenance, exact requested/observed file and node equality, allowlisted read-only calls, timestamps/attempts/limits, prompt/schema/target/result hashes, and recomputable artifact digests.
6. Raw Codex/MCP payloads and credential-bearing config/env values are never written to JSONL, SQLite, handoffs, logs, prompts, screenshots, or tracked files. Sanitized failures identify stage/code/request ID without leaking provider details.
7. Retry and timeout behavior matches the documented limits; auth/scope/policy/schema/target failures do not retry; timeout/cancel kills the complete process group and closes trace rows.
8. Missing connector/auth, wrong or unapproved nodes, incomplete responsive/accessibility/content evidence, disallowed tools, mismatched hashes, oversized/out-of-root artifacts, or absent human design approval yield `ready=false` and stop before build.
9. Existing direct/reused complete Figma handoffs still work, but now pass the stronger provenance/content gate. Storefront implementation does not need duplicate connector access after a valid handoff.
10. The capture-only ADW returns success only after same-session Pi validation and never commits, builds, merges, deploys, publishes, or rolls back.
11. Unit/integration tests, full project checks, the ordinary SSSF smoke, one human-authorized official-connector smoke, read-only runtime review, independent quality review, and GitHub required checks all pass by exit status.
12. The final diff is limited to the owned files, contains no application/UI/content/commerce/deployment changes, and leaves the planner spec unchanged.

## Accessibility and content-extreme coverage

- No customer-facing UI changes are in scope, so browser keyboard, focus, contrast, axe, responsive screenshots, Storybook, and page Playwright checks are not implementation requirements for this change.
- The **evidence contract** must still cover downstream accessibility: semantic/heading implications, keyboard/focus states, WCAG contrast evidence or an explicit unresolved item, reduced motion, 320/390/desktop states, 200% zoom/natural-height implications, long/missing/localized copy, empty/loading/error/disabled states, and image alternative/rights questions where applicable. Static Figma absence is a blocker or documented limitation, never permission to invent behavior.
- Bound content extremes for the factory itself: zero or more than 12 nodes, duplicate/malformed IDs, long labels, Unicode, missing approval metadata, empty evidence, large screenshots, 256 KiB JSON overflow, 25 MiB artifact overflow, and redaction-triggering strings must fail deterministically and safely.

## Deterministic verification

Run from the leased worktree and judge every command by exit status.

```bash
set -euo pipefail
corepack pnpm install --frozen-lockfile
PYTHONPATH=adws uv run --with pydantic --with pyyaml --with python-dotenv --with rich \
  python -m unittest discover -s adws/tests -p 'test_*.py'
PYTHONPATH=adws uv run --with pydantic --with pyyaml --with python-dotenv --with rich \
  python -m compileall -q adws
corepack pnpm exec prettier --check \
  AGENTS.md \
  .agents/skills/sssf \
  adws/adw_sssf_config/sssf.config.yaml \
  adws/adw_data/prompt_engineering \
  docs/operations.md docs/planning/roadmap.md docs/agent-evals.md \
  Justfile specs/273609bc_figma-codex-supervision.md
git diff --check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm check
```

Run the SSSF module smoke required by the skill; it must not start Codex:

```bash
uv run adws/adw_prompt.py --config adws/adw_sssf_config/sssf.config.yaml \
  --agent scout "Return one typed summary; do not spawn workers or change files."
```

Tests must use fake `codex` executables and fixture JSONL to prove success, every failure classification, retry counts, deadlines/kill escalation, redaction, exact tool/target enforcement, hashes/path limits, additive tracer migration, same-Pi continuation, config validation, and nested-process denial. No unit test may contact Figma or require a credential.

Before the authorized live smoke, verify the CLI surface without connecting/authenticating and require exit 0:

```bash
codex --version
codex exec --help >/dev/null
codex mcp list --json >/dev/null
```

After a human records approval for the exact canonical target, run only the capture workflow:

```bash
uv run adws/adw_figma_capture.py \
  --config adws/adw_sssf_config/sssf.config.yaml \
  --file-key GYiQd7QSAwCSaGtt0alKG2 \
  --node-id 93:6
```

Require exit 0 and inspect the session's sanitized `request.json`, typed `result.json`, Pi validation envelope, artifact hashes, connector-worker/process rows, and denial-free event stream. Do not run `codex mcp login`, Pi `/mcp-auth`, direct endpoint probes, broad file reads, comments, exports, or modifying tools. If connector auth is absent, stop with `connector_unauthenticated`; a human handles authentication outside this task and authorizes a later retry.

Before handoff:

```bash
set -euo pipefail
git status --short
git diff --name-only infusion-diffusion/main...HEAD
git diff --check
just pr-gate <PR-number>
```

The builder, advisor, and reviewer inspect the complete diff and sanitized trace for credentials, raw payloads, bypass flags, unbounded process calls, unrelated files, and unsupported readiness claims.

## Preview, release, and rollback evidence

- Vercel Preview, `/api/health`, Storybook preview, production smoke tests, Sanity publish, and Figma publish are not applicable because no storefront runtime or design/content data changes.
- Release evidence is the fresh remote-main base, focused factory tests, full local gate, ordinary Pi smoke, authorized official-connector capture trace, runtime advisor report, independent review, and green GitHub required checks.
- Add `workers.figma_codex.enabled` as an off switch. If the path misbehaves before merge, stop the run and set it false in the branch. After merge, a human may authorize a reviewed config-off change or Git revert; preserve the separate Pi MCP configuration, protected-file rules, evidence needed for audit, and unrelated work. Never delete credentials/evidence destructively or perform a production rollback for this non-runtime change.

## Human approval gates

- **Implementation/protected files:** this plan does not authorize implementation. A human must approve the exact scope, one worktree/branch, and session-local protected-path grant before the builder writes.
- **Connector use:** a human must authorize the exact canonical file/node live smoke. Missing connector authentication is a blocker; agents may not initiate OAuth/login or copy credentials.
- **Design:** for a real downstream UI feature, a human must approve the exact Figma direction and responsive/interaction contract after Pi validation and before implementation is treated as ready. A provenance-complete capture is evidence, not approval.
- **Merge:** green required checks, advisor evidence, and independent quality approval are required; only a human may approve and merge.
- **Figma/editorial publish:** no Figma mutation or Sanity publish is authorized. Any future publish remains a human decision.
- **Production:** no deployment or promotion is authorized. Codex/Pi workers never receive production authority.
- **Rollback:** only a human may authorize the config off switch, Git revert, or destructive cleanup. No Vercel rollback applies.

## Residual risks

- Codex CLI JSONL/tool event shapes and official connector naming can change; strict config/schema checks should fail closed and may require a reviewed adapter update.
- A PATH/tool-event guard is a strong cooperative factory control, not an adversarial OS sandbox. A model with general code execution could attempt indirection; least-privilege prompts, process monitoring, no worker authority, and independent trace review remain necessary.
- Official connector availability, OAuth state, Figma plan/seat, scopes, rate limits, and node metadata are machine/account/provider-owned and cannot be proven by offline tests.
- A provenance hash proves internal consistency of observed factory artifacts, not that Figma or Codex cryptographically signed the content.
- Static Figma frames cannot prove runtime keyboard, zoom, assistive-technology, performance, or reduced-motion behavior; the handoff must preserve these as downstream implementation/test obligations.
- The current branch contains unrelated planning commits; skipping the leased fresh-main worktree would contaminate the delivery diff.
- The exact protected-path overlay is operationally sensitive: too broad a grant would weaken the factory boundary. Human review and a final tracked-config check are mandatory.
