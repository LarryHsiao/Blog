+++
date = "2022-06-15"
title = "我的升級PostgreSQL的經驗"
slug = "postgresql-upgrading"
draft = true
+++

這幾天我開始了另一個多半不會完成的SideProject，不過當我在使用社群版的Flyway時，我遇到了PostgreSQL版本過舊沒辦法使用Flyway的問題。除非我使用企業版以外，我必須升級我們的PostgreSQL資料庫。

不過這個升級，似乎不是更新執行檔就可以了，我們還必須使用PostgreSQL提供的工具去做升級與轉換。

