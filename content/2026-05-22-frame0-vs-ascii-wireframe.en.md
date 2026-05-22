+++
date = "2026-05-22"
title = "Frame0 vs. ASCII Wireframes: Measuring the Cost of One Screen"
slug = "frame0-vs-ascii-wireframe"
[taxonomies]
tags = ["Frame0", "MCP", "Tooling"]
+++

I recently wired Frame0 into Claude Code's MCP toolset. The idea is simple: let the AI sketch a wireframe inline during a conversation, so layout decisions move faster than prose can describe them.

But that surfaces a question — **how many tokens does it actually cost to draw one wireframe?**

I used my own side project [Heimdall](https://github.com/LarryHsiao/Heimdall), a Jira desktop client, as the guinea pig. The same main screen was drawn twice in the same session: once as plain-text ASCII, once as a real Frame0 vector via MCP. Same structure, same mock data, single session.

### Both sketches side by side

ASCII, rendered inline with zero MCP calls:

<figure>
<img src="../ascii-fallback-heimdall.png" alt="ASCII fallback wireframe of the Heimdall tickets page"/>
</figure>

Frame0, 93 shapes, exported as PNG:

<figure>
<img src="../frame0-wireframe-heimdall.png" alt="Frame0 wireframe of the Heimdall tickets page"/>
</figure>

The same screen — AppBar, tab strip, search box, assignee dropdown, table (with sub-task indent, hidden-subtask indicator, priority icons, status pill) — drawn once in each medium.

### The numbers

| Axis | ASCII | Frame0 |
|---|---|---|
| Token cost | Near-zero (message characters) | **50k–70k** (MCP round-trips) |
| Wall time | Seconds | **A few minutes** (LLM generation ≫ MCP processing) |
| Visual fidelity | Monospace misalignment, emoji-as-icon | True vector, exportable PNG |
| Suitable for outbound use | No | Yes |
| Cost to edit | Edit a string | Redraw, or update shape-by-shape |

That 50k–70k for Frame0 is not evenly distributed. Broken down:

- **Shape creation** — ~95 successes + 5 failed retries, roughly 30k–35k tokens. Each shape averages ~180 in + ~150 out.
- **`search_icons`** — 15 icon-name queries, **surprisingly the largest hidden cost** at ~20k–30k tokens. Each keyword returns 5–50 icon descriptors; the response is far bulkier than I expected.
- **`export_page_as_image`** — the PNG returns as visual input, ~1.5k–2k tokens per image.
- **Other** (schema load, `add_page`, `create_frame`) — under 2k tokens.

### A small move that saves ~25k

After one pass, every icon name I needed is now known:

| Use | Frame0 icon name |
|---|---|
| Story | `bookmark` |
| Task / Sub-task | `square-check` |
| Bug | `bug` |
| Epic | `zap` |
| Settings | `settings` |
| Search | `search` |
| User | `user` |
| Dropdown chevron | `chevron-down` |
| Priority up / down | `arrow-up` / `arrow-down` |
| Priority highest / lowest | `chevrons-up` / `chevrons-down` |

Next time the same kind of screen comes up, `search_icons` is skippable — pass the name directly. That single step drops the total from 50k–70k to **~30k**.

A small trap on the side: `create_icon`'s `name` parameter is **the icon library's name**, not whatever label you fancy. The first pass I used names I'd recognize myself (e.g. `action-hash`) and got 500s on all five icons. Switching to real names — `hash`, `refresh-cw` — they went through. About 1.5k tokens wasted on the wrong assumption.

### The workflow it left behind

Align structure in ASCII first, then redraw the final in Frame0.

ASCII's value is not its looks — it is that **the cost of correcting a mistake is near zero**. Pin down column order, grouping logic, and empty-state behaviour in the text version; the Frame0 pass then becomes a translation of an already-settled structure into a reviewable visual.

If you instead start in Frame0 and keep nudging coordinates, swapping icons, tweaking pill widths, the cost is not 50k–70k — it is two or three times that. Every shape edit means an `update_shape`, and update is just as expensive as create.

### For others trying MCP tools

- **Single-screen outbound wireframes** — Frame0 is worth it. 30k–70k tokens for one reviewable visual is a fair trade.
- **Batch / multi-screen output** — cost scales linearly. For a whole product surface, keep Frame0 for the final pass; align structure in ASCII or Mermaid first.
- **Pre-build an icon cheat sheet** — skipping `search_icons` is the single biggest saving.
- **Send shape creations in parallel, but calibrate the expectation** — shapes under the same frame have no inter-dependencies; batching 32 in one message works fine, and Frame0's server processes the whole batch in seconds. **But the overall wall time is not on the seconds scale** — the LLM still spends tens of seconds generating tool calls between batches, so finishing one wireframe lands on the order of a few minutes. Parallel batching saves MCP-server processing time, not LLM-generation time.
- **TRIALMODE watermark** — the Frame0 trial's MCP export carries a diagonal `TRIALMODE` stamp. The canvas itself is clean; only exports are marked. Confirm licence state before sending exports outside.

---

*This benchmark was run on 2026-05-22 with Claude Opus 4.7, the Frame0 MCP client, and the Heimdall main screen (an 800×632 desktop frame) as the sample. Numbers are estimates — the session itself cannot read the harness's exact token counts; the session-usage panel is the authoritative source.*
