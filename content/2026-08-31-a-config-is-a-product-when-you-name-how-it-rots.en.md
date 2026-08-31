+++
date = "2026-08-31"
title = "Treat a Personal Config Like a Product — Not Because It Has Tests, but Because It Rots"
slug = "a-config-is-a-product-when-you-name-how-it-rots"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The last two posts were about [how one task runs](/en/the-only-gate-that-waits/) and [how to measure whether the rules were kept](/en/the-denominator-is-the-hard-part/). The thing that runs that loop and computes that score is a git repository: by its own README's count, some hundred and twenty hooks, fifty-three skills, nineteen rule documents.

It's already big enough to rot. The claims usually made about a setup like this are: **hooks have tests, rules have a lint, one source renders two runtimes.** I sent a read-only research agent to check all three — each one turned out to be only half true.

The verdict first: treating it like a product isn't about how accurate those three claims are. It's that I wrote down how it would break, before it broke. This post checks the three claims first, then gets to what actually holds the thing up.

### Claim one: hooks have tests

This one comes closest to true. The hook tests use no framework: a hand-written `check` function that counts passes and failures and prints `── N passed, M failed ──`, with the test file sitting next to its hook. Of twelve hooks sampled, seven have one.

The ones that exist pin things that really happened:

- The sandbox guard: a commit message passed through a heredoc contained an apostrophe, which was once read as an unclosed quote — swallowing a path that escaped the sandbox further along the command.
- The protected-repo guard: a malformed line in its config once made it "fail closed, but with garbage" — it blocked, but the guidance it printed was a broken string. Fixed to skip the line outright.
- The verdict-recording hook: on malformed JSON or empty input it must exit 0 silently and write nothing. The comment says it plainly: **measurement must never break the verdict it is recording.**

A small aside from writing this: the research agent I sent to read the repo was stopped at the door by the repo's own guard — a session rooted in another project couldn't even list the directory, and had to read one file at a time. Whether the guard actually works got an accidental verification.

But "has tests" is still a step short of "has a gate": **there's no CI.** The tests are real and well made, but nothing runs them on push or merge. "Hooks have tests" currently means "someone runs them", not "nothing lands without them".

### Claim two: rules have a lint

This one is half right. The renderer is strict about skill front matter — exactly two fields, and one extra fails the install — and that's a real lint, one that runs on every install. The hooks themselves also clear a shellcheck gate.

But the scope is narrow: **the lint covers shell syntax only, and only changed files.** The script admits it: a hundred-odd hooks were written before shellcheck was in play, and a full sweep would drown in old findings.

Where it really misses is the word "rules". **The rule prose itself has no lint.** The main config forbids absolute paths in the permissions list, in writing — enforced by judgement at review time, not by a script. A rule enforced by judgement is, itself, a rule not enforced.

### Claim three: one source renders two runtimes

This is the one that held up best under checking. One source tree renders into config for two runtimes — Claude Code and Codex. Rendering isn't copying; it's rewriting:

```
/name               → $name
AskUserQuestion     → the structured user-input tool
model: sonnet       → the appropriate current capability tier
~/.claude-personal  → ~/.codex-personal
```

There's an adapter layer too: Codex's patch calls are translated into per-file writes so that **the same guard hooks run unmodified on both sides**.

I only wanted both runtimes to work. Only afterwards did the real value show: **whatever breaks in the port is whatever had quietly grown into one runtime's shape.** A rule that holds on only one side is usually not a rule; it's a habit.

One by-product: the two runtimes can't see each other's memory, so workflow state — routing, preferences, cursors — lives in a neutral directory both share, while login and chat history stay unshared. And the pointer to the memory-backup repo sits deliberately *outside* the memory system — **it bootstraps memory, so it cannot live inside the thing it bootstraps.**

The two sides still aren't equal, though: **the Codex side is thinner.** Its command-escalation policy has three rules; Claude's permissions list has about a hundred and fifty.

### Beyond the three claims, what actually holds it up

With the three claims checked, what actually makes this feel like a product is a handful of moves none of the claims name.

The first is the dullest and the most important: **the repo is the only source; every live config directory is a copy of it.** The installer lands the same file, byte for byte, in every root — so a rule read from a copy looks identical to the rule read from the source, identical enough that you cannot tell where you're standing.

Not being able to tell is how things go wrong: edit the copy, and the next install quietly overwrites it. So the rules carry a table of who may change what:

| Target | May a session change it? |
|---|---|
| A project's memory files | Freely — that is what memory is for |
| Rule docs, skills | Propose, and wait for the word |
| The main config, permissions, hooks | Propose, and also name the **blast radius** — these load into every session on every machine |
| The live copies | Never. The next install overwrites them |

The "name the blast radius" cell is where product thinking starts. Even in a file only you use, some lines detonate everywhere when changed.

The second is how a lesson gets into the rulebook. Adding a rule after every incident is the most common way a config decays. So a lesson has its own promotion path: it lands in **memory** first — cheap, immediate, no approval needed; it graduates into a rule document only when it has **corrected the same mistake twice**, or **applies beyond the project** where it was learned, and graduation is itself a proposal; once promoted, the memory shrinks to a pointer. And it lands in **the file that owns the concern** — a style rule in the style doc, a delegation rule in the delegation doc — not as a one-off exception threaded into some skill's prose. The container is the point.

The third is writing the ways it rots down first. The maintenance doc has a section titled "known degradation modes". I think it's the most product-like part of the whole repo, because it admits **this thing will break, and knows how**:

1. **Rule accretion** — one rule per incident, until the loaded weight is big enough that sessions start skimming.
2. **Codebook drift** — the main config, the docs, and plugin skills all describe the same gate, and slowly become three versions. Prevention: every rule lives in exactly one home; the other surfaces point to it.
3. **Prose/hook drift** — a section describes a behaviour, the hook enforcing it changes, and the section now lies. Prevention: **where a hook enforces something, the prose stops repeating it**; state only what the hook doesn't carry, and name the hook.
4. **Stale rosters** — model names, flags, skill names rot silently. Prevention: date-stamp anything roster-shaped, and verify before relying on it.
5. **Ritual compliance** — gauges, acceptances, reviews all rendered, present in form and empty in substance. Prevention: **anything that cannot fail is not a check** — delete it or sharpen it.

The fifth has a very concrete corollary. The review reminder re-injected every turn names "dispatch an agent", not "write the verdict line". Nudge only the line, and the model learns to type the line — **a reminder must never make the metric easier to satisfy than the behaviour it stands for.**

The fourth is a threshold that refuses to be obeyed. The loaded weight should have a ceiling. The old version said 35,000 characters. Later, the maintenance doc called its own number out: **it wasn't derived from anything — it was the file's size on the day it was written** (2026-07-08, actual 35,532) — a status quo dressed as a budget. The new 45,000 is labelled plainly "a smell test, not a limit": past it, read the file and ask which rules have stopped earning their weight; if it's ever hit, re-measure rather than obey.

Prune on evidence, not on a character count. The evidence comes from [the previous post's](/en/the-denominator-is-the-hard-part/) dashboard: while the weight grew from 29,008 to 43,196, overall adherence rose from 52% to 73%. The doc reads that as "**the predicted harm did not appear**" — and explicitly refuses to read it as "growth helps", because the denominator was mended three times in the same window, and mending a denominator lifts a rate on its own.

The same section records a miss: one pruning pass predicted 1,600 characters saved and delivered 371, because it sized the section rather than the duplicated part inside it. **Size what will actually be deleted.**

### The honest ledger

Fold the three claims and their gaps into one table:

| Item | Status |
|---|---|
| CI | None — the tests are a human discipline, not a gate's |
| Lint scope | Shell syntax only, changed files only; the rule prose itself has no lint, the absolute-path ban is enforced by judgement |
| Two runtimes | The render is real, but Codex's escalation policy has three rules to Claude's roughly hundred and fifty |
| A repo-rooted session | Global and project instructions load byte-identical, charged twice — the doc's own words: "recorded rather than solved" |

A product with a known-issues list is still a product. One without is a hobby.

### One line to close

You don't need a config this large. But three things travel without the repo: one source, and copies you never edit; write down how it rots before it does; and when a number is only the size of the file on the day it was written, say so.
