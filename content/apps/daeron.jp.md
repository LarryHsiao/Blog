+++
title = "Daeron"
path = "jp/daeron"
template = "tool.html"
weight = 30
description = "Windows PC を Bluetooth オーディオレシーバーに。スマートフォンをペアリングすれば、その音が PC のスピーカーから流れる。"

[extra]
icon = "/daeron-icon.png"
+++

<div class="daeron-page">

<figure class="daeron-icon">
<img src="/daeron-icon.png" width="128" alt="Daeron アプリアイコン"/>
</figure>

**PC をスマホのスピーカーに。**

Daeron は、Windows PC を Bluetooth オーディオレシーバーへと変える小さなアプリ。スマートフォンを PC とペアリングし、Daeron で選ぶと、スマートフォンの音が PC のスピーカーから流れます。

名前はドリアスの吟遊詩人 Daeron に由来します — エルダール随一の歌い手にして、キアスの考案者。他者の声を運ぶ器。

---

## 🎧 なぜ Daeron か

こんな場面を思い浮かべてください：ヘッドホンは PC に繋がっている。そこへスマートフォンに電話が入る、あるいはスマートフォンで流れる曲を聴きたい — Daeron がなければ、ヘッドホンを動かすしかない。外し、スマートフォンへ繋ぎ直し、聴き終えて、また戻す。

Daeron はこの面倒を裏返します。スマートフォンが音を PC へ送り込み、ヘッドホンは動かない。スマートフォン側でデバイスを切り替える必要はなく、PC 側で出力先を変える必要もない — 音は、PC が今使っているスピーカーやヘッドセットへ自然と流れ込みます。

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Daeron/releases/latest">最新版をダウンロード</a>
<a href="https://github.com/LarryHsiao/Daeron">GitHub</a>
</div>

> 現行ビルド：`v0.1.1.0`。開発は継続中。

---

## ✨ 機能

- 🔊 **Bluetooth オーディオシンク** — `AudioPlaybackConnection` を介してスマートフォンの音を PC のスピーカーへストリーミング
- 🔍 **デバイス列挙** — `DeviceWatcher` がペアリング済みデバイスを WinUI 3 設定ウィンドウに表示
- 🔁 **自動再接続** — 選択中のスマートフォンが戻ってくると watcher が接続を再確立
- 🪟 **トレイ常駐** — 最小化してトレイへ、「設定を開く」「終了」、状態はアイコンに反映
- 💾 **設定保存** — 直近に選択したデバイス・自動再接続・Windows 起動時に開始は `%LocalAppData%\Daeron\config.json` に保存

---

## 📦 インストール（リリースから）

GitHub リリースページから `Daeron-<version>-x64.zip` をダウンロードし、展開します。フォルダには `.msix`、署名に使われた `.cer`、`Microsoft.WindowsAppRuntime.1.6` フレームワーク依存パッケージ、そして `Add-AppDevPackage.ps1` ヘルパーが含まれます。

二つの手順：

1. **証明書を信頼する。** `Daeron_<version>_x64.cer` を右クリック → **証明書のインストール** → **ローカルコンピューター** を選択 → **証明書をすべて次のストアに配置する** → **信頼されたユーザー**。UAC が表示され、管理者権限が必要です（マシンごとに一度のみ）。
2. **パッケージを登録する。** `Add-AppDevPackage.ps1` を右クリック → **PowerShell で実行**。ヘルパーが `Dependencies\x64\` から WindowsAppRuntime 依存を入れ、続けて `.msix` を登録します。

> **Windows PowerShell 5.1**（`powershell.exe`）を使ってください。PowerShell 7（`pwsh.exe`）ではありません。後者は `Appx` モジュールを自動読み込みせず、ヘルパーは `Add-AppxPackage` を未知のコマンドとして失敗します。

動作要件：Windows 10 build 19041 以降、x64。

---

## 🔗 リンク

- [GitHub ソースコード](https://github.com/LarryHsiao/Daeron)
- [最新リリース](https://github.com/LarryHsiao/Daeron/releases/latest)
- [不具合報告](https://github.com/LarryHsiao/Daeron/issues)

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
