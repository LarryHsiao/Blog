+++
date = "2024-04-06"
title = "Flutter清單內實做懸浮視窗"
slug = "implement-context-menu-in-a-flutter-app-list"
[taxonomies]
tags=["Flutter"]
+++

這邊分享我在實做長按清單顯示懸浮popup window的作法。

這邊會使用`CompositedTransformFollower`、`CompositedTransformTarget`以及`LayerLink`加上`OverlayEntry`來達到此目標。

首先，我們在建構清單時，使用多個`LayerLink`將context menu與清單項目的widget做關聯
以下是當我們在建構清單項目的程式碼

```dart
  Widget _buildClickableItem(BuildContext context, Item item) {
    final layerLink = LayerLink(); // 每一個Item都要建構一個LayerLink
    return GestureDetector(
      onLongPress: () => _openContextMenu(context, item, layerLink),
      child: CompositedTransformTarget( // 使用target物件來指定context window要追隨的widget 
        link: layerLink, 
        child: _childWidgets(item),
      ),
    );
  }
```

接著看一下context menu的部分(注意LayerLink的部分)
```dart
void _openContextMenu(BuildContext context, Item item, Layerlink layerLink) {
    if (_overlayEntry != null) {
      return;
    }
    final overlayEntry = OverlayEntry(builder: (context) {
      return CompositedTransformFollower( // 使用follower物件來指定要移動的Widget
        link: layerLink, // 與target傳入的LayerLink為同一實例，此部分很重要
        child: TapRegion( // TapRegion用於點擊context menu以外的位置時關閉context menu
          onTapOutside: (_) {
            _overlayEntry?.remove();
            _overlayEntry = null;
          },
          child: _buildContextMenu(context, item),
        ),
      );
    });
    Overlay.of(context).insert(overlayEntry);
    _overlayEntry = overlayEntry; // 使用這個property reference以利未來將其移除(如: onDispose())
}

```

##### 整理一下幾個重點

1. 一個項目建構一個`LayerLink`
0. 清單項目widget包一層`CompositedTransformTarget`並且傳入`LayerLink`
0. 建構context menu時(Overlay)，包一層`CompositedTransformFollower`並且傳入`LayerLink`

以上是我對於實作清單用的context menu的分享。
