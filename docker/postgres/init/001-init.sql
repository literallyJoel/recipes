-- Baseline DB objects for local development.
-- This is designed to be friendly to future local-first sync engines
-- that depend on logical replication.

CREATE ROLE replicator WITH LOGIN REPLICATION PASSWORD 'replicator';

CREATE TABLE IF NOT EXISTS recipes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Publication for row-level change streams used by sync services
-- (e.g. ElectricSQL/PowerSync-style architectures).
DROP PUBLICATION IF EXISTS app_publication;
CREATE PUBLICATION app_publication FOR ALL TABLES;
