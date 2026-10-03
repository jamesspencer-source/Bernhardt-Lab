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
