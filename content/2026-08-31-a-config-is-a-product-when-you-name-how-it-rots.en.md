+++
date = "2026-08-31"
title = "Treat a Personal Config Like a Product — Not Because It Has Tests, but Because It Rots"
slug = "a-config-is-a-product-when-you-name-how-it-rots"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

The last two posts were about [how one task runs](/en/the-only-gate-that-waits/) and [how to measure whether the rules were kept](/en/the-denominator-is-the-hard-part/). The thing that runs that loop and computes that score is a git repository: by its own README's count, some hundred and twenty hooks, fifty-three skills, nineteen rule documents.

It is already big enough to rot. So this post is about **why I maintain a personal config the way you'd maintain a product — and which concrete moves "like a product" actually means.**

The conclusion first: it isn't because it has tests. It's because I wrote down how it would break, before it broke.

### One source, and copies you never edit

The first move is the dullest and the most important: **the repo is the only source; every live config directory is a copy of it.** The installer lands the same file, byte for byte, in every root — so a rule read from a copy looks identical to the rule read from the source, identical enough that you cannot tell where you're standing.

Not being able to tell is how things go wrong: edit the copy, and the next install quietly overwrites it. So the rules carry a table of who may change what:

| Target | May a session change it? |
|---|---|
| A project's memory files | Freely — that is what memory is for |
| Rule docs, skills | Propose, and wait for the word |
| The main config, permissions, hooks | Propose, and also name the **blast radius** — these load into every session on every machine |
| The live copies | Never. The next install overwrites them |

The "name the blast radius" cell is where product thinking starts. Even in a file only you use, some lines detonate everywhere when changed.

### A lesson doesn't go straight into the rulebook

Adding a rule after every incident is the most common way a config decays. So a lesson has its own promotion path:

- It lands in **memory** first — cheap, immediate, no approval needed.
- It graduates into a rule document only when it has **corrected the same mistake twice**, or **applies beyond the project** where it was learned. Graduation is itself a proposal.
- Once promoted, the memory shrinks to a pointer.

And it lands in **the file that owns the concern** — a style rule in the style doc, a delegation rule in the delegation doc — not as a one-off exception threaded into some skill's prose. The container is the point.

### Five ways it rots, written down first

The maintenance doc has a section titled "known degradation modes". I think it's the most product-like part of the whole repo, because it admits **this thing will break, and knows how**:

1. **Rule accretion** — one rule per incident, until the loaded weight is big enough that sessions start skimming.
2. **Codebook drift** — the main config, the docs, and plugin skills all describe the same gate, and slowly become three versions. Prevention: every rule lives in exactly one home; the other surfaces point to it.
3. **Prose/hook drift** — a section describes a behaviour, the hook enforcing it changes, and the section now lies. Prevention: **where a hook enforces something, the prose stops repeating it**; state only what the hook doesn't carry, and name the hook.
4. **Stale rosters** — model names, flags, skill names rot silently. Prevention: date-stamp anything roster-shaped, and verify before relying on it.
5. **Ritual compliance** — gauges, acceptances, reviews all rendered, present in form and empty in substance. Prevention: **anything that cannot fail is not a check** — delete it or sharpen it.

The fifth has a very concrete corollary. The review reminder re-injected every turn names "dispatch an agent", not "write the verdict line". Nudge only the line, and the model learns to type the line — **a reminder must never make the metric easier to satisfy than the behaviour it stands for.**

### A threshold that refuses to be obeyed

The loaded weight should have a ceiling. The old version said 35,000 characters.

Later, the maintenance doc called its own number out: **it wasn't derived from anything — it was the file's size on the day it was written** (2026-07-08, actual 35,532) — a status quo dressed as a budget. The new 45,000 is labelled plainly "a smell test, not a limit": past it, read the file and ask which rules have stopped earning their weight; if it's ever hit, re-measure rather than obey.

Prune on evidence, not on a character count. The evidence comes from [the previous post's](/en/the-denominator-is-the-hard-part/) dashboard: while the weight grew from 29,008 to 43,196, overall adherence rose from 52% to 73%. The doc reads that as "**the predicted harm did not appear**" — and explicitly refuses to read it as "growth helps", because the denominator was mended three times in the same window, and mending a denominator lifts a rate on its own.

The same section records a miss: one pruning pass predicted 1,600 characters saved and delivered 371, because it sized the section rather than the duplicated part inside it. **Size what will actually be deleted.**

### The second runtime is a kind of test

One source tree renders into config for two runtimes — Claude Code and Codex. Rendering isn't copying; it's rewriting:

```
/name               → $name
AskUserQuestion     → the structured user-input tool
model: sonnet       → the appropriate current capability tier
~/.claude-personal  → ~/.codex-personal
```

There's an adapter layer too: Codex's patch calls are translated into per-file writes so that **the same guard hooks run unmodified on both sides**. The renderer is strict about skill front matter — exactly two fields, and one extra fails the install.

I only wanted both runtimes to work. Only afterwards did the real value show: **whatever breaks in the port is whatever had quietly grown into one runtime's shape.** A rule that holds on only one side is usually not a rule; it's a habit.

One by-product: the two runtimes can't see each other's memory, so workflow state — routing, preferences, cursors — lives in a neutral directory both share, while login and chat history stay unshared. And the pointer to the memory-backup repo sits deliberately *outside* the memory system — **it bootstraps memory, so it cannot live inside the thing it bootstraps.**

### Tests where they earn their keep

The hook tests use no framework: a hand-written `check` function that counts passes and failures and prints `── N passed, M failed ──`, with the test file sitting next to its hook. Of twelve hooks sampled, seven have one.

The ones that exist pin things that really happened:

- The sandbox guard: a commit message passed through a heredoc contained an apostrophe, which was once read as an unclosed quote — swallowing a path that escaped the sandbox further along the command.
- The protected-repo guard: a malformed line in its config once made it "fail closed, but with garbage" — it blocked, but the guidance it printed was a broken string. Fixed to skip the line outright.
- The verdict-recording hook: on malformed JSON or empty input it must exit 0 silently and write nothing. The comment says it plainly: **measurement must never break the verdict it is recording.**

A small aside from writing this: the research agent I sent to read the repo was stopped at the door by the repo's own guard — a session rooted in another project couldn't even list the directory, and had to read one file at a time. Whether the guard actually works got an accidental verification.

### The honest ledger

A product has a known-issues list. This one's:

- **No CI.** The tests are real and well made, but nothing runs them on push or merge. "Hooks have tests" currently means "someone runs them", not "nothing lands without them".
- **The lint covers shell syntax only, and only changed files.** The script admits it: a hundred-odd hooks were written before shellcheck was in play, and a full sweep would drown in old findings.
- **The rule prose has no lint.** The main config forbids absolute paths in the permissions list, in writing — enforced by judgment at review time, not by a script. A rule enforced by judgment is, itself, a rule not enforced.
- **The Codex side is thinner.** Its command-escalation policy has three rules; Claude's permissions list has about a hundred and fifty.
- **A session rooted in the repo is charged twice** — global instructions once, project instructions once, byte-identical. The doc's own words: "recorded rather than solved".

A product with a known-issues list is still a product. One without is a hobby.

### One line to close

You don't need a config this large. But three things travel without the repo: one source, and copies you never edit; write down how it rots before it does; and when a number is only the size of the file on the day it was written, say so.
