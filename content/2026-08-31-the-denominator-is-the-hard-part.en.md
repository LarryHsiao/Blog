+++
date = "2026-08-31"
title = "The Denominator Is the Hard Part — Measuring Whether an Agent Keeps the Rules"
slug = "the-denominator-is-the-hard-part"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The previous post, [The Only Gate That Waits](/en/the-only-gate-that-waits/), ended on an admission: I can't prove the model holds all eight stages, so the next step isn't more rules — it's **measuring** how much of this actually gets kept.

This post is what I learned from measuring. The conclusion up front: **scoring is easy; deciding the denominator is hard.** I changed the denominator three times, the score climbed from 11% to 24%, and the model's behaviour did not change once.

### The method itself is plain

Every rule leaves a trace that can be found in a session transcript: whether the gate block was written, whether the review's verdict line appeared, whether the test run came back with an error flag. So the method is just this — pull every session's transcript, cut it into segments, and ask of each segment: *should this rule have fired here? Did it?*

The numerator is the count of segments where it fired. The denominator is the count where it should have. The numerator almost never goes wrong, because a trace is a trace. **Every pitfall lives in the denominator.**

### First correction: drop the segments with nothing to review

The earliest version counted every segment that touched the tree as "owed a review". Looking closer, 163 segments had run nothing but `git commit`, `mkdir`, `install.sh`, `tee` and the like — thirty percent of the denominator, with a compliance rate of 1%.

Of course it was 1%. There was nothing in those segments to review; the rule was never meant to fire there. Dropping them moved the rate from **11% to 15%**.

### Second correction: the segments were cut wrong

With the noise gone, something was still off. Of 390 segments owed a review, 58 had the verdict line **inside the segment — just not after the last edit.**

Tracing it down, the segment boundaries were wrong. Two adjacent tasks were being folded into one: the first finished, was reviewed, got its verdict; then the second started editing and ended without a review. Read as one segment, there was no verdict after the final edit, so it scored as a miss.

But that reading is **exactly backwards**: the reviewed first task was penalised, and the unreviewed second task hid inside the same segment and was never counted at all.

The fix: the moment a verdict is written, the segment closes. That moved the rate from **15% to 24%**.

### Three rises in the score, zero changes in behaviour

Put the three numbers side by side:

| Denominator | Rate | Model behaviour |
|---|---|---|
| command-only segments included | 11% | — |
| command-only segments removed | 15% | unchanged |
| segment closes when the verdict lands | 24% | still unchanged |

Each time the denominator became truer; discipline did not improve. This is the spine of the whole post: **when you see an "agent compliance rate", ask what counts as the denominator, and when it last changed.** A score with no denominator history cannot be compared with last month's.

### Don't let the summariser grade itself

The second class of pitfall isn't about the denominator. It's about who is grading whom.

The rule reads like this: if the review finds something, fix it first; only then write the done report, and close it with a literal `Compliance Review: PASS`. The rule itself is fine. But if the measurement reads **that line**, it can only ever be 100% — because the line is written by the very main thread being reviewed, and the main thread always waits until it believes it has passed.

So the verdict has to be read from **the reviewer's own transcript**: what the agent that was dispatched — read-only, sharing no memory with the main thread — actually said. The main thread's line is a claim. The reviewer's record is the evidence.

The same trap shows up in a different guise on the gate's acceptance rate. When the gate stops and waits, the user answers by picking one of a few offered options. If "picked one" is always counted as "accepted the plan", then a tenth of the denominator is structurally pinned at 100%, however bad the plan.

### Structural is not the same as deterministic

I split the judgments into two tiers. A **structural** judgment reads only the `tool_result` error flag and never parses the output string — so a format change cannot break it. That sounds dependable.

Then the trap from the previous post came back, this time carrying a number:

```sh
flutter analyze 2>&1 | tail -6
```

Without `set -o pipefail`, the shell reports `tail`'s exit status. Across the transcripts, **99% of piped lint runs reported clean**, regardless of what the linter caught. These cannot count as passes. I gave them their own bucket — *unmeasurable* — printed beneath the row and excluded from both sides.

The same row turned up several smaller ones:

- 27 `command -v` probes had slipped into the denominator, each one "failing" only because the tool wasn't installed on that machine.
- If the check matches `tsc` as a bare word, `grep -n tsc file` counts as a type check too — and borrows grep's exit status to fabricate a pass.
- Coverage is skewed: the output most often trimmed belongs to the largest test suite, so the measured population leans towards small, fast checks.
- **Only the first run in a segment counts.** A re-run describes the repair, not the quality of the work.

Structural means *doesn't rely on the model's reading*. It does not mean *cannot be wrong*.

### When you don't know, don't guess

The third class: what the measurement does when it is unsure. My answer is to count it on neither side, and record it separately.

- The gate was written, the user never replied, and the session ended — that is neither acceptance nor rejection. It's recorded as `abandoned`. **Silence is not a verdict on the plan.**
- The user reports a bug, but which "done" it belongs to is uncertain — drop it, rather than assuming it points at the most recent one. That row then honestly admits it **overestimates** as a result, and prints the count of unattributed reports beneath it.

Throwing data away hurts. But one wrongly assumed attribution tilts the whole row in the wrong direction, and you can't see it happening.

### Two tiers of confidence — don't average them

As mentioned, judgments come in two tiers: **structural** reads exit status; **heuristic** hands a stretch of transcript to a model to judge intent (cached per session and turn, so it isn't asked twice).

The two are not equally trustworthy, so the headline reports two numbers instead of one average pretending to be certain. There's also a split by model — Opus, Sonnet, Fable each in their own column — because "models forget rules" was always a claim about models, and blending them hides the difference.

<img src="/adherence-pulse.png" alt="The compliance dashboard: headline number, per-model trend lines, and beneath each row the abandoned and unattributed counts kept out of the denominator"/>

*The dashboard as of 2026-08-31. The small print under each row is what was kept out of the denominator; the compliance-review row had reached 37% by the time this was written.*

### Honest caveats

Three things first:

- The heuristic half is a model judging a model. Better than nothing, but its denominator is also mine to define.
- The lint row's denominator is currently the thinnest. Don't read short-term movement there as a trend.
- **These ratios are still not proof of discipline.** What they prove is whether a trace was left. A rule can be kept without leaving a trace, and a trace can be left without the rule being truly kept.

### One line to close

To know whether an agent keeps the rules, don't look at the score first. Ask three things: what the denominator is, who is grading whom, and what it does when it doesn't know. Only when all three have answers does the number begin to mean anything.
