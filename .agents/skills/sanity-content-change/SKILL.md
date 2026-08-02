---
name: sanity-content-change
description: Safely change Sanity schemas, GROQ queries, previews, generated types, and cache behavior.
---

# Sanity content change

1. Confirm the data is editorial; route price, inventory, discount, cart, customer, or order data to Shopify.
2. Inspect existing schema, query projections, generated/application types, Studio previews, and consuming components.
3. Make additive schema changes by default. For breaking changes, document migration and rollback before editing.
4. Update GROQ projections explicitly, regenerate the extracted schema and types, and ensure missing content has a deliberate fallback.
5. Verify published mode, draft mode, Visual Editing, Studio rendering, metadata, and cache invalidation.
6. Never expose `SANITY_API_READ_TOKEN`, preview secrets, or webhook secrets to the browser.
7. Add contract/component tests and update authoring documentation when editor behavior changes.
