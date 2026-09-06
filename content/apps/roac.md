+++
title = "Roäc"
path = "roac"
template = "tool.html"
weight = 30
description = "桌面上的一隻渡鴉，讀你自己機器上的筆記回答問題 — 什麼都不上傳，靠的是本機執行的 Claude Code CLI。"

[extra]
icon = "/roac-icon.png"
+++

<div class="roac-page">

<figure class="roac-icon">
<img src="/roac-icon.png" width="128" alt="Roäc app icon"/>
</figure>

**問你自己的筆記，答案就從自己的機器來。**

Roäc 是一款 macOS 與 Windows 的桌面吉祥物 — 一隻小渡鴉，飄在你其他視窗之上，在螢幕上遊蕩。點一下牠，打開對話框問一句話，牠會在你自己的機器上執行已登入的 [Claude Code](https://claude.com/claude-code) CLI，讀你自己的 markdown 筆記來回答。什麼都不上傳 — CLI 讀的是這台機器上的檔案，用的是你自己的憑證。

命名取自厄瑞博的渡鴉羅亞克 — 卡爾克之子，曾為索林帶來消息的那隻渡鴉。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/roac">GitHub</a>
</div>

> 目前僅提供原始碼建置，尚無正式釋出版本；macOS 與 Windows 皆已支援。

---

## ✨ 功能

- 🖋️ **全程手繪** — 渡鴉本體是 Dart 畫出來的（`lib/sprite.dart` 的 `paintRoac`），靜止時呼吸，行走時跳躍搖擺，被釘住時闔眼。角色包範例與雙平台的 App 圖示都出自同一個繪圖函式，三者永遠不會走鐘
- 🔒 **什麼都不上傳** — 讀的是這台機器上的 markdown 筆記，跑的是你自己已登入的 CLI；離線是機制，不是口號
- ⚙️ **分層設定** — 環境變數蓋過設定檔，設定檔蓋過內建預設；設定面板用三種顏色標明每一項是誰說了算 — 綠色是環境變數，琥珀色是設定檔，素色是內建
- 🖥️ **兩個平台，兩條不同的路** — macOS 透過登入 shell 執行 CLI 以繼承 `PATH`，並以 `exec` 讓 CLI 本身接手該行程；Windows 不經任何 shell 直接呼叫 — Windows 沒有 `exec`，包一層 `cmd` 只會留下沒人收拾的殭屍行程
- 🎨 **角色包是有文件的格式** — 一個 zip，裡面一份 manifest 加每種步態一張 PNG 帶，想畫自己的渡鴉可以照著做
- 🌐 **中英雙語** — 依系統語言決定，不問；辨別正簡體靠的是文字系統（script）而非語言代碼，簡體讀者拿到的是英文，而不是被猜成的繁體
- 🕹️ **手勢操作** — 拖曳移動，點擊開關對話框，右鍵釘住（停止行走與呼吸，邊框轉灰），再右鍵一次放開

---

## 🚧 還沒做完的

- 選單列圖示與開機自動啟動，尚未動工
- 沒被啟動的 Roäc，第一次點擊會被系統吃掉用來啟動視窗，macOS 與 Windows 皆然
- Windows 螢幕縮放超過 100% 時，牠會顯得偏小 — 視窗要求 160 邏輯像素，拿到的卻是 160 實體像素

---

## 🔗 連結

- [GitHub 原始碼](https://github.com/LarryHsiao/roac)
- [問題回報](https://github.com/LarryHsiao/roac/issues)

</div>

<style>
.roac-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.roac-page figure { margin: 0 0 1rem; }
.roac-page figure.roac-icon img { border-radius: 24px; }
.roac-page h1 { margin-top: 0.5rem; }
.roac-page h2 { text-align: left; }
.roac-page ul { text-align: left; list-style: none; padding-left: 0; }
.roac-page ul li { margin: 0.5rem 0; }
.roac-page blockquote { text-align: left; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
