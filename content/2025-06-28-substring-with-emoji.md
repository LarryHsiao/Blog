+++
date = "2025-06-28"
title = "Flutter substring with emoji"
description = "Dart 用 substring 切含 emoji 的字串會出現亂碼，說明 UTF-16 的原因，並介紹 runes 與 characters 兩種解法。"
slug = "substring-a-string-with-emoji"
[taxonomies]
tags=["Flutter", "Emoji"]
+++

假設你有一串字串

```dart
String text = "Hello 👋🌍";
```

假如你使用
```dart
print(text.substring(6, 7));
```

你可能預期會得到 "👋"，但實際上可能出現亂碼或截斷的 emoji，例如 �，這是因為：

- Dart 的 String 是以 UTF-16 編碼儲存字元。
- emoji（像 👋 或 🌍）通常由多個 UTF-16 code units 組成。
- `substring()` 是基於 code unit 索引，不理解一個 emoji 實際上可能是兩個或更多 code units。

#### 方法1: 使用`Runes`
```dart
String text = "Hello 👋🌍";
var runes = text.runes.toList();

print(String.fromCharCode(runes[6])); // 👋
```

這樣就能正確取得一個 emoji，不會截斷字元。

#### 方法2: 使用`characters`套件
```dart
import 'package:characters/characters.dart';

String text = "Hello 👨‍👩‍👧‍👦";
var chars = text.characters.toList();

print(chars[6]); // 👨‍👩‍👧‍👦 ✅
```

### 結論

當你的 Flutter 應用處理 emoji 或其他複合 Unicode 字元時，可以考慮使用以下方案:

- 簡單 emoji 用 runes 即可。
- 複雜或完整支援建議用 characters 套件。

這樣才能避免程式碼改變字串內容時造成亂碼