+++
date = 2020-04-16
title = "在Android TextView上使用超連結"
category = "Android"
+++

超連結，像是[這串字][0]。我想在所有類型的app上很常見。不過要怎麼在Android上實做呢?

首先，Android的`TextView`本身就支援超連結文本，來看看我們怎麼玩弄`SpannableStringBuilder`吧。

```Kotlin
val builder = SpannableStringBuilder("Fancy String")
builder.setSpan(
    object : ClickableSpan() {
        override fun onClick(widget: View) {
            // Handle clicked behavior
        }
    },
    0, // Started Index
    builder.length, // Ended Index
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE 
)
textView.text = builder
textView.setMovementMethod(LinkMovementMethod.getInstance()); // 重要
```
從上述程式碼我們就會得到一串可以點擊的字串了!不過顏色怎麼辦?他似乎是跟著app的Style。我們能夠自己去自訂顏色嗎？

```Kotlin
val builder = SpannableStringBuilder("Fancy String")
builder.setSpan(
    object : ClickableSpan() {
        override fun onClick(widget: View) {
            // Handle clicked behavior
        }
    },
    0, // Started Index
    builder.length, // Ended Index
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
)
builder.setSpan(
    new ForegroundColorSpan(Color.RED), // 紅色字串
    0,
    builder.length(),
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
);
textView.text = builder
textView.setMovementMethod(LinkMovementMethod.getInstance()); // 重要
```

使用`SetSpan`設定吧，與前面的ClickableSpan類似，增加一個顏色的Span在同樣的Index區域。

不過，話說回來，這是不是有點複雜？我們除了使用相對應的`Span`類別實做，還要去計算這串可以點擊的字串的Index。
這樣的作法在單一`TextView`裡面有較長且較多的可點擊字串的需求下維護會是一個很痛苦的開始。

不過呢，其實`SpannableStringBuilder`也是一個實做了`CharSequence`的類別，而我們在這個builder上的所有操作其實是可以輸入`CharSequence`的。
那麼這樣可以簡化我們的作法嗎？

```kotlin
val builder = SpannableStringBuilder("Fancy String")
builder.setSpan(
    object : ClickableSpan() {
        override fun onClick(widget: View) {
            // Handle clicked behavior
        }
    },
    0, // Started Index
    builder.length, // Ended Index
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
)

val builder2 = SpannableStringBuilder(builder) // 直接傳入Builder參數
builder2.append("abc"); // 接上其他字串，不使用builder會使前面的實做無效

textView.text = builder
textView.setMovementMethod(LinkMovementMethod.getInstance()); // 重要
```

我們直接new一個新的`SpannableStringBuilder`來繼續操作我們想要的操做，在建構這個類別時傳入上一個`SpannableStringBuilder`，這樣Index參數我們都只需要輸入整串長度就行了，我想在未來的維護上會是加分的。

<p>                                                                                                                                                                                     
    <img src="/clickable_textView.png" width="270" alt="空清單提示"/>
</p>

不過，既然參數固定了，有不需要輸入的作法嗎？可以參考使用我的一個library [Aura][1]，提供了這樣的類別減少閱讀雜訊。
```kotlin
textView.text = AppendedStr( // Append two spannable Charsequence
    ColoredStr( // Setup color
        ClickableStr( // Clickable string
            ConstSource("Fancy String"),
            Runnable { 
                // Handle clicked behavior
            }
        ), RED
    ), "abc"
).value()
textView.movementMethod = LinkMovementMethod.getInstance()
```

[0]: /
[1]: https://github.com/LarryHsiao/Aura
