+++
title = "Daeron"
path = "daeron"
template = "tool.html"
weight = 30
description = "讓 Windows PC 化身藍牙音訊接收器：手機配對到 PC，聲音便由電腦的喇叭流出。"

[extra]
icon = "/daeron-icon.png"
+++

<div class="daeron-page">

<figure class="daeron-icon">
<img src="/daeron-icon.png" width="128" alt="Daeron app icon"/>
</figure>

**讓 PC 成為手機的喇叭。**

Daeron 是一款精簡的 Windows 應用程式，把電腦化作藍牙音訊接收器。將手機配對到 PC，於 Daeron 中選定它，手機的音訊便會透過電腦的喇叭播放。

命名取自多瑞亞斯的吟遊詩人 Daeron — 埃爾達族中最偉大的歌者，亦是基爾斯文字的創製者。盛載他人之聲的器皿。

---

## 🎧 為什麼用 Daeron

設想此景：耳機已接在 PC 上。手機這時響起電話，或想聽手機裡正在播的曲子 — 若無 Daeron，耳機便得遷徙：拔下、改與手機配對、聽完、再切回 PC。

Daeron 翻轉這份折騰。手機將音訊匯入 PC，耳機從未離位。手機端不必更換輸出裝置，PC 端亦無須改動播放路徑 — 聲音自然流向你正在使用的喇叭或耳機。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Daeron/releases/latest">下載最新版</a>
<a href="https://github.com/LarryHsiao/Daeron">GitHub</a>
</div>

> 目前版本：`v0.1.1.0`。仍在開發中。

---

## ✨ 功能

- 🔊 **藍牙音訊接收** — 透過 `AudioPlaybackConnection` 將手機的聲音串流至 PC 的喇叭
- 🔍 **裝置枚舉** — 以 `DeviceWatcher` 掃描已配對裝置，於 WinUI 3 設定視窗中選擇
- 🔁 **自動重連** — 所選的手機回到範圍時，watcher 會重新開啟連線
- 🪟 **常駐系統匣** — 最小化至系統匣、「開啟設定」、「離開」，狀態圖示即時呈現連線情形
- 💾 **設定保存** — 上次選擇的裝置、自動重連與隨 Windows 啟動皆寫入 `%LocalAppData%\Daeron\config.json`

---

## 📦 安裝（從 Release）

於 GitHub Release 頁面下載 `Daeron-<version>-x64.zip` 並解壓。資料夾中包含 `.msix`、簽名所用的 `.cer`、`Microsoft.WindowsAppRuntime.1.6` 框架相依套件，以及 `Add-AppDevPackage.ps1` 輔助腳本。

兩個步驟：

1. **信任憑證。** 對 `Daeron_<version>_x64.cer` 按右鍵 → **安裝憑證** → 選 **本機電腦** → **將所有憑證放入下列存放區** → **受信任的人**。UAC 會跳出，需管理員權限，每台機器一次。
2. **註冊套件。** 對 `Add-AppDevPackage.ps1` 按右鍵 → **以 PowerShell 執行**。腳本會從 `Dependencies\x64\` 安裝 WindowsAppRuntime 相依套件，再註冊 `.msix`。

> 請使用 **Windows PowerShell 5.1**（`powershell.exe`），而非 PowerShell 7（`pwsh.exe`）。後者不會自動載入 `Appx` 模組，腳本將以 `Add-AppxPackage` 為未知指令而失敗。

需求：Windows 10 build 19041 或更新，x64。

---

## 🔗 連結

- [GitHub 原始碼](https://github.com/LarryHsiao/Daeron)
- [最新釋出版本](https://github.com/LarryHsiao/Daeron/releases/latest)
- [問題回報](https://github.com/LarryHsiao/Daeron/issues)

</div>

<style>
.daeron-page { text-align: center; max-width: 36rem; margin: 0 auto; }
.daeron-page figure { margin: 0 0 1rem; }
.daeron-page figure.daeron-icon img { border-radius: 24px; }
.daeron-page h1 { margin-top: 0.5rem; }
.daeron-page h2 { text-align: left; }
.daeron-page ul { text-align: left; list-style: none; padding-left: 0; }
.daeron-page ul li { margin: 0.5rem 0; }
.daeron-page blockquote { text-align: left; }
.store-badges { display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin: 1.5rem 0; }
.store-badges a { display: inline-flex; align-items: center; height: 44px; padding: 0 1rem; border: 1px solid currentColor; border-radius: 8px; text-decoration: none; }
</style>
