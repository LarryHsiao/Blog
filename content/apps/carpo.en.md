+++
title = "Carpo"
path = "en/carpo"
template = "tool.html"
weight = 30
description = "A desktop media-tag manager — lay a tag overlay across folders you already curate, without moving a single file."

[extra]
icon = "/carpo-icon.png"
+++

<div class="carpo-page">

<figure class="carpo-icon">
<img src="/carpo-icon.png" width="128" alt="Carpo app icon"/>
</figure>

**Files stay put. Tags catch up.**

Carpo is a desktop media-tag manager that lays a tag overlay across folders you already curate — photos, video, audio — without moving or owning the files. Rename or move them, and the tags follow.

<div class="store-badges">
<a href="https://github.com/LarryHsiao/carpo-dist/releases/latest">Download Latest</a>
<a href="https://github.com/LarryHsiao/carpo-dist/issues">Report an Issue</a>
</div>

> Status: **v1.0.1 released.**

---

## ✨ Features

- 🗂️ **Browse, don't index** — Carpo observes folders you already curate; it never moves or owns files on disk
- 🏷️ **Tag any path** — folders and files alike, with workspace-scoped tag vocabularies ("buckets")
- 🔁 **Tags follow renames** — a SHA-256 content fingerprint rebinds tags across renames and moves
- ⚡ **Live filesystem** — a directory watcher keeps the grid current as files arrive, move, or disappear
- ⌨️ **Keyboard-first** — arrow keys to move, Enter to open, Backspace to ascend, Ctrl+A to select all visible
- 🌳 **Hierarchical tags** — filtering by a parent tag rolls in every descendant; counts add up naturally

---

## 🛣️ Planned

- Saved views — named tag-condition queries persisted across sessions
- Drag & drop — drop a file onto a tag to attach; drag files between folders
- Format-aware metadata (EXIF, codec, ID3)
- In-app media playback — FFmpeg frames, audio waveforms, fullscreen viewing

---

## 🔗 Links

- [Latest Release](https://github.com/LarryHsiao/carpo-dist/releases/latest)
- [Report an Issue](https://github.com/LarryHsiao/carpo-dist/issues)

</div>

<style>
.carpo-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.carpo-page figure { margin: 0 0 1rem; }
.carpo-page figure.carpo-icon img { border-radius: 24px; }
.carpo-page .carpo-screenshot { margin: 1.5rem 0; }
.carpo-page .carpo-screenshot img { width: auto; height: auto; max-width: 100%; border-radius: 8px; border: none; object-fit: initial; }
.carpo-page h1 { margin-top: 0.5rem; }
.carpo-page h2 { text-align: left; }
.carpo-page ul { text-align: left; list-style: none; padding-left: 0; }
.carpo-page ul li { margin: 0.5rem 0; }
.carpo-page blockquote { text-align: left; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
