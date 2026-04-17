+++
date = "2023-11-16"
title = "Metis first publish attempt failed"
slug = "first-publish-of-metis-failure"
[taxonomies]
tags=["Metis","Google Play"]
+++

> **Note:** This article was completed by AI (Claude Sonnet 4.6) from my initial notes and thoughts.

Metis got rejected on the very first Play Store submission.

The reason: the location permission request flow didn't meet policy. Google Play requires that before calling `requestPermissions()`, the app must explain to the user why the permission is needed and how it will be used. Metis uses location to tag journal entries with a place, but the app was jumping straight to the system permission dialog with no prior explanation at all.

### The correct flow

The fix is simple: show a rationale dialog before the very first `requestPermissions()` call. Not just after a prior denial — before the first ask.

```kotlin
if (ContextCompat.checkSelfPermission(
        context, Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED) {
    onPermissionGranted()
} else {
    // Always explain before asking, even on the first request
    showRationaleDialog(
        message = "Metis uses your location to record where you wrote this journal entry.",
        onConfirm = { requestLocationPermission() }
    )
}
```

One sentence explaining why the app needs location is enough. The point is that the user knows what they're agreeing to before the system dialog appears.

### Play's requirements

A few other location permission requirements worth knowing:

- Only request when actually needed — not at app launch.
- If the feature only needs approximate location, use `ACCESS_COARSE_LOCATION` instead of precise.
- Background location (`ACCESS_BACKGROUND_LOCATION`) requires a separate justification and has a much higher review bar.

Metis only needs location when the user actively creates a new entry. Requesting it at that moment, with the rationale dialog first, was enough — second submission passed.
