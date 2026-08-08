# reference-codex-2026-07-21

The Codex visualize-skill mockup that SquishBench came from. **Not scored.**

`index.html` is a byte-identical copy of `sources/stress-reliever.html`. Open it directly in a
browser — the toy is inside a sandboxed `srcdoc` iframe and runs without a server.

## Why it is unscored

- It predates `prompts/oneshot.md`. It was produced from a conversational ask, not the eval
  contract, so comparing it to contract entrants would be comparing answers to different
  questions.
- The model behind the visualize skill was not recorded, so there is nothing to attribute a
  score to.
- It is the thing the contract was written from. Scoring it would be grading the answer key.

## What it established

Behaviors that `prompts/oneshot.md` now requires, and that the reference app under `app/`
preserves:

- Left hand anchored on the left of the stage; right hand tracks the pointer.
- Grab on primary pointer button; pull stretches along the grip axis, push squashes it,
  perpendicular motion shears it, and the object rotates to follow the hand-to-hand line.
- Release springs back through an overshoot wobble.
- Right-click tosses through an arc to the other hand, alternating direction, spinning in
  flight.
- Slow idle drift with a breathing deformation when nothing is held.
- Ball / cow / pizza picker, all three sharing one physics model.
- Live status readout — floating, gripped, stretched, squished, twisted, released, airborne,
  caught.
- `prefers-reduced-motion` drops the idle drift and flight animation.

## Where it does not meet the contract

Recorded so nobody mistakes these for a passing bar:

- **Single file.** Everything is inlined into one wrapper page with the app in an iframe
  `srcdoc`. The contract requires a real multi-file static site.
- **Runtime network.** Loads floating-ui and lucide from a CDN. The toy works with those blocked,
  but the contract forbids the requests.
- **Visualize chrome.** Carries the skill's design-token block, tooltip layer, and icon
  bootstrap — none of which the toy needs.
- **Touch toss.** Toss is right-click only; there is no touch-reachable equivalent.
