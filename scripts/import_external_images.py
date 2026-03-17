#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent.parent
CANONICAL_IMAGE_DIR = ROOT / "assets" / "images" / "imported"
FLAT_DIR = ROOT / "github-flat"
FILE_SUFFIXES = {".html", ".js", ".css"}
SKIP_DIRS = {".git", ".venv", "tmp"}
URL_PATTERN = re.compile(r"https://images\.squarespace-cdn\.com[^\"' )>]+")


def iter_site_files() -> list[Path]:
    paths: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in FILE_SUFFIXES:
            continue
        rel = path.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        paths.append(path)
    return sorted(paths)


def sanitize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def build_filename(url: str) -> str:
    parsed = urlparse(url)
    parts = [unquote(part) for part in parsed.path.split("/") if part]
    basename = parts[-1] if parts else "image"
    decoded_path = Path(basename)
    stem = sanitize(decoded_path.stem or basename)[:42] or "image"
    token = sanitize(parts[-2] if len(parts) > 1 else "")[:22] or "asset"
    suffix = decoded_path.suffix.lower()
    if not suffix or len(suffix) > 6:
        suffix = ".jpg"
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:8]
    return f"sqs-{digest}-{token}-{stem}{suffix}"


def replacement_for(path: Path, filename: str) -> str:
    rel = path.relative_to(ROOT)
    if rel.parts[0] == "github-flat":
        return filename
    if rel.parts[0] == "assets":
        return f"assets/images/imported/{filename}"
    target = CANONICAL_IMAGE_DIR / filename
    return os.path.relpath(target, path.parent).replace(os.sep, "/")


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        return
    subprocess.run(
        ["curl", "-L", "--fail", "--max-time", "60", url, "-o", str(destination)],
        check=True,
        cwd=str(ROOT),
    )


def main() -> None:
    files = iter_site_files()
    url_map: dict[str, str] = {}

    for path in files:
        text = path.read_text()
        for url in URL_PATTERN.findall(text):
            url_map.setdefault(url, build_filename(url))

    if not url_map:
        print("No external Squarespace images found.")
        return

    for url, filename in sorted(url_map.items()):
        canonical_path = CANONICAL_IMAGE_DIR / filename
        flat_path = FLAT_DIR / filename
        download(url, canonical_path)
        shutil.copy2(canonical_path, flat_path)

    updated_count = 0
    for path in files:
        text = path.read_text()
        updated = text
        for url, filename in url_map.items():
            if url not in updated:
                continue
            updated = updated.replace(url, replacement_for(path, filename))
        if updated != text:
            path.write_text(updated)
            updated_count += 1

    print(f"Imported {len(url_map)} unique Squarespace images.")
    print(f"Updated {updated_count} files.")


if __name__ == "__main__":
    main()
