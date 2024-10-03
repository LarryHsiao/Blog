+++
date = "2030-11-01"
title = "template"
slug = "template"
draft = true
[taxonomies]
tags=["Software"]
+++

https://github.com/dart-lang/sdk/issues/35798


var s = "abc😀";
var sRunes = s.runes;
print(String.fromCharCodes(sRunes, 0, sRunes.length-1));
