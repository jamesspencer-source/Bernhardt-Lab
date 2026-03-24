#!/usr/bin/env python3
"""Clean, build, commit, and push website updates to main."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MESSAGE = "site: publish website updates"
ALLOWED_ROOT_FILES = {
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "alumni.html",
    "index.html",
    "people.html",
}
STATIC_ALLOWED_DIRS = {
    ".github",
    "accessibility",
    "alumni",
    "alumni-profiles",
    "assets",
    "data",
    "docs",
    "github-flat",
    "leaderboard-worker",
    "people",
    "research-library",
    "scripts",
}
EXCLUDED_ROOT_DIRS = {".git", ".venv", ".pycache", "__pycache__", "tmp"}
TRANSIENT_DIR_NAMES = {".venv", ".pycache", "__pycache__", ".pytest_cache"}
TRANSIENT_FILE_NAMES = {".DS_Store", "Thumbs.db"}


def run_command(args: list[str], capture_output: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=capture_output,
    )


def git_output(*args: str) -> str:
    return run_command(["git", *args], capture_output=True).stdout.strip()


def print_step(message: str) -> None:
    print(f"[publish] {message}")


def discover_allowed_dirs() -> set[str]:
    allowed = set(STATIC_ALLOWED_DIRS)
    for child in ROOT.iterdir():
        if not child.is_dir():
            continue
        if child.name in EXCLUDED_ROOT_DIRS:
            continue
        if child.name.startswith(".") and child.name != ".github":
            continue
        if (child / "index.html").exists():
            allowed.add(child.name)
    return allowed


def is_transient_path(path_text: str) -> bool:
    path = PurePosixPath(path_text)
    parts = path.parts
    if any(part in TRANSIENT_DIR_NAMES for part in parts):
        return True
    name = parts[-1] if parts else path_text
    if name in TRANSIENT_FILE_NAMES or name.startswith("._"):
        return True
    if name.endswith((".pyc", ".pyo")):
        return True
    return False


def is_allowed_path(path_text: str, allowed_dirs: set[str]) -> bool:
    path = PurePosixPath(path_text)
    if not path.parts:
        return False
    if len(path.parts) == 1:
        return path.parts[0] in ALLOWED_ROOT_FILES
    return path.parts[0] in allowed_dirs


def parse_status_entries() -> list[tuple[str, str]]:
    raw = subprocess.run(
        ["git", "status", "--porcelain=v1", "--untracked-files=all", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    ).stdout.decode("utf-8", "surrogateescape")
    parts = raw.split("\0")
    entries: list[tuple[str, str]] = []
    index = 0
    while index < len(parts):
        item = parts[index]
        if not item:
            break
        status = item[:2]
        path_text = item[3:]
        entries.append((status, path_text))
        if "R" in status or "C" in status:
            index += 1
            if index < len(parts) and parts[index]:
                entries.append((status, parts[index]))
        index += 1
    return entries


def unexpected_changes(allowed_dirs: set[str]) -> list[str]:
    paths: set[str] = set()
    for _, path_text in parse_status_entries():
        if is_transient_path(path_text):
            continue
        if is_allowed_path(path_text, allowed_dirs):
            continue
        paths.add(path_text)
    return sorted(paths)


def cleanup_transient_worktree_artifacts() -> None:
    for pattern in (".DS_Store", "Thumbs.db", "._*"):
        for path in ROOT.rglob(pattern):
            if path.is_file():
                path.unlink()
    for dirname in (".pycache", "__pycache__", ".pytest_cache"):
        for path in ROOT.rglob(dirname):
            if path.is_dir():
                shutil.rmtree(path)


def ensure_main_branch() -> None:
    branch = git_output("rev-parse", "--abbrev-ref", "HEAD")
    if branch != "main":
        raise RuntimeError(f"Publish only runs from main. Current branch: {branch}")


def ensure_remote_is_safe() -> None:
    print_step("Fetching origin/main")
    run_command(["git", "fetch", "origin", "main"])
    counts = git_output("rev-list", "--left-right", "--count", "HEAD...origin/main")
    ahead, behind = [int(value) for value in counts.split()]
    if behind:
        raise RuntimeError("origin/main is ahead or diverged. Pull/reconcile before publishing.")
    if ahead:
        print_step(f"Local branch is already {ahead} commit(s) ahead of origin/main")


def stage_allowed_paths(allowed_dirs: set[str]) -> None:
    pathspecs = sorted(ALLOWED_ROOT_FILES) + [f"{name}/" for name in sorted(allowed_dirs)]
    run_command(["git", "add", "-A", "--", *pathspecs])


def build_site() -> None:
    print_step("Running site build")
    run_command([sys.executable, "scripts/build_site.py"])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--message", default=DEFAULT_MESSAGE, help="Commit message to use for the publish commit")
    args = parser.parse_args()

    if Path(git_output("rev-parse", "--show-toplevel")) != ROOT:
        raise RuntimeError("publish_site.py must run from the website repository root.")

    allowed_dirs = discover_allowed_dirs()

    ensure_main_branch()
    ensure_remote_is_safe()

    print_step("Removing transient local artifacts")
    cleanup_transient_worktree_artifacts()

    outside_scope = unexpected_changes(allowed_dirs)
    if outside_scope:
        raise RuntimeError(
            "Found changes outside the publish scope. Resolve or revert these before publishing:\n"
            + "\n".join(f"  - {path}" for path in outside_scope)
        )

    build_site()
    cleanup_transient_worktree_artifacts()

    outside_scope = unexpected_changes(allowed_dirs)
    if outside_scope:
        raise RuntimeError(
            "Build completed, but unexpected paths are still dirty:\n"
            + "\n".join(f"  - {path}" for path in outside_scope)
        )

    print_step("Staging website files")
    stage_allowed_paths(allowed_dirs)

    staged_diff = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=ROOT,
        check=False,
    )
    if staged_diff.returncode == 0:
        print_step("No meaningful website diff detected; nothing to commit.")
        return 0
    if staged_diff.returncode != 1:
        raise RuntimeError("Could not determine staged diff state.")

    print_step(f"Creating commit: {args.message}")
    run_command(["git", "commit", "-m", args.message])
    print_step("Pushing to origin main")
    run_command(["git", "push", "origin", "main"])
    print_step("Publish complete")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
