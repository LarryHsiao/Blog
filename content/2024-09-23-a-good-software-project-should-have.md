+++
date = "2025-06-28"
title = "一個好的軟體專案該有的幾件事(Flutter)"
slug = "a-good-sotware-project-should-have-flutter"
[taxonomies]
tags = ["Softaware", "Flutter"]
+++

在日常開發中，我們常常著重於功能的完成與 UI 的華麗，但真正能走得長遠、方便維護與協作的軟體專案，往往在工程基礎上更下功夫。本文將以
Flutter 專案為例，介紹一個我認為好的軟體專案應該具備的幾個重要元素，幫助團隊打造高品質的程式碼基礎。

### 1. 清楚且一致的命名（Naming）

命名不只是「變數叫什麼」，而是團隊溝通與維護的基石。

- Widget 命名應對應其功能與用途，並且越短越好(能夠解釋職責為前提)，例如 `UserCard`、`LoginButton`
- 路徑與檔案結構應清楚反映功能模組
- 縮寫很好用，但使用時需要與團隊統一用法，或者儘量不用
- 其餘代碼風格可以套用一個社群熱門的版本即可，建議團隊都使用同一種

### 2. 靜態分析（Static Analyze）

使用 Dart 的靜態分析工具能夠在編譯前就發現潛在錯誤。

- 建立並啟用 `analysis_options.yaml`
- 使用套件如 [lint](https://pub.dev/packages/lint)、[very_good_analysis](https://pub.dev/packages/very_good_analysis)
- 整合到 CI 流程與 IDE 即時提示錯誤

### 3. 測試（Tests）

- 使用 `flutter test` 執行測試

```dart
test(
  'Counter increases', 
  () {
    final counter = Counter();
    counter.increment();
    expect(counter.value, 1);
  },
);
```

### 4. CI 自動化腳本（CI Script）

讓開發流程自動化，減少枯燥建置過程中的人為錯誤，也可以讓專案能夠有一個面板監控專案建置狀況與顯示代碼品質分析結果。

不過建置CI環境其實也還是需要花點時間調整，效益會在長期運作的專案中才會體現出來。

- 常見工具：GitHub Actions、GitLab CI、Bitrise、CircleCI
- 常見流程：Lint → Test → Coverage → Build → Deploy

### 5. 精美徽章與酷東西（Badges & Cool Stuff）

README 是專案的門面，加上一些徽章與工具可以提升專業感(工程師的自我滿足)：

- Coverage badge（如 Codecov、Coveralls）
- Build status badge（CI 成功與否）
- Pub version badge

### 總結

當然這些東西很重要，但更重要的是使用這些工具的'人'，要在建置/使用過程中多多停看聽，持續精進這些工具的使用，讓這些工具能持續對軟體專案有正向效益。