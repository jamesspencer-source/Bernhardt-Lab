CREATE TABLE IF NOT EXISTS leaderboard_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  species TEXT NOT NULL DEFAULT 'unknown',
  played_at INTEGER NOT NULL DEFAULT 0,
  board TEXT NOT NULL DEFAULT 'classic'
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_scores_rank
ON leaderboard_scores(board, score DESC, played_at ASC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_scores_species
ON leaderboard_scores(species);

CREATE INDEX IF NOT EXISTS idx_leaderboard_scores_board
ON leaderboard_scores(board);
