"""Validation gates: verify the envelope's CLAIMS, never guesses.

A gate is `gate(envelope, run) -> GateReport` — one check per item it looked at.
Violations are derived from the failed checks and sent back to the SAME agent
session as a correction. Every check is recorded either way, so a green gate
says WHAT it verified instead of only that it passed.

Gates check what is mechanically checkable; plan quality is a reviewer's job.
"""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path

from .codex_worker import SUPPORTED_CODEX_VERSION, _output_schema, _worker_prompt
from .data_types import (HANDOFF_SECTIONS, CodexFigmaOutput, CodexFigmaRequest,
                         EnvelopeBase, FigmaSupervisorOutput, GateReport, PlanOutput)

TAIL_CHARS = 1000        # command output kept as evidence on a failure
# A complete capture needs one final successful attempt; prior closed retry
# attempts retain their own non-success terminal outcomes.
ACCEPTABLE_CAPTURE_WORKER_OUTCOMES = frozenset(("completed",))
HANDOFF_OBLIGATIONS = {
    "dimensions_layout": ("320", "390", "desktop", "200%", "natural height"),
    "semantic_variables": ("semantic",), "typography": ("semantic html", "heading"),
    "spacing_assets": ("image alt", "rights applicability"),
    "responsive": ("320", "390", "desktop", "natural height"),
    "accessibility_interaction": ("keyboard", "focus", "wcag aa", "reduced motion"),
    "content_extremes": ("long", "localized", "missing", "empty", "loading", "error", "disabled"),
    "divergences": ("diverg",),
}


def _size(path: Path) -> str:
    n = path.stat().st_size
    return f"{n}B" if n < 1024 else f"{n / 1024:.1f}KB"

def _declared_artifact_path(value: str, run) -> Path:
    direct = Path(value)
    if direct.exists() or direct.is_absolute():
        return direct
    root = _handoff_root(run)
    candidate = (root / direct).resolve()
    return candidate if root in candidate.parents else direct


def artifacts_exist(envelope: EnvelopeBase, run) -> GateReport:
    report = GateReport()
    for a in envelope.artifacts:
        p = _declared_artifact_path(a, run)
        report.check(a, p.exists(),
                     f"exists, {_size(p)}" if p.exists() else "declared artifact does not exist")
    return report


def files_non_empty(envelope: EnvelopeBase, run) -> GateReport:
    report = GateReport()
    for a in envelope.artifacts:
        p = _declared_artifact_path(a, run)
        if not (p.exists() and p.is_file()):
            continue                       # existence is artifacts_exist's job
        empty = p.stat().st_size == 0
        report.check(a, not empty, "declared artifact is empty" if empty else _size(p))
    return report


def _handoff_root(run) -> Path:
    """Resolve an explicit handoff directory without touching legacy config."""
    handoff_dir = getattr(run, "context_handoff_dir", None)
    if handoff_dir is None:
        handoff_dir = Path(run.cfg.defaults.data_dir) / "sessions" / run.adw_id / "context_handoff"
    return Path(handoff_dir).resolve()


def _target_hash(target) -> str:
    """Stable binding used by planner, worker provenance, and human approval."""
    return hashlib.sha256(json.dumps(target.model_dump(), sort_keys=True,
                                    separators=(",", ":")).encode()).hexdigest()


def _result_hash(envelope: CodexFigmaOutput) -> str:
    return hashlib.sha256(json.dumps({"request": envelope.request.model_dump(), "calls": [stamp.model_dump() for stamp in envelope.call_stamps],
        "provenance": envelope.provenance.model_dump(),
        "artifacts": [item.model_dump() for item in envelope.evidence_manifest]},
        sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _worker_lifecycle_complete(run, adw_id: str, phase_id: str, request_id: str) -> GateReport:
    """Require a closed, uniquely paired attempt history ending in success.

    A process can exit successfully yet fail semantic trace validation and be
    retried. Every attempt must still close truthfully; the final attempt must
    complete, while the separate tool-binding gate proves which attempt
    produced accepted evidence.
    """
    report = GateReport()
    tracer = getattr(run, "tracer", None)
    lookup = getattr(tracer, "connector_worker_lifecycle", None)
    if not callable(lookup):
        return report.check("worker lifecycle trace", False, "sanitized worker trace is unavailable")
    try:
        lifecycle = lookup(adw_id, phase_id, request_id)
        rows = lifecycle["rows"]
        starts = lifecycle["starts"]
        ends = lifecycle["ends"]
        malformed = lifecycle["malformed"]
    except (KeyError, TypeError, ValueError):
        return report.check("worker lifecycle trace", False, "sanitized worker trace is malformed")
    report.check("worker lifecycle rows", bool(rows),
                 f"{len(rows)} matching attempt row(s)" if rows else "no matching worker attempts")
    attempt_ids = [row.get("attempt_id") for row in rows if isinstance(row, dict)]
    unique_rows = len(attempt_ids) == len(rows) and all(isinstance(item, str) and item for item in attempt_ids) and len(set(attempt_ids)) == len(attempt_ids)
    report.check("worker lifecycle attempt identity", unique_rows,
                 "every attempt has a unique identity" if unique_rows else "missing or duplicate attempt identity")
    closed = bool(rows) and all(isinstance(row, dict) and bool(row.get("ended_at")) and row.get("status") != "running" for row in rows)
    report.check("worker lifecycle closed", closed,
                 "every attempt row is closed" if closed else "worker attempt is missing, live, or lacks a terminal outcome")
    row_pairs = {(row.get("attempt_id"), row.get("pid")) for row in rows if isinstance(row, dict)}
    start_pairs = {(event.get("attempt_id"), event.get("pid")) for event in starts if isinstance(event, dict)}
    end_pairs = {(event.get("attempt_id"), event.get("pid")) for event in ends if isinstance(event, dict)}
    paired = (not malformed and len(starts) == len(rows) and len(ends) == len(rows)
              and len(start_pairs) == len(starts) and len(end_pairs) == len(ends)
              and row_pairs == start_pairs == end_pairs)
    report.check("worker lifecycle events", paired,
                 "each attempt has one matching sanitized start/end pair" if paired
                 else "worker start/end events are missing, duplicate, malformed, or ambiguous")
    accepted = bool(rows) and isinstance(rows[-1], dict) and rows[-1].get("status") in ACCEPTABLE_CAPTURE_WORKER_OUTCOMES
    report.check("worker lifecycle outcome", accepted,
                 "final attempt completed" if accepted else "expected the final attempt to complete")
    return report


def _append_worker_lifecycle(report: GateReport, run, adw_id: str, phase_id: str, request_id: str) -> None:
    lifecycle = _worker_lifecycle_complete(run, adw_id, phase_id, request_id)
    for check in lifecycle.checks:
        report.check(check.item, check.ok, check.note)


def _capture_commit_compatible(repo_root: str, captured: str, current: str) -> bool:
    """Keep evidence only across descendant factory-internal repairs.

    Product, design, configuration, content, and Storybook changes always
    invalidate capture provenance. This narrowly avoids recapturing unchanged
    Figma facts when only the SSSF harness itself was repaired.
    """
    if not captured or not current:
        return False
    if captured == current:
        return True
    try:
        ancestor = subprocess.run(["git", "merge-base", "--is-ancestor", captured, current],
                                  cwd=repo_root, capture_output=True, timeout=10).returncode == 0
        changed = subprocess.run(["git", "diff", "--name-only", f"{captured}..{current}"],
                                 cwd=repo_root, capture_output=True, text=True, timeout=10,
                                 check=True).stdout.splitlines()
    except (OSError, subprocess.SubprocessError):
        return False
    return ancestor and bool(changed) and all(path.startswith("adws/") for path in changed)


def figma_handoff_complete(envelope: FigmaSupervisorOutput, run, expected_target=None) -> GateReport:
    """Validate one same-session Pi handoff bound to one planned target."""
    report = GateReport()
    root = _handoff_root(run)
    evidence = list(envelope.figma_evidence)
    report.check("figma evidence declared", bool(evidence),
                 f"{len(evidence)} artifact(s) declared" if evidence else "no Figma evidence was declared")
    for artifact in evidence:
        path = (root / artifact).resolve()
        valid = root in path.parents and path.is_file() and path.stat().st_size > 0
        report.check(artifact, valid, "contained non-empty handoff artifact" if valid
                     else "Figma evidence must be a non-empty handoff-relative file")
    # These are concrete, reviewable obligations, not generic accessibility
    # labels.  Static Figma cannot establish all of them, so a handoff must say
    # which facts are unavailable and block implementation rather than inventing.
    for section in sorted(HANDOFF_SECTIONS):
        values = envelope.handoff_sections.get(section, [])
        complete = bool(values and all(str(value).strip() for value in values))
        report.check(f"handoff section {section}", complete,
                     "target-owned facts documented" if complete else "target-owned facts are missing")
    # An unavailable static fact is a hard stop.  A handoff cannot become
    # complete merely by mentioning the word “blocker” in its narrative.
    static_complete = (envelope.static_fact_status == "complete" and not envelope.static_fact_reason.strip()
                       and envelope.stage == "complete" and envelope.ready)
    report.check("static Figma facts available", static_complete,
                 "all required static facts are present" if static_complete else
                 (envelope.static_fact_reason.strip() or "required static Figma facts are unavailable or unverified"))
    approval = envelope.human_design_approval
    approval_path = (root / approval.artifact_path).resolve() if approval else root / "missing"
    report.check("separate human design approval", bool(approval) and root in approval_path.parents and approval_path.is_file() and approval_path.stat().st_size > 0,
                 "recorded human approval artifact" if approval and approval_path.is_file() else "missing separate human approval evidence")
    tracer = getattr(run, "tracer", None)
    trusted = getattr(tracer, "has_human_design_approval", None)
    reference = getattr(tracer, "human_design_approval_reference", None)
    historical_approval_ok = (bool(approval) and callable(trusted) and callable(reference)
                              and trusted(run.adw_id, approval.target_hash, approval.approved_by)
                              and bool(reference(run.adw_id, approval.target_hash, approval.approved_by)))
    report.check("trusted engineer approval", historical_approval_ok,
                 "configured authority approval trace matches target" if historical_approval_ok
                 else "missing configured-authority approval trace")
    # Approval history is evidence, not a permanent grant. Revalidate the
    # named approver against the current allowlist at every final handoff gate.
    # The tracer lookup keeps this decision bound to its durable approval trace.
    trusted_approvers = set(getattr(run.cfg.workers.figma_codex,
                                    "trusted_design_approvers", []))
    current_trusted = getattr(tracer, "has_trusted_human_design_approval", None)
    current_approval_ok = (bool(approval)
                           and approval.approved_by in trusted_approvers
                           and callable(current_trusted)
                           and current_trusted(run.adw_id, approval.target_hash,
                                               trusted_approvers))
    report.check("current trusted engineer approval", current_approval_ok,
                 "approval remains authorized by the current configured authority"
                 if current_approval_ok else
                 "approval is absent from the current configured authority")
    # A supervisor verdict covers exactly one target.  An active target is set
    # by the workflow while it iterates the immutable plan; callers that gate a
    # handoff directly can provide the same target explicitly.
    target = expected_target or getattr(run, "active_figma_target", None)
    if target is None and len(getattr(run, "figma_targets", [])) == 1:
        target = run.figma_targets[0]
    current_pi_session = getattr(run, "agent_map", {}).get("product_designer", {}).get("session_id", "")
    report.check("current product designer session", bool(current_pi_session) and envelope.supervisor_session_id == current_pi_session,
                 "handoff was produced by the current product-designer session" if envelope.supervisor_session_id == current_pi_session else "handoff is not from the current product-designer session")
    target_bound = target is not None and bool(approval) and approval.target_hash == _target_hash(target)
    report.check("exact planned target", target_bound,
                 "approval binds this exact planned target" if target_bound else "handoff approval does not bind the target currently under review")
    # Direct/reused handoffs have no worker result, but are never a bypass for
    # the plan. The run records the planner's typed targets before specialist
    # work begins; approval must bind this exact target, never an arbitrary or
    # mixed target set.
    capture_fields = (envelope.capture_request_id, envelope.capture_phase_id,
                      envelope.capture_supervisor_session_id, envelope.capture_result_hash)
    if not any(capture_fields):
        report.check("direct or reused planned target", target_bound,
                     "human approval binds this exact current planner target"
                     if target_bound else "approval target is not the exact target under review")
        report.check("direct or reused provenance", envelope.stage == "complete" and target is not None,
                     "complete handoff is bound to current planner provenance"
                     if envelope.stage == "complete" and target is not None
                     else "missing current planner target provenance")
        return report
    if not all(capture_fields):
        return report.check("capture provenance declared", False,
                            "capture provenance must be fully declared or absent")
    report.check("capture provenance declared", True,
                 "request, phase, supervisor, and result hash declared")
    result_path = root / "figma" / envelope.capture_request_id / "result.json"
    try:
        capture = CodexFigmaOutput.model_validate_json(result_path.read_bytes())
    except (OSError, ValueError, json.JSONDecodeError):
        return report.check("capture result", False, "missing or malformed current worker result")
    capture_report = figma_capture_complete(capture, run)
    for check in capture_report.checks:
        report.check(f"capture {check.item}", check.ok, check.note)
    # Do not trust the nested capture gate alone: Pi's completion gate performs
    # its own trace lookup against the supervisor-declared provenance.
    _append_worker_lifecycle(report, run, run.adw_id, envelope.capture_phase_id,
                             envelope.capture_request_id)
    provenance = capture.provenance
    report.check("approval target binding", target_bound and approval is not None and approval.target_hash == provenance.target_hash,
                 "human approval binds exact target" if target_bound and approval and approval.target_hash == provenance.target_hash else "human approval does not bind worker target")
    expected_pi_session = getattr(run, "agent_map", {}).get("product_designer", {}).get("session_id", "")
    current = (provenance.adw_id == run.adw_id and provenance.phase_id == envelope.capture_phase_id
               and provenance.request_id == envelope.capture_request_id
               and provenance.supervisor_session_id == envelope.capture_supervisor_session_id
               and envelope.capture_supervisor_session_id == expected_pi_session)
    report.check("same Pi provenance", current, "current ADW, phase, request, and Pi session match" if current
                 else "worker provenance is foreign to this Pi continuation")
    report.check("capture result hash", capture.result_hash == envelope.capture_result_hash == _result_hash(capture),
                 "Pi references recomputed worker result" if capture.result_hash == envelope.capture_result_hash == _result_hash(capture)
                 else "Pi result hash does not match persisted worker result")
    manifest_paths = {item.path for item in capture.evidence_manifest}
    report.check("evidence matches manifest", bool(evidence) and set(evidence).issubset(manifest_paths),
                 "declared evidence is from current worker manifest" if set(evidence).issubset(manifest_paths)
                 else "Pi declared evidence outside the current worker manifest")
    return report


def figma_capture_complete(envelope: CodexFigmaOutput, run) -> GateReport:
    """Fail closed on code-produced capture facts before Pi validates the handoff."""
    report = GateReport()
    request = envelope.request.target
    provenance = envelope.provenance
    report.check("capture status", envelope.capture_status == "complete", envelope.failure_code or "complete")
    current = (provenance.adw_id == run.adw_id and provenance.request_id == envelope.request.request_id
               and provenance.supervisor_session_id == envelope.request.supervisor_session_id
               and bool(provenance.phase_id))
    report.check("current provenance", current,
                 "current run, phase, request, and supervisor" if current else "wrong or incomplete provenance")
    _append_worker_lifecycle(report, run, run.adw_id, provenance.phase_id,
                             provenance.request_id)
    cfg = run.cfg.workers.figma_codex
    schema_hash = hashlib.sha256(json.dumps(_output_schema(envelope.request), sort_keys=True,
                                            separators=(",", ":")).encode()).hexdigest()
    try:
        prompt = _worker_prompt(envelope.request)
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
        repo_root = str(getattr(run, "repo_root", Path.cwd()))
        commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=repo_root, capture_output=True,
                                text=True, timeout=10).stdout.strip()
        started = datetime.fromisoformat(provenance.started_at.replace("Z", "+00:00"))
        ended = datetime.fromisoformat(provenance.ended_at.replace("Z", "+00:00"))
        duration_ok = ended >= started and abs((ended - started).total_seconds() - provenance.duration_seconds) < 2
    except (OSError, ValueError, subprocess.SubprocessError):
        prompt_hash = commit = ""; duration_ok = False
    lifecycle = _worker_lifecycle_complete(run, run.adw_id, provenance.phase_id, provenance.request_id)
    lifecycle_rows = getattr(getattr(run, "tracer", None), "connector_worker_lifecycle", lambda *_: {"rows": []})(run.adw_id, provenance.phase_id, provenance.request_id).get("rows", [])
    facts = (provenance.target_hash == _target_hash(request)
             and provenance.timeout_seconds == cfg.attempt_timeout_seconds
             and provenance.overall_deadline_seconds == cfg.overall_deadline_seconds
             and provenance.endpoint_identity == "https://mcp.figma.com/mcp"
             and provenance.worker_kind == "codex" and provenance.connector_name == "figma"
             and provenance.schema_version == "1"
             and provenance.cli_version in (f"codex {SUPPORTED_CODEX_VERSION}", f"codex v{SUPPORTED_CODEX_VERSION}", f"codex-cli {SUPPORTED_CODEX_VERSION}", f"codex-cli v{SUPPORTED_CODEX_VERSION}")
             and _capture_commit_compatible(repo_root, provenance.repository_commit, commit)
             and provenance.schema_hash == schema_hash
             and provenance.prompt_hash == prompt_hash and duration_ok
             and provenance.attempts == len(lifecycle_rows) and provenance.attempts in range(1, cfg.max_attempts + 1)
             and provenance.termination_outcome == "completed")
    report.check("recomputed provenance", facts, "runtime target/config/trace provenance matches" if facts else "provenance differs from runtime facts")
    report.check("exact file",  envelope.observed_file_key == request.file_key, "requested and observed file match" if envelope.observed_file_key == request.file_key else "observed file differs")
    report.check("exact nodes", envelope.observed_node_ids == request.node_ids, "requested and observed nodes match" if envelope.observed_node_ids == request.node_ids else "observed nodes differ")
    report.check("approval", all(envelope.approval_labels.get(node) == request.expected_approval for node in request.node_ids), "all required nodes approved" if request.node_ids else "missing approval metadata")
    allowed = {"node_metadata", "node_context", "variables", "styles", "screenshot"}
    requested_nodes = set(request.node_ids)
    traced_nodes: set[str] = set()
    stamps_match = bool(envelope.call_stamps)
    for stamp in envelope.call_stamps:
        stamp_nodes = set(stamp.node_ids)
        stamp_valid = (
            stamp.operation in allowed
            and stamp.operation in envelope.request.operations
            and stamp.file_key == request.file_key
            and bool(stamp_nodes)
            and len(stamp_nodes) == len(stamp.node_ids)
            and stamp_nodes.issubset(requested_nodes)
        )
        stamps_match = stamps_match and stamp_valid
        if stamp_valid:
            traced_nodes.update(stamp_nodes)
    stamps_match = stamps_match and traced_nodes == requested_nodes
    report.check("read-only traced calls", stamps_match, "allowlisted exact-target calls only" if stamps_match else "missing, untraced, or wrong-target calls")
    root = _handoff_root(run)
    capture_root = (root / "figma" / envelope.request.request_id).resolve()
    # The request is an audit artifact, not merely an input folded into the
    # result hash. Its typed content and manifest digest must survive intact.
    request_artifacts = [item for item in envelope.evidence_manifest
                         if item.path == f"figma/{envelope.request.request_id}/request.json"]
    request_ok = len(request_artifacts) == 1
    if request_ok:
        request_path = (root / request_artifacts[0].path).resolve()
        try:
            request_ok = (capture_root in request_path.parents
                          and CodexFigmaRequest.model_validate_json(request_path.read_bytes()) == envelope.request)
        except (OSError, ValueError, json.JSONDecodeError):
            request_ok = False
    report.check("typed request artifact", request_ok,
                 "one current typed request.json is manifest-bound" if request_ok
                 else "missing, malformed, tampered, or unbound request.json")
    bytes_total = 0
    for artifact in envelope.evidence_manifest:
        path = (root / artifact.path).resolve()
        valid_path = capture_root in path.parents and path.is_file() and artifact.byte_count > 0
        digest = hashlib.sha256(path.read_bytes()).hexdigest() if valid_path else ""
        bytes_total += artifact.byte_count
        report.check(artifact.path, valid_path and path.stat().st_size == artifact.byte_count and digest == artifact.sha256,
                     "contained and hashed" if valid_path else "artifact outside current capture handoff or empty")
    bounded = (bool(envelope.evidence_manifest)
               and len(envelope.evidence_manifest) <= getattr(cfg, "max_artifacts", 8)
               and bytes_total <= getattr(cfg, "max_artifact_bytes", 25 * 1024 * 1024))
    report.check("artifact bounds", bounded, "non-empty and within worker limits" if bounded
                 else "evidence manifest is empty or artifact count or bytes exceed limits")
    expected_hash = _result_hash(envelope)
    report.check("result hash", envelope.result_hash == expected_hash, "recomputed" if envelope.result_hash == expected_hash else "result hash mismatch")
    lifecycle_data = getattr(getattr(run, "tracer", None), "connector_worker_lifecycle", lambda *_: {})(run.adw_id, provenance.phase_id, provenance.request_id)
    tools = lifecycle_data.get("tools", []) if isinstance(lifecycle_data, dict) else []
    manifest_hash = hashlib.sha256(json.dumps([item.model_dump() for item in envelope.evidence_manifest], sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    complete_tools = [tool for tool in tools if isinstance(tool, dict) and tool.get("attempt_id") == f"{provenance.request_id}:{provenance.attempts}"]
    trace_bound = (len(complete_tools) == 1 and complete_tools[0].get("result_hash") == envelope.result_hash
                   and complete_tools[0].get("manifest_hash") == manifest_hash
                   and complete_tools[0].get("stamps") == [stamp.model_dump() for stamp in envelope.call_stamps])
    report.check("worker tool trace binding", trace_bound,
                 "complete sanitized worker_tool row binds this result and manifest" if trace_bound
                 else "missing, tampered, or mismatched worker_tool trace binding")
    return report


def figma_plan_supervision_required(plan: PlanOutput) -> GateReport:
    """Require one, and only one, product-design gate for every Figma plan."""
    report = GateReport()
    if not plan.figma_targets:
        return report.check("Figma supervision route", True, "no Figma targets")
    designers = plan.advisory_specialists.count("product_designer")
    identities = [(target.file_key, tuple(sorted(target.node_ids)), target.expected_approval,
                   tuple(sorted(target.evidence_categories))) for target in plan.figma_targets]
    report.check("unique Figma targets", len(identities) == len(set(identities)),
                 "each target has one coverage obligation" if len(identities) == len(set(identities)) else "duplicate Figma targets cannot share a handoff")
    report.check("Figma supervision route", designers == 1,
                 "exactly one product_designer supervision path" if designers == 1
                 else f"Figma targets require exactly one product_designer, found {designers}")
    return report


def figma_supervisor_response(envelope: FigmaSupervisorOutput, run) -> GateReport:
    """Keep supervision stages internally consistent before branching the ADW."""
    report = GateReport()
    if envelope.stage == "delegate_codex":
        return report.check("delegation", envelope.request is not None and not envelope.ready,
                            "typed request awaits worker" if envelope.request else "missing typed worker request")
    if envelope.stage == "complete":
        valid = envelope.ready and envelope.human_design_approval is not None and bool(envelope.figma_evidence)
        return report.check("complete evidence", valid,
                            "ready evidence and separate human approval evidence declared" if valid
                            else "complete stage requires ready evidence and separate human approval evidence")
    return report.check("blocked verdict", not envelope.ready and bool(envelope.blocking),
                        "concrete blocker declared" if envelope.blocking else "blocked stage requires a blocker")


def supervisor_delegation_valid(envelope: FigmaSupervisorOutput, plan, run) -> GateReport:
    report = GateReport()
    if envelope.stage != "delegate_codex":
        return report.check("supervisor stage", True, "no Codex delegation")
    request = envelope.request
    targets = getattr(plan, "figma_targets", [])
    expected_pi_session = getattr(run, "agent_map", {}).get("product_designer", {}).get("session_id", "")
    valid = request is not None and request.supervisor_session_id == expected_pi_session and request.reason == "pi_connector_unavailable" and any(
        request.target.file_key == target.file_key
        and request.target.expected_approval == target.expected_approval
        and request.target.node_ids == target.node_ids
        and request.target.evidence_categories == target.evidence_categories
        for target in targets)
    return report.check("bounded delegation", valid, "delegation matches planned target and current Pi session" if valid else "delegation is not a planned exact target from the current Pi session")


def figma_handoff_coverage(handoffs: list[FigmaSupervisorOutput], plan: PlanOutput, run) -> GateReport:
    """Require a one-to-one, current-session approved result for every target."""
    report = GateReport()
    targets = list(plan.figma_targets)
    if not targets:
        return report.check("Figma handoff coverage", not handoffs,
                            "no Figma targets" if not handoffs else "no-target plan cannot carry Figma handoffs")
    report.check("Figma handoff count", len(handoffs) == len(targets),
                 "one handoff per planned target" if len(handoffs) == len(targets)
                 else f"expected {len(targets)} handoffs, found {len(handoffs)}")
    expected_hashes = [_target_hash(target) for target in targets]
    actual_hashes = [handoff.human_design_approval.target_hash if handoff.human_design_approval else ""
                     for handoff in handoffs]
    report.check("Figma handoff uniqueness", len(actual_hashes) == len(set(actual_hashes)),
                 "no duplicate target handoffs" if len(actual_hashes) == len(set(actual_hashes))
                 else "duplicate target handoffs")
    report.check("Figma handoff exact coverage", set(actual_hashes) == set(expected_hashes),
                 "all and only planned targets covered" if set(actual_hashes) == set(expected_hashes)
                 else "partial, mixed, missing, or wrong-target handoff coverage")
    # Concrete cross-cutting obligations belong to the approved target set as
    # a whole. Requiring every atomic frame (for example typography) to repeat
    # unrelated image or viewport facts creates false blockers; the aggregate
    # gate still requires the union to cover every release obligation.
    for section in sorted(HANDOFF_SECTIONS):
        aggregate = " ".join(
            str(value).casefold() for handoff in handoffs
            for value in handoff.handoff_sections.get(section, [])
        )
        missing = [word for word in HANDOFF_OBLIGATIONS[section] if word not in aggregate]
        report.check(f"Figma aggregate {section}", not missing,
                     "concrete obligations covered across target set" if not missing
                     else "missing concrete obligations: " + ", ".join(missing))
    for target, target_hash in zip(targets, expected_hashes):
        matching = [handoff for handoff in handoffs if handoff.human_design_approval
                    and handoff.human_design_approval.target_hash == target_hash]
        report.check(f"Figma handoff {target.file_key}:{','.join(target.node_ids)}", len(matching) == 1,
                     "one exact target handoff" if len(matching) == 1 else "missing or duplicate target handoff")
        if len(matching) == 1:
            gated = figma_handoff_complete(matching[0], run, target)
            for check in gated.checks:
                report.check(f"{target.file_key}:{','.join(target.node_ids)} {check.item}", check.ok, check.note)
    return report


def json_parses(envelope: EnvelopeBase, run) -> GateReport:
    report = GateReport()
    for a in envelope.artifacts:
        p = Path(a)
        if p.suffix != ".json" or not p.exists():
            continue
        try:
            parsed = json.loads(p.read_text())
            report.check(a, True, f"parses, {type(parsed).__name__}")
        except json.JSONDecodeError as e:
            report.check(a, False, f"declared JSON artifact does not parse: {e}")
    return report


def diff_matches_claims(envelope: EnvelopeBase, run) -> GateReport:
    """Every file claimed changed must exist on disk."""
    report = GateReport()
    for f in getattr(envelope, "changed_files", []):
        p = Path(f)
        report.check(f, p.exists(),
                     f"exists, {_size(p)}" if p.exists() else "claimed changed file does not exist")
    return report


def verdict_consistent(envelope: EnvelopeBase, run) -> GateReport:
    """A review's verdict must agree with the findings it just wrote down.

    Nothing here judges the code — that is the reviewer's job. This checks the
    envelope against itself: an approval that ships blocking items, or a
    rejection that names no problem, is a claim the harness can refute without
    reading a line of the diff.
    """
    report = GateReport()
    approved = bool(getattr(envelope, "approved", False))
    blocking = list(getattr(envelope, "blocking", []))
    unmet = [f.requirement for f in getattr(envelope, "findings", []) if not f.met]

    report.check("approved vs blocking", not (approved and blocking),
                 "no blocking items" if not blocking
                 else f"{len(blocking)} blocking item(s) while approved=true"
                 if approved else f"{len(blocking)} blocking item(s), not approved")
    report.check("approved vs findings", not (approved and unmet),
                 "every requirement met" if not unmet
                 else f"{len(unmet)} unmet requirement(s) while approved=true"
                 if approved else f"{len(unmet)} unmet requirement(s), not approved")
    report.check("rejection names a problem", approved or bool(blocking or unmet),
                 "verdict is supported" if approved or blocking or unmet
                 else "approved=false but no blocking item or unmet requirement was given")
    return report


def tests_pass(command: str):
    """Gate factory: the given shell command must exit 0."""
    def gate(envelope: EnvelopeBase, run) -> GateReport:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        ok = result.returncode == 0
        note = f"exit {result.returncode}"
        if not ok:
            note += "\n" + (result.stdout + result.stderr)[-TAIL_CHARS:]
        return GateReport().check(command, ok, note)
    gate.__name__ = f"tests_pass({command})"
    return gate
