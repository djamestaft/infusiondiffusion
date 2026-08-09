"""Tracer: every event lands in JSONL and SQLite AS IT HAPPENS.

Files are the raw record; sssf.db is the queryable mirror the UI polls.
No push transport — the flow is always: agents -> sqlite -> web ui.
WAL mode so the UI can read while ADW processes write.
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from .data_types import AgentConfig, EventRecord, GateReport, Phase
from .utils import ensure_dir, new_id, now_iso

SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
  adw_id        TEXT PRIMARY KEY,
  adw_name      TEXT,                -- ADW script(s) run, e.g. "adw_plan + adw_build_test"
  request       TEXT,
  status        TEXT,
  engineer      TEXT,
  started_at    TEXT, ended_at TEXT,
  total_tokens  INTEGER DEFAULT 0, total_cost REAL DEFAULT 0,
  archived      INTEGER DEFAULT 0   -- review triage, set by the UI; never by a run
);
CREATE TABLE IF NOT EXISTS phases (
  phase_id      TEXT PRIMARY KEY,
  adw_id        TEXT REFERENCES sessions,
  seq           INTEGER,
  name TEXT, kind TEXT, owner TEXT, description TEXT,
  status        TEXT DEFAULT 'fail',
  attempt       INTEGER DEFAULT 0, retries INTEGER DEFAULT 0,
  error         TEXT,
  started_at    TEXT, ended_at TEXT
);
CREATE TABLE IF NOT EXISTS events (
  event_id      TEXT PRIMARY KEY,
  adw_id        TEXT REFERENCES sessions,
  phase_id      TEXT REFERENCES phases,
  parent_id     TEXT,
  type          TEXT,
  name          TEXT,
  payload_json  TEXT,
  tokens        INTEGER,
  started_at    TEXT, ended_at TEXT
);
CREATE TABLE IF NOT EXISTS envelopes (
  envelope_id   TEXT PRIMARY KEY,
  adw_id        TEXT REFERENCES sessions,
  phase_id      TEXT REFERENCES phases,
  agent         TEXT,
  output_type   TEXT,
  payload_json  TEXT,
  valid         INTEGER,
  attempt       INTEGER,
  created_at    TEXT
);
CREATE TABLE IF NOT EXISTS gate_results (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  adw_id        TEXT REFERENCES sessions,
  phase_id      TEXT REFERENCES phases,
  attempt       INTEGER,
  gate          TEXT,
  passed        INTEGER,
  violations_json TEXT,
  checks_json   TEXT,               -- [{item, ok, note}] — WHAT the gate verified
  created_at    TEXT
);
CREATE TABLE IF NOT EXISTS processes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  adw_id        TEXT REFERENCES sessions,
  kind          TEXT,                -- 'adw' (the workflow process) | 'agent' (a coding-agent child)
  name          TEXT,                -- '' for the adw, the agent name for a child
  pid           INTEGER,
  command       TEXT,                -- what the pid was, so a recycled pid is not killed by mistake
  started_at    TEXT, ended_at TEXT  -- ended_at NULL = believed alive
);
CREATE TABLE IF NOT EXISTS connector_workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adw_id TEXT REFERENCES sessions, phase_id TEXT REFERENCES phases,
  request_id TEXT, attempt_id TEXT, pid INTEGER, status TEXT, started_at TEXT, ended_at TEXT
);
CREATE TABLE IF NOT EXISTS human_design_approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT, adw_id TEXT, target_hash TEXT,
  approved_by TEXT, approved_at TEXT, source TEXT
);
CREATE TABLE IF NOT EXISTS agent_sessions (
  adw_id        TEXT REFERENCES sessions,
  agent         TEXT,
  coding_agent  TEXT, model TEXT, color TEXT,
  session_id    TEXT,
  context_tokens INTEGER,           -- window occupancy after the agent's last turn
  context_window INTEGER,           -- the model's ceiling; 0/NULL = unknown
  created_at    TEXT, last_used_at TEXT,
  PRIMARY KEY (adw_id, agent)
);
"""

# Columns added after a schema shipped. CREATE TABLE IF NOT EXISTS never
# revisits an existing table, so additive changes need an explicit ALTER.
MIGRATIONS = [("agent_sessions", "color", "TEXT"),
              ("gate_results", "checks_json", "TEXT"),
              ("sessions", "adw_name", "TEXT"),
              ("agent_sessions", "context_tokens", "INTEGER"),
              ("agent_sessions", "context_window", "INTEGER"),
              ("sessions", "archived", "INTEGER DEFAULT 0"),
              ("connector_workers", "attempt_id", "TEXT")]


class Tracer:
    def __init__(self, db_path: str | Path, events_jsonl: str | Path):
        ensure_dir(Path(db_path).parent)
        self.db_path = str(db_path)
        self.events_jsonl = Path(events_jsonl)
        ensure_dir(self.events_jsonl.parent)
        self.conn = sqlite3.connect(self.db_path, isolation_level=None)
        self.conn.execute("PRAGMA journal_mode=WAL;")
        self.conn.execute("PRAGMA synchronous=NORMAL;")
        self.conn.execute("PRAGMA busy_timeout=5000;")
        self.conn.executescript(SCHEMA)
        self._migrate()

    def _migrate(self) -> None:
        """Additive column migrations, so a db from an older SSSF still opens."""
        for table, column, decl in MIGRATIONS:
            columns = {row[1] for row in self.conn.execute(f"PRAGMA table_info({table})")}
            if column not in columns:
                self.conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {decl}")

    # ── events ──────────────────────────────────────────────────────────────
    def event(self, record: EventRecord) -> str:
        event_id = f"evt_{new_id(12)}"
        ts = now_iso()
        line = {"event_id": event_id, "ts": ts, **record.model_dump()}
        with self.events_jsonl.open("a") as f:
            f.write(json.dumps(line) + "\n")
        self.conn.execute(
            "INSERT INTO events (event_id, adw_id, phase_id, parent_id, type, name,"
            " payload_json, tokens, started_at, ended_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
            (event_id, record.adw_id, record.phase_id, record.parent_id, record.type,
             record.name, json.dumps(record.payload), record.tokens,
             record.started_at or ts, record.ended_at),
        )
        return event_id

    # ── sessions ────────────────────────────────────────────────────────────
    def session_start(self, adw_id: str, engineer: str, adw_name: str | None = None) -> None:
        self.conn.execute(
            "INSERT INTO sessions (adw_id, status, engineer, started_at) VALUES (?,?,?,?) "
            "ON CONFLICT(adw_id) DO UPDATE SET status='running'",
            (adw_id, "running", engineer, now_iso()),
        )
        if not adw_name:
            return
        # A joined session chains ADWs — record each distinct one, in run order.
        row = self.conn.execute("SELECT adw_name FROM sessions WHERE adw_id=?",
                                (adw_id,)).fetchone()
        names = row[0].split(" + ") if row and row[0] else []
        if adw_name not in names:
            names.append(adw_name)
            self.conn.execute("UPDATE sessions SET adw_name=? WHERE adw_id=?",
                              (" + ".join(names), adw_id))

    def session_request(self, adw_id: str, request: str) -> None:
        self.conn.execute("UPDATE sessions SET request=? WHERE adw_id=?",
                          (request[:500], adw_id))

    def session_finish(self, adw_id: str, ok: bool) -> None:
        self.conn.execute(
            "UPDATE sessions SET status=?, ended_at=? WHERE adw_id=?",
            ("success" if ok else "fail", now_iso(), adw_id),
        )
        self.processes_end_all(adw_id)   # nothing of this run is alive any more

    def session_add_usage(self, adw_id: str, tokens: int, cost: float) -> None:
        self.conn.execute(
            "UPDATE sessions SET total_tokens=total_tokens+?, total_cost=total_cost+? WHERE adw_id=?",
            (tokens, cost, adw_id),
        )

    # ── processes (adw_id → pid, so a hung run can be found and killed) ─────
    def process_start(self, adw_id: str, kind: str, name: str, pid: int,
                      command: str) -> None:
        """Record a live process for this run.

        A coding agent that hangs produces no events at all, which is exactly
        when you need its pid — and `ps` cannot tell you which adw_id it
        belongs to. Writing it here makes the trace the answer to "what is this
        run running, and how do I stop it".
        """
        self.conn.execute(
            "INSERT INTO processes (adw_id, kind, name, pid, command, started_at)"
            " VALUES (?,?,?,?,?,?)",
            (adw_id, kind, name, pid, command[:500], now_iso()),
        )

    def process_end(self, adw_id: str, pid: int) -> None:
        """Mark the newest live row for this pid as finished."""
        self.conn.execute(
            "UPDATE processes SET ended_at=? WHERE id = ("
            "  SELECT id FROM processes WHERE adw_id=? AND pid=? AND ended_at IS NULL"
            "  ORDER BY id DESC LIMIT 1)",
            (now_iso(), adw_id, pid),
        )

    def processes_end_all(self, adw_id: str) -> None:
        """Close out every live row for a run — called when the session ends."""
        self.conn.execute(
            "UPDATE processes SET ended_at=? WHERE adw_id=? AND ended_at IS NULL",
            (now_iso(), adw_id),
        )

    def human_design_approval(self, adw_id: str, target_hash: str, approved_by: str, trusted_approvers: set[str]) -> str:
        """Record only a configured authority decision outside Pi-writable artifacts."""
        if (not approved_by.strip() or approved_by.strip() not in trusted_approvers
                or not len(target_hash) == 64):
            raise ValueError("unauthorized_human_approval")
        timestamp = now_iso()
        cursor = self.conn.execute("INSERT INTO human_design_approvals (adw_id,target_hash,approved_by,approved_at,source) VALUES (?,?,?,?,?)",
                          (adw_id, target_hash, approved_by.strip(), timestamp, "repository_allowlist"))
        event_id = self.event(EventRecord(adw_id=adw_id, phase_id="", type="human_design_approval",
                               name="trusted_authority", payload={"approval_id": cursor.lastrowid, "target_hash": target_hash, "approved_by": approved_by.strip()}))
        return event_id

    def human_design_approval_reference(self, adw_id: str, target_hash: str, approved_by: str) -> str | None:
        row = self.conn.execute("SELECT id FROM human_design_approvals WHERE adw_id=? AND target_hash=? AND approved_by=? AND source='repository_allowlist' ORDER BY id DESC LIMIT 1",
                                (adw_id, target_hash, approved_by)).fetchone()
        return f"approval:{row[0]}" if row else None

    def has_human_design_approval(self, adw_id: str, target_hash: str, approved_by: str) -> bool:
        return self.human_design_approval_reference(adw_id, target_hash, approved_by) is not None

    def has_trusted_human_design_approval(self, adw_id: str, target_hash: str,
                                          trusted_approvers: set[str]) -> bool:
        """Whether a configured authority recorded this exact target already."""
        row = self.conn.execute(
            "SELECT 1 FROM human_design_approvals WHERE adw_id=? AND target_hash=? "
            "AND source='repository_allowlist' AND approved_by IN (%s) LIMIT 1"
            % ",".join("?" for _ in trusted_approvers),
            (adw_id, target_hash, *sorted(trusted_approvers)),
        ).fetchone() if trusted_approvers else None
        return row is not None

    # ── sanitized connector worker lifecycle ───────────────────────────────
    def connector_worker_start(self, adw_id: str, phase_id: str, request_id: str, attempt_id: str, pid: int) -> None:
        """Open one uniquely identified connector-worker attempt."""
        self.conn.execute("INSERT INTO connector_workers (adw_id, phase_id, request_id, attempt_id, pid, status, started_at) VALUES (?,?,?,?,?,?,?)", (adw_id, phase_id, request_id, attempt_id, pid, "running", now_iso()))
        self.event(EventRecord(adw_id=adw_id, phase_id=phase_id, type="worker_start", name="figma_codex", payload={"request_id": request_id, "attempt_id": attempt_id, "pid": pid}))

    def connector_worker_retry(self, adw_id: str, phase_id: str, request_id: str, attempt_id: str, code: str) -> None:
        self.event(EventRecord(adw_id=adw_id, phase_id=phase_id, type="worker_retry", name="figma_codex", payload={"request_id": request_id, "attempt_id": attempt_id, "code": code}))

    def connector_worker_tool(self, adw_id: str, phase_id: str, request_id: str, attempt_id: str, stamps: list[dict], result_hash: str, manifest_hash: str) -> None:
        """Persist the final sanitized call/result/manifest binding, never raw payloads."""
        allowed = {"operation", "file_key", "node_ids"}
        if (not stamps or any(set(stamp) != allowed for stamp in stamps)
                or not all(isinstance(value, str) and len(value) == 64 for value in (result_hash, manifest_hash))):
            raise ValueError("redaction_failure")
        self.event(EventRecord(adw_id=adw_id, phase_id=phase_id, type="worker_tool", name="figma_codex",
            payload={"request_id": request_id, "attempt_id": attempt_id, "stamps": stamps,
                     "result_hash": result_hash, "manifest_hash": manifest_hash}))

    def connector_worker_end(self, adw_id: str, phase_id: str, pid: int, request_id: str, attempt_id: str, outcome: str) -> None:
        """Close exactly the matching attempt row with its truthful terminal outcome."""
        self.conn.execute("UPDATE connector_workers SET status=?, ended_at=? WHERE id=(SELECT id FROM connector_workers WHERE adw_id=? AND phase_id=? AND request_id=? AND attempt_id=? AND pid=? AND ended_at IS NULL ORDER BY id DESC LIMIT 1)", (outcome, now_iso(), adw_id, phase_id, request_id, attempt_id, pid))
        self.event(EventRecord(adw_id=adw_id, phase_id=phase_id, type="worker_end", name="figma_codex", payload={"request_id": request_id, "attempt_id": attempt_id, "pid": pid, "outcome": outcome}))

    def connector_worker_lifecycle(self, adw_id: str, phase_id: str, request_id: str) -> dict[str, object]:
        """Return only sanitized lifecycle facts for one exact worker request."""
        rows = self.conn.execute(
            "SELECT attempt_id, pid, status, ended_at FROM connector_workers WHERE adw_id=? AND phase_id=? AND request_id=? ORDER BY id",
            (adw_id, phase_id, request_id),
        ).fetchall()
        events = self.conn.execute(
            "SELECT type, payload_json FROM events WHERE adw_id=? AND phase_id=? AND name='figma_codex' AND type IN ('worker_start', 'worker_end', 'worker_tool') ORDER BY started_at, event_id",
            (adw_id, phase_id),
        ).fetchall()
        starts: list[dict[str, object]] = []
        ends: list[dict[str, object]] = []
        tools: list[dict[str, object]] = []
        malformed = 0
        for event_type, payload_json in events:
            try:
                payload = json.loads(payload_json)
            except (TypeError, json.JSONDecodeError):
                malformed += 1
                continue
            if not isinstance(payload, dict):
                malformed += 1
                continue
            if payload.get("request_id") != request_id:
                continue
            if (event_type == "worker_start" and set(payload) == {"request_id", "attempt_id", "pid"}
                    and isinstance(payload.get("attempt_id"), str) and isinstance(payload.get("pid"), int)):
                starts.append(payload)
            elif (event_type == "worker_end" and set(payload) == {"request_id", "attempt_id", "pid", "outcome"}
                  and isinstance(payload.get("attempt_id"), str) and isinstance(payload.get("pid"), int)
                  and isinstance(payload.get("outcome"), str)):
                ends.append(payload)
            elif (event_type == "worker_tool" and set(payload) == {"request_id", "attempt_id", "stamps", "result_hash", "manifest_hash"}
                  and isinstance(payload.get("attempt_id"), str) and isinstance(payload.get("stamps"), list)):
                tools.append(payload)
            else:
                malformed += 1
        return {"rows": [{"attempt_id": row[0], "pid": row[1], "status": row[2], "ended_at": row[3]} for row in rows],
                "starts": starts, "ends": ends, "tools": tools, "malformed": malformed}

    # ── phases ──────────────────────────────────────────────────────────────
    def max_phase_seq(self, adw_id: str) -> int:
        """Highest seq already recorded for this session; 0 when it is new.

        A joined run continues the sequence instead of restarting at 1 — which
        would collide with the first run's phases on both `seq` (breaking
        ordering) and `phase_id` (silently overwriting a row through the
        phase_upsert conflict clause).
        """
        row = self.conn.execute("SELECT MAX(seq) FROM phases WHERE adw_id = ?",
                                (adw_id,)).fetchone()
        return row[0] if row and row[0] is not None else 0

    def phase_upsert(self, phase: Phase) -> None:
        p = phase.params
        self.conn.execute(
            "INSERT INTO phases (phase_id, adw_id, seq, name, kind, owner, description,"
            " status, attempt, retries, error, started_at, ended_at)"
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
            " ON CONFLICT(phase_id) DO UPDATE SET status=excluded.status,"
            " attempt=excluded.attempt, error=excluded.error, ended_at=excluded.ended_at",
            (phase.phase_id, phase.adw_id, phase.seq, p.name, p.kind, p.owner,
             p.description, phase.status, phase.attempt, p.retries, phase.error,
             phase.started_at, phase.ended_at),
        )

    # ── envelopes / gates / agent sessions ──────────────────────────────────
    def envelope_row(self, phase: Phase, agent: str, output_type: str,
                     payload_json: str, valid: bool, attempt: int) -> None:
        self.conn.execute(
            "INSERT INTO envelopes (envelope_id, adw_id, phase_id, agent, output_type,"
            " payload_json, valid, attempt, created_at) VALUES (?,?,?,?,?,?,?,?,?)",
            (f"env_{new_id(12)}", phase.adw_id, phase.phase_id, agent, output_type,
             payload_json, int(valid), attempt, now_iso()),
        )

    def gate_row(self, phase: Phase, gate: str, report: GateReport, attempt: int) -> None:
        """The report carries both the verdict and the evidence behind it."""
        self.conn.execute(
            "INSERT INTO gate_results (adw_id, phase_id, attempt, gate, passed,"
            " violations_json, checks_json, created_at) VALUES (?,?,?,?,?,?,?,?)",
            (phase.adw_id, phase.phase_id, attempt, gate, int(report.passed),
             json.dumps(report.violations),
             json.dumps([c.model_dump() for c in report.checks]), now_iso()),
        )

    def agent_session_row(self, adw_id: str, agent: AgentConfig, session_id: str,
                          context_tokens: int = 0, context_window: int = 0) -> None:
        """The agent's config row is the source of truth for its label and color.

        Context is carried here rather than derived from events because the lane
        wants one number per agent — the latest — and a session that runs the
        same agent twice overwrites it, exactly like model and session_id.
        """
        ts = now_iso()
        self.conn.execute(
            "INSERT INTO agent_sessions (adw_id, agent, coding_agent, model, color,"
            " session_id, context_tokens, context_window, created_at, last_used_at)"
            " VALUES (?,?,?,?,?,?,?,?,?,?)"
            " ON CONFLICT(adw_id, agent) DO UPDATE SET model=excluded.model,"
            " color=excluded.color, session_id=excluded.session_id,"
            " context_tokens=excluded.context_tokens,"
            " context_window=excluded.context_window,"
            " last_used_at=excluded.last_used_at",
            (adw_id, agent.name, agent.coding_agent, agent.model, agent.color,
             session_id, context_tokens, context_window, ts, ts),
        )
