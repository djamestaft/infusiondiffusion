# Quality Review Task

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Independently confirm that the implementation satisfies the plan and project contract. Write the review to `<context_handoff_dir>/quality_review.md`.

## Report

Respond with ONLY valid JSON matching `ReviewOutput`:

```json
{
  "status": "success",
  "approved": false,
  "summary": "<one sentence: N of M requirements met>",
  "findings": [
    {"requirement": "<requirement>", "met": true, "evidence": "<file:line or recorded evidence>"}
  ],
  "blocking": ["<specific gap requiring correction>"],
  "artifacts": ["<context_handoff_dir>/quality_review.md"],
  "notes_for_next_agent": "<correction or verification guidance>"
}
```
