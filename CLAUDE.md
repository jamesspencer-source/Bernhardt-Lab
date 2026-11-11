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

### Local toolchain (check at the start of a job; do not record the results here)

This section states what the project needs, not what one computer has installed, so it stays true when a tool is added or removed. Verify each item before a job that depends on it, and tell James if one is missing.

- Python: CI uses 3.11 and the macOS system `python3` is 3.9. Scripts must stay compatible with both, and the full build is reproducible under 3.9. Check: `python3 --version`.
- Node: the browser gate expects Node 24, passed as `NODE_BINARY`. The shell default may be older. Check: `node --version`, then `ls ~/.nvm/versions/node/` to find a Node 24 binary.
- Playwright 1.62.1 and its Chromium must be installed for this repo before any publish, because the publisher stops without the browser gate. Check: `grep '"version"' node_modules/playwright/package.json` and `ls ~/Library/Caches/ms-playwright`. If either is missing, repeat the one-time setup in `docs/site-maintenance.md`.
- The `gh` CLI opens pull requests and reads checks. Check: `gh auth status`. A token without the `workflow` scope is refused on API calls that touch `.github/workflows`. If `gh` is unavailable, pull requests and Actions are handled in the GitHub web UI. Merging is always James's click on GitHub.

### Repository state worth knowing

- `main` should be protected by the ruleset `docs/site-maintenance.md` describes: `site-quality` required, no force-pushes, no deletion, no bypass actors. Check: `gh api repos/{owner}/{repo}/rulesets`. If it is missing or inactive, tell James before publishing.
- Branch names: `claude/<topic>` for Claude Code work. `release/site-*` branches are created by the publisher and are safe to delete once merged. `codex/*` branches are historical Codex work.
- Sibling folders: work in this checkout only. Check: `git worktree list` should show a single entry. Treat any other copy of this repo beside it as stale and do not work there. `codex/envelope-platformer-next` on GitHub is an unmerged experiment.
- A stash labelled "PRIVATE ARCHIVE" holds pre-September-2026 generated pages. Leave it alone unless James asks.
