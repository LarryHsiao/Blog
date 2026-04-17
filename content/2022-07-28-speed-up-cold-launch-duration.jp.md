+++
date = "2022-07-28"
title = "Application の initialize() がコールドローンチに与える影響と最適化"
slug = "the-influence-of-initialize-method-in-application-on-android"
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Opus 4.7）が仕上げたものです。

アプリにはたくさんのコンポーネントが入っている——自前で書いたもの、サードパーティのライブラリ——そしてその多くは起動時に初期化が必要になる。Android ではこうした `initialize()` 呼び出しを `Application.onCreate()` に放り込むのが定番だ。

```kotlin
class AppApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AnalyticsSdk.initialize(this)
        CrashReporter.initialize(this)
        ImageLoader.initialize(this)
        ExperimentClient.initialize(this)
        // ... など
    }
}
```

一見当たり前に見える。しかし残念ながら、これがコールドローンチを長引かせる。自分たちのプロジェクトでは Firebase Performance が計測したコールドローンチ時間が約3秒——ユーザーがアイコンをタップしてから最初の画面が出るまで3秒待つ、という意味だ。スプラッシュすら出ていない。

### なぜ `onCreate()` はこんなに敏感なのか

`Application.onCreate()` はメインスレッドで走り、さらにシステムがアプリの UI を一切描画できる前に実行される。この間、ユーザーが見ているのは OS が出した空白の starting window だけだ。ここで `initialize()` を1つ増やすと、その分だけユーザーの待ち時間が増える。

さらに困ったことに、SDK は自分の初期化にどれくらいかかるかを正直に教えてくれない。無害に見える呼び出しが、内部でディスク I/O、SharedPreferences 読み込み、さらには同期的なネットワークリクエストをしていることもある。

### まずは分類から

すべてのモジュールが `onCreate()` で初期化される必要はない。自分は3つに分けている：

1. **起動時必須、かつ同期が必要**：crash reporter、DI コンテナ。これらは後回しにできない——それ以降のエラーはこれらに依存する。`onCreate()` に残すが、軽量な SDK を選ぶこと。
2. **起動時に必要だが、バックグラウンドで実行可**：ロギング、feature flag 同期。`onCreate()` から `Thread {}` や `Executors.newSingleThreadExecutor()` で投げ、メインスレッドを塞がない。
3. **最初の画面が出てからでも間に合う**：アナリティクスのイベント送信、画像キャッシュの warm-up、プッシュトークン登録など。これらは activity が表示された後に初期化する。

各 SDK がどこに属するかをきちんと分けることが、最大の成果につながる。

### 最初のフレームの後まで遅延させる

3番目のバケットには、最初の `Activity.onResume()` をトリガーに使うのが一番シンプル：

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

`decorView.post {}` を使うと、現在のフレームの描画が終わってから実行されるので、最初のフレームとリソースを奪い合わない。

もう少し構造化したいなら、Jetpack の [App Startup](https://developer.android.com/topic/libraries/app-startup) ライブラリが `Initializer` インターフェースを提供している。依存関係の順序を集中管理でき、lazy initialization もサポートする：

```kotlin
class AnalyticsInitializer : Initializer<AnalyticsSdk> {
    override fun create(context: Context): AnalyticsSdk {
        return AnalyticsSdk.initialize(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> = emptyList()
}
```

`AndroidManifest.xml` で lazy としてマークすれば、`Application.onCreate()` と一緒に走らなくなる：

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

その後、必要になった時点で `AppInitializer.getInstance(context).initializeComponent(AnalyticsInitializer::class.java)` を呼べばいい。

### バックグラウンド初期化の落とし穴

初期化をバックグラウンドに逃がすのは簡単そうに聞こえるが、よくある落とし穴が2つある：

- **初期化が終わる前に、他のコードがそのコンポーネントを呼んでしまう**。対策としては `CompletableFuture`（または `Deferred`、`StateFlow`）を保持し、呼び出し側が完了を待てるようにするのが安全。
- **バックグラウンドスレッドの優先度が足りない**。デフォルトの `Thread` はメインスレッドと CPU を奪い合うため、低スペック端末では効果が薄い。`Thread.MIN_PRIORITY` を使うか、`Executors.newSingleThreadExecutor()` に明示的に優先度を設定する。

### 測ろう

この手の最適化の前に、必ずベースラインを計測すること。Firebase Performance の「App start」トレース、または `adb shell am start -W` が出発点になる。最適化後にもう一度計測する。計測しないのはただの勘——そして勘は大抵、自分に都合よく嘘をつく。

自分たちのプロジェクトでは3番目のバケットをクリティカルパスから外した結果、コールドローンチ時間は目に見えて短縮され、ユーザーが最初のピクセルを見るまでの待ち時間もそれに応じて縮まった。

### まとめ

- `Application.onCreate()` はメインスレッドで走り、最初のフレームをブロックする。万能の init フックとして扱わない。
- SDK を「同期必須」「バックグラウンドで実行可」「遅延可能」の3つに分け、それぞれ適切に扱う。
- 遅延可能なものには `decorView.post {}` や Jetpack App Startup の lazy initializer を使う。
- バックグラウンド初期化では、race condition とスレッド優先度に注意する。
- 最適化の前後で必ず計測する——勘で判断しない。
