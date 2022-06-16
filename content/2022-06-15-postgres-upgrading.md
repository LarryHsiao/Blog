+++
date = "2022-06-15"
title = "我的升級PostgreSQL的經驗(9.5升級到14)"
slug = "postgresql-upgrading"
+++
[![資料庫](https://images.pexels.com/photos/4508751/pexels-photo-4508751.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=630&amp;h=375&amp;dpr=1 "資料庫")](https://images.pexels.com/photos/4508751/pexels-photo-4508751.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1 "資料庫")

這幾天的Side Project開發時遇到了升級[PostgreSQL][1]的小障礙，我最後把它排除了。覺得很有成就感，在這邊分享一下我的解決歷程吧。

這個升級，似乎不是更新執行檔就可以了，有時候會遇到如我現在遇到的問題一樣，我們沒辦法自動轉移到新版本上，必須使用PostgreSQL提供的工具去做升級與轉換。以下是我的工作流程。

首先使用 `pg_lsclusters` 指令看看現在有哪些資料庫正在使用

```bash
~$ pg_lsclusters
ver Cluster Port Status Owner    Data directory               Log file
9.5 main    5433 online postgres /var/lib/postgresql/9.5/main /var/log/postgresql/postgresql-9.5-main.log
14  main    5432 down   postgres /var/lib/postgresql/14/main  /var/log/postgresql/postgresql-14-main.log

```

這是目前的狀態，目前有兩台Server在這台電腦上，運行中的是版本9.5的資料庫，名稱為main。
14版的因為我想裡面也沒有我最近的資料，於是我就下`pg_dropcluster`來移除我不需要的資料庫。

```bash
~$ sudo services postgresql stop # 先把資料庫停機了
~$ pg_ctlcluster 9.5 main stop # 用這個指令停機也行，要先登入有權限的使用者。
~$ pg_dropcluster 14 main # 將資料庫移除
```

再看一次剩下那些機器`pg_lsclusters`

```bash
~$ pg_lsclusters
ver Cluster Port Status Owner    Data directory               Log file
9.5 main    5433 down   postgres /var/lib/postgresql/9.5/main /var/log/postgresql/postgresql-9.5-main.log
```

我們來升級吧，使用`pg_upgradecluster`

```bash
~$ pg_upgradecluster 9.5 main
```
等他跑完就行了。

## 升級失敗的情況

咦?有這麼簡單嗎?
其實我升級時遇到了extension的問題，因為沒有安裝相對應的extension在新版的資料庫沒辦法啟動。不過還好的是，因為我已經不需要使用那些extension了，所以我只需要把他們移除後，再操作升級即可。

首先因為失敗，我使用一次`pg_dropcluster`移除剛剛升級失敗的資料庫吧

```bash
~$ pg_dropcluster 14 main
```

接著啟動原本的資料庫並且啟動`pg_ctlcluster 9.5 main start`

連線到資料庫後，先來看看我們有什麼extension吧
```sql
postgres=# select * FROM pg_extension;
  oid  |    extname    | extowner | extnamespace | extrelocatable | extversion | extconfig | extcondition
-------+---------------+----------+--------------+----------------+------------+-----------+--------------
 13717 | plpgsql       |       10 |           11 | f              | 1.0        |           |
 16394 | fuzzystrmatch |       10 |         2200 | t              | 1.1        |           |
 16399 | postgis       |       10 |         2200 | t              | 1.1        |           |
(2 rows)
```

操作移除extension:
```sql
DROP EXTENSION postgis; 
```

接著就可以斷開連線再嘗試一次了。


```bash
~$ pg_ctlcluster 9.5 main stop # 停機
~$ pg_upgradecluster 9.5 main # 升級
~$ pg_ctlcluster 14 main start # 啟動
~$ pg_dropcluster 9.5 main # 確認無誤後移除舊資料庫吧
```

## 結語

以上是我的升級PostgreSQL資料庫的歷程，途中沒有確切的說明下完成升級，真是小有成就感呢。


[1]: https://zh.wikipedia.org/wiki/PostgreSQL
