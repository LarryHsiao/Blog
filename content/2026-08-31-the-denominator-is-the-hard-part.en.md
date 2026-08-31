+++
date = "2026-08-31"
title = "The Denominator Is the Hard Part — Measuring Whether an Agent Keeps the Rules"
slug = "the-denominator-is-the-hard-part"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The previous post, [The Only Gate That Waits](/en/the-only-gate-that-waits/), ended on an admission. I can't prove the model holds all eight stages. So the next step isn't more rules. It's measuring how much of this actually gets kept.

This is what I learned from measuring. Conclusion up front: scoring is easy. Deciding the denominator is hard. I changed the denominator three times. The score climbed from 11% to 24%. And the model's behaviour didn't change. Not once.

### The method itself is plain

Every rule leaves a trace you can find in a session transcript. Whether the gate block was written. Whether the review's verdict line showed up. Whether the test run came back with an error flag. So the method's simple — pull every session's transcript, cut it into segments, ask of each one: should this rule have fired here? Did it?

Numerator: segments where it fired. Denominator: segments where it should have. The numerator almost never goes wrong — a trace is a trace. Every pitfall lives in the denominator. Every single one.

### First correction: drop the segments with nothing to review

The earliest version counted every segment that touched the tree as "owed a review". Looking closer — 163 segments had run nothing but `git commit`, `mkdir`, `install.sh`, `tee`, that kind of thing. Thirty percent of the denominator. Compliance rate: 1%.

Of course it was 1%. Nothing in those segments to review. The rule was never meant to fire there in the first place. Dropped them. Rate moved from 11% to 15%.

### Second correction: the segments were cut wrong

Noise gone. Something still off, though. Of 390 segments owed a review, 58 had the verdict line inside the segment — just not after the last edit.

Traced it down. The segment boundaries were wrong. Two adjacent tasks were folded into one. First one finished, got reviewed, got its verdict. Then the second one started editing and ended without a review. Read as one segment, there's no verdict after the final edit. Scores as a miss.

But that reading's exactly backwards. The reviewed task gets penalised. The unreviewed one hides in the same segment and never gets counted at all. Absurd, honestly.

The fix: the moment a verdict's written, the segment closes. Rate moved from 15% to 24%.

### Three rises in the score, zero changes in behaviour

Put the three numbers side by side:

| Denominator | Rate | Model behaviour |
|---|---|---|
| command-only segments included | 11% | — |
| command-only segments removed | 15% | unchanged |
| segment closes when the verdict lands | 24% | still unchanged |

Every time, the denominator got truer. Discipline didn't get better. That's the spine of this whole post — see an "agent compliance rate" number, don't trust it yet. Ask what counts as the denominator. Ask when it last changed. A score with no denominator history can't be compared to last month's. Full stop.

### Don't let the summariser grade itself

Second class of pitfall's got nothing to do with the denominator. It's about who's grading whom.

The rule goes like this: if the review finds something, fix it first. Only then write the done report, close it with a literal `Compliance Review: PASS`. The rule itself's fine. But if the measurement reads that line — it can only ever be 100%. Because the line's written by the very main thread being reviewed. And the main thread always waits until it believes it's passed. That's not measurement. That's asking yourself and answering yourself.

So the verdict has to come from the reviewer's own transcript. What the dispatched agent — read-only, no shared memory with the main thread — actually said. The main thread's line is a claim. The reviewer's record is the evidence.

Same trap, different coat, on the gate's acceptance rate. Gate stops and waits, user answers by picking one of a few offered options. Count "picked one" as "accepted the plan" every time, and a tenth of the denominator's structurally pinned at 100% — however bad the plan actually is.

### Structural is not the same as deterministic

Split the judgments into two tiers. Structural reads only the `tool_result` error flag, never parses the output string. Can't be broken by a format change. Sounds dependable.

Then the trap from the previous post came back. This time with a number attached.

```sh
flutter analyze 2>&1 | tail -6
```

No `set -o pipefail`, and the shell reports `tail`'s exit status. Across the transcripts — 99% of piped lint runs reported clean. Didn't matter what the linter actually caught. Can't count these as passes. Gave them their own bucket. Unmeasurable. Printed beneath the row, excluded from both sides.

Same row turned up a few smaller ones too:

- 27 `command -v` probes slipped into the denominator. Each one "failing" only because the tool wasn't installed on that machine.
- Match `tsc` as a bare word, and `grep -n tsc file` counts as a type check too. Borrows grep's exit status to fabricate a pass.
- Coverage's skewed. The output most often trimmed belongs to the largest test suite. So the measured population leans toward small, fast checks.
- Only the first run in a segment counts. A re-run describes the repair. Not the quality of the work.

Structural means it doesn't rely on the model's reading. Doesn't mean it can't be wrong.

### When you don't know, don't guess

Third class: what does the measurement do when it's unsure. My answer — count it on neither side, record it separately.

Gate got written, user never replied, session ended. Not acceptance. Not rejection either. Recorded as `abandoned`. Silence isn't a verdict on the plan.

User reports a bug, but which "done" it belongs to is unclear — drop it. Don't assume it points at the most recent one. That row honestly admits it overestimates as a result, and prints the unattributed count underneath.

Throwing away data hurts. But one wrongly assumed attribution tilts the whole row in the wrong direction. And you can't even see it happening. That's the part that worries me.

### Two tiers of confidence — don't average them

Two tiers, as I said. Structural reads exit status. Heuristic hands a stretch of transcript to a model, asks it to judge intent (cached per session and turn, so it's not asked twice).

Not equally trustworthy, the two. So the headline reports two numbers, not one average pretending to be certain. There's a split by model too — Opus, Sonnet, Fable, each in their own column. "Models forget rules" was always a claim about models. Blend them together and you lose the difference.

<img src="/adherence-pulse.png" alt="The compliance dashboard: headline number, per-model trend lines, and beneath each row the abandoned and unattributed counts kept out of the denominator"/>

*The dashboard as of 2026-08-31. The small print under each row — that's what got kept out of the denominator. The compliance-review row had reached 37% by the time I wrote this.*

### Honest caveats

Three things, first.

The heuristic half — that's a model judging a model. Better than nothing. But its denominator's mine to define too.

The lint row's denominator is thinnest right now. Don't read short-term movement there as a trend.

And these ratios still aren't proof of discipline. What they prove is whether a trace got left. A rule can be kept without leaving a trace. A trace can be left without the rule actually being kept. I keep having to remind myself of that.

### One line to close

Want to know if an agent keeps the rules? Don't look at the score first. Ask three things — what's the denominator, who's grading whom, what does it do when it doesn't know. Only once all three have answers does the number start meaning anything at all.
