# Plan: Activate Pi’s repository Figma MCP integration

## Objective

Make the already pinned `pi-mcp-adapter` load in ordinary Pi sessions started from this checkout, consume the repository’s existing `.pi/mcp.json` Figma server at `https://mcp.figma.com/mcp`, enumerate the `figma` tool namespace, and complete one bounded read-only lookup. Preserve the existing uncommitted hosted-endpoint edit and every unrelated working-tree change. Do not modify Figma content, application UI/code, service permissions, or deployments.

## Current evidence and root-cause hypothesis

- `pi --version` reports `0.83.0`.
- `package.json` pins `pi-mcp-adapter` at `2.20.1`, and `pnpm-lock.yaml` contains that dependency.
- `pi list` currently reports no installed Pi packages. A package in the application’s `devDependencies` is not automatically a Pi package activation declaration.
- `.pi/mcp.json` is the only current working-tree edit. Its existing user-owned diff changes the Figma URL from `http://127.0.0.1:3845/mcp` to `https://mcp.figma.com/mcp`; `hostConfigDiscovery` remains off and the server remains lazy.
- The checkout already has a saved Pi trust decision on this machine. New machines must still review and approve project trust before project extensions execute.

Treat the missing project-local Pi package declaration as the first testable hypothesis. If adding that declaration does not expose the adapter, use verbose startup evidence to isolate package loading, project trust, or adapter compatibility one at a time; do not compensate by reverting the hosted endpoint, copying credentials into config, or enabling host-config discovery.

## Specialist routing

- **Implementation owner — `builder` (sole writer):** owns the project-local Pi activation declaration, focused regression test, and repository operations guidance on one delivery branch/PR.
- **Read-only advisor — `browser_release_debugger`:** diagnoses the local Pi/adapter/Figma runtime path and validates the live read-only lookup, including the browser OAuth handoff if it appears. It does not edit files or approve OAuth.
- **Independent review owner — `reviewer`:** reviews this small configuration/documentation change, secret hygiene, preservation of the pre-existing endpoint edit, and verification evidence.
- No concurrent writers or alternate worktrees are planned; `parallel-agent-worktrees` does not trigger.

## Applicable project skills

- **`.agents/skills/release-debug/SKILL.md`:** applies because this is local runtime activation and external-provider diagnosis. Reproduce the missing extension first, form one hypothesis at a time, and verify the original path after the change.
- **`.agents/skills/quality-gate/SKILL.md`:** applies for acceptance-criterion mapping, targeted automated checks, diff review, secret review, and residual-risk reporting.
- `feature-brief`, `impeccable`, and `design-to-storybook` do **not** trigger: Figma is only the external read-only MCP provider; no visual direction, UI, responsive state, component, Storybook contract, or Figma content changes.
- Sanity, Shopify, SSSF workflow-management, and deployment skills do not trigger because their owned systems are untouched.

## System ownership boundaries

- **Pi** owns project trust, package discovery, extension registration, session commands/tools, and ignored package caches.
- **`pi-mcp-adapter`** owns MCP configuration merging, the `mcp` proxy/commands, lazy connection behavior, tool enumeration, OAuth flow integration, output guarding, and secure credential-store access.
- **Figma** owns `https://mcp.figma.com/mcp`, browser authorization, account scopes/seat permissions, tool catalog, and design data. The repository must not emulate Figma auth or modify its content.
- **This repository** owns the reviewed project activation declaration, the server URL/lifecycle declaration, dependency pin, tests, and operating instructions.
- **The OS credential store** owns any Figma OAuth credential. No token, authorization code/URL, cookie, client secret, or returned identity payload belongs in Git, Pi session files, test output, screenshots, or handoff logs.
- Next.js, Sanity, Shopify, Storybook, approved Figma designs, and Vercel are unchanged.

## Exact file ownership

### Planned writes by the builder

1. **`.pi/settings.json` (new):** add one project-scoped Pi package entry for `npm:pi-mcp-adapter@2.20.1`. Use the object form and disable unrelated bundled skills (`"skills": []`) while leaving the package extension enabled. Do not add model settings, auth, environment values, or global paths. The explicit version must match `package.json`.
2. **`adws/tests/test_pi_mcp_config.py` (new):** add a dependency-free `unittest` regression that:
   - parses `.pi/settings.json`, `.pi/mcp.json`, and `package.json`;
   - proves the Pi package source activates the same exact adapter version pinned in `devDependencies` and does not disable its extension;
   - proves the configured `figma` endpoint is exactly `https://mcp.figma.com/mcp`, remains lazy, and host-config discovery remains off;
   - rejects unexpected inline secret-bearing/auth configuration in these tracked Pi files.
3. **`docs/operations.md`:** replace the now-stale statement that Pi is not configured by the repository with a narrow statement that Pi orchestration remains retired, while optional project-local Pi is configured only for the Figma MCP adapter. Document install/trust, tool enumeration, browser OAuth, the bounded read-only smoke lookup, `--no-session`, credential-store behavior, redacted evidence, and local rollback/troubleshooting.
4. **`.gitignore`:** update only the misleading Pi comment so it describes ignored Pi package caches/runtime credentials rather than claiming Pi is not a project dependency. Preserve all ignore patterns.

### Protected or inspect-only files

- **`.pi/mcp.json`:** protected pre-existing related user edit. Do not rewrite, normalize, revert, or replace it. Validate that the hosted URL edit remains byte-for-byte represented in the final diff and that no auth fields are introduced.
- **`package.json` and `pnpm-lock.yaml`:** inspect-only unless the existing `2.20.1` pin or lock entry is demonstrably invalid. No dependency update is planned. Any version change is a new decision and must be reported rather than made opportunistically.
- All application, design, Sanity, Shopify, Storybook, Vercel, ADW configuration, and unrelated files are out of bounds.
- `.pi/npm/` and any adapter cache/keyring artifacts are runtime-generated and ignored; never force-add them.

## Implementation sequence

1. Capture `git status --short`, `git diff -- .pi/mcp.json`, `pi --version`, and `pi list --approve` as the baseline. Do not clean, stash, reset, or update the checkout; this is not roadmap selection work.
2. Add the minimal `.pi/settings.json` package declaration. Review the pinned package as trusted executable project code; do not alter global `~/.pi/agent/settings.json`.
3. Add the focused configuration regression test, then update operations guidance and the `.gitignore` comment.
4. Install from the committed lockfile so both the application/SSSF dependency and project Pi package contract can be resolved. Confirm Pi’s generated package cache remains ignored.
5. Start a fresh, ephemeral Pi session from the repository root. Confirm the adapter commands/proxy load and enumerate the `figma` server’s tools.
6. If Figma reports authentication required, stop for explicit human browser approval. Let the adapter store the resulting credential only in the OS credential store. Never paste an authorization URL, callback URL, code, token, or identity payload into a tracked file or retained log.
7. After authorization, call only the enumerated read-only Figma `whoami` lookup with empty arguments. If the live server no longer offers `whoami`, inspect tool descriptions and use only a clearly read-only, bounded metadata lookup against the already documented design file `GYiQd7QSAwCSaGtt0alKG2`, node `25:2`; do not request images, broad file exports, comments, writes, or mutations. Record only adapter version, server name, tool count, selected tool name, and success/failure—redact returned identity/design data.
8. Have the independent reviewer reconcile the final diff and evidence against every acceptance criterion, including the unchanged hosted endpoint and absence of credentials.

## Acceptance criteria

1. A fresh Pi session launched at the repository root loads `pi-mcp-adapter` from project configuration; `pi list --approve` includes the pinned adapter, and the adapter’s `mcp` command/tool surface is present.
2. The effective server configuration contains a `figma` namespace at `https://mcp.figma.com/mcp`, with lazy lifecycle and host-config fallback disabled. The existing `.pi/mcp.json` hosted-endpoint edit is preserved.
3. In that Pi session, the operator can enumerate a non-empty set of `figma` tools and capture a sanitized tool count/namespaced-tool result.
4. The same session completes exactly one harmless read-only Figma lookup (`whoami`, or the bounded approved-file metadata fallback) without invoking any modifying tool.
5. If browser OAuth is required, the evidence clearly marks it as a human approval gate; after approval the credential is in the OS credential store only. No credential, OAuth URL/code, personal identity payload, cache, or session transcript is added to the repository or retained in handoff logs.
6. The focused automated test protects package activation/version alignment, endpoint/lifecycle/discovery settings, and tracked-config secret hygiene.
7. Repository operations guidance accurately distinguishes optional Figma MCP tooling from retired Pi orchestration and gives repeatable setup, verification, troubleshooting, and rollback steps.
8. No Figma content, Figma permissions/billing, UI/application code, Sanity, Shopify, Storybook, Vercel configuration, deployment, or unrelated working-tree changes are modified.

## Deterministic and repeatable verification

Judge each command by its exit status. Run from the repository root.

```bash
corepack pnpm install --frozen-lockfile
python -m unittest adws.tests.test_pi_mcp_config
corepack pnpm exec prettier --check .pi/settings.json .pi/mcp.json docs/operations.md
git diff --check
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm test
```

Assert Pi sees the package rather than relying only on visual output:

```bash
set -euo pipefail
pi_list_output="$(pi list --approve)"
PI_LIST_OUTPUT="$pi_list_output" node -e 'if (!process.env.PI_LIST_OUTPUT.includes("pi-mcp-adapter")) process.exit(1)'
```

Prove the extension command surface loads without persisting a session or invoking Figma:

```bash
set -euo pipefail
rpc_output="$(mktemp)"
printf '%s\n' '{"id":"commands","type":"get_commands"}' \
  | pi --mode rpc --no-session --approve --tools mcp,mcpScript > "$rpc_output"
RPC_OUTPUT="$rpc_output" node --input-type=module -e '
  import fs from "node:fs";
  const rows = fs.readFileSync(process.env.RPC_OUTPUT, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
  const response = rows.find((row) => row.id === "commands" && row.success === true);
  const names = response?.data?.commands?.map((command) => command.name) ?? [];
  if (!names.includes("mcp") || !names.includes("mcp-auth")) process.exit(1);
'
rm -f "$rpc_output"
```

Then perform the live, repeatable smoke test in an ephemeral terminal session:

```bash
pi --approve --no-session --tools mcp,mcpScript
```

Within Pi, run `/mcp tools`, confirm a non-empty `figma` namespace, and use `/mcp-auth figma` only if prompted. Browser approval is human-only. After approval, instruct Pi to use only `mcp`, enumerate server `figma`, call the read-only `figma_whoami` tool once with `{}`, and report only tool count, tool name, and status. If `whoami` is absent, use the bounded metadata fallback described above only after its read-only schema is visible. Do not redirect or tee this interaction, and retain no Pi session.

Final hygiene/evidence checks:

```bash
git status --short
git diff -- .pi/mcp.json .pi/settings.json .gitignore docs/operations.md adws/tests/test_pi_mcp_config.py package.json pnpm-lock.yaml
git check-ignore .pi/npm .pi/mcp-cache.json .pi/agent/auth.json
```

Report command exit statuses, Pi/adapter versions, server name, tool count, read-only tool name, OAuth gate outcome, and a redacted success result. Do not report auth material or lookup payloads.

## Accessibility and content extremes

- No customer-facing or reusable UI changes, so semantic HTML, keyboard flow, focus, responsive, motion, contrast, zoom, and Storybook accessibility gates are not applicable.
- The browser OAuth page is Figma-owned; the operator must complete it directly and report only whether approval succeeded, not reproduce or alter that UI.
- Content-extreme coverage is operational: enumerate tools without dumping every schema into retained logs, keep adapter output guards enabled, use `whoami` or one bounded node metadata lookup, avoid screenshots/file-wide exports, and verify long MCP payloads cannot become committed artifacts.

## Preview, release, and rollback evidence

- Vercel Preview, `/api/health`, production deployment, editorial publish, and Figma publish evidence are not applicable because no storefront/runtime deployment or content mutation occurs.
- Local evidence is the fresh Pi session, non-empty Figma tool enumeration, successful bounded lookup, focused test, and sanitized final diff.
- Rollback is one reviewed revert of the new activation/test/instruction changes. Do **not** roll back the pre-existing `.pi/mcp.json` hosted endpoint edit or unrelated changes. After rollback, `pi list --approve` should no longer show a project adapter declaration while the hosted endpoint diff remains. A human must authorize rollback of merged work.

## Human approval gates

- **Implementation:** the request authorizes the scoped non-UI implementation; no design approval is required. The builder may not broaden dependency versions or configuration scope without a new human decision.
- **Project trust:** a human must approve Pi project trust before this third-party project extension executes on a machine without an existing reviewed trust decision. `--approve` is acceptable only for the documented verification in this reviewed checkout.
- **Figma OAuth:** if prompted, a human must approve the browser authorization. An agent cannot approve, bypass, or claim this gate. A denied, unavailable, or insufficient-scope authorization blocks the live acceptance criterion and must be reported.
- **Merge:** independent review and green applicable checks are required; only a human may approve and merge.
- **Publish/production:** no editorial publish, Figma mutation, Preview promotion, or production action is in scope or authorized.
- **Rollback:** only a human may authorize reverting merged configuration. No production rollback applies.

## Residual risks

- Figma availability, network access, account scopes, seat policy, OAuth issuer behavior, and the live tool catalog are external and cannot be guaranteed by repository tests.
- Project trust and OS keychain availability are machine-specific; a new operator may encounter a trust or browser approval gate even after static checks pass.
- Pi and the adapter are separately versioned. The exact adapter pin limits drift, but a future Pi runtime may require a compatibility update that must be reviewed and tested explicitly.
- Automated tests can prove configuration integrity and extension registration, but only the sanitized live smoke test proves current end-to-end Figma authorization and lookup behavior.
- The project uses the adapter in both SSSF’s explicit `node_modules` extension path and ordinary Pi’s project package cache. The regression test must keep both declarations on the same exact adapter version to prevent behavior drift.
