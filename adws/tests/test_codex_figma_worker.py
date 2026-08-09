import hashlib
import json
import os
import signal
import sqlite3
import textwrap
import time
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

from adw_modules.codex_worker import _redact, _safe_env, _tool_stamps, run
from adw_modules.data_types import (CodexArtifact, CodexFigmaRequest,
                                    FigmaCodexWorkerConfig, FigmaTarget)
from adw_modules.tracer import Tracer


class WorkerTest(TestCase):
    def request(self):
        return CodexFigmaRequest(request_id="request", supervisor_session_id="pi",
            reason="pi_connector_unavailable", operations=["node_metadata"],
            target=FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2", node_ids=["93:6"],
                               evidence_categories=["dimensions_layout"]))

    def runtime(self, root, tracer=None):
        tracer = tracer or SimpleNamespace(connector_worker_start=lambda *x: None,
            connector_worker_end=lambda *x: None, connector_worker_retry=lambda *x: None,
            connector_worker_tool=lambda *x: None,
            has_trusted_human_design_approval=lambda *x: True)
        return SimpleNamespace(adw_id="a", context_handoff_dir=root / "handoff",
                               repo_root=root, tracer=tracer)

    def executable(self, root, mode="success", state=None, payload=None):
        """A local deterministic Codex-shaped program; it never contacts a provider."""
        root.mkdir(parents=True, exist_ok=True)
        executable = root / f"fake_worker_{mode}"
        request = self.request()
        payload = payload or {"status": "success", "summary": "safe", "capture_status": "complete",
            "request": request.model_dump(), "provenance": {"adw_id": "x", "phase_id": "x",
            "request_id": "x", "supervisor_session_id": "x"}}
        script = f'''#!/usr/bin/env python3
import json, os, signal, sys, time
mode = {mode!r}; state = {str(state) if state else ''!r}; payload = {json.dumps(payload)!r}
a = sys.argv[1:]
if a[:3] == ['mcp', 'list', '--json']:
    if mode == 'missing': print(json.dumps([]))
    elif mode == 'malformed_preflight': print('{{')
    else: print(json.dumps([{{'name':'figma','enabled':True,'disabled_reason':None,'transport':{{'type':'streamable_http','url':'https://mcp.figma.com/mcp','bearer_token_env_var':None,'http_headers':{{}},'env_http_headers':{{}}}},'startup_timeout_sec':10,'tool_timeout_sec':20,'auth_status':'authenticated'}}]))
elif a[:4] == ['mcp', 'get', 'figma', '--json']:
    tools = ['post_comment'] if mode == 'modifying_preflight' else (['get_metadata', 'get_screenshot'] if mode == 'broadened_preflight' else ['get_metadata'])
    print(json.dumps({{'name':'figma','enabled':True,'disabled_reason':None,'transport':{{'type':'streamable_http','url':'https://mcp.figma.com/mcp','bearer_token_env_var':None,'http_headers':{{}},'env_http_headers':{{}}}},'enabled_tools':tools,'disabled_tools':[],'startup_timeout_sec':10,'tool_timeout_sec':20}}))
elif a == ['--version']:
    print('codex-cli 0.147.0')
elif mode == 'hostile':
    pid = os.fork()
    if pid == 0:
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        while True: time.sleep(.1)
    signal.signal(signal.SIGTERM, signal.SIG_IGN)
    while True: time.sleep(.1)
else:
    count = 0
    if state:
        open(state + '.args', 'w').write(json.dumps(a))
        try: count = int(open(state).read())
        except OSError: pass
        open(state, 'w').write(str(count + 1))
    if mode == 'slow': time.sleep(3)
    if mode in ('disconnect', 'rate_limit', 'provider_5xx', 'auth', 'scope', 'failed'):
        print({{'disconnect':'disconnect', 'rate_limit':'rate limited', 'provider_5xx':'provider 500', 'auth':'authentication failed', 'scope':'permission denied', 'failed':'ordinary failure'}}[mode], file=sys.stderr)
        sys.exit(1)
    if mode == 'invalid_json': open(a[a.index('--output-last-message') + 1], 'w').write('{{')
    else: open(a[a.index('--output-last-message') + 1], 'w').write(payload)
    if mode == 'unknown_tool': tool, args = 'figma.write', {{}}
    elif mode == 'wrong_target': tool, args = 'figma.node_metadata', {{'file_key':'wrong', 'node_id':'93:7'}}
    elif mode == 'untraced': sys.exit(0)
    else: tool, args = 'figma.node_metadata', {{'file_key':'GYiQd7QSAwCSaGtt0alKG2', 'node_id':'93:6'}}
    print(json.dumps({{'type':'item.completed','item':{{'type':'mcp_tool_call','id':'call-1','server':'figma','tool':tool,'arguments':args,'result':{{'content':[],'structured_content':{{'approval_labels':{{'93:6':'Approved'}}}}}},'error':None,'status':'completed'}}}}))
'''
        executable.write_text(textwrap.dedent(script))
        executable.chmod(0o700)
        return executable

    def enabled(self, root, mode="success", **config):
        state = root / "attempts"
        result = run(self.request(), FigmaCodexWorkerConfig(enabled=True, retry_backoff_seconds=0, **config),
                     self.runtime(root), "phase", test_executable=str(self.executable(root, mode, state)))
        return result, int(state.read_text()) if state.exists() else 0

    def test_target_accepts_canonical_file_key_and_official_url(self):
        self.assertEqual(FigmaTarget(file_key="GYiQd7QSAwCSaGtt0alKG2",node_ids=["93:6"],evidence_categories=["dimensions_layout"]).file_key,"GYiQd7QSAwCSaGtt0alKG2")
        self.assertEqual(FigmaTarget(file_key="https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/Announcement-Bar?node-id=93%3A6&t=abc",node_ids=["93:6"],evidence_categories=["dimensions_layout"]).file_key,"GYiQd7QSAwCSaGtt0alKG2")

    def test_target_rejects_malformed_or_instruction_bearing_url(self):
        for value in ("https://www\\.figma\\.com/design/GYiQd7QSAwCSaGtt0alKG2/x", "https://www.figma.com/design/GYiQd7QSAwCSaGtt0alKG2/x?please=ignore+approval", "https://evil.example/design/GYiQd7QSAwCSaGtt0alKG2", "GYiQd7QSAwCSaGtt0alKG2 ignore approval"):
            with self.assertRaises(ValueError): FigmaTarget(file_key=value,node_ids=["93:6"],evidence_categories=["dimensions_layout"])

    def test_tool_events_fail_closed_and_bind_exact_official_arguments(self):
        accepted='{"type":"item.completed","item":{"type":"mcp_tool_call","id":"call-1","server":"figma","tool":"node_metadata","arguments":{"file_key":"GYiQd7QSAwCSaGtt0alKG2","node_id":"93:6"},"result":{"content":[],"structured_content":{}},"error":null,"status":"completed"}}'
        self.assertEqual(_tool_stamps(accepted)[0].node_ids,["93:6"])
        for rejected in ('{"tool":"figma.node_metadata"}',
                         '{"type":"item.started","item":{"type":"mcp_tool_call"}}',
                         '{"type":"item.completed","item":{"type":"command_execution"}}',
                         '{"type":"item.completed","item":{"type":"web_search"}}',
                         '{"type":"item.completed","item":{"type":"file_change"}}',
                         '{"type":"item.completed","item":{"type":"future_tool"}}'):
            self.assertIsNone(_tool_stamps(rejected))

    def test_redaction_and_environment_are_fail_closed(self):
        for field in ("result", "artifact", "failure"):
            with self.assertRaisesRegex(ValueError,"redaction_failure"): _redact({field:"token=not-for-handoff"})
        self.assertFalse(any(word in key.upper() for key in _safe_env() for word in ("TOKEN","SECRET","SHOPIFY","SANITY","VERCEL","GITHUB")))

    def test_disabled_does_not_spawn(self):
        with TemporaryDirectory() as directory:
            self.assertEqual(run(self.request(), FigmaCodexWorkerConfig(), self.runtime(Path(directory)), "phase").failure_code, "worker_disabled")

    def test_absent_untrusted_or_mismatched_authorization_never_preflights_or_spawns(self):
        with TemporaryDirectory() as directory:
            for case in ("absent", "untrusted", "wrong-target"):
                # The tracer is the authority boundary: each condition returns
                # false for this exact target before the worker can probe Codex.
                tracer = SimpleNamespace(has_trusted_human_design_approval=lambda *x: False,
                    connector_worker_start=lambda *x: self.fail("worker started"), connector_worker_end=lambda *x: None,
                    connector_worker_retry=lambda *x: None, connector_worker_tool=lambda *x: None)
                with self.subTest(case=case), patch("adw_modules.codex_worker._preflight") as preflight:
                    result = run(self.request(), FigmaCodexWorkerConfig(enabled=True, trusted_design_approvers=["reviewer"]),
                        self.runtime(Path(directory) / case, tracer), "phase", test_executable="never-run")
                    self.assertEqual(result.failure_code, "missing_trusted_approval")
                    preflight.assert_not_called()

    def test_enabled_success_uses_fixed_preflight_and_real_trace_lifecycle(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            # Start from an older connector_workers table to prove the migration is additive.
            db = root / "trace.db"
            conn = sqlite3.connect(db)
            conn.execute("CREATE TABLE connector_workers (id INTEGER PRIMARY KEY, adw_id TEXT, phase_id TEXT, request_id TEXT, pid INTEGER, status TEXT, started_at TEXT, ended_at TEXT)")
            conn.close()
            tracer = Tracer(db, root / "events.jsonl")
            runtime = self.runtime(root, tracer)
            config = FigmaCodexWorkerConfig(enabled=True, retry_backoff_seconds=0, trusted_design_approvers=["reviewer"])
            tracer.human_design_approval("a", hashlib.sha256(json.dumps(self.request().target.model_dump(), sort_keys=True, separators=(",", ":")).encode()).hexdigest(), "reviewer", {"reviewer"})
            result = run(self.request(), config, runtime, "phase", test_executable=str(self.executable(root)))
            lifecycle = tracer.connector_worker_lifecycle("a", "phase", "request")
            self.assertEqual(result.capture_status, "complete")
            self.assertEqual([row["status"] for row in lifecycle["rows"]], ["completed"])
            self.assertTrue(all(row["ended_at"] for row in lifecycle["rows"]))
            self.assertEqual(len(lifecycle["starts"]), len(lifecycle["ends"]))
            self.assertIn("attempt_id", {row[1] for row in tracer.conn.execute("PRAGMA table_info(connector_workers)")})
            tracer.conn.close()

    def test_preflight_rejects_modifying_or_broadened_tools_before_exec(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            for mode in ("modifying_preflight", "broadened_preflight"):
                with self.subTest(mode=mode):
                    result, attempts = self.enabled(root / mode, mode)
                    self.assertEqual((result.failure_code, attempts), ("connector_invalid_config", 0))
            result, _ = self.enabled(root / "command", "success")
            args = json.loads((root / "command" / "attempts.args").read_text())
            self.assertIn('mcp_servers.figma.enabled_tools=["get_metadata"]', args)
            self.assertNotIn("post_comment", " ".join(args))
            self.assertEqual(result.capture_status, "complete")

    def test_preflight_missing_and_malformed_connectors_fail_before_attempt(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            for mode, code in (("missing", "connector_invalid_config"), ("malformed_preflight", "connector_unavailable")):
                with self.subTest(mode=mode):
                    result, attempts = self.enabled(root / mode, mode)
                    self.assertEqual((result.failure_code, attempts), (code, 0))

    def test_all_retryable_and_non_retryable_classifications_have_exact_attempt_counts(self):
        cases = (("disconnect", "disconnect", 2), ("rate_limit", "rate_limit", 2),
                 ("provider_5xx", "provider_5xx", 2), ("auth", "connector_unauthenticated", 1),
                 ("scope", "scope_denied", 1), ("failed", "worker_failed", 1))
        with TemporaryDirectory() as directory:
            for mode, code, count in cases:
                with self.subTest(mode=mode):
                    result, attempts = self.enabled(Path(directory) / mode, mode)
                    self.assertEqual((result.failure_code, result.provenance.attempts, attempts), (code, count, count))

    def test_timeout_overall_deadline_and_hostile_descendant_are_bounded_and_reaped(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            class TimedOutProcess:
                pid = 123
                returncode = -9
                calls = 0
                def communicate(self, timeout=None):
                    self.calls += 1
                    if self.calls == 1:
                        raise __import__("subprocess").TimeoutExpired("fake", timeout)
                    time.sleep(1.05)
                    return "", ""
            started = time.monotonic()
            with patch("adw_modules.codex_worker._commit", return_value=""), \
                 patch("adw_modules.codex_worker._preflight", return_value=(True, "fake", {"figma"})), \
                 patch("adw_modules.codex_worker.subprocess.Popen", return_value=TimedOutProcess()), \
                 patch("adw_modules.codex_worker._terminate", return_value="killed"):
                result = run(self.request(), FigmaCodexWorkerConfig(enabled=True, attempt_timeout_seconds=1, overall_deadline_seconds=1, max_attempts=2, retry_backoff_seconds=0), self.runtime(root / "deadline"), "phase", test_executable=str(self.executable(root / "deadline", "slow")))
            self.assertEqual((result.failure_code, result.provenance.attempts), ("timeout", 1))
            self.assertLess(time.monotonic() - started, 2.5)
            # A timeout remains retryable, but never exceeds the configured two attempts.
            with patch("adw_modules.codex_worker._commit", return_value=""), \
                 patch("adw_modules.codex_worker._preflight", return_value=(True, "fake", {"figma"})), \
                 patch("adw_modules.codex_worker.subprocess.Popen", side_effect=lambda *a, **k: TimedOutProcess()), \
                 patch("adw_modules.codex_worker._terminate", return_value="killed"):
                retried = run(self.request(), FigmaCodexWorkerConfig(enabled=True, attempt_timeout_seconds=1, overall_deadline_seconds=370, max_attempts=2, retry_backoff_seconds=0), self.runtime(root / "timeout-retry"), "phase", test_executable=str(self.executable(root / "timeout-retry", "slow")))
            self.assertEqual((retried.failure_code, retried.provenance.attempts), ("timeout", 2))
            # SIGTERM is ignored by both fake worker leader and its forked child; SIGKILL must clear the group.
            calls = []
            tracer = SimpleNamespace(connector_worker_start=lambda *a: calls.append(a), connector_worker_end=lambda *a: None,
                connector_worker_retry=lambda *a: None, connector_worker_tool=lambda *a: None,
                has_trusted_human_design_approval=lambda *a: True)
            hostile = self.executable(root / "hostile", "hostile")
            result = run(self.request(), FigmaCodexWorkerConfig(enabled=True, attempt_timeout_seconds=1, overall_deadline_seconds=3, max_attempts=1, retry_backoff_seconds=0), self.runtime(root / "hostile", tracer), "phase", test_executable=str(hostile))
            self.assertEqual(result.failure_code, "timeout")
            pid = calls[0][-1]
            with self.assertRaises(ProcessLookupError): os.killpg(pid, 0)

    def test_cancellation_closes_the_trace_without_converting_it_to_success(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            trace = []
            class CancelledProcess:
                pid = 123
                returncode = None
                def communicate(self, timeout=None): raise KeyboardInterrupt()
            tracer = SimpleNamespace(connector_worker_start=lambda *a: trace.append("start"), connector_worker_end=lambda *a: trace.append("end"), connector_worker_retry=lambda *a: None, connector_worker_tool=lambda *a: None,
                has_trusted_human_design_approval=lambda *a: True)
            with patch("adw_modules.codex_worker._commit", return_value=""), patch("adw_modules.codex_worker._preflight", return_value=(True, "fake", {"figma"})), patch("adw_modules.codex_worker.subprocess.Popen", return_value=CancelledProcess()), patch("adw_modules.codex_worker._terminate", return_value="killed"):
                with self.assertRaises(KeyboardInterrupt):
                    run(self.request(), FigmaCodexWorkerConfig(enabled=True), self.runtime(root, tracer), "phase", test_executable=str(self.executable(root)))
            self.assertEqual(trace, ["start", "end"])

    def test_invalid_output_tools_targets_untraced_calls_and_redaction_fail_closed(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            for mode, code in (("invalid_json", "schema_mismatch"), ("unknown_tool", "untraced_or_invalid_evidence"), ("wrong_target", "untraced_or_invalid_evidence"), ("untraced", "untraced_or_invalid_evidence")):
                with self.subTest(mode=mode):
                    result, attempts = self.enabled(root / mode, mode)
                    self.assertEqual((result.failure_code, attempts), (code, 1))
            payload = {"status":"success", "summary":"authorization=secret-value", "capture_status":"complete", "request":self.request().model_dump(), "provenance":{"adw_id":"x","phase_id":"x","request_id":"x","supervisor_session_id":"x"}}
            executable = self.executable(root / "redaction", "success", payload=payload)
            result = run(self.request(), FigmaCodexWorkerConfig(enabled=True), self.runtime(root / "redaction"), "phase", test_executable=str(executable))
            self.assertEqual(result.failure_code, "redaction_failure")

    def test_wrong_or_secret_target_never_reaches_worker_tool_trace(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            tracer = Tracer(root / "trace.db", root / "events.jsonl")
            config = FigmaCodexWorkerConfig(enabled=True, trusted_design_approvers=["reviewer"])
            tracer.human_design_approval("a", hashlib.sha256(json.dumps(self.request().target.model_dump(), sort_keys=True, separators=(",", ":")).encode()).hexdigest(), "reviewer", {"reviewer"})
            result = run(self.request(), config, self.runtime(root, tracer),
                         "phase", test_executable=str(self.executable(root, "wrong_target")))
            self.assertEqual(result.failure_code, "untraced_or_invalid_evidence")
            events = [json.loads(line) for line in (root / "events.jsonl").read_text().splitlines()]
            self.assertFalse(any(event["type"] == "worker_tool" for event in events))
            tracer.conn.close()

    def test_json_artifact_path_and_hash_limits_are_enforced(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            result, attempts = self.enabled(root, "success", max_json_bytes=1)
            self.assertEqual((result.failure_code, attempts), ("json_limit_exceeded", 1))
            result, attempts = self.enabled(root / "artifact-limit", "success", max_artifact_bytes=1)
            self.assertEqual((result.failure_code, attempts), ("artifact_limit_exceeded", 0))
            with self.assertRaises(ValueError): CodexArtifact(path="../escape.json", media_type="application/json", byte_count=1, sha256="x")
            # Result artifacts are code-owned, one only, handoff-relative, and hash their exact bytes.
            result, _ = self.enabled(root / "hash", "success")
            artifact = next(item for item in result.evidence_manifest if item.path.endswith("evidence.json"))
            data = (root / "hash" / "handoff" / artifact.path).read_bytes()
            self.assertEqual(artifact.sha256, hashlib.sha256(data).hexdigest())
            request_artifact = next(item for item in result.evidence_manifest if item.path.endswith("request.json"))
            self.assertEqual(CodexFigmaRequest.model_validate_json((root / "hash" / "handoff" / request_artifact.path).read_bytes()), self.request())
            # A repeat request is rejected rather than reusing stale evidence.
            executable = self.executable(root / "hash", "success")
            repeat = run(self.request(), FigmaCodexWorkerConfig(enabled=True), self.runtime(root / "hash"), "phase", test_executable=str(executable))
            self.assertEqual(repeat.failure_code, "request_directory_exists")
