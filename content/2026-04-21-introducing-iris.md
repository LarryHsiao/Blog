+++
date = "2026-04-21"
title = "Iris — 螢幕上的小窗"
slug = "introducing-iris"
[taxonomies]
tags = ["Iris", "macOS"]
+++

<figure>
<img src="../iris-icon.svg" width="128" alt="Iris app icon"/>
</figure>

我做了一個新的 app，叫做 Iris。

它是一個 macOS 上的懸浮視窗——永遠置頂、可拖曳，能同時顯示 Spotify 的同步歌詞、專輯封面，還有 CPU、記憶體、磁碟這些系統指標。

### 為什麼做這個

寫程式的時候我習慣一邊聽歌。遇到喜歡的段落，常常會想看一下歌詞是什麼——但 Spotify 的視窗不是被 IDE 蓋住，就是在另一個桌面。要切過去看一下，又要切回來，這個動作本身就打斷了思緒。

系統指標也一樣。想知道現在 CPU 在跑什麼、還剩多少記憶體，開活動監視器的動作太重了。

我要的其實就是一個小小的窗，放在螢幕角落，看一眼就知道現在發生什麼事。

### 目前能做什麼

- 🎵 跟著 Spotify 正在播放的曲目，從 [lrclib.net](https://lrclib.net) 拉同步歌詞，即時滾動
- 💿 歌詞旁邊顯示專輯封面
- 📊 視窗底部細細的進度條顯示播放位置
- 🧠 CPU 和記憶體用環形圖示，磁碟用文字顯示剩餘空間
- 🪟 視窗可以拖到螢幕任何位置，下次開啟會記得
- 📌 選單列上有個 `ʟ` 圖示，可以切換顯示或離開

### 還在路上

目前還在開發中，有幾個方向想繼續做：

- 支援更多音源，像 Apple Music 或系統全域的 Now Playing
- 可自訂的版面跟主題
- 多螢幕獨立記住位置

### 下載

- [最新版本下載](https://github.com/LarryHsiao/Iris/releases/latest)
- [原始碼](https://github.com/LarryHsiao/Iris)

如果你也常常一邊工作一邊聽歌，歡迎試試看，有什麼想法或想要的功能可以在 GitHub 上[開 issue](https://github.com/LarryHsiao/Iris/issues) 告訴我。
