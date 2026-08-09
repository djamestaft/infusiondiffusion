"""Cooperative Pi process guard: only the deterministic worker may use Codex."""
from __future__ import annotations
import os
import re
import shlex
import signal
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path

CODEX = re.compile(r"(?:[/\\]?(?:[^/\\]+[/\\])*)?codex", re.I)
PYTHON_EXECUTION = re.compile(
    r"\b(?:os\.(?:system|popen|exec\w*|spawn\w*)|subprocess\.\w+)\s*\(\s*"
    r"(?:\[\s*)?['\"](?P<command>[^'\"]+)",
    re.I,
)
NODE_EXECUTION = re.compile(
    r"\b(?:\w+\.)?(?:exec|execsync|execfile|execfilesync|spawn|spawnsync)\s*\(\s*"
    r"['\"](?P<command>[^'\"]+)",
    re.I,
)
# Static denial is intentionally conservative for interpreter payloads: when an
# execution API and a Codex/discovery token coexist, dynamic construction cannot
# be proven safe and must not reach a Pi child process.
EXECUTION_API = re.compile(r"\b(?:subprocess|os\.(?:system|popen|exec|spawn)|child_process|execFile|exec|spawn)\b", re.I)
CODEX_DISCOVERY = re.compile(r"\bcodex\b|command\s+-v\s+codex|which\s+codex", re.I)
SHELLS = frozenset(("sh", "bash", "zsh", "fish"))
PYTHONS = frozenset(("python", "python3"))
NODES = frozenset(("node", "nodejs"))
PROTECTED_WORKER_MODULES = frozenset(("adw_modules.codex_worker",))
CONTROL_OPERATORS = frozenset((";", "&&", "||", "|", "&"))
# Shell grammar words are boundaries, not executable command names.
SHELL_KEYWORDS = frozenset(("if", "then", "elif", "else", "fi", "do", "done", "while", "until", "for", "case", "esac", "{" , "}"))
COMMAND_WRAPPERS = frozenset(("time", "xargs", "env", "command", "exec", "nice", "nohup"))
RUN_WRAPPERS = frozenset(("uv", "poetry", "pipx"))


@dataclass(frozen=True)
class TerminationOutcome:
    """Sanitized termination facts; only ESRCH proves a process group is gone."""
    status: str
    group_proven_gone: bool
    permission_denied: bool
    child_reaped: bool


def _is_codex_executable(token: str) -> bool:
    """Return whether one shell token names the protected executable."""
    return bool(CODEX.fullmatch(token))


def _executable_name(token: str) -> str:
    return re.split(r"[/\\]", token)[-1].lower()


def _command_tokens(command: str) -> list[str] | None:
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=";|&")
        lexer.whitespace_split = True
        lexer.commenters = ""
        return list(lexer)
    except ValueError:
        return None


def _code_executes_codex(code: str, pattern: re.Pattern[str]) -> bool:
    if EXECUTION_API.search(code) and CODEX_DISCOVERY.search(code):
        return True
    return any(_is_codex_executable(match.group("command").split()[0])
               for match in pattern.finditer(code))


def _wrapper_executes_codex(executable: str, arguments: list[str]) -> bool:
    """Inspect only executable payloads, never incidental wrapper arguments."""
    code_flags = ("-e", "--eval") if executable in NODES else ("-c", "--command")
    try:
        flag_index = next(index for index, argument in enumerate(arguments)
                          if argument in code_flags or (executable in SHELLS
                                                        and argument.startswith("-")
                                                        and argument.endswith("c")))
        code = arguments[flag_index + 1]
    except (StopIteration, IndexError):
        return False
    if executable in SHELLS:
        # Command substitution and variable expansion are not statically
        # resolvable; a protected/discovered name in executable shell payload is
        # denied rather than guessed safe.
        return bool(CODEX_DISCOVERY.search(code)) or _tokens_execute_codex(_command_tokens(code) or [])
    if executable in PYTHONS:
        return _code_executes_codex(code, PYTHON_EXECUTION)
    if executable in NODES:
        return _code_executes_codex(code, NODE_EXECUTION)
    return False


def _python_module(arguments: list[str]) -> str | None:
    """Return the module selected by a Python interpreter's leading ``-m``."""
    for index, argument in enumerate(arguments):
        if argument == "-m":
            return arguments[index + 1] if index + 1 < len(arguments) else ""
        if argument in {"-c", "--command", "-"} or not argument.startswith("-"):
            return None
    return None


def _tokens_execute_codex(tokens: list[str]) -> bool:
    """Find executable command words across shell command boundaries."""
    index = 0
    expects_command = True
    while index < len(tokens):
        token = tokens[index]
        if token in CONTROL_OPERATORS or token in SHELL_KEYWORDS:
            expects_command = True
            index += 1
            continue
        if not expects_command:
            index += 1
            continue
        if "=" in token and token.split("=", 1)[0].isidentifier():
            index += 1
            continue
        if token in COMMAND_WRAPPERS:
            index += 1
            while index < len(tokens) and tokens[index].startswith("-"):
                index += 1
            expects_command = True
            continue
        if token in RUN_WRAPPERS:
            index += 1
            if index < len(tokens) and tokens[index] == "run":
                index += 1
                while index < len(tokens) and tokens[index].startswith("-"):
                    index += 1
                expects_command = True
            continue
        if token == "env":
            index += 1
            while index < len(tokens) and (tokens[index].startswith("-") or "=" in tokens[index]):
                index += 1
            continue
        if _is_codex_executable(token):
            return True
        executable = _executable_name(token)
        if executable in SHELLS | PYTHONS | NODES:
            end = index + 1
            while end < len(tokens) and tokens[end] not in CONTROL_OPERATORS:
                end += 1
            if _wrapper_executes_codex(executable, tokens[index + 1:end]):
                return True
        expects_command = False
        index += 1
    return False


def denies_codex(command: str, cwd: str | Path | None = None) -> bool:
    """Deny actual Codex execution, including direct and sourced local scripts."""
    tokens = _command_tokens(command)
    if tokens is None:
        return bool(re.search(r"(?:^|[;|&]\s*)(?:[^\s]+[/\\])?codex(?:\s|$)", command, re.I))
    if _tokens_execute_codex(tokens):
        return True
    if not tokens:
        return False
    executable = _executable_name(tokens[0])
    # `python - <<'PY' ...` executes source from stdin. The dash and heredoc
    # operator are not script paths, so inspect the body as code instead of
    # failing closed on a fictitious file named `<<`.
    if executable in PYTHONS and len(tokens) > 1 and tokens[1] == "-":
        body = command.split("\n", 1)[1] if "\n" in command else ""
        return _code_executes_codex(body, PYTHON_EXECUTION)
    if executable in PYTHONS:
        module = _python_module(tokens[1:])
        if module is not None:
            return module in PROTECTED_WORKER_MODULES
    if not cwd:
        return False
    # `./generated.sh`, `source generated.sh`, and `. generated.sh` do not put
    # Codex in the outer command word; a literal local script is therefore a
    # command payload and unreadable/dynamic paths fail closed.
    is_source = tokens[0] in {"source", "."}
    is_shell = executable in SHELLS
    if is_source or is_shell or executable in PYTHONS | NODES or tokens[0].startswith(("./", ".\\")):
        paths = [token for token in tokens[1:] if not token.startswith("-")]
        if is_source or is_shell:
            paths = paths[:1]
        elif executable in PYTHONS | NODES:
            # The first non-option script path is static; dynamic/eval payloads
            # were already inspected above, while a missing source fails closed.
            paths = paths[:1]
        else:
            paths = tokens[:1]
        if paths:
            script = (Path(cwd) / paths[0]).resolve()
            try:
                source = script.read_text()
                return bool(CODEX_DISCOVERY.search(source) and (is_source or is_shell or EXECUTION_API.search(source))) or _tokens_execute_codex(_command_tokens(source) or [])
            except OSError:
                return True
    return False


def deny_shim(directory: Path) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    shim = directory / "codex"
    shim.write_text("#!/bin/sh\necho nested_process_denied >&2\nexit 126\n")
    shim.chmod(0o700)
    return directory


def pi_environment(shim_dir: Path) -> dict[str, str]:
    env = os.environ.copy()
    env["PATH"] = f"{shim_dir}{os.pathsep}{env.get('PATH', '')}"
    return env


def _wait_for_group(pid: int, deadline: float) -> tuple[bool, bool]:
    """Return (gone, permission_denied), without ever treating EPERM as gone."""
    permission_denied = False
    while True:
        try:
            os.killpg(pid, 0)
        except ProcessLookupError:
            return True, permission_denied
        except PermissionError:
            permission_denied = True
        if time.monotonic() >= deadline:
            return False, permission_denied
        time.sleep(.05)


def _reap_known_child(process: subprocess.Popen, deadline: float) -> bool:
    """Best-effort direct fallback, bounded even for hostile child implementations."""
    terminate = getattr(process, "terminate", None)
    kill = getattr(process, "kill", None)
    wait = getattr(process, "wait", None)
    if not callable(wait):
        return False
    if callable(terminate):
        try:
            terminate()
        except (ProcessLookupError, PermissionError, OSError):
            pass
    remaining = max(0.0, deadline - time.monotonic())
    try:
        wait(timeout=remaining / 2)
        return True
    except (subprocess.TimeoutExpired, TimeoutError):
        pass
    except (ProcessLookupError, PermissionError, OSError):
        return False
    if callable(kill):
        try:
            kill()
        except (ProcessLookupError, PermissionError, OSError):
            pass
    try:
        wait(timeout=max(0.0, deadline - time.monotonic()))
        return True
    except (subprocess.TimeoutExpired, TimeoutError, ProcessLookupError, PermissionError, OSError):
        return False


def terminate_process_group(process: subprocess.Popen, deadline_seconds: float = 5) -> TerminationOutcome:
    """Fail closed: only ESRCH proves a group is gone; otherwise reap its known child."""
    deadline = time.monotonic() + max(0, deadline_seconds)
    permission_denied = False
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        return TerminationOutcome("group_gone", True, False, _reap_known_child(process, deadline))
    except PermissionError:
        permission_denied = True

    gone, denied = _wait_for_group(process.pid, deadline)
    permission_denied |= denied
    if not gone:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            gone = True
        except PermissionError:
            permission_denied = True
        if not gone:
            gone, denied = _wait_for_group(process.pid, deadline)
            permission_denied |= denied

    child_reaped = _reap_known_child(process, deadline)
    if gone:
        return TerminationOutcome("group_gone", True, permission_denied, child_reaped)
    return TerminationOutcome(
        "group_permission_denied" if permission_denied else "group_unconfirmed",
        False, permission_denied, child_reaped,
    )
