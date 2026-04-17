+++
date = "2022-07-28"
title = "Initialize() 寫法在 Android app 的影響與優化建議"
slug = "the-influence-of-initialize-method-in-application-on-android"
+++

> **說明：** 本文由 AI（Claude Opus 4.7）根據我的初始筆記與想法完成。

我們的應用使用了許多元件，不管是自己寫的，或者是第三方提供的函式庫，有時不免就需要在應用啟動後做初始化的動作。而在 Android 的世界，很多時候呼叫這個初始化的方法都會放在 `Application` 內的 `onCreate()` 中。

```kotlin
class AppApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AnalyticsSdk.initialize(this)
        CrashReporter.initialize(this)
        ImageLoader.initialize(this)
        ExperimentClient.initialize(this)
        // ... 以此類推
    }
}
```

看起來稀鬆平常，不是嗎？但是很不幸的，這會造成應用啟動速度拉長。在我們的專案上，Firebase Performance 量到的冷啟動時間大約是三秒——意思是用戶按下 icon 之後，要等三秒才看到第一個畫面。連啟動頁都還沒顯示。

### 為什麼 `onCreate()` 這麼敏感

`Application.onCreate()` 跑在主執行緒上，而且是在系統能繪製你任何畫面之前。這段時間，用戶看到的是作業系統拉出來的空白視窗。你在這裡多呼叫一個 `initialize()`，用戶就多等同樣的時間。

更糟的是，這些 SDK 通常不會誠實告訴你它們的初始化要花多久。一個看起來人畜無害的呼叫，內部可能做磁碟 I/O、讀 SharedPreferences、甚至同步發網路請求。

### 分類是第一步

不是每個模組都需要在 `onCreate()` 裡初始化。我的做法是把它們分成三類：

1. **啟動必需，且必須同步**：例如 crash reporter、DI container。這些沒辦法延後，因為之後的任何錯誤都需要它們。留在 `onCreate()` 裡，但盡量選輕量的 SDK。
2. **啟動需要，但可以在背景執行**：例如 logging、feature flag 同步。在 `onCreate()` 裡 `Thread {}` 或 `Executors.newSingleThreadExecutor()` 丟到背景，不要卡主執行緒。
3. **第一個畫面之後再做也不遲**：例如分析事件上報、圖片快取預熱、推播 token 註冊。這些可以等 activity 顯示之後再初始化。

把每個 SDK 想清楚歸在哪一類，就是最大的進步。

### 延後到第一個畫面之後

針對第三類，最簡單的做法是在 `Activity.onResume()` 第一次被呼叫之後觸發：

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

用 `decorView.post {}` 的好處是：它會等到當前的 frame 畫完才執行，不會跟首幀搶資源。

如果你想要更結構化的做法，Jetpack 的 [App Startup](https://developer.android.com/topic/libraries/app-startup) library 提供了 `Initializer` 介面，讓你集中管理依賴順序，並支援 lazy initialization：

```kotlin
class AnalyticsInitializer : Initializer<AnalyticsSdk> {
    override fun create(context: Context): AnalyticsSdk {
        return AnalyticsSdk.initialize(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> = emptyList()
}
```

在 `AndroidManifest.xml` 把它標成 lazy，就不會跟著 `Application.onCreate()` 一起跑：

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

之後在你需要的時候呼叫 `AppInitializer.getInstance(context).initializeComponent(AnalyticsInitializer::class.java)` 就好。

### 背景執行緒的陷阱

把初始化丟到背景聽起來簡單，但有兩個常見的坑：

- **初始化還沒完成，就有其他程式碼呼叫了它**。對這類狀況，最安全的做法是保留一個 `CompletableFuture`（或 `Deferred`、`StateFlow`），讓呼叫端能等它完成。
- **背景執行緒的優先權不夠**。預設的 `Thread` 跟主執行緒搶 CPU，在低階機器上效果有限。考慮用 `Thread.MIN_PRIORITY` 或 `Executors.newSingleThreadExecutor()` 並明確設定優先權。

### 量一下

做這些優化前，記得先量基線。Firebase Performance 的「App start」trace、或 `adb shell am start -W` 都可以給你一個起點。優化之後再量一次——沒量就是憑感覺，憑感覺通常會騙自己。

在我們的專案上，把第三類搬出去之後，冷啟動時間有明顯縮短，使用者第一眼看到畫面的延遲也跟著下降。

### 總結

- `Application.onCreate()` 跑在主執行緒，而且擋住首幀。不要把它當成萬用 init 入口。
- 把 SDK 分成「同步必需」、「可背景執行」、「可延後」三類，對症下藥。
- 延後類可以用 `decorView.post {}` 或 Jetpack App Startup 的 lazy initializer。
- 背景初始化時注意 race condition 和執行緒優先權。
- 優化前後都用工具量，別憑感覺。
