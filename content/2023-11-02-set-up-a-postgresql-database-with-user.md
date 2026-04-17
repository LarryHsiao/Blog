+++
date = "2023-11-02"
title = "設定 PostgreSQL 資料庫與使用者"
slug = "setup-postgresql-quick-note"
[taxonomies]
tags=["postgresql"]
+++

> **說明：** 本文由 AI（Claude Opus 4.7）根據我的初始筆記與想法完成。

一些快速筆記，記錄怎麼在新機器上把 PostgreSQL 設定起來，建立資料庫、使用者，並開放連線。

### 安裝

```bash
# Debian/Ubuntu
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@15
```

安裝完服務就會自動啟動，預設會建立一個 `postgres` 的系統使用者與同名的資料庫超級使用者。

### 建立資料庫

```bash
sudo -u postgres psql
```

進入 psql 後：

```sql
CREATE DATABASE mydb;
```

### 建立資料庫使用者

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

如果使用者建立後無法登入，記得確認 LOGIN 權限有開：

```sql
ALTER ROLE myuser WITH LOGIN;
```

這步容易被忽略，尤其是用腳本批次建立使用者時。

### 開放外部連線

PostgreSQL 預設只接受本機連線，要讓外部能連進來需要改兩個設定檔。

**`postgresql.conf`** — 讓 PostgreSQL 監聽所有介面（或指定 IP）：

```
listen_addresses = '*'
```

**`pg_hba.conf`** — 新增允許連線的規則：

```
# TYPE  DATABASE   USER      ADDRESS         METHOD
host    mydb       myuser    0.0.0.0/0       md5
```

`md5` 代表用密碼驗證。如果是在可信任的內網環境，也可以用 `trust`，但正式環境不建議。

改完之後重啟服務讓設定生效：

```bash
sudo systemctl restart postgresql
```

### 確認連線

```bash
psql -h 127.0.0.1 -U myuser -d mydb
```

能連進去就完成了。
