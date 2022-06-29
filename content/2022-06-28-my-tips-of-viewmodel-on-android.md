+++
date = "2022-06-28"
title = "我的Android ViewModel實作建議"
slug = "my-tips-for-mvvm-on-android"
+++

近來，MVVM已然成為原生Andnroid開發的主流，Google也提供了相對應的工具達到目標。網路上與Google的官方網站上也有許多作法與改版(如：MVI)給大家參考。在這樣琳瑯滿目的做法中，我想分享幾個我認為實作`ViewModel`時，我認為比較順手的作法。

## 方法名稱說明用戶意圖
我認為一個ViewModel應當可以展現一個用戶在這個畫面上能夠有的操作。如:`refresh()`、`favorite(id)`。

以`refresh()`為例，當我們看到這個方法時，就可以知道在這個畫面上會有下拉清單或者更新按鈕來提供使用者刷新這個畫面。聽起來很單純對吧?

而比較不能說明用戶意圖的又是什麼呢? 如:`setListId(id)`。感覺到了嗎?`setListId(id)`從名稱上面我只能知道我將要把id丟入這個方法，但是會發生什麼事情我要進去看原始碼才會知道。這類的方法我就認為不是一個適合的命名。

繼續以這個`setListId(id)`為例，那我要怎麼改才行呢? 其實就如前面所說的方法名稱要展現用戶意圖，我相信我使用這個方法肯定是為了後續的操作而設立，那麼我們只要找到那個操作並且為其設立一個方法或者在那時傳入`id`就行了。如:`loadList(id)`。

## 一次性的方法呼叫直接回傳
一次性的方法我傾向於直接回傳或者callback回去。

有看過常見的`SingleLiveEvent`嗎? 只會對Observer做單次更新的實作。這個在我看來，是比較沒有必要的。尤其通常會需要這樣的單次事件的作法時通常與某些畫面流程有關，既然與畫面有關，那麼他的資料也通常不需要再次顯示出來。這也說明了為什麼我們會命名為`SingleLiveEvent`了。

當然有人會說，這個東西的出現，是為了解決用一般的LiveData造成的問題所做的workaround，我想他們說得沒錯，這個東西也確實有提供一定的價值。不過，既然這個`SingleLiveEvent`實際上還是繼承`MutableLiveData`，就定義而言，他應該就是一組資料才對，跟我們繼承後的命名與實際用法似乎有很大的落差。

那麼要如何做比較好呢? 我以下是我認為理想的做法。

```kotlin
// ViewModel 內
fun doIt(): Job = viewModelScope.launch{
    // 做任何事情
}
```

在View這一層怎麼使用呢? (`Activity`/`Fragment`)
```kotlin
// Activity/Fragment內
viewModel.doIt().invokeOnCompletion{
    // 在這邊處理CancellationException或者完成後的事情
}
```

不過如果說ViewModel有資料變動呢?
```kotlin
// ViewModel內
fun doIt(): Job = viewModelScope.launch{
    // 做任何事情
    loadData() // 更新畫面上的資料，讀取後會從對應的LiveData 顯示到畫面上
}
```

等等，在View這一層調用`invokeOnCompletion`時，如果我需要回傳資料呢? 如:剛新增資料的Id 或者錯誤處理
直接回傳怎麼樣?
```kotlin
// ViewModel內
suspend fun doIt(): Result<Long>{
    return runCatching {
        // 新增資料
        1L // 假設我們得到新的資料的id為1
    }
}

// Activity/Fragment內
lifecycleScope.launch{
    viewModel.doIt().fold(
        { id ->
            // 針對剛剛新增的Id做處理。如:顯示Dialog
        },
        {
            // 錯誤處理
        }
    )
}

```

## 結語
照以上做法，我就不需要另外宣告一個liveData去傳遞單一事件，當我需要修改這個事件時，我不需要到處尋找散落在ViewModel的程式碼了。也不用為了追蹤一個使用流程的Bug在ViewModel/View的檔案內上下翻找。

未來，我們只要談到LiveData，就只會知道一件事情: 畫面上顯示的資料是什麼，不會有資料存在LiveData但是只使用一次的情況。

