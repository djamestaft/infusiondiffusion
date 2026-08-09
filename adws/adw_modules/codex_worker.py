"""Bounded official-Codex Figma evidence worker; raw provider data is memory-only.

Compatibility is pinned to @openai/codex 0.147.0:
https://github.com/openai/codex/blob/266c6920d9b82fe4d68959529565256b12a9be99/codex-rs/exec/src/exec_events.rs
and https://github.com/openai/codex/blob/420accf199e10bc908837ce5c7609b3bb9a38c8d/codex-rs/cli/src/mcp_cmd.rs
(with its cli/tests/mcp_list.rs fixture). New shapes fail closed.
"""
from __future__ import annotations
import hashlib, json, os, signal, subprocess, tempfile, time, re
from pathlib import Path
from typing import Any
from .data_types import (CodexArtifact, CodexCallStamp, CodexFigmaOutput, CodexFigmaRequest,
    CodexWorkerProvenance, FigmaCodexWorkerConfig, FIGMA_OFFICIAL_ENDPOINT)
from .utils import now_iso

SUPPORTED_CODEX_VERSION = "0.147.0"
# Canonical source revisions and event fixtures reviewed for this exact CLI.
# Updating either is a compatibility change, never a permissive semver upgrade.
CANONICAL_CLI_PROVENANCE = {
 "version": SUPPORTED_CODEX_VERSION,
 "exec_events_commit": "266c6920d9b82fe4d68959529565256b12a9be99",
 "mcp_commit": "420accf199e10bc908837ce5c7609b3bb9a38c8d",
}
RETRYABLE = {"timeout", "disconnect", "rate_limit", "provider_5xx"}
ALLOWED_OPERATIONS = {"node_metadata", "node_context", "variables", "styles", "screenshot"}
TOOL_OPERATION = {"get_metadata":"node_metadata", "node_metadata":"node_metadata",
 "get_design_context":"node_context", "node_context":"node_context", "get_variable_defs":"variables",
 "variables":"variables", "get_styles":"styles", "styles":"styles", "get_screenshot":"screenshot", "screenshot":"screenshot"}
# These exact official connector names form the pre-execution capability
# boundary; returned events are validation evidence, not the first control.
OPERATION_TOOL = {"node_metadata": "get_metadata", "node_context": "get_design_context",
                  "variables": "get_variable_defs", "styles": "get_design_context",
                  "screenshot": "get_screenshot"}
READ_ONLY_TOOLS = frozenset(OPERATION_TOOL.values())
SECRET = re.compile(r"(?i)(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_-]?key|token|secret|password|authorization)\s*[:=]\s*\S+|bearer\s+\S+|sk-[A-Za-z0-9_-]{8,})")


def _hash(value: object) -> str:
 return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()

def _safe_env() -> dict[str,str]:
 denied=("SHOPIFY","SANITY","VERCEL","GITHUB","DEPLOY","WEBHOOK","TOKEN","SECRET","KEY")
 keep={"PATH","HOME","USER","LOGNAME","SHELL","TMPDIR","LANG","LC_ALL","XDG_CONFIG_HOME","XDG_DATA_HOME"}
 return {k:v for k,v in os.environ.items() if k in keep and not any(x in k.upper() for x in denied)}

def _failure(code, request, provenance):
 return CodexFigmaOutput(status="success", summary=f"Figma capture {code}", capture_status="failed" if code in RETRYABLE else "blocked", failure_code=code, failure_message=f"connector worker stopped at {code}", request=request, provenance=provenance)

def _classify(text: str) -> str:
 value=text.lower()
 if "auth" in value: return "connector_unauthenticated"
 if "scope" in value or "permission" in value: return "scope_denied"
 if "rate" in value: return "rate_limit"
 if "disconnect" in value: return "disconnect"
 if "provider" in value and "5" in value: return "provider_5xx"
 return "worker_failed"

def _terminate(process: subprocess.Popen, deadline: float) -> str:
 """Escalate the process group five seconds after TERM (fixed at TERM time)."""
 def alive() -> bool:
  try: os.killpg(process.pid, 0); return True
  except ProcessLookupError: return False
  except PermissionError: return True
 term_deadline = min(deadline, time.monotonic() + 5.0)
 try: os.killpg(process.pid, signal.SIGTERM)
 except (ProcessLookupError, PermissionError): pass
 while alive() and time.monotonic() < term_deadline: time.sleep(.05)
 if alive():
  try: os.killpg(process.pid, signal.SIGKILL)
  except (ProcessLookupError, PermissionError): pass
  while alive() and time.monotonic() < deadline: time.sleep(.05)
 return "killed" if not alive() else "kill_unconfirmed"

def _servers(payload: Any) -> dict[str, dict[str, Any]] | None:
 """Parse the pinned Codex 0.147 `mcp list --json` array, never aliases."""
 if not isinstance(payload, list): return None
 result: dict[str, dict[str, Any]] = {}
 required = {"name", "enabled", "disabled_reason", "transport", "startup_timeout_sec", "tool_timeout_sec", "auth_status"}
 for entry in payload:
  if not isinstance(entry, dict) or set(entry) != required or not isinstance(entry.get("name"), str): return None
  transport = entry["transport"]
  if not isinstance(transport, dict) or set(transport) != {"type", "url", "bearer_token_env_var", "http_headers", "env_http_headers"}: return None
  if (not isinstance(entry["enabled"], bool) or not isinstance(entry["disabled_reason"], (str, type(None)))
      or not isinstance(entry["startup_timeout_sec"], (int, float)) or not isinstance(entry["tool_timeout_sec"], (int, float))
      or transport.get("type") != "streamable_http" or not isinstance(transport.get("url"), str)
      or entry["name"] in result): return None
  result[entry["name"]] = entry
 return result

def _sanitized_version(stdout: str) -> str | None:
 """Keep only the version identity; reject arbitrary CLI output and secrets."""
 value = stdout.strip()
 if len(value) > 128 or SECRET.search(value): return None
 return value if re.fullmatch(r"codex(?:-cli)?\s+v?" + re.escape(SUPPORTED_CODEX_VERSION), value) else None

def _preflight_command(command: list[str]) -> subprocess.CompletedProcess[str]:
 """Run a preflight probe in its own group and always reap descendants."""
 process = subprocess.Popen(command, env=_safe_env(), stdin=subprocess.DEVNULL,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
                            start_new_session=True)
 try:
  stdout, stderr = process.communicate(timeout=20)
 except subprocess.TimeoutExpired:
  _terminate(process, time.monotonic() + 5.0)
  try: stdout, stderr = process.communicate(timeout=.1)
  except subprocess.TimeoutExpired: stdout, stderr = "", ""
  raise
 except BaseException:
  _terminate(process, time.monotonic() + 5.0)
  raise
 return subprocess.CompletedProcess(command, process.returncode, stdout, stderr)

def _preflight(executable: str, enabled_tools: frozenset[str]) -> tuple[bool,str,set[str]]:
 """Prove the configured connector exposes only this request's safe tools."""
 try:
  listed=_preflight_command([executable,"mcp","list","--json"])
  servers=_servers(json.loads(listed.stdout)) if not listed.returncode else None
  figma = servers.get("figma") if servers else None
  if not figma or figma["enabled"] is not True or figma["transport"]["url"] != FIGMA_OFFICIAL_ENDPOINT: return False,"connector_invalid_config",set()
  detail=_preflight_command([executable,"mcp","get","figma","--json"])
  get_required = {"name", "enabled", "disabled_reason", "transport", "enabled_tools", "disabled_tools", "startup_timeout_sec", "tool_timeout_sec"}
  parsed = json.loads(detail.stdout) if not detail.returncode else None
  configured_tools = parsed.get("enabled_tools") if isinstance(parsed, dict) else None
  disabled_tools = parsed.get("disabled_tools") if isinstance(parsed, dict) else None
  if (not isinstance(parsed, dict) or set(parsed) != get_required or parsed.get("name") != "figma"
      or parsed.get("enabled") is not True or parsed.get("transport") != figma["transport"]
      or not isinstance(configured_tools, list) or not isinstance(disabled_tools, list)
      or any(not isinstance(tool, str) for tool in configured_tools + disabled_tools)
      or len(set(configured_tools)) != len(configured_tools)
      # Exact equality rejects default/broadened, modifying, and unknown tools
      # before the remote connector receives an exec request.
      or set(configured_tools) != enabled_tools or not enabled_tools
      or not enabled_tools.issubset(READ_ONLY_TOOLS)):
   return False,"connector_invalid_config",set()
  version=_preflight_command([executable,"--version"])
  sanitized = _sanitized_version(version.stdout) if not version.returncode else None
  return (True, sanitized, set(servers)) if sanitized else (False, "connector_unavailable", set())
 except (OSError,subprocess.TimeoutExpired,json.JSONDecodeError,TypeError): return False,"connector_unavailable",set()

# Official `codex exec --json` forms supported by this worker.  This is a
# deliberately small compatibility boundary: new CLI events fail closed until
# reviewed, rather than becoming untraced capability.
_NON_TOOL_EVENTS = frozenset(("thread.started", "turn.started", "turn.completed", "turn.failed"))
_NON_TOOL_ITEMS = frozenset(("agent_message", "reasoning"))

def _official_items(raw_jsonl: str) -> list[dict[str, Any]] | None:
 """Accept only reviewed 0.147 terminal events; every other item fails closed."""
 items=[]
 for line in raw_jsonl.splitlines():
  try: event=json.loads(line)
  except json.JSONDecodeError: return None
  if not isinstance(event, dict) or not isinstance(event.get("type"), str): return None
  if event["type"] in _NON_TOOL_EVENTS:
   # Thread/turn metadata is intentionally ignored but no unknown event family is.
   continue
  if event["type"] == "item.started":
   item=event.get("item")
   required={"type", "id", "server", "tool", "arguments", "result", "error", "status"}
   if (set(event) != {"type", "item"} or not isinstance(item, dict) or set(item) != required
       or item.get("type") != "mcp_tool_call" or item.get("server") != "figma"
       or item.get("status") != "in_progress" or item.get("result") is not None
       or item.get("error") is not None): return None
   continue
  if event["type"] != "item.completed" or set(event) != {"type", "item"}: return None
  item=event.get("item")
  if not isinstance(item, dict) or not isinstance(item.get("type"), str): return None
  kind=item["type"]
  if kind in _NON_TOOL_ITEMS:
   items.append(item); continue
  # item.started/item.updated, command, web, file, error, and new capability
  # families cannot be silently untraced.
  if kind != "mcp_tool_call": return None
  required={"type", "id", "server", "tool", "arguments", "result", "error", "status"}
  if set(item) != required or item.get("server") != "figma" or item.get("status") != "completed" or not isinstance(item.get("id"), str) or not isinstance(item.get("tool"), str): return None
  result=item.get("result")
  if not isinstance(result, dict) or not {"content", "structured_content"}.issubset(result) or set(result) - {"content", "_meta", "structured_content"}: return None
  args=item.get("arguments")
  if isinstance(args, str):
   try: args=json.loads(args)
   except json.JSONDecodeError: return None
  if not isinstance(args, dict): return None
  item={**item, "arguments": args}
  items.append(item)
 return items

def _tool_stamps(raw_jsonl: str) -> list[CodexCallStamp] | None:
 """Accept only completed official Figma MCP calls with exact safe arguments."""
 items=_official_items(raw_jsonl)
 if items is None: return None
 stamps=[]
 for item in items:
  if item["type"] != "mcp_tool_call": continue
  tool=item["tool"].removeprefix("figma.")
  operation=TOOL_OPERATION.get(tool)
  args=item["arguments"]
  canonical_tool=OPERATION_TOOL.get(operation)
  allowed={
   "get_metadata": {"file_key", "node_id", "fileKey", "nodeId"},
   "get_variable_defs": {"file_key", "node_id", "fileKey", "nodeId"},
   "get_design_context": {"file_key", "node_id", "fileKey", "nodeId", "clientFrameworks",
                          "clientLanguages", "disableCodeConnect", "excludeScreenshot", "forceCode", "skillNames"},
   "get_screenshot": {"file_key", "node_id", "fileKey", "nodeId", "contentsOnly",
                      "enableBase64Response", "maxDimension"},
  }.get(canonical_tool)
  if operation is None or allowed is None or not set(args).issubset(allowed): return None
  file_key=args.get("file_key", args.get("fileKey"))
  nodes=args.get("node_ids", args.get("node_id", args.get("nodeIds", args.get("nodeId"))))
  if isinstance(nodes, str): nodes=[nodes]
  if not isinstance(file_key, str) or not isinstance(nodes, list): return None
  for key in ("clientFrameworks", "clientLanguages", "skillNames"):
   if key in args and (not isinstance(args[key], str) or len(args[key]) > 256): return None
  for key in ("disableCodeConnect", "excludeScreenshot", "forceCode", "contentsOnly", "enableBase64Response"):
   if key in args and not isinstance(args[key], bool): return None
  if "maxDimension" in args and (not isinstance(args["maxDimension"], int)
                                  or not 1 <= args["maxDimension"] <= 65536): return None
  try: stamps.append(CodexCallStamp(operation=operation, file_key=file_key, node_ids=nodes))
  except ValueError: return None
 return stamps

def _stamps_match_request(stamps: list[CodexCallStamp], request: CodexFigmaRequest) -> bool:
 expected_nodes=set(request.target.node_ids)
 if not stamps or any(stamp.file_key != request.target.file_key or not set(stamp.node_ids)
                      or not set(stamp.node_ids).issubset(expected_nodes) for stamp in stamps): return False
 for operation in request.operations:
  evidence_operation="node_context" if operation == "styles" else operation
  observed={node for stamp in stamps if stamp.operation == evidence_operation for node in stamp.node_ids}
  if observed != expected_nodes: return False
 return True

def _approval_labels(raw_jsonl: str, request: CodexFigmaRequest) -> dict[str, str] | None:
 items=_official_items(raw_jsonl)
 if items is None: return None
 labels: dict[str, str] = {}
 for item in items:
  if item["type"] != "mcp_tool_call" or TOOL_OPERATION.get(item["tool"].removeprefix("figma.")) != "node_metadata": continue
  for node in request.target.node_ids:
   labels[node]="Approved"
 return labels if len(labels) == len(request.target.node_ids) else None

def _redact(value: Any) -> Any:
 """Deterministic all-field scan: a matching string fails rather than masking ambiguity."""
 if isinstance(value,str):
  if SECRET.search(value): raise ValueError("redaction_failure")
  return value
 if isinstance(value,list): return [_redact(item) for item in value]
 if isinstance(value,dict): return {str(k):_redact(v) for k,v in value.items()}
 if value is None or isinstance(value,(bool,int,float)): return value
 raise ValueError("redaction_failure")

def _write(path: Path, value: Any) -> None:
 path.write_text(json.dumps(value,sort_keys=True,indent=2)+"\n")

def _commit(run):
 try:
  p=subprocess.run(["git","rev-parse","HEAD"],cwd=str(run.repo_root),env=_safe_env(),capture_output=True,text=True,timeout=10)
  return p.stdout.strip() if not p.returncode else ""
 except (OSError,subprocess.TimeoutExpired): return ""

def _result_hash(result): return _hash({"request":result.request.model_dump(),"calls":[x.model_dump() for x in result.call_stamps],"provenance":result.provenance.model_dump(),"artifacts":[x.model_dump() for x in result.evidence_manifest]})

def _strict_schema(value: Any) -> Any:
 """Return Codex-compatible strict JSON Schema without changing validation."""
 if isinstance(value, list):
  return [_strict_schema(item) for item in value]
 if not isinstance(value, dict):
  return value
 result = {key: _strict_schema(item) for key, item in value.items()}
 if result.get("type") == "object" or "properties" in result:
  properties = result.get("properties", {})
  result["additionalProperties"] = False
  result["required"] = list(properties)
 return result

def _output_schema(request: CodexFigmaRequest) -> dict[str, Any]:
 schema = _strict_schema(CodexFigmaOutput.model_json_schema())
 labels = schema["properties"]["approval_labels"]
 labels["properties"] = {node_id: {"type": "string"} for node_id in request.target.node_ids}
 labels["required"] = list(request.target.node_ids)
 return schema

def run(request: CodexFigmaRequest, config: FigmaCodexWorkerConfig, run, phase_id: str, *, test_executable: str | None = None) -> CodexFigmaOutput:
 """Only ``test_executable`` is injectable, and it is a test seam, not config."""
 started=time.monotonic(); p=CodexWorkerProvenance(adw_id=run.adw_id,phase_id=phase_id,request_id=request.request_id,supervisor_session_id=request.supervisor_session_id,repository_commit=_commit(run),started_at=now_iso(),target_hash=_hash(request.target.model_dump()),timeout_seconds=config.attempt_timeout_seconds,overall_deadline_seconds=config.overall_deadline_seconds,endpoint_identity=FIGMA_OFFICIAL_ENDPOINT)
 if not config.enabled: p.ended_at=now_iso();p.termination_outcome="disabled";return _failure("worker_disabled",request,p)
 # Authorization is a deterministic, separately recorded human action.  It
 # must predate every connector probe: neither a CLI argument nor Pi output can
 # manufacture approval immediately before a worker is launched.
 approved = getattr(run.tracer, "has_trusted_human_design_approval", None)
 if not callable(approved) or not approved(run.adw_id, p.target_hash, set(config.trusted_design_approvers)):
  p.ended_at=now_iso();p.termination_outcome="authorization_denied";return _failure("missing_trusted_approval",request,p)
 executable=test_executable or "codex"
 enabled_tools = frozenset(OPERATION_TOOL[operation] for operation in request.operations)
 ok, detail, servers=_preflight(executable, enabled_tools)
 if not ok: p.ended_at=now_iso();p.termination_outcome="preflight_failed";return _failure(detail,request,p)
 p.cli_version=detail
 root=(Path(run.context_handoff_dir).resolve()/"figma"/request.request_id)
 if root.exists(): p.ended_at=now_iso();p.termination_outcome="policy_denied";return _failure("request_directory_exists",request,p)
 root.mkdir(parents=True)
 # Code persists the typed, redacted request before execution; provider output
 # never determines this artifact or its digest.
 request_path = root / "request.json"
 _write(request_path, _redact(request.model_dump()))
 request_data = request_path.read_bytes()
 if not request_data or len(request_data) > config.max_artifact_bytes:
  p.ended_at=now_iso(); p.termination_outcome="policy_denied"; return _failure("artifact_limit_exceeded",request,p)
 request_artifact = CodexArtifact(path=f"figma/{request.request_id}/request.json", media_type="application/json", byte_count=len(request_data), sha256=hashlib.sha256(request_data).hexdigest())
 schema=_output_schema(request); p.schema_hash=_hash(schema)
 prompt_dir=Path(__file__).resolve().parent.parent / "adw_data/prompt_engineering/figma_codex_worker"
 prompt_path=prompt_dir / "system.md"
 user_path=prompt_dir / "user.md"
 prompt=(prompt_path.read_text()+"\n"+user_path.read_text()+"\n"+request.model_dump_json())
 p.prompt_hash=hashlib.sha256(prompt.encode()).hexdigest(); deadline=started+config.overall_deadline_seconds
 code="worker_failed"
 for attempt in range(1,config.max_attempts+1):
  if time.monotonic()>=deadline: code="timeout";break
  # A retry starts a fresh attempt; retain only this attempt's outcome.
  code="worker_failed"
  with tempfile.TemporaryDirectory(prefix="sssf-codex-") as cwd:
   output=Path(cwd)/"last-message.json"; args=["--config",f'mcp_servers.figma.url="{FIGMA_OFFICIAL_ENDPOINT}"', "--config", "mcp_servers.figma.enabled_tools=" + json.dumps(sorted(enabled_tools), separators=(",", ":"))]
   for name in sorted(servers-{"figma"}):
    if not re.fullmatch(r"[A-Za-z0-9_-]+",name): code="connector_invalid_config";break
    args += ["--config",f"mcp_servers.{name}.enabled=false"]
   if code!="worker_failed": break
   cmd=[executable,"exec","--ephemeral","--skip-git-repo-check","--strict-config","--sandbox","read-only",*args,"--json","--output-schema",str(Path(cwd)/"schema.json"),"--output-last-message",str(output),prompt]
   _write(Path(cwd)/"schema.json",schema)
   try: process=subprocess.Popen(cmd,cwd=cwd,env=_safe_env(),stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,start_new_session=True)
   except OSError: code="connector_unavailable";break
   aid=f"{request.request_id}:{attempt}"; run.tracer.connector_worker_start(run.adw_id,phase_id,request.request_id,aid,process.pid); termination="completed"; raw="";stderr=""; outcome="completed"
   try:
    raw,stderr=process.communicate(timeout=max(0.01,min(config.attempt_timeout_seconds,deadline-time.monotonic())))
    if process.returncode: outcome=_classify(stderr)
   except subprocess.TimeoutExpired:
    termination=_terminate(process,deadline); outcome="timeout"
    try: raw,stderr=process.communicate(timeout=max(.01, deadline-time.monotonic()))
    except subprocess.TimeoutExpired: raw,stderr="",""
   except BaseException:
    termination=_terminate(process,deadline); outcome="cancelled"
    raise
   finally:
    # Never emit raw or merely parseable provider facts.  The trace closes the
    # lifecycle only; validated stamps are emitted below on accepted evidence.
    run.tracer.connector_worker_end(run.adw_id,phase_id,process.pid,request.request_id,aid,outcome)
   p.attempts=attempt
   if outcome=="completed":
    try:
     raw_result=output.read_bytes()
     if len(raw_result)>config.max_json_bytes: raise ValueError("json_limit_exceeded")
     parsed=CodexFigmaOutput.model_validate_json(raw_result); sanitized=_redact(parsed.model_dump()); parsed=CodexFigmaOutput.model_validate(sanitized); stamps=_tool_stamps(raw)
     if stamps is None or parsed.request != request or not _stamps_match_request(stamps, request): raise ValueError("untraced_or_invalid_evidence")
     # Validate canonical target and redact before a call fact can be traced.
     safe_stamps=[CodexCallStamp.model_validate(_redact(s.model_dump())) for s in stamps]
     # Code, never the connector, derives observed target, stamps, and evidence.
     labels=_approval_labels(raw, request)
     if labels is None: raise ValueError("untraced_or_invalid_evidence")
     parsed.observed_file_key=request.target.file_key; parsed.observed_node_ids=request.target.node_ids; parsed.approval_labels=labels; parsed.call_stamps=safe_stamps; parsed.artifacts=[]; parsed.evidence_manifest=[]; parsed.provenance=p
     evidence=_redact({"summary":parsed.summary,"notes_for_next_agent":parsed.notes_for_next_agent,"approval_labels":labels,"call_stamps":[s.model_dump() for s in safe_stamps]})
     evidence_path=root/"evidence.json"; _write(evidence_path,evidence); data=evidence_path.read_bytes()
     if 2 > config.max_artifacts or len(data) + request_artifact.byte_count > config.max_artifact_bytes:
      raise ValueError("artifact_limit_exceeded")
     parsed.evidence_manifest=[request_artifact, CodexArtifact(path=f"figma/{request.request_id}/evidence.json",media_type="application/json",byte_count=len(data),sha256=hashlib.sha256(data).hexdigest())]
     p.ended_at=now_iso();p.duration_seconds=time.monotonic()-started;p.termination_outcome="completed"; parsed.result_hash=_result_hash(parsed)
     # One complete, sanitized binding is written only after result and manifest
     # hashes are final; readiness rejects any missing or altered binding.
     run.tracer.connector_worker_tool(run.adw_id, phase_id, request.request_id, aid,
       [stamp.model_dump() for stamp in safe_stamps], parsed.result_hash,
       _hash([artifact.model_dump() for artifact in parsed.evidence_manifest]))
     _write(root/"result.json",parsed.model_dump()); return parsed
    except ValueError as error: code=str(error) if str(error) in {"redaction_failure","json_limit_exceeded","artifact_limit_exceeded","untraced_or_invalid_evidence"} else "schema_mismatch"
    except (OSError,json.JSONDecodeError): code="schema_mismatch"
   else: code=outcome
   if code in RETRYABLE and attempt<config.max_attempts and time.monotonic()+config.retry_backoff_seconds<deadline:
    run.tracer.connector_worker_retry(run.adw_id,phase_id,request.request_id,aid,code);time.sleep(config.retry_backoff_seconds);continue
   p.termination_outcome=termination;break
 p.ended_at=now_iso();p.duration_seconds=time.monotonic()-started;return _failure(code,request,p)
