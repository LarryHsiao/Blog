+++
date = "2026-08-29"
title = "The Only Gate That Waits — Eight Stages of One Agent Task"
slug = "the-only-gate-that-waits"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The previous post, [Put the Plan on the Ticket](/en/put-the-plan-on-the-ticket/), was about where an agent's state should live. Landed on lifting it onto the issue tracker's comment thread. But a ticket only records the handoff between stages — the plan, the approval, the PR, the merge. How one task runs on the inside? The ticket can't reach that.

This post is about the inside.

And let's be plain about it. The most common failure I see from an agent isn't writing wrong code. It's doing something you never asked for. Then telling you it's done.

### "Are you sure?" is not a gate

Obvious defence: make the agent ask before every move. Fails. And it fails quietly — ask often enough, the human starts clicking yes without reading. The gate's still on the screen. It just doesn't stop anything anymore.

The real question was never how many times it asks. It's whether, at the moment you're asked, you actually have enough to answer.

### Eight stages, one of them waiting

What I do now: cut the whole task into eight stages. Only the third one stops for a human.

```
1 gauge → 2 acceptance → 3 gate〔waits〕→ 4 previews
                                            ↓
8 done ← 7 fresh verify ← 6 compliance ← 5 implementation loop
```

Nobody's standing over the other seven. That's the model's own discipline. Or nothing.

### What the gate looks like

At the one place it stops, four fields come out:

```
Size ▰▰▱ medium — one line: how wide, how deep, how hard to undo
Acceptance:
- one observable outcome
Non-goals: what this turn will deliberately not touch
Changes: which files, and the intent
```

Each one earns its place.

The gauge reads three axes — reach, depth, reversibility. And size isn't scope. A narrowly worded request can still be brutally heavy.

Acceptance gets written as outcomes, not actions. "The empty list renders the placeholder." Not "render the placeholder." Why the difference matters: an action can be unilaterally declared complete. An outcome can't.

Non-goals is a field, not a flourish. It's the line the later review treats as the one a diff must not cross. Write `none` when scope's unambiguous — don't pad it just to fill the slot.

Changes names the files and the intent. So you know what's about to happen.

What the four fields really buy you: you get to settle the whole turn in one answer. There's only one gate because a gate is expensive. You nod once, at the moment your information is most complete.

### The other seven run on discipline — and discipline decays

Here's the problem. Models forget rules. Cheaper ones especially.

And they forget in a specific way. A rule written at the top of a config file has, by turn forty, been pushed to the edge of the context. It wasn't violated. It just isn't in view anymore. A rule loaded once decays over a conversation — and that's got little to do with how clever the model is.

My fix is dumb. But it works. Re-inject every turn. On each user message, a hook pastes the gate's spec and the review's trigger right back into context. The rules stop being an opening statement. They become background noise instead.

Least impressive part of the whole setup. Also the most effective.

### Three edges that lead backwards

If you take one thing away, make it these three:

```
a step outgrew its gauge  ──→ back to the gauge   (not onward through it)
verification diverged     ──→ back to the code    (not to the test)
the review found something ──→ back to the code, before the re-run
```

First one. The word you gave covers the work as it was described to you. Not what it later grew into. Wider reach, deeper thought, harder to undo — any one of those exceeding the gauge, and you stop, re-gauge, wait for the word again. Discovering halfway through that it's become a different job, and just carrying the old permission forward anyway — that's the most common way I've watched things run off the road. By far.

Second. Result diverges from the plan? Go back to the code. Not the test. Bending a test until it passes is the cheapest shortcut there is. Also the most lethal. Turns the light green without making anything actually right.

Third. Review findings get mended before the fresh verification. Never after. Why — next section.

### The last gate: re-run it in this turn

"The tests were green three messages ago" — doesn't count.

The evidence has to come from the same turn as the claim it backs. Change something after that green run, and the run no longer describes the tree you actually have. Reporting done without a re-run in the current turn isn't a fact. It's a guess wearing a fact's clothes.

One small trap, high-yield, while we're here:

```sh
set -o pipefail; flutter analyze 2>&1 | tail -6
```

Without that leading `set -o pipefail`, the shell reports `tail`'s exit status. And `tail` succeeds no matter what the analyzer found. So the check reads as passing forever. This belongs in a written rule. Otherwise you'll rediscover it every few months. I have, more than once.

### Signing off names three things

What was completed. What was deferred. What's still uncertain. That's it.

"Done" is wrong if anything got skipped silently. "Tests pass" is wrong if any were skipped, marked pending, stubbed out. An honest report's less tidy. But a reader can act on a flagged doubt. They can do nothing about a gap nobody mentioned.

### One honest caveat

The cost is real. Every turn opens with writing that block. On small things, it feels like ceremony. So there are three exits — read-only turns are exempt outright, a slash-invoked skill adds no outer gate (invoking it is the approval), and one "just do it" stands the gate down for the whole session.

But here's the bigger admission. I can't prove the model holds all eight stages. Re-injecting every turn just makes forgetting harder. Doesn't make it impossible. So the next step isn't more rules. It's measuring how much of this actually gets kept. That's another post.

### One line to close

Collapse the gates down to one. Let the human nod once, at the moment their information is fullest. Hand the other seven to discipline — then re-inject that discipline every turn, instead of trusting it to remember. Whatever drifts after that, the three backward edges pull it back.
