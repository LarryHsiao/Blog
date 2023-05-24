+++
date = "2023-05-22"
title = "Decorator Pattern有符合SOLID原則嗎?"
slug = "is-decroator-pattern-solid"
[taxonomies]
tags=["OOP", "Decorator"]
+++

#### 前言

在物件導向的世界裡，我們常常掛在嘴邊的五大原則每天聽每天看。網路上也有很多人分享SOLID怎麼寫、怎麼設計。
這篇將會先以程式碼展示，可能符合SOLID的設計與開發流程，我們一起來看看吧。

我將以幾段程式碼呈現我認為有符合SOLID原則的設計(以 `Dart` 語言為例)

#### 定義介面

假設我們要從資料庫取得用戶資訊我們可以定義一個介面
```dart
abstract class Users {
    List<User> values(); // Returns the result.
}
```

#### 實作
假設資料庫在遠端我們可以依據 `Users` 實作
```dart
class ApiUsers extends Users {
  @override
  List<User> values() {
    // The fetching api here.
  }
}
```

同理，假設資料在本地的話呢?

```dart
class LocalUsers extends Users {
  @override
  List<User> values() {
    // The gathering local data here.
  }
}
```

使用時會是長這個樣子
```dart
  Users users = ApiUsers(); // or LocalUsers
  users.values();
```
目前為止，一件事情就新增一個類別，似乎有點囉唆了？讓我們看下去...


----
#### 新需求！

接著，隨著時間推移，需求也跟著增加/修改了
假如根據需求，我需要將這個拿出來的 `User` 物件作過濾，我們可以新增 `FilteredUsers` 類別

```dart
class FilteredUsers extends Users {
  final Users original; // Depend on User abstract object. (Decorator)

  FilteredUsers(this.original);

  @override
  List<User> values() {
    // gather the original values and do the filter.
    return original.values().where((element) => true).toList();
  }
}
```

現在的使用的部分呢？

```dart
  Users getUsers = FilteredUsers(ApiGetUsers()); // Add FilteredUsers
  getUsers.values();
```
其實挺直覺，對嗎？ 增加功能時，我們除了為了新功能新增類別外，也只是增加引用端的建構子呼叫而已。


#### 這樣有符合SOLID嗎？

- 單一職責 => 每個類別都如同命名，只做一件事
- 開放封閉原則 => 新增功能時，寫好的類別不用改。
- 里氏替換原則 => 所有的類別都是依賴 `User` 介面，如 `FilteredUsers` 內的 original 變數是可以替換的。
- 介面隔離 => 因為每個類別都是實作 `User` 介面，有規範公開的接口為 `values` 方法
- 依賴反向 => 引用端依賴 `User`介面，而非依賴實作類別。 （除了建構式以外）


接下來呢？以下需求留給讀者們想想能不能用此方式實作
- 整合Api與本地的 `User` 來源
- 快取
