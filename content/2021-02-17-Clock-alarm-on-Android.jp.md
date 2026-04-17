+++
date = 2021-02-17
title = "Android で目覚まし時計アプリを実装する"
slug = "clock-alarm-application-on-android"
category = "Android"
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Opus 4.7）が仕上げたものです。

最近の Android で目覚まし時計アプリを作るのは、なかなか骨が折れる。バッテリー最適化、バックグラウンド制限、権限要件は年々厳しくなっている。この記事では、自分がどう実装したか、そしてアラームを確実に時間通りに鳴らして画面に出すためのコツを一通り紹介する。

### 正確なアラームをスケジュールする

通常の `AlarmManager.set()` は不正確で、Android は wake-up をバッチ処理するために遅延させることがある。指定時刻にきっちり鳴らしたい目覚ましでは `setExact()`（Doze モードでも発火させたいなら `setExactAndAllowWhileIdle()`）を使う。

```kotlin
fun scheduleAlarm(context: Context, alarm: Alarm) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, AlarmReceiver::class.java).apply {
        action = alarm.id.toString() // id を action にして後でキャンセルしやすくする
    }
    val pendingIntent = PendingIntent.getBroadcast(
        context,
        0,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    alarmManager.setExactAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP,
        alarm.triggerAtMillis,
        pendingIntent
    )
}
```

Android 12（API 31）以降では、アプリは `SCHEDULE_EXACT_ALARM` 権限（時計アプリのように常に許可されるケースでは `USE_EXACT_ALARM`）を保持する必要がある。`AndroidManifest.xml` に宣言する：

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

`SCHEDULE_EXACT_ALARM` はユーザーがシステム設定から取り消せるので、スケジュール前に確認する：

```kotlin
if (alarmManager.canScheduleExactAlarms()) {
    scheduleAlarm(context, alarm)
} else {
    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
    startActivity(intent)
}
```

### BroadcastReceiver でアラームを受ける

アラームが発火したら `BroadcastReceiver` で受け取り、そこからアラーム画面を起動する。

```kotlin
class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val launchIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(launchIntent)
    }
}
```

manifest に receiver を登録する。Android 12 以降では `android:exported` を明示する必要がある：

```xml
<receiver
    android:name=".AlarmReceiver"
    android:exported="true" />
```

### ロック画面の上にアラーム画面を表示する

Android 10 以降、アプリはバックグラウンドから自由に activity を起動できない。`AlarmReceiver` から `startActivity()` を呼んでも、ロックされた端末では黙って無視される。正解は、full-screen intent を持つ高優先度の通知を投げて、システムに heads-up 通知として出すか（画面オフ時など）直接 activity を立ち上げるかを任せること。

まず manifest に権限を宣言する：

```xml
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
```

そして `AlarmReceiver` では `startActivity()` を直接呼ばず、通知を投げる：

```kotlin
class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val fullScreenIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            0,
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification = NotificationCompat.Builder(context, ALARM_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_alarm)
            .setContentTitle("アラーム")
            .setContentText("起きる時間です！")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(context).notify(ALARM_NOTIFICATION_ID, notification)
    }
}
```

`AlarmActivity` 側では、画面オフ時でもロック画面の上に表示されるように window flag を付ける：

```kotlin
class AlarmActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
        setContentView(R.layout.activity_alarm)
    }
}
```

`SYSTEM_ALERT_WINDOW` が推奨されることもあるが、これは（チャットバブルのような）オーバーレイ描画のためのもので、activity 起動用ではない。Google Play も特定カテゴリのアプリに使用を制限しているため、このユースケースでは `setFullScreenIntent` が正しい道具。

### request code を追わずにアラームをキャンセルする

`PendingIntent` のキャンセルは、元の request code を保持しておかないといけないので普段ちょっと面倒。ここで使えるクリーンな小技：スケジュール時にアラーム自身の id を `Intent` の action に設定する。Android は `PendingIntent` を（他の要素も含めて）action でマッチングするので、キャンセル時に同じ `PendingIntent` を再構築できる——request code の管理は不要になる。

```kotlin
fun cancelAlarm(context: Context, alarm: Alarm) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, AlarmReceiver::class.java).apply {
        action = alarm.id.toString()
    }
    val pendingIntent = PendingIntent.getBroadcast(
        context,
        0,
        intent,
        PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
    ) ?: return // すでにキャンセル済みか、一度も設定されていない
    alarmManager.cancel(pendingIntent)
    pendingIntent.cancel()
}
```

`FLAG_NO_CREATE` を使うことで、アラームが一度も設定されていなければ `null` が返って早期リターンでき、うっかり新しい `PendingIntent` を作ってしまう事故を防げる。

### まとめ

- Doze モードでも発火するよう `setExactAndAllowWhileIdle()` を使う。
- Android 12+ では `canScheduleExactAlarms()` を確認し、必要なら `SCHEDULE_EXACT_ALARM` を要求する。
- アラームは `BroadcastReceiver` で受け、`setFullScreenIntent()` 付きの高優先度通知を投げる。
- activity に `FLAG_SHOW_WHEN_LOCKED` と `FLAG_TURN_SCREEN_ON` を設定し、ロック画面の上に表示する。
- アラーム id を `Intent` の action に入れて、余計な記録なしでキャンセルできるようにする。
