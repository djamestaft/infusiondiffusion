# INF-46 — Mobile navigation focus

Devon reported intermittent gold outlines on the mobile logo and hamburger after
touch interaction on 17 September 2026. Navigation deliberately focuses the
menu logo on opening and restores focus to the opener on closing. A retained
browser focus-visible heuristic can paint keyboard treatment during these
scripted focus moves.

Fresh touch interactions passed in current Chromium and WebKit. A deterministic
retained-heuristic reproduction delivered a touch pointer event while retaining
the browser keyboard state; before the fix WebKit showed a solid outline. This
is regression coverage of the reported condition, not a claim to reproduce every
physical iPhone/browser-history sequence.

## Contract

- Logo links and open/close menu buttons suppress outlines after pointer input.
- Any unmodified keyboard input restores their existing focus-visible treatment.
  The listener runs at document capture so Tab entering the header works too.
- Focus itself remains intact: drawer entry, wrapping, Escape, return to opener
  and responsive resize behavior are preserved. No blur-on-click workaround.
- Account avatar, other links, shared geometry and visual tokens are unchanged.
- Figma's existing default and keyboard-focus designs remain valid: this is an
  input-state correction, not a replacement design. Storybook's
  `Components/Navigation/TouchThenKeyboard` records the transition.

## Evidence and limits

- Retained-state test failed with `outline-style: solid` before the fix, then
  passed with `none`; keyboard restoration passed.
- Two navigation focus regressions passed in WebKit 26.5 and Chromium.
- 35 Navigation Storybook tests passed; lint, TypeScript, 381 unit/integration
  tests, Storybook build and Next build passed.
- Independent read-only review found no blockers. Default browser CI projects
  use Chromium; WebKit was run separately against this change.
- Actual iPhone preview acceptance and human merge remain pending. Local touch
  and keyboard screenshots are retained in the task worktree's
  `output/navigation-focus` directory.
