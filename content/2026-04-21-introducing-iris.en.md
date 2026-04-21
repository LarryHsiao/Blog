+++
date = "2026-04-21"
title = "Iris — A Small Window on Screen"
slug = "introducing-iris"
[taxonomies]
tags = ["Iris", "macOS"]
+++

<figure>
<img src="../iris-icon.svg" width="128" alt="Iris app icon"/>
</figure>

I made a new app. It's called Iris.

It's a floating overlay for macOS — always on top, draggable, showing Spotify's synced lyrics, album art, and system vitals like CPU, memory, and disk, all at the same time.

### Why I built it

I usually listen to music while I code. When a line catches my ear, I want to glance at the lyrics — but the Spotify window is either buried under the IDE or sitting on another desktop. Switching over and back is a small motion, but it breaks the flow every time.

Same with system vitals. If I want to check what the CPU is doing or how much memory is left, opening Activity Monitor feels like too much ceremony.

What I actually wanted was a small window tucked into a corner of the screen, that tells me everything at a glance.

### What it does today

- 🎵 Follows Spotify's current track and streams time-synced lyrics from [lrclib.net](https://lrclib.net), scrolling in real time
- 💿 Shows the album cover next to the lyric line
- 📊 A thin bar at the bottom tracks playback progress
- 🧠 CPU and memory as compact rings; disk shows free space as text
- 🪟 Float the overlay anywhere; position is saved across launches
- 📌 A `ʟ` icon in the menu bar toggles visibility or quits the app

### What's next

It's still a work in progress. A few directions I want to push further:

- More media sources — Apple Music, system-wide Now Playing
- User-configurable layout and themes
- Per-display positioning

### Download

- [Latest release](https://github.com/LarryHsiao/Iris/releases/latest)
- [Source on GitHub](https://github.com/LarryHsiao/Iris)

If you also code with music on, give it a try. If you have thoughts or feature ideas, [open an issue](https://github.com/LarryHsiao/Iris/issues) — I'd love to hear them.
