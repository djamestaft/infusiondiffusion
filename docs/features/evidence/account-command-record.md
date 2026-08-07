# Account entry deterministic command record

| Command                                                                                            | Exit |
| -------------------------------------------------------------------------------------------------- | ---- |
| `corepack pnpm lint`                                                                               | 0    |
| `corepack pnpm typecheck`                                                                          | 0    |
| `corepack pnpm test`                                                                               | 0    |
| `corepack pnpm test:stories`                                                                       | 0    |
| `corepack pnpm build-storybook`                                                                    | 0    |
| `corepack pnpm build`                                                                              | 0    |
| `corepack pnpm exec playwright test tests/e2e/account.spec.ts --project=chromium --project=mobile` | 0    |

| `python3 -m unittest adws.tests.test_figma_handoff_gate` | 1 |

`corepack pnpm check` exited 1 because pre-existing immutable plan records `specs/9507c91e_account-entry-implementation.md` and `specs/9507c91e_account-entry.md` fail repository Prettier; no Account implementation file failed that command.
