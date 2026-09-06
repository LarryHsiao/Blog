+++
title = "Roäc"
path = "jp/roac"
template = "tool.html"
weight = 30
description = "自分のマシン上のノートを読んで答える、デスクトップの渡鴉 — 何もアップロードしない、ローカルで動く Claude Code CLI によって。"

[extra]
icon = "/roac-icon.png"
+++

<div class="roac-page">

<figure class="roac-icon">
<img src="/roac-icon.png" width="128" alt="Roäc アプリアイコン"/>
</figure>

**自分のノートに問いかけ、答えは自分のマシンから。**

Roäc は macOS と Windows 用のデスクトップマスコット — 小さな渡鴉が他のウィンドウの上を漂い、画面をさまよいます。クリックして吹き出しを開き、質問を入力すると、ログイン済みの自分の [Claude Code](https://claude.com/claude-code) CLI をこのマシン上で実行し、自分のローカルな markdown ノートを読んで答えます。何もアップロードされません — CLI が読むのはこのマシン上のファイルで、使うのは自分自身の認証情報です。

名前はエレボールの渡鴉ロアック（Carc の子で、ソーリンに知らせを運んだ渡鴉）に由来します。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/roac">GitHub</a>
</div>

> 現在はソースからのビルドのみ、正式なリリースはまだありません。macOS と Windows の両方に対応済み。

---

## ✨ 機能

- 🖋️ **すべて手描き** — 渡鴉本体は Dart で描かれています（`lib/sprite.dart` の `paintRoac`）。静止時は呼吸し、歩行中は跳ねて揺れ、ピン留め中は目を閉じます。キャラクターパックの見本も両プラットフォームのアプリアイコンも、同じ描画関数から生まれるため、三者がずれることはありません
- 🔒 **何も外に出ない** — 読むのはこのマシン上の markdown ノート、実行するのは自分がログイン済みの CLI。オフラインであることは主張ではなく仕組みです
- ⚙️ **階層化された設定** — 環境変数が設定ファイルに勝ち、設定ファイルが組み込みの既定値に勝ちます。設定パネルは各設定の出所を 3 色で示します — 緑は環境変数、琥珀色は設定ファイル、無色は組み込みの既定値
- 🖥️ **2 つのプラットフォーム、2 つの違う経路** — macOS は `PATH` を継承するためログインシェルを経由して CLI を実行し、`exec` によって CLI 自身がそのプロセスを引き継ぎます。Windows はシェルを一切経由せず直接呼び出します — Windows には `exec` がなく、`cmd` でラップすると誰にも回収されないゾンビプロセスが残ってしまうためです
- 🎨 **文書化されたキャラクターパック形式** — マニフェストと歩容ごとの PNG ストリップを収めた zip。自分の渡鴉を描きたい人はこれに従えます
- 🌐 **バイリンガル、選ぶのはシステム** — 英語か繁体字中国語かはシステムのロケールから選ばれ、尋ねられることはありません。判定は言語コードではなく文字体系（script）によって行われるため、簡体字の読者は誤って繁体字を渡されるのではなく英語を受け取ります
- 🕹️ **シンプルな操作** — ドラッグで移動、クリックで吹き出しの開閉、右クリックでその場にピン留め（歩行と呼吸が止まり、枠がグレーになる）、もう一度右クリックで解除

---

## 🚧 未実装

- メニューバー項目とログイン時の自動起動はまだありません
- 非アクティブな Roäc への最初のクリックは、ウィンドウをアクティブ化するためにシステムに消費されます。macOS と Windows のどちらでも同様です
- Windows で表示スケールが 100% を超えていると、小さく表示されます — ウィンドウは論理ピクセルで 160 を要求しますが、実際には物理ピクセルで 160 が返されるためです

---

## 🔗 リンク

- [GitHub ソースコード](https://github.com/LarryHsiao/roac)
- [不具合報告](https://github.com/LarryHsiao/roac/issues)

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
