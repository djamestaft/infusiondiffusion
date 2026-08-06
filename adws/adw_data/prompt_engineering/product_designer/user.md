# Product Design Review

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Review the plan from the product-design boundary, write your evidence to `<context_handoff_dir>/product_designer.md`, and report whether implementation is ready to begin.

## Report

Respond with ONLY valid JSON matching `SpecialistOutput`:

```json
{
  "status": "success",
  "ready": true,
  "summary": "<one-sentence verdict>",
  "findings": ["<design finding with evidence>"],
  "blocking": [],
  "artifacts": ["<context_handoff_dir>/product_designer.md"],
  "notes_for_next_agent": "<implementation guidance and human gates>"
}
```
