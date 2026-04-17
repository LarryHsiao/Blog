+++
date = "2023-11-16"
title = "Metis の初回リリースは失敗した"
slug = "first-publish-of-metis-failure"
[taxonomies]
tags=["Metis","Google Play"]
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Opus 4.7）が仕上げたものです。

Metis は最初の Play Store 申請でリジェクトされた。

理由：位置情報権限のリクエストフローがポリシーに違反していた。Google Play は `requestPermissions()` を呼ぶ前に、なぜその権限が必要で、どのように使うかをユーザーに説明することを求めている。Metis は位置情報を使って日誌エントリーに場所を記録するが、アプリは何の説明もなくいきなりシステムの権限ダイアログを表示していた。

### 正しいフロー

修正は単純だ。最初の `requestPermissions()` 呼び出しの前に、rationale ダイアログを表示する。過去に拒否された後だけでなく、**初回リクエストの前から**表示する。

```kotlin
if (ContextCompat.checkSelfPermission(
        context, Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED) {
    onPermissionGranted()
} else {
    // 初回でも必ず説明してから聞く
    showRationaleDialog(
        message = "Metis は、日誌を書いた場所を記録するために位置情報を使います。",
        onConfirm = { requestLocationPermission() }
    )
}
```

「なぜ位置情報が必要か」を一言で説明するだけで十分。システムダイアログが出る前に、ユーザーが何に同意しようとしているかを把握できる状態にすることが大事だ。

### Play の要件

位置情報権限に関して、他にも押さえておくべき要件がある：

- 本当に必要なタイミングでのみリクエストする — アプリ起動時に要求しない。
- おおよその位置情報で足りるなら `ACCESS_COARSE_LOCATION` を使い、精度の高い権限は要求しない。
- バックグラウンド位置情報（`ACCESS_BACKGROUND_LOCATION`）は別途説明が必要で、審査のハードルも高い。

Metis がユーザーの位置情報を必要とするのは、新しいエントリーを作成するときだけだ。そのタイミングで rationale ダイアログを先に出してからリクエストするよう変えたところ、2回目の申請は通った。
