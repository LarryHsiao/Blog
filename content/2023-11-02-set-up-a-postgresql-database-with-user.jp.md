+++
date = "2023-11-02"
title = "PostgreSQL のデータベースとユーザーを設定する"
slug = "setup-postgresql-quick-note"
[taxonomies]
tags=["postgresql"]
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Opus 4.7）が仕上げたものです。

新しいマシンで PostgreSQL をセットアップする手順のメモ。インストール、データベース作成、ユーザー作成、外部接続の開放まで。

### インストール

```bash
# Debian/Ubuntu
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@15
```

インストール後はサービスが自動起動する。`postgres` というシステムユーザーと、同名のデータベーススーパーユーザーも作られる。

### データベースを作成する

```bash
sudo -u postgres psql
```

psql に入ったら：

```sql
CREATE DATABASE mydb;
```

### データベースユーザーを作成する

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

ユーザーを作成してもログインできない場合は、LOGIN 権限が付いているか確認する：

```sql
ALTER ROLE myuser WITH LOGIN;
```

スクリプトで一括作成するときに見落としやすいポイント。

### 外部接続を許可する

PostgreSQL はデフォルトでローカルホストのみ受け付ける。外部から接続するには設定ファイルを2つ変更する。

**`postgresql.conf`** — すべてのインターフェース（または特定 IP）でリッスンする：

```
listen_addresses = '*'
```

**`pg_hba.conf`** — アクセスルールを追加する：

```
# TYPE  DATABASE   USER      ADDRESS         METHOD
host    mydb       myuser    0.0.0.0/0       md5
```

`md5` はパスワード認証。信頼できる内部ネットワークなら `trust` でも動くが、本番環境には使わない。

設定を反映させるためにサービスを再起動：

```bash
sudo systemctl restart postgresql
```

### 接続確認

```bash
psql -h 127.0.0.1 -U myuser -d mydb
```

つながれば完了。
