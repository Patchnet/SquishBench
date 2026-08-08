# Outputs

One directory per bake-off entry. An entry is a frozen snapshot of what a model or harness
produced from a SquishBench prompt — it is never edited after it lands.

Full procedure for running a bake-off and scoring entries: [`../docs/BENCH.md`](../docs/BENCH.md).

## Naming

```
outputs/<kind>-<slug>-<YYYY-MM-DD>/
```

| Part | Rule |
|---|---|
| `kind` | `oneshot`, `am`, `improve`, or `reference` |
| `slug` | lowercase kebab-case identifier for the model or harness |
| `YYYY-MM-DD` | the date the entry was produced, not the date it was filed |

Kinds:

- **`oneshot`** — one model, one turn, `prompts/oneshot.md` verbatim. The headline comparison.
- **`am`** — a multi-lane agent-manager run against the same prompt.
- **`improve`** — an iterative round on top of an earlier entry. Records `parent` in `meta.json`.
- **`reference`** — provenance or inspiration, **never scored**. Sets `"scored": false`.

Two entries on the same date from the same slug get a trailing letter: `-a`, `-b`, `-c`.

Examples:

```
outputs/oneshot-some-model-2026-08-14/
outputs/am-agent-manager-2026-08-14/
outputs/improve-some-model-2026-08-16/
outputs/reference-codex-2026-07-21/
```

## Directory contents

```
outputs/<entry>/
  meta.json     required — see schema below
  index.html    required — the entry point, openable directly in a browser
  styles.css    whatever else the entry produced, as produced
  main.js
  NOTES.md      optional — reviewer notes, known breakage, screenshots
```

Rules:

- Ship the entry **as produced**. Do not fix its bugs, reformat it, or fill in gaps. A broken
  entry that scores badly is a valid result; a repaired one is not a result at all.
- If the producer named its entry point something other than `index.html`, keep the original
  name and point `entry` at it in `meta.json`.
- No `node_modules/`, no build output, no runtime network dependencies. If an entry needs the
  network to run, say so in `notes` — that is a scoring fact, not a packaging problem to solve.
- Public-safe text only: no emails, hostnames, tokens, internal identifiers, or absolute
  operator paths anywhere in an entry, including `NOTES.md` and `meta.json`.

## `meta.json` schema

```json
{
  "model": "string",
  "harness": "string",
  "mode": "oneshot | am-run",
  "date": "YYYY-MM-DD",
  "notes": "string"
}
```

Required fields:

| Field | Type | Meaning |
|---|---|---|
| `model` | string | The model that produced the work, as publicly named. `"unknown"` if genuinely not known. |
| `harness` | string | What drove the model — e.g. a CLI name, an IDE agent, a web chat, a multi-lane orchestrator. |
| `mode` | `"oneshot"` \| `"am-run"` | `oneshot` for a single-turn single-model run, `am-run` for a multi-lane orchestrated run. |
| `date` | string | ISO date `YYYY-MM-DD` the work was produced. Matches the directory suffix. |
| `notes` | string | Anything a reader needs to interpret the entry: deviations, failures, manual steps, why it is unscored. |

Optional fields:

| Field | Type | Meaning |
|---|---|---|
| `entry` | string | Entry point filename if not `index.html`. |
| `prompt` | string | Repo-relative path to the prompt used, e.g. `prompts/oneshot.md`. |
| `scored` | boolean | Defaults to `true`. Set `false` for references and anything excluded from comparison. |
| `parent` | string | For `improve` entries, the directory name of the entry it builds on. |
| `lanes` | number | For `am-run`, how many parallel lanes the run used. |
| `turns` | number | How many model turns the entry took. `1` for a true one-shot. |
| `score` | object | Rubric scores once reviewed — see `docs/BENCH.md` for the dimensions. |

`mode` stays a two-value enum on purpose: everything in `outputs/` is either a single-model
one-shot or an orchestrated run. `kind` in the directory name carries the finer distinction
(`improve`, `reference`), and `scored` carries whether it counts.

Example:

```json
{
  "model": "some-model-v1",
  "harness": "some-cli",
  "mode": "oneshot",
  "date": "2026-08-14",
  "prompt": "prompts/oneshot.md",
  "turns": 1,
  "scored": true,
  "notes": "Refused to draw the cow with CSS and used an emoji instead. Toss works; touch toss missing."
}
```

## Viewing an entry

`npm start` serves `app/` — the reference app, not `outputs/`. To view an entry:

```bash
npx --yes serve outputs/<entry> -l 4174
```

Or open its `index.html` directly. Entries that rely on ES modules need the server; plain
scripts open fine from the filesystem.
