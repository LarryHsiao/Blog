+++
date = "2026-04-14"
title = "What is an AI Agent, really?"
slug = "what-is-an-ai-agent-really"
[taxonomies]
tags = ["AI", "Software"]
+++

Lately I keep hearing things like: automatically review PRs, automatically write tests, automatically generate release notes, automatically handle customer support…

It made me wonder — what does "Agent" actually mean?

### Breaking it down

If you decompose a PR review agent, it looks roughly like this:

```
PR opened → webhook fires → AI runs review → posts comment
```

The "AI runs review" part is just calling an AI API with a set of instructions. Something like:

> "Please review this PR, paying attention to naming conventions, security issues, and missing tests."

So the whole Agent breaks into two parts:

1. **Instructions**: what to do and how to do it
2. **Trigger and integration**: when to run and where to send the result

### The instructions part

This is what I find most interesting.

Before the AI can do anything, you have to think through "how should this actually be done." For PR review:

- What aspects matter? Naming? Performance? Security?
- What severity should block a merge?
- What tone should the feedback use?

These questions exist whether or not AI is involved. Good code review has always required answers to them. AI just forces the unspoken rules to be written down explicitly.

In a way, that's a good thing — it turns vague standards into words that can be shared and discussed.

### The trigger and integration part

This is more traditional engineering work: wiring up webhooks, calling APIs, handling errors, routing results to the right place.

Not without value — but it's a separate concern from "how smart the AI is."

### So what is an Agent?

My current understanding: an Agent is an **AI call with clear instructions that fires automatically**.

It's not something fundamentally new. It's more like automating something you used to do manually — except the thing being automated is "calling AI" instead of "running a tool."

Once you see it that way, a lot of things become clearer. There's no rocket science here — describe what you want clearly, write a good prompt, and that's the core of the whole thing. The trigger, the API wiring — those are just scaffolding around it.
