---
name: release-debug
description: Verify a Vercel preview or systematically diagnose a local, preview, or production storefront failure.
---

# Release debug

1. Identify environment, URL, deployment ID, commit SHA, first failure time, and expected behavior.
2. Reproduce through the smallest user path. Capture browser screenshot, console, network requests, `/api/health`, and Vercel build/runtime logs.
3. Trace evidence to the owning layer: Next.js, Sanity, Shopify, Vercel configuration, or external provider.
4. Form one testable hypothesis at a time. Do not edit until the failure mode is established.
5. Verify the fix locally and on a preview with the original reproduction plus adjacent regression checks.
6. For a material production incident, recommend the last known-good Vercel rollback and state impact. Never execute production deployment or rollback without explicit human authorization.
7. Record the root cause and add the missing automated or operational guard.
