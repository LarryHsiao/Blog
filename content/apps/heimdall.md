+++
title = "Heimdall"
path = "heimdall"
template = "tool.html"
weight = 30
description = "Jira 票券的桌面小窗：用你選的 filter 顯示，可排序、調欄寬，按一下狀態就能流轉。"

[extra]
icon = "/heimdall.png"
+++

<div class="heimdall-page">

<figure class="heimdall-icon">
<img src="/heimdall.png" width="128" alt="Heimdall app icon"/>
</figure>

**只看你需要看的票券。**

Heimdall 是個小小的桌面視窗，把 Jira 票券從擁擠的網頁中接出來。每個 filter 一個分頁，內容是一張可排序、可調欄寬的表格。多數時候只看，只在點到狀態欄位時，才會悄悄地讓票券沿著工作流前進一步。

<p class="heimdall-screenshot">
<img src="/heimdall-screenshot.png" alt="Heimdall 視窗：分頁、可排序的票券表格、指派人快速篩選"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Heimdall">GitHub</a>
<a href="https://github.com/LarryHsiao/Heimdall/releases/latest">下載最新版</a>
</div>

> 目前狀態：**開發中**

---

## ✨ 功能

- 🗂️ **分頁切換 filter** — 每個 filter 一個分頁，捲動式分頁列
- 🔠 **可排序欄位** — 點擊欄位標題排序，再點一次反向
- ↔️ **可調整欄寬** — 拖拉欄位右側分隔線，寬度跨次啟動記住
- 🌳 **群組／平鋪兩種模式** — 子工作項目縮排在父票券下，或全部攤平排序
- 🎨 **優先順序與類型用圖示** — Story、Bug、Task、Epic 各自的圖示；優先順序為彩色箭頭
- 🧑 **指派人快速篩選** — 分頁列右側下拉選單，純前端過濾，不影響 JQL
- 🔁 **狀態流轉** — 點擊狀態欄位，挑選工作流中的下一步；其餘寫入操作仍交給網頁
- 🔐 **Keychain 儲存憑證** — macOS Keychain / Windows Credential Manager

---

## 🛣️ 規劃中

- 視窗位置與大小記憶
- 可調的自動重新整理間隔
- 啟動煙霧測試以外的測試

---

## 🔗 連結

- [GitHub 原始碼](https://github.com/LarryHsiao/Heimdall)
- [最新釋出版本](https://github.com/LarryHsiao/Heimdall/releases/latest)
- [問題回報](https://github.com/LarryHsiao/Heimdall/issues)

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
