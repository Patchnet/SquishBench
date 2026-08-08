# Testing

`test_gate: local` — run the canonical suite before recommending a commit.

## Canonical suite

```bash
npm test
```

That runs Node's built-in test runner over `test/smoke.test.mjs`. There is nothing to install first; SquishBench has no dependencies.

## What the suite checks

The suite is a structural smoke test over the merged tree, not a behavioural test of the app. It covers three surfaces:

**Repo surface** — `package.json` declares MIT plus `start` and `test` scripts, `npm start` serves `app/`, `Version.md` declares `dev_flow: formal` and `test_gate: local`, `LICENSE` and `README.md` are present, and `.github/workflows/ci.yml` runs `npm test` on pull requests.

**App surface** — `app/index.html` exists, is a full standalone document (no visualize `srcdoc` wrapper), links an external stylesheet and an external script, and carries the ball / cow / pizza control hooks. `app/` contains at least one `.css` and one `.js` file, so the page stays split across files rather than collapsing back into one bundle.

**Bench surface** — `prompts/oneshot.md`, `prompts/improve.md`, `outputs/README.md`, and `docs/BENCH.md` are all present.

The app and bench assertions are unconditional by design: they fail loudly on a tree where those pieces are missing, which is what makes `npm test` a real integration gate rather than a rubber stamp. On a partial checkout — a single lane's branch before its siblings are merged — expect those tests to fail until the full tree is assembled.

## Before shipping

Formal Flow: CI runs this exact `npm test` command on every pull request and on pushes to `main`. A red suite blocks the merge. Never fix a failure by weakening an assertion — if a check no longer reflects the contract, change the contract deliberately and say so in the PR.

## Extending the suite

Add new tests to `test/smoke.test.mjs`, or add sibling `*.test.mjs` files under `test/` and widen the `test` script to `node --test test/`. Keep assertions tied to things the project actually promises — file contracts, declared flow settings, control hooks — so failures point at a real regression.
