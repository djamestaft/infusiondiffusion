# Release Diagnostic Review

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Inspect the plan through the release/runtime boundary, write evidence to `<context_handoff_dir>/release_debug.md`, and report whether implementation can proceed.

## Report

Respond with ONLY valid JSON matching `SpecialistOutput`:

```json
{
  "status": "success",
  "ready": true,
  "summary": "<one-sentence verdict>",
  "findings": ["<diagnostic finding with evidence>"],
  "blocking": [],
  "artifacts": ["<context_handoff_dir>/release_debug.md"],
  "notes_for_next_agent": "<reproduction, verification, and approval guidance>"
}
```
