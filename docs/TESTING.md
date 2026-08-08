# Testing

`test_gate: local`

## Canonical suite

```bash
npm test
```

Runs Node's built-in test runner (`test/smoke.test.mjs`). Expand coverage as the reference app and bench harness land.

## Before shipping

With Formal Flow, CI must run the same `npm test` command on pull requests.
