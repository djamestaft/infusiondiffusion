# Plan: Activate Pi’s repository Figma MCP integration

> **Current-status supersession.** This is the original activation plan. Its former live OAuth, tool-enumeration, and lookup steps are superseded by the pending Figma MCP Catalog status below. Pi activation is complete, Catalog registration was submitted, and approval is pending. Do not use this historical plan to retry authentication or claim live Pi/Figma support.

## Provenance and current status

This plan established the project-local activation for the repository’s hard-required Pi Figma MCP client. Pi orchestration remains retired; that does not make this Figma MCP client optional.

1. **Activation complete:** `.pi/settings.json` activates exactly `pi-mcp-adapter@2.20.1`, aligned with the exact `package.json` development-dependency pin. Bundled skills are disabled, and the extension is enabled.
2. **Catalog registration submitted; approval pending:** Figma owns Catalog review. Submission is complete, but approval is not established and no response timeline is claimed.
3. **Observed provider boundary:** the Dynamic Client Registration path returned HTTP 403 before browser OAuth. This coarse result is not an OAuth denial, a successful registration, or evidence of a permanent provider policy.
4. **Post-approval verification:** browser OAuth, tool enumeration, and one bounded read-only lookup are incomplete. They require independently confirmed Catalog approval and separate human authorization.

The repository owns its static activation declaration, exact adapter/version alignment, hosted server policy, secret hygiene, and truthful operational status. Figma owns DCR policy, Catalog review, OAuth, scopes, tool availability, and design data. Any future credential belongs only in OS credential storage; no credential, client identifier, registration payload or response, account identity, OAuth URL/code, or MCP result payload belongs in the repository or handoff evidence.

## Preserved configuration

The hosted `.pi/mcp.json` configuration is protected and remains a single lazy `figma` server at `https://mcp.figma.com/mcp` with host discovery off. Do not normalize, re-save, or alter it. `package.json`, the lockfile, and `.pi/settings.json` remain authoritative for the exact adapter pin and activation declaration.

## Current acceptance criteria

- Pi is named as the hard-required client for this repository’s Figma MCP route, separately from retired Pi orchestration.
- Offline static checks prove one enabled `pi-mcp-adapter` activation at the exact pinned version, disabled bundled skills, the fixed hosted endpoint, lazy lifecycle, host discovery off, and no tracked credential or auth configuration.
- Guidance consistently records activation complete, Catalog registration submitted with approval pending, and the observed pre-OAuth DCR HTTP 403.
- No document claims Catalog approval, browser OAuth, tool availability, tool enumeration, a lookup, or current live Pi/Figma support.
- Browser OAuth, enumeration, and exactly one bounded read-only lookup remain post-approval human gates.

## Safe verification and release gate

This delivery permits only non-network activation/configuration verification:

```bash
corepack pnpm install --frozen-lockfile
python3 -m unittest adws.tests.test_pi_mcp_config
corepack pnpm exec prettier --check \
  .pi/settings.json \
  .pi/mcp.json \
  adws/tests/test_pi_mcp_config.py \
  docs/operations.md \
  docs/planning/roadmap.md \
  specs/d99fc09f_pi-figma-mcp.md
git diff --check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

In a checkout whose project trust was already reviewed by a human, `pi list --approve` and the no-session RPC command-surface check may confirm the pinned adapter and `mcp`/`mcp-auth` commands without connecting to Figma. Do not use those checks to enumerate a server or authenticate.

Do **not** run `/mcp-auth figma`, `/mcp tools`, a Figma tool, a direct endpoint request, a DCR retry or workaround, or another Catalog submission. Do not add OAuth credentials, headers, client identifiers, secrets, or provider-response material.

Before handoff, confirm the protected `.pi/mcp.json` blob, inspect the scoped diff for credentials and unsupported live claims, and require the repository quality gate plus independent review. A human alone may approve and merge; no deployment, publication, or rollback is authorized.

## Post-approval gate

After Catalog approval is independently confirmed, a human must authorize a separate task before opening browser OAuth. That task may enumerate the Figma tools and make one bounded read-only lookup only after inspecting its schema. Prefer `figma_whoami` with `{}` if available; otherwise use a clearly read-only metadata lookup for the approved file/node. Do not request exports, comments, broad file data, or modifying tools. Record only sanitized adapter/version, server, tool-count, selected-tool, and success/failure evidence.

## Residual risks

Figma controls approval timing and outcome, DCR policy, OAuth scopes, tool availability, and design data. The pre-OAuth HTTP 403 does not disclose approval criteria or guarantee future behavior. Static checks cannot prove reachability, OAuth, enumeration, or a lookup; Pi project trust and OS credential-store behavior remain machine-specific. Historical Figma MCP success through another client must not be treated as evidence that the hard-required Pi client is approved or live.
