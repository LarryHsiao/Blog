+++
date = "2025-01-07"
title = "使用App Distribution發布iOS版本測試遇到的問題與解決"
slug = "small-tips-when-publishing-testing-for-ios-apps"
[taxonomies]
tags=["Flutter", "iOS", "App Distribution"]
+++

**TL;DR;** 用ad-hoc 輸出

各位有用Firebase App Distribution上發布iOS app嗎？
如果你剛好又是使用Flutter去做開發的話，這篇可能對你有一點點幫助。

平常我們在發布ipa時，其實就是跑`flutter build ipa`就可以將其上傳到TestFlight上面了，nice and clean.

但是當我們要用Firebase發布時，總是會遇到上傳的版本沒辦法下載，要我們等他準備好了才會發郵件通知可以下載。

...但這個似乎永遠等不到那一天...

原因是，我們必須使用`Xcode`做包版

步驟：

1. flutter build ipa
0. 開啟Xcode
0. Product -> Archive
0. 建置完Xcode會跳出Archive清單，此時點擊Distribute App
0. 選擇Custom後點Next
0. 選擇Release Testing (關鍵)，點Next
0. 步驟Re-sign要選`Automatically manage signing`後點擊Next
0. 最後review步驟選擇Export可以選擇ipa輸出的位置
0. 將輸出的`.ipa`上傳到App Distribution上
0. 即可在iOS裝置上下載安裝

以上希望能夠幫助到一樣迷路的小夥伴

