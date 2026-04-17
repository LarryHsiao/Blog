+++
date = "2023-11-02"
title = "Setting up a PostgreSQL database with a user"
slug = "setup-postgresql-quick-note"
[taxonomies]
tags=["postgresql"]
+++

> **Note:** This article was completed by AI (Claude Opus 4.7) from my initial notes and thoughts.

Quick notes on getting PostgreSQL running on a fresh machine — install, create a database, a user, and open up remote connections.

### Install

```bash
# Debian/Ubuntu
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@15
```

The service starts automatically. Installation also creates a `postgres` system user and a matching superuser role in the database.

### Create a database

```bash
sudo -u postgres psql
```

Then inside psql:

```sql
CREATE DATABASE mydb;
```

### Create a database user

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

If the user can't log in after creation, make sure the LOGIN privilege is set:

```sql
ALTER ROLE myuser WITH LOGIN;
```

Easy to miss, especially when users are created in bulk via scripts.

### Allow remote connections

PostgreSQL only listens on localhost by default. Two config files need editing.

**`postgresql.conf`** — listen on all interfaces (or a specific IP):

```
listen_addresses = '*'
```

**`pg_hba.conf`** — add an access rule:

```
# TYPE  DATABASE   USER      ADDRESS         METHOD
host    mydb       myuser    0.0.0.0/0       md5
```

`md5` means password authentication. `trust` works too for a trusted internal network, but keep it away from production.

Restart to apply:

```bash
sudo systemctl restart postgresql
```

### Verify

```bash
psql -h 127.0.0.1 -U myuser -d mydb
```

If it connects, you're done.
