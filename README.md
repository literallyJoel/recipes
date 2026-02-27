# jvrecipes

## Local Docker Dev Stack

This repository includes a local development Docker stack with:

- `web`: Vite + React frontend (`http://localhost:5173`)
- `backend`: Bun API (`http://localhost:3001`)
- `postgres`: Postgres 16 (`localhost:5432`)

### Start

```bash
bun run docker:up
```

### Stop

```bash
bun run docker:down
```

### Logs

```bash
bun run docker:logs
```

## Backend Migrations

`@literallyjoel/migrations` is configured in:

- `apps/backend/migrations.config.ts`
- `apps/backend/migrations/`
- `apps/backend/rollbacks/`

Create/update `apps/backend/.env` for host-local backend commands.

Docker compose loads `apps/backend/.env` for backend secrets and overrides
container-specific connection settings internally.

Run migration commands:

```bash
bun run --cwd apps/backend db:migrate:create --table=recipes
bun run --cwd apps/backend db:migrate:apply
bun run --cwd apps/backend db:migrate:rollback
```

The Docker backend service also runs `db:migrate:apply` automatically at startup.

## Postgres Defaults

Connection string from containers:

```text
postgres://app:app@postgres:5432/jvrecipes
```

Connection string from host:

```text
postgres://app:app@localhost:5432/jvrecipes
```

## Sync-Engine Readiness (Local-First)

The stack is configured so you can add a sync engine later without reworking the DB layer:

- `wal_level=logical`
- `max_replication_slots=10`
- `max_wal_senders=10`
- replication role created: `replicator`
- publication created: `app_publication` (`FOR ALL TABLES`)

Initialization SQL lives in `docker/postgres/init/001-init.sql`.
