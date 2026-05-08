+++
title = "Heimdall"
path = "en/heimdall"
template = "tool.html"
weight = 30
description = "A small desktop window for Jira tickets — built for quicker reaction and a sharper focus on the next move, not the data itself."

[extra]
icon = "/heimdall.png"
+++

<div class="heimdall-page">

<figure class="heimdall-icon">
<img src="/heimdall.png" width="128" alt="Heimdall app icon"/>
</figure>

**Only what passes — without the chrome.**

Heimdall is a small desktop window that lifts Jira tickets out of the crowded web UI. Each filter you save becomes its own tab; rows render as a sortable, resizable table. Mostly it watches — but a click on the status cell will quietly send a ticket along its workflow.

<p class="heimdall-screenshot">
<img src="/heimdall-screenshot.png" alt="Heimdall window — tabs of filters, sortable ticket table, assignee quick-filter"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Heimdall">GitHub</a>
<a href="https://github.com/LarryHsiao/Heimdall/releases/latest">Download Latest</a>
</div>

> Status: **work in progress.**

---

## ✨ Features

- 🗂️ **Tabs per filter** — one filter per tab, with a scrollable strip
- 🔠 **Sortable columns** — click a header; click again to reverse
- ↔️ **Resizable columns** — drag the divider on a header's right edge; widths persist across launches
- 🌳 **Grouped / Flat modes** — sub-tasks indent under their parent, or every row stands on its own
- 🎨 **Priority and type as icons** — Story / Bug / Task / Epic glyphs; priority as a colored arrow
- 🧑 **Quick assignee filter** — dropdown on the tab strip, in-memory only — Jira's JQL stays untouched
- 🔁 **Status transitions** — click the status cell to pick the next step in the workflow; all other writes stay in the web
- 🔐 **Credentials in Keychain** — macOS Keychain / Windows Credential Manager

---

## 🛣️ Planned

- Window position and size memory
- Auto-refresh on a configurable timer
- Tests beyond the boot smoke test

---

## 🔗 Links

- [Source on GitHub](https://github.com/LarryHsiao/Heimdall)
- [Latest Release](https://github.com/LarryHsiao/Heimdall/releases/latest)
- [Report an Issue](https://github.com/LarryHsiao/Heimdall/issues)

</div>

<style>
.heimdall-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.heimdall-page figure { margin: 0 0 1rem; }
.heimdall-page figure.heimdall-icon img { border-radius: 24px; }
.heimdall-page .heimdall-screenshot { margin: 1.5rem 0; }
.heimdall-page .heimdall-screenshot img { width: auto; height: auto; max-width: 100%; border-radius: 8px; border: none; object-fit: initial; }
.heimdall-page h1 { margin-top: 0.5rem; }
.heimdall-page h2 { text-align: left; }
.heimdall-page ul { text-align: left; list-style: none; padding-left: 0; }
.heimdall-page ul li { margin: 0.5rem 0; }
.heimdall-page blockquote { text-align: left; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
