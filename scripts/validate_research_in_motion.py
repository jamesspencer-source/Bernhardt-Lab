#!/usr/bin/env python3
"""Validate strict Research in Motion manifests for both builds."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFESTS = [
    ROOT / "assets" / "data" / "research-in-motion.json",
    ROOT / "github-flat" / "assets" / "data" / "research-in-motion.json",
]

BLOCKED_ARTICLE_HOST_RE = re.compile(r"pubmed\.ncbi\.nlm\.nih\.gov|biorxiv\.org|medrxiv\.org", re.IGNORECASE)

REQUIRED_FIELDS = (
    "pmid",
    "title",
    "journal",
    "year",
    "articleUrl",
    "image",
    "caption",
    "sourceLabel",
    "correspondingVerified",
    "correspondingEvidence",
    "figureSource",
)


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def normalize_doi(value: str) -> str:
    return clean_text(value).lower()


def item_id(item: Dict) -> str:
    doi = normalize_doi(item.get("doi", ""))
    pmid = clean_text(item.get("pmid", ""))
    if doi:
        return f"doi:{doi}"
    if pmid:
        return f"pmid:{pmid}"
    return ""


def validate_manifest(path: Path, min_preferred: int, max_count: int) -> List[str]:
    errors: List[str] = []
    if not path.exists():
        return [f"{path}: manifest missing"]

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return [f"{path}: invalid JSON ({exc})"]

    items = payload.get("items")
    if not isinstance(items, list):
        return [f"{path}: `items` must be a list"]

    count = len(items)
    if count == 0:
        errors.append(f"{path}: `items` is empty")
    if count > max_count:
        errors.append(f"{path}: item count {count} exceeds max {max_count}")
    if 0 < count < min_preferred and not clean_text(payload.get("underfilledReason", "")):
        errors.append(
            f"{path}: item count {count} below preferred minimum {min_preferred} but `underfilledReason` is missing"
        )

    seen = set()
    for index, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            errors.append(f"{path}: item {index} is not an object")
            continue

        missing = [field for field in REQUIRED_FIELDS if not clean_text(item.get(field, "")) and field != "correspondingVerified"]
        if missing:
            errors.append(f"{path}: item {index} missing fields: {', '.join(missing)}")

        if item.get("correspondingVerified") is not True:
            errors.append(f"{path}: item {index} has correspondingVerified != true")

        article_url = clean_text(item.get("articleUrl", ""))
        if BLOCKED_ARTICLE_HOST_RE.search(article_url):
            errors.append(f"{path}: item {index} has blocked article host ({article_url})")

        current_id = item_id(item)
        if not current_id:
            errors.append(f"{path}: item {index} missing DOI/PMID identifier")
        elif current_id in seen:
            errors.append(f"{path}: duplicate paper id `{current_id}`")
        else:
            seen.add(current_id)

    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate Research in Motion manifests.")
    parser.add_argument("--manifest", action="append", default=[], help="Optional manifest path(s) to validate")
    parser.add_argument("--min-preferred", type=int, default=9, help="Preferred minimum tile count")
    parser.add_argument("--max-count", type=int, default=12, help="Maximum allowed tile count")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    manifest_paths = [Path(p).resolve() for p in args.manifest] if args.manifest else DEFAULT_MANIFESTS

    all_errors: List[str] = []
    for manifest_path in manifest_paths:
        all_errors.extend(validate_manifest(manifest_path, args.min_preferred, args.max_count))

    if all_errors:
        for error in all_errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("Research in Motion manifests validated successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
