#!/usr/bin/env -S uv run
# /// script
# dependencies = ["pydantic", "python-dotenv", "pyyaml", "rich"]
# ///
"""ADW Review — independently review an already committed build."""

import argparse
import sys

from adw_modules import agents, gates, session, utils
from adw_modules.data_types import AgentCall, PhaseParams, ReviewOutput


def main(prompt: str, owner: str = "quality_reviewer",
         config: str = "adws/adw_sssf_config/sssf.config.yaml",
         adw_id: str | None = None) -> int:
    cfg = agents.load_config(config)
    agents.validate(cfg, [owner])
    run = session.ensure(cfg, adw_id)

    with run.phase(PhaseParams(name="request", kind="engineer", owner=run.engineer,
                               description="Capture the scope and evidence for independent review")) as ph:
        ph.log(input=prompt)

    with run.phase(PhaseParams(name="review", kind="agent", owner=owner,
                               description="Rule on the committed build without changing it")) as ph:
        review = ph.call(AgentCall(output_type=ReviewOutput, prompt=prompt,
                                   gates=[gates.artifacts_exist, gates.verdict_consistent]))

    return run.finish(accepted=review.approved,
                      reason="the independent reviewer did not approve the committed build")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("prompt", help="inline text or a path to a prompt file")
    parser.add_argument("--owner", default="quality_reviewer",
                        choices=("reviewer", "quality_reviewer"))
    parser.add_argument("--config", default="adws/adw_sssf_config/sssf.config.yaml")
    parser.add_argument("--adw-id", default=None, help="join or pin an existing session")
    args = parser.parse_args()
    sys.exit(main(utils.resolve_prompt(args.prompt), args.owner, args.config, args.adw_id))
