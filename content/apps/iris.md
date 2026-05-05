+++
title = "Iris"
path = "iris"
template = "tool.html"
weight = 20
description = "macOS 螢幕上的輕量 HUD：同步歌詞、專輯封面、系統狀態一目了然。"

[extra]
icon = "/iris-icon.svg"
+++

<div class="iris-page">

<figure class="iris-icon">
<img src="/iris-icon.svg" width="128" alt="Iris app icon"/>
</figure>

**不用切換視窗，也能看見現在的一切。**

Iris 是一款 macOS 上的輕量懸浮 HUD，永遠置頂、可拖曳，能同時顯示同步歌詞與系統狀態。專注工作的時候，不必再離開當下去確認歌詞或監看 CPU。

<p class="iris-screenshot">
<img src="/iris-screenshot.png" alt="Iris 懸浮視窗顯示歌詞與系統指標"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Iris/releases/latest">下載最新版</a>
<a href="https://github.com/LarryHsiao/Iris">GitHub</a>
</div>

> 目前狀態：**開發中**

---

## ✨ 功能

- 🎵 **同步歌詞** — 跟隨 Spotify 正在播放的曲目，從 [lrclib.net](https://lrclib.net) 串流即時滾動的歌詞
- 💿 **專輯封面** — 與歌詞並列顯示目前曲目的封面
- 📊 **播放進度** — 視窗底部細長進度條顯示播放位置
- 🧠 **系統指標** — CPU 與記憶體以環形表示，磁碟以文字呈現剩餘空間
- 🪟 **可拖曳懸浮視窗** — 放在螢幕任何位置，位置會跨次啟動記住
- 📌 **選單列控制** — 透過 `ʟ` 狀態列圖示切換顯示或離開

---

## 🛣️ 規劃中

- 更多音源（Apple Music、系統 Now Playing）
- 可自訂版面與主題
- 多螢幕個別位置設定

---

## 🔗 連結

- [GitHub 原始碼](https://github.com/LarryHsiao/Iris)
- [最新釋出版本](https://github.com/LarryHsiao/Iris/releases/latest)
- [問題回報](https://github.com/LarryHsiao/Iris/issues)

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
