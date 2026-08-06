"""Start the local SSSF development surface in a Herdr-managed workspace.

Every checkout gets one idempotent service tab: observability starts first,
then the Next.js and Storybook servers start in the same repository root. A
Treehouse feature worktree therefore receives isolated panes and ports without
pointing either server back at the primary checkout.
"""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
from pathlib import Path

from .utils import operator_env


def _call(*args: str) -> dict:
    completed = subprocess.run(
        ["herdr", *args], capture_output=True, text=True, timeout=15,
        env=operator_env(),
    )
    if completed.returncode != 0:
        detail = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(f"herdr {' '.join(args)} failed: {detail}")
    # `pane run` acknowledges success with an empty body; query/create commands
    # return JSON. Both are successful Herdr control responses.
    return json.loads(completed.stdout) if completed.stdout.strip() else {}


def _port_seed(repo_root: Path) -> int:
    digest = hashlib.sha256(str(repo_root.resolve()).encode()).hexdigest()
    return int(digest[:6], 16) % 200


def _tab_label(repo_root: Path) -> str:
    digest = hashlib.sha256(str(repo_root.resolve()).encode()).hexdigest()[:6]
    return f"SSSF {repo_root.name} {digest}"


def ensure(run) -> str:
    """Create the three service panes once for this checkout and Herdr workspace."""
    if os.environ.get("SSSF_HERDR_PANES", "1").strip().lower() in {"0", "false", "no"}:
        return "Herdr service panes disabled by SSSF_HERDR_PANES"
    if os.environ.get("HERDR_ENV") != "1":
        return "Herdr unavailable; service panes were not opened"

    workspace_id = os.environ.get("HERDR_WORKSPACE_ID", "").strip()
    if not workspace_id:
        return "Herdr workspace id unavailable; service panes were not opened"

    repo_root = Path(run.repo_root).resolve()
    label = _tab_label(repo_root)
    listed = _call("tab", "list", "--workspace", workspace_id)
    tabs = listed.get("result", {}).get("tabs", [])
    seed = _port_seed(repo_root)
    # Stable per checkout: repeated workflows can accurately report and reuse
    # the same panes. Treehouse paths differ, so feature worktrees receive
    # isolated ports without storing mutable coordination state in the repo.
    dev_port = 3100 + seed
    storybook_port = 6200 + seed
    obs_api_port = 4700 + seed * 2
    obs_ui_port = obs_api_port + 1

    existing = next((tab for tab in tabs if tab.get("label") == label), None)
    if existing:
        tab_id = existing["tab_id"]
        panes_result = _call("pane", "list", "--workspace", workspace_id)
        panes = [pane for pane in panes_result.get("result", {}).get("panes", [])
                 if pane.get("tab_id") == tab_id]
        root = next((pane for pane in panes
                     if pane.get("label") == "SSSF Observability"), panes[0])
        root_pane = root["pane_id"]
    else:
        created = _call(
            "tab", "create", "--workspace", workspace_id, "--cwd", str(repo_root),
            "--label", label, "--no-focus",
        )
        tab_id = created["result"]["tab"]["tab_id"]
        root_pane = created["result"]["root_pane"]["pane_id"]
        panes = []
        _call("pane", "rename", root_pane, "SSSF Observability")
        _call(
            "pane", "run", root_pane,
            f"SSSF_OBS_API_PORT={obs_api_port} SSSF_OBS_UI_PORT={obs_ui_port} just obs",
        )

    dev_pane = next((pane.get("pane_id") for pane in panes
                     if pane.get("label") == "Next Dev"), None)
    if not dev_pane:
        dev_pane = _call(
            "pane", "split", root_pane, "--direction", "right", "--ratio", "0.58",
            "--cwd", str(repo_root), "--no-focus",
        )["result"]["pane"]["pane_id"]
        _call("pane", "rename", dev_pane, "Next Dev")
        _call("pane", "run", dev_pane, f"corepack pnpm exec next dev -p {dev_port}")

    storybook_pane = next((pane.get("pane_id") for pane in panes
                           if pane.get("label") == "Storybook"), None)
    if not storybook_pane:
        storybook_pane = _call(
            "pane", "split", dev_pane, "--direction", "down", "--ratio", "0.5",
            "--cwd", str(repo_root), "--no-focus",
        )["result"]["pane"]["pane_id"]
        _call("pane", "rename", storybook_pane, "Storybook")
        _call(
            "pane", "run", storybook_pane,
            f"corepack pnpm exec storybook dev -p {storybook_port}",
        )

    return (f"Herdr service panes ready in {tab_id} · "
            f"obs http://localhost:{obs_ui_port} · dev http://localhost:{dev_port} · "
            f"storybook http://localhost:{storybook_port}")
