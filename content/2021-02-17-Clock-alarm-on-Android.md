+++
date = 2021-02-17
title = "Android 鬧鐘應用程式實作"
slug = "clock-alarm-application-on-android"
category = "Android"
+++

> **說明：** 本文由 AI（Claude Opus 4.7）根據我的初始筆記與想法完成。

這年頭要在 Android 上做一個鬧鐘 app，痛點其實不少。電量優化、背景限制、權限要求這幾年一路收緊。這篇文章會走一遍我的實作方式，以及要讓鬧鐘準時響、並且真的在畫面上跳出來的幾個小撇步。

### 排程一個精確的鬧鐘

一般的 `AlarmManager.set()` 是不精確的——Android 可能會把它延後、跟其他任務一起批次喚醒。對於鬧鐘這種必須在指定時間響的場景，要用 `setExact()`（或者用 `setExactAndAllowWhileIdle()`，讓它在 Doze 模式下也能觸發）。

```kotlin
fun scheduleAlarm(context: Context, alarm: Alarm) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, AlarmReceiver::class.java).apply {
        action = alarm.id.toString() // 用 id 當作 action,方便之後取消
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

從 Android 12（API 31）開始，app 需要持有 `SCHEDULE_EXACT_ALARM` 權限（或是鬧鐘這類永遠被允許的場景用 `USE_EXACT_ALARM`）。在 `AndroidManifest.xml` 宣告：

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

`SCHEDULE_EXACT_ALARM` 可以被使用者在系統設定裡撤銷，所以排程前要檢查一下：

```kotlin
if (alarmManager.canScheduleExactAlarms()) {
    scheduleAlarm(context, alarm)
} else {
    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
    startActivity(intent)
}
```

### 用 BroadcastReceiver 接收鬧鐘

鬧鐘觸發時,我們在 `BroadcastReceiver` 中處理,並從那裡啟動鬧鐘畫面。

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

在 manifest 中註冊 receiver。從 Android 12 起，`android:exported` 必須明確宣告：

```xml
<receiver
    android:name=".AlarmReceiver"
    android:exported="true" />
```

### 讓鬧鐘畫面在鎖屏上顯示

從 Android 10 開始，app 不能從背景自由地啟動 activity。在 `AlarmReceiver` 裡直接呼叫 `startActivity()`，在鎖屏裝置上會被默默忽略。正確做法是發一個帶 full-screen intent 的高優先級通知，讓系統自己決定是要以 heads-up 通知顯示、還是直接拉起 activity（例如螢幕關閉時）。

先在 manifest 宣告權限：

```xml
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
```

然後在 `AlarmReceiver` 裡發通知，而不是直接呼叫 `startActivity()`：

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
            .setContentTitle("鬧鐘")
            .setContentText("該起床了!")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(context).notify(ALARM_NOTIFICATION_ID, notification)
    }
}
```

在 `AlarmActivity` 這邊，加上這些 window flag，讓畫面在螢幕關閉時也能蓋在鎖屏之上：

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

有些文章會建議用 `SYSTEM_ALERT_WINDOW`，但它其實是用來畫 overlay 的（像聊天氣泡那種），不是拿來啟動 activity 的。Google Play 也對它有特定類別的使用限制，所以 `setFullScreenIntent` 才是這個場景的正解。

### 不用記 request code 就能取消鬧鐘

`PendingIntent` 的取消通常有點麻煩，因為你得留著原本的 request code。這裡有個比較乾淨的小技巧：排程時把鬧鐘自己的 id 設成 `Intent` 的 action。因為 Android 在比對 `PendingIntent` 時會看 action（還有其他一些欄位），取消時只要重建同一個 `PendingIntent` 就行——不用記 request code。

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
    ) ?: return // 從來沒設過或已經取消
    alarmManager.cancel(pendingIntent)
    pendingIntent.cancel()
}
```

用 `FLAG_NO_CREATE` 的好處是：如果鬧鐘從來沒設過，會回傳 `null`（直接提早 return），而不會不小心建立一個新的 `PendingIntent`。

### 總結

- 用 `setExactAndAllowWhileIdle()`，讓鬧鐘在 Doze 模式下也能響。
- Android 12+ 要先檢查 `canScheduleExactAlarms()`，必要時請求 `SCHEDULE_EXACT_ALARM`。
- 在 `BroadcastReceiver` 接收鬧鐘，並發一個帶 `setFullScreenIntent()` 的高優先級通知。
- 在 activity 上設 `FLAG_SHOW_WHEN_LOCKED` 和 `FLAG_TURN_SCREEN_ON`，讓它蓋在鎖屏上。
- 把鬧鐘 id 當 `Intent` action，取消時不用額外記錄 request code。
