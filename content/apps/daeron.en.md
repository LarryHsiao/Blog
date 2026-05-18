+++
title = "Daeron"
path = "en/daeron"
template = "tool.html"
weight = 30
description = "A lean Windows app that turns the PC into a Bluetooth audio receiver — pair a phone, and its audio plays through the PC's speakers."

[extra]
icon = "/daeron-icon.png"
+++

<div class="daeron-page">

<figure class="daeron-icon">
<img src="/daeron-icon.png" width="128" alt="Daeron app icon"/>
</figure>

**Make the PC a speaker for the phone.**

Daeron is a lean Windows app that turns the PC into a Bluetooth audio receiver. Pair a phone to the PC, choose it in Daeron, and the phone's audio plays through the PC's speakers.

Named for Daeron, minstrel of Doriath — the greatest singer of the Eldar, and deviser of the Cirth. A vessel for another's voice.

---

## 🎧 Why Daeron

Picture the scene: your headphones are wired (or paired) to the PC. A call rings in on the phone, or a track plays there you'd like to hear. Without Daeron, the headphones must move — unplug, re-pair to the phone, listen, then back again.

Daeron turns the chore inside out. The phone sinks its audio to the PC; the headphones never leave. No device switching on the phone, no output change on the PC — the sound simply joins whatever speaker or headset the PC is already using.

<div class="store-badges">
<a href="https://github.com/LarryHsiao/Daeron/releases/latest">Download Latest</a>
<a href="https://github.com/LarryHsiao/Daeron">GitHub</a>
</div>

> Current build: `v0.1.1.0`. Still under active development.

---

## ✨ Features

- 🔊 **Bluetooth audio sink** — streams the phone's audio to the PC's speakers via `AudioPlaybackConnection`
- 🔍 **Device enumeration** — `DeviceWatcher` surfaces paired devices in a WinUI 3 config window
- 🔁 **Auto-reconnect** — the watcher re-opens the connection when the chosen phone returns
- 🪟 **Tray host** — minimize-to-tray, "Open settings", "Exit", live state surfaced on the icon
- 💾 **Persisted config** — last-chosen device, auto-reconnect, and start-with-Windows saved to `%LocalAppData%\Daeron\config.json`

---

## 📦 Install (from a release)

Download `daeron-setup-<version>.exe` from the GitHub release page and run it. UAC prompts once — admin is required to trust the self-signed cert in `LocalMachine\TrustedPeople` — then the installer trusts the certificate, registers the bundled Windows App Runtime 1.6 framework, and registers the Daeron MSIX. Daeron appears in the Start Menu and lives in the tray.

Uninstall through **Apps & features** → **Daeron** → **Uninstall**, the same as any other Windows app.

Requires Windows 10 build 19041 or later, x64.

### Manual install (fallback)

If you'd rather not run an installer, the same release ships `Daeron-<version>-x64.zip` — the raw MSIX bundle the installer wraps. Two steps:

1. **Trust the certificate.** Right-click `Daeron_<version>_x64.cer` → **Install Certificate** → choose **Local Machine** → **Place all certificates in the following store** → **Trusted People**. UAC will prompt; admin is required, once per machine.
2. **Register the package.** Right-click `Add-AppDevPackage.ps1` → **Run with PowerShell**. The helper installs the WindowsAppRuntime dependency from `Dependencies\x64\` and then registers the `.msix`.

> Use **Windows PowerShell 5.1** (`powershell.exe`), not PowerShell 7 (`pwsh.exe`). The latter does not auto-load the `Appx` module, and the helper will fail with `Add-AppxPackage` reported as an unknown command.

---

## 🔗 Links

- [Source on GitHub](https://github.com/LarryHsiao/Daeron)
- [Latest Release](https://github.com/LarryHsiao/Daeron/releases/latest)
- [Report an Issue](https://github.com/LarryHsiao/Daeron/issues)

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
