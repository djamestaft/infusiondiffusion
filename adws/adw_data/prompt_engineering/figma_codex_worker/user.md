# Figma Capture Task

Return only a `CodexFigmaOutput` JSON envelope for the exact request supplied by the deterministic worker. Include exact observed file/node IDs, `Approved` labels, allowlisted call stamps, and at least one non-empty evidence artifact with its SHA-256. Every artifact path is relative to `context_handoff` and begins `figma/<request_id>/`; return sanitized blockers for unavailable facts. Never include raw connector payloads, credentials, headers, or provider errors.

## Report

```json
{"status":"success","summary":"Captured exact node evidence","artifacts":[],"notes_for_next_agent":"Human approval remains required.","capture_status":"complete","failure_code":"","failure_message":"","request":{"request_id":"<id>","reason":"pi_connector_unavailable","supervisor_session_id":"<id>","target":{"file_key":"<key>","node_ids":["<id>"],"expected_approval":"Approved","evidence_categories":["dimensions_layout"]},"operations":["node_metadata"]},"observed_file_key":"<key>","observed_node_ids":["<id>"],"approval_labels":{"<id>":"Approved"},"call_stamps":[{"operation":"node_metadata","file_key":"<key>","node_ids":["<id>"]}],"evidence_manifest":[{"path":"figma/<id>/evidence.md","media_type":"text/markdown","byte_count":1,"sha256":"<sha256>"}],"provenance":{"adw_id":"<id>","phase_id":"<id>","request_id":"<id>","supervisor_session_id":"<id>"},"result_hash":"<sha256>"}
```
