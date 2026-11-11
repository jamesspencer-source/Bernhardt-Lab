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

### Local toolchain (James's Mac, checked 2026-11-11)

- Python: the system `python3` is 3.9; CI uses 3.11. Scripts must stay compatible with both. The full build is reproducible under 3.9.
- Node: the nvm default is 20. The browser gate expects Node 24: `~/.nvm/versions/node/v24.14.1/bin/node`, passed as `NODE_BINARY`.
- Playwright 1.62.1 and its Chromium are installed for this repo (`node_modules/playwright`, browsers in `~/Library/Caches/ms-playwright`). The publisher stops without the browser gate, so if either goes missing, repeat the one-time setup in `docs/site-maintenance.md` before any publish.
- The `gh` CLI is installed (`~/.local/bin/gh`, 2.103.3) and logged in as `jamesspencer-source` over SSH. Its token has no `workflow` scope, so API calls that touch `.github/workflows` are refused. Use it to open pull requests and read checks. Merging is always James's click on GitHub.

### Repository state worth knowing

- `main` is protected by a repository ruleset created on 2026-11-09 ("Protect main: require site-quality, no force-push, no deletion"). It requires the `site-quality` check from GitHub Actions, blocks force-pushes and deletion, and has no bypass actors, as `docs/site-maintenance.md` describes.
- Branch names: `claude/<topic>` for Claude Code work. `release/site-*` branches are created by the publisher and are safe to delete once merged. `codex/*` branches are historical Codex work.
- Sibling folders: as of 2026-11-11 this checkout is the only copy of the repo in `~/Developer/GitHub`. The former `Bernhardt-Lab-game-next` worktree and `Bernhardt-Lab-review-fixes` clone are gone, and `codex/envelope-platformer-next` exists only on GitHub as an unmerged experiment. Work in this checkout.
- A stash labelled "PRIVATE ARCHIVE" holds pre-September-2026 generated pages. Leave it alone unless James asks.
