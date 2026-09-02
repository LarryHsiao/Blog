+++
date = "2026-09-02"
title = "Where Does a Rule Live? Four Containers, and a Ladder We Built Ourselves"
slug = "four-containers-for-one-rule"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

[The last post](/en/a-config-is-a-product-when-you-name-how-it-rots/) mentioned that a lesson has a promotion path: it lands in memory first, and only graduates into a rule document once it has corrected the same mistake twice. That passage only wrote down the first rung.

There are four.

The product gives you the containers: auto-memory, the auto-loaded CLAUDE.md (with its `@path` syntax), skills, hooks. It says nothing about which rule belongs in which container, and nothing about when a rule should move from one to the next. **We built that ladder ourselves** — and slipped a rung into the middle that the product knows nothing about.

We only wrote it down today. So, plainly: this post is a method, not experience.

### The four rungs

| Rung | Who triggers it | What it costs |
|---|---|---|
| Memory entry | this project, this machine only | ~nothing |
| Reference doc (`docs/workflow/*.md`) | the model, **if** it recognises the activity — a soft trigger | attention, when read |
| Skill (slash command) | the user, by typing `/name` | nothing until invoked |
| Hook | nobody — it fires on its own | tokens on **every** prompt |

### The container we invented

The second rung isn't the product's. Claude Code has no concept of a "reference doc" — those files are just files sitting in a repo, no different from the README beside them. They get read for exactly one reason: a single bullet in the always-loaded CLAUDE.md points at them. *Delegating to a subagent? Read the delegation doc first.*

So it's cheap. No standing context cost — the file can run long without making every session's opening heavier.

But it is deliberately unreliable. You are betting the model recognises that what it is doing right now is the thing the doc covers. Recognise it, and the doc gets pulled in. Miss it, and the doc is a file nobody opened.

Set it beside a hook and the point comes out. A hook fires whether or not anyone chose it, and it is charged on every single prompt, forever.

So the ladder isn't trading "a bit more reliable" for "a bit more expensive". **Each rung up, the cost changes currency, not amount.** Memory costs nearly nothing. A doc costs attention, and only at the moment it's read. A skill costs a name someone has to remember. A hook costs weight on every prompt. Four currencies. They don't add up.

And because they don't add up, you can't decide by "cheaper" or "dearer". Each gap in the ladder needs its own question instead.

### Question one: does the rule still apply when nobody invokes it?

That's the doc → skill test.

A doc constrains an activity you were already doing. A skill *is* the doing. Climb when the guidance is an ordered procedure, when it drives tools, or when it must be startable by name.

- **Climb:** a skill whose content is "run these hooks in this order, then print the URL". The steps are the substance, and prose cannot execute them.
- **Stay:** a checklist for writing a technical review document. A skill would add one more invocation to remember — and those constraints have to hold on the turns when nobody remembers it.

The second one is the whole test. If a rule only works when someone thinks of it, turning it into a skill hands its trigger over to memory. Human memory.

### Question two: is it missed in practice — and missed silently?

That's the doc/skill → hook test.

Promote on **evidence**, never on anticipation. "This will probably get forgotten later" isn't a reason; it's imagination, and imagination always votes for another hook. Evidence looks like this: a metric row sitting low across several consecutive runs, or the same omission recurring in the transcripts — countable, over a stated span.

If it really does climb, the shape still has to be chosen: blocking when the harm is irreversible, reminding when the failure is just an omission.

- **Stay:** a clause covering a rare branch. Charged per prompt, collected once a month.

"Silently" isn't decoration. Anything that fails loudly doesn't need a hook — it announces itself, and you go deal with it. Hooks are for the rules whose breach nobody notices.

### Descent: remove it and watch the row

A ladder that only goes up just gets heavier.

The method is dull: take the rule out, watch its metric across several runs, put it back if the row falls.

This rung has **zero real cases**. The source file says so outright: "Nothing here has been demoted yet — this records the method, not a pending case." I'm leaving that sentence exactly as it stands.

There's one trap, and it's easy to walk into: **don't demote a guard because nothing has gone wrong while it was up.** Absence of failure under a guard is not evidence the guard is idle. Those two states look identical from outside, and you only tell them apart after you've removed it.

One more limit worth naming. "Watch the row" leans on the measuring tooling from [an earlier post](/en/the-denominator-is-the-hard-part/), and it reaches only the rules that actually have a row in that rubric. For rules that don't, the evidence has to be a counted recurrence in the transcripts — and then you say the number: how many times, over what span. "We forget this a lot" is not evidence.

### What the product gave, and what we added

Draw this line or readers will fuse the two:

| | |
|---|---|
| **Product-provided** | CLAUDE.md auto-loading, the `@path` auto-load syntax, skills, hooks, auto-memory |
| **Ours** | the reference-doc layer, the ordering of the four into a ladder, and every criterion for climbing or descending it |

The containers came with the tool. Which container holds which rule, and when to change containers — nobody supplies that. We wrote it down after tripping over it a few times. Your version will probably differ from ours, because your misses look different from ours.

### The honest ledger

| Item | Status |
|---|---|
| The ladder | written down today; not yet validated by practice |
| The descent rung | zero cases — a method recorded, not experience |
| "Watch the row" | reaches only rules with a row in the rubric; the rest fall back to counting transcripts |

### One line to close

If you also have an agent config that's growing, there's really only one thing to take: **ask which currency this rule's cost is paid in.** The kind charged on every prompt has to be bought with evidence first.
