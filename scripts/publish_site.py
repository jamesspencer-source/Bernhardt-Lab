#!/usr/bin/env python3
"""Build selected source changes in isolation, then commit and publish their exact output."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT_FILES = {
    ".gitignore", "AGENTS.md", "README.md", "index.html",
}
SOURCE_DIRS = {
    ".github", "assets", "data", "docs", "scripts", "leaderboard-worker",
}
TEMPLATE_FILES = {
    "team/index.html", "alumni/index.html", "research/index.html",
    "accessibility/index.html",
}
GENERATED_ASSETS = {
    "assets/styles.css", "assets/profile.css", "assets/alumni.css",
    "assets/envelope-escape-config.js",
    "assets/data/featured-alumni.json",
}
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".pycache", ".venv", "output"}


def git_output(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def status_paths() -> set[str]:
    raw = subprocess.check_output(
        ["git", "status", "--porcelain=v1", "--untracked-files=all", "-z"], cwd=ROOT
    ).decode("utf-8", "surrogateescape").split("\0")
    paths = set()
    index = 0
    while index < len(raw) and raw[index]:
        item = raw[index]
        paths.add(item[3:])
        if "R" in item[:2] or "C" in item[:2]:
            index += 1
            if index < len(raw) and raw[index]:
                paths.add(raw[index])
        index += 1
    return paths


def fingerprint(path: Path) -> tuple[str, int] | None:
    if not path.exists():
        return None
    if path.is_symlink() or not path.is_file():
        raise RuntimeError(f"Expected a regular file, not a directory or symlink: {path}")
    return hashlib.sha256(path.read_bytes()).hexdigest(), path.stat().st_mode & 0o111


def tree_state(root: Path) -> dict[str, tuple[str, int]]:
    return {
        path.relative_to(root).as_posix(): fingerprint(path)
        for path in root.rglob("*")
        if path.is_file() and not (set(path.relative_to(root).parts) & SKIP_DIRS)
    }


def validate_selection(paths: list[str]) -> list[str]:
    result = []
    tracked = set(subprocess.check_output(
        ["git", "ls-files", "-z"], cwd=ROOT
    ).decode("utf-8", "surrogateescape").split("\0"))
    for value in paths:
        path = PurePosixPath(value)
        if path.is_absolute() or ".." in path.parts or value != path.as_posix():
            raise RuntimeError(f"Use an exact repository-relative file path: {value}")
        allowed = value in SOURCE_ROOT_FILES or value in TEMPLATE_FILES
        allowed = allowed or (len(path.parts) > 1 and path.parts[0] in SOURCE_DIRS)
        if not allowed or value in GENERATED_ASSETS:
            raise RuntimeError(f"Select canonical source files, not generated or private output: {value}")
        target = ROOT / value
        if not target.resolve().is_relative_to(ROOT.resolve()):
            raise RuntimeError(f"Source path escapes the repository: {value}")
        if target.is_dir() or target.is_symlink():
            raise RuntimeError(f"Select a regular file, not a directory or symlink: {value}")
        if not target.exists() and value not in tracked:
            raise RuntimeError(f"Source file does not exist: {value}")
        if value not in result:
            result.append(value)
    return sorted(result)


def extract_head(destination: Path) -> None:
    # Never build in the operator's mixed working copy.
    with tempfile.TemporaryFile() as archive:
        subprocess.run(["git", "archive", "HEAD"], cwd=ROOT, stdout=archive, check=True)
        archive.seek(0)
        with tarfile.open(fileobj=archive) as tree:
            for member in tree:
                target = destination / member.name
                if not target.resolve().is_relative_to(destination.resolve()):
                    raise RuntimeError("Archive contains an unsafe path")
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                elif member.isfile():
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with tree.extractfile(member) as source, target.open("wb") as output:
                        shutil.copyfileobj(source, output)
                    target.chmod(member.mode)
                else:
                    raise RuntimeError(f"Unsupported archive entry: {member.name}")


def prepare_plan(destination: Path, selected: list[str]) -> dict[str, tuple[str, int] | None]:
    extract_head(destination)
    before = tree_state(destination)
    for name in selected:
        source, target = ROOT / name, destination / name
        if source.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
        else:
            target.unlink(missing_ok=True)
    subprocess.run([sys.executable, "-B", "scripts/build_site.py"], cwd=destination, check=True)
    after = tree_state(destination)
    plan = {
        name: after.get(name)
        for name in sorted(before.keys() | after.keys())
        if before.get(name) != after.get(name)
    }
    for name, value in plan.items():
        if value is None and name not in selected and re.search(r" \d+(?:\.[^.]+)?$", Path(name).name):
            raise RuntimeError(f"Build would delete an unselected numbered file: {name}. Review it separately.")
    return plan


def assert_scope(plan: dict[str, tuple[str, int] | None], selected: list[str]) -> None:
    unrelated = []
    for name in sorted(status_paths()):
        if name in selected:
            continue
        # Prebuilt output is accepted only when it exactly matches the isolated build.
        if name in plan and fingerprint(ROOT / name) == plan[name]:
            continue
        unrelated.append(name)
    if unrelated:
        raise RuntimeError(
            "Unrelated or non-reproducible changes are present; nothing was deleted or staged. "
            "Use a clean review checkout or explicitly select the intended source files:\n  "
            + "\n  ".join(unrelated)
        )


def install_plan(destination: Path, plan: dict[str, tuple[str, int] | None]) -> None:
    for name, expected in plan.items():
        target = ROOT / name
        if expected is None:
            target.unlink(missing_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination / name, target)
    for name, expected in plan.items():
        if fingerprint(ROOT / name) != expected:
            raise RuntimeError(f"Published output changed unexpectedly: {name}")


def ensure_remote_is_safe() -> None:
    if git_output("branch", "--show-current") != "main":
        raise RuntimeError("Publishing runs from main; dry-run may be used on a review branch.")
    subprocess.run(["git", "fetch", "origin", "main"], cwd=ROOT, check=True)
    ahead, behind = map(int, git_output("rev-list", "--left-right", "--count", "HEAD...origin/main").split())
    if ahead or behind:
        raise RuntimeError(
            f"Local main is {ahead} ahead / {behind} behind origin/main. "
            "Reconcile and review those commits before publishing this change."
        )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--include", nargs="+", default=[], metavar="SOURCE_FILE")
    parser.add_argument("--manifest", type=Path, help="JSON array of exact source file paths")
    parser.add_argument("--dry-run", action="store_true", help="Build a temporary copy; leave files and Git state untouched")
    parser.add_argument("--message", default="site: publish reviewed website updates")
    args = parser.parse_args(argv)

    if Path(git_output("rev-parse", "--show-toplevel")).resolve() != ROOT.resolve():
        raise RuntimeError("Run the publisher from its repository checkout.")
    paths = list(args.include)
    if args.manifest:
        manifest = json.loads(args.manifest.read_text())
        if not isinstance(manifest, list) or any(not isinstance(item, str) for item in manifest):
            raise RuntimeError("Manifest must be a JSON array of file paths.")
        paths.extend(manifest)
    if not paths:
        print("No files selected. Use --include SOURCE_FILE [...] or --manifest FILE.json.")
        print("Start with --dry-run to review the exact build output. Nothing has changed.")
        return 2
    selected = validate_selection(paths)
    if not args.dry_run:
        ensure_remote_is_safe()
    head = git_output("rev-parse", "HEAD")
    selected_state = {name: fingerprint(ROOT / name) for name in selected}
    with tempfile.TemporaryDirectory(prefix="bernhardt-publish-") as directory:
        destination = Path(directory)
        plan = prepare_plan(destination, selected)
        if git_output("rev-parse", "HEAD") != head or any(
            fingerprint(ROOT / name) != value for name, value in selected_state.items()
        ):
            raise RuntimeError("Source or HEAD changed during validation; retry after reviewing the changes.")
        assert_scope(plan, selected)
        print("[publish] Selected source files:")
        for name in selected:
            print(f"  {name}")
        print(f"[publish] Exact output plan: {len(plan)} files")
        for name, value in plan.items():
            print(f"  {'delete' if value is None else 'write '} {name}")
        if args.dry_run:
            print("[publish] Dry-run passed. No working files, index, commits, or remote refs changed.")
            return 0
        if not plan:
            print("[publish] No website changes to publish.")
            return 0
        install_plan(destination, plan)
        subprocess.run(["git", "add", "-A", "--", *plan.keys()], cwd=ROOT, check=True)
        staged = set(subprocess.check_output(
            ["git", "diff", "--cached", "--name-only", "-z"], cwd=ROOT
        ).decode("utf-8", "surrogateescape").split("\0")) - {""}
        if staged != set(plan):
            raise RuntimeError("The staged file list does not match the reviewed output plan; commit aborted.")
        subprocess.run(["git", "diff", "--cached", "--check"], cwd=ROOT, check=True)
        subprocess.run(["git", "commit", "-m", args.message], cwd=ROOT, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=True)
        print("[publish] Pushed reviewed changes. Verify GitHub Pages and the live URLs before declaring them live.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
