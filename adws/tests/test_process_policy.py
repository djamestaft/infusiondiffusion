import os
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import Mock, call, patch
from adw_modules import agent_pi
from adw_modules.data_types import PiRequest
from adw_modules.tracer import Tracer
from adw_modules.process_policy import (denies_codex, deny_shim, pi_environment,
                                        terminate_process_group)

class ProcessPolicyTest(TestCase):
    def test_denies_bare_and_path_qualified_executables(self):
        for command in ("codex exec", "./codex exec", "/opt/bin/codex exec"):
            self.assertTrue(denies_codex(command), command)

    def test_denies_shell_python_and_node_indirection(self):
        for command in (
            "bash -c 'codex exec'",
            "bash -c 'if true; then /opt/bin/codex exec; fi'",
            "sh -c 'cd /tmp && /opt/bin/codex exec'",
            "python -c 'import os; os.system(\"codex\")'",
            "python3 -c 'import subprocess; subprocess.run([\"/opt/bin/codex\"])'",
            "node -e 'require(\"child_process\").exec(\"codex\")'",
            "node -e 'require(\"child_process\").spawn(\"/opt/bin/codex\")'",
            "bash -c '$(command -v codex) exec'",
            "python -c 'import subprocess; subprocess.run([\"env\", \"codex\", \"exec\"])'",
            "python -c 'import subprocess; subprocess.run([\"$(command -v codex)\", \"exec\"])'",
            "node -e 'require(\"child_process\").execFile(\"/opt/bin/codex\", [\"exec\"])'",
        ):
            self.assertTrue(denies_codex(command), command)

    def test_denies_common_wrappers_and_control_indirection(self):
        for command in ("time codex exec", "xargs codex", "uv run codex exec", "command -- codex exec", "true && codex exec"):
            self.assertTrue(denies_codex(command), command)

    def test_denies_generated_local_shell_script(self):
        with TemporaryDirectory() as directory:
            script = Path(directory) / "generated.sh"
            script.write_text("if true; then /opt/bin/codex exec; fi\n")
            for command in ("bash generated.sh", "./generated.sh", "source generated.sh", ". generated.sh"):
                self.assertTrue(denies_codex(command, directory), command)

    def test_allows_read_only_references_and_wrapper_arguments(self):
        for command in (
            "git diff -- adws/adw_modules/codex_worker.py",
            "grep -R Codex docs",
            "python scripts/review.py adws/adw_modules/codex_worker.py",
            "node scripts/review.js codex_worker.py",
            "bash scripts/review.sh codex_worker.py",
        ):
            self.assertFalse(denies_codex(command), command)

    def test_parses_python_module_execution_without_treating_modules_as_scripts(self):
        with TemporaryDirectory() as directory:
            self.assertFalse(denies_codex("python3 -m unittest", directory))
        self.assertTrue(denies_codex("python3 -m adw_modules.codex_worker"))

    def test_python_stdin_source_distinguishes_edits_from_process_launches(self):
        with TemporaryDirectory() as directory:
            safe_edit = "python - <<'PY'\nfrom pathlib import Path\nPath('x').write_text('codex_worker.run')\nPY"
            unsafe_launch = "python - <<'PY'\nimport subprocess\nsubprocess.run(['/opt/bin/codex', 'exec'])\nPY"
            self.assertFalse(denies_codex(safe_edit, directory))
            self.assertTrue(denies_codex(unsafe_launch, directory))

    def test_allows_unrelated_command(self):
        self.assertFalse(denies_codex("git status"))

    def test_pi_environment_resolves_deny_shim_before_operator_path(self):
        with TemporaryDirectory() as directory:
            shim = deny_shim(Path(directory))
            self.assertTrue((shim / "codex").is_file())
            self.assertEqual(Path(pi_environment(shim)["PATH"].split(os.pathsep)[0]), shim)

    def test_process_group_esrch_is_confirmed_gone_without_kill_escalation(self):
        process = SimpleNamespace(pid=1234)
        with patch("adw_modules.process_policy.os.killpg",
                   side_effect=[None, ProcessLookupError(), ProcessLookupError()]) as killpg:
            terminate_process_group(process)
        self.assertEqual(killpg.call_args_list, [
            call(process.pid, __import__("signal").SIGTERM),
            call(process.pid, 0),
        ])

    def test_process_group_sigkill_eperm_is_incomplete_and_uses_direct_fallback(self):
        process = Mock(pid=1234)
        process.wait.side_effect = [subprocess.TimeoutExpired("pi", 0), 0]
        with patch("adw_modules.process_policy.os.killpg", side_effect=[
                None, PermissionError(), PermissionError(), PermissionError(),
        ]) as killpg, patch("time.monotonic", side_effect=[0, 6, 7, 8, 9]):
            outcome = terminate_process_group(process)
        self.assertEqual(killpg.call_args_list, [
            call(process.pid, __import__("signal").SIGTERM),
            call(process.pid, 0),
            call(process.pid, __import__("signal").SIGKILL),
            call(process.pid, 0),
        ])
        process.terminate.assert_called_once_with()
        process.kill.assert_called_once_with()
        self.assertEqual(process.wait.call_count, 2)
        self.assertEqual(outcome.status, "group_permission_denied")
        self.assertFalse(outcome.group_proven_gone)
        self.assertTrue(outcome.permission_denied)
        self.assertTrue(outcome.child_reaped)

    def test_fake_pi_tool_stream_denials_terminate_and_trace_every_command_shape(self):
        # This invokes a local fake Pi program, never a Codex-named fixture or
        # connector. It emits a tool event then waits so group termination is
        # observable through the exit callback.
        for command in ("codex exec", "/tmp/codex exec", "bash -c 'codex exec'"):
            with self.subTest(command=command), TemporaryDirectory() as directory:
                root = Path(directory)
                fake_pi = root / "fake_pi"
                fake_pi.write_text("#!/usr/bin/env python3\nimport json,time\n"
                                   f"print(json.dumps({{'type':'tool_execution_start','args':{{'command':{command!r}}}}}), flush=True)\n"
                                   "time.sleep(30)\n")
                fake_pi.chmod(0o700)
                events, spawned, exited = [], [], []
                request = PiRequest(prompt="x", system_prompt="x", model="fake/model",
                    session_id="session", session_dir=str(root / "sessions"),
                    raw_output_path=str(root / "stream.jsonl"), cwd=str(root))
                with patch.object(agent_pi, "PI_PATH", str(fake_pi)), \
                     patch.object(agent_pi, "resolve_model", return_value=("fake", "model")), \
                     patch.object(agent_pi, "context_window", return_value=0):
                    with self.assertRaisesRegex(RuntimeError, "nested_process_denied"):
                        agent_pi.run(request, on_event=events.append,
                                      on_spawn=spawned.append, on_exit=exited.append)
                self.assertEqual([event["type"] for event in events], ["nested_process_denied"])
                self.assertEqual(spawned, exited)
                self.assertTrue((root / "stream.jsonl").is_file())

    def test_fake_pi_correction_turn_closes_a_real_process_trace(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            fake_pi = root / "fake_pi"
            fake_pi.write_text("#!/usr/bin/env python3\nimport json\n"
                "print(json.dumps({'type':'message_end','message':{'role':'assistant','content':[{'type':'text','text':'correcting'}],'usage':{'totalTokens':3}}}), flush=True)\n"
                "print(json.dumps({'type':'tool_execution_start','args':{'command':\"bash -c 'codex exec'\"}}), flush=True)\n")
            fake_pi.chmod(0o700)
            tracer = Tracer(root / "trace.db", root / "events.jsonl")
            request = PiRequest(prompt="x", system_prompt="x", model="fake/model", session_id="session",
                session_dir=str(root / "sessions"), raw_output_path=str(root / "stream.jsonl"), cwd=str(root))
            events = []
            with patch.object(agent_pi, "PI_PATH", str(fake_pi)), \
                 patch.object(agent_pi, "resolve_model", return_value=("fake", "model")), \
                 patch.object(agent_pi, "context_window", return_value=0):
                with self.assertRaisesRegex(RuntimeError, "nested_process_denied"):
                    agent_pi.run(request, on_event=events.append,
                        on_spawn=lambda pid: tracer.process_start("pi", "agent", "fake", pid, "fake_pi"),
                        on_exit=lambda pid: tracer.process_end("pi", pid))
            rows = tracer.conn.execute("SELECT ended_at FROM processes WHERE adw_id='pi'").fetchall()
            self.assertEqual(len(rows), 1)
            self.assertTrue(rows[0][0])
            self.assertEqual([event["type"] for event in events], ["message_end", "nested_process_denied"])
            tracer.conn.close()

    def test_sanctioned_worker_path_is_not_a_pi_child(self):
        # The worker policy is tested with a harmless local executable, while Pi's
        # deny shim remains scoped to Pi. No Codex program or connector is launched.
        with TemporaryDirectory() as directory:
            root = Path(directory)
            shim = deny_shim(root / "shim")
            self.assertNotEqual(os.environ.get("PATH", "").split(os.pathsep)[0], str(shim))
            self.assertTrue((shim / "codex").is_file())
            self.assertFalse(denies_codex("fake_worker exec --ephemeral"))
            worker = root / "fake_worker"
            marker = root / "worker-path"
            worker.write_text("#!/bin/sh\nprintf %s \"$PATH\" > \"$1\"\n")
            worker.chmod(0o700)
            subprocess.run([str(worker), str(marker)], check=True)
            self.assertNotEqual(marker.read_text().split(os.pathsep)[0], str(shim))
