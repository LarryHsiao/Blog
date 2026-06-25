+++
date = "2026-06-25"
title = "Put the Plan on the Ticket — Plan / Forge / Review as a Marker Protocol"
slug = "put-the-plan-on-the-ticket"
[taxonomies]
tags = ["Claude Code", "Agent", "Workflow"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

Lately I've been tidying up the way I run AI agents, and I noticed a question I'd been quietly ignoring: **where does the agent's state actually live?**

Most of the time, it lives in the chat window. You open a conversation in the desktop app, talk through a feature, and it plans, writes code, fixes bugs — and the whole context of that work lives in that one scrolling message stream. It sounds natural, but that stream is surprisingly fragile.

### The chat window is RAM, not disk

Desktop chat has three built-in limits:

- **It's volatile.** Once the plan gets pushed up by new messages, it's hard to find again. Close the window, clear the context, and what you just agreed on is gone.
- **It's single-session.** Switch machines, or open a fresh conversation tomorrow, and it knows nothing about yesterday. Every session is an island.
- **It's single-player.** My teammates can't see what I discussed with the agent. That conversation is mine alone — no second pair of eyes can review it.

In other words, the chat window is RAM — fast, handy, but gone the moment the power drops. And yet we put the state of an entire workflow on RAM, with no durable home it can land in, no place another person can read, nothing that survives across sessions.

### Lift the state onto the issue tracker

My fix is simple at heart: **don't keep the agent's state in the chat — lift it onto the comment thread of an issue tracker.**

Every plan, every question, every verdict becomes a comment on the ticket. I gave my own Claude Code setup (it's called skadi) one rule: "**The thread is the record. No side channels.**" Chat is where you talk to the agent; the ticket is where the state actually lives.

YouTrack, Jira — whichever you use, your team already trusts that place. It has history, permissions, notifications, and everyone can see it. Tie the agent's workflow to it, and you get persistence, auditability, cross-session continuity, and multi-player collaboration for free.

What follows is three stages — plan, forge, review. Each uses a small **marker** as the contract between stages, and between human and machine.

### Plan — write the plan as a comment

The first stage is planning. I run `/council`, which dispatches a subagent (I call it Erestor). It reads the whole ticket, drafts a plan, and **posts it straight back as a comment**, tagged `[PLAN]`.

Then it stops, and waits for my verdict. Once I've read it, I reply with `[APPROVE]` (approve, go) or `[REJECT]` (reject).

The key thing here: **the approval itself is a comment, not a chat line.** I can have it draft a plan today and come back to approve it tomorrow. Erestor only reads, drafts, and asks — it never decides for me. In skadi's words, "Erestor counsels, Elrond decides." Every go/no-go gate stays in human hands, and that gate is written into the ticket, not floating away with the conversation.

### Forge — let the PR find its own way back to the ticket

Plan approved, the second stage is forging. I run `/celebrimbor`, and the first thing it does is **go read that thread** — find the `[PLAN]` plus its `[APPROVE]`, confirm the plan was both drafted and approved.

Then it implements the plan, opens a draft PR/MR, and **posts the PR's URL back onto the ticket**, tagged `[FORGED]`.

This is the step that, to me, captures the whole point of the design: **the forge stage's input is something it read off the thread itself — it never needed the chat that planned it.** Planning and forging can be two completely different sessions, or even two different people. As skadi puts it: "The thread is still the record. The PR URL goes back onto the ticket as `[FORGED]`, so the council and the forge stay in step."

### Review — threaded too

The third stage is review. I have two tools for it:

- `/mithrandir` runs a multi-axis verdict — stability, performance, style, maintainability, correctness — and lands on one conclusion: Merge, Hold, or Refuse.
- `/narvi` answers the comments on the PR, one commit per comment, turning each note into code.

These, too, are threaded onto the ticket and the PR. Review isn't a judgment locked in someone's head; it's a record that can be read and traced back.

### The markers are a state machine written in comments

Line the markers up and you see they form a state machine:

```
[PLAN]  →  [APPROVE]  →  [FORGED]  →  [METTA]
 plan drafted   human go    PR opened     merged
```

(There are smaller markers in between: `[REJECT]` to reject, `[SKELETON]` to stub first, `[BASE: branch]` to override the base branch.)

The markers themselves are plain words; it's the command names — `/council`, `/celebrimbor` and the rest — that borrow the council of Rivendell from Tolkien's *Lord of the Rings*. That's flavour, not the dish. The point is this: **any session, at any stage, can reconstruct where the work stands just by reading the thread.** The state isn't in anyone's head, nor in some window that vanishes when closed — it's on the ticket, in black and white.

### What the lift unlocks

Once the state sits on a substrate the team already trusts, the things that were stuck in the chat window come loose: **async** (plan today, approve tomorrow, forge the day after), **cross-session** (a new machine or a fresh conversation picks right up), **multi-player** (teammates can read it and review it), **auditable** (every step leaves a trace). You can even have sweepers (in skadi they're `/glorfindel` and `/rhovanion`) periodically pass over every ticket and push the work onward from the markers — because everything a successor needs is already on the ticket.

### An honest caveat

One thing to be clear about: so far I've only verified this on **small tasks** — the kind with a clear scope that one or two files can close out. On **larger tasks** the friction climbs sharply: the plan itself isn't precise enough, so the forge stage drifts when it follows along. To make this hold for big work, there's a missing piece — some mechanism to polish the precision of the plan's content. That's the next step; I'm not there yet.

### How it stands

So this is how I work now: **I don't keep the agent's state in the chat.** I lift it onto the substrate my team already trusts — the issue tracker — and let a small marker protocol be the contract between stages, and between human and machine. Chat is RAM; the ticket is disk. Put the plan on the ticket, and the state finally has a home it can land in — one others can read, one that survives across sessions.
