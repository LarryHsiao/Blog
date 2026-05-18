+++
title = "Carpo"
path = "carpo"
template = "tool.html"
weight = 30
description = "桌面媒體標籤管理工具 — 不搬動檔案，為你已整理好的資料夾鋪上一層標籤。"

[extra]
icon = "/carpo-icon.png"
+++

<div class="carpo-page">

<figure class="carpo-icon">
<img src="/carpo-icon.png" width="128" alt="Carpo 應用程式圖示"/>
</figure>

**檔案不搬，標籤先到。**

Carpo 是一款桌面媒體標籤管理工具，把標籤鋪在你已經整理好的資料夾之上 — 照片、影片、音樂，原檔不動，不被擁有。重命名或移動之後，標籤依然跟得上。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/carpo-dist/releases/latest">下載最新版</a>
<a href="https://github.com/LarryHsiao/carpo-dist/issues">問題回報</a>
</div>

> 目前狀態：**v1.0.1 已釋出**

---

## ✨ 功能

- 🗂️ **瀏覽，不索引** — 觀察你已維護的資料夾，從不搬動或擁有檔案
- 🏷️ **資料夾或檔案皆可標籤** — 標籤語彙以工作區（bucket）為範圍
- 🔁 **標籤跟著重命名走** — SHA-256 內容指紋讓標籤跨重命名與移動自動重綁
- ⚡ **即時檔案系統** — DirectoryWatcher 隨外部新增、移動、移除即時刷新
- ⌨️ **鍵盤優先** — 方向鍵移動、Enter 開啟、Backspace 上層、Ctrl+A 全選
- 🌳 **多階層標籤** — 父標籤過濾會展開所有子孫，計數自然累加

---

## 🛣️ 規劃中

- 命名查詢視圖 — 持久化的標籤條件組合
- 拖放：拖檔案到標籤上掛標籤；拖檔案在資料夾間移動
- 格式感知中介資料（EXIF、編解碼、ID3)
- 內建媒體播放 — FFmpeg 影格、音訊波形、全螢幕檢視

---

## 🔗 連結

- [最新釋出版本](https://github.com/LarryHsiao/carpo-dist/releases/latest)
- [問題回報](https://github.com/LarryHsiao/carpo-dist/issues)

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
