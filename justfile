set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

# Export the input as data rather than interpolating it into a shell command.
pr-gate $PR_GATE_NUMBER:
    @node scripts/pr-gate.mjs
