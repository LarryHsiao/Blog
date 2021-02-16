+++
date = 2021-02-17
title = "Clock Alarm application on Android"
category = "Android"
draft = true
+++

Implement a clock alarm app on Android now days seems lots of pain.
So this blog shows how I implement it and how to guarantee the alarm on time.

- Use AlarmManager
- Trigger with BroadcastReceiver for launching activity from background
- Grant permission `SYSTEM_ALERT_WINDOW` for launching activity when app even not at background.
