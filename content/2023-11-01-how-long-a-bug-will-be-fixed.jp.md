+++
date = "2023-11-01"
title = "バグが修正されるまでどのくらいかかるか"
slug = "how-long-a-bug-will-be-fixed"
[taxonomies]
tags=["Software Development"]
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Sonnet 4.6）が仕上げたものです。

答えは：21年かかることもある。

[この Firefox のバグ][1]は2002年に報告された。macOS で Firefox をバックグラウンドに移動しても、ツールチップが他のウィンドウの上に表示されたままになるというものだ。小さな不具合。それが何十もの Firefox バージョンを生き延び、十数件の重複報告を積み重ね、2023年にようやく Firefox 119 で修正された。

コメント #42 がすべてを表している：

> *"given its longevity, I'm kinda partial to let it be forever. It feels like a relic from the past."*
> （これほど長生きしているのだから、このままずっと存在させておきたい気もする。過去からの遺物みたいで。）

思わず笑った。同時に考えさせられた——バグがこれほど長く生き残るのは、誰も知らないからじゃない。「それほど痛くない」からだ。ユーザーは回避策を覚え、開発者は慣れ、やがてそれは静かにコードベースの一部になる。

そして誰かが我慢の限界に達したとき、ようやく修正される。

[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=148624#c42
