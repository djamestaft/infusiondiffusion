#!/usr/bin/env -S uv run
# /// script
# dependencies = ["pydantic", "python-dotenv", "pyyaml", "rich"]
# ///
"""ADW PR Gate — wait for GitHub's required pull-request checks.

Phases: engineer(request) -> code(github_required_checks)
"""

import argparse
import sys

from adw_modules import agents, github_checks, session
from adw_modules.data_types import PhaseParams


def main(pr: int, repo: str, wait_seconds: int,
         config: str = "adws/adw_sssf_config/sssf.config.yaml",
         adw_id: str | None = None) -> int:
    cfg = agents.load_config(config)
    agents.validate(cfg, [])
    run = session.ensure(cfg, adw_id)

    with run.phase(PhaseParams(name="request", kind="engineer", owner=run.engineer,
                               description="Capture the pull request whose CI must pass")) as ph:
        ph.log(pr=pr, repo=repo, required="quality")

    with run.phase(PhaseParams(name="github_required_checks", kind="code", owner="github",
                               description="Wait for GitHub's required quality check and reject every non-green state")) as ph:
        result = github_checks.inspect(pr, repo, {"quality"}, wait_seconds)
        ph.log(passed=result.passed,
               checks=", ".join(f"{c.name}:{c.bucket}" for c in result.checks),
               failures="; ".join(result.failures))

    return run.finish(accepted=result.passed,
                      reason="GitHub required checks are not green: " + "; ".join(result.failures))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pr", type=int)
    parser.add_argument("--repo", required=True, help="OWNER/REPO")
    parser.add_argument("--wait-seconds", type=int, default=1200)
    parser.add_argument("--config", default="adws/adw_sssf_config/sssf.config.yaml")
    parser.add_argument("--adw-id", default=None)
    args = parser.parse_args()
    sys.exit(main(args.pr, args.repo, args.wait_seconds, args.config, args.adw_id))
