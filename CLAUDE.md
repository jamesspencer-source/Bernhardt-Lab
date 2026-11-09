# CLAUDE.md

Claude Code loads this file automatically. The repository's operating manual for any assistant or engineer is `AGENTS.md`, imported below so Claude Code follows exactly the same rules. Read `README.md` and `docs/site-maintenance.md` for depth.

@AGENTS.md

## Claude Code notes

Where `AGENTS.md` or `README.md` says "Codex", read it as any coding assistant. Nothing in those rules is specific to Codex.

### Build and publish gotchas

- `scripts/build_site.py` takes no arguments. Any invocation, including `--help`, runs a full in-place build. For an isolated check use `python3 scripts/publish_site.py --dry-run --include <source-file>`.
- The publisher refuses to run while any untracked or modified file exists in the checkout, so commit or clear stray files first.
- Files named like `tokens 2.css` or `hms-quad 3.jpg` under `github-flat/` are Finder or iCloud conflict copies of generated output. They are junk: never commit them, and clear them before publishing. They appeared while the checkout lived in the iCloud-synced Documents folder; the repos moved to ~/Developer/GitHub on 2026-11-09, so any new copies mean the folder is being synced again.
- Site content changes go through the publisher. Anything else (workflows, docs, dependencies, this file) goes through a pull request so the `site-quality` check runs before merge.

### Local toolchain (James's Mac, checked 2026-11-09)

- Python: the system `python3` is 3.9; CI uses 3.11. Scripts must stay compatible with both. The full build is reproducible under 3.9.
- Node: the nvm default is 20. The browser gate expects Node 24: `~/.nvm/versions/node/v24.14.1/bin/node`, passed as `NODE_BINARY`.
- Playwright 1.62.1 and its Chromium are not installed for this repo. Follow the one-time setup in `docs/site-maintenance.md` before any publish, because the publisher stops without the browser gate.
- The `gh` CLI is not installed yet. Until it is, pull requests and Actions are handled in the GitHub web UI.

### Repository state worth knowing

- `main` has no branch protection or ruleset as of 2026-11-09, although `docs/site-maintenance.md` describes one. The publisher's wait for `site-quality` is the only gate.
- Branch names: `claude/<topic>` for Claude Code work. `release/site-*` branches are created by the publisher and are safe to delete once merged. `codex/*` branches are historical Codex work.
- Sibling folders: `Bernhardt-Lab-game-next` is a linked worktree on `codex/envelope-platformer-next`; `Bernhardt-Lab-review-fixes` is a stale clone. Work in this checkout.
- A stash labelled "PRIVATE ARCHIVE" holds pre-September-2026 generated pages. Leave it alone unless James asks.
