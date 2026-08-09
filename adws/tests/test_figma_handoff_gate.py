import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import TestCase

from adw_modules.data_types import (
    CodexArtifact,
    CodexCallStamp,
    CodexFigmaOutput,
    CodexFigmaRequest,
    CodexWorkerProvenance,
    FigmaSupervisorOutput,
    FigmaTarget,
    HumanDesignApproval,
    PlanOutput,
)
from adw_modules.codex_worker import _output_schema, _worker_prompt
from adw_modules.gates import _result_hash, _worker_lifecycle_complete, figma_handoff_complete, figma_handoff_coverage, figma_plan_supervision_required
from adw_modules.tracer import Tracer


SECTIONS = {
    "dimensions_layout": ["320 390 desktop 200% zoom with natural height"],
    "semantic_variables": ["semantic variables"],
    "typography": ["semantic HTML heading hierarchy"],
    "spacing_assets": ["image alt and rights applicability"],
    "responsive": ["320 390 desktop natural height"],
    "accessibility_interaction": ["keyboard focus WCAG AA contrast reduced motion"],
    "content_extremes": ["long localized missing empty loading error disabled"],
    "divergences": ["intentional divergence is documented"],
}


class FigmaHandoffGateTest(TestCase):
    def test_worker_lifecycle_accepts_closed_semantic_retry_before_final_success(self) -> None:
        lifecycle = {
            "rows": [
                {"attempt_id": "request:1", "pid": 98, "status": "completed", "ended_at": "2026-01-01T00:00:01Z"},
                {"attempt_id": "request:2", "pid": 99, "status": "completed", "ended_at": "2026-01-01T00:00:02Z"},
            ],
            "starts": [{"attempt_id": "request:1", "pid": 98}, {"attempt_id": "request:2", "pid": 99}],
            "ends": [{"attempt_id": "request:1", "pid": 98}, {"attempt_id": "request:2", "pid": 99}],
            "tools": [],
            "malformed": 0,
        }
        tracer = SimpleNamespace(connector_worker_lifecycle=lambda *_: lifecycle)
        report = _worker_lifecycle_complete(SimpleNamespace(tracer=tracer), "adw", "phase", "request")
        self.assertTrue(report.passed)

    def test_explicit_handoff_root_does_not_evaluate_legacy_config(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            report = figma_handoff_complete(self._direct(root), self._run(root))
            self.assertTrue(report.passed)

    def test_direct_handoff_accepts_separate_human_approval(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            self.assertTrue(figma_handoff_complete(self._direct(root), self._run(root)).passed)

    def test_direct_handoff_rejects_arbitrary_approval_target_hash(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output = self._direct(root)
            output.human_design_approval.target_hash = "a" * 64
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_direct_handoff_rejects_pi_only_approval_artifact(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            run = self._run(root, tracer=SimpleNamespace(has_human_design_approval=lambda *_: False))
            self.assertFalse(figma_handoff_complete(self._direct(root), run).passed)

    def test_direct_handoff_rejects_missing_human_approval_file(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output = self._direct(root)
            (root / "approval.md").unlink()
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_direct_handoff_rejects_evidence_outside_root(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory) / "handoff"
            root.mkdir()
            output = self._direct(root)
            output.figma_evidence = ["../outside.md"]
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_direct_handoff_rejects_incomplete_obligations(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output = self._direct(root)
            output.handoff_sections["accessibility_interaction"] = []
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_direct_handoff_requires_complete_stage(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output = self._direct(root)
            output.stage = "blocked"
            output.ready = False
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_unavailable_static_fact_cannot_be_complete_or_ready(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output = self._direct(root)
            output.static_fact_status = "unavailable"
            output.static_fact_reason = "required static-Figma facts are unavailable"
            output.stage = "blocked"
            output.ready = False
            self.assertFalse(figma_handoff_complete(output, self._run(root)).passed)

    def test_worker_handoff_accepts_current_exclusive_evidence(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            self.assertTrue(figma_handoff_complete(output, run).passed)

    def test_worker_handoff_rejects_missing_or_tampered_request_artifact(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            request_path = root / "figma/request/request.json"
            request_path.unlink()
            self.assertFalse(figma_handoff_complete(output, run).passed)
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            (root / "figma/request/request.json").write_text('{"request_id":"foreign"}')
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_multi_target_coverage_rejects_partial_duplicate_and_mismatched_handoffs(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            first = FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"], evidence_categories=["dimensions_layout"])
            second = FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:7"], evidence_categories=["dimensions_layout"])
            plan = PlanOutput(status="success", figma_targets=[first, second], advisory_specialists=["product_designer"])
            run = self._run(root)
            run.figma_targets = [first, second]
            one = self._direct(root)
            two = one.model_copy(deep=True)
            two.human_design_approval.target_hash = hashlib.sha256(json.dumps(second.model_dump(), sort_keys=True, separators=(",", ":")).encode()).hexdigest()
            self.assertTrue(figma_handoff_coverage([one, two], plan, run).passed)
            one.handoff_sections["dimensions_layout"] = ["This frame owns typography facts; viewport obligations live in the sibling frame."]
            self.assertTrue(figma_handoff_coverage([one, two], plan, run).passed)
            two.handoff_sections["dimensions_layout"] = list(one.handoff_sections["dimensions_layout"])
            self.assertFalse(figma_handoff_coverage([one, two], plan, run).passed)
            two.handoff_sections["dimensions_layout"] = list(SECTIONS["dimensions_layout"])
            self.assertFalse(figma_handoff_coverage([one], plan, run).passed)
            self.assertFalse(figma_handoff_coverage([one, one], plan, run).passed)
            two.human_design_approval.target_hash = "0" * 64
            self.assertFalse(figma_handoff_coverage([one, two], plan, run).passed)

    def test_figma_plan_requires_one_product_designer_before_build(self) -> None:
        target = FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"], evidence_categories=["dimensions_layout"])
        for specialists in ([], ["browser_release_debugger"], ["product_designer", "product_designer"]):
            with self.subTest(specialists=specialists):
                plan = PlanOutput(status="success", figma_targets=[target], advisory_specialists=specialists)
                self.assertFalse(figma_plan_supervision_required(plan).passed)
        plan = PlanOutput(status="success", figma_targets=[target], advisory_specialists=["product_designer"])
        self.assertTrue(figma_plan_supervision_required(plan).passed)

    def test_worker_handoff_rejects_stale_evidence_not_in_manifest(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            (root / "stale.md").write_text("old capture")
            output.figma_evidence = ["stale.md"]
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_worker_handoff_rejects_wrong_observed_target(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root, observed_node_ids=["93:7"])
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_worker_handoff_rejects_tampered_provenance(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            result_path = root / "figma/request/result.json"
            capture = CodexFigmaOutput.model_validate_json(result_path.read_bytes())
            capture.provenance.prompt_hash = "0" * 64
            capture.result_hash = _result_hash(capture)
            result_path.write_text(capture.model_dump_json())
            output.capture_result_hash = capture.result_hash
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_worker_handoff_rejects_mismatched_result_hash(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            output.capture_result_hash = "0" * 64
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_worker_handoff_recomputes_every_provenance_field(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            result_path = root / "figma/request/result.json"
            original = result_path.read_text()
            changes = {
                "adw_id": "foreign", "phase_id": "foreign-phase", "request_id": "foreign-request",
                "supervisor_session_id": "foreign-pi", "worker_kind": "other", "cli_version": "bad",
                "connector_name": "other", "endpoint_identity": "https://invalid.example/mcp",
                "repository_commit": "0" * 40, "schema_version": "2", "schema_hash": "0" * 64,
                "prompt_hash": "0" * 64, "target_hash": "0" * 64,
                "started_at": "invalid", "ended_at": "invalid", "duration_seconds": 42,
                "attempts": 2, "timeout_seconds": 1, "overall_deadline_seconds": 1,
                "termination_outcome": "killed",
            }
            for field, value in changes.items():
                with self.subTest(field=field):
                    capture = CodexFigmaOutput.model_validate_json(original)
                    setattr(capture.provenance, field, value)
                    capture.result_hash = _result_hash(capture)
                    result_path.write_text(capture.model_dump_json())
                    output.capture_result_hash = capture.result_hash
                    self.assertFalse(figma_handoff_complete(output, run).passed)
            result_path.write_text(original)

    def test_worker_handoff_rejects_a_foreign_pi_continuation(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            run.agent_map["product_designer"]["session_id"] = "other-pi-session"
            self.assertFalse(figma_handoff_complete(output, run).passed)

    def test_direct_handoff_revalidates_recorded_approver_against_current_config(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            tracer = Tracer(root / "trace.db", root / "events.jsonl")
            try:
                output = self._direct(root)
                run = self._run(root, tracer=tracer)
                tracer.human_design_approval(run.adw_id, output.human_design_approval.target_hash,
                                             "reviewer", {"reviewer"})
                self.assertTrue(figma_handoff_complete(output, run).passed)
                run.cfg.workers.figma_codex.trusted_design_approvers = []
                report = figma_handoff_complete(output, run)
                self.assertFalse(report.passed)
                self.assertFalse(next(check for check in report.checks
                                      if check.item == "current trusted engineer approval").ok)
            finally:
                tracer.conn.close()

    def test_post_capture_handoff_revalidates_recorded_approver_against_current_config(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            output, run = self._worker_handoff(root)
            tracer = Tracer(root / "trace.db", root / "events.jsonl")
            try:
                capture = CodexFigmaOutput.model_validate_json(
                    (root / "figma" / output.capture_request_id / "result.json").read_bytes())
                manifest_hash = hashlib.sha256(json.dumps(
                    [artifact.model_dump() for artifact in capture.evidence_manifest], sort_keys=True,
                    separators=(",", ":")).encode()).hexdigest()
                tracer.human_design_approval(run.adw_id, output.human_design_approval.target_hash,
                                             "reviewer", {"reviewer"})
                tracer.connector_worker_start(run.adw_id, output.capture_phase_id,
                                              output.capture_request_id, "request:1", 99)
                tracer.connector_worker_tool(run.adw_id, output.capture_phase_id,
                                             output.capture_request_id, "request:1",
                                             [stamp.model_dump() for stamp in capture.call_stamps],
                                             capture.result_hash, manifest_hash)
                tracer.connector_worker_end(run.adw_id, output.capture_phase_id, 99,
                                            output.capture_request_id, "request:1", "completed")
                run.tracer = tracer
                self.assertTrue(figma_handoff_complete(output, run).passed)
                run.cfg.workers.figma_codex.trusted_design_approvers = []
                self.assertFalse(figma_handoff_complete(output, run).passed)
            finally:
                tracer.conn.close()

    @staticmethod
    def _run(root: Path, *, tracer=None, pi_session: str = "pi-session"):
        target = FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"],
                             evidence_categories=["dimensions_layout"])
        tracer = tracer or SimpleNamespace(has_human_design_approval=lambda *_: True,
                                            human_design_approval_reference=lambda *_: "approval:1",
                                            has_trusted_human_design_approval=lambda *_: True)
        return SimpleNamespace(
            context_handoff_dir=root,
            adw_id="run",
            figma_targets=[target],
            agent_map={"product_designer": {"session_id": pi_session}},
            cfg=SimpleNamespace(workers=SimpleNamespace(figma_codex=SimpleNamespace(
                attempt_timeout_seconds=180, overall_deadline_seconds=370, max_attempts=2,
                trusted_design_approvers=["reviewer"]))),
            tracer=tracer,
            repo_root=Path(__file__).resolve().parents[2],
        )

    def _direct(self, root: Path) -> FigmaSupervisorOutput:
        (root / "approval.md").write_text("human approved")
        (root / "evidence.md").write_text("bounded handoff")
        return FigmaSupervisorOutput(
            status="success",
            stage="complete",
            ready=True,
            human_design_approval=HumanDesignApproval(
                artifact_path="approval.md", approved_by="reviewer", target_hash=hashlib.sha256(
                    json.dumps(FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"],
                    evidence_categories=["dimensions_layout"]).model_dump(), sort_keys=True,
                    separators=(",", ":")).encode()).hexdigest()),
            figma_evidence=["evidence.md"],
            handoff_sections=dict(SECTIONS), static_fact_status="complete", supervisor_session_id="pi-session",
        )

    def _worker_handoff(self, root: Path, *, observed_node_ids=None):
        request = CodexFigmaRequest(
            request_id="request",
            supervisor_session_id="pi-session",
            reason="pi_connector_unavailable",
            operations=["node_metadata"],
            target=FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"],
                               evidence_categories=["dimensions_layout"]),
        )
        capture_root = root / "figma" / request.request_id
        capture_root.mkdir(parents=True)
        request_path = capture_root / "request.json"
        request_path.write_text(request.model_dump_json())
        evidence = capture_root / "evidence.json"
        evidence.write_text(json.dumps({"safe": "evidence"}))
        target_hash = hashlib.sha256(json.dumps(request.target.model_dump(), sort_keys=True,
                                                  separators=(",", ":")).encode()).hexdigest()
        repo_root = Path(__file__).resolve().parents[2]
        prompt = _worker_prompt(request)
        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        provenance = CodexWorkerProvenance(
            adw_id="run", phase_id="capture-phase", request_id=request.request_id,
            supervisor_session_id="pi-session", endpoint_identity="https://mcp.figma.com/mcp",
            cli_version="codex-cli 0.147.0",
            repository_commit=subprocess.run(["git", "rev-parse", "HEAD"], cwd=repo_root, capture_output=True, text=True).stdout.strip(),
            schema_hash=hashlib.sha256(json.dumps(_output_schema(request), sort_keys=True, separators=(",", ":")).encode()).hexdigest(),
            prompt_hash=hashlib.sha256(prompt.encode()).hexdigest(),
            target_hash=target_hash, started_at=now, ended_at=now, duration_seconds=0, attempts=1,
            timeout_seconds=180, overall_deadline_seconds=370, termination_outcome="completed",
        )
        request_artifact = CodexArtifact(path="figma/request/request.json", media_type="application/json",
                                         byte_count=request_path.stat().st_size,
                                         sha256=hashlib.sha256(request_path.read_bytes()).hexdigest())
        artifact = CodexArtifact(path="figma/request/evidence.json", media_type="application/json",
                                 byte_count=evidence.stat().st_size,
                                 sha256=hashlib.sha256(evidence.read_bytes()).hexdigest())
        capture = CodexFigmaOutput(
            status="success", summary="capture", capture_status="complete", request=request,
            observed_file_key=request.target.file_key,
            observed_node_ids=observed_node_ids or request.target.node_ids,
            approval_labels={"93:6": "Approved"},
            call_stamps=[CodexCallStamp(operation="node_metadata", file_key=request.target.file_key,
                                        node_ids=request.target.node_ids)],
            evidence_manifest=[request_artifact, artifact], provenance=provenance,
        )
        capture.result_hash = _result_hash(capture)
        (capture_root / "result.json").write_text(capture.model_dump_json())
        (root / "approval.md").write_text("human approved")
        output = FigmaSupervisorOutput(
            status="success", stage="complete", ready=True,
            human_design_approval=HumanDesignApproval(artifact_path="approval.md", approved_by="reviewer",
                                                       target_hash=target_hash),
            figma_evidence=[artifact.path], handoff_sections=dict(SECTIONS), static_fact_status="complete",
            capture_request_id=request.request_id, capture_phase_id="capture-phase",
            capture_supervisor_session_id="pi-session", capture_result_hash=capture.result_hash,
            supervisor_session_id="pi-session",
        )
        lifecycle = {"rows": [{"attempt_id": "request:1", "pid": 99, "status": "completed",
                                "ended_at": "2026-01-01T00:00:01Z"}],
                     "starts": [{"attempt_id": "request:1", "pid": 99}],
                     "ends": [{"attempt_id": "request:1", "pid": 99}],
                     "tools": [{"attempt_id": "request:1", "stamps": [stamp.model_dump() for stamp in capture.call_stamps],
                                "result_hash": capture.result_hash,
                                "manifest_hash": hashlib.sha256(json.dumps([request_artifact.model_dump(), artifact.model_dump()], sort_keys=True, separators=(',', ':')).encode()).hexdigest()}],
                     "malformed": 0}
        tracer = SimpleNamespace(connector_worker_lifecycle=lambda *_: lifecycle,
                                 has_human_design_approval=lambda *_: True,
                                 human_design_approval_reference=lambda *_: "approval:1",
                                 has_trusted_human_design_approval=lambda *_: True)
        return output, self._run(root, tracer=tracer)
