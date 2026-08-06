# Storefront Build Task

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Implement the approved storefront work described by the plan and specialist artifacts, then emit your report.

## Report

Respond with ONLY valid JSON matching `BuildOutput`:

```json
{
  "status": "success",
  "summary": "<one sentence describing what you built>",
  "changed_files": ["<path actually changed>"],
  "artifacts": [],
  "commit_message": "<imperative one-line git subject>",
  "notes_for_next_agent": "<verification and residual-risk guidance>"
}
```
