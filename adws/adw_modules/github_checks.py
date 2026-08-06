"""Deterministic GitHub pull-request check inspection for release gates."""

from __future__ import annotations

import json
import subprocess
import time

from .data_types import PullRequestCheck, PullRequestGateResult
from .utils import operator_env

TERMINAL_BUCKETS = {"pass", "fail", "cancel", "skipping"}


def evaluate(raw: str, required: set[str]) -> PullRequestGateResult:
    checks = [PullRequestCheck.model_validate(item) for item in json.loads(raw)]
    by_name = {check.name: check for check in checks}
    failures: list[str] = []
    for name in sorted(required):
        check = by_name.get(name)
        if check is None:
            failures.append(f"required check {name!r} was not reported")
        elif check.bucket != "pass":
            failures.append(
                f"required check {name!r} is {check.bucket} ({check.state})"
            )
    return PullRequestGateResult(passed=not failures, checks=checks, failures=failures)


def inspect(pr: int, repo: str, required: set[str], wait_seconds: int) -> PullRequestGateResult:
    """Poll GitHub until required checks settle or the bounded wait expires."""
    deadline = time.monotonic() + wait_seconds
    while True:
        completed = subprocess.run(
            ["gh", "pr", "checks", str(pr), "--repo", repo, "--json",
             "name,state,bucket,link,workflow"],
            capture_output=True, text=True, env=operator_env(), timeout=30,
        )
        if completed.returncode not in (0, 8):
            raise RuntimeError(f"gh pr checks failed: {completed.stderr.strip()}")
        result = evaluate(completed.stdout or "[]", required)
        required_checks = {c.name: c for c in result.checks if c.name in required}
        if (required.issubset(required_checks)
                and all(c.bucket in TERMINAL_BUCKETS for c in required_checks.values())):
            return result
        if time.monotonic() >= deadline:
            result.failures.append(
                f"required checks did not settle within {wait_seconds} seconds"
            )
            result.passed = False
            return result
        time.sleep(10)
