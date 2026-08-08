# SquishBench improvement prompt

Template for an **iterative** round: the entrant already has a working attempt and gets one
more pass at it.

Iterative rounds are scored separately from one-shot rounds. Never file an iterated result as
`mode: oneshot` — see `docs/BENCH.md`.

Fill the bracketed slots, drop the rest verbatim.

---

You have an existing browser fidget toy: a squishy object floating between two disembodied
hands, grabbable, stretchable, squashable, twistable, and tossable, with a ball / cow / pizza
picker.

The original build contract is in `prompts/oneshot.md`. It still applies in full — nothing in it
is negotiable, and any change that breaks a requirement in it is a regression.

## What to improve this round

[ONE TO THREE SPECIFIC ITEMS. Examples:
 - the release wobble reads as mechanical; make it feel like rubber settling
 - the cow is not recognizable as a cow at a glance
 - twist and stretch fight each other when combined
 - touch users cannot trigger the toss
 - the look is generic purple-gradient demo chrome; pick a clearer material direction
 - the stage reads like a dashboard of cards; simplify to one play surface]

When the ask is visual, raise craft — do not paste a new default theme. The Taste section of
`prompts/oneshot.md` still applies (anti-slop constraints included).

## Constraints

- Same stack: vanilla HTML/CSS/JS, no build step, no runtime network requests.
- Keep the existing file layout unless a split genuinely helps; say so if you change it.
- Do not regress anything that already works. If a fix forces a tradeoff, take it and say which
  tradeoff you took.
- Do not add features that were not asked for in this round.

## Report back

When you are done, list:

1. What you changed, file by file.
2. Anything from the improvement list you did **not** do, and why.
3. Any behavior a reviewer should re-check by hand.

---
