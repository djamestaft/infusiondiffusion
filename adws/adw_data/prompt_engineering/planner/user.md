# Plan Task

## Variables

### prompt

{{prompt}}

### previous_envelope

{{previous_envelope}}

### context_handoff_dir

{{context_handoff_dir}}

## Task

Plan the work described in `prompt`. The plan must include: acceptance criteria; applicable project skills and why they trigger; system ownership boundaries; exact file ownership; accessibility and content-extreme coverage; deterministic verification commands; preview/rollback evidence where relevant; human approvals required before implementation, merge, publish, production, or rollback; and residual risks.

Select the smallest specialist routing that covers the work:
- `implementation_owner`: `storefront_engineer` for Next.js/UI/Storybook implementation, `content_commerce_engineer` for Sanity/Shopify/server commerce implementation, otherwise `builder`. Choose exactly one writing owner; never create concurrent writers implicitly.
- `advisory_specialists`: include `product_designer` when UI direction, interaction, responsive states, or reusable components need design shaping; include `browser_release_debugger` for preview/deployment/runtime diagnosis or verification. Otherwise use an empty list.
- `review_owner`: use `quality_reviewer` for substantive implementation; use `reviewer` for small generic changes.

1. Write the full plan to `<context_handoff_dir>/plan.md` — this is the copy the builder reads.
2. Copy that file into the repo under `specs/`:
   - **List `specs/` before you pick the name.** A session that plans more than once reuses its `<adw_id>`, so the obvious name may already be taken.
   - Base name: `specs/<adw_id>_<slug>.md`, where `<adw_id>` is the session directory name inside `context_handoff_dir` (`.../sessions/<adw_id>/context_handoff`) and `<slug>` is two to four kebab-case words naming the work.
   - If a file with that name already exists, use `specs/<adw_id>_<slug>_v2.md`, then `_v3`, and so on until the name is free. **Never overwrite an existing spec** — the earlier plan is the record of what was asked for then.
   - **Copy it, do not retype it.** One bash call does the whole step:
     `mkdir -p specs && cp "<context_handoff_dir>/plan.md" "specs/<adw_id>_<slug>.md"`
     Writing the plan a second time through `write` re-emits every line you already wrote, which costs the whole document again in output tokens and lets the two copies drift.
3. Emit your `Report` JSON, declaring BOTH paths in `artifacts`.

## Report

Respond with ONLY valid JSON matching `PlanOutput` — no prose before or after:

```json
{
  "status": "success",
  "summary": "<one sentence describing the plan>",
  "artifacts": ["<context_handoff_dir>/plan.md", "specs/<adw_id>_<slug>.md"],
  "commit_message": "<imperative one-line git subject for committing THIS PLAN DOCUMENT, not the work it describes — e.g. 'Add spec for the /health endpoint'>",
  "implementation_owner": "builder",
  "advisory_specialists": [],
  "review_owner": "reviewer",
  "notes_for_next_agent": "<what the builder must know>"
}
```

Both `artifacts` entries are the paths you ACTUALLY wrote, `_v2` suffix and all. Gates open these files — a name you meant to use fails them.
