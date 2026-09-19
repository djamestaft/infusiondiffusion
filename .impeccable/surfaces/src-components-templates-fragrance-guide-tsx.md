---
version: 1
slug: "src-components-templates-fragrance-guide-tsx"
primary_target: "src/components/templates/fragrance-guide.tsx"
related_targets: ["src/components/templates/fragrance-guide-consultation.tsx"]
---

19 September 2026 — INF-58 fragrance consultation (delegated preview approval). Figma exploration page 2876:963, introduction 2878:2, question 2880:9, compact 2883:50, mobile 2881:55, narrow 2883:118, results 2885:136 / 2886:143, refinement 2889:195. Intentionally supersedes simultaneous Guide Variation 02; Approved page remains untouched. One native question at a time; ruled answer rows, completed-step navigation, photographic introduction, fixed desktop photograph and decorative topic word. Results show existing Shopify photographs, source reasons and editable preferences. Reset guide returns to the introduction and clears every answer/result/error. Reset occupies its own utility row. Programmatically focused headings have no outline; interactive controls retain visible keyboard focus. Heading/topic transition ±32px over500ms power2.out; answer text y10px over420ms with35ms stagger, hit areas stationary. Text opacity .8→1 preserves contrast throughout. Results y20px over500ms, opacity .85→1. Decorative LERP bounded±8px/±4px, damping160ms; focus anywhere in guide resets it. Reduced motion is immediate. Mobile uses prepaint CSS eligibility, no desktop GSAP import; no late entrance flash. Semantic colors and shared shell unchanged. Source matcher remains notes/character only; other answers are transparently summary-only.
