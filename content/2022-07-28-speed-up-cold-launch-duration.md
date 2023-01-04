+++
date = "2022-07-28"
title = "Initialize()寫法在Android app的影響與優化建議"
slug = "the-influence-of-initialize-method-in-application-on-android"
draft = true
+++

我們的應用使用了許多元件，不管是自己寫的，或者是第三方提供的函式庫，有時不免就需要再應用啟動後做初始化的動作。而在Android的世界，很多時候呼叫這個初始化的方法都會放在`Application`內的`onCreate()`中。

```kotlin
class AppApplication : Application(){
    override fun onCrete() {
        super.onCreate()
        Module.initialize()
    }    
}
```
看起來稀鬆平常，不是嗎? 但是很不幸的，這會造成應用啟動速度拉長，我們可以從Firebase的performance上一窺究竟。

// TODO:優化前圖


如上圖所示，應用啟動時間約三秒，這個數字代表什麼意思呢? 意思是，當你按下第一個按鈕後到看到第一個畫面時所需要的時間長。換句話說，就算我們有實作啟動頁面，用戶看到啟動畫面前，就要先等待三秒鐘的時間。

為了最大化用戶體驗，有辦法解決這個三秒空白嗎?
我想相對於看空白畫面，先讓用戶進入啟動畫面會是比較合理的策略。
