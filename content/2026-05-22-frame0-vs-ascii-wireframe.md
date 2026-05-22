+++
date = "2026-05-22"
title = "Frame0 對上 ASCII 線框圖:同一張畫面的成本實測"
slug = "frame0-vs-ascii-wireframe"
[taxonomies]
tags = ["Frame0", "MCP", "Tooling"]
+++

最近開始把 Frame0 接到 Claude Code 的 MCP 工具集裡,想法很簡單:讓 AI 在對話裡順手畫個線框圖,溝通起來會比文字描述快。

但這也帶出一個問題 —— **畫一張線框圖到底會花多少 token?**

我拿自己的 side project [Heimdall](https://github.com/LarryHsiao/Heimdall)(一個 Jira 桌面客戶端)當白老鼠,把它的主畫面同時用兩種方式畫了一次:純文字 ASCII,以及 Frame0 MCP 真實向量。同一份結構、同一份 mock data、同一輪會話內完成。

### 兩張圖擺一起

ASCII 版,在訊息裡直接渲染、零 MCP 呼叫:

<figure>
<img src="../ascii-fallback-heimdall.png" alt="ASCII fallback wireframe of the Heimdall tickets page"/>
</figure>

Frame0 版,93 個圖形,匯出 PNG:

<figure>
<img src="../frame0-wireframe-heimdall.png" alt="Frame0 wireframe of the Heimdall tickets page"/>
</figure>

同一個畫面 —— AppBar、分頁列、搜尋框、指派人下拉、表格(含子任務縮排、隱藏子任務指示器、優先序圖示、狀態 pill)—— 兩種媒介各畫一次。

### 數字

| 面向 | ASCII | Frame0 |
|---|---|---|
| Token 成本 | 近乎零(訊息字元) | **50k–70k**(MCP 來回) |
| 牆面時間 | 秒級 | **數分鐘**(LLM 生成 ≫ MCP 處理) |
| 視覺品質 | 等寬錯位、emoji 替代 icon | 真實向量、可匯出 PNG |
| 對外溝通 | 不適合 | 適合 |
| 修改成本 | 改字串 | 重畫或逐個 update |

Frame0 那 50k–70k 不是均勻分布的。拆開來看:

- **圖形建立** —— ~95 個成功 + 5 個失敗重試,約 30k–35k tokens。每個 shape 平均 ~180 進 + ~150 出。
- **`search_icons`** —— 15 次 icon 名稱查詢,**意外是最大宗的隱藏成本**,約 20k–30k tokens。每個關鍵字回傳 5–50 筆 icon 描述,response 體積比想像中大很多。
- **`export_page_as_image`** —— 匯出 PNG 以視覺輸入計費,單張 1.5k–2k tokens。
- **其他**(schema 載入、`add_page`、`create_frame`)—— <2k tokens。

### 一個可以省 ~25k 的小撥動

跑完一輪後,所有用到的 icon 名稱我都記下來了:

| 用途 | Frame0 icon 名 |
|---|---|
| Story | `bookmark` |
| Task / Sub-task | `square-check` |
| Bug | `bug` |
| Epic | `zap` |
| 設定 | `settings` |
| 搜尋 | `search` |
| 使用者 | `user` |
| 下拉箭頭 | `chevron-down` |
| 優先序 升 / 降 | `arrow-up` / `arrow-down` |
| 優先序 最高 / 最低 | `chevrons-up` / `chevrons-down` |

下一次同一類畫面,不必再呼叫 `search_icons` —— 直接用對應名字。光這一步就能把總用量從 50k–70k 壓到 **~30k**。

另一個小坑是 `create_icon` 的 `name` 參數 —— 那是 **icon 庫的名稱**,不是你自己取的標籤。我第一輪用「我看得懂的名字」(像 `action-hash`)填,五個 icon 全部 500。改成 `hash`、`refresh-cw` 這些真實 icon 名就過了。一次浪費 ~1.5k tokens。

### 最後得到的工作流

對齊結構先用 ASCII,確定形狀對了再用 Frame0 出最終稿。

ASCII 版的價值不在好看 —— 在於**改錯成本接近零**。把欄位順序、分組邏輯、空狀態都在文字版定下來,Frame0 那一輪就只是把已經對齊的結構轉成可審視的視覺稿。

如果一上來就在 Frame0 裡反覆移座標、改 icon、調 pill 寬度,token 成本不會是 50k–70k,而是 50k–70k 的兩三倍 —— 每改一個圖形都要 update,而 update 跟 create 同樣貴。

### 給也在試 MCP 工具的人

- **單一畫面溝通用線框圖** —— Frame0 划算,30k–70k tokens 換一張對外能看的視覺稿。
- **多畫面批量產出** —— 成本會線性疊加。若需要全產品線的設計稿,Frame0 留給最終稿;結構對齊用 ASCII 或 Mermaid。
- **預先準備 icon 對照表** —— 跳過 `search_icons` 是最大的單一節省。
- **平行送出 shape 建立,但要校準預期** —— 同一個 frame 下的圖形彼此無依賴,單一訊息批次 32 個並行沒問題,Frame0 伺服器端是秒級處理完一整批。**但整體牆面時間不是秒級** —— LLM 在每個批次之間還要花十幾到幾十秒生成 tool calls,實際完成一張圖是「數分鐘」量級。平行批次省的是 MCP 伺服器端的處理時間,不是 LLM 端的生成時間。
- **TRIALMODE 浮水印** —— Frame0 試用版的 MCP 匯出會有斜向 TRIALMODE 字樣。畫布內是乾淨的,只有匯出才會被標記。對外用之前先確認授權狀態。

---

*這篇 benchmark 是 2026-05-22 在 Claude Opus 4.7 上跑出來的,Frame0 MCP 客戶端,Heimdall 主畫面(800×632 桌面框)作為樣本。數字是估計值 —— 我無法從會話內讀到 harness 的精確 token 計數,實際數字以 session usage 面板為準。*
