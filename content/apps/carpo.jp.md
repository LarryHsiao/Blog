+++
title = "Carpo"
path = "jp/carpo"
template = "tool.html"
weight = 30
description = "デスクトップ用メディアタグマネージャー — ファイルを動かさず、既存のフォルダーにタグの層を被せる。"

[extra]
icon = "/carpo-icon.png"
+++

<div class="carpo-page">

<figure class="carpo-icon">
<img src="/carpo-icon.png" width="128" alt="Carpo アプリアイコン"/>
</figure>

**ファイルはそのまま、タグだけが追いつく。**

Carpo はデスクトップ用のメディアタグマネージャー。あなたがすでに整えたフォルダーの上に、タグの層を被せます — 写真、動画、音楽、ファイル本体は動かさず、所有もしない。リネームや移動の後も、タグはついてきます。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/carpo-dist/releases/latest">最新版をダウンロード</a>
<a href="https://github.com/LarryHsiao/carpo-dist/issues">不具合報告</a>
</div>

> ステータス：**v1.0.1 リリース済み**

---

## ✨ 機能

- 🗂️ **閲覧、インデックスなし** — すでに整えたフォルダーを観察するだけ。ファイルは動かさず、所有もしない
- 🏷️ **任意のパスにタグ** — フォルダーにもファイルにも。タグ語彙はワークスペース（bucket）単位
- 🔁 **タグはリネームを追う** — SHA-256 コンテンツ指紋により、リネームや移動を越えてタグが再バインド
- ⚡ **ライブなファイルシステム** — DirectoryWatcher が外部の追加・移動・削除をグリッドに即反映
- ⌨️ **キーボード優先** — 矢印キーで移動、Enter で開く、Backspace で上層へ、Ctrl+A で表示中全選択
- 🌳 **階層タグ** — 親タグでのフィルターは子孫もすべて含み、カウントは自然に積み上がる

---

## 🛣️ 予定

- 保存ビュー — 名前を付けたタグ条件クエリの永続化
- ドラッグ＆ドロップ — ファイルをタグにドロップして付与；フォルダー間でファイルを移動
- フォーマット対応メタデータ（EXIF、コーデック、ID3）
- アプリ内メディア再生 — FFmpeg フレーム、波形、全画面表示

---

## 🔗 リンク

- [最新リリース](https://github.com/LarryHsiao/carpo-dist/releases/latest)
- [不具合報告](https://github.com/LarryHsiao/carpo-dist/issues)

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
