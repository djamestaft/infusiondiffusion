"""Concrete data types for the SSSF ADW system.

RULE (four-param rule): any function that takes more than 4 parameters takes
ONE of these objects instead. AgentCall and PhaseParams are the pattern.

Every agent call declares a concrete output type — an EnvelopeBase subclass —
that its final JSON response is parsed against. No untyped handoffs.
"""

from __future__ import annotations

from typing import Any, Callable, Literal, Optional, Type
import re

from pydantic import BaseModel, Field, ValidationInfo, field_validator, model_validator

PhaseKind = Literal["engineer", "agent", "code"]
PhaseStatus = Literal["queued", "running", "success", "fail"]


# ── Phases ────────────────────────────────────────────────────────────────────

class PhaseParams(BaseModel):
    """Everything run.phase() needs. Passed as one object, never loose params."""

    name: str                       # short id, unique within the run: "plan", "build"
    kind: PhaseKind                 # which lane the block renders in
    owner: str                      # engineer's name, "git", or an agent name from config
    description: str                # REQUIRED: what this phase does and why — see below
    retries: int = 0                # agent phases: gate-failure retries via continue

    @field_validator("description")
    @classmethod
    def _description_must_be_earned(cls, value: str, info: ValidationInfo) -> str:
        """A phase name identifies; a description explains. Both are required.

        The description is the only sentence the trace, the console, and the
        phase block in the UI ever show about intent — everything else is ids,
        statuses, and timings. `commit_plan: "Commit the plan"` tells a reader
        nothing they could not already see, so an echo is rejected the same way
        a blank one is. This is a construction-time error on purpose: it fires
        before the phase opens, not after a run is already in the trace.
        """
        text = " ".join(value.split())
        name = str(info.data.get("name", "?"))
        if not text:
            raise ValueError(
                f"phase {name!r}: description is required — one sentence on what this "
                f"phase does and why. It is what the trace and the UI show.")
        if text.rstrip(".").casefold() == name.replace("_", " ").casefold():
            raise ValueError(
                f"phase {name!r}: description {text!r} only restates the phase name — "
                f"say what it does and why instead.")
        return text


class Phase(BaseModel):
    """The persisted phase record — PhaseParams plus lifecycle."""

    phase_id: str
    adw_id: str
    seq: int
    params: PhaseParams
    status: PhaseStatus = "fail"    # success must be earned
    attempt: int = 0
    error: Optional[str] = None
    started_at: Optional[str] = None
    ended_at: Optional[str] = None


# ── Envelopes (agent output types) ───────────────────────────────────────────

class EnvelopeBase(BaseModel):
    """Base of every agent's final JSON response. Output types extend this."""

    status: Literal["success", "fail"]
    summary: str = ""
    artifacts: list[str] = Field(default_factory=list)
    notes_for_next_agent: str = ""


class GenericOutput(EnvelopeBase):
    pass


FIGMA_OFFICIAL_ENDPOINT = "https://mcp.figma.com/mcp"
FIGMA_EVIDENCE_CATEGORIES = frozenset((
    "dimensions_layout", "semantic_variables", "typography", "spacing_assets",
    "responsive", "accessibility_interaction", "content_extremes", "divergences",
))


class FigmaTarget(BaseModel):
    """Canonical, exact Figma target. No natural-language instructions travel here."""

    file_key: str
    node_ids: list[str] = Field(min_length=1, max_length=12)
    expected_approval: Literal["Approved"] = "Approved"
    evidence_categories: list[str] = Field(min_length=1)

    @field_validator("file_key")
    @classmethod
    def _canonical_file_key(cls, value: str) -> str:
        match = re.fullmatch(r"[A-Za-z0-9]{10,128}", value)
        if match:
            return value
        # A target is an identifier, not a prompt. Accept the official URL form
        # only, with an optional Figma document slug and known opaque navigation
        # parameters; free-form fragments/query text would smuggle instructions
        # across the typed boundary.
        url = re.fullmatch(
            r"https://www\.figma\.com/(?:design|file)/([A-Za-z0-9]{10,128})"
            r"(?:/[A-Za-z0-9_-]+)?"
            r"(?:\?(?:(?:node-id|starting-point-node-id|version-id|t|m|fuid)="
            r"[A-Za-z0-9%:_-]+)(?:&(?:node-id|starting-point-node-id|version-id|t|m|fuid)="
            r"[A-Za-z0-9%:_-]+)*)?",
            value,
        )
        if url:
            return url.group(1)
        raise ValueError("file_key must be a canonical Figma file key or official Figma design URL")

    @field_validator("node_ids")
    @classmethod
    def _unique_nodes(cls, value: list[str]) -> list[str]:
        if len(set(value)) != len(value) or any(not re.fullmatch(r"[1-9][0-9]*:[1-9][0-9]*", node) for node in value):
            raise ValueError("node IDs must be unique canonical numeric Figma IDs")
        return value

    @field_validator("evidence_categories")
    @classmethod
    def _categories(cls, value: list[str]) -> list[str]:
        if len(set(value)) != len(value) or any(category not in FIGMA_EVIDENCE_CATEGORIES for category in value):
            raise ValueError("evidence categories must be unique canonical categories")
        return value


class PlanOutput(EnvelopeBase):
    # Subject for committing the PLAN — the spec file the planner wrote, not the
    # implementation it describes. Each agent's commit_message covers its own
    # work product, so a chain that commits per step never reuses one agent's
    # words for another agent's diff.
    commit_message: str = ""
    implementation_owner: Literal[
        "builder", "storefront_engineer", "content_commerce_engineer"
    ] = "builder"
    advisory_specialists: list[Literal[
        "product_designer", "browser_release_debugger"
    ]] = Field(default_factory=list)
    review_owner: Literal["reviewer", "quality_reviewer"] = "reviewer"
    figma_targets: list[FigmaTarget] = Field(default_factory=list, max_length=12)

    @field_validator("figma_targets")
    @classmethod
    def _unique_figma_targets(cls, value: list[FigmaTarget]) -> list[FigmaTarget]:
        identities = [(target.file_key, tuple(sorted(target.node_ids)), target.expected_approval,
                       tuple(sorted(target.evidence_categories))) for target in value]
        if len(set(identities)) != len(identities):
            raise ValueError("figma_targets must not contain duplicate exact targets")
        return value


class CodexFigmaRequest(BaseModel):
    request_id: str
    target: FigmaTarget
    reason: Literal["pi_connector_unavailable"]
    operations: list[str]
    supervisor_session_id: str

    @field_validator("request_id")
    @classmethod
    def _safe_request_id(cls, value: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,127}", value):
            raise ValueError("request_id must be a safe handoff path segment")
        return value

    @field_validator("operations")
    @classmethod
    def _read_only_operations(cls, value: list[str]) -> list[str]:
        allowed = {"node_metadata", "node_context", "variables", "styles", "screenshot"}
        if not value or any(operation not in allowed for operation in value):
            raise ValueError("operations must be a non-empty read-only allowlist")
        return value


HANDOFF_SECTIONS = frozenset((
    "dimensions_layout", "semantic_variables", "typography", "spacing_assets",
    "responsive", "accessibility_interaction", "content_extremes", "divergences",
))


class HumanDesignApproval(BaseModel):
    """Separate human-recorded approval; Pi cannot assert this decision."""
    artifact_path: str
    approved_by: str = Field(min_length=1, max_length=200)
    target_hash: str
    # Deterministic ADW code overwrites this after validation; Pi's value is not trusted.
    tracer_reference: str = ""

    @field_validator("artifact_path")
    @classmethod
    def _approval_path(cls, value: str) -> str:
        path = value.replace("\\", "/")
        if not path or path.startswith("/") or ".." in path.split("/"):
            raise ValueError("approval artifact must be handoff-relative")
        return path


class FigmaSupervisorOutput(EnvelopeBase):
    stage: Literal["complete", "delegate_codex", "blocked"]
    ready: bool = False
    human_design_approval: HumanDesignApproval | None = None
    findings: list[str] = Field(default_factory=list)
    blocking: list[str] = Field(default_factory=list)
    # Every path is handoff-relative, matching CodexArtifact.path.
    figma_evidence: list[str] = Field(default_factory=list)
    handoff_sections: dict[str, list[str]] = Field(default_factory=dict)
    # Code-produced facts: unknown/unavailable never permit a ready handoff.
    static_fact_status: Literal["complete", "unavailable", "unknown"] = "unknown"
    static_fact_reason: str = ""
    capture_request_id: str = ""
    capture_phase_id: str = ""
    capture_supervisor_session_id: str = ""
    capture_result_hash: str = ""
    # The current product-designer session that produced this target-bound verdict.
    supervisor_session_id: str = ""
    request: CodexFigmaRequest | None = None

    @field_validator("figma_evidence")
    @classmethod
    def _evidence_paths_are_handoff_relative(cls, value: list[str]) -> list[str]:
        for path in value:
            normalized = path.replace("\\", "/")
            if not normalized or normalized.startswith("/") or ".." in normalized.split("/"):
                raise ValueError("Figma evidence paths must be handoff-relative")
        return value

    @model_validator(mode="after")
    def _stage_contract(self) -> "FigmaSupervisorOutput":
        if self.stage == "delegate_codex":
            if self.ready or self.request is None:
                raise ValueError("Codex delegation requires request and ready=false")
        elif self.request is not None:
            raise ValueError("only delegate_codex may include a worker request")
        elif self.stage == "blocked" and self.ready:
            raise ValueError("blocked supervision cannot be ready")
        elif self.stage == "complete" and (not self.ready or self.human_design_approval is None or not self.supervisor_session_id):
            raise ValueError("complete supervision requires readiness, supervisor session, and separate human approval evidence")
        return self


class ImplementationContext(BaseModel):
    """Implementation receives the approved plan and deterministic trace references."""
    plan: PlanOutput
    # One validated handoff per unique planned target. ``figma_handoff`` remains
    # for existing single-target implementation prompts.
    figma_handoffs: list[FigmaSupervisorOutput] = Field(default_factory=list)
    figma_handoff: FigmaSupervisorOutput | None = None
    approval_trace_reference: str = ""
    capture_trace_reference: str = ""

    @model_validator(mode="after")
    def _single_target_compatibility(self) -> "ImplementationContext":
        if self.figma_handoffs:
            if self.figma_handoff is None:
                self.figma_handoff = self.figma_handoffs[0]
            elif self.figma_handoff != self.figma_handoffs[0]:
                raise ValueError("figma_handoff must match the first typed handoff")
        return self


class SpecialistOutput(EnvelopeBase):
    """A read-only specialist's decision before implementation begins."""

    ready: bool = False
    findings: list[str] = Field(default_factory=list)
    blocking: list[str] = Field(default_factory=list)
    figma_evidence: list[str] = Field(default_factory=list)


class CodexArtifact(BaseModel):
    # Relative to the current session's context_handoff directory only.
    path: str
    media_type: str
    byte_count: int
    sha256: str

    @field_validator("path")
    @classmethod
    def _handoff_relative_path(cls, value: str) -> str:
        path = value.replace("\\", "/")
        if not path or path.startswith("/") or ".." in path.split("/"):
            raise ValueError("artifact paths must be non-empty handoff-relative paths")
        return path


class CodexWorkerProvenance(BaseModel):
    adw_id: str
    phase_id: str
    request_id: str
    supervisor_session_id: str
    worker_kind: Literal["codex"] = "codex"
    cli_version: str = ""
    connector_name: Literal["figma"] = "figma"
    endpoint_identity: str = ""
    repository_commit: str = ""
    schema_version: str = "1"
    schema_hash: str = ""
    prompt_hash: str = ""
    target_hash: str = ""
    started_at: str = ""
    ended_at: str = ""
    duration_seconds: float = 0.0
    attempts: int = 0
    timeout_seconds: int = 180
    overall_deadline_seconds: int = 370
    termination_outcome: str = "completed"


class CodexCallStamp(BaseModel):
    operation: Literal["node_metadata", "node_context", "variables", "styles", "screenshot"]
    file_key: str
    node_ids: list[str] = Field(min_length=1, max_length=12)

    @field_validator("file_key")
    @classmethod
    def _canonical_file_key(cls, value: str) -> str:
        # Call facts are identifiers too: reject secrets, URLs, and free text
        # before they can reach the worker trace.
        return FigmaTarget(file_key=value, node_ids=["1:1"],
                           evidence_categories=["dimensions_layout"]).file_key

    @field_validator("node_ids")
    @classmethod
    def _canonical_nodes(cls, value: list[str]) -> list[str]:
        if len(set(value)) != len(value) or any(not re.fullmatch(r"[1-9][0-9]*:[1-9][0-9]*", node) for node in value):
            raise ValueError("call stamp node IDs must be unique canonical IDs")
        return value


class CodexFigmaOutput(EnvelopeBase):
    """Sanitized, code-stamped result; provenance is overwritten by the worker."""

    capture_status: Literal["complete", "blocked", "failed"]
    failure_code: str = ""
    failure_message: str = ""
    request: CodexFigmaRequest
    observed_file_key: str = ""
    observed_node_ids: list[str] = Field(default_factory=list)
    approval_labels: dict[str, str] = Field(default_factory=dict)
    call_stamps: list[CodexCallStamp] = Field(default_factory=list)
    evidence_manifest: list[CodexArtifact] = Field(default_factory=list)
    provenance: CodexWorkerProvenance
    result_hash: str = ""


class BuildOutput(EnvelopeBase):
    changed_files: list[str] = Field(default_factory=list)
    commit_message: str = ""        # consumed by the git commit phase


class ScoutFinding(BaseModel):
    file: str
    note: str = ""


class ScoutOutput(EnvelopeBase):
    findings: list[ScoutFinding] = Field(default_factory=list)


class ReviewFinding(BaseModel):
    """One thing the request (or plan) asked for, and whether it is there."""

    requirement: str                # the ask, in the requester's words
    met: bool
    evidence: str = ""              # where it lives, or what is missing


class ReviewOutput(EnvelopeBase):
    """Confirmation that what was built is what was asked for — not a test run."""

    approved: bool = False
    findings: list[ReviewFinding] = Field(default_factory=list)
    blocking: list[str] = Field(default_factory=list)   # what must change before approval


class DocumentOutput(EnvelopeBase):
    """Where the write-up of a completed change landed."""

    document_path: str = ""         # the doc in the repo, e.g. app_docs/<adw_id>_<slug>.md
    documented_files: list[str] = Field(default_factory=list)
    commit_message: str = ""


# ── Deterministic quality blocks ─────────────────────────────────────────────

QualityArea = Literal["frontend", "backend"]
QualityOperation = Literal["lint", "typecheck", "build"]


class QualityCheckSpec(BaseModel):
    """One deterministic quality command."""

    name: str
    area: QualityArea
    operation: QualityOperation
    argv: list[str]
    timeout_seconds: int = 120


class QualityCheckResult(BaseModel):
    """Captured evidence from one quality command."""

    name: str
    area: QualityArea
    operation: QualityOperation
    command: str
    returncode: int
    passed: bool
    duration_seconds: float
    output_artifact: str
    # The tail of stdout+stderr, verbatim and unparsed. A failure has to travel
    # back to the builder as an envelope, and the builder cannot open a log file
    # it was never handed — so the evidence rides along. Deliberately raw: every
    # runner formats failures differently and a generic parser would be
    # confidently wrong. The full log is always at output_artifact.
    output_tail: str = ""


class QualityResult(BaseModel):
    """Aggregate result from a quality block: every check it ran, and the verdict."""

    passed: bool
    checks: list[QualityCheckResult] = Field(default_factory=list)
    failures: list[str] = Field(default_factory=list)
    artifacts: list[str] = Field(default_factory=list)


class PullRequestCheck(BaseModel):
    """One GitHub pull-request check as reported by gh."""

    name: str
    state: str
    bucket: str
    link: str = ""
    workflow: str = ""


class PullRequestGateResult(BaseModel):
    """Deterministic verdict for the required post-push GitHub checks."""

    passed: bool
    checks: list[PullRequestCheck] = Field(default_factory=list)
    failures: list[str] = Field(default_factory=list)


# ── Change capture (git diff, deterministic) ─────────────────────────────────

class ChangeCapture(BaseModel):
    """Everything documentation.capture() needs. One object, never loose params."""

    base: str = "main"              # the ref the work is measured against
    max_diff_lines: int = 2000      # the diff artifact is truncated past this
    include_untracked: bool = True  # a brand-new file is part of the change


class BaseRef(BaseModel):
    """The commit a change is measured from, and why that one.

    `reason` is the line the trace shows. A diff is only as trustworthy as the
    thing it was taken against, so the ADW records that choice instead of
    leaving the reader to infer it.
    """

    ref: str                        # what was asked for: "main", or a pinned sha
    commit: str                     # the commit actually diffed against
    reason: str = ""

    @property
    def label(self) -> str:
        """Display form — a named ref as itself, a pinned raw sha shortened."""
        if len(self.ref) == 40 and all(c in "0123456789abcdef" for c in self.ref):
            return self.ref[:7]
        return self.ref


class ChangeSet(BaseModel):
    """What changed since the base commit — pure git facts, no judgement."""

    base: BaseRef
    files: list[str] = Field(default_factory=list)
    untracked: list[str] = Field(default_factory=list)
    insertions: int = 0
    deletions: int = 0
    stat: str = ""                  # `git diff --stat` output, verbatim
    diff_path: str = ""             # the full diff, written into context_handoff/
    truncated: bool = False

    @property
    def empty(self) -> bool:
        return not (self.files or self.untracked)


class ChangesOutput(EnvelopeBase):
    """A ChangeSet shaped as an envelope so an agent can be handed it directly.

    Same adapter idea as VerifyOutput: code computes the diff, the documenter
    consumes it through the one door every agent handoff uses.
    """

    base: str = ""                  # "<ref> @ <commit> — <reason>"
    changed_files: list[str] = Field(default_factory=list)
    insertions: int = 0
    deletions: int = 0
    stat: str = ""
    diff_path: str = ""             # read this for the full diff


class VerifyOutput(EnvelopeBase):
    """A deterministic result, shaped as an envelope so an agent can consume it.

    Agents hand each other typed envelopes; code blocks return QualityResult.
    This is the adapter, so a failing lint or test run flows back into the
    builder through exactly the same door a tester agent's report used to —
    the ADW script is the only thing that knows the difference.
    """

    passed: bool = False
    failures: list[str] = Field(default_factory=list)


# ── Agent calls ──────────────────────────────────────────────────────────────

class GateCheck(BaseModel):
    """One thing a gate looked at, and what it found.

    `note` is the evidence — "exists, 2.1KB", "exit 0", "not in the diff". On a
    failed check it doubles as the reason, so it is what the agent is told.
    """

    item: str                       # what was checked: a path, a command, a test
    ok: bool
    note: str = ""


class GateReport(BaseModel):
    """What every gate returns: the checks it ran. Violations are derived.

    Authoring stays a one-liner per item — `report.check(...)` appends and
    returns self, so a gate is a loop and a return.
    """

    checks: list[GateCheck] = Field(default_factory=list)

    def check(self, item: str, ok: bool, note: str = "") -> "GateReport":
        self.checks.append(GateCheck(item=item, ok=ok, note=note))
        return self

    @property
    def violations(self) -> list[str]:
        return [f"{c.item}: {c.note or 'failed'}" for c in self.checks if not c.ok]

    @property
    def passed(self) -> bool:
        return not self.violations


class AgentCall(BaseModel):
    """One agent invocation: prompt in, typed envelope out, gates verified."""

    model_config = {"arbitrary_types_allowed": True}

    output_type: Type[EnvelopeBase]
    prompt: str
    previous: Optional[EnvelopeBase] = None
    gates: list[Callable] = Field(default_factory=list)   # gate(envelope, run) -> list[str]


# ── Config ───────────────────────────────────────────────────────────────────

class PromptEngineering(BaseModel):
    system: str                     # path to system.md
    user: str                       # path to user.md


class AgentConfig(BaseModel):
    name: str
    coding_agent: Literal["pi", "claude_code"] = "pi"
    model: str = "google/gemini-3.6-flash"
    thinking: str = "medium"        # off | minimal | low | medium | high | xhigh | max
    color: str = ""                 # hex swatch for this agent's lane in the UI
    purpose: str = ""
    prompt_engineering: PromptEngineering
    harness_engineering: list[str] = Field(default_factory=list)
    tools: Optional[list[str]] = None    # allowlist; None = all tools usable
    # What this agent may MODIFY in the repo, enforced in code after every call
    # (see adw_modules/permissions.py). `tools` cannot express this: `bash` runs
    # anything and `write` reaches any path, so an agent's capability list is a
    # statement of intent that nothing checks.
    #   None  -> unrestricted, except the roster-wide `protected_files` paths
    #   []    -> read-only: may modify nothing tracked
    #   [...] -> only these. A trailing "/" means a directory prefix; a "*"
    #            makes it a glob; anything else is an exact path.
    writes: Optional[list[str]] = None


class ConfigDefaults(BaseModel):
    coding_agent: Literal["pi", "claude_code"] = "pi"
    model: str = "google/gemini-3.6-flash"
    thinking: str = "medium"
    color: str = ""
    harness_engineering: list[str] = Field(default_factory=list)
    tools: Optional[list[str]] = None    # roster-wide allowlist; None = all tools usable
    # Off-limits to every agent that has not named them in its own `writes`.
    # The factory's own code is the default: an agent must not be able to edit
    # the machinery that decides whether its work passed.
    protected_files: list[str] = Field(default_factory=lambda: [
        "adws/adw_modules/", "adws/adw_sssf_config/", "adws/adw_*.py",
    ])
    data_dir: str = "adws/adw_data"


class ObservabilityConfig(BaseModel):
    db: str = "adws/adw_data/sssf.db"
    poll_ms: int = 500


class FigmaCodexWorkerConfig(BaseModel):
    enabled: bool = False
    trusted_design_approvers: list[str] = Field(default_factory=list)
    # Execution identity is deliberately absent from overlay-configurable fields.
    # Production always invokes bare ``codex`` and the official figma endpoint.
    connector: Literal["figma"] = "figma"
    attempt_timeout_seconds: int = Field(default=180, ge=1, le=180)
    max_attempts: int = Field(default=2, ge=1, le=2)
    retry_backoff_seconds: int = Field(default=2, ge=0, le=2)
    overall_deadline_seconds: int = Field(default=370, ge=1, le=370)
    max_nodes: int = Field(default=12, ge=1, le=12)
    max_artifacts: int = Field(default=8, ge=1, le=8)
    max_artifact_bytes: int = Field(default=25 * 1024 * 1024, ge=1, le=25 * 1024 * 1024)
    max_json_bytes: int = Field(default=256 * 1024, ge=1, le=256 * 1024)

    @property
    def executable(self) -> str:
        return "codex"

    @property
    def official_endpoint(self) -> str:
        return FIGMA_OFFICIAL_ENDPOINT


class WorkersConfig(BaseModel):
    figma_codex: FigmaCodexWorkerConfig = Field(default_factory=FigmaCodexWorkerConfig)


class SSSFConfig(BaseModel):
    defaults: ConfigDefaults = Field(default_factory=ConfigDefaults)
    observability: ObservabilityConfig = Field(default_factory=ObservabilityConfig)
    workers: WorkersConfig = Field(default_factory=WorkersConfig)
    agents: list[AgentConfig] = Field(default_factory=list)


# ── Tracing ──────────────────────────────────────────────────────────────────

class EventRecord(BaseModel):
    """One traced event, always logged against adw_id + phase."""

    adw_id: str
    phase_id: str = ""
    type: str                       # phase_start | agent_start | tool_call | handoff | gate_pass | gate_fail | log | agent_end | phase_end | error
    name: str = ""
    payload: dict[str, Any] = Field(default_factory=dict)
    parent_id: str = ""
    tokens: Optional[int] = None
    # Spans: set both when an event covers real elapsed time (a tool call), so
    # the UI lays it out on a time axis without parsing payload JSON. Left unset,
    # the tracer stamps started_at with the moment the event was recorded.
    started_at: Optional[str] = None
    ended_at: Optional[str] = None


# ── Pi coding agent interface ────────────────────────────────────────────────

class PiRequest(BaseModel):
    """Everything one non-interactive pi run needs."""

    prompt: str
    system_prompt: str
    model: str                      # registry pattern, resolved to provider + id
    thinking: str = "medium"
    session_id: str                 # pi --session-id: creates or continues
    session_dir: str
    raw_output_path: str            # JSONL stream lands here
    tools: Optional[list[str]] = None
    extensions: list[str] = Field(default_factory=list)
    cwd: str = "."                  # set from run.repo_root — the codebase root agents work in


class UsageBreakdown(BaseModel):
    """Tokens and the dollars they cost, per component, summed over a call.

    Mirrors pi's `usage` shape one-for-one so the numbers reconcile with what
    pi itself reports: `input` EXCLUDES cache reads, which bill at their own
    (cheaper) rate — add them to learn the size of the prompt that was sent.
    """
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    # Thinking tokens. NOT a fifth component: measured across every session on
    # disk, reasoning is always <= output and the four components above always
    # sum to totalTokens, so reasoning is the thinking SHARE of output, billed
    # at the output rate. Report it nested under output, never added to it.
    reasoning_tokens: int = 0
    total_tokens: int = 0
    input_cost: float = 0.0
    output_cost: float = 0.0
    cache_read_cost: float = 0.0
    cache_write_cost: float = 0.0
    total_cost: float = 0.0

    def add_turn(self, usage: dict, total_tokens: int) -> None:
        """Fold in one pi `message_end` usage object.

        `total_tokens` is passed in rather than re-derived: the caller already
        computes it pi's way (totalTokens, else the sum of the parts).
        """
        cost = usage.get("cost") or {}
        self.input_tokens += usage.get("input") or 0
        self.output_tokens += usage.get("output") or 0
        self.cache_read_tokens += usage.get("cacheRead") or 0
        self.cache_write_tokens += usage.get("cacheWrite") or 0
        self.reasoning_tokens += usage.get("reasoning") or 0
        self.total_tokens += total_tokens
        self.input_cost += cost.get("input") or 0.0
        self.output_cost += cost.get("output") or 0.0
        self.cache_read_cost += cost.get("cacheRead") or 0.0
        self.cache_write_cost += cost.get("cacheWrite") or 0.0
        self.total_cost += cost.get("total") or 0.0

    def merge(self, other: "UsageBreakdown") -> None:
        """Add another call's usage — a phase that retries spends more than once."""
        for field in type(self).model_fields:
            setattr(self, field, getattr(self, field) + getattr(other, field))


class PiResult(BaseModel):
    text: str = ""
    returncode: int = 0
    session_id: str = ""
    tokens: int = 0
    cost: float = 0.0
    usage: UsageBreakdown = Field(default_factory=UsageBreakdown)
    # Context occupancy after the LAST turn — not a sum. `tokens` bills every
    # turn; this is how full the window is right now, which is what the
    # visualizer's context bar measures against `context_window`.
    context_tokens: int = 0
    context_window: int = 0         # 0 when the registry declares no ceiling
