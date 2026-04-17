+++
date = "2023-11-16"
title = "Metis 第一次嘗試上架失敗了"
slug = "first-publish-of-metis-failure"
[taxonomies]
tags=["Metis","Google Play"]
+++

> **說明：** 本文由 AI（Claude Opus 4.7）根據我的初始筆記與想法完成。

Metis 第一次送審就被 Google Play 退回了。

原因：位置權限的請求流程不符合規範。Play 的政策要求，在呼叫 `requestPermissions()` 之前，必須先向用戶說明這個權限會被用在哪裡、為什麼需要。Metis 用位置資訊來為日誌貼上地點標記，但 app 直接跳出系統權限對話框，完全沒有任何前置說明。

### 正確的流程

修法很簡單：在第一次呼叫 `requestPermissions()` 之前，先彈一個說明對話框。不管用戶有沒有拒絕過，第一次請求就要先說明。

```kotlin
if (ContextCompat.checkSelfPermission(
        context, Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED) {
    onPermissionGranted()
} else {
    // 不管是不是第一次，都先說明再問
    showRationaleDialog(
        message = "Metis 需要位置資訊來記錄你在哪裡寫下這篇日誌。",
        onConfirm = { requestLocationPermission() }
    )
}
```

一句話說清楚「這個 app 為什麼需要你的位置」就夠了。重點是讓用戶在看到系統權限彈窗之前，先知道他們在同意什麼。

### Play 的要求

除了 rationale dialog，Google Play 對位置權限還有幾個額外要求值得注意：

- 只在真正需要的時候才請求，不要在 app 一啟動就要。
- 如果功能只需要大概位置，用 `ACCESS_COARSE_LOCATION` 就好，不要用精確位置。
- 如果需要背景位置（`ACCESS_BACKGROUND_LOCATION`），必須另外單獨說明用途，審核門檻更高。

Metis 只需要在用戶主動新增日誌時取得位置，改成在那個時機點請求之後，第二次送審就過了。
