+++
title = "Orthanc"
path = "jp/orthanc"
template = "tool.html"
weight = 30
description = "1 つのウィンドウに複数の埋め込みターミナル — ホットキーで分割し、複数の Claude Code セッションを並べて見守る。"

[extra]
icon = "/orthanc-icon.png"
+++

<div class="orthanc-page">

<figure class="orthanc-icon">
<img src="/orthanc-icon.png" width="128" alt="Orthanc アプリアイコン"/>
</figure>

**複数のセッションを、ひとつのウィンドウに。**

Orthanc は Windows と macOS 用のデスクトップアプリ。1 つのウィンドウに複数の埋め込みターミナルを収めます。ホットキーでペインに分割すると、各ペインがそれぞれのシェルを実行します。これにより、複数の [Claude Code](https://claude.com/claude-code) セッションを並べて見守り、指示できます。

起動時に各ペインが開くのは **シェルであり、`claude` そのものではありません**。他のターミナルと同じく、ペイン内で `claude` と入力します。既定のシェルはプラットフォームごとに選ばれ、設定で変更できます。

名前はゴンドールのオルサンクの塔に由来します — アイゼンガルドの中心にあり、パランティーアを通して中つ国を見張った塔です。

<p class="orthanc-screenshot">
<img src="/orthanc-screenshot.png" alt="Orthanc のウィンドウ：9 つの分割ペイン。4 つは展開、5 つはバーだけに折りたたみ。各バーは実行中のプログラムとその活動を表示"/>
</p>

<div class="store-badges">
<a href="https://github.com/LarryHsiao/orthanc/releases/latest">最新版をダウンロード</a>
<a href="https://github.com/LarryHsiao/orthanc">GitHub</a>
</div>

> 現在のビルド：`v1.1.17`。Windows と macOS でリリース済み、Linux は非対応。

---

## ✨ 機能

- 🪟 **1 ウィンドウに複数セッション** — ホットキーで配置する tmux 風の分割ペイン。レイアウトは不変のツリーで、分割・クローズ・フォーカス移動はいずれも新しいツリーを返す
- 🏷️ **プログラムに追従するペインタイトル** — 実行中のプログラムが最後に宣言した名前（Claude Code は OSC 0 で設定）と現在の活動を並べて表示。`bash` と `zsh` には prompt hook を入れ、ペインが自ら名乗る
- 📐 **折りたたみと改名** — ペインをバーだけに畳んで復元でき、実行中のプログラムが上書きできない手動の名前も付けられる
- ⚙️ **起動プログラムの設定** — プラットフォームごとに自動検出、設定で上書き可能。パスは保存前に検証
- 🎨 **ターミナルの外観** — 配色とフォントを同じ設定ダイアログでライブプレビュー付きで選び、保存後すべてのペインに即座に適用
- 🔗 **クリックできるハイパーリンク** — OSC 8 リンクに下線が付き、`Cmd`/`Ctrl`+クリックで開く（`http` と `https` のみ）
- 👁️ **目に見えるフォーカス** — フォーカス中のペインは淡いアクセントの枠を帯び、非フォーカスのまま一連の活動を終えたペインは見られるまで暗い黄色に染まる
- 🪟 **2 つ目のウィンドウ** — `Cmd+N`／`Ctrl+N` で独立したワークスペースと pty セッションを持つ別ウィンドウを開き、設定は共有
- ⚡ **Quake 風のドロップダウンターミナル** — どこからでも `` Ctrl+` `` に応える専用インスタンス。カーソルのある画面の上端に、全幅・半分の高さで降りてくる
- 📋 **右クリックメニューのコピー＆ペースト** — プラットフォームごとのシェルの慣習ではなく、操作で届く確実な経路

---

## ⌨️ キーバインド

各プラットフォームでは、その環境で既に使われているターミナルの流儀に従います — macOS は iTerm2、Windows は Windows Terminal。

| | macOS | Windows |
|---|---|---|
| 左右に分割 | `Cmd+D` | `Alt+Shift+=` |
| 上下に分割 | `Cmd+Shift+D` | `Alt+Shift+-` |
| フォーカス移動 | `Cmd+Alt+矢印` | `Alt+矢印` |
| ペインを閉じる | `Cmd+W` | `Ctrl+Shift+W` |
| 折りたたみ／展開 | `Cmd+Shift+Enter` | `Alt+Shift+Z` |
| リンクを開く | `Cmd`+クリック | `Ctrl`+クリック |
| 新しいウィンドウを開く | `Cmd+N` | `Ctrl+N` |
| Quake ウィンドウ切替 | `` Ctrl+` `` | `` Ctrl+` `` |

ここに挙げていないキーはそのままターミナルへ届きます。`Ctrl+D` はどちらのプラットフォームでも未割り当て — EOF であり、押せばセッションを分割せず終了させてしまうためです。

---

## 🔗 リンク

- [GitHub ソースコード](https://github.com/LarryHsiao/orthanc)
- [最新リリース](https://github.com/LarryHsiao/orthanc/releases/latest)
- [不具合報告](https://github.com/LarryHsiao/orthanc/issues)

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
