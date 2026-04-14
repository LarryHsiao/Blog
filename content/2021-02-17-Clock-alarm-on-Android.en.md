+++
date = 2021-02-17
title = "Clock Alarm application on Android"
category = "Android"
draft = true
+++

Implementing a clock alarm app on Android these days involves quite a few pain points. Battery optimizations, background restrictions, and permission requirements have all grown stricter over the years. This post walks through how I built one and the tricks needed to make the alarm fire reliably and show up on screen.

### Scheduling an exact alarm

Regular `AlarmManager.set()` is inexact — Android may delay it to batch wake-ups. For a clock alarm that must fire at the right moment, use `setExact()` (or `setExactAndAllowWhileIdle()` to also fire in Doze mode).

```kotlin
fun scheduleAlarm(context: Context, alarm: Alarm) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val intent = Intent(context, AlarmReceiver::class.java).apply {
        action = alarm.id.toString() // use id as action for easy cancellation later
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

On Android 12 (API 31) and above, the app must hold the `SCHEDULE_EXACT_ALARM` permission (or `USE_EXACT_ALARM` for always-allowed cases like clock apps). Declare it in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

`SCHEDULE_EXACT_ALARM` can be revoked by the user in system settings, so check before scheduling:

```kotlin
if (alarmManager.canScheduleExactAlarms()) {
    scheduleAlarm(context, alarm)
} else {
    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
    startActivity(intent)
}
```

### Receiving the alarm with BroadcastReceiver

When the alarm fires, we handle it in a `BroadcastReceiver` and launch the alarm screen from there.

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

Register the receiver in the manifest. From Android 12 onward `android:exported` must be declared explicitly:

```xml
<receiver
    android:name=".AlarmReceiver"
    android:exported="true" />
```

### Launching an activity from the background

Starting from Android 10, apps cannot start activities freely from the background. A clock alarm needs the screen to appear even when the phone is locked, so we need the `SYSTEM_ALERT_WINDOW` permission.

Check whether it is granted before trying to start the activity:

```kotlin
fun hasOverlayPermission(context: Context): Boolean {
    return Settings.canDrawOverlays(context)
}
```

If not granted, redirect the user to the system settings page to allow it:

```kotlin
fun requestOverlayPermission(activity: Activity) {
    val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${activity.packageName}")
    )
    activity.startActivity(intent)
}
```

Declare the permission in the manifest:

```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```

With this permission granted, `AlarmReceiver.onReceive()` can call `startActivity()` and the alarm screen will appear even over the lock screen.

### Canceling an alarm without tracking request codes

`PendingIntent` cancellation is usually tricky because you need to keep the original request code around. There is a cleaner trick: set the alarm's own id as the `Intent` action when scheduling. Since Android matches `PendingIntent`s by action (among other things), you can reconstruct the exact same `PendingIntent` at cancel time — no request code bookkeeping needed.

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
    ) ?: return // already cancelled or never scheduled
    alarmManager.cancel(pendingIntent)
    pendingIntent.cancel()
}
```

Using `FLAG_NO_CREATE` ensures we get `null` back (and bail early) if the alarm was never set, rather than creating a new `PendingIntent` by accident.

### Summary

- Use `setExactAndAllowWhileIdle()` so the alarm fires even in Doze mode.
- On Android 12+, check `canScheduleExactAlarms()` and request `SCHEDULE_EXACT_ALARM` if needed.
- Receive the alarm in a `BroadcastReceiver` and start the activity with `FLAG_ACTIVITY_NEW_TASK`.
- Grant `SYSTEM_ALERT_WINDOW` so the activity can launch from the background / lock screen.
- Store the alarm id as the `Intent` action to make cancellation straightforward without extra bookkeeping.
