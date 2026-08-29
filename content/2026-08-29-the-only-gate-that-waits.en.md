+++
date = "2026-08-29"
title = "The Only Gate That Waits — Eight Stages of One Agent Task"
slug = "the-only-gate-that-waits"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The previous post, [Put the Plan on the Ticket](/en/put-the-plan-on-the-ticket/), was about where an agent's state should live — and landed on lifting it onto the issue tracker's comment thread. But what a ticket records is the handoff *between* stages: the plan, the approval, the PR, the merge. **How one task runs on the inside is something the ticket cannot reach.**

This post is about that inside.

And to be plain about it up front: the most common failure I see from an agent is not writing wrong code. It's **doing something you never asked for, and then telling you it's done.**

### "Are you sure?" is not a gate

The obvious defence is to make the agent ask before every move. That approach fails, and it fails quietly: ask often enough and the human starts clicking yes without reading. The gate is still on the screen, but it stops nothing.

The real question was never *how many times it asks*. It's **whether, at the moment you're asked, you have enough in hand to answer.**

### Eight stages, one of them waiting

What I do now is cut the whole task into eight stages, and only the third stops for a human:

```
1 gauge → 2 acceptance → 3 gate〔waits〕→ 4 previews
                                            ↓
8 done ← 7 fresh verify ← 6 compliance ← 5 implementation loop
```

Nobody is standing over the other seven. They are the model's own discipline.

### What the gate looks like

At the one place it stops, what comes out is four fields:

```
Size ▰▰▱ medium — one line: how wide, how deep, how hard to undo
Acceptance:
- one observable outcome
Non-goals: what this turn will deliberately not touch
Changes: which files, and the intent
```

Each field earns its place:

- **The gauge reads three axes** — reach, depth, reversibility. Note that size is not scope: a narrowly worded request can still be brutally heavy.
- **Acceptance is written as outcomes, not actions.** "The empty list renders the placeholder", not "render the placeholder". The difference matters because an action can be unilaterally declared complete; an outcome cannot.
- **Non-goals is a field, not a flourish.** It is the line the later review reads as the one a diff must not cross. Write `none` when scope is unambiguous — don't pad it just to fill the slot.
- **Changes** names the files and the intent, so you know what is about to happen.

What the four fields really buy you is this: you get to **settle the whole turn in one answer**. There is only one gate because a gate is expensive — you nod once, at the moment your information is most complete.

### The other seven run on discipline — and discipline decays

Here's the problem. Models forget rules, cheaper ones especially.

And they forget in a very specific way: **a rule written at the top of a config file has, by turn forty, been pushed to the edge of the context.** It wasn't violated. It just isn't in view any more. A rule loaded once decays over a conversation, and that has little to do with how clever the model is.

So my fix is dumb, and it works: **re-inject every turn.** On each user message, a hook pastes the gate's specification and the review's trigger back into context. The rules stop being an opening statement and become background noise.

It is the least impressive part of the whole setup, and the most effective.

### Three edges that lead backwards

If you take one thing away, I'd like it to be these three:

```
a step outgrew its gauge  ──→ back to the gauge   (not onward through it)
verification diverged     ──→ back to the code    (not to the test)
the review found something ──→ back to the code, before the re-run
```

**The first.** The word you gave covers the work as it was described to you, not what it later grew into. Wider reach, deeper thought, harder to undo — any one of those exceeding the original gauge means stopping, re-gauging, and waiting for your word again. Discovering halfway through that it has become a different job, and carrying the old permission onward regardless, is the most common way I've watched things run off the road.

**The second.** When the result diverges from the plan, go back to the code, not to the test. Bending a test until it passes is the cheapest shortcut available and the most lethal — it turns the light green without making anything right.

**The third.** Review findings get mended *before* the fresh verification, never after. The reason is the next section.

### The last gate: re-run it in this turn

"The tests were green three messages ago" does not count.

**The evidence has to come from the same turn as the claim it backs.** If you changed something after that green run, that run no longer describes the tree you have. Reporting done without a re-run in the current turn isn't a fact — it's a guess wearing a fact's clothes.

One small, high-yield trap while we're here:

```sh
set -o pipefail; flutter analyze 2>&1 | tail -6
```

Without that leading `set -o pipefail`, the shell reports `tail`'s exit status, and `tail` succeeds no matter what the analyzer found. The check then reads as **passing forever**. This is exactly the kind of thing that belongs in a written rule, because otherwise you will rediscover it every few months.

### Signing off names three things

What was completed, what was deferred, and what remains uncertain.

"Done" is wrong if anything was skipped silently. "Tests pass" is wrong if any were skipped, marked pending, or stubbed out. An honest report is less tidy, but a reader can act on a flagged doubt; they can do nothing at all about a gap nobody mentioned.

### One honest caveat

The cost is real: **every turn opens with writing that block.** On small things it feels like ceremony, so there are three exits — read-only turns are exempt outright, a slash-invoked skill adds no outer gate (invoking it *is* the approval), and one "just do it" stands the gate down for the whole session.

The bigger admission is this: **I can't prove the model holds all eight stages.** Re-injecting every turn makes forgetting harder; it doesn't make it impossible. So the next step isn't more rules — it's **measuring** how much of this actually gets kept. That's another post.

### One line to close

Collapse the gates down to one, and let the human nod once at the moment their information is fullest. Hand the other seven to discipline, then re-inject that discipline every turn instead of trusting it to remember. Whatever drifts after that, the three backward edges pull back.
