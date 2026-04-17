+++
date = "2023-11-01"
title = "How long does it take to fix a bug"
slug = "how-long-a-bug-will-be-fixed"
[taxonomies]
tags=["Software Development"]
+++

> **Note:** This article was completed by AI (Claude Sonnet 4.6) from my initial notes and thoughts.

Twenty-one years, apparently.

[This Firefox bug][1] was filed in 2002: on macOS, tooltips would stay visible over other windows even after Firefox moved to the background. A small annoyance. It survived dozens of Firefox versions, accumulated over a dozen duplicate reports, and was finally fixed in Firefox 119 in 2023.

Comment #42 put it well:

> *"given its longevity, I'm kinda partial to let it be forever. It feels like a relic from the past."*

That made me laugh. It also made me think: bugs don't live that long because nobody knows about them. They live that long because they're not painful enough — users learn to work around them, developers get used to them, and quietly they become part of the furniture.

Until someone gets fed up and fixes it.

[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=148624#c42
