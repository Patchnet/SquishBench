# Running a bake-off

SquishBench asks one question: **given the same brief, what does a model or an agent harness
actually build?**

The brief is a browser fidget toy — a squishy object between two disembodied hands that you can
grab, stretch, squash, twist, and toss. It is a good probe because it is small enough to one-shot,
but it rewards taste, physics intuition, and follow-through in ways a CRUD app does not. Two
entrants can both "work" and be obviously different in quality.

## The pieces

| Path | What it is |
|---|---|
| [`prompts/oneshot.md`](../prompts/oneshot.md) | The eval contract. Every one-shot entrant gets this text and nothing else. |
| [`prompts/improve.md`](../prompts/improve.md) | Template for a second, iterative pass over an existing entry. |
| [`outputs/`](../outputs/) | Frozen entries, one directory each. Naming and `meta.json` schema in [`outputs/README.md`](../outputs/README.md). |
| [`app/`](../app/) | The maintained reference implementation. Not an entrant. |
| [`sources/stress-reliever.html`](../sources/stress-reliever.html) | The original mockup the contract was written from. Snapshot filed as `outputs/reference-codex-2026-07-21/`. |

`app/` and the reference snapshot are both excluded from scoring. `app/` is maintained over time,
so it has an unbounded head start; the snapshot predates the contract. Neither is a fair
comparison against a single-turn entrant.

## Fairness rules

These are what make entries comparable. Break one and the entry is not a one-shot.

1. **Prompt verbatim.** Paste `prompts/oneshot.md` between the rulers, unchanged. No preamble,
   no "make it really good", no hints about what other entrants did.
2. **One turn.** No follow-ups, no "keep going", no answering the model's questions. If it asks
   something and stops, that is the result — file it and say so in `notes`.
3. **No human repair.** File what came out. Do not fix its bugs, reformat it, or add the file it
   forgot. A broken entry scores badly; a repaired entry is not a measurement.
4. **No preloaded context.** Fresh session. The entrant must not have the repo, `app/`, or the
   reference mockup in context — otherwise it is copying, not building.
5. **Same contract version.** If `prompts/oneshot.md` changes, note the change here and treat
   earlier entries as belonging to the older contract. Do not silently compare across versions.

### Contract changelog

| Date | Change |
|---|---|
| 2026-08-08 | Added **Taste** section to `prompts/oneshot.md` (anti-slop cues; look still model-chosen). Scoring moved from 7×3=21 to 8×3=24 with a **Taste** dimension. `improve.md` examples updated. |

Multi-lane runs get one deliberate exemption, covered below.

## Filing an entry

1. Create `outputs/<kind>-<slug>-<YYYY-MM-DD>/` per [`outputs/README.md`](../outputs/README.md).
2. Drop the produced files in as-is.
3. Write `meta.json` — `model`, `harness`, `mode`, `date`, `notes` are required.
4. Record anything unusual in `notes`: refusals, truncation, a stopped-and-asked-a-question run,
   manual steps you had to take to even open it.
5. Check it for public-safe text before committing — no emails, hostnames, tokens, internal
   identifiers, or absolute operator paths.
6. Open it and score it.

## Scoring

Eight dimensions, 0–3 each, **24** total. Score by playing with the entry, not by reading its
code — except for the code-quality dimension.

| # | Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| 1 | **Runs** | Blank page or fatal error | Loads with console errors or needs a manual fix | Loads clean, minor warnings | Loads clean, no errors, no runtime network requests |
| 2 | **Core deformation** | No grab | Grab works, deformation is crude or unbounded | Stretch and squash both read correctly | Stretch, squash, and twist compose cleanly and stay bounded |
| 3 | **Two-hand model** | One hand or none | Both hands present, wrong roles | Left anchored, right tracks pointer | Correct roles plus a toss that arcs and alternates |
| 4 | **Objects** | Fewer than three | Three, but cow or pizza unrecognizable | All three recognizable | All three recognizable and characterful, sharing one physics model |
| 5 | **Feel** | Static | Movement, no easing | Idle drift and release wobble present | Motion has weight — overshoot, settle, spin all read as physical |
| 6 | **Taste** | Unstyled or AI-default chrome (purple gradient, emoji-only craft, card soup) | Generic but intentional | Clear direction, minor clichés | Distinct composition; material reads; no anti-slop violations from the Taste section of the oneshot |
| 7 | **Code quality** | Single file | Split, but tangled | Clean split, readable | Clean split, clear state model, no dead code, comments where they earn it |
| 8 | **Input and a11y** | Mouse only | Touch partly works | Touch, keyboard picker, reduced-motion honored | All of that plus labeled controls, live status, no stuck states on cancel or blur |

Record the result in `meta.json`:

```json
"score": {
  "runs": 3,
  "deformation": 2,
  "hands": 3,
  "objects": 1,
  "feel": 2,
  "taste": 2,
  "code": 2,
  "input": 1,
  "total": 16,
  "reviewer_notes": "Pizza reads as an orange circle. Twist inverts past ~60deg."
}
```

**Taste** is scored from the oneshot's Taste section: direction is free; purple-gradient /
emoji-only / card-soup defaults lose points. Wall-clock is still not scored — put it in `notes`
if it matters. Entries filed under the older 21-point rubric stay comparable only within that
contract version.

Scoring is a judgement call. The rubric exists so two reviewers land within a point or two of
each other, not to remove the judgement.

## Comparing a multi-lane run against a single model

The interesting comparison is not "which model is better" — it is **whether splitting the work
across parallel agents beats one model doing it in one pass.** That is what `mode: "am-run"`
entries are for.

Set it up so the only variable is orchestration:

- Same contract. The multi-lane run gets `prompts/oneshot.md` too.
- Same model class across lanes, matching the one-shot entrant. Otherwise you are measuring the
  model, not the orchestration.
- Fresh workspace, no reference material in context.
- Record `lanes` in `meta.json`.

**The exemption:** a multi-lane run is allowed the coordination its harness normally does — a
planning pass, per-lane scopes, an integration step that reconciles the lanes' work. That is the
thing being tested. What it is *not* allowed is human repair (rule 3) or extra briefing beyond the
contract (rules 1 and 4). Write down in `notes` exactly what the harness did on its own, because
that is the variable.

Score it on the same 24 points, then read the gap by dimension rather than by total:

- **Code quality and objects up, feel down** — the usual multi-lane signature. Parallel work
  covers more surface area but nobody owned the overall touch.
- **Feel up, code quality down** — one lane got the physics right and integration got messy.
- **Runs down** — lanes produced work that did not compose. Integration cost, not model quality.
- **Totals close, dimensions scattered** — orchestration moved effort around rather than adding
  it. Worth saying so plainly.

A multi-lane run that scores the same as a one-shot for several times the tokens is a real
finding. File it and say it.

## Iterative rounds

To measure whether an entrant can take direction, run `prompts/improve.md` on an existing entry
and file the result as a new `improve-` entry with `parent` pointing at the original. Never
overwrite the original — the delta is the whole point.

Iterated entries are compared against their own parent, not against one-shot entries.

## Reporting

A comparison write-up should carry, at minimum:

- The contract version used (link the commit if it has changed).
- Every entry's `model`, `harness`, `mode`, and total.
- The per-dimension table, not just totals — the totals hide the interesting part.
- What each entry got wrong, in one line each.
- Anything that made a run non-comparable, stated up front rather than buried.
