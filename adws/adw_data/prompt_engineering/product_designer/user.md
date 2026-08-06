# Product Design Review

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Review the plan from the product-design boundary. For approved Figma work, query the exact nodes through the configured Figma MCP server and write implementation evidence to `<context_handoff_dir>/figma_handoff.md`. Write your review to `<context_handoff_dir>/product_designer.md`, then report whether implementation is ready to begin.

## Report

Respond with ONLY valid JSON matching `SpecialistOutput`:

```json
{
  "status": "success",
  "ready": true,
  "summary": "<one-sentence verdict>",
  "findings": ["<design finding with evidence>"],
  "blocking": [],
  "figma_evidence": ["<context_handoff_dir>/figma_handoff.md"],
  "artifacts": ["<context_handoff_dir>/product_designer.md", "<context_handoff_dir>/figma_handoff.md"],
  "notes_for_next_agent": "<implementation guidance and human gates>"
}
```
