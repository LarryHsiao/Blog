+++
title = "Iris"
path = "en/iris"
template = "tool.html"
weight = 20
description = "A lightweight always-on-top HUD for macOS — synced lyrics, album art, and system vitals in one glance."

[extra]
icon = "/iris-icon.svg"
+++

<div class="iris-page">

<figure class="iris-icon">
<img src="/iris-icon.svg" width="128" alt="Iris app icon"/>
</figure>

**Never tab away again.**

Iris is a lightweight always-on-top HUD for macOS — live system vitals and synced song lyrics in a single draggable overlay. Stay in the flow without losing track of what's playing or what your machine is doing.

<p class="iris-screenshot">
<img src="/iris-screenshot.png" alt="Iris overlay showing lyrics and system ring gauges"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Iris/releases/latest">Download Latest</a>
<a href="https://github.com/LarryHsiao/Iris">GitHub</a>
</div>

> Status: **work in progress.**

---

## ✨ Features

- 🎵 **Synced lyrics** — follows Spotify's current track and streams time-synced lyrics from [lrclib.net](https://lrclib.net), scrolling in real time
- 💿 **Album artwork** — shows the current track's cover art alongside the lyric line
- 📊 **Playback progress bar** — a thin bar at the bottom tracks position within the current track
- 🧠 **System ring gauges** — CPU and memory as compact rings; disk shows free space as text
- 🪟 **Draggable overlay** — float it anywhere; position is saved across launches
- 📌 **Menu-bar control** — toggle visibility or quit via the `ʟ` status item

---

## 🛣️ Planned

- Additional media sources (Apple Music, system-wide Now Playing)
- User-configurable layout and themes
- Per-display positioning

---

## 🔗 Links

- [Source on GitHub](https://github.com/LarryHsiao/Iris)
- [Latest Release](https://github.com/LarryHsiao/Iris/releases/latest)
- [Report an Issue](https://github.com/LarryHsiao/Iris/issues)

</div>

<style>
.iris-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.iris-page figure { margin: 0 0 1rem; }
.iris-page figure.iris-icon img { border-radius: 24px; }
.iris-page .iris-screenshot { margin: 1.5rem 0; }
.iris-page .iris-screenshot img { width: auto; height: auto; max-width: 100%; border-radius: 8px; border: none; object-fit: initial; }
.iris-page h1 { margin-top: 0.5rem; }
.iris-page h2 { text-align: left; }
.iris-page ul { text-align: left; list-style: none; padding-left: 0; }
.iris-page ul li { margin: 0.5rem 0; }
.iris-page blockquote { text-align: left; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
