+++
date = "2026-06-17"
title = "Why Did a Failed Offline Request Send Itself After Reconnecting?"
slug = "offline-request-socket-race"
[taxonomies]
tags = ["Flutter", "Network"]
+++

> **Note:** This article was completed by AI (Claude) from my initial notes and thoughts.

This puzzled me for years: a network request that *should have failed* would sometimes, after I plugged the network back in, send itself anyway.

I hit it again recently in a Flutter app, and this time I finally pieced together what was going on. The answer is deflating — **it's not a clever "auto-sync on reconnect" feature. It's a race against the TCP connect timeout.**

### The symptom

The app is offline-first: when you save a record, it's written to the local encrypted database first, then a background HTTP upload is fired off fire-and-forget. Nothing is lost offline; the upload is best-effort.

(Everything below was tested on iOS — the connect-timeout and negative-caching behaviors vary by OS, so don't take the second counts as cross-platform constants.)

While testing, I saw this:

1. Turn off wifi, save a record — the upload request **doesn't fail immediately; it hangs**.
2. A while later, I turn wifi back on and do something **completely unrelated**.
3. That record, the one that "should have failed," **uploads on its own**.

It looks exactly like the app detected the network coming back and re-sent. But I was certain — **there is no connectivity-listening code anywhere in this app.** So how did it get sent?

### The misread: "it must have auto-sync on reconnect"

This is the most intuitive — and most wrong — explanation. With no connectivity listener, nobody triggers a re-send. The request wasn't *re-sent* — **it was only ever sent once**; that one attempt just took a very long time to complete.

The phrase "a very long time" is the whole story.

### The real cause: the request was *waiting*, not *failing*

Unpack what an HTTP POST does with no network:

- First DNS resolution, then a TCP connect.
- TCP connect = send a SYN packet, wait for a SYN-ACK.
- No network → no reply → the kernel doesn't give up at once. It **retransmits the SYN on a backoff schedule, over and over, up to a connect timeout**. That timeout is on the order of tens of seconds — roughly 30s on iOS.
- **During that window the request hasn't failed — it's waiting.**

And Dart's `http.Client.post` has **no app-level timeout by default**, so the Future stays pending for the entire connect-timeout window.

Add that the request is fire-and-forget (`unawaited`, or `.then()` with no await): the UI moved on long ago, but the request is still alive in the background:

```dart
// Roughly this — not the actual code
unawaited(client.post(uri, body: payload)); // no timeout, not awaited
// ↑ Offline, this Future stalls inside the OS connect-timeout window — up to ~30s
```

So the "magic" happens: **if I bring the network back before the connect timeout expires**, the next retransmitted SYN finally gets a reply → the connection establishes → the POST still queued in the background completes.

It looks like auto-sync. It's really just **a race to reconnect before the connect timeout fires.**

Worth stressing: this is deeply unreliable. Reconnect a step too late — the timeout already fired — and the request failed long ago; nothing uploads until something explicitly retries.

### Corroborating clue: first one slow, the rest fail instantly

There's another clue that backs the mechanism: the first offline save hangs ~30s, but the second and third saves **fail instantly**.

This is classic **negative caching**: the first connect to an unreachable host waits the full OS connect timeout; once it fails, the OS caches the "host unreachable / DNS negative" result, so later attempts fail at once instead of waiting.

First slow, the rest fast — a network-stack behavior, not anything the app does.

### A sibling lesson: "an interface is up" ≠ "the internet is reachable"

To detect "offline" we used `connectivity_plus`'s `checkConnectivity()`. But it reads the **operating system's network-interface state, not whether the internet is actually reachable.**

This bit me: on an iPad with **wifi off but connected to a Mac over USB for debugging**, `checkConnectivity()` returned `ConnectivityResult.other` — the USB debug link counts as a "connected" interface — so the app thought it was **online**, ran the upload anyway, and hung. My first fix (checking `any != none`) was wrong for exactly this reason.

The right approach: count only **genuinely internet-capable interfaces** (`wifi / mobile / ethernet / vpn`) as online; treat `other` / `bluetooth` / `none` as offline.

The lesson: **interface presence is not internet reachability.** `connectivity_plus` answers "is any interface up?", not "can I reach the internet?". For the latter you need an actual probe (a DNS lookup or request with a short timeout) — trading the "instant" answer for a little latency.

### Wrap-up: draw your own boundaries instead of betting on a socket that hasn't died yet

To make offline behavior **deterministic** rather than a gamble against the connect timeout, the direction is clear:

- **If you already know you're offline, don't fire the doomed request.** Pre-check connectivity; offline, skip the upload and confirm immediately.
- **Put an app-level timeout on the request** (e.g. `future.timeout(...)`) so a hang has an upper bound, instead of handing your fate to the OS connect timeout.
- **If you really want sync-on-reconnect, listen for it honestly** (`onConnectivityChanged`) and trigger a sync deliberately — don't count on some lingering socket finishing the job for you by luck.

Three lines to close: **draw the timeout boundaries yourself, don't trust a socket still gasping for air, and "an interface is up" never means "the internet is reachable."**
