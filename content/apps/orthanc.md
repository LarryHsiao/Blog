+++
title = "Orthanc"
path = "orthanc"
template = "tool.html"
weight = 30
description = "一扇窗容納多個嵌入式終端機：以快速鍵分割，讓數個 Claude Code 會談並列於眼前。"

[extra]
icon = "/orthanc-icon.png"
+++

<div class="orthanc-page">

<figure class="orthanc-icon">
<img src="/orthanc-icon.png" width="128" alt="Orthanc app icon"/>
</figure>

**數個會談，一扇窗盡收。**

Orthanc 是一款 Windows 與 macOS 的桌面應用程式，於同一扇窗中安置多個嵌入式終端機。以快速鍵分割成並列的窗格，每格各自執行一個 shell，於是數個 [Claude Code](https://claude.com/claude-code) 會談得以並肩受你看顧與指揮。

啟動時每格開的是 **shell，而非 `claude` 本身** — 如同任何終端機，你在窗格中自行輸入 `claude`。預設的 shell 依平台選定，亦可於設定中更換。

命名取自剛鐸的歐散克塔 — 艾辛格之心，藉真知晶球守望中土全境的高塔。

<p class="orthanc-screenshot">
<img src="/orthanc-screenshot.png" alt="Orthanc 視窗：九個分割窗格，四個展開、五個收攏為標題列；各標題列顯示執行中的程式與其活動"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/orthanc/releases/latest">下載最新版</a>
<a href="https://github.com/LarryHsiao/orthanc">GitHub</a>
</div>

> 目前版本：`v1.1.17`。已發布，Windows 與 macOS 皆可用；Linux 不在支援之列。

---

## ✨ 功能

- 🪟 **一窗多會談** — 以快速鍵排布成 tmux 風格的分割窗格；版面是一棵不可變的樹，分割、關閉、移動焦點皆回傳新的一棵
- 🏷️ **窗格標題隨程式而動** — 顯示執行中的程式最後宣告的名稱（Claude Code 以 OSC 0 設定），旁附當前活動；`bash` 與 `zsh` 另裝 prompt hook，讓窗格自行命名
- 📐 **收攏與更名** — 窗格可摺疊至僅存標題列再展開，亦可掛上執行中的程式無法覆寫的手動名稱
- ⚙️ **可設定的啟動程式** — 依平台自動偵測，亦可於設定中指定；路徑存檔前先行驗證
- 🎨 **終端機外觀** — 配色與字型於同一設定視窗中挑選，附即時預覽，儲存後立即套用至每一格
- 🔗 **可點擊的超連結** — 程式發出的 OSC 8 連結加上底線，`Cmd`/`Ctrl`+點擊開啟；僅限 `http` 與 `https`
- 👁️ **看得見的焦點** — 聚焦中的窗格帶著淡色強調邊框；未聚焦而剛結束一陣忙碌的窗格會染上暗黃，直到被看過為止
- 🪟 **第二扇窗** — `Cmd+N`／`Ctrl+N` 另開一扇作業系統視窗，擁有各自獨立的工作區與 pty 會談，共用同一份設定
- ⚡ **Quake 式下拉終端機** — 專屬實體，於任何處按 `` Ctrl+` `` 即自游標所在螢幕的上緣落下，滿寬半高
- 📋 **右鍵複製貼上** — 以手勢取用，不必倚賴各平台的 shell 慣例

---

## ⌨️ 快速鍵

各平台皆沿用該處既有終端機的慣例 — macOS 取 iTerm2，Windows 取 Windows Terminal。

| | macOS | Windows |
|---|---|---|
| 左右分割 | `Cmd+D` | `Alt+Shift+=` |
| 上下分割 | `Cmd+Shift+D` | `Alt+Shift+-` |
| 移動焦點 | `Cmd+Alt+方向鍵` | `Alt+方向鍵` |
| 關閉窗格 | `Cmd+W` | `Ctrl+Shift+W` |
| 收攏／展開 | `Cmd+Shift+Enter` | `Alt+Shift+Z` |
| 開啟超連結 | `Cmd`+點擊 | `Ctrl`+點擊 |
| 開新視窗 | `Cmd+N` | `Ctrl+N` |
| 切換 Quake 視窗 | `` Ctrl+` `` | `` Ctrl+` `` |

未列於此的按鍵一律原封不動送抵終端機。`Ctrl+D` 兩平台皆未綁定 — 它是 EOF，按下會結束一個會談，而非分割一個。

---

## 🔗 連結

- [GitHub 原始碼](https://github.com/LarryHsiao/orthanc)
- [最新釋出版本](https://github.com/LarryHsiao/orthanc/releases/latest)
- [問題回報](https://github.com/LarryHsiao/orthanc/issues)

</div>

<style>
.orthanc-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.orthanc-page figure { margin: 0 0 1rem; }
.orthanc-page figure.orthanc-icon img { border-radius: 24px; }
.orthanc-page .orthanc-screenshot { margin: 1.5rem 0; }
.orthanc-page .orthanc-screenshot img { width: auto; height: auto; max-width: 100%; border-radius: 8px; border: none; object-fit: initial; }
.orthanc-page h1 { margin-top: 0.5rem; }
.orthanc-page h2 { text-align: left; }
.orthanc-page ul { text-align: left; list-style: none; padding-left: 0; }
.orthanc-page ul li { margin: 0.5rem 0; }
.orthanc-page blockquote { text-align: left; }
.orthanc-page table { margin: 1.25rem auto; border-collapse: collapse; width: 100%; font-size: 0.95rem; }
.orthanc-page th, .orthanc-page td { padding: 0.45rem 0.6rem; border-bottom: 1px solid rgba(128,128,128,0.25); }
.orthanc-page thead th { border-bottom-width: 2px; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
