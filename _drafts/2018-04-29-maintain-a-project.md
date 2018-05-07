---
layout: post
title: "Maintain a project"
categories: Programing
---

What should we do when we maintain a project? What behavior should we have when maintaing a project? Here are keys of maintaing project in my opinion.

Enable code analytic
---
Tools for routine jobs, no one wants to check every little corner every day. Just let computer do the routines, make life easier. If there is a problem appear,fix the problem, add new rules to the tool. We won`t make same mistake in the future(no matter is there someone else).

Especially the tools enabled by default.Don\`t disable it, use it at the beginning of projects, we won`t need to fix something if we not cause it at the beginning.

Software changes everyday, tools not only finds problems we already known but also brings us confidence if we pass all the check. We don`t even need to think a bit(or less thinking) if there is a bug we had before. Just make the change of code, run the tools , we will know if there are issues we cause which we can fix right away rather then lost the way to home until we miss the deadline.

Don\`t disable any quality checking tools. It is too late if we notice the day we paying back comes.

Update dependencies
---
Always keep attention about third-party library`s state. We use third-party library everywhere, potential bug may caused becouse we usee out-of-date libraries.

For example, Android framework updates year by year. There always has some behavior changes and API changes. Therefore, all the code reflected should be updated to work on newer version of device. As result, we should also update libraries for platform changes if needed. So keep eyes on it.

It is a shame to tell users that the problem is caused because we use out-of-date libraries which can be replaced easily.
