+++
date = 2021-02-17
title = "Clock Alarm application on Android"
category = "Android"
draft = true
+++

Implement a clock alarm app on Android now days seems lots of pain.
So this blog shows how I implement it and how to guarantee the alarm on time.

- Use AlarmManager#setExact and related new apis for the purpose.
- Trigger with BroadcastReceiver for launching activity from background.
- Check if the permission `SYSTEM_ALERT_WINDOW` is granted by invoking `Settings.canDrawOverlays(context)`.
- Grant permission `SYSTEM_ALERT_WINDOW` for launching activity when app even not at background.
- Turns out that canceling a alarm from AlarmManager doesn't require the request code traced, 
    Just use the alarm.id as Action, and we can cancel it anytime without extra id to trace.
