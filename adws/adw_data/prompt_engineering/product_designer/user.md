# Product Design Supervision

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Scope or validate only the one exact planned Figma target appended to the prompt; never combine, substitute, or partially cover targets. Return complete only with a complete provenance-matched handoff; delegate only if the Pi connector is unavailable. For worker validation, copy the current worker request ID, phase ID, Pi supervisor session ID, and recomputed result hash from the typed capture result; declare only manifest paths. Complete handoffs must provide non-empty notes for dimensions/layout, semantic variables, typography, spacing/assets, responsive behavior, accessibility/interaction, content extremes, and intentional divergences. Human approval is a pre-existing deterministic target-bound trace and `approvals/<target_hash>.json` artifact; Pi cannot create it. Record missing approval as blocking.

## Report

Respond with ONLY valid JSON matching `FigmaSupervisorOutput`:

```json
{
  "status": "success",
  "stage": "delegate_codex",
  "ready": false,
  "human_design_approval": null,
  "summary": "Pi connector is unavailable; bounded read-only evidence capture is required.",
  "findings": [],
  "blocking": [],
  "figma_evidence": [],
  "handoff_sections": {},
  "capture_request_id": "",
  "capture_phase_id": "",
  "capture_supervisor_session_id": "",
  "capture_result_hash": "",
  "supervisor_session_id": "<Pi session id>",
  "request": {"request_id": "<id>", "reason": "pi_connector_unavailable", "supervisor_session_id": "<Pi session id>", "target": {"file_key": "<canonical key>", "node_ids": ["<exact id>"], "expected_approval": "Approved", "evidence_categories": ["dimensions_layout"]}, "operations": ["node_metadata"]},
  "artifacts": [],
  "notes_for_next_agent": "Human design approval remains required."
}
```
