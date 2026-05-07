export const ENVELOPE_V3_BOARD_PREFIX = "bernhardt-envelope-escape-v3-board-";
export const ENVELOPE_V3_DEFAULT_BOARD = "classic";

export const ENVELOPE_V3_LEADERBOARD_CONTRACT = {
  urlSource: "window.ENVELOPE_LEADERBOARD_URL",
  refresh: "GET ${url}?board=${encodeURIComponent(board)}",
  submit: "POST JSON { name, score, species, playedAt, board }",
  modes: ["global", "fallback", "local"]
} as const;
