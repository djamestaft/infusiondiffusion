#!/usr/bin/env -S uv run
"""Record an exact approval or capture one previously authorized Figma target.

Phases: engineer(record approval) OR engineer(request) -> product_designer(scope)
-> code(figma_codex) -> product_designer(validate).  This workflow never builds
or commits.
"""
import argparse
import hashlib
import json
import sys

from adw_modules import agents, codex_worker, gates, session
from adw_modules.data_types import AgentCall, FigmaSupervisorOutput, FigmaTarget, PhaseParams, PlanOutput

REQUIRED_AGENTS = ["product_designer"]


def _target(file_key: str, node_id: str) -> FigmaTarget:
    return FigmaTarget(file_key=file_key, node_ids=[node_id], expected_approval="Approved",
        evidence_categories=["dimensions_layout", "semantic_variables", "typography", "spacing_assets",
                             "responsive", "accessibility_interaction", "content_extremes", "divergences"])


def _target_hash(target: FigmaTarget) -> str:
    return hashlib.sha256(json.dumps(target.model_dump(), sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def record_approval(file_key: str, node_id: str, config: str, adw_id: str, approved_by: str) -> int:
    """Auditable authorization path; it deliberately never preflights or runs Codex."""
    if not adw_id or not approved_by:
        raise ValueError("--record-approval requires --adw-id and --approved-by")
    cfg = agents.load_config(config)
    run = session.ensure(cfg, adw_id)
    target = _target(file_key, node_id)
    target_hash = _target_hash(target)
    try:
        with run.phase(PhaseParams(name="record_figma_approval", kind="engineer", owner=run.engineer,
                                   description="Record a trusted human decision for one exact Figma target")) as ph:
            reference = run.tracer.human_design_approval(run.adw_id, target_hash, approved_by,
                set(cfg.workers.figma_codex.trusted_design_approvers))
            artifact = run.context_handoff_dir / "approvals" / f"{target_hash}.json"
            artifact.parent.mkdir(parents=True, exist_ok=True)
            artifact.write_text(json.dumps({"target": target.model_dump(), "target_hash": target_hash,
                "approved_by": approved_by, "tracer_reference": reference}, sort_keys=True, indent=2) + "\n")
            ph.log(target_hash=target_hash, approval_reference=reference, artifact=str(artifact.relative_to(run.context_handoff_dir)))
        return run.finish(accepted=True, reason="")
    except BaseException as error:
        return run.finish(accepted=False, reason=type(error).__name__)


def _main(file_key: str, node_id: str, config: str, adw_id: str | None = None) -> int:
    cfg = agents.load_config(config)
    agents.validate(cfg, REQUIRED_AGENTS)
    run = session.ensure(cfg, adw_id)
    main._active_run = run
    target = _target(file_key, node_id)
    plan = PlanOutput(status="success", summary="Authorized capture-only Figma request", figma_targets=[target],
                      advisory_specialists=["product_designer"])
    run.figma_targets = [target]
    run.active_figma_target = target
    try:
        target_hash = _target_hash(target)
        if not run.tracer.has_trusted_human_design_approval(run.adw_id, target_hash,
                                                            set(cfg.workers.figma_codex.trusted_design_approvers)):
            return run.finish(accepted=False, reason="missing trusted approval for exact target")
        with run.phase(PhaseParams(name="capture_request", kind="engineer", owner=run.engineer,
                                   description="Request evidence for one previously authorized exact Figma target")) as ph:
            ph.log(file_key=file_key, node_id=node_id)
        target_prompt = "Capture only this exact previously authorized Figma target:\n" + target.model_dump_json()
        with run.phase(PhaseParams(name="scope_figma_capture", kind="agent", owner="product_designer",
                                   description="Scope exact-node evidence before the authorized worker starts")) as ph:
            advice = ph.call(AgentCall(output_type=FigmaSupervisorOutput, prompt=target_prompt, previous=plan,
                                       gates=[gates.figma_supervisor_response]))
        delegation = gates.supervisor_delegation_valid(advice, plan, run)
        if advice.stage != "delegate_codex" or not delegation.passed:
            return run.finish(accepted=False, reason="; ".join(delegation.violations or ["Pi did not issue bounded Codex delegation"]))
        with run.phase(PhaseParams(name="figma_codex_capture", kind="code", owner="figma_codex",
                                   description="Capture only the separately authorized exact target")) as ph:
            capture = codex_worker.run(advice.request, cfg.workers.figma_codex, run, ph.phase.phase_id)
            capture_gate = gates.figma_capture_complete(capture, run)
            ph.log(capture_status=capture.capture_status, failure_code=capture.failure_code, gate_violations=capture_gate.violations)
        if not capture_gate.passed:
            return run.finish(accepted=False, reason="; ".join(capture_gate.violations))
        with run.phase(PhaseParams(name="validate_figma_capture", kind="agent", owner="product_designer",
                                   description="Continue Pi validation for the exact captured target")) as ph:
            validation = ph.call(AgentCall(output_type=FigmaSupervisorOutput, prompt=target_prompt, previous=capture,
                gates=[gates.figma_supervisor_response,
                       lambda envelope, current_run: gates.figma_handoff_complete(envelope, current_run, target)]))
        coverage = gates.figma_handoff_coverage([validation], plan, run)
        if coverage.passed:
            (run.context_handoff_dir / "figma_handoff.md").write_text("# Gated Figma handoffs\n\n```json\n" +
                json.dumps([validation.model_dump()], indent=2) + "\n```\n")
        return run.finish(accepted=coverage.passed, reason="" if coverage.passed else "; ".join(coverage.violations))
    finally:
        run.active_figma_target = None


def main(file_key: str, node_id: str, config: str, adw_id: str | None = None) -> int:
    main._active_run = None
    try:
        return _main(file_key, node_id, config, adw_id)
    except BaseException as error:
        run = main._active_run
        if run is not None:
            return run.finish(accepted=False, reason=type(error).__name__)
        raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default="adws/adw_sssf_config/sssf.config.yaml")
    parser.add_argument("--adw-id", default=None, help="existing session that owns the approval and capture")
    parser.add_argument("--file-key", required=True)
    parser.add_argument("--node-id", required=True)
    parser.add_argument("--record-approval", action="store_true", help="record approval only; never launches the worker")
    parser.add_argument("--approved-by", default="", help="configured human approver; valid only with --record-approval")
    args = parser.parse_args()
    if args.record_approval:
        sys.exit(record_approval(args.file_key, args.node_id, args.config, args.adw_id or "", args.approved_by))
    if args.approved_by:
        parser.error("--approved-by is only valid with --record-approval; it cannot authorize a capture")
    sys.exit(main(args.file_key, args.node_id, args.config, args.adw_id))
