+++
date = "2023-07-11"
title = "在Flutter專案新增支援windows平台"
slug = "supporting-windows-with-flutter-plugin"
draft = true
[taxonomies]
tags=["flutter","windows"]
+++

跨平台app，很多時候第一個印象就是跨Android與iOS平台的開發。然而最近在平板app的開發上，微軟的平板加入了我們的跨平台戰局。

這邊我將分享我如何增加我們既有的app與plugin在windows上的支援。

要做的事情有兩件

- App新增支援Windows
- package/plugin確認是否支援Windows


### App新增支援Windows

先使用下列script來增加windows所需的檔案
```shell
flutter create . --platforms=windows
```

接著嘗試在windows上面執行看看(try-error)
```shell
flutter run -d windows
```

到這邊如果沒有問題，底下就不用做了，只是大部分情況生活不會這麼容易...


### Plugin確認是否支援Windows

就根據上述說的我們大多數時候跨平台是跨Android/iOS，雖然Flutter本身支援Windows上面運行，但難免使用的套件可能因為目標是為了Android/iOS等主流平台開發造成Windows上面沒辦法運行的狀況。

而遇到這的狀況的時候，有幾個方向:

- 找replacement: 所有套件都換成有支援windows的版本
- 自己幫plugin增加windows支援: 那就自己寫一套這樣

當然如果生活難度比較低的話，有找到替代方案的話改用他就行了，那如果沒有呢?

只好自己寫一套了

#### Plugin增加Windows支援

我們先假設這個app已經是既有產品了，已經有許多用戶在使用，冒險將library換掉，可能會侵害到既有用戶的使用體驗。

這時我們可以用[Federated plugin](https://docs.flutter.dev/packages-and-plugins/developing-packages#federated-plugins)的形式來增加平台的實作，





