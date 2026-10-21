-- Additive migration. Keep historical scores unchanged and read-only.
CREATE TABLE IF NOT EXISTS leaderboard_runs (
  id TEXT PRIMARY KEY,
  board TEXT NOT NULL,
  species TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  submitted_at INTEGER,
  name TEXT,
  score INTEGER CHECK (score IS NULL OR score > 0),
  CHECK ((score IS NULL AND submitted_at IS NULL AND name IS NULL)
    OR (score IS NOT NULL AND submitted_at IS NOT NULL AND name IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_runs_board_rank ON leaderboard_runs(board, score DESC, submitted_at);
CREATE INDEX IF NOT EXISTS idx_runs_expiry ON leaderboard_runs(expires_at) WHERE score IS NULL;
CREATE INDEX IF NOT EXISTS idx_runs_submitted ON leaderboard_runs(submitted_at) WHERE score IS NOT NULL;

-- Private, short-lived keyed identifiers, never returned in scores.
CREATE TABLE IF NOT EXISTS leaderboard_run_clients (
  run_id TEXT PRIMARY KEY REFERENCES leaderboard_runs(id) ON DELETE CASCADE,
  client_key TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_run_clients_key ON leaderboard_run_clients(client_key);
CREATE TRIGGER IF NOT EXISTS release_completed_run_client
AFTER UPDATE OF score ON leaderboard_runs
WHEN NEW.score IS NOT NULL
BEGIN
  DELETE FROM leaderboard_run_clients WHERE run_id = NEW.id;
END;
