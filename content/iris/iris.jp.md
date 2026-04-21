+++
title = "Iris"
template = "about.html"
description = "macOS 用の軽量 HUD：同期歌詞・アルバムアート・システム状態を一画面で。"
+++

<div class="iris-page">

<figure class="iris-icon">
<img src="/iris-icon.svg" width="128" alt="Iris アプリアイコン"/>
</figure>

**もう、タブを切り替える必要はない。**

Iris は macOS 用の軽量・常時最前面 HUD。同期歌詞とシステム指標を、ドラッグ可能なひとつのオーバーレイに収めます。集中を切らさずに、今流れている曲もマシンの状態も、ひと目で。

<p class="iris-screenshot">
<img src="/iris-screenshot.png" alt="歌詞とシステムリングゲージを表示する Iris オーバーレイ"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Iris/releases/latest">最新版をダウンロード</a>
<a href="https://github.com/LarryHsiao/Iris">GitHub</a>
</div>

> ステータス：**開発中**

---

## ✨ 機能

- 🎵 **同期歌詞** — Spotify の再生中トラックに追従し、[lrclib.net](https://lrclib.net) からリアルタイムに歌詞をストリーミング
- 💿 **アルバムアート** — 現在のトラックのカバーアートを歌詞と並べて表示
- 📊 **再生プログレスバー** — オーバーレイ下部の細いバーで再生位置を表示
- 🧠 **システムリングゲージ** — CPU とメモリをリングで、ディスクは空き容量をテキストで表示
- 🪟 **ドラッグ可能なオーバーレイ** — 画面上の任意の位置に配置、位置は次回起動時も保持
- 📌 **メニューバー制御** — `ʟ` ステータス項目から表示切替・終了

---

## 🛣️ 予定

- 音源の追加（Apple Music、システム全体の Now Playing）
- レイアウト・テーマのカスタマイズ
- ディスプレイごとの位置設定

---

## 🔗 リンク

- [GitHub ソースコード](https://github.com/LarryHsiao/Iris)
- [最新リリース](https://github.com/LarryHsiao/Iris/releases/latest)
- [不具合報告](https://github.com/LarryHsiao/Iris/issues)

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
