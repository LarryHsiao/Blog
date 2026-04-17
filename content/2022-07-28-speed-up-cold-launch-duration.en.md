+++
date = "2022-07-28"
title = "How initializers in Application slow down cold launch, and what to do about it"
slug = "the-influence-of-initialize-method-in-application-on-android"
+++

> **Note:** This article was completed by AI (Claude Opus 4.7) from my initial notes and thoughts.

Our app pulls in a lot of components — some we wrote ourselves, others from third-party libraries — and every so often they need to be initialized at startup. On Android, the default habit is to drop those `initialize()` calls into `Application.onCreate()`.

```kotlin
class AppApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AnalyticsSdk.initialize(this)
        CrashReporter.initialize(this)
        ImageLoader.initialize(this)
        ExperimentClient.initialize(this)
        // ... and so on
    }
}
```

Looks harmless, right? Unfortunately it makes cold launch drag. On our project, Firebase Performance measured cold launch at about three seconds — which means the user taps the icon and waits three seconds before seeing anything. Not even the splash screen.

### Why `onCreate()` is so sensitive

`Application.onCreate()` runs on the main thread, and it runs before the system can draw any UI you own. During that window the user sees the OS's blank starting window. Every extra `initialize()` call adds directly to that delay.

Worse, SDKs rarely advertise how long their initializers take. An innocuous-looking call may do disk I/O, read SharedPreferences, or even block on a synchronous network request.

### Step one: categorize

Not every module needs to be initialized in `onCreate()`. I sort them into three buckets:

1. **Required at startup, must be synchronous**: crash reporter, DI container. These can't be deferred because anything that fails afterwards needs them. Keep them in `onCreate()`, but pick lightweight SDKs.
2. **Needed at startup, can run on a background thread**: logging, feature flag sync. Launch them from `onCreate()` with `Thread {}` or `Executors.newSingleThreadExecutor()` — don't block the main thread.
3. **Can wait until after the first frame**: analytics event flushing, image cache warm-up, push token registration. Defer these until after the activity is visible.

Figuring out which bucket each SDK belongs in is the biggest single win.

### Deferring to after the first frame

For bucket 3, the simplest trigger is the first `Activity.onResume()`:

```kotlin
class MainActivity : AppCompatActivity() {
    private var initialized = false

    override fun onResume() {
        super.onResume()
        if (!initialized) {
            initialized = true
            window.decorView.post {
                AnalyticsSdk.initialize(application)
                ImageLoader.initialize(application)
            }
        }
    }
}
```

Using `decorView.post {}` means the work runs after the current frame finishes drawing, so it doesn't compete with the first frame for resources.

If you want something more structured, Jetpack's [App Startup](https://developer.android.com/topic/libraries/app-startup) library provides an `Initializer` interface that centralizes dependency ordering and supports lazy initialization:

```kotlin
class AnalyticsInitializer : Initializer<AnalyticsSdk> {
    override fun create(context: Context): AnalyticsSdk {
        return AnalyticsSdk.initialize(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> = emptyList()
}
```

Mark it as lazy in `AndroidManifest.xml` so it doesn't run with `Application.onCreate()`:

```xml
<provider
    android:name="androidx.startup.InitializationProvider"
    android:authorities="${applicationId}.androidx-startup"
    android:exported="false"
    tools:node="merge">
    <meta-data
        android:name="com.example.AnalyticsInitializer"
        android:value="androidx.startup"
        tools:node="remove" />
</provider>
```

Then call `AppInitializer.getInstance(context).initializeComponent(AnalyticsInitializer::class.java)` whenever you actually need it.

### Pitfalls of background initialization

Pushing init to a background thread sounds simple, but there are two common traps:

- **Code calls the component before its initializer finishes.** The safest pattern is to hold a `CompletableFuture` (or `Deferred`, or `StateFlow`) so callers can await completion.
- **The background thread doesn't have enough priority.** A default `Thread` competes with the main thread for CPU, which barely helps on low-end devices. Use `Thread.MIN_PRIORITY` or `Executors.newSingleThreadExecutor()` with an explicit priority.

### Measure

Before any of this, measure the baseline. Firebase Performance's "App start" trace, or `adb shell am start -W`, will give you a starting number. Measure again after. Without numbers you're guessing — and guessing usually flatters yourself.

On our project, moving bucket 3 off the critical path meaningfully reduced cold launch time and brought the user's time-to-first-pixel down with it.

### Summary

- `Application.onCreate()` runs on the main thread and blocks the first frame. Don't treat it as a universal init hook.
- Sort SDKs into "sync required", "can run in background", and "can defer" and handle each appropriately.
- For deferrable work, use `decorView.post {}` or Jetpack App Startup's lazy initializer.
- Watch for race conditions and thread priority when initializing in the background.
- Measure before and after — don't trust your gut.
