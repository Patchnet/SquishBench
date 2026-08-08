# SquishBench

A browser fidget toy that doubles as a bake-off harness for coding agents.

SquishBench has two jobs:

1. **Reference app** — a static, dependency-free stress reliever you open in a browser. Two disembodied hands hold a floating squishy object; you grab, pull, squash, twist, and toss it. Pick between a ball, a cow, and a pizza.
2. **Bake-off harness** — a frozen prompt plus a versioned `outputs/` tree, so you can hand the same brief to different models and orchestration setups and compare what comes back.

The app is deliberately small and framework-free: plain HTML, CSS, and JavaScript. That keeps the eval honest — nothing is hidden behind a build step or a component library.

## Quick start

Requires Node.js 24 or newer.

```bash
npm start
```

Open `http://localhost:4173`. No install step — SquishBench has no dependencies, and `npm start` fetches a static file server on demand.

You can also open `app/index.html` directly in a browser.

## Controls

| Action | Result |
|---|---|
| Move the pointer | The right hand follows it; the left hand stays anchored to the object |
| Grab and pull away | Stretches the squishy |
| Push toward the object | Squashes it |
| Move sideways while holding | Twists it |
| Right-click | Tosses the object between hands |
| Ball / Cow / Pizza buttons | Swap the object |

## Repository layout

| Path | What lives there |
|---|---|
| `app/` | The reference app — `index.html`, styles, and scripts |
| `prompts/` | The frozen one-shot brief and the iterative improvement template |
| `outputs/` | One directory per bake-off run, each with a `meta.json` |
| `docs/BENCH.md` | How to run a bake-off and file the result |
| `docs/TESTING.md` | The canonical local test suite |
| `sources/` | Provenance — the original mockup this app was derived from |

## Running a bake-off

Hand `prompts/oneshot.md` to a model or an agent harness, collect what it produces, and drop it into `outputs/<run-name>/` alongside a `meta.json`. See `docs/BENCH.md` for the full procedure and `outputs/README.md` for the naming convention and schema.

`outputs/reference-codex-2026-07-21/` is the provenance mockup the reference app came from. It is labeled reference material, not a scored competitor.

## Development

This repo runs Formal Flow: work happens on a branch, lands through a pull request, and CI runs the same suite you run locally.

```bash
npm test
```

See `docs/TESTING.md` for details.

## License

MIT — see [LICENSE](LICENSE).
