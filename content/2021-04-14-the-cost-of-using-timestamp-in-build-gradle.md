+++
title = "解決在Android開發中使用時間作為版本號碼的成本"
date = 2021-04-14
slug = "reduce-the-cost-of-using-timestamp-in-build-gradle"
category = "Android"
+++

在開發Android app的過程中我們時常使用時間來區分app的版本。但是此做法有些缺點將造成我們開發成本變高。

時間會不斷地推進，對吧?所以我們每次建置專案的時候，因為變動的版本號碼(時間)會讓建置工具認為我們應該要做當我們修改`build.gradle`後所需要做的事情。

這樣會帶來一個問題:每次建置的時間被拉長。

那麼怎麼解決呢?，我這裡建議將動態的時間取得移除即可:
使用`buildTypes`區分開發用版本，並且使用靜態值:

```groovy
android{
    buildTypes{
        release{
            buildConfigField "String", "BUILD_TIMESTAMP", "\"${getTimeStamp()}\"" //getTimeStamp() generates the string by time
        }
        debug{
            buildConfigField "String", "BUILD_TIMESTAMP", "\"{{placeholder}}\""
        }
    }
}
```
我們將原本呼叫取得當前時間的方法`getTimeStamp`從debug的建置時間移除。而發布出去的版本則是繼續留著，這樣我們就不會失去在版本號碼上面記錄時間的好處了。

最後，以我實作的經驗，我的專案的建置時間從30秒縮短到了2秒，生活又再次輕鬆了起來了。
