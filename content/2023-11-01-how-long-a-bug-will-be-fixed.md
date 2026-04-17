+++
date = "2023-11-01"
title = "一個 Bug 多久會被修正"
slug = "how-long-a-bug-will-be-fixed"
[taxonomies]
tags=["Software Development"]
+++

> **說明：** 本文由 AI（Claude Sonnet 4.6）根據我的初始筆記與想法完成。

答案是：可能要 21 年。

[這個 Firefox 的 bug][1] 於 2002 年被回報：在 macOS 上，當 Firefox 切到背景後，tooltip 仍然會浮在其他視窗上方。聽起來是個小問題，但它就這樣活著，跨越了數十個 Firefox 版本、累積了十幾個重複回報，直到 2023 年才在 Firefox 119 裡被修掉。

Comment #42 裡有人說：

> *"given its longevity, I'm kinda partial to let it be forever. It feels like a relic from the past."*
> （鑒於它的壽命，我有點想讓它就這樣存在下去。感覺像是來自過去的遺跡。）

這句話讓我笑了。但也讓我想到一件事：很多 bug 之所以活那麼久，不是因為沒人知道，而是因為它「不夠痛」——用戶會繞過它，開發者會習慣它，然後它就默默成了 technical debt 的一部分。

直到某天，有人受夠了，修掉它。

[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=148624#c42
