+++
title = "Heimdall"
path = "jp/heimdall"
template = "tool.html"
weight = 30
description = "Jira チケットの小窓：好みのフィルタで表示し、並び替え、列幅調整、ステータスをクリックして遷移まで。"

[extra]
icon = "/heimdall.png"
+++

<div class="heimdall-page">

<figure class="heimdall-icon">
<img src="/heimdall.png" width="128" alt="Heimdall アプリアイコン"/>
</figure>

**通り過ぎるものだけを、余計な装飾なしに。**

Heimdall は小さなデスクトップ窓で、混雑した Jira の Web UI から必要なチケットだけを取り出します。保存したフィルタごとに 1 タブ、並び替えと列幅調整ができる表で表示。基本は見るだけ。ステータスのセルをクリックしたときだけ、チケットをワークフローに沿って静かに進められます。

<p class="heimdall-screenshot">
<img src="/heimdall-screenshot.png" alt="Heimdall ウィンドウ — フィルタごとのタブ、並び替え可能なチケット表、担当者クイックフィルタ"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Heimdall">GitHub</a>
<a href="https://github.com/LarryHsiao/Heimdall/releases/latest">最新版をダウンロード</a>
</div>

> ステータス：**開発中**

---

## ✨ 機能

- 🗂️ **フィルタごとのタブ** — フィルタごとに 1 タブ、横スクロール可能
- 🔠 **列ヘッダで並び替え** — クリックで並び替え、もう一度で反転
- ↔️ **列幅の調整** — ヘッダ右端のディバイダをドラッグ、幅は次回起動時も保持
- 🌳 **グループ／フラット表示** — サブタスクを親の下にインデント、もしくは全行を独立に並べる
- 🎨 **優先度・種類はアイコンで** — Story／Bug／Task／Epic のアイコン、優先度は色付き矢印
- 🧑 **担当者クイックフィルタ** — タブ列の右側プルダウン。メモリ内のみ、JQL には触れない
- 🔁 **ステータス遷移** — ステータスのセルをクリックして次のステップを選択。それ以外の書き込みは Web で
- 🔐 **資格情報は Keychain** — macOS Keychain / Windows Credential Manager

---

## 🛣️ 予定

- ウィンドウ位置とサイズの記憶
- 設定可能な自動更新間隔
- 起動スモークテスト以上のテスト

---

## 🔗 リンク

- [GitHub ソースコード](https://github.com/LarryHsiao/Heimdall)
- [最新リリース](https://github.com/LarryHsiao/Heimdall/releases/latest)
- [不具合報告](https://github.com/LarryHsiao/Heimdall/issues)

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
