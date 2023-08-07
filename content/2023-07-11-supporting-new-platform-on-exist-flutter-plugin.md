+++
date = "2023-07-11"
title = "在Flutter專案新增平台支援"
slug = "supporting-new-platform-with-flutter-plugin"
[taxonomies]
tags=["flutter","federated plugin"]
+++

跨平台app，很多時候第一個印象就是跨Android與iOS平台的開發。然而最近在平板app的開發上，微軟的平板加入了我們的跨平台戰局。

此篇將會涵蓋使用純dart pacakge新增windows平台實作，不會有原生程式碼，但是我想對於想了解整個脈絡的人有所幫助。

要做的事情有兩件

- App新增支援Windows
- package/plugin確認是否支援Windows


### App新增支援Windows

先使用下列script來增加Windows所需的檔案
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

當然如果生活難度比較低的話，有找到替代方案的話直接使用就行了，那如果沒有呢?

只好自己寫一套了

#### Plugin增加Windows支援

我們先假設這個app已經是既有產品了，已經有許多用戶在使用，冒險將library換掉，可能會侵害到既有用戶的使用體驗。

這時我們可以改用[Federated plugin][1]的形式來增加平台的實作，並且不影響既有系統。

##### 專案結構

與一般的package很像，但[Federated plugin][1]的專案將會拆成多個package，透過介面將各平台實作與實際引用端解耦(假設我的package叫做package101)

<p>
<img src="/federated_plugin_diagram.png" width="500" alt="federated plugin: package101"/> 
</p>

- package101: (app-facing package)app實際引用時會使用這個Package內提供的方法
- package101_interface: (platform interface pacakge)引用此package來實作各平台程式碼
- package101_android: (platform package)android平台的實作
- package101_ios: (platform package)ios平台的實作
- package101_window: (platform package)windows平台的實作，為此案例我們新增的package。

p.s. 當然如果既有的plugin已經是[Federated plugin][1]的形式我們只需要用該plugin提供的介面實作Windows部分即可。

##### pubspec.yaml

專案結構我們看過了，以下是我們如何撰寫`pubspec.yaml`來達到上述的結構。

基本上上述的五個package都是一個完整的package專案，連結這些實作我們需要在pubspec.yaml上修改。

###### package101

```yaml
flutter:
  plugin:
    platforms:
      android:
        default_pacakge: package101_android
      ios:
        default_pacakge: package101_ios
      windows:
        default_pacakge: package101_windows # 新加入的pacakge
```

###### package101_windows (ios,android package也有類似的寫法)

```yaml
dependencies:
    windows_something: 1.0.0 # 引用windows可用的pacakge來實作(這也是為什麼是純dart專案)
    package101_interface:
        path: ../package101_interface/ # 介面的package位置，引用interface以實作package101可以用的原件

flutter:
  plugin:
    implements: package101
    platforms:
      windows:
        dartPluginClass: WindowsPackage101Impl #實作package101_interface
```

#### 結語

以上是我們透過純dart package實作新的平台的實作，並且不危害到原本的程式碼。


[1]: https://docs.flutter.dev/packages-and-plugins/developing-packages#federated-plugins





